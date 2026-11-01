// Standalone demo pages. The homepage is plain HTML, so it embeds these as iframes.

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Montserrat } from 'next/font/google'
import DemoFrame from './DemoFrame'
import { DEMO_NAMES, isDemoName } from './names'
import './demo-page.css'

const montserrat = Montserrat({ subsets: ['latin'], weight: '900', style: 'italic', variable: '--demo-montserrat' })

export const dynamicParams = false

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export function generateStaticParams() {
  return DEMO_NAMES.map((name) => ({ name }))
}

export default async function DemoPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  if (!isDemoName(name)) notFound()
  return (
    <div className={montserrat.variable}>
      <DemoFrame name={name} />
    </div>
  )
}
