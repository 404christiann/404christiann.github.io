import NavBar from '@/components/ui/NavBar'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Projects from '@/components/sections/Projects'
import Contact from '@/components/sections/Contact'

export default function Home() {
  return (
    <main className="bg-white">
      <NavBar />
      <Hero />
      <About />
      <Projects />
      <Contact />
    </main>
  )
}
