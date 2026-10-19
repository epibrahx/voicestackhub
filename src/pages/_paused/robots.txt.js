import { SITE_URL } from '../../site.config.mjs';
export function GET() { return new Response(`User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${SITE_URL}/sitemap.xml\n`); }
