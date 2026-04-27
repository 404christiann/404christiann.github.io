'use client'

// src/app/page.tsx
// Replaces the old scroll-layout home page with the blob navigation system.
// BlobNav uses vanilla Three.js (window/WebGL), so it must be SSR-disabled.

import dynamic from 'next/dynamic'

const BlobNav = dynamic(() => import('@/components/BlobNav'), { ssr: false })

export default function Home() {
  return <BlobNav />
}
