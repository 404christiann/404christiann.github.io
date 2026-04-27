'use client'

import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'

// ─── Data ─────────────────────────────────────────────────────────────────────

const EXPERIENCE = [
  {
    company: 'Oracle Analytics Cloud',
    role:    'Software Engineer',
    period:  'Jul 2023 – Mar 2026',
    summary: 'Primary engineer on Homepage Ask and Workbook Assistant, serving 500k+ users across 2,180+ enterprises. Homepage Ask lets users type natural language questions from the analytics homepage to search the catalog or generate live dashboards from scratch, with multi-turn conversation support and public domain knowledge built in. Workbook Assistant brings the same experience inside the workbook: ask a question, get a chart with a descriptive caption, refine it with follow-ups, filter by attributes, and add visualizations to your canvas or save them to a watchlist. Both features work across subject areas and datasets. Also built an automated regression pipeline that cut manual QA by 80%, led end-to-end delivery of speech interactions from prototype to rollout, shipped a platform-wide visualization API adopted by three teams, and built an internal knowledge base that cut time to first commit by 40%.',
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
    summary: 'Built an automated NLP extraction pipeline for SEC filing analysis, cutting manual processing from days to hours. Migrated data workflows to Presto SQL and AWS Glue, improving query performance by 50% and streamlining data access for the sales operations team.',
    tags:    ['Python', 'Presto SQL', 'AWS Glue', 'NLP'],
  },
  {
    company: 'Visa Inc.',
    role:    'Software Engineer Intern',
    period:  'May 2019 – Aug 2019',
    summary: 'Designed and shipped full stack infrastructure that let engineers run remote code on legacy IBM systems, built with React, Node.js, and MongoDB. Saved on-call engineers 30 minutes per shift on average and reached 28 internal MAU by departure.',
    tags:    ['React', 'Node.js', 'MongoDB'],
  },
]

const SKILL_ROWS = [
  { category: 'Languages',       items: ['TypeScript', 'JavaScript', 'Java', 'Python', 'SQL', 'R', 'Go'] },
  { category: 'Frontend',        items: ['React', 'Redux', 'Knockout.js', 'Oracle JET', 'Selenium', 'DOM APIs', 'SCSS'] },
  { category: 'Backend & Infra', items: ['REST APIs', 'Node.js', 'MongoDB', 'ElasticSearch', 'Jenkins', 'Docker', 'AWS', 'OCI'] },
  { category: 'Specialties',     items: ['LLM integration', 'Conversational analytics', 'Feature-flagged rollouts', 'Component architecture', 'Automated validation', 'Full stack delivery'] },
]

// ─── Shared primitives ────────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return (
    <p
      className="text-orange-500 font-semibold uppercase tracking-[0.18em] mb-5"
      style={{ fontSize: '0.65rem' }}
    >
      {label}
    </p>
  )
}

// Scroll-triggered reveal — works with the fixed overlay's viewport
function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Experience card ──────────────────────────────────────────────────────────

