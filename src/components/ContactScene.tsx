'use client'
import { Suspense, useEffect, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

/* ─── Pixel-art eye patterns ────────────────────────────────────── */
const CIRCLE_PIX = [
  [0,0,1,1,1,0,0],
  [0,1,1,1,1,1,0],
  [1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1],
  [0,1,1,1,1,1,0],
  [0,0,1,1,1,0,0],
]
const HEART_PIX = [
  [0,1,1,0,1,1,0],
  [1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1],
  [0,1,1,1,1,1,0],
  [0,0,1,1,1,0,0],
  [0,0,0,1,0,0,0],
]

/* ─── Canvas pixel-art texture (no workers) ─────────────────────── */
function makePixelTex(pattern: number[][], color: string): THREE.CanvasTexture {
  const SZ   = 128
  const c    = document.createElement('canvas')
  c.width    = SZ; c.height = SZ
  const g    = c.getContext('2d')!
  const rows = pattern.length
  const cols = pattern[0].length
  const ps   = Math.floor((SZ * 0.82) / (cols + (cols - 1) * 0.15))
  const gap  = Math.max(1, Math.round(ps * 0.15))
  const tw   = cols * ps + (cols - 1) * gap
  const th   = rows * ps + (rows - 1) * gap
  const ox   = Math.round((SZ - tw) / 2)
  const oy   = Math.round((SZ - th) / 2)
  g.fillStyle = color
  for (let r = 0; r < rows; r++)
    for (let col = 0; col < cols; col++)
      if (pattern[r][col])
        g.fillRect(ox + col * (ps + gap), oy + r * (ps + gap), ps, ps)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function useEyeTextures() {
  return useMemo(() => {
    if (typeof document === 'undefined') return null
    return {
      circle: makePixelTex(CIRCLE_PIX, '#00ccff'),
      heart:  makePixelTex(HEART_PIX,  '#ff1a50'),
    }
  }, [])
}

/* ─── Materials ─────────────────────────────────────────────────── */
/* Glossy white clay */
const WHITE_PROPS = {
  color: '#f2f2f8' as const,
  roughness: 0.06,
  metalness: 0.0,
  clearcoat: 1.0,
  clearcoatRoughness: 0.04,
  envMapIntensity: 1.6,
}
function WhiteMat() { return <meshPhysicalMaterial {...WHITE_PROPS} /> }

/* Dark display panel — no clearcoat, rougher surface, env disabled */
function GlassMat() {
  return (
    <meshPhysicalMaterial
      color="#060610"
      roughness={0.55}
      metalness={0.0}
      clearcoat={0}
      reflectivity={0.05}
      envMapIntensity={0}
    />
  )
}

/* Matte dark caps */
function EarMat() {
  return (
    <meshPhysicalMaterial
      color="#111122"
      roughness={0.30}
      metalness={0.02}
      clearcoat={0.4}
      clearcoatRoughness={0.15}
      envMapIntensity={0.5}
    />
  )
}

/* ─── Shared refs ───────────────────────────────────────────────── */
interface SharedRefs {
  mouse:    React.RefObject<{ x: number; y: number }>
  hovering: React.RefObject<boolean>
}

/* ─── Robot ─────────────────────────────────────────────────────── */
function Robot({ refs }: { refs: SharedRefs }) {
  const rootRef  = useRef<THREE.Group>(null)
  const headRef  = useRef<THREE.Group>(null)
  const lEyeRef  = useRef<THREE.Mesh>(null)
  const rEyeRef  = useRef<THREE.Mesh>(null)
  const ySpring  = useRef(0)
  const textures = useEyeTextures()

  /* eye base positions in head-local space */
  const L_BASE  = { x: -0.43, y: 0.05 }
  const R_BASE  = { x:  0.43, y: 0.05 }
  const PANEL_Z = 0.720
  const EYE_Z   = 0.770

  useFrame((_, delta) => {
    if (!rootRef.current || !headRef.current) return
    const mx  = refs.mouse.current?.x  ?? 0
    const my  = refs.mouse.current?.y  ?? 0
    const hov = refs.hovering.current  ?? false
    const k   = Math.min(1, delta * 7)

    /* spring jump on button hover */
    ySpring.current += ((hov ? 0.58 : 0) - ySpring.current) * k
    rootRef.current.position.y = ySpring.current

    /* head gently tilts toward cursor */
    headRef.current.rotation.y += (mx * 0.15  - headRef.current.rotation.y) * k * 0.58
    headRef.current.rotation.x += (-my * 0.10 - headRef.current.rotation.x) * k * 0.58

    /* eye planes follow cursor within panel */
    const dx = mx * 0.046
    const dy = -my * 0.028
    if (lEyeRef.current) {
      lEyeRef.current.position.x += (L_BASE.x + dx - lEyeRef.current.position.x) * k
      lEyeRef.current.position.y += (L_BASE.y + dy - lEyeRef.current.position.y) * k
    }
    if (rEyeRef.current) {
      rEyeRef.current.position.x += (R_BASE.x + dx - rEyeRef.current.position.x) * k
      rEyeRef.current.position.y += (R_BASE.y + dy - rEyeRef.current.position.y) * k
    }

    /* circle ↔ heart texture swap */
    if (textures) {
      const tex = hov ? textures.heart : textures.circle
      for (const eye of [lEyeRef.current, rEyeRef.current]) {
        if (!eye) continue
        const m = eye.material as THREE.MeshBasicMaterial
        if (m.map !== tex) { m.map = tex; m.needsUpdate = true }
      }
    }
  })

  return (
    <group ref={rootRef}>
      <group ref={headRef}>

        {/* ── Squircle head shell ── */}
        <RoundedBox args={[2.10, 2.10, 1.42]} radius={0.40} smoothness={12} castShadow receiveShadow>
          <WhiteMat />
        </RoundedBox>

        {/* ── Polished black glass display ── */}
        <RoundedBox args={[1.58, 1.00, 0.07]} radius={0.14} smoothness={8}
          position={[0, 0.05, PANEL_Z]} castShadow>
          <GlassMat />
        </RoundedBox>

        {/* ── Pixel eyes ── */}
        <mesh ref={lEyeRef} position={[L_BASE.x, L_BASE.y, EYE_Z]}>
          <planeGeometry args={[0.48, 0.48]} />
          <meshBasicMaterial
            map={textures?.circle ?? undefined}
            transparent depthWrite={false} toneMapped={false}
          />
        </mesh>
        <mesh ref={rEyeRef} position={[R_BASE.x, R_BASE.y, EYE_Z]}>
          <planeGeometry args={[0.48, 0.48]} />
          <meshBasicMaterial
            map={textures?.circle ?? undefined}
            transparent depthWrite={false} toneMapped={false}
          />
        </mesh>

        {/* ── Cylindrical earmuffs ── */}
        {/* Left — cylinder axis along X via Z-rotation */}
        <mesh position={[-1.13, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.26, 40]} />
          <EarMat />
        </mesh>
        {/* Right */}
        <mesh position={[1.13, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.26, 40]} />
          <EarMat />
        </mesh>

      </group>

      {/* ── Floating hand spheres (outside headRef — don't rotate with head) ── */}
      <mesh position={[-1.08, -1.52, 0.06]} castShadow>
        <sphereGeometry args={[0.235, 48, 48]} />
        <meshPhysicalMaterial {...WHITE_PROPS} />
      </mesh>
      <mesh position={[1.08, -1.52, 0.06]} castShadow>
        <sphereGeometry args={[0.235, 48, 48]} />
        <meshPhysicalMaterial {...WHITE_PROPS} />
      </mesh>

    </group>
  )
}

/* ─── Lighting — high-key, soft, no hard shadows ─────────────────── */
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.50} color="#ffffff" />
      {/* Key — upper-left, soft warm */}
      <directionalLight position={[-3.5, 5, 5]} intensity={1.8} color="#fff8f4"
        castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.001}
        shadow-camera-near={0.5} shadow-camera-far={20}
        shadow-camera-left={-5} shadow-camera-right={5}
        shadow-camera-top={5} shadow-camera-bottom={-5}
      />
      {/* Fill — right, cool — kept low so the glass panel stays dark */}
      <directionalLight position={[4, 2, 3]}   intensity={0.18} color="#ddeeff" />
      {/* Top rim */}
      <directionalLight position={[0, 6, -4]}  intensity={0.7}  color="#ffffff" />
      {/* Under soft fill */}
      <pointLight       position={[0, -4, 4]}  intensity={0.4}  color="#ffffff" />
    </>
  )
}

