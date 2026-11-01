import { Bar, Check, Field, Stage, States, Text, Window, type Act } from '../kit'
import { NavIcon } from './icons'
import './onzio.css'

// Onzio's promise is "publish without a developer", so the story is one edit
// landing somewhere else: club staff replace TBA with the real opponent in the
// admin, publish, and the club site's Next match card changes on its own.
// The fixture is Diverse City FC's real one; the card copies the site's section.

type S = { opponent: string; focused: boolean; publish: 'idle' | 'busy' | 'done'; live: boolean }

const initial: S = { opponent: 'TBA', focused: false, publish: 'idle', live: false }
const poster: S = { opponent: 'Portland FC', focused: false, publish: 'done', live: true }

const NAV = [
  { name: 'dashboard', label: 'Dashboard' },
  { name: 'website', label: 'Website' },
  { name: 'competition', label: 'Competition' },
] as const

async function script(a: Act<S>) {
  await a.wait(900)
  a.mark('edit')
  await a.click({ at: 'opponent', x: 0.82, y: 0.5 })
  a.put({ focused: true })
  await a.wait(250)
  await a.type('opponent', 'Portland FC', { interval: 60 })
  await a.wait(500)
  a.mark('publish')
  await a.click({ at: 'publish', x: 0.8, y: 0.6 })
  a.put({ focused: false, publish: 'busy' })
  await a.wait(1000)
  a.mark('live')
  a.put({ publish: 'done', live: true })
  await a.move({ at: 'publish', x: -0.7, y: 0.5 })
  await a.wait(2400)
}

export default function OnzioDemo() {
  return (
    <Stage
      width={592}
      height={368}
      compact={{ below: 560, width: 342, height: 340 }}
      initial={initial}
      poster={poster}
      script={script}
      play="once"
      cursor={{ at: { wide: { x: 400, y: 344 }, compact: { x: 120, y: 180 } } }}
      className="oz"
    >
      {(s, _rect, layout) => (
        <>
          <Window
            title="Fixtures"
            className="oz-window"
            sidebarWidth={layout === 'wide' ? 150 : undefined}
            sidebar={layout === 'wide' ? <Sidebar /> : undefined}
          >
            <div className="oz-main">
              <div className="oz-form">
                <Field
                  label="Opponent"
                  value={s.opponent}
                  focused={s.focused}
                  box={{ 'data-target': 'opponent', 'data-cursor': 'ibeam' }}
                />
                {layout === 'wide' && (
                  <>
                    <div className="oz-pair">
                      <Field label="Date" value="Aug 9, 2026" />
                      <Field label="Time" value="7:00 PM" />
                    </div>
                    <Field label="Venue" value="Delta Park" />
                  </>
                )}
                <span className="oz-publish" data-target="publish" data-cursor="pointer" data-state={s.publish}>
                  <States
                    value={s.publish === 'idle' ? 'idle' : 'sent'}
                    states={{
                      idle: <span className="oz-publish__label">Publish</span>,
                      // One check from pending to done, beside a label that crossfades
                      sent: (
                        <span className="oz-publish__label">
                          <Check on={s.publish === 'done'} pending={s.publish === 'busy'} size={14} />
                          <States align="start" value={s.publish === 'done' ? 'done' : 'busy'} states={{ busy: 'Publishing', done: 'Published' }} />
                        </span>
                      ),
                    }}
                  />
                </span>
              </div>
              {[58, 44, 66].map((w, i) => (
                <div key={i} className="oz-filler">
                  <Bar w={w} tone={2} />
                  <Bar w={36} tone={1} />
                </div>
              ))}
            </div>
          </Window>
          <NextMatch live={s.live} />
        </>
      )}
    </Stage>
  )
}

function Sidebar() {
  return (
    <div className="oz-side">
      <div className="oz-club">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/demos/diverse-city-crest.png" alt="" width={26} height={26} />
        <Text className="oz-club__name">Diverse City FC</Text>
      </div>
      {NAV.map((item) => (
        <div key={item.name} className="oz-nav" data-on={item.name === 'competition' || undefined}>
          <NavIcon name={item.name} />
          <Text className="oz-nav__label">{item.label}</Text>
        </div>
      ))}
    </div>
  )
}

// What the public sees: the site's own navy, red and heavy italic, not Onzio's green
function NextMatch({ live }: { live: boolean }) {
  return (
    <div className="oz-site" data-target="site">
      <div className="oz-site__bar"><span>diversecityfc.com</span></div>
      <div className="oz-site__body">
        <div className="oz-site__title">Next match</div>
        <div className="oz-versus">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/demos/diverse-city-crest.png" alt="" width={44} height={44} />
          <span className="oz-vs">VS</span>
          <span className="oz-disc">
            <States value={live ? 'live' : 'tba'} states={{ tba: <span className="oz-disc__tba">TBA</span>, live: <span>P</span> }} />
          </span>
        </div>
        <div className="oz-fixture">
          <States
            align="start"
            value={live ? 'live' : 'tba'}
            states={{
              tba: <span className="oz-fixture__name oz-fixture__name--tba">To be announced</span>,
              live: <span className="oz-fixture__name">Portland FC</span>,
            }}
          />
          <div className="oz-fixture__meta">August 9, 7:00 PM</div>
        </div>
      </div>
    </div>
  )
}
