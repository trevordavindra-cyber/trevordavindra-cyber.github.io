// ILLUMINATI upgrade #41: hl41-rune-ticker (v18.47)
// A tiny elder-futhark rune fades to a new letter every 8 s in the lower-right
// HUD corner. Pointer-events none; holds one static rune under reduced motion.
(function () {
  if (window.__hl41Rune) return;
  window.__hl41Rune = true;
  var RUNES = ['\u16a0','\u16a2','\u16a6','\u16a8','\u16b1','\u16b2','\u16c3','\u16c9'];
  function start() {
    if (!document.body || document.getElementById('hl41-rune')) return;
    var d = document.createElement('div');
    d.id = 'hl41-rune';
    d.title = 'The old letters still watch';
    d.style.cssText = 'position:fixed;right:22px;bottom:40px;z-index:9994;pointer-events:none;' +
      'font-family:monospace;font-size:16px;color:rgba(0,229,255,.35);' +
      'text-shadow:0 0 8px rgba(0,229,255,.25);transition:opacity .8s;';
    d.textContent = RUNES[0];
    document.body.appendChild(d);
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var i = 0;
    setInterval(function () {
      var el = document.getElementById('hl41-rune');
      if (!el) return;
      el.style.opacity = '0';
      setTimeout(function () {
        i = (i + 1) % RUNES.length;
        el.textContent = RUNES[i];
        el.style.opacity = '1';
      }, 800);
    }, 8000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();