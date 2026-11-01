'use client'

import { Analytics } from '@vercel/analytics/next'
import { usePathname } from 'next/navigation'

// The homepage embeds /demos/* in iframes; those aren't visits.
export default function SiteAnalytics() {
  const pathname = usePathname()
  if (pathname.startsWith('/demos/')) return null
  return <Analytics />
}
