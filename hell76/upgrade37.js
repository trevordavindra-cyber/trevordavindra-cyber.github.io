// ILLUMINATI upgrade #37: hl37-key-hints (v18.43)
// Small bottom-center hint bar surfacing real hidden features: the command palette
// button and the typed easter eggs. Additive only.
// Relay-designed this cycle (hl37-key-hints); adapted to list only real site features.
(function () {
  if (window.__hl37KeyHints) return;
  window.__hl37KeyHints = true;
  function start() {
    if (!document.body) return;
    var d = document.createElement('div');
    d.id = 'hl37-key-hints-bar';
    d.title = 'Hidden corners of the OS';
    d.style.cssText = 'position:fixed;bottom:10px;left:50%;transform:translateX(-50%);z-index:9996;font-family:monospace;font-size:10px;letter-spacing:1.5px;color:#9fb6c9;background:rgba(8,10,18,.6);border:1px solid rgba(159,182,201,.22);border-radius:999px;padding:5px 14px;pointer-events:auto;backdrop-filter:blur(4px);white-space:nowrap;opacity:.8;';
    d.textContent = 'HIDDEN: tap \u2318 for palette \u2022 type E-Y-E \u2022 type O-R-A-C-L-E';
    document.body.appendChild(d);
    // fade after a while so it never fights the UI, returns on double-tap
    var faded = false;
    setTimeout(function () {
      var el = document.getElementById('hl37-key-hints-bar');
      if (el) { el.style.transition = 'opacity .8s'; el.style.opacity = '0'; faded = true; }
    }, 45000);
    document.addEventListener('dblclick', function () {
      var el = document.getElementById('hl37-key-hints-bar');
      if (el && faded) { el.style.opacity = '.8'; faded = false; }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();