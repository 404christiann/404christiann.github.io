'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), { ssr: false })

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-white">
      {/* Three.js particle background */}
      <div className="absolute inset-0">
        <HeroScene />
      </div>

      {/* Hero text */}
      <div className="relative z-10 text-center px-4">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-orange-500 text-sm font-medium tracking-widest uppercase mb-4"
        >
          Hey, I&apos;m
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-black text-6xl md:text-8xl font-bold tracking-tight mb-6"
        >
          Christian
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-gray-500 text-xl md:text-2xl max-w-xl mx-auto mb-10"
        >
          I build things for the web.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="flex gap-4 justify-center"
        >
          <a
            href="#projects"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-medium transition-all"
          >
            View my work
          </a>
          <a
            href="#contact"
            className="px-6 py-3 rounded-xl border border-gray-300 hover:border-orange-400 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Get in touch
          </a>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 text-xs"
      >
        <span>scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-6 bg-gray-300"
        />
      </motion.div>
    </section>
  )
}