function ExpCard({ exp, index }: { exp: (typeof EXPERIENCE)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      className="relative py-8 border-b border-gray-100 pl-5"
    >
      {/* Decorative left accent line */}
      <div className="absolute left-0 top-8 bottom-8 w-[2px] bg-gray-100 rounded-full" />
      {index === 0 && (
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: 36 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="absolute left-0 top-8 w-[2px] bg-gradient-to-b from-orange-400 to-transparent rounded-full"
        />
      )}

      {/* Header row */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-1.5">
        <span className="font-semibold text-gray-900 text-base">{exp.company}</span>
        <span className="font-mono text-gray-400" style={{ fontSize: '0.75rem' }}>{exp.period}</span>
      </div>

      {/* Role */}
      <p
        className="uppercase tracking-widest text-orange-500 font-medium mb-3"
        style={{ fontSize: '0.65rem' }}
      >
        {exp.role}
      </p>

      {/* Summary */}
      <p className="text-gray-500 leading-relaxed mb-4" style={{ fontSize: '0.9375rem' }}>
        {exp.summary}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {exp.tags.map(tag => (
          <span
            key={tag}
            className="px-2.5 py-0.5 rounded-full bg-gray-50 border border-gray-200 text-gray-500 font-medium"
            style={{ fontSize: '0.7rem' }}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Skills row ───────────────────────────────────────────────────────────────

function SkillRow({ category, items, index }: { category: string; items: string[]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -14 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: 'easeOut' }}
      className="py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-8"
    >
      <span
        className="flex-shrink-0 sm:w-40 uppercase tracking-[0.16em] text-gray-400 font-semibold"
        style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)', paddingTop: '3px' }}
      >
        {category}
      </span>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {items.map(skill => (
          <span key={skill} className="text-gray-700" style={{ fontSize: '1rem' }}>
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Decorative section number ────────────────────────────────────────────────

function BigNumber({
  n,
  gradient,
  label,
}: {
  n: string
  gradient: string
  label: string
}) {
  return (
    <div className="hidden md:block">
      <div
        className="font-black leading-none select-none"
        style={{
          fontSize: '5rem',
          background: gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          opacity: 0.2,
        }}
      >
        {n}
      </div>
      <div className="w-8 h-px bg-gray-200 mt-5 mb-4" />
      <p
        className="uppercase tracking-widest text-gray-400 font-semibold"
        style={{ fontSize: '0.85rem' }}
      >
        {label}
      </p>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  // The div that wraps this component and handles scrolling
  scrollContainer: React.RefObject<HTMLDivElement | null>
}

export default function AboutPage({ scrollContainer }: Props) {
  const line1Ref      = useRef<HTMLDivElement>(null)
  const subtitleRef   = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)

  // Track scroll within the custom overflow container for hero parallax
  const { scrollYProgress } = useScroll({
    container: scrollContainer as React.RefObject<HTMLElement>,
  })

  // Hero fades out and lifts slightly as the user scrolls into the narrative
  const heroOpacity = useTransform(scrollYProgress, [0, 0.20], [1, 0])
  const heroY       = useTransform(scrollYProgress, [0, 0.20], [0, -56])

  // ── GSAP hero entrance ─────────────────────────────────────────────────────
  // Fires when this component mounts (blob overlay is already fading in).
  // 0.55s delay lets the 0.45s overlay fade-in finish before text appears.
  // Name and headline both slide up — they read as a lockup, not label + title.
  useEffect(() => {
    gsap.set([subtitleRef.current, scrollHintRef.current], { opacity: 0 })
    gsap.set(line1Ref.current, { opacity: 0, y: 56 })

    const tl = gsap.timeline({ delay: 0.55 })

    tl.to(line1Ref.current,      { opacity: 1, y: 0, duration: 0.82, ease: 'power3.out' })
      .to(subtitleRef.current,   { opacity: 1, duration: 0.55, ease: 'power2.out' }, '-=0.30')
      .to(scrollHintRef.current, { opacity: 1, duration: 0.40, ease: 'power1.out' }, '+=0.10')

    return () => { tl.kill() }
  }, [])

  // Shared horizontal padding — consistent across all sections
  const px = 'px-8 sm:px-12 md:px-20 lg:px-28'

  return (
    <div className="w-full bg-white">

      {/* ── HERO ── sticky inside a tall container → acts as a pinned section */}
      {/*  The outer container is 185vh tall. The inner element is sticky top-0 */}
      {/*  and h-screen, so it stays fixed for the first ~85vh of scroll before  */}
      {/*  the next section scrolls into view underneath it.                     */}
      <div style={{ height: '185vh' }}>
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className={`sticky top-0 h-screen flex flex-col justify-center ${px} overflow-hidden`}
        >
          {/* Name as the main headline */}
          <div
            ref={line1Ref}
            className="font-extrabold text-gray-900 leading-[0.88] tracking-tight"
            style={{ fontSize: 'clamp(3.6rem, 9.5vw, 8rem)' }}
          >
            Christian Alcala
          </div>

          {/* Subtitle tags */}
          <div ref={subtitleRef} className="mt-9 flex flex-wrap items-center gap-3">
            {['San Francisco', 'Full-Stack', 'AI / Product'].map((tag, i) => (
              <span key={tag} className="flex items-center gap-3">
                {i > 0 && (
                  <span className="w-1 h-1 rounded-full bg-gray-200 inline-block" />
                )}
                <span className="text-gray-400" style={{ fontSize: '0.875rem' }}>
                  {tag}
                </span>
              </span>
            ))}
          </div>

          {/* Scroll hint */}
          <div
            ref={scrollHintRef}
            className={`absolute bottom-10 left-8 sm:left-12 md:left-20 lg:left-28 flex items-center gap-2`}
          >
            <div className="w-6 h-px bg-gray-300" />
            <span
              className="uppercase tracking-widest text-gray-400"
              style={{ fontSize: '0.62rem' }}
            >
              Scroll
            </span>
          </div>
        </motion.div>
      </div>

      {/* ── NARRATIVE ──────────────────────────────────────────────────────── */}
      <section className={`${px} pb-28 md:pb-40`}>
        <div className="grid md:grid-cols-[160px_1fr] gap-10 md:gap-16 max-w-5xl">

          <FadeUp delay={0.05}>
            <BigNumber
              n="01"
              gradient="linear-gradient(135deg, #e8105a 0%, #ff7700 100%)"
              label="Who I am"
            />
          </FadeUp>

          <div className="space-y-6">
            <FadeUp delay={0.08}>
              <p className="text-gray-700 leading-relaxed" style={{ fontSize: '1.0625rem' }}>
                For nearly three years I was the primary engineer on Oracle&apos;s two main AI features:{' '}
                <span className="text-gray-900 font-medium">Homepage Ask</span> and{' '}
                <span className="text-gray-900 font-medium">Workbook Assistant</span>.
                Homepage Ask lets you type a question from the analytics homepage and get a live
                dashboard back. Ask it to find workbooks a colleague modified last month, or to build
                a profitability report from scratch; it does both, and you can keep the conversation
                going with follow-ups. Workbook Assistant brings the same thing inside the workbook:
                natural language in, charts out, no query writing required. Those two features ended
                up in front of 500k+ users at more than 2,100 companies.
              </p>
            </FadeUp>
            <FadeUp delay={0.13}>
              <p className="text-gray-700 leading-relaxed" style={{ fontSize: '1.0625rem' }}>
                Along the way I built systems to make sure those answers were actually correct, led
                voice interaction delivery end to end, and shipped shared infrastructure that
                unblocked three other teams. The stuff that doesn&apos;t make the demo reel but
                matters at enterprise scale.
              </p>
            </FadeUp>
            <FadeUp delay={0.18}>
              <p className="text-gray-700 leading-relaxed" style={{ fontSize: '1.0625rem' }}>
                My Berkeley degree focused on Inequalities in Society, race, class, gender,
                algorithms, public policy. That shapes how I think about every product decision.
                Outside of that I play soccer, run, and build side projects, usually UI work,
                sometimes for fun, sometimes for small businesses. Same instincts, different context.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ─────────────────────────────────────────────────────── */}
      <section className={`${px} py-24 md:py-36`}>
        <FadeUp>
          <SectionLabel label="Experience" />
          <h2
            className="font-bold text-gray-900 mb-10"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}
          >
            Where I&apos;ve worked
          </h2>
        </FadeUp>

        <div className="max-w-3xl">
          {EXPERIENCE.map((exp, i) => (
            <ExpCard key={exp.company} exp={exp} index={i} />
          ))}
        </div>
      </section>

      {/* ── SKILLS ─────────────────────────────────────────────────────────── */}
      <section className={`${px} py-24 md:py-36 bg-gray-50 border-y border-gray-100`}>
        <FadeUp>
          <SectionLabel label="Skills" />
          <h2
            className="font-bold text-gray-900 mb-10"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}
          >
            What I work with
          </h2>
        </FadeUp>
        <div className="max-w-4xl border-t border-gray-100">
          {SKILL_ROWS.map((row, i) => (
            <SkillRow key={row.category} category={row.category} items={row.items} index={i} />
          ))}
        </div>
      </section>

      {/* ── EDUCATION ──────────────────────────────────────────────────────── */}
      <section className={`${px} py-24 md:py-36 bg-gray-50 border-t border-gray-100`}>
        <FadeUp>
          <SectionLabel label="Education" />
          <h2
            className="font-bold text-gray-900 mb-10"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}
          >
            Where I studied
          </h2>
        </FadeUp>

        <div className="grid sm:grid-cols-2 gap-5 max-w-3xl">
          <FadeUp delay={0.06}>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 h-full">
              <p
                className="text-orange-500 font-semibold uppercase tracking-widest mb-2"
                style={{ fontSize: '0.65rem' }}
              >
                2021 – 2023
              </p>
              <h3 className="font-bold text-gray-900 text-lg mb-1.5">
                University of Southern California
              </h3>
              <p className="text-gray-500 text-sm">M.S. Computer Science</p>
            </div>
          </FadeUp>

          <FadeUp delay={0.12}>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 h-full">
              <p
                className="text-orange-500 font-semibold uppercase tracking-widest mb-2"
                style={{ fontSize: '0.65rem' }}
              >
                2015 – 2019
              </p>
              <h3 className="font-bold text-gray-900 text-lg mb-1.5">UC Berkeley</h3>
              <p className="text-gray-500 text-sm mb-3">B.A. Data Science</p>
              <p className="text-gray-400 leading-relaxed" style={{ fontSize: '0.8125rem' }}>
                Domain emphasis: Inequalities in Society. Algorithms, public policy, race, class,
                gender, and the ethics of data.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  )
}
