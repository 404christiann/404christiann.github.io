'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const links = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
]

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <a href="#" className="text-gray-900 font-bold text-lg tracking-wide hover:text-orange-500 transition-colors">
        Christian
      </a>
      <ul className="flex gap-8">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-gray-600 hover:text-orange-500 text-sm font-medium transition-colors"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </motion.nav>
  )
}
