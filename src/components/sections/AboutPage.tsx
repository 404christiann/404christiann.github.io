'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Nunito } from 'next/font/google'

gsap.registerPlugin(ScrollTrigger)

const nunito = Nunito({
  subsets:  ['latin'],
  weight:   ['400', '500', '600', '700', '800'],
  display:  'swap',
})

// ─── Data ─────────────────────────────────────────────────────────────────────

const EXPERIENCE = [
  {
    company: 'Oracle Analytics Cloud',
    role:    'Software Engineer',
    period:  'Jul 2023 – Mar 2026',
    summary: 'Primary engineer on Homepage Ask and Workbook Assistant, serving 500k+ users across 2,180+ enterprises. Homepage Ask lets users type natural language questions from the analytics homepage to search the catalog or generate live dashboards from scratch, with multi-turn conversation support and public domain knowledge built in. Workbook Assistant brings the same experience inside the workbook: ask a question, get a chart, refine it with follow-ups, filter by attributes, and add visualizations to your canvas or save them to a watchlist.',
    tags:    ['TypeScript', 'Python', 'OCI', 'LLM Integration', 'REST APIs'],
  },
  {
    company: 'USC Information Sciences Institute',
    role:    'Research Assistant',
    period:  'Sep 2021 – May 2022',
    summary: 'Led data acquisition for a multi-institution DoD research program across USC, CMU, Buffalo, and USMA. Engineered Python scrapers and pipelines across Twitter and Reddit to support NLP research on adversarial influence detection and persuasion modeling at scale.',
    tags:    ['Python', 'NLP', 'Research'],
  },
  {
    company: 'Zuora',
    role:    'Data Science Intern',
    period:  'Jun 2020 – Mar 2021',
    summary: 'Built an automated NLP extraction pipeline for SEC filing analysis, cutting manual processing from days to hours. Migrated data workflows to Presto SQL and AWS Glue, improving query performance by 50%.',
    tags:    ['Python', 'Presto SQL', 'AWS Glue', 'NLP'],
  },
  {
    company: 'Visa Inc.',
    role:    'Software Engineer Intern',
    period:  'May 2019 – Aug 2019',
    summary: 'Designed and shipped full stack infrastructure that let engineers run remote code on legacy IBM systems, built with React, Node.js, and MongoDB. Saved on-call engineers 30 minutes per shift on average.',
    tags:    ['React', 'Node.js', 'MongoDB'],
  },
]

const SKILL_ROWS = [
  { category: 'Languages',        items: ['TypeScript', 'JavaScript', 'Java', 'Python', 'SQL', 'R', 'Go'] },
  { category: 'Front End',        items: ['React', 'Redux', 'Next.js', 'Knockout.js', 'Oracle JET', 'SCSS', 'Tailwind CSS'] },
  { category: 'Back End & Infra', items: ['REST APIs', 'Node.js', 'MongoDB', 'PostgreSQL', 'Elasticsearch', 'Docker', 'AWS', 'OCI'] },
  { category: 'Specialties',      items: ['LLM integration', 'Natural language interfaces', 'Feature-flagged rollouts', 'Automated regression testing', 'Full-stack delivery'] },
]

const NAV_ITEMS = ['Who I Am', 'Experience', 'Skills', 'Education']

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  scrollContainer: React.RefObject<HTMLDivElement | null>
}

// ─── Shared content blocks ────────────────────────────────────────────────────

function WhoIAmContent() {
  return (
    <div className="space-y-5 max-w-lg">
      <p className="text-gray-700 leading-relaxed" style={{ fontSize: '1.0625rem' }}>
        For nearly three years I was the engineer most responsible for how Oracle Analytics
        handled natural language. I built the features that let someone type a question and
        get a real answer back, a chart, a dashboard, without knowing anything about the
        underlying data structure.
      </p>
      <p className="text-gray-700 leading-relaxed" style={{ fontSize: '1.0625rem' }}>
        Along the way I built systems to make sure those answers were actually correct, led
        voice interaction delivery end to end, and shipped shared infrastructure that
        unblocked three other teams. The stuff that doesn&apos;t make the demo reel but
        matters at enterprise scale.
      </p>
      <p className="text-gray-700 leading-relaxed" style={{ fontSize: '1.0625rem' }}>
        My Berkeley degree focused on Inequalities in Society, race, class, gender,
        algorithms, public policy. That shapes how I think about every product decision.
        Outside of that I play soccer, run, and build side projects, usually UI work,
        sometimes for fun, sometimes for small businesses. Same instincts, different context.
      </p>
    </div>
  )
}

