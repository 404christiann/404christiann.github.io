'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import ContactScene from './ContactScene'
import AboutPage from './sections/AboutPage'

// ─── Blob palette + motion definitions ───────────────────────────────────────
interface BlobDef {
  id: string
  label: string
  c1: string; c2: string; c3: string; c4: string
  orbCol: string
  flashColor: string   // used for the portal-entry overlay
  rotY: number; rotX: number
  bobSpeed: number; bobAmp: number
  timeOffset: number
  amp: number
}

const BLOB_DEFS: BlobDef[] = [
  {
    id: 'about', label: 'About',
    c1: '#e8105a', c2: '#ff7700', c3: '#8810f0', c4: '#ff88ee',
    orbCol: '#ff1166',
    flashColor: '#c0004a',
    rotY: 0.06, rotX: 0.022,
    bobSpeed: 0.35, bobAmp: 0.06, timeOffset: 0.0, amp: 0.55,
  },
  {
    id: 'projects', label: 'Projects',
    c1: '#2255ee', c2: '#9966ff', c3: '#00ccee', c4: '#ddeeff',
    orbCol: '#5577ff',
    flashColor: '#1133bb',
    rotY: -0.04, rotX: 0.015,
    bobSpeed: 0.28, bobAmp: 0.05, timeOffset: 1.9, amp: 0.48,
  },
  {
    id: 'contact', label: 'Contact',
    c1: '#cc1100', c2: '#ff5500', c3: '#ffaa33', c4: '#ffe0aa',
    orbCol: '#ff3300',
    flashColor: '#991100',
    rotY: 0.05, rotX: -0.025,
    bobSpeed: 0.50, bobAmp: 0.04, timeOffset: 3.6, amp: 0.42,
  },
]

// Resting blob radius — compact, elegant on the homepage
const BLOB_RADIUS = 0.80
const FOV_BASE    = 50
const CAM_Z       = 9

// ─── Layout calculator ────────────────────────────────────────────────────────
function calcLayout(W: number, H: number) {
  const halfH    = CAM_Z * Math.tan((FOV_BASE / 2) * (Math.PI / 180))
  const aspect   = W / H
  const portrait = aspect < 0.85

  if (portrait) {
    const gap = Math.min(2.1, halfH * 0.56)
    return {
      positions: [
        new THREE.Vector3(0,  gap, 0),
        new THREE.Vector3(0,  0,   0),
        new THREE.Vector3(0, -gap, 0),
      ] as THREE.Vector3[],
      camZ: CAM_Z, portrait: true,
    }
  }

  const halfW   = halfH * aspect
  const spacing = Math.min(2.4, halfW * 0.34)
  return {
    positions: [
      new THREE.Vector3(-spacing, 0, 0),
      new THREE.Vector3(0,        0, 0),
      new THREE.Vector3( spacing, 0, 0),
    ] as THREE.Vector3[],
    camZ: CAM_Z, portrait: false,
  }
}

// ─── Organic FBM ─────────────────────────────────────────────────────────────
function fbm(x: number, y: number, z: number, t: number): number {
  const s = t * 0.18
  return (
    Math.sin(x       + y * 0.50 + z * 0.30 + s             ) * 0.48 +
    Math.sin(y * 2.0 + z * 0.80 + x * 0.25 + s * 1.50 + 1.2) * 0.28 +
    Math.sin(z * 3.5 + x * 1.20 + y * 0.60 + s * 2.20 + 2.7) * 0.16 +
    Math.sin(x * 7.0 + y * 2.40 + z * 1.50 + s * 3.10 + 4.1) * 0.08
  )
}

