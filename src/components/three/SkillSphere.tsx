'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Sphere } from '@react-three/drei'
import * as THREE from 'three'

const SKILLS = [
  'React', 'Next.js', 'TypeScript', 'Node.js',
  'Python', 'Tailwind', 'Three.js', 'Docker',
  'PostgreSQL', 'Git', 'Figma', 'AWS',
]

function SkillTag({ label, position }: { label: string; position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.lookAt(state.camera.position)
    }
  })

  return (
    <group ref={ref} position={position}>
      <Text
        fontSize={0.18}
        color="#111827"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#f97316"
      >
        {label}
      </Text>
    </group>
  )
}

function OrbitingSkills() {
  const groupRef = useRef<THREE.Group>(null)

  const positions = SKILLS.map((_, i) => {
    const phi = Math.acos(-1 + (2 * i) / SKILLS.length)
    const theta = Math.sqrt(SKILLS.length * Math.PI) * phi
    return [
      1.6 * Math.sin(phi) * Math.cos(theta),
      1.6 * Math.sin(phi) * Math.sin(theta),
      1.6 * Math.cos(phi),
    ] as [number, number, number]
  })

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3
      groupRef.current.rotation.x += delta * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      <Sphere args={[1, 32, 32]}>
        <meshStandardMaterial
          color="#f97316"
          transparent
          opacity={0.12}
          wireframe
        />
      </Sphere>
      {SKILLS.map((skill, i) => (
        <SkillTag key={skill} label={skill} position={positions[i]} />
      ))}
    </group>
  )
}

export default function SkillSphere() {
  return (
    <Canvas camera={{ position: [0, 0, 4] }}>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} />
      <OrbitingSkills />
    </Canvas>
  )
}