function ExperienceContent() {
  return (
    <div className="w-full max-w-lg">
      {EXPERIENCE.map((exp, idx) => (
        <div key={exp.company} className={idx < EXPERIENCE.length - 1 ? 'mb-7 pb-7 border-b border-gray-100' : ''}>
          {/* Company name — the typographic anchor */}
          <p className="font-bold text-gray-900 leading-tight mb-1" style={{ fontSize: '1.125rem' }}>
            {exp.company}
          </p>
          {/* Role · Period on one clean line */}
          <p className="text-gray-400" style={{ fontSize: '0.8rem' }}>
            <span className="font-medium" style={{ color: '#e8105a' }}>{exp.role}</span>
            <span className="mx-2 opacity-40">·</span>
            <span className="font-mono">{exp.period}</span>
          </p>
          {/* Stack as plain dot-separated text — no pills */}
          <p className="mt-2 text-gray-400" style={{ fontSize: '0.75rem', letterSpacing: '0.01em' }}>
            {exp.tags.join(' · ')}
          </p>
        </div>
      ))}
    </div>
  )
}

// One blob color per skill category — matches c1/c2/c3/c4 of the About blob
const SKILL_COLORS = ['#e8105a', '#ff7700', '#8810f0', '#ff88ee']

function SkillsContent() {
  return (
    <div className="w-full max-w-lg">
      {SKILL_ROWS.map((row, idx) => (
        <div
          key={row.category}
          className="flex gap-6 items-baseline"
          style={{ paddingTop: idx === 0 ? 0 : '1.25rem', paddingBottom: '1.25rem', borderBottom: idx < SKILL_ROWS.length - 1 ? '1px solid #f3f4f6' : 'none' }}
        >
          {/* Category label — color coded to the About blob palette */}
          <span
            className="flex-shrink-0 font-semibold uppercase tracking-widest"
            style={{ fontSize: '0.6rem', width: '5.5rem', paddingTop: '0.2rem', color: SKILL_COLORS[idx] }}
          >
            {row.category}
          </span>
          {/* Skills — plain text, comma separated */}
          <span className="text-gray-700 leading-relaxed" style={{ fontSize: '0.9375rem' }}>
            {row.items.join(', ')}
          </span>
        </div>
      ))}
    </div>
  )
}

