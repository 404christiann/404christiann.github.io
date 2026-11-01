'use client'

import dynamic from 'next/dynamic'
import type { DemoName } from './names'

// Stageshow measures the DOM as it plays, so these only render in the browser.
const DEMOS = {
  onzio: dynamic(() => import('@/stageshow/demos/OnzioDemo'), { ssr: false }),
}

export default function DemoFrame({ name }: { name: DemoName }) {
  const Demo = DEMOS[name]
  return <Demo />
}