/* ─── Scene ─────────────────────────────────────────────────────── */
function Scene({ refs }: { refs: SharedRefs }) {
  return (
    <>
      {/* Soft lavender-grey infinite void */}
      <color attach="background" args={['#eaeaf4']} />
      <fog attach="fog" args={['#eaeaf4', 12, 28]} />
      <Lighting />
      <Environment preset="studio" />
      <Float speed={1.3} rotationIntensity={0.035} floatIntensity={0.28}>
        <Robot refs={refs} />
      </Float>
    </>
  )
}

/* ─── Page component ────────────────────────────────────────────── */
export default function ContactScene() {
  const mouseRef    = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const hoveringRef = useRef<boolean>(false)

  const refs: SharedRefs = {
    mouse:    mouseRef    as React.RefObject<{ x: number; y: number }>,
    hovering: hoveringRef as React.RefObject<boolean>,
  }

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x:  (e.clientX / window.innerWidth)  * 2 - 1,
        y:  (e.clientY / window.innerHeight) * 2 - 1,
      }
    }
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0]; if (!t) return
      mouseRef.current = {
        x: (t.clientX / window.innerWidth)  * 2 - 1,
        y: (t.clientY / window.innerHeight) * 2 - 1,
      }
    }
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('touchmove', onTouch, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('touchmove', onTouch)
    }
  }, [])

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      background: '#eaeaf4',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      {/* 3D canvas — takes all remaining height */}
      <div style={{ width: '100%', flex: 1, minHeight: 0 }}>
        <Canvas
          camera={{ position: [0, 0.1, 5.4], fov: 42 }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.08,
          }}
          dpr={[1, 2]}
          shadows
        >
          <Suspense fallback={null}>
            <Scene refs={refs} />
          </Suspense>
        </Canvas>
      </div>

      {/* Pill button — purple → reddish-orange gradient */}
      <div style={{ padding: '14px 0 38px', flexShrink: 0 }}>
        <a
          href="https://www.linkedin.com/in/christian-alcala-a0b999155/"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => { hoveringRef.current = true  }}
          onMouseLeave={() => { hoveringRef.current = false }}
          onTouchStart={() => { hoveringRef.current = true  }}
          onTouchEnd={()   => { hoveringRef.current = false }}
          style={{
            padding:        '14px 48px',
            borderRadius:   50,
            background:     'linear-gradient(135deg, #cc1100 0%, #ff5500 55%, #ffaa33 100%)',
            color:          '#fff',
            fontWeight:     700,
            fontSize:       '1.05rem',
            textDecoration: 'none',
            letterSpacing:  '0.02em',
            boxShadow:      '0 8px 28px rgba(204,17,0,0.35), 0 2px 8px rgba(0,0,0,0.12)',
            cursor:         'pointer',
            display:        'inline-block',
            transition:     'transform 0.16s ease, box-shadow 0.16s ease',
          }}
          onMouseOver={e => {
            const el = e.currentTarget as HTMLElement
            el.style.transform = 'scale(1.05)'
            el.style.boxShadow = '0 14px 36px rgba(204,17,0,0.50), 0 4px 12px rgba(0,0,0,0.16)'
          }}
          onMouseOut={e => {
            const el = e.currentTarget as HTMLElement
            el.style.transform = 'scale(1)'
            el.style.boxShadow = '0 8px 28px rgba(204,17,0,0.35), 0 2px 8px rgba(0,0,0,0.12)'
          }}
        >
          Get in touch
        </a>
      </div>
    </div>
  )
}
