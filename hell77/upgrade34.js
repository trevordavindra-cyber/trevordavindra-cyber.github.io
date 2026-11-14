// ILLUMINATI upgrade #34: hl34-trail-trail (v18.40)
// Pointer-trail echo: small glowing dots trail the cursor and fade out.
// Additive only; mouse pointer only, capped trail so it can't flood the DOM.
// Self-designed this cycle (relay returned malformed JSON).
(function () {
  if (window.__hl34Trail) return;
  window.__hl34Trail = true;
  function start() {
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
    var MAX = 14, last = 0;
    var colors = ['#ff2b4e', '#00e5ff', '#ffc107', '#b06cff'];
    document.addEventListener('pointermove', function (e) {
      if (e && e.pointerType && e.pointerType !== 'mouse') return;
      var now = Date.now();
      if (now - last < 40) return;
      last = now;
      if (!document.body) return;
      if (document.querySelectorAll('.hl34-dot').length >= MAX) return;
      var d = document.createElement('div');
      d.className = 'hl34-dot';
      var x = (typeof e.clientX === 'number') ? e.clientX : 0;
      var y = (typeof e.clientY === 'number') ? e.clientY : 0;
      d.style.cssText = 'position:fixed;left:' + (x - 3) + 'px;top:' + (y - 3) + 'px;width:6px;height:6px;border-radius:50%;pointer-events:none;z-index:9998;opacity:.9;background:' + colors[Math.floor(Math.random() * colors.length)] + ';box-shadow:0 0 8px currentColor;transition:opacity .55s linear, transform .55s ease-out;will-change:opacity,transform;';
      document.body.appendChild(d);
      setTimeout(function () { d.style.opacity = '0'; d.style.transform = 'scale(2.4)'; }, 16);
      setTimeout(function () { if (d && d.parentNode) d.parentNode.removeChild(d); }, 700);
    }, true);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else { start(); }
})();
