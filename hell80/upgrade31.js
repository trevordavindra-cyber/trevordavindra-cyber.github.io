// ILLUMINATI upgrade #31: hl31-synapse-gauge (v18.37)
// A tiny "Synapse" activity gauge chip pinned to the bottom-right HUD corner.
// Purely cosmetic: the gauge drifts on its own and nudges up while you type.
(function () {
  if (window.__hl31Synapse) return;
  window.__hl31Synapse = true;
  function start() {
    if (!document.body || document.getElementById('hl31-synapse')) return;
    var chip = document.createElement('div');
    chip.id = 'hl31-synapse';
    chip.style.cssText = 'position:fixed;bottom:10px;right:10px;z-index:2147483637;'
      + 'padding:4px 9px;border-radius:6px;font:11px monospace;letter-spacing:.5px;'
      + 'background:rgba(10,12,16,.75);border:1px solid rgba(0,229,255,.25);'
      + 'color:#00e5ff;pointer-events:none;opacity:.85;';
    document.body.appendChild(chip);
    var level = 41.3;
    function tick() {
      var typing = !!document.activeElement
        && /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName || '');
      level += (Math.random() - 0.48) * 9 + (typing ? 3.2 : 0);
      if (level < 12) level = 12;
      if (level > 97) level = 97;
      chip.textContent = 'SYNAPSE ' + level.toFixed(1) + '%';
      setTimeout(tick, 600);
    }
    tick();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else { start(); }
})();