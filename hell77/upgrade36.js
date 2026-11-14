// ILLUMINATI upgrade #36: hl36-uptime-badge (v18.42)
// Small session-uptime badge bottom-left: minutes since page load, ticks every 60s.
// Additive only; self-written this cycle (relay failed 3 attempts).
(function () {
  if (window.__hl36Uptime) return;
  window.__hl36Uptime = true;
  function fmt(mins) {
    if (mins < 60) return mins + 'm';
    var h = Math.floor(mins / 60), m = mins % 60;
    return h + 'h ' + m + 'm';
  }
  function start() {
    if (!document.body) return;
    var t0 = Date.now();
    var b = document.createElement('div');
    b.id = 'hl36-uptime';
    b.title = 'Session uptime';
    b.style.cssText = 'position:fixed;left:14px;bottom:14px;z-index:9997;font-family:monospace;font-size:10px;letter-spacing:2px;color:#9fb6c9;background:rgba(8,10,18,.65);border:1px solid rgba(159,182,201,.25);border-radius:10px;padding:5px 10px;pointer-events:auto;backdrop-filter:blur(4px);';
    b.textContent = 'UP 0m';
    document.body.appendChild(b);
    setInterval(function () {
      var el = document.getElementById('hl36-uptime');
      if (!el) return;
      el.textContent = 'UP ' + fmt(Math.floor((Date.now() - t0) / 60000));
    }, 60000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
