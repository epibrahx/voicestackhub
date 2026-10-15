// The ONLY place the site address is configured. Override with env var SITE_URL.
export const SITE_URL = (process.env.SITE_URL || 'https://epibrahx.stream').replace(/\/+$/, '');
export const SITE_NAME = 'VoiceStackHub';
export const CATEGORIES = [
  'Agent Platforms',
  'Speech APIs (STT/TTS)',
  'Video Agents & Avatars',
  'Frameworks & Infrastructure',
  'Testing & Voice Apps',
];

// Replace with real cloud.umami.is website id before deploy. Do not ship the placeholder.
export const UMAMI_WEBSITE_ID = 'UMAMI_WEBSITE_ID';