// ─── GLSL shaders ────────────────────────────────────────────────────────────
const VERT = /* glsl */`
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  void main() {
    vec4 wp     = modelMatrix * vec4(position, 1.0);
    vWorldPos    = wp.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position  = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const FRAG = /* glsl */`
  uniform float uTime;
  uniform vec3  uC1, uC2, uC3, uC4;
  uniform vec3  uKeyPos;
  uniform vec3  uFillPos;
  uniform vec3  uOrbPos;
  uniform vec3  uOrbCol;

  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(cameraPosition - vWorldPos);

    float NdV     = max(0.0, dot(N, V));
    float fresnel = pow(1.0 - NdV, 3.2);

    float h  = N.y * 0.5 + 0.5;
    float t1 = sin(uTime * 0.17 + vWorldPos.x * 1.10 + vWorldPos.z * 0.70) * 0.5 + 0.5;
    float t2 = cos(uTime * 0.13 + vWorldPos.y * 0.90 + vWorldPos.x * 0.50) * 0.5 + 0.5;

    vec3 col = mix(uC1, uC2, h);
    col = mix(col, uC3, t1 * 0.55);
    col = mix(col, uC4, t2 * 0.30);

    vec3 L1  = normalize(uKeyPos  - vWorldPos);
    float d1 = max(0.0, dot(N, L1));
    vec3  H1 = normalize(L1 + V);
    float s1 = pow(max(0.0, dot(N, H1)), 90.0);

    vec3 L2  = normalize(uFillPos - vWorldPos);
    float d2 = max(0.0, dot(N, L2));
    vec3  H2 = normalize(L2 + V);
    float s2 = pow(max(0.0, dot(N, H2)), 40.0);

    vec3 L3  = normalize(uOrbPos - vWorldPos);
    float d3 = max(0.0, dot(N, L3));

    vec3 ambient  = col * 0.24;
    vec3 diffuse  = col * (d1 * 1.05 + d2 * 0.35 + d3 * 0.40);
    vec3 specular = vec3(1.0) * (s1 * 1.8 + s2 * 0.55);
    vec3 orbDiff  = uOrbCol * d3 * 0.38;
    vec3 rim      = uC4 * fresnel * 2.5;

    gl_FragColor = vec4(ambient + diffuse + specular + orbDiff + rim, 1.0);
  }
