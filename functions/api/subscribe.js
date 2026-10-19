import { json } from '../../lib/shared.js';

const gone = () => json(410, { error: 'VoiceStackHub is temporarily offline. Newsletter signups are not accepted.' });

export const onRequestPost = gone;
export const onRequest = gone;
