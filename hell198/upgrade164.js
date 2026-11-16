/* hl164-drift — THE DRIFT: a faint gold sigil layer far behind everything that leans away from your cursor in slow parallax, giving the void real depth */
(function () {
  if (window.__HL164) return; window.__HL164 = 1;
  if (window.matchMedia && (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(pointer: fine)').matches)) return;
  var css = ".hl164-drift{position:fixed;top:50%;left:50%;z-index:0;pointer-events:none;transform:translate(-50%,-50%) translate(var(--dx,0px),var(--dy,0px));transition:transform 1.2s cubic-bezier(.2,.6,.2,1);will-change:transform}.hl164-drift::before,.hl164-drift::after{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);border-radius:50%;border:1px solid rgba(197,164,91,.07)}.hl164-drift::before{width:620px;height:620px}.hl164-drift::after{width:900px;height:900px;border-color:rgba(197,164,91,.045)}@media (max-width:640px){.hl164-drift::before{width:420px;height:420px}.hl164-drift::after{width:640px;height:640px}}";
  var st = document.createElement('style'); st.id = 'hl164-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var layer = null;
  function ensure() {
    if (layer || !document.body) return false;
    layer = document.createElement('div');
    layer.className = 'hl164-drift';
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);
    return true;
  }
  var tries = 0; var iv = setInterval(function () {
    if (ensure()) {
      clearInterval(iv);
      document.addEventListener('pointermove', function (ev) {
        if (document.hidden) return;
        var dx = (window.innerWidth / 2 - ev.clientX) * 0.022;
        var dy = (window.innerHeight / 2 - ev.clientY) * 0.022;
        dx = Math.max(-14, Math.min(14, dx));
        dy = Math.max(-14, Math.min(14, dy));
        layer.style.setProperty('--dx', dx.toFixed(1) + 'px');
        layer.style.setProperty('--dy', dy.toFixed(1) + 'px');
      }, { passive: true });
    } else if (++tries > 90) clearInterval(iv);
  }, 800);
})();
