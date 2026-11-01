import { Icon, Menu, Popover, Stage, Window, type Act } from '../kit'
import './diverse-city.css'

// The club's public site: the homepage's identity, then the Schedule menu to
// Fixtures. All the words and the fixture are on diversecityfc.com; the row
// comes in last because it is the thing a supporter came for.

type S = { menu: boolean; page: 'home' | 'fixtures' }

const initial: S = { menu: false, page: 'home' }
const poster: S = { menu: false, page: 'fixtures' }

async function script(a: Act<S>) {
  await a.wait(1400)
  a.mark('menu')
  await a.click({ at: 'schedule', x: 0.8, y: 0.6 })
  a.put({ menu: true })
  await a.wait(450)
  a.mark('pick')
  await a.click({ at: 'fixtures', x: 0.8, y: 0.5 })
  a.put({ page: 'fixtures' })
  await a.wait(120)
  a.put({ menu: false })
  await a.move({ at: 'row', x: 0.82, y: -0.5 })
  a.mark('fixtures')
  await a.wait(2600)
}

export default function DiverseCityDemo() {
  return (
    <Stage
      width={592}
      height={368}
      compact={{ below: 560, width: 342, height: 324 }}
      initial={initial}
      poster={poster}
      script={script}
      play="once"
      cursor={{ at: { wide: { x: 500, y: 300 }, compact: { x: 300, y: 300 } } }}
      className="dc"
    >
      {(s, rect, layout) => {
        const anchor = rect('schedule')
        return (
          <>
            <Window url="diversecityfc.com" urlShape="pill" className="dc-window">
              <div className="dc-site">
                <div className="dc-nav">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/demos/diverse-city-crest.png" alt="" width={36} height={36} />
                  <div className="dc-links">
                    <span className="dc-link" data-on={s.page === 'home' || undefined}>Home</span>
                    {layout === 'wide' && <span className="dc-link">Roster</span>}
                    <span className="dc-link" data-on={s.page === 'fixtures' || undefined} data-target="schedule" data-cursor="pointer" data-open={s.menu || undefined}>
                      Schedule
                      <Icon name="chevron-down" size={12} />
                    </span>
                    <span className="dc-link">Programs<Icon name="chevron-down" size={12} /></span>
                    {layout === 'wide' && <span className="dc-link">Store</span>}
                  </div>
                </div>

                <div className="dc-pages">
                  <div className="dc-page dc-home" data-on={s.page === 'home' || undefined}>
                    <div className="dc-hero__copy">
                      <div className="dc-hero__one">One club</div>
                      <div className="dc-hero__two">One community</div>
                      <p className="dc-hero__text">An inclusive, community-driven soccer club and pro academy developing players of all abilities.</p>
                      <div className="dc-hero__actions">
                        <span className="dc-action dc-action--red">Explore our programs</span>
                        <span className="dc-action">Discover the club</span>
                      </div>
                    </div>
                  </div>

                  <div className="dc-page dc-fixtures" data-on={s.page === 'fixtures' || undefined}>
                    <div className="dc-season">Spring 2026 season</div>
                    <div className="dc-title">Fixtures</div>
                    <div className="dc-rule" />
                    <div className="dc-head">
                      <span>Date · Time</span>
                      <span>Opponent</span>
                    </div>
                    <div className="dc-row" data-target="row">
                      <div className="dc-when">
                        <div className="dc-date">August 9, 2026</div>
                        <div className="dc-time">7:00 PM</div>
                      </div>
                      <span className="dc-disc">P</span>
                      <div className="dc-opponent">
                        <div className="dc-opponent__name">Portland FC</div>
                        <div className="dc-opponent__venue">Delta Park</div>
                      </div>
                      {layout === 'wide' && <span className="dc-side">Home</span>}
                    </div>
                    <div className="dc-note">Match details and venues are subject to change.</div>
                  </div>
                </div>
              </div>
            </Window>

            <Popover show={s.menu} origin="top" className="dc-menu" style={{ left: anchor.x - 6, top: anchor.y + anchor.height + 8 }}>
              <Menu items={['Fixtures', 'Tryouts']} targets={['fixtures', 'tryouts']} />
            </Popover>
          </>
        )
      }}
    </Stage>
  )
}
