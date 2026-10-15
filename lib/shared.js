export const BASE_ID = 'appcrH3rMEuIijRZ7';
export const CATEGORIES = ['Agent Platforms','Speech APIs (STT/TTS)','Video Agents & Avatars','Frameworks & Infrastructure','Testing & Voice Apps'];
export const json = (status, obj) => new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
export const isEmail = (s) => typeof s === 'string' && s.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
export const isUrl = (s) => { try { const u = new URL(s); return u.protocol === 'https:' || u.protocol === 'http:'; } catch { return false; } };
// Best-effort per-IP rate limit: in-memory per Worker isolate. Isolates are short-lived and
// not shared across Cloudflare locations, so this only stops simple bursts, not determined abuse.
const hits = new Map();
export function rateLimited(request, key, max = 5, windowMs = 10 * 60 * 1000) {
  const ip = request.headers.get('cf-connecting-ip') || 'local';
  const k = `${key}:${ip}`, now = Date.now();
  const arr = (hits.get(k) || []).filter((t) => now - t < windowMs);
  arr.push(now); hits.set(k, arr);
  return arr.length > max;
}
export async function readBody(request) {
  const ct = request.headers.get('content-type') || '';
  if (ct.includes('application/json')) return await request.json().catch(() => ({}));
  return Object.fromEntries(await request.formData().catch(() => new FormData()));
}
export async function createRecord(env, table, fields) {
  if (!env.AIRTABLE_TOKEN) return { ok: false, status: 500 };
  const r = await fetch(`https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID || BASE_ID}/${encodeURIComponent(table)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.AIRTABLE_TOKEN}`, 'content-type': 'application/json' },
    body: JSON.stringify({ records: [{ fields }], typecast: false }),
  });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, id: j.records?.[0]?.id };
}

// Cloudflare Turnstile server-side verification.
export async function verifyTurnstile(request, env, token) {
  if (!env.TURNSTILE_SECRET) return false;
  if (typeof token !== 'string' || !token || token.length > 2048) return false;
  const fd = new FormData();
  fd.append('secret', env.TURNSTILE_SECRET);
  fd.append('response', token);
  const ip = request.headers.get('cf-connecting-ip'); if (ip) fd.append('remoteip', ip);
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: fd });
    const j = await r.json();
    return j.success === true;
  } catch { return false; }
}

// Optional UTM / landing fields from client (utm.js). Empty values omitted.
export function pickUtmFields(b) {
  const s = (v, n = 200) => (typeof v === 'string' ? v.trim().slice(0, n) : '');
  const out = {};
  const map = [
    ['utm_source', 'UTM Source'],
    ['utm_medium', 'UTM Medium'],
    ['utm_campaign', 'UTM Campaign'],
    ['utm_content', 'UTM Content'],
    ['utm_term', 'UTM Term'],
    ['landing_path', 'Landing Path'],
  ];
  for (const [k, name] of map) {
    const v = s(b[k], k === 'landing_path' ? 500 : 200);
    if (v) out[name] = v;
  }
  return out;
}
