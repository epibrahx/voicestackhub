import { json } from '../../lib/shared.js';

const gone = () => json(410, { error: 'VoiceStackHub is temporarily offline. Submissions are not accepted.' });

export const onRequestPost = gone;
export const onRequest = gone;
