// ILLUMINATI upgrade #3: Vignette Scanline (v18.9)
// Adds a slow-moving dark vignette band overlay to reinforce the dark circuit atmosphere.
// Additive only. Injected by overnight upgrade run.
(function () {
  function init() {
    try {
      if (document.getElementById('hl3-scanline')) return;
      var st = document.createElement('style');
      st.textContent =
        '#hl3-scanline{position:fixed;inset:0;pointer-events:none;z-index:9997;'+
        'background:linear-gradient(180deg,transparent 0%,rgba(0,0,0,.55) 48%,rgba(0,0,0,.75) 50%,rgba(0,0,0,.55) 52%,transparent 100%);'+
        'background-size:100% 220%;opacity:.18;animation:hl3scan 7s linear infinite;}'+
        '@keyframes hl3scan{0%{background-position:0 -120%}100%{background-position:0 120%}}'+
        '@media (prefers-reduced-motion: reduce){#hl3-scanline{animation:none}}';
      document.head.appendChild(st);
      var band = document.createElement('div');
      band.id = 'hl3-scanline';
      document.body.appendChild(band);
    } catch (e) { /* silent */ }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();