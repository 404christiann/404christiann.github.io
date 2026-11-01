import { Bar, Collapse, Field, Stage, States, Window, type Act } from '../kit'
import { AdminIcon } from './icons'
import './onzio.css'

// Onzio's two sides in one story. A club administrator goes from the Dashboard
// to the Schedule, opens the next match and names the opponent. Saving brings
// the club's public site forward, and its Next match section changes. The nav,
// dashboard copy and match panel follow the real admin; the fixture is Diverse
// City FC's real one.

type Save = 'idle' | 'busy' | 'done'
type S = { page: 'dashboard' | 'schedule'; panel: boolean; opponent: string; focused: boolean; save: Save; site: boolean; live: boolean }

const initial: S = { page: 'dashboard', panel: false, opponent: 'TBA', focused: false, save: 'idle', site: false, live: false }
const poster: S = { page: 'schedule', panel: true, opponent: 'Portland FC', focused: false, save: 'done', site: true, live: true }

const CARDS = [
  { id: 'website', icon: 'website', title: 'Website updates', text: 'Manage your club content, news and pages.' },
  { id: 'fixtures', icon: 'calendar', title: 'Upcoming fixtures', text: 'View and manage your upcoming matches.' },
  { id: 'forms', icon: 'people', title: 'Registration forms', text: 'Manage player registrations and club forms.' },
] as const

const COMPETITION = ['Roster', 'Schedule', 'Stats', 'Standings']

async function script(a: Act<S>) {
  await a.wait(1300)
  a.mark('dashboard')
  await a.click({ at: 'card-fixtures', x: 0.9, y: 0.5 })
  a.put({ page: 'schedule' })
  await a.wait(800)
  a.mark('match')
  await a.click({ at: 'match', x: 0.86, y: 0.5 })
  a.put({ panel: true })
  await a.wait(500)
  a.mark('edit')
  await a.click({ at: 'opponent', x: 0.85, y: 0.5 })
  a.put({ focused: true })
  await a.wait(200)
  await a.type('opponent', 'Portland FC', { interval: 60 })
  await a.wait(400)
  a.mark('save')
  await a.click({ at: 'save', x: 0.88, y: 0.7 })
  a.put({ focused: false, save: 'busy' })
  await a.wait(200)
  a.put({ site: true })
  await a.wait(1000)
  a.mark('live')
  a.put({ save: 'done', live: true })
  await a.move(a.layout === 'compact' ? { x: 280, y: 320 } : { x: 520, y: 404 })
  await a.wait(3000)
}

export default function OnzioDemo() {
  return (
    <Stage
      width={592}
      height={420}
      compact={{ below: 560, width: 342, height: 340 }}
      initial={initial}
      poster={poster}
      script={script}
      play="once"
      cursor={{ at: { wide: { x: 112, y: 398 }, compact: { x: 300, y: 300 } } }}
      className="oz"
    >
      {(s, _rect, layout) => (
        <>
          <Window url="diversecityfc.com/admin" urlShape="pill" className="oz-window">
            <div className="oz-app">
              <div className="oz-head">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/demos/diverse-city-crest.png" alt="" width={30} height={30} />
                <div className="oz-head__club">
                  <div className="oz-head__name">Diverse City FC</div>
                  <div className="oz-head__role">Club administration</div>
                </div>
                <span className="oz-head__bell"><AdminIcon name="bell" /></span>
                <span className="oz-head__me">C</span>
              </div>
              <div className="oz-columns">
                {layout === 'wide' && <Sidebar page={s.page} />}
                <div className="oz-main">
                  <Dashboard on={s.page === 'dashboard'} wide={layout === 'wide'} />
                  <Schedule on={s.page === 'schedule'} live={s.live} />
                  <MatchPanel s={s} wide={layout === 'wide'} />
                </div>
              </div>
            </div>
          </Window>
          <ClubSite s={s} wide={layout === 'wide'} />
        </>
      )}
    </Stage>
  )
}

function Sidebar({ page }: { page: S['page'] }) {
  const onSchedule = page === 'schedule'
  return (
    <div className="oz-side">
      <div className="oz-nav" data-on={!onSchedule || undefined}><AdminIcon name="dashboard" /><span>Dashboard</span></div>
      <div className="oz-nav"><AdminIcon name="website" /><span>Website</span><i><AdminIcon name="caretDown" size={14} /></i></div>
      <div className="oz-nav"><AdminIcon name="competition" /><span>Competition</span><i><AdminIcon name="caretDown" size={14} /></i></div>
      <Collapse open={onSchedule}>
        <div className="oz-subnav">
          {COMPETITION.map((label) => (
            <div key={label} className="oz-subnav__item" data-on={(label === 'Schedule' && onSchedule) || undefined}>{label}</div>
          ))}
        </div>
      </Collapse>
      <div className="oz-nav"><AdminIcon name="registrations" /><span>Registrations</span></div>
      <div className="oz-nav"><AdminIcon name="analytics" /><span>Analytics</span></div>
      <div className="oz-nav"><AdminIcon name="settings" /><span>Club Settings</span><i><AdminIcon name="caretDown" size={14} /></i></div>
      <div className="oz-nav"><AdminIcon name="payments" /><span>Payments</span></div>
    </div>
  )
}

