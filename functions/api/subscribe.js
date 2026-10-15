import { json, isEmail, rateLimited, readBody, createRecord, verifyTurnstile, pickUtmFields } from '../../lib/shared.js';
export async function onRequestPost({ request, env }) {
  const b = await readBody(request);
  if (b.hp_token) return json(200, { ok: true }); // honeypot: silent discard, no id
  if (rateLimited(request, 'subscribe', 5)) return json(429, { error: 'Too many attempts. Please try again later.' });
  if (!(await verifyTurnstile(request, env, b['cf-turnstile-response']))) return json(403, { error: 'Human verification failed. Please complete the check above the button and try again.' });
  const email = typeof b.email === 'string' ? b.email.trim().toLowerCase() : '';
  if (!isEmail(email)) return json(400, { error: 'Please enter a valid email address.' });
  const r = await createRecord(env, 'Subscribers', { Email: email, ...pickUtmFields(b) });
  if (!r.ok) return json(502, { error: 'Could not subscribe right now. Please try again later.' });
  return json(200, { ok: true, id: r.id });
}
export const onRequest = () => json(405, { error: 'Method not allowed' });
