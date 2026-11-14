// ILLUMINATI upgrade #29: hl29-grid-drift (v18.35)
// Faint blueprint grid overlay that drifts slowly across the whole page,
// settling to a near-invisible opacity after 30 s. Purely additive,
// pointer-events none so nothing becomes unclickable.
(function () {
  if (window.__hl29Grid) return;
  window.__hl29Grid = true;
  function start() {
    if (!document.body || !document.head || document.getElementById('hl29-grid')) return;
    var st = document.createElement('style');
    st.textContent = '@keyframes hl29drift{from{background-position:0 0,0 0}to{background-position:48px 48px,48px 48px}}';
    document.head.appendChild(st);
    var g = document.createElement('div');
    g.id = 'hl29-grid';
    g.style.cssText = 'position:fixed;inset:0;z-index:2147483640;pointer-events:none;opacity:.05;transition:opacity 2s;'
      + 'background-image:linear-gradient(rgba(0,229,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,.6) 1px,transparent 1px);'
      + 'background-size:48px 48px;'
      + 'animation:hl29drift 60s linear infinite;';
    document.body.appendChild(g);
    setTimeout(function () { g.style.opacity = '.035'; }, 30000);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else { start(); }
})();