function Dashboard({ on, wide }: { on: boolean; wide: boolean }) {
  return (
    <div className="oz-page" data-on={on || undefined}>
      <div className="oz-title">Welcome back</div>
      <div className="oz-sub">Here&apos;s what&apos;s happening at your club.</div>
      <div className="oz-cards">
        {CARDS.filter((card) => wide || card.id !== 'forms').map((card) => (
          <div key={card.id} className="oz-card" data-target={`card-${card.id}`} data-cursor="pointer">
            <span className="oz-card__icon" data-tone={card.id}><AdminIcon name={card.icon} /></span>
            <span className="oz-card__copy">
              <span className="oz-card__title">{card.title}</span>
              <span className="oz-card__text">{card.text}</span>
            </span>
            <AdminIcon name="caretRight" />
          </div>
        ))}
      </div>
      {wide && (
        <>
          <div className="oz-label">Quick Actions</div>
          <div className="oz-quick">
            <span className="oz-quick__item"><AdminIcon name="people" />Manage Registrations</span>
            <span className="oz-quick__item"><AdminIcon name="website" />Edit Website</span>
          </div>
        </>
      )}
    </div>
  )
}

function Schedule({ on, live }: { on: boolean; live: boolean }) {
  return (
    <div className="oz-page" data-on={on || undefined}>
      <div className="oz-page__top">
        <div className="oz-page__name">
          <div className="oz-title">Schedule</div>
          <div className="oz-sub">Spring 2026</div>
        </div>
        <span className="oz-add"><AdminIcon name="plus" size={14} />Add match</span>
      </div>
      <div className="oz-matches">
        <div className="oz-match" data-target="match" data-cursor="pointer">
          <span className="oz-crest">
            <States value={live ? 'live' : 'tba'} states={{ tba: '?', live: 'P' }} />
          </span>
          <span className="oz-match__copy">
            <span className="oz-match__line">
              <States align="start" value={live ? 'live' : 'tba'} states={{ tba: 'vs TBA', live: 'vs Portland FC' }} />
              <span className="oz-home">Home</span>
            </span>
            <span className="oz-match__meta">Aug 9 · 7:00 PM</span>
            <span className="oz-match__meta">Delta Park</span>
          </span>
        </div>
        {[96, 72, 88].map((w) => (
          <div key={w} className="oz-match oz-match--filler">
            <Bar w={32} h={32} r={16} tone={1} />
            <span className="oz-match__copy">
              <Bar w={w} h={7} tone={2} />
              <Bar w={w - 24} h={5} tone={1} />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MatchPanel({ s, wide }: { s: S; wide: boolean }) {
  return (
    <div className="oz-panel" data-open={s.panel || undefined}>
      <div className="oz-panel__head">
        <span>vs {s.opponent}</span>
        <AdminIcon name="close" size={14} />
      </div>
      <div className="oz-panel__fields">
        <Field label="Opponent" value={s.opponent} focused={s.focused} box={{ 'data-target': 'opponent', 'data-cursor': 'ibeam' }} />
        <div className="oz-pair">
          <Field label="Date" value="Aug 9, 2026" />
          <Field label="Time" value="7:00 PM" />
        </div>
        {wide && <Field label="Venue" value="Delta Park" />}
      </div>
      <div className="oz-panel__foot">
        <span className="oz-cancel">Cancel</span>
        <span className="oz-save" data-target="save" data-cursor="pointer" data-state={s.save}>
          <States value={s.save} states={{ idle: 'Save changes', busy: 'Saving…', done: 'Saved' }} />
        </span>
      </div>
    </div>
  )
}

// What the public sees: the club's own navy, red and heavy italic, not Onzio's green
function ClubSite({ s, wide }: { s: S; wide: boolean }) {
  return (
    <Window url="diversecityfc.com" urlShape="pill" className="oz-site" data-show={s.site || undefined}>
      <div className="oz-site__page">
        <div className="oz-site__nav">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/demos/diverse-city-crest.png" alt="" width={30} height={30} />
          <div className="oz-site__links">
            <span data-on>Home</span>
            <span>Roster</span>
            <span>Schedule</span>
            {wide && <span>Programs</span>}
          </div>
        </div>
        {wide && (
          <div className="oz-site__hero">
            <div className="oz-site__one">One club</div>
            <div className="oz-site__two">One community</div>
          </div>
        )}
        <div className="oz-next">
          <div className="oz-next__title">Next match</div>
          <div className="oz-next__row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/demos/diverse-city-crest.png" alt="" width={46} height={46} />
            <span className="oz-next__vs">VS</span>
            <span className="oz-next__disc">
              <States value={s.live ? 'live' : 'tba'} states={{ tba: <span className="oz-next__tba">TBA</span>, live: 'P' }} />
            </span>
            <div className="oz-next__copy">
              <States
                align="start"
                value={s.live ? 'live' : 'tba'}
                states={{
                  tba: <span className="oz-next__name oz-next__name--tba">To be announced</span>,
                  live: <span className="oz-next__name">Portland FC</span>,
                }}
              />
              <div className="oz-next__meta">August 9, 7:00 PM</div>
              <div className="oz-next__meta">Delta Park</div>
            </div>
          </div>
        </div>
      </div>
    </Window>
  )
}
