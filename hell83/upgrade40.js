// ILLUMINATI upgrade #40: hl40-moon-chip (v18.46)
// Tiny top-left chip showing tonight's moon phase (glyph + name), computed
// locally from the synodic month. Additive only: one new div, no animation,
// no existing element or behavior touched.
(function () {
  if (window.__hl40MoonChip) return;
  window.__hl40MoonChip = true;
  function start() {
    if (!document.body) return;
    var d = document.createElement('div');
    d.id = 'hl40-moon-chip';
    d.title = 'Moon phase';
    d.style.cssText = 'position:fixed;top:10px;left:12px;z-index:9994;font-family:monospace;' +
      'font-size:11px;letter-spacing:1.5px;color:#c9b6ff;background:rgba(10,6,20,.55);' +
      'border:1px solid rgba(176,108,255,.25);border-radius:999px;padding:4px 10px;' +
      'pointer-events:none;';
    var glyphs = ['🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘'];
    var names = ['new moon','waxing crescent','first quarter','waxing gibbous','full moon','waning gibbous','last quarter','waning crescent'];
    function tick() {
      var ref = Date.UTC(2000, 0, 6, 18, 14);
      var days = (Date.now() - ref) / 86400000;
      var phase = (days % 29.530588853) / 29.530588853;
      var idx = Math.round(phase * 8) % 8;
      var el = document.getElementById('hl40-moon-chip');
      if (el) el.textContent = glyphs[idx] + ' ' + names[idx];
    }
    document.body.appendChild(d);
    tick();
    setInterval(tick, 600000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();