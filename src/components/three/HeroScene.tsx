'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function ParticleGalaxy() {
  const ref = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const count = 4000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const r = Math.random() * 2 + 0.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      // Gradient from vivid red (#ff2200) to bright orange (#ff8800)
      const t = Math.random()
      colors[i * 3]     = 1.0               // R always full
      colors[i * 3 + 1] = t * 0.53          // G: 0 → 0.53 (red → orange)
      colors[i * 3 + 2] = 0.0               // B always 0
    }

    return { positions, colors }
  }, [])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 12
      ref.current.rotation.y -= delta / 8
    }
  })

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        vertexColors
        transparent
        opacity={0.9}
        size={0.009}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  )
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 1] }}
      onCreated={({ gl }) => gl.setClearColor('#ffffff', 1)}
    >
      <ParticleGalaxy />
    </Canvas>
  )
}
