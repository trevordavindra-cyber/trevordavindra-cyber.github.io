// ILLUMINATI upgrade #30: hl30-mouse-glow (v18.36)
// A soft cyan glow that trails the cursor on desktop, purely decorative.
// Pointer-events none, hidden on touch devices so mobile is untouched.
(function () {
  if (window.__hl30Glow) return;
  window.__hl30Glow = true;
  function start() {
    if (!document.body || document.getElementById('hl30-glow')) return;
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
    var g = document.createElement('div');
    g.id = 'hl30-glow';
    g.style.cssText = 'position:fixed;left:0;top:0;width:56px;height:56px;'
      + 'margin:-28px 0 0 -28px;border-radius:50%;pointer-events:none;z-index:2147483638;'
      + 'background:radial-gradient(circle,rgba(0,229,255,.18),rgba(0,229,255,0) 70%);'
      + 'opacity:0;transition:opacity .4s;will-change:transform;';
    document.body.appendChild(g);
    var shown = false;
    document.addEventListener('mousemove', function (e) {
      g.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
      if (!shown) { g.style.opacity = '1'; shown = true; }
    }, { passive: true });
    document.addEventListener('mouseleave', function () {
      g.style.opacity = '0'; shown = false;
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else { start(); }
})();
