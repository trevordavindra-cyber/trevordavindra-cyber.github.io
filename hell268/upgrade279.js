/* ILLUMINATI upgrade #279: hl279-device (v19.185)
   "is there a way to give the illuminati ai direct access to my phone" -
   a website can never drive the phone, but with permission it gets real
   device powers. This upgrade wires them in:
   (1) NOTIFICATIONS: on your first touch the site asks once; once allowed,
       every answer that lands while you're in another tab or app pings you
       like a real app, with the answer previewed in the notification.
   (2) VIBRATION: answers buzz the phone when they land in the background.
   (3) LIVE GPS: ask where you are ("where am i", "near me", "nearest...")
       and the site reads the phone's real location and hands the
       coordinates to the ai for that exact ask. Cached for 10 minutes.
   Nothing removed. Guard: __HL279 */
(function () {
  if (window.__HL279) return; window.__HL279 = true;

  var asked = false;
  function askNotify() {
    if (asked) return; asked = true;
    try {
      if (typeof Notification === 'undefined') return;
      if (Notification.permission === 'default') Notification.requestPermission();
    } catch (e0) {}
    document.removeEventListener('pointerdown', askNotify, true);
    document.removeEventListener('keydown', askNotify, true);
  }
  try {
    document.addEventListener('pointerdown', askNotify, true);
    document.addEventListener('keydown', askNotify, true);
  } catch (eA) {}

  function ping(title, body) {
    try {
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted' && document.hidden) {
        new Notification(title, { body: String(body || '').slice(0, 120), tag: 'hell-ai' });
        try { if (navigator.vibrate) navigator.vibrate([40, 60, 40]); } catch (eV) {}
      }
    } catch (eN) {}
  }

  var loc = null, locAt = 0, locWait = null;
  function grabLoc() {
    try {
      if (!navigator.geolocation) return Promise.resolve(null);
      if (locWait) return locWait;
      if (loc && Date.now() - locAt < 600000) return Promise.resolve(loc);
      locWait = new Promise(function (res) {
        navigator.geolocation.getCurrentPosition(function (p) {
          loc = { lat: p.coords.latitude.toFixed(5), lon: p.coords.longitude.toFixed(5), acc: Math.round(p.coords.accuracy) };
          locAt = Date.now(); locWait = null; res(loc);
        }, function () { locWait = null; res(null); }, { timeout: 6000, maximumAge: 600000, enableHighAccuracy: false });
      });
      return locWait;
    } catch (eG) { return Promise.resolve(null); }
  }
  var LOC_RE = /\b(where am i|where am i right now|my location|my current location|near me|around me|where'?s my|closest to me|nearest to me|what'?s around me)\b/i;

  var of = window.fetch;
  if (typeof of !== 'function' || of.__hl279) return;

  var wrapped = async function () {
    var a = Array.prototype.slice.call(arguments);
    var input = a[0], init = a[1];
    var url = (typeof input === 'string') ? input : (input && input.url) || '';
    try {
      var isAsk = (url.indexOf('/generate/text/async') > -1 || url.indexOf('text.pollinations.ai') > -1) && init && typeof init.body === 'string' && init.body.charAt(0) === '{';
      if (isAsk) {
        var b = JSON.parse(init.body);
        var q = '';
        if (typeof b.prompt === 'string') q = b.prompt;
        else if (Array.isArray(b.messages)) { var last = b.messages[b.messages.length - 1]; q = last ? String(last.content || '') : ''; }
        if (q && LOC_RE.test(q)) {
          var g = await grabLoc();
          var line = g ? ('\n\n[LIVE DEVICE GPS: the operator is at latitude ' + g.lat + ', longitude ' + g.lon + ' (accuracy about ' + g.acc + ' meters). Use these real coordinates when answering location questions.]') : '\n\n[LIVE DEVICE GPS: unavailable right now - location permission not granted yet]';
          if (typeof b.prompt === 'string') b.prompt += line;
          else if (Array.isArray(b.messages)) { var last2 = b.messages[b.messages.length - 1]; if (last2) last2.content = String(last2.content || '') + line; }
          init.body = JSON.stringify(b);
        }
      }
    } catch (e1) {}
    var p = of.apply(this, a);
    try {
      if (url.indexOf('/generate/text/status/') > -1) {
        return p.then(function (r) {
          try {
            r.clone().json().then(function (d) {
              var g = d && d.generations;
              if (Array.isArray(g) && g.length && g[0] && g[0].text) ping('ILLUMINATI answered', g[0].text);
            }).catch(function () {});
          } catch (e2) {}
          return r;
        });
      }
      if (url.indexOf('text.pollinations.ai/openai') > -1 && init && init.method === 'POST') {
        return p.then(function (r) {
          try {
            var ct = r.headers.get('content-type') || '';
            if (ct.indexOf('json') > -1) {
              r.clone().json().then(function (d) {
                var t = d && d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content;
                if (t) ping('ILLUMINATI answered', t);
              }).catch(function () {});
            }
          } catch (e3) {}
          return r;
        });
      }
    } catch (e4) {}
    return p;
  };

  wrapped.__hl279 = true;
  window.fetch = wrapped;
  try { console.log('[hl279] device access online: notifications + vibration + live gps on location asks'); } catch (e5) {}
})();
