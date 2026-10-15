import { CATEGORIES, json, isEmail, isUrl, rateLimited, readBody, createRecord, verifyTurnstile, pickUtmFields } from '../../lib/shared.js';
export async function onRequestPost({ request, env }) {
  const b = await readBody(request);
  if (b.hp_token) return json(200, { ok: true }); // honeypot: silent discard, no id
  if (rateLimited(request, 'submit', 5)) return json(429, { error: 'Too many submissions. Please try again later.' });
  if (!(await verifyTurnstile(request, env, b['cf-turnstile-response']))) return json(403, { error: 'Human verification failed. Please complete the check above the button and try again.' });
  const s = (v, n) => (typeof v === 'string' ? v.trim().slice(0, n) : '');
  const f = { toolName: s(b.toolName, 100), websiteUrl: s(b.websiteUrl, 500), category: s(b.category, 60), shortDescription: s(b.shortDescription, 500), contactEmail: s(b.contactEmail, 254) };
  if (!f.toolName || !f.websiteUrl || !f.category || !f.shortDescription || !f.contactEmail) return json(400, { error: 'Please fill in all required fields.' });
  if (!isUrl(f.websiteUrl)) return json(400, { error: 'Please enter a valid website URL (starting with https://).' });
  if (!isEmail(f.contactEmail)) return json(400, { error: 'Please enter a valid email address.' });
  if (!CATEGORIES.includes(f.category)) return json(400, { error: 'Please choose a valid category.' });
  const r = await createRecord(env, 'Submissions', { 'Tool Name': f.toolName, 'Website URL': f.websiteUrl, 'Category': f.category, 'Short Description': f.shortDescription, 'Contact Email': f.contactEmail, ...pickUtmFields(b) });
  if (!r.ok) return json(502, { error: 'Could not save right now. Please try again later.' });
  return json(200, { ok: true, id: r.id });
}
export const onRequest = () => json(405, { error: 'Method not allowed' });
