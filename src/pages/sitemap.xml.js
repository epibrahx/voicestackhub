import tools from '../data/tools.json';
import { SITE_URL } from '../../site.config.mjs';
export function GET() {
  const paths = ['/', '/submit/', '/newsletter/', ...tools.map((t) => `/tools/${t.slug}/`)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`).join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'content-type': 'application/xml' } });
}
