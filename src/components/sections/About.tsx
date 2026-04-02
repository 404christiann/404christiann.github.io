'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'

const SkillSphere = dynamic(() => import('@/components/three/SkillSphere'), { ssr: false })

export default function About() {
  return (
    <section id="about" className="bg-gray-50 py-32 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-orange-500 text-sm font-medium tracking-widest uppercase mb-4">About me</p>
          <h2 className="text-gray-900 text-4xl md:text-5xl font-bold mb-6 leading-tight">
            I love crafting<br />digital experiences.
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed mb-6">
            I&apos;m a developer passionate about building fast, beautiful, and accessible web experiences.
            I enjoy working across the full stack — from pixel-perfect UIs to robust backends.
          </p>
          <p className="text-gray-500 text-lg leading-relaxed">
            When I&apos;m not coding, you&apos;ll find me exploring new tools, contributing to open source,
            or chasing the perfect espresso shot.
          </p>
        </motion.div>

        {/* Skill sphere */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="h-80 md:h-96"
        >
          <SkillSphere />
        </motion.div>
      </div>
    </section>
  )
}
