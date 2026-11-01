import { Collapse, Icon, Stage, Window, type Act } from '../kit'
import './ground-work.css'

// A visitor deciding whether to reach out: the practice's first impression,
// then the FAQ, then the question people actually need answered. The words and
// the price are the live site's own.

type S = { page: 'home' | 'faq'; open: boolean }

const initial: S = { page: 'home', open: false }
const poster: S = { page: 'faq', open: true }

const QUESTIONS = ['Do you accept insurance?', 'How long are sessions and how often will we meet?', 'Is therapy online only?', 'What is a Good Faith Estimate?']

async function script(a: Act<S>) {
  await a.wait(1500)
  a.mark('faq')
  await a.click({ at: 'faq', x: 1.2, y: 1.15 })
  a.put({ page: 'faq' })
  await a.wait(600)
  a.mark('question')
  await a.click({ at: 'cost', x: 0.86, y: 0.5 })
  a.put({ open: true })
  await a.move({ at: 'cost', x: 0.86, y: 2.6 })
  a.mark('answer')
  await a.wait(2800)
}

export default function GroundWorkDemo() {
  return (
    <Stage
      width={592}
      height={368}
      compact={{ below: 560, width: 342, height: 324 }}
      initial={initial}
      poster={poster}
      script={script}
      play="once"
      cursor={{ at: { wide: { x: 300, y: 300 }, compact: { x: 110, y: 300 } } }}
      className="gw"
    >
      {(s, _rect, layout) => (
        <Window url="groundwork-therapy-website.vercel.app" urlShape="pill" className="gw-window">
          <div className="gw-site" data-page={s.page}>
            <div className="gw-page gw-home" data-on={s.page === 'home' || undefined}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="gw-portrait" src="/demos/ground-work-home.jpg" alt="" />
              <div className="gw-hero">
                <div className="gw-hero__title">Where insight becomes change.</div>
                <p className="gw-hero__text">I&apos;m a licensed therapist working with teens and adults in California. Grounded in ACT, CBT &amp; DBT.</p>
                <span className="gw-hero__link">Let&apos;s connect</span>
              </div>
            </div>

            <div className="gw-page gw-faq" data-on={s.page === 'faq' || undefined}>
              <div className="gw-eyebrow">Common questions</div>
              <div className="gw-faq__title">Everything you want to know.</div>
              <div className="gw-list">
                <div className="gw-q" data-target="cost" data-cursor="pointer">
                  <span>How much does a session cost?</span>
                  <span className="gw-q__mark" data-open={s.open || undefined}><Icon name="plus" size={14} /></span>
                </div>
                <Collapse open={s.open}>
                  <p className="gw-a">Sessions are $160 for a 55 minute appointment. If cost feels like a barrier, reach out. I&apos;m happy to have an honest conversation about it.</p>
                </Collapse>
                {QUESTIONS.map((q) => (
                  <div className="gw-q" key={q}>
                    <span>{q}</span>
                    <span className="gw-q__mark"><Icon name="plus" size={14} /></span>
                  </div>
                ))}
              </div>
            </div>

            <div className="gw-header">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demos/ground-work-mark.png" alt="" width={26} height={26} />
              <span className="gw-word">Ground Work</span>
              <div className="gw-pill">
                {layout === 'wide' && <span>About</span>}
                {layout === 'wide' && <span>Approach</span>}
                <span>Specialities</span>
                <span data-target="faq" data-cursor="pointer" data-on={s.page === 'faq' || undefined}>FAQ</span>
              </div>
              {layout === 'wide' && <span className="gw-connect">Connect</span>}
            </div>
          </div>
        </Window>
      )}
    </Stage>
  )
}
