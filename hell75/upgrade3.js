// ILLUMINATI upgrade #3: Vignette Scanline (v18.9)
// Adds a subtle CRT-style vignette and drifting scanline overlay. Additive only.
(function () {
  function init() {
    try {
      if (document.getElementById('hl3-scan')) return;
      var st = document.createElement('style');
      st.id = 'hl3-scan-style';
      st.textContent = [
        '#hl3-scan { position: fixed; inset: 0; z-index: 2147483646; pointer-events: none;',
        '  background: radial-gradient(ellipse at center, transparent 62%, rgba(0,0,0,.28) 100%);',
        '  mix-blend-mode: multiply; opacity: .55; }',
        '#hl3-scan::after { content: ""; position: absolute; left: 0; right: 0; height: 46px;',
        '  background: repeating-linear-gradient(to bottom, transparent 0 3px, rgba(255,255,255,.015) 3px 4px);',
        '  animation: hl3Drift 14s linear infinite; }',
        '@keyframes hl3Drift { from { top: -46px; } to { top: 100%; } }',
        '@media (prefers-reduced-motion: reduce) { #hl3-scan::after { animation: none; } }'
      ].join('\n');
      document.head.appendChild(st);
      var ov = document.createElement('div');
      ov.id = 'hl3-scan';
      ov.setAttribute('aria-hidden', 'true');
      (document.body || document.documentElement).appendChild(ov);
    } catch (e) { /* never break the site */ }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();