function EducationContent() {
  return (
    <div className="w-full max-w-lg space-y-10">
      <div>
        <p
          className="font-mono mb-2"
          style={{
            fontSize: '0.7rem',
            background: 'linear-gradient(90deg, #e8105a, #8810f0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          2021 – 2023
        </p>
        <p className="font-bold text-gray-900 leading-tight mb-1" style={{ fontSize: '1.25rem' }}>
          University of Southern California
        </p>
        <p className="text-gray-400" style={{ fontSize: '0.875rem' }}>M.S. Computer Science</p>
      </div>

      <div>
        <p
          className="font-mono mb-2"
          style={{
            fontSize: '0.7rem',
            background: 'linear-gradient(90deg, #8810f0, #ff88ee)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          2015 – 2019
        </p>
        <p className="font-bold text-gray-900 leading-tight mb-1" style={{ fontSize: '1.25rem' }}>
          UC Berkeley
        </p>
        <p className="text-gray-400 mb-3" style={{ fontSize: '0.875rem' }}>B.A. Data Science</p>
        <p className="text-gray-400 leading-relaxed" style={{ fontSize: '0.8125rem', maxWidth: '28rem' }}>
          Domain emphasis in Inequalities in Society — algorithms, public policy, race, class,
          gender, and the ethics of data.
        </p>
      </div>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AboutPage({ scrollContainer }: Props) {
  const heroRef       = useRef<HTMLDivElement>(null)
  const subtitleRef   = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)

  // Desktop-only refs
  const tallRef    = useRef<HTMLDivElement>(null)
  const fillRef    = useRef<HTMLDivElement>(null)
  const listRef    = useRef<HTMLUListElement>(null)
  const slidesRef  = useRef<(HTMLDivElement | null)[]>([null, null, null, null])

  const handleNavClick = (i: number) => {
    const scroller = scrollContainer.current
    const tall     = tallRef.current
    if (!scroller || !tall) return

    // Just scroll — the onUpdate callback handles visual state reactively
    const containerTop     = tall.offsetTop
    const scrollableHeight = tall.offsetHeight - scroller.clientHeight
    const progress         = i / NAV_ITEMS.length
    scroller.scrollTo({ top: containerTop + scrollableHeight * progress, behavior: 'smooth' })
  }

  // ── Hero entrance ────────────────────────────────────────────────────────
  useEffect(() => {
    const els = [heroRef.current, subtitleRef.current, scrollHintRef.current]
    gsap.set(els, { opacity: 0, y: 28 })

    const tl = gsap.timeline({ delay: 0.55 })
    tl.to(heroRef.current,       { opacity: 1, y: 0, duration: 0.82, ease: 'power3.out' })
      .to(subtitleRef.current,   { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, '-=0.30')
      .to(scrollHintRef.current, { opacity: 1, y: 0, duration: 0.40, ease: 'power1.out' }, '+=0.10')

    return () => { tl.kill() }
  }, [])

  // ── Desktop ScrollTrigger (no pin — CSS sticky handles it) ──────────────
  useEffect(() => {
    const scroller = scrollContainer.current
    if (!scroller || !tallRef.current || !listRef.current || !fillRef.current) return

    const timer = setTimeout(() => {
      const listItems = Array.from(listRef.current!.querySelectorAll('li')) as HTMLElement[]
      const slides    = slidesRef.current.filter(Boolean) as HTMLDivElement[]

      if (!listItems.length || !slides.length) return

      const n = listItems.length

      // Track last active index to avoid redundant DOM writes
      let lastIdx = -1

      const setActive = (idx: number) => {
        if (idx === lastIdx) return
        if (lastIdx >= 0) {
          gsap.set(listItems[lastIdx], { color: '#e5e7eb' })
          gsap.set(slides[lastIdx],    { autoAlpha: 0, zIndex: 1 })
        }
        gsap.set(listItems[idx], { color: '#e8105a' })
        gsap.set(slides[idx],    { autoAlpha: 1, zIndex: 2 })
        lastIdx = idx
      }

      // Set initial state — all slides hidden, slide 0 active
      gsap.set(slides, { autoAlpha: 0, zIndex: 1 })
      gsap.set(listItems, { color: '#e5e7eb' })
      setActive(0)
      gsap.set(fillRef.current, { scaleY: 1 / n, transformOrigin: 'top left' })

      // Single ScrollTrigger with onUpdate — no scrub timeline so there's no
      // scrub lag that can override click-driven scroll position state
      ScrollTrigger.create({
        trigger: tallRef.current,
        scroller,
        start:    'top top',
        end:      'bottom bottom',
        onUpdate: (self) => {
          const progress = Math.max(0, Math.min(1, self.progress))
          const idx      = Math.min(Math.floor(progress * n), n - 1)

          setActive(idx)

          // Fill bar grows smoothly from 1/n → 1 across the full scroll range
          gsap.set(fillRef.current!, {
            scaleY:          1 / n + (1 - 1 / n) * progress,
            transformOrigin: 'top left',
          })
        },
      })

      ScrollTrigger.refresh()
    }, 120)

    return () => {
      clearTimeout(timer)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [scrollContainer])

  const px = 'px-8 sm:px-12 md:px-16 lg:px-24'

  return (
    <div className={`w-full bg-white ${nunito.className}`}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div className={`h-screen flex flex-col justify-center ${px} relative overflow-hidden`}>

        <div ref={heroRef}>
          <h1
            className="font-extrabold text-gray-900 leading-[0.88] tracking-tight"
            style={{ fontSize: 'clamp(3.6rem, 9.5vw, 8rem)' }}
          >
            Christian Alcala
          </h1>
        </div>

        <div ref={subtitleRef} className="mt-9 flex flex-wrap items-center gap-3">
          {['San Francisco', 'Full-Stack', 'AI / Product'].map((tag, i) => (
            <span key={tag} className="flex items-center gap-3">
              {i > 0 && <span className="w-1 h-1 rounded-full bg-gray-200 inline-block" />}
              <span className="text-gray-400" style={{ fontSize: '0.875rem' }}>{tag}</span>
            </span>
          ))}
        </div>

        <div
          ref={scrollHintRef}
          className="absolute bottom-10 flex items-center gap-2"
          style={{ left: 'var(--px-left, 2rem)' }}
        >
          <div className="w-6 h-px bg-gray-300" />
          <span className="uppercase tracking-widest text-gray-400" style={{ fontSize: '0.62rem' }}>
            Scroll
          </span>
        </div>
      </div>

      {/* ── MOBILE-ONLY: Simple stacked layout ───────────────────────────── */}
      <div className={`md:hidden bg-white ${px} pb-20`}>

        {/* Gradient accent line */}
        <div
          className="mb-12"
          style={{
            height:     2,
            background: 'linear-gradient(to right, #e8105a, #8810f0, #ff88ee)',
            borderRadius: 2,
          }}
        />

        {/* Who I Am */}
        <section className="mb-14">
          <h2 className="font-bold text-gray-900 mb-6" style={{ fontSize: '1.6rem' }}>
            Who I Am
          </h2>
          <WhoIAmContent />
        </section>

        {/* Experience */}
        <section className="mb-14">
          <h2 className="font-bold text-gray-900 mb-6" style={{ fontSize: '1.6rem' }}>
            Experience
          </h2>
          <ExperienceContent />
        </section>

        {/* Skills */}
        <section className="mb-14">
          <h2 className="font-bold text-gray-900 mb-6" style={{ fontSize: '1.6rem' }}>
            Skills
          </h2>
          <SkillsContent />
        </section>

        {/* Education */}
        <section>
          <h2 className="font-bold text-gray-900 mb-6" style={{ fontSize: '1.6rem' }}>
            Education
          </h2>
          <EducationContent />
        </section>
      </div>

      {/* ── DESKTOP-ONLY: Scroll-driven sticky layout ────────────────────── */}
      {/* tallRef creates scroll distance; the sticky inner stays in view    */}
      <div ref={tallRef} className="hidden md:block" style={{ height: `${NAV_ITEMS.length * 120 + 20}vh` }}>
        <div className={`sticky top-0 h-screen flex items-center ${px}`}>

          {/* items-stretch (default) lets the right column resolve h-full correctly;
              the left nav uses self-center to vertically center itself */}
          <div className="flex w-full gap-14 relative" style={{ height: 'calc(100vh - 6rem)' }}>

            {/* Gradient fill line */}
            <div
              ref={fillRef}
              style={{
                position:        'absolute',
                left:            0,
                top:             0,
                width:           2,
                height:          '100%',
                background:      'linear-gradient(to bottom, #e8105a, #8810f0, #ff88ee)',
                transformOrigin: 'top left',
                borderRadius:    2,
              }}
            />

            {/* Left: vertical nav — self-center so it sits in the middle of the column */}
            <ul ref={listRef} className="flex-shrink-0 pl-5 space-y-6 self-center">
              {NAV_ITEMS.map((label, i) => (
                <li
                  key={label}
                  onClick={() => handleNavClick(i)}
                  className="font-bold tracking-tight leading-none cursor-pointer"
                  style={{ fontSize: 'clamp(1.6rem, 3.8vw, 3.2rem)', transition: 'opacity 0.15s ease' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLLIElement).style.opacity = '0.7' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLLIElement).style.opacity = '1' }}
                >
                  {label}
                </li>
              ))}
            </ul>

            {/* Right: content slides — stretches to full column height via align-self: stretch */}
            <div className="flex-1 relative" style={{ overflow: 'hidden' }}>

              {/* Slide 0 — Who I Am */}
              <div
                ref={el => { slidesRef.current[0] = el }}
                className="absolute inset-0 bg-white flex items-center"
              >
                <WhoIAmContent />
              </div>

              {/* Slide 1 — Experience */}
              <div
                ref={el => { slidesRef.current[1] = el }}
                className="absolute inset-0 bg-white flex items-center"
              >
                <ExperienceContent />
              </div>

              {/* Slide 2 — Skills */}
              <div
                ref={el => { slidesRef.current[2] = el }}
                className="absolute inset-0 bg-white flex items-center"
              >
                <SkillsContent />
              </div>

              {/* Slide 3 — Education */}
              <div
                ref={el => { slidesRef.current[3] = el }}
                className="absolute inset-0 bg-white flex items-center"
              >
                <EducationContent />
              </div>

            </div>
          </div>
        </div>
      </div>{/* end tallRef */}

    </div>
  )
}
