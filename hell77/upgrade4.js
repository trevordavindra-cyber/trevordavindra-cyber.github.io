// ILLUMINATI upgrade #4: The Eye Sees (v18.10)
// Keyboard easter egg: type EYE anywhere in the app to summon the all-seeing eye. Additive only.
(function () {
  function init() {
    try {
      if (window.__hl4EyeSees) return;
      window.__hl4EyeSees = true;
      var buf = '';
      function show() {
        var t = document.getElementById('hl4-eye-toast');
        if (!t) {
          t = document.createElement('div');
          t.id = 'hl4-eye-toast';
          t.setAttribute('aria-hidden', 'true');
          var st = document.createElement('style');
          st.id = 'hl4-eye-style';
          st.textContent = [
            '#hl4-eye-toast { position: fixed; left: 50%; bottom: 96px; transform: translateX(-50%);',
            '  z-index: 2147483645; padding: 10px 18px; border: 1px solid rgba(220,40,40,.5);',
            '  background: rgba(5,5,5,.92); color: #ff5544; font: 600 14px/1.4 monospace;',
            '  letter-spacing: .12em; pointer-events: none; opacity: 0; transition: opacity .4s; }',
            '#hl4-eye-toast.on { opacity: 1; }'
          ].join('\n');
          (document.head || document.documentElement).appendChild(st);
          (document.body || document.documentElement).appendChild(t);
        }
        t.textContent = '👁 THE ALL-SEEING EYE SEES YOU';
        t.classList.add('on');
        clearTimeout(t.__hl4T);
        t.__hl4T = setTimeout(function () { t.classList.remove('on'); }, 2200);
      }
      document.addEventListener('keydown', function (e) {
        try {
          if (e.key && e.key.length === 1) {
            buf = (buf + e.key.toLowerCase()).slice(-3);
            if (buf === 'eye') { show(); buf = ''; }
          }
        } catch (err) { /* never break the site */ }
      }, true);
    } catch (e) { /* never break the site */ }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
