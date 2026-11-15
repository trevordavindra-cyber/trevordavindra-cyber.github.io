/* ILLUMINATI upgrade #118: hl118-heretic-hold — while the unfiltered brain is
   waking, queries WAIT for it instead of slipping to the relay, so the relay
   never answers (and never refuses) while the heretic toggle is on. the top
   bar shows AI: HERETIC WAKING while it waits. off = exactly as before. */
(function () {
  if (window.__HL118) return; window.__HL118 = 1;
  function herText() { var el = document.getElementById('p-her'); return el ? (el.textContent || '') : ''; }
  function waking(t) { return t.indexOf('downloading') >= 0 || t.indexOf('waking') >= 0; }
  function off(t) { return !waking(t) && (t.indexOf('OFF') >= 0 || t.indexOf('fail') >= 0 || t.indexOf('error') >= 0 || t === ''); }
  function ready(t) { return !waking(t) && t.indexOf('ON') >= 0; }
  function aiBar(hold, txt) {
    var hs = document.querySelectorAll('header b');
    for (var i = 0; i < hs.length; i++) {
      var s = String(hs[i].textContent || '');
      if (s.indexOf('AI:') === 0) {
        if (hold) { if (!hs[i].getAttribute('data-hl118')) hs[i].setAttribute('data-hl118', s); hs[i].textContent = txt; }
        else if (hs[i].getAttribute('data-hl118')) { hs[i].textContent = hs[i].getAttribute('data-hl118'); hs[i].removeAttribute('data-hl118'); }
      }
    }
  }
  function synthetic() {
    var msg = 'The unfiltered brain is still waking on this device — it loads once, then answers instantly. Ask again in a moment and the Order answers from its own mind.';
    return new Response(JSON.stringify({ choices: [{ message: { content: msg } }] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
  function waitReady(ms) {
    var t0 = Date.now();
    return new Promise(function (res) {
      (function poll() {
        var t = herText();
        if (ready(t) || off(t)) return res(true);
        if (Date.now() - t0 >= ms) return res(false);
        setTimeout(poll, 500);
      })();
    });
  }
  var _f = window.fetch.bind(window);
  window.fetch = function (u, o) {
    var url = (typeof u === 'string') ? u : (u && u.url) || '';
    if (url.indexOf('text.pollinations.ai') < 0 || url.indexOf('image.pollinations.ai') >= 0) return _f(u, o);
    var t = herText();
    if (off(t) || ready(t)) return _f(u, o);
    aiBar(true, 'AI: HERETIC WAKING');
    return waitReady(240000).then(function (ok) {
      aiBar(false);
      if (ok) return _f(u, o);
      return synthetic();
    });
  };
  function mark() { var el = document.getElementById('pgp'); if (el) el.setAttribute('data-hl118', '1'); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mark); else mark();
})();
