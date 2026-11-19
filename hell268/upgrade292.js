/* ILLUMINATI upgrade 292 - SMART RECALL (hl292)
   Frontier directive part 4: retrieval intelligence.
   The permanent memory rides into every ticket, but it was newest-40, blind to
   the question. Now recall is RELEVANCE-RANKED: every ask scores the stored
   facts against the actual question (word overlap, whole-fact match, recency
   tiebreak) and the most relevant facts ride along first. Nothing saved is
   lost, dedupe and forget commands untouched.
*/
(function () {
  if (window.__HL292) return; window.__HL292 = true;

  var KEY = 'hl250_mem';

  function toks(s) {
    var m = String(s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/), out = {}, n = 0;
    for (var i = 0; i < m.length; i++) { var w = m[i]; if (w.length >= 3 && !out[w]) { out[w] = 1; n++; } }
    return out;
  }

  function overlap(a, b) {
    var n = 0;
    for (var k in a) { if (b[k]) n++; }
    return n;
  }

  try {
    var ls = window.localStorage;
    if (!ls) throw 0;
    var of = window.fetch;
    window.fetch = function (u, init) {
      try {
        var url = (typeof u === 'string') ? u : (u && u.url) || '';
        if (/pollinations\.ai|aihorde\.ai/.test(url) && init && String(init.method || '').toUpperCase() === 'POST' && typeof init.body === 'string') {
          var b = null;
          try { b = JSON.parse(init.body); } catch (e1) { b = null; }
          if (b && b.messages && b.messages.length) {
            for (var i = b.messages.length - 1; i >= 0; i--) {
              if (b.messages[i] && b.messages[i].role === 'user' && typeof b.messages[i].content === 'string') {
                window.__hl292q = toks(b.messages[i].content);
                break;
              }
            }
          }
        }
      } catch (e2) {}
      return of.apply(this, arguments);
    };

    var gi = Storage.prototype.getItem;
    Storage.prototype.getItem = function (k) {
      try {
        if (k === KEY && window.__hl292q) {
          var arr = null;
          try { arr = JSON.parse(gi.call(this, KEY) || '[]') || []; } catch (e3) { arr = []; }
          if (arr && arr.length > 3) {
            var q = window.__hl292q, now = Date.now();
            var scored = arr.map(function (x, idx) {
              var ft = toks(x && x.text);
              var ov = overlap(ft, q);
              var whole = 0;
              try { var fn = String(x && x.text || '').toLowerCase(); for (var w in q) { if (w.length > 4 && fn.indexOf(w) >= 0) whole++; } } catch (e4) {}
              var fresh = (x && x.t && (now - x.t) < 36e5) ? 1 : 0;
              return { x: x, s: ov * 3 + whole * 2 + fresh, i: idx };
            });
            scored.sort(function (a, b2) { return (b2.s - a.s) || (b2.i - a.i); });
            var top = scored.slice(0, 40).reverse().map(function (s) { return s.x; });
            try { console.log('[hl292] smart recall: top ' + top.length + ' of ' + arr.length + ' facts ranked for this ask'); } catch (e5) {}
            return JSON.stringify(top);
          }
        }
      } catch (e6) {}
      return gi.call(this, k);
    };

    try { console.log('[hl292] smart recall online: memory recall is relevance-ranked per ask'); } catch (e7) {}
  } catch (e8) {}
})();
