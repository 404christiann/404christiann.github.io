export const DEMO_NAMES = ['onzio', 'diverse-city', 'ground-work'] as const

export type DemoName = (typeof DEMO_NAMES)[number]

export function isDemoName(name: string): name is DemoName {
  return (DEMO_NAMES as readonly string[]).includes(name)
}
