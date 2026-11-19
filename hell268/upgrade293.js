/* ILLUMINATI upgrade 293 - TALK MODE (hl293)
   Frontier directive part 6 (audio): real voice conversation.
   A TALK button: tap it and the site listens, sends what you said to the full
   pipeline (fusion + quality core + everything), then speaks the answer out
   loud in a deep voice, and listens again. Hands-free back-and-forth. Tap
   again to stop. Nothing removed; the normal text path is untouched.
*/
(function () {
  if (window.__HL293) return; window.__HL293 = true;

  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var on = false, rec = null, busy = false;

  function f(msg) { try { feed('TALK MODE :: ' + msg, 'live'); } catch (e1) {} }

  function tts(text) {
    try {
      if (!window.speechSynthesis || !text) return;
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(String(text).slice(0, 1200));
      try {
        var vs = speechSynthesis.getVoices();
        var deep = vs.find(function (x) { return /male|daniel|george|fred/i.test(x.name); });
        if (deep) u.voice = deep;
      } catch (e2) {}
      u.rate = 1; u.pitch = 0.9; u.volume = 1;
      u.onend = function () { if (on) listen(); };
      u.onerror = function () { if (on) listen(); };
      speechSynthesis.speak(u);
    } catch (e3) { if (on) setTimeout(listen, 800); }
  }

  function listen() {
    if (!on) return;
    try {
      if (!SR) { f('this browser has no speech input - talk mode needs safari or chrome'); off(); return; }
      if (busy) return;
      rec = new SR();
      rec.lang = (navigator.language || 'en-US');
      rec.continuous = false; rec.interimResults = false; rec.maxAlternatives = 1;
      rec.onresult = function (ev) {
        var t = '';
        try { t = ev.results[0][0].transcript || ''; } catch (e4) {}
        t = String(t).trim();
        if (!t) { if (on) setTimeout(listen, 500); return; }
        f('you said: ' + t.slice(0, 80));
        busy = true;
        btn('...');
        Promise.resolve(window.askOmni(t))['catch'](function () { return null; }).then(function (ans) {
          busy = false;
          if (!on) return;
          if (!ans) { f('no answer came back - listening again'); return listen(); }
          btn('SPEAK');
          tts(ans);
        });
      };
      rec.onerror = function (ev) {
        try { if (ev && ev.error === 'not-allowed') { f('microphone blocked - allow mic access and tap talk again'); off(); return; } } catch (e5) {}
        if (on && !busy) setTimeout(listen, 800);
      };
      rec.onend = function () { if (on && !busy) setTimeout(listen, 500); };
      rec.start();
      btn('LISTEN');
    } catch (e6) { if (on) setTimeout(listen, 1000); }
  }

  function btn(label) { try { var b = document.getElementById('hl293-talk'); if (b) { b.textContent = label; } } catch (e7) {} }

  function start() {
    on = true;
    try { window.__hl293prevSpeakState = null; } catch (e8) {}
    f('talk mode on - speak, i answer out loud, then listen again. tap the button to stop');
    listen();
  }

  function off() {
    on = false; busy = false;
    try { if (rec) { rec.onend = null; rec.onresult = null; rec.onerror = null; try { rec.stop(); } catch (e9) {} rec = null; } } catch (e10) {}
    try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e11) {}
    btn('TALK');
    f('talk mode off');
  }

  function mount() {
    try {
      if (document.getElementById('hl293-talk')) return;
      var b = document.createElement('button');
      b.id = 'hl293-talk'; b.textContent = 'TALK';
      b.setAttribute('aria-label', 'Talk mode: voice conversation');
      b.style.cssText = 'position:fixed;left:10px;bottom:100px;z-index:2147483000;padding:10px 14px;border-radius:20px;border:1px solid #b99a2e;background:linear-gradient(180deg,#1a1608,#0c0a04);color:#e8c654;font:700 11px/1 monospace;letter-spacing:1px;box-shadow:0 0 12px rgba(212,175,55,.35);cursor:pointer;';
      b.onclick = function () { if (on) { off(); } else if (busy) { /* wait for answer */ } else { start(); } };
      document.body.appendChild(b);
    } catch (e12) {}
  }

  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
  setInterval(mount, 3000);

  try { console.log('[hl293] talk mode online: tap TALK for hands-free voice conversation'); } catch (e13) {}
})();
