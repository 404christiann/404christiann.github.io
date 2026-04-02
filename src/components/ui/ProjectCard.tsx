'use client'

import { motion } from 'framer-motion'
import { type Project } from '@/lib/projects'

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:border-orange-300 hover:shadow-md transition-all"
    >
      <h3 className="text-gray-900 font-semibold text-lg">{project.title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed flex-1">{project.description}</p>

      <div className="flex flex-wrap gap-2">
        {project.tech.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 rounded-md bg-orange-50 text-orange-600 text-xs font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-4 pt-1">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-900 text-sm transition-colors"
          >
            GitHub ↗
          </a>
        )}
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-400 text-sm transition-colors"
          >
            Live ↗
          </a>
        )}
      </div>
    </motion.div>
  )
}
