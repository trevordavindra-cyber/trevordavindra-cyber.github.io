// ILLUMINATI upgrade #46: hl46-ember-cursor (v18.52)
// Tiny embers drift off the pointer as it moves. Purely additive: one overlay
// div, pointer-events none, nothing existing touched. Disabled entirely under
// prefers-reduced-motion.
(function () {
  if (window.__hl46Ember) return;
  window.__hl46Ember = true;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var box = null;
  function ensure() {
    if (box && box.isConnected) return box;
    box = document.createElement('div');
    box.id = 'hl46-embers';
    box.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9993;overflow:hidden';
    (document.body || document.documentElement).appendChild(box);
    return box;
  }
  var last = { x: -1, y: -1, t: 0 };
  function spawn(x, y) {
    var b = ensure();
    if (b.childElementCount > 24) b.removeChild(b.firstElementChild);
    var e = document.createElement('i');
    e.style.cssText = 'position:absolute;width:3px;height:3px;border-radius:50%;background:#ff7a3c;box-shadow:0 0 6px rgba(255,60,0,.9);opacity:.9;left:' + x + 'px;top:' + y + 'px;transition:transform 1.2s ease-out,opacity 1.2s ease-out;will-change:transform,opacity';
    b.appendChild(e);
    requestAnimationFrame(function () {
      e.style.transform = 'translate(' + ((Math.random() * 24 - 12).toFixed(1)) + 'px,' + (-14 - Math.random() * 20).toFixed(1) + 'px)';
      e.style.opacity = '0';
    });
    setTimeout(function () { if (e && e.parentNode) e.parentNode.removeChild(e); }, 1300);
  }
  function onMove(ev) {
    var p = ev.touches && ev.touches[0] ? ev.touches[0] : ev;
    var now = Date.now();
    if (!p || (Math.abs(p.clientX - last.x) < 6 && Math.abs(p.clientY - last.y) < 6 && now - last.t < 90)) return;
    last = { x: p.clientX, y: p.clientY, t: now };
    spawn(p.clientX, p.clientY);
  }
  function start() {
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();