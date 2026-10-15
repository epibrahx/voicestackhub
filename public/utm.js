/* Capture utm_* + landing path; persist across pages via sessionStorage. */
(function () {
  var KEY = 'epibrahx_utm';
  var PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  try {
    var u = new URL(location.href);
    var found = {};
    var any = false;
    for (var i = 0; i < PARAMS.length; i++) {
      var k = PARAMS[i];
      var v = u.searchParams.get(k);
      if (v) { found[k] = String(v).slice(0, 200); any = true; }
    }
    if (any) {
      found.landing_path = (u.pathname + u.search).slice(0, 500);
      sessionStorage.setItem(KEY, JSON.stringify(found));
    }
  } catch (e) {}
  window.getUtmPayload = function () {
    try {
      var raw = sessionStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { landing_path: location.pathname };
  };
})();
