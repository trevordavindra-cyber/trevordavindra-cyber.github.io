/* hl168-vigil — THE VIGIL: between 11 PM and 6 AM the chamber dims into candlelight — a deeper vignette and a warm amber wash settle over the edges until dawn */
(function () {
  if (window.__HL168) return; window.__HL168 = 1;
  var css = ".hl168-vignette{position:fixed;inset:0;z-index:30;pointer-events:none;opacity:0;transition:opacity 2.2s ease;background:radial-gradient(ellipse at 50% 42%,transparent 40%,rgba(0,0,0,.34) 74%,rgba(0,0,0,.62) 100%),linear-gradient(180deg,rgba(64,40,10,.10),rgba(64,40,10,.04) 55%,rgba(40,24,6,.12))}.hl168-vignette.on{opacity:1}@media (prefers-reduced-motion: reduce){.hl168-vignette{transition:none}}";
  var st = document.createElement('style'); st.id = 'hl168-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var layer = null;
  function ensure() {
    if (layer || !document.body) return false;
    layer = document.createElement('div');
    layer.className = 'hl168-vignette';
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);
    return true;
  }
  function inVigil() {
    var h;
    try { h = new Date().getHours(); } catch (e) { return false; }
    return h >= 23 || h < 6;
  }
  function reconcile() {
    if (!layer) return;
    if (inVigil()) layer.classList.add('on');
    else layer.classList.remove('on');
  }
  var tries = 0; var iv = setInterval(function () {
    if (ensure()) {
      clearInterval(iv);
      reconcile();
      setInterval(reconcile, 60000);
    } else if (++tries > 90) clearInterval(iv);
  }, 800);
})();
