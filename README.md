# VoiceStackHub (static, Cloudflare Pages)

Astro static site. Tools are read from Airtable at build time; forms post to Cloudflare Pages Functions.

- Build command: `npm run build` · Output dir: `dist` · Node 20 (`.nvmrc`)
- Env vars (Cloudflare Pages > Settings > Variables, Production + Preview):
  - `AIRTABLE_TOKEN` (secret, encrypt) — used by the build script and by `functions/api/*.js`
  - `SITE_URL` — e.g. `https://epibrahx.stream` (single place for canonical/OG/sitemap; default in `site.config.mjs`)
- Slugs: `src/data/slugs.json` maps Airtable record id -> slug. Commit it. Existing slugs never change; new records get appended at build.
  Note: on Cloudflare builds, newly appended slugs aren't committed back; run `npm run build` locally and commit `slugs.json` after adding tools to make them permanent.
- Daily rebuild: `.github/workflows/daily-rebuild.yml` (cron 00:00 UTC + manual "Run workflow") POSTs repo secret `DEPLOY_HOOK_URL` (a Cloudflare Pages deploy hook).
- Rate limit in functions is in-memory per isolate: best-effort only; stops simple bursts, not distributed abuse. Honeypot field `hp_token`.
- Newsletter currently writes to Airtable `Subscribers` (Buttondown/Beehiiv not connected yet).
- Local test: put `AIRTABLE_TOKEN=...` in `.dev.vars` (gitignored), `npm run build`, `npx wrangler pages dev dist`.
