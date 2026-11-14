// ILLUMINATI upgrade #42: hl42-scroll-meter (v18.48)
// A 2px cyan/red meter hugging the bottom edge that fills with how far you
// have descended into the terminal. Additive only: one new div, no existing
// element or behavior touched; instant (no animation) under reduced motion.
(function () {
  if (window.__hl42Meter) return;
  window.__hl42Meter = true;
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function start() {
    if (!document.body || document.getElementById('hl42-meter')) return;
    var bar = document.createElement('div');
    bar.id = 'hl42-meter';
    bar.setAttribute('aria-hidden', 'true');
    bar.style.cssText = 'position:fixed;bottom:0;left:0;height:2px;width:0;z-index:9995;' +
      'pointer-events:none;' +
      'background:linear-gradient(90deg,rgba(0,229,255,.85),rgba(192,0,32,.85));' +
      (RM ? '' : 'transition:width .2s linear;');
    document.body.appendChild(bar);
    function paint() {
      var d = document.documentElement;
      var max = d.scrollHeight - d.clientHeight;
      var y = d.scrollTop || document.body.scrollTop || 0;
      var p = max > 0 ? Math.min(1, y / max) : 0;
      bar.style.width = (p * 100).toFixed(2) + '%';
    }
    window.addEventListener('scroll', paint, { passive: true });
    window.addEventListener('resize', paint);
    paint();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
