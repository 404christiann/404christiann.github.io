# Rehearsal: homepage project demos

Gold: `form-error` (a form in a window, one check through its button states, plays once) and `static-card` (a card straddling a sidebar) for Onzio; `form-error` framing for the two browser demos. Kept the well, the crop and the play-once pacing. Replaced the look, words and icons with each product's own.

Beats
- Onzio: click Opponent, type over TBA, Publish, the site card changes. About 8s.
- Diverse City FC: the homepage, Schedule menu, Fixtures. About 7s.
- Ground Work Therapy: the homepage, FAQ, open the cost question. About 7s.

Captured: 592 and 342 wide on the demo routes, reduced-motion stills at 592, the homepage at 1100 and 375 wide in the dev server and at 1100 in a production build.

Film
- The gate reports 6 `kit override: .ss-phone...` lines on every demo. These are false alarms: the checker can't tell the kit's own `phone.css` from demo CSS once Next bundles them, and no demo CSS mentions `.ss-phone`. Every other never-intentional line is at 0.
- Coverage reads `inconclusive` because of sampling gaps on a heavily loaded machine, so motion during those gaps wasn't judged.
- Remaining candidates that stand: `jump` on the Opponent field (typing), `lopsided` by 3px on Publish (States holds the widest label), `uneven` on the FAQ mark (its bounding box while rotated).

Kit changes: `parts/Icon.tsx` draws icons.download glyphs instead of lucide, and `stage.tsx` waits for 60% of the stage to be in view.

Assumptions
- The fixture and the FAQ price are copied from the live sites as of 2026-10-31. They are hard-coded and won't follow later edits.
- Onzio's form fields are a simplified illustration of the admin, not a copy of its real schedule screen.

Not checked
- The fresh-eye review in `references/review.md`.
- Safari, and real touch devices.
- Production at phone width (dev server only).
- `--states` sheets.
- Playback at speed by a person: frames were read from contact sheets.
