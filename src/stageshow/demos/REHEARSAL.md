# Rehearsal: Onzio homepage demo

Gold: `hero-demo` (a second window coming forward at the payoff) and `form-error` (button states in one slot, plays once). Kept the well, the crop and the play-once pacing. The admin's nav, dashboard copy and match panel come from the real Onzio admin; the public site uses Diverse City FC's own look.

Beats: Dashboard, Upcoming fixtures, Schedule, open the match, type over TBA, Save changes, the club site comes forward, its Next match changes. About 11s, then it holds.

Captured: 592 and 342 wide on the demo route, the homepage at desktop and phone widths, and a production build.

Film
- The gate reports 6 `kit override: .ss-phone...` lines. These are false alarms: the checker can't tell the kit's own `phone.css` from demo CSS once Next bundles them, and no demo CSS mentions `.ss-phone`.
- Coverage reads `inconclusive` because of sampling gaps on a heavily loaded machine, so motion during those gaps wasn't judged.
- Remaining candidates that stand: `jump` and `settle snap` on typed text, `half-pixel glyph` on icons in pages that rise 8px, and `hard edge` on the sidebar's opening group.

Placeholder: `public/demos/onzio-opening-*.jpg` are the demo's opening frame, shown behind the iframe while its JavaScript loads. Re-capture them if the Dashboard screen changes.

Kit changes: `parts/Icon.tsx` draws icons.download glyphs instead of lucide, and `stage.tsx` waits for 60% of the stage to be in view.

Assumptions
- The fixture is copied from diversecityfc.com as of 2026-10-31 and is hard-coded.
- The schedule's other rows are placeholder bars. The panel simplifies the real match form.

Not checked
- The fresh-eye review in `references/review.md`.
- Safari, and real touch devices.
- `--states` sheets.
- Playback at speed by a person: frames were read from contact sheets.
