'use client'

import { motion } from 'framer-motion'
import ProjectCard from '@/components/ui/ProjectCard'
import { projects } from '@/lib/projects'

export default function Projects() {
  return (
    <section id="projects" className="bg-white py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-orange-500 text-sm font-medium tracking-widest uppercase mb-4">Work</p>
          <h2 className="text-gray-900 text-4xl md:text-5xl font-bold">Things I&apos;ve built</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
