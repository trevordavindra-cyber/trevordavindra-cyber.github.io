/* hl161-ember — WALKING THROUGH FIRE: fine gold embers rise and drift from the moving cursor and burst outward on every click, like the room itself is burning with quiet light */
(function () {
  if (window.__HL161) return; window.__HL161 = 1;
  if (window.matchMedia && (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(pointer: fine)').matches)) return;
  var css = ".hl161-embers{position:fixed;inset:0;z-index:9500;pointer-events:none;overflow:hidden}.hl161-ember{position:absolute;border-radius:50%;background:radial-gradient(circle,rgba(255,221,138,.95) 0%,rgba(197,164,91,.55) 45%,rgba(197,164,91,0) 75%);box-shadow:0 0 6px rgba(212,175,98,.55);transform:translate(-50%,-50%);animation:hl161rise var(--dur,1.4s) ease-out forwards;will-change:transform,opacity}.hl161-ember.hl161-burst{animation:hl161burst var(--dur,.9s) cubic-bezier(.15,.65,.35,1) forwards}@keyframes hl161rise{0%{opacity:.9;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(calc(-50% + var(--dx,0px)),calc(-50% - var(--dy,34px))) scale(.25)}}@keyframes hl161burst{0%{opacity:1;transform:translate(-50%,-50%) scale(1.1)}100%{opacity:0;transform:translate(calc(-50% + var(--dx,0px)),calc(-50% + var(--dy,0px))) scale(.2)}}";
  var st = document.createElement('style'); st.id = 'hl161-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var layer = null, last = 0;
  function ensure() {
    if (layer || !document.body) return false;
    layer = document.createElement('div');
    layer.className = 'hl161-embers';
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);
    return true;
  }
  function spawn(x, y, size, burst) {
    if (!layer) return;
    if (layer.childElementCount > 34) layer.removeChild(layer.firstElementChild);
    var e = document.createElement('span');
    e.className = 'hl161-ember' + (burst ? ' hl161-burst' : '');
    var ang = Math.random() * 2 * Math.PI;
    var r = burst ? (10 + Math.random() * 26) : 0;
    e.style.left = x + 'px';
    e.style.top = y + 'px';
    e.style.width = size + 'px';
    e.style.height = size + 'px';
    e.style.setProperty('--dx', (burst ? Math.cos(ang) * r : (Math.random() * 16 - 8)) + 'px');
    e.style.setProperty('--dy', burst ? (Math.sin(ang) * r + 'px') : (24 + Math.random() * 22 + 'px'));
    e.style.setProperty('--dur', (burst ? 0.7 + Math.random() * 0.5 : 1.1 + Math.random() * 0.8) + 's');
    e.addEventListener('animationend', function () { if (e.parentNode) e.parentNode.removeChild(e); });
    layer.appendChild(e);
  }
  var tries = 0; var iv = setInterval(function () {
    if (ensure()) {
      clearInterval(iv);
      document.addEventListener('pointermove', function (ev) {
        var now = Date.now();
        if (now - last < 70 || document.hidden) return;
        last = now;
        spawn(ev.clientX, ev.clientY, 3 + Math.random() * 3, false);
      }, { passive: true });
      document.addEventListener('pointerdown', function (ev) {
        if (document.hidden) return;
        for (var i = 0; i < 7; i++) spawn(ev.clientX, ev.clientY, 3.5 + Math.random() * 2.5, true);
      }, { passive: true });
    } else if (++tries > 90) clearInterval(iv);
  }, 800);
})();
