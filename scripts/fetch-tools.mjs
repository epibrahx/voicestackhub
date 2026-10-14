// Build step: read Tools from Airtable (token only via env var), keep slugs stable.
import fs from 'node:fs';
const BASE = process.env.AIRTABLE_BASE_ID || 'appcrH3rMEuIijRZ7';
const TABLE = 'Tools';
const token = process.env.AIRTABLE_TOKEN;
if (!token) { console.error('AIRTABLE_TOKEN env var is required'); process.exit(1); }

const clean = (v) => (typeof v === 'string' ? v.trim() : v ?? '');
export const slugify = (s) => s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'tool';

let records = [], offset;
do {
  const u = new URL(`https://api.airtable.com/v0/${BASE}/${encodeURIComponent(TABLE)}`);
  u.searchParams.set('pageSize', '100');
  if (offset) u.searchParams.set('offset', offset);
  const r = await fetch(u, { headers: { Authorization: `Bearer ${token}` } });
  if (!r.ok) { console.error('Airtable error', r.status, await r.text()); process.exit(1); }
  const j = await r.json(); records.push(...j.records); offset = j.offset;
} while (offset);

const slugFile = new URL('../src/data/slugs.json', import.meta.url);
const slugs = fs.existsSync(slugFile) ? JSON.parse(fs.readFileSync(slugFile, 'utf8')) : {};
const used = new Set(Object.values(slugs));
let added = 0;
records.sort((a, b) => a.createdTime.localeCompare(b.createdTime) || a.id.localeCompare(b.id));
for (const rec of records) {
  if (slugs[rec.id]) continue;
  const base = slugify(clean(rec.fields.Name) || rec.id);
  let s = base, i = 2;
  while (used.has(s)) s = `${base}-${i++}`;
  slugs[rec.id] = s; used.add(s); added++;
}
fs.writeFileSync(slugFile, JSON.stringify(slugs, null, 2) + '\n');

const tools = records.map((rec) => {
  const f = rec.fields;
  return {
    id: rec.id, slug: slugs[rec.id],
    name: clean(f.Name), url: clean(f.Website_URL), tagline: clean(f.One_Line_Tagline),
    category: clean(f.Category), pricing: clean(f.Pricing_Model),
    targetUsers: clean(f.Target_Users), review: clean(f.SEO_Review_Pros_and_Cons),
  };
}).filter((t) => t.name).sort((a, b) => a.name.localeCompare(b.name));
fs.writeFileSync(new URL('../src/data/tools.json', import.meta.url), JSON.stringify(tools, null, 2));
console.log(`Fetched ${tools.length} tools (${added} new slugs).`);
