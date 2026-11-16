/* hl159-whisper — THE WHISPER: a rotating gold motto plaque fades in and out in the lower-right corner of the temple */
(function () {
  if (window.__HL159) return; window.__HL159 = 1;
  var css = ".hl159-whisper{position:fixed;right:26px;bottom:22px;z-index:8100;pointer-events:none;max-width:44vw;color:rgba(197,164,91,.62);font:600 8.5px 'JetBrains Mono',monospace;letter-spacing:.22em;text-transform:uppercase;text-align:right;opacity:0;transition:opacity 1.6s ease;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:0 0 8px rgba(197,164,91,.25)}@media (max-width:640px){.hl159-whisper{right:18px;bottom:16px;font-size:7.5px;max-width:46vw;letter-spacing:.16em}}";
  var st = document.createElement('style'); st.id = 'hl159-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var mottos = ['AS ABOVE \u00b7 SO BELOW', 'THE RECORD REMEMBERS', 'SILENCE IS THE FIRST KEY', 'NOTHING IS HIDDEN FOREVER', 'THE ORDER WATCHES', 'SEEK \u00b7 SPEAK \u00b7 SEAL', 'WHAT IS ANSWERED, BINDS', 'KNOW \u00b7 THEN ENTER'];
  var box = null, i = 0, reduced = false;
  function build() {
    if (box || !document.body) return false;
    box = document.createElement('div');
    box.className = 'hl159-whisper';
    box.setAttribute('aria-hidden', 'true');
    box.textContent = mottos[0];
    document.body.appendChild(box);
    requestAnimationFrame(function () { box.style.opacity = '1'; });
    return true;
  }
  function swap() {
    if (!box) return;
    box.style.opacity = '0';
    setTimeout(function () {
      if (!box) return;
      i = (i + 1) % mottos.length;
      box.textContent = mottos[i];
      box.style.opacity = '1';
    }, 1700);
  }
  var tries = 0; var iv = setInterval(function () {
    if (build()) {
      clearInterval(iv);
      reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      if (!reduced) setInterval(swap, 22000);
    } else if (++tries > 90) clearInterval(iv);
  }, 800);
})();
