'use client'

import { motion } from 'framer-motion'

export default function Contact() {
  return (
    <section id="contact" className="bg-gray-50 py-32 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-orange-500 text-sm font-medium tracking-widest uppercase mb-4">Contact</p>
          <h2 className="text-gray-900 text-4xl md:text-5xl font-bold mb-6">Get in touch</h2>
          <p className="text-gray-500 text-lg leading-relaxed mb-10">
            I&apos;m currently open to new opportunities. Whether you have a question or just want to say hi,
            I&apos;ll do my best to get back to you!
          </p>
          <a
            href="mailto:christianjavieralcala@gmail.com"
            className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-medium text-lg transition-all"
          >
            Say hello
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 pt-8 border-t border-gray-200 text-gray-400 text-sm"
        >
          Designed &amp; built by Christian — {new Date().getFullYear()}
        </motion.div>
      </div>
    </section>
  )
}
