# 404christiann.github.io

Christian Alcala’s personal website, served by Next.js on Vercel at https://404christian.com/.

## Founderfolio homepage

The approved Founderfolio design is the public homepage. `next.config.ts` rewrites `/` to the standalone page at `public/founderfolio-apple.html`, serving it directly without changing the browser URL. The same page remains accessible at `/founderfolio-apple.html`, with the root URL declared as canonical.

The page contains selected projects, experience, About copy, a dated GitHub activity snapshot, and contact links. Preview controls are removed for production. Edit content and styling in `public/founderfolio-apple.html`; brand assets and their documented sources live in `public/founderfolio-assets/`.

The earlier WebGL homepage components remain in the repository for reference and are bypassed by the root rewrite. Local design comparison files are excluded from the published site.
