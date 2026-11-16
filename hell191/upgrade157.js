/* hl157-pulse — THE ANSWERING PULSE: a gold ripple that rings outward from every tap and click */
(function () {
  if (window.__HL157) return; window.__HL157 = 1;
  var css = ".hl157-ripple{position:fixed;border-radius:50%;pointer-events:none;z-index:9620;border:2px solid rgba(197,164,91,.7);box-shadow:0 0 14px rgba(197,164,91,.35),inset 0 0 8px rgba(197,164,91,.2);transform:translate(-50%,-50%) scale(0);opacity:.9;animation:hl157ring .7s cubic-bezier(.16,.84,.44,1) forwards}.hl157-ripple.hl157-strong{border-width:3px;box-shadow:0 0 22px rgba(197,164,91,.55),inset 0 0 14px rgba(197,164,91,.3)}@keyframes hl157ring{0%{transform:translate(-50%,-50%) scale(.15);opacity:.9}70%{opacity:.35}100%{transform:translate(-50%,-50%) scale(1);opacity:0}}@media (prefers-reduced-motion: reduce){.hl157-ripple{display:none}}";
  var st = document.createElement('style'); st.id = 'hl157-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var last = 0;
  document.addEventListener('pointerdown', function (e) {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var now = Date.now();
    if (now - last < 120) return;
    last = now;
    var r = document.createElement('div');
    r.className = 'hl157-ripple';
    var strong = false;
    var t = e.target;
    while (t && t !== document.body) {
      if (t.tagName === 'BUTTON' || (t.classList && (t.classList.contains('hl155-chip') || t.classList.contains('hl151-chip') || t.classList.contains('hl150-chip') || t.classList.contains('hl149-chip')))) { strong = true; break; }
      t = t.parentElement;
    }
    if (strong) r.classList.add('hl157-strong');
    var size = (e.pointerType === 'touch') ? 110 : 80;
    r.style.width = size + 'px'; r.style.height = size + 'px';
    r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px';
    document.body.appendChild(r);
    setTimeout(function () { if (r.parentNode) r.parentNode.removeChild(r); }, 750);
  }, true);
})();
