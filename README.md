# 404christiann.github.io

Christian Alcala's personal website, hosted on Vercel at https://404christian.com/.

## How the site works

The homepage is one hand-written HTML file, `public/founderfolio-apple.html`. `next.config.ts` rewrites `/` to that file, so the browser URL stays at the root. Edit the homepage's content and styles there. Its images and their sources are in `public/founderfolio-assets/`.

Next.js only serves the rewrite and the demo pages:

- `src/app/demos/[name]/` renders each demo as its own page, which the homepage embeds in an iframe. These pages are `noindex`.
- `src/stageshow/demos/` holds the demos.
- `src/stageshow/kit/` is a copy of the Stageshow kit with two local changes, listed in `src/stageshow/demos/REHEARSAL.md`. ESLint ignores this folder.
- `src/components/SiteAnalytics.tsx` adds Vercel Analytics and skips `/demos/*`, so iframes don't count as visits.

The earlier WebGL homepage is in git history. To see it, check out commit `06878e0`.

## Run it

Requires Node 20 or newer.

```bash
npm install
npm run dev
```

Before opening a pull request, run:

```bash
npm run lint
npm run build
```
