const BAD = /(^|\/)(\.git|\.env|\.svn|\.hg|\.DS_Store|wp-admin|wp-login|wp-content|wp-includes|xmlrpc\.php|phpmyadmin|config\/|\.aws|\.ssh|server-status|cgi-bin)|\.(php|asp|aspx|jsp|sql|bak|ini|log|yml|yaml)$/i;
const PAGE = '<!doctype html><html><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Suspended</title></head><body style="font-family:system-ui;display:flex;min-height:100vh;align-items:center;justify-content:center;background:#111;color:#eee"><h1>You have been suspended</h1></body></html>';
export async function onRequest({ request, next }) {
  const p = new URL(request.url).pathname;
  if (BAD.test(p)) return new Response(PAGE, { status: 403, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
  return next();
}
