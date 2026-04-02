export type Project = {
  title: string
  description: string
  tech: string[]
  github?: string
  live?: string
  image?: string
}

export const projects: Project[] = [
  {
    title: 'Project One',
    description: 'A short description of what this project does and the problem it solves.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    github: 'https://github.com/404christiann',
    live: 'https://example.com',
  },
  {
    title: 'Project Two',
    description: 'Another project showcasing different skills and technologies.',
    tech: ['React', 'Node.js', 'PostgreSQL'],
    github: 'https://github.com/404christiann',
  },
  {
    title: 'Project Three',
    description: 'A third project — swap these out with your real work.',
    tech: ['Python', 'FastAPI', 'Docker'],
    github: 'https://github.com/404christiann',
    live: 'https://example.com',
  },
]
