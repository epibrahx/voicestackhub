# Site paused (reversible)

VoiceStackHub is in **offline mode**: visitors only see the homepage message; form APIs return HTTP 410; daily scheduled rebuilds are disabled.

## Restore the live site

1. Move pages back from `src/pages/_paused/` to `src/pages/` (restore `index.astro`, `submit.astro`, `newsletter.astro`, `tools/[slug].astro`, `404.astro`, `sitemap.xml.js`, `robots.txt.js`).
2. Replace `src/pages/index.astro` with the version from `_paused/index.astro` (or delete the offline page after moving).
3. Revert `functions/api/submit.js` and `functions/api/subscribe.js` from git history (or restore full handlers).
4. In `package.json`, set `"build"` back to `node scripts/fetch-tools.mjs && astro build` (optional: keep `build:live` as an alias).
5. Uncomment the `schedule` block in `.github/workflows/daily-rebuild.yml`.
6. Remove `public/_redirects` if no longer needed.
7. Delete this file when done.