`

// ─── Blob runtime state ───────────────────────────────────────────────────────
type BlobState = {
  mesh:    THREE.Mesh
  mat:     THREE.ShaderMaterial
  geo:     THREE.BufferGeometry
  origPos: Float32Array
  def:     BlobDef
  basePos: THREE.Vector3
}

// ─── Transition helpers ───────────────────────────────────────────────────────
type Phase = 'idle' | 'expanding' | 'open' | 'collapsing'

function ss(x: number): number {
  const c = Math.max(0, Math.min(1, x))
  return c * c * (3 - 2 * c)
}

function easeInOutCubic(x: number): number {
  const c = Math.max(0, Math.min(1, x))
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2
}

// ─── Label position type ─────────────────────────────────────────────────────
interface LabelStyle {
  left: string
  top: string
  transform: string
  textAlign: 'left' | 'center'
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function BlobNav() {
  const mountRef        = useRef<HTMLDivElement>(null)
  const flashRef        = useRef<HTMLDivElement>(null)   // blob-colored portal overlay
  const aboutScrollRef  = useRef<HTMLDivElement>(null)   // scroll container for About page

  const [active,   setActive]   = useState<string | null>(null)
  const [visible,  setVisible]  = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [labelPos, setLabelPos] = useState<LabelStyle[]>([])

  const txRef = useRef<{
    phase:         Phase
    activeIdx:     number
    activeId:      string
    expandStart:   number
    collapseStart: number
    flashColor:    string
  }>({ phase: 'idle', activeIdx: -1, activeId: '', expandStart: 0, collapseStart: 0, flashColor: '#000' })

  const clockRef    = useRef(0)
  const revealedRef = useRef(false)
  const hoveredIdRef = useRef<string | null>(null)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    hoveredIdRef.current = hoveredId
  }, [hoveredId])

  const openBlobByIndex = useCallback((bi: number) => {
    if (txRef.current.phase !== 'idle') return
    const def = BLOB_DEFS[bi]
    if (!def) return

    txRef.current = {
      phase:         'expanding',
      activeIdx:     bi,
      activeId:      def.id,
      expandStart:   clockRef.current,
      collapseStart: 0,
      flashColor:    def.flashColor,
    }
    revealedRef.current = false
    setHoveredId(null)
    setActive(def.id)
    setVisible(false)
  }, [])

  const closeSection = () => {
    if (txRef.current.phase === 'collapsing' || txRef.current.phase === 'idle') return
    setVisible(false)
    revealedRef.current = false
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    // Wait for the content overlay to finish fading (0.45s) before the blob
    // starts retreating — prevents the two animations from racing each other
    closeTimeoutRef.current = setTimeout(() => {
      txRef.current.phase         = 'collapsing'
      txRef.current.collapseStart = clockRef.current
      closeTimeoutRef.current = null
    }, 420)
  }

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let W = mount.clientWidth
    let H = mount.clientHeight

    // ── Renderer ──────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.toneMapping         = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.outputColorSpace    = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)

    // ── Scene & camera ────────────────────────────────────────────────────
    const bgColor = new THREE.Color('#ffffff')
    const scene   = new THREE.Scene()
    scene.background = bgColor

    let layout = calcLayout(W, H)
    const camera = new THREE.PerspectiveCamera(FOV_BASE, W / H, 0.1, 100)
    camera.position.set(0, 0, layout.camZ)

    const BG_WHITE = new THREE.Color('#ffffff')
    const BG_DEEP  = new THREE.Color('#060610')   // near-black as we plunge in

    const KEY_POS  = new THREE.Vector3(3, 5, 6)
    const FILL_POS = new THREE.Vector3(-4, 2, 3)

    // ── Blobs ─────────────────────────────────────────────────────────────
    const blobs: BlobState[] = BLOB_DEFS.map((def, idx) => {
      const geo     = new THREE.SphereGeometry(BLOB_RADIUS, 64, 64)
      const origPos = new Float32Array(geo.attributes.position.array)

      const mat = new THREE.ShaderMaterial({
        vertexShader:   VERT,
        fragmentShader: FRAG,
        toneMapped:     true,
        side:           THREE.FrontSide,
        uniforms: {
          uTime:    { value: 0 },
          uC1:      { value: new THREE.Color(def.c1) },
          uC2:      { value: new THREE.Color(def.c2) },
          uC3:      { value: new THREE.Color(def.c3) },
          uC4:      { value: new THREE.Color(def.c4) },
          uKeyPos:  { value: KEY_POS.clone() },
          uFillPos: { value: FILL_POS.clone() },
          uOrbPos:  { value: new THREE.Vector3() },
          uOrbCol:  { value: new THREE.Color(def.orbCol) },
        },
      })

      const mesh    = new THREE.Mesh(geo, mat)
      const basePos = layout.positions[idx].clone()
      mesh.position.copy(basePos)
      scene.add(mesh)

      return { mesh, mat, geo, origPos, def, basePos }
    })

    // ── Label positions — pure trig, no THREE.js projection needed ────────
    //
    // The bug in the old approach: .project(camera) requires camera.matrixWorldInverse
    // to be computed, which only happens after the first renderer.render() call.
    // Since we called computeLabelPositions() before the animation loop started,
    // the camera matrix was uninitialized and all projections returned ~(0,0),
    // placing every label at the top-left corner.
    //
    // Fix: derive screen positions directly from the known camera geometry.
    // At rest the camera is at (0,0,camZ) looking at origin with FOV_BASE.
    //
    const computeLabelPositions = (): LabelStyle[] => {
      const halfH      = layout.camZ * Math.tan((FOV_BASE / 2) * (Math.PI / 180))
      const halfW      = halfH * (W / H)
      const pxPerUnit  = H / (2 * halfH)     // screen pixels per world unit at camZ
      const screenR    = BLOB_RADIUS * pxPerUnit   // blob screen radius in pixels

      return blobs.map(b => {
        // World-to-NDC for a camera at (0,0,camZ) looking at origin
        const ndcX = b.basePos.x / halfW
        const ndcY = b.basePos.y / halfH
        // NDC to screen pixels
        const sx   = ( ndcX * 0.5 + 0.5) * W
        const sy   = (-ndcY * 0.5 + 0.5) * H

        if (layout.portrait) {
          // Portrait: label to the right of the blob, vertically centred
          return {
            left:      `${sx + screenR + 14}px`,
            top:       `${sy}px`,
            transform: 'translateY(-50%)',
            textAlign: 'left',
          }
        }
        // Landscape: label below the blob, horizontally centred
        return {
          left:      `${sx}px`,
          top:       `${sy + screenR + 14}px`,
          transform: 'translateX(-50%)',
          textAlign: 'center',
        }
      })
    }

    setLabelPos(computeLabelPositions())

    // ── Click / tap ───────────────────────────────────────────────────────
    const mouse2d   = new THREE.Vector2()
    const raycaster = new THREE.Raycaster()

    const pointerToNDC = (clientX: number, clientY: number) => {
      const r   = mount.getBoundingClientRect()
      mouse2d.x =  ((clientX - r.left) / r.width)  * 2 - 1
      mouse2d.y = -((clientY - r.top)  / r.height) * 2 + 1
    }

    const updateHover = (idx: number | null) => {
      const nextHoveredId = idx === null ? null : blobs[idx]?.def.id ?? null
      mount.style.cursor = nextHoveredId ? 'pointer' : 'default'
      setHoveredId(prev => (prev === nextHoveredId ? prev : nextHoveredId))
    }

    const getIntersectedBlobIndex = () => {
      raycaster.setFromCamera(mouse2d, camera)
      for (let bi = 0; bi < blobs.length; bi++) {
        const hits = raycaster.intersectObject(blobs[bi].mesh)
        if (hits.length > 0) {
          return bi
        }
      }
      return null
    }

    const tryOpen = () => {
      if (txRef.current.phase !== 'idle') return
      const hitIdx = getIntersectedBlobIndex()
      if (hitIdx !== null) openBlobByIndex(hitIdx)
    }

    const onMouseMove = (e: MouseEvent) => {
      pointerToNDC(e.clientX, e.clientY)
      if (txRef.current.phase !== 'idle') {
        updateHover(null)
        return
      }
      updateHover(getIntersectedBlobIndex())
    }

    const onClick = (e: MouseEvent) => {
      pointerToNDC(e.clientX, e.clientY)
      tryOpen()
    }

    const onMouseLeave = () => {
      mount.style.cursor = 'default'
      updateHover(null)
    }

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        pointerToNDC(e.touches[0].clientX, e.touches[0].clientY)
        setTimeout(tryOpen, 30)
      }
    }

    mount.addEventListener('mousemove',   onMouseMove)
    mount.addEventListener('mouseleave',  onMouseLeave)
    mount.addEventListener('click',      onClick)
    mount.addEventListener('touchstart', onTouchStart, { passive: true })

    // ── Animation loop ────────────────────────────────────────────────────
    //
    // TRANSITION DESIGN — "entering the blob"
    //
    // Old approach: blob scaled to 7.5× while camera barely moved (-2.5 units).
    // This felt like a cheap "make it huge" trick rather than genuine depth.
    //
    // New approach: camera plunges from z=9 to z=1.5 (7.5 units of genuine zoom),
    // while the blob only scales to 1.5× (radius ~1.2 units). At peak, camera
    // is 0.3 units from the blob surface — it's right up against it.
    // FOV widens from 50°→62° during the rush for a fisheye depth effect.
    // Background darkens to near-black as we "enter".
    // A blob-colored flash overlay washes in at ep≥0.65, completing the portal.
    // Content appears only after the flash is fully opaque.
    //
    const clock = new THREE.Clock()
    let animId: number

    const EXP_DUR  = 1.28   // seconds to fully enter
    const COL_DUR  = 1.60   // seconds to exit — long enough to feel deliberate
    const CAM_NEAR = 1.20   // camera z at peak immersion (right against blob)

    const orbPos = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]

    const tick = () => {
      animId = requestAnimationFrame(tick)
      const t = clock.getElapsedTime()
      clockRef.current = t

      const tx      = txRef.current
      const isTrans = tx.phase !== 'idle'

      // ── Transition progress (ep: 0 → 1) ───────────────────────────────
      let ep = 0
      if (tx.phase === 'expanding') {
        ep = easeInOutCubic(Math.min(1, (t - tx.expandStart) / EXP_DUR))
        if (ep >= 1 && !revealedRef.current) {
          tx.phase = 'open'
          revealedRef.current = true
          setVisible(true)
        }
      } else if (tx.phase === 'open') {
        ep = 1
      } else if (tx.phase === 'collapsing') {
        const raw = Math.min(1, (t - tx.collapseStart) / COL_DUR)
        ep = 1 - easeInOutCubic(raw)
        if (raw >= 1) {
          ep = 0; tx.phase = 'idle'; tx.activeIdx = -1
          setActive(null)
          // Reset camera FOV when fully collapsed
          camera.fov = FOV_BASE
          camera.updateProjectionMatrix()
        }
      }

      // ── Scene background: white → near-black as we plunge ─────────────
      bgColor.lerpColors(BG_WHITE, BG_DEEP, ep * ep * 0.65)

      // ── Camera: genuine depth zoom + fisheye FOV widening ─────────────
      camera.position.z = layout.camZ - ep * (layout.camZ - CAM_NEAR)
      camera.fov        = FOV_BASE + ep * 12   // 50° → 62° (rush feel)
      camera.updateProjectionMatrix()

      // ── Portal flash overlay: blob-color wash at end of plunge ────────
      if (flashRef.current) {
        // Fades in during ep 0.65 → 1.0; also fades quickly at collapse start
        let flashOp = 0
        if (tx.phase === 'expanding' || tx.phase === 'open') {
          flashOp = ep > 0.52 ? easeInOutCubic((ep - 0.52) / 0.40) : 0
        } else if (tx.phase === 'collapsing') {
          const raw = Math.min(1, (t - tx.collapseStart) / COL_DUR)
          // Fade out over the first 60% of collapse — smoother handoff back to the stage
          flashOp = Math.max(0, 1 - easeInOutCubic(Math.min(1, raw / 0.60)))
        }
        flashRef.current.style.opacity    = String(flashOp)
        flashRef.current.style.background = tx.flashColor
      }

      // ── Orbiting accent lights ─────────────────────────────────────────
      orbPos[0].set(Math.cos(t * 0.38) * 5,       Math.sin(t * 0.27) * 4,       Math.sin(t * 0.50) * 3 + 4)
      orbPos[1].set(Math.cos(t * 0.31 + 2.1) * 5, Math.sin(t * 0.42 + 1.1) * 4, Math.cos(t * 0.58) * 3 + 4)
      orbPos[2].set(Math.cos(t * 0.48 + 4.2) * 5, Math.sin(t * 0.35 + 3.0) * 4, Math.sin(t * 0.43 + 2.0) * 3 + 4)

      // ── Per-blob update ───────────────────────────────────────────────
      for (let bi = 0; bi < blobs.length; bi++) {
        const b        = blobs[bi]
        const isActive = bi === tx.activeIdx

        // Gentle autonomous bob — no mouse interaction
        const bobY = Math.sin(t * b.def.bobSpeed + b.def.timeOffset) * b.def.bobAmp

        if (isActive && isTrans) {
          // Glide to center while camera rushes toward it
          b.mesh.position.set(
            b.basePos.x * (1 - ep),
            (b.basePos.y + bobY) * (1 - ep),
            b.basePos.z,
          )
          // Modest scale — camera zoom provides the depth, not brute scaling
          b.mesh.scale.setScalar(1 + ep * 0.50)
          // Add a fixed transition spin so each open feels consistent over time.
          b.mesh.rotation.y = t * b.def.rotY + ep * 1.55
          b.mesh.rotation.x = t * b.def.rotX + ep * 0.42

        } else if (!isActive && isTrans) {
          // Siblings ease away rather than abruptly dropping out
          const siblingEase = easeInOutCubic(ep)
          b.mesh.scale.setScalar(Math.max(0, 1 - siblingEase * 1.35))
          b.mesh.position.set(b.basePos.x, b.basePos.y + bobY, b.basePos.z)
          b.mesh.rotation.y = t * b.def.rotY * (1 - siblingEase * 0.18)
          b.mesh.rotation.x = t * b.def.rotX * (1 - siblingEase * 0.18)

        } else {
          b.mesh.scale.setScalar(1)
          b.mesh.position.set(b.basePos.x, b.basePos.y + bobY, b.basePos.z)
          b.mesh.rotation.y = t * b.def.rotY
          b.mesh.rotation.x = t * b.def.rotX
        }

        // Vertex deformation — cranks up drastically during transition
        // giving the surface an alive, morphing "portal" quality
        const ampBoost = (isActive && isTrans) ? ep * 1.30 : 0
        const amp = b.def.amp + ampBoost
        const pos = b.geo.attributes.position as THREE.BufferAttribute
        const op  = b.origPos
        const bT  = t + b.def.timeOffset * 0.4

        for (let i = 0; i < pos.count; i++) {
          const ox = op[i * 3], oy = op[i * 3 + 1], oz = op[i * 3 + 2]
          const len = Math.sqrt(ox * ox + oy * oy + oz * oz)
          const nx  = ox / len, ny = oy / len, nz = oz / len
          const s   = 1 + fbm(nx, ny, nz, bT) * amp
          pos.setXYZ(i, ox * s, oy * s, oz * s)
        }
        pos.needsUpdate = true
        b.geo.computeVertexNormals()

        b.mat.uniforms.uTime.value = t
        ;(b.mat.uniforms.uOrbPos.value as THREE.Vector3).copy(orbPos[bi])
      }

      renderer.render(scene, camera)
    }

    tick()

    // ── Resize ────────────────────────────────────────────────────────────
    const onResize = () => {
      W = mount.clientWidth
      H = mount.clientHeight
      layout = calcLayout(W, H)
      blobs.forEach((b, i) => b.basePos.copy(layout.positions[i]))
      camera.aspect     = W / H
      camera.position.z = layout.camZ
      camera.fov        = FOV_BASE
      camera.updateProjectionMatrix()
      renderer.setSize(W, H)
      setLabelPos(computeLabelPositions())
    }
    window.addEventListener('resize', onResize)

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId)
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
      mount.style.cursor = 'default'
      mount.removeEventListener('mousemove',   onMouseMove)
      mount.removeEventListener('mouseleave',  onMouseLeave)
      mount.removeEventListener('click',      onClick)
      mount.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('resize',    onResize)
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [openBlobByIndex])

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white">

      {/* Three.js canvas */}
      <div ref={mountRef} className="absolute inset-0" />

      {/*
        Labels — statically positioned below / beside each blob.
        Computed once via pure trig (no THREE.js projection) at mount + resize.
        Fade out when a blob is clicked.
      */}
      {BLOB_DEFS.map((b, i) => (
        <button
          key={b.id}
          type="button"
          onMouseEnter={() => setHoveredId(b.id)}
          onMouseLeave={() => setHoveredId(prev => (prev === b.id ? null : prev))}
          onFocus={() => setHoveredId(b.id)}
          onBlur={() => setHoveredId(prev => (prev === b.id ? null : prev))}
          onClick={() => openBlobByIndex(i)}
          className="absolute select-none font-semibold uppercase tracking-widest cursor-pointer bg-transparent border-none p-0"
          style={{
            fontSize:   'clamp(0.55rem, 1.4vw, 0.72rem)',
            whiteSpace: 'nowrap',
            color:      '#9ca3af',
            opacity:    active ? 0 : 1,
            transition: 'opacity 0.22s ease',
            ...(labelPos[i] ?? {}),
          }}
          aria-label={`Open ${b.label}`}
        >
          {b.label}
        </button>
      ))}

      {/*
        Portal flash — a blob-colored wash that appears as the camera
        reaches the blob surface, selling the "entering a portal" moment.
        z-40 sits below the content overlay (z-50).
        Opacity and color are driven directly by the animation loop via flashRef.
      */}
      <div
        ref={flashRef}
        className="fixed inset-0 pointer-events-none"
        style={{ opacity: 0, zIndex: 40, background: '#000' }}
      />

      {/* Section overlay — fades in after flash is full (content reveal) */}
      {active && (
        <div
          className="fixed inset-0 z-50"
          style={{
            background:    active === 'contact' ? 'transparent' : 'white',
            opacity:       visible ? 1 : 0,
            transition:    'opacity 0.45s ease',
            pointerEvents: visible ? 'auto' : 'none',
          }}
        >
          {/* Close button — fixed so it stays visible regardless of scroll position */}
          <button
            onClick={closeSection}
            className="fixed top-6 right-6 z-[60] w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors bg-white/70 backdrop-blur border-none cursor-pointer text-xl leading-none shadow"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Contact */}
          {active === 'contact' && (
            <div className="absolute inset-0">
              <ContactScene />
            </div>
          )}

          {/* About — full-page scroll experience; scroll container ref is passed down
              so AboutPage can use it for sticky hero parallax via Framer Motion useScroll */}
          {active === 'about' && (
            <div
              ref={aboutScrollRef}
              className="absolute inset-0 overflow-y-auto"
            >
              <AboutPage scrollContainer={aboutScrollRef} />
            </div>
          )}

          {/* Projects */}
          {active === 'projects' && (
            <div className="absolute inset-0 overflow-y-auto flex items-start justify-center px-5 py-20">
              <ProjectsSection />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Section pages ─────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    title:       'SWE Tier List',
    category:    'Web / Tool',
    year:        '2024',
    description: 'Searchable, filterable database of interview difficulty ratings across 1,000+ companies. Helps engineers figure out how hard to prep before committing to a grind.',
    tech:        ['Next.js', 'Tailwind CSS', 'GSAP'],
    github:      'https://github.com/404christiann/sweTierList',
    live:        undefined,
  },
  {
    title:       'Image to Markdown',
    category:    'CLI / AI',
    year:        '2024',
    description: 'Converts images and PDFs into clean Markdown files so you can paste documents into LLMs as text instead of images, cutting token usage significantly.',
    tech:        ['Python', 'Tesseract OCR'],
    github:      'https://github.com/404christiann/imageToMarkdownFiles',
    live:        undefined,
  },
  {
    title:       'Resume Tailor',
    category:    'AI / Tool',
    year:        '2025',
    description: 'Work in progress. An assistant for tailoring resumes to job descriptions using LLMs.',
    tech:        ['In progress'],
    github:      'https://github.com/404christiann/resumeTailorAssistant',
    live:        undefined,
  },
]

function ProjectsSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [mouse, setMouse]           = useState({ x: 0, y: 0 })
  const containerRef                = useRef<HTMLDivElement>(null)

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    setMouse({ x: e.clientX, y: e.clientY })
  }, [])

  const anyHovered = hoveredIdx !== null

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen flex flex-col justify-center px-8 sm:px-14 md:px-20 py-20"
      onMouseMove={onMouseMove}
    >
      {/* Floating preview card — follows cursor on desktop */}
      {anyHovered && (
        <div
          className="fixed pointer-events-none z-[70] hidden md:block"
          style={{ left: mouse.x + 24, top: mouse.y - 56 }}
        >
          <div
            className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-xl"
            style={{ width: 240, transition: 'opacity 0.15s ease' }}
          >
            <p className="text-orange-500 uppercase tracking-widest font-semibold mb-1.5" style={{ fontSize: '0.62rem' }}>
              {PROJECTS[hoveredIdx!].category} · {PROJECTS[hoveredIdx!].year}
            </p>
            <p className="text-gray-600 leading-relaxed mb-3" style={{ fontSize: '0.8125rem' }}>
              {PROJECTS[hoveredIdx!].description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {PROJECTS[hoveredIdx!].tech.map(t => (
                <span key={t} className="px-2 py-0.5 rounded-full bg-gray-50 border border-gray-200 text-gray-500 font-medium" style={{ fontSize: '0.68rem' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Project list */}
      <div className="w-full">
        {PROJECTS.map((p, i) => {
          const isHovered  = hoveredIdx === i
          const isDimmed   = anyHovered && !isHovered
          return (
            <div
              key={p.title}
              className="group"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex items-baseline justify-between gap-4 py-4 md:py-5">
                {/* Title */}
                <a
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold leading-none tracking-tight flex-1"
                  style={{
                    fontSize: 'clamp(2.2rem, 6.5vw, 5.5rem)',
                    background: 'linear-gradient(135deg, #e8105a 0%, #ff7700 45%, #a78bfa 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    paddingBottom: '0.12em',
                    opacity: isDimmed ? 0.12 : isHovered ? 1 : 0.4,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  {p.title}
                </a>

                {/* Links — visible on hover, desktop only */}
                <div
                  className="hidden md:flex items-center gap-4 flex-shrink-0 pb-1"
                  style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s ease' }}
                >
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-900 text-sm transition-colors">
                      GitHub ↗
                    </a>
                  )}
                  {p.live && (
                    <a href={p.live} target="_blank" rel="noopener noreferrer"
                      className="text-orange-500 hover:text-orange-400 text-sm transition-colors">
                      Live ↗
                    </a>
                  )}
                </div>
              </div>

              {/* Mobile: show tags + links below title always */}
              <div className="flex md:hidden flex-wrap items-center gap-x-4 gap-y-2 pb-4">
                <span className="text-gray-400 uppercase tracking-widest font-medium" style={{ fontSize: '0.65rem' }}>
                  {p.category} · {p.year}
                </span>
                <div className="flex gap-3">
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noopener noreferrer"
                      className="text-gray-400 text-xs">GitHub ↗</a>
                  )}
                  {p.live && (
                    <a href={p.live} target="_blank" rel="noopener noreferrer"
                      className="text-orange-500 text-xs">Live ↗</a>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
