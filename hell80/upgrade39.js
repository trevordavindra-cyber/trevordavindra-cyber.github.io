// ILLUMINATI upgrade #39: hl39-clock-chip (v18.45)
// Small top-right chip showing the visitor's local time, ticking every 30s.
// Additive only: one new div, no existing element or behavior touched.
(function () {
  if (window.__hl39ClockChip) return;
  window.__hl39ClockChip = true;
  function start() {
    if (!document.body) return;
    var d = document.createElement('div');
    d.id = 'hl39-clock-chip';
    d.title = 'Local time';
    d.style.cssText = 'position:fixed;top:10px;right:12px;z-index:9995;font-family:monospace;' +
      'font-size:11px;letter-spacing:1.5px;color:#7de3ff;background:rgba(4,8,14,.55);' +
      'border:1px solid rgba(125,227,255,.25);border-radius:999px;padding:4px 10px;' +
      'pointer-events:none;backdrop-filter:blur(3px);';
    function tick() {
      var n = new Date();
      var h = n.getHours(), m = n.getMinutes();
      var ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12; if (h === 0) h = 12;
      var mm = (m < 10 ? '0' : '') + m;
      var el = document.getElementById('hl39-clock-chip');
      if (el) el.textContent = h + ':' + mm + ' ' + ampm;
    }
    document.body.appendChild(d);
    tick();
    setInterval(tick, 30000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();