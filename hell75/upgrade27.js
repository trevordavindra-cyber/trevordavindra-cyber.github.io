// ILLUMINATI upgrade #27: hl27-fps-chip (v18.33)
// Tiny frames-per-second chip pinned to the bottom-right corner; quietly
// fades after 60 s so it stays subtle. Purely additive.
(function () {
  if (window.__hl27Fps) return;
  window.__hl27Fps = true;
  function start() {
    if (!document.body || document.getElementById('hl27-fps-chip')) return;
    var chip = document.createElement('div');
    chip.id = 'hl27-fps-chip';
    chip.textContent = 'FPS --';
    chip.style.cssText = 'position:fixed;right:8px;bottom:8px;z-index:2147483646;'
      + 'font:10px/1 monospace;letter-spacing:.5px;color:rgba(0,229,255,.85);'
      + 'background:rgba(0,0,0,.45);border:1px solid rgba(0,229,255,.25);'
      + 'border-radius:4px;padding:3px 6px;opacity:.55;pointer-events:none;'
      + 'transition:opacity .6s;';
    document.body.appendChild(chip);
    var frames = 0, last = performance.now();
    function loop(t) {
      frames++;
      if (t - last >= 500) {
        chip.textContent = 'FPS ' + Math.max(0, Math.round(frames * 1000 / (t - last)));
        frames = 0; last = t;
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    setTimeout(function () { chip.style.opacity = '.3'; }, 60000);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else { start(); }
})();