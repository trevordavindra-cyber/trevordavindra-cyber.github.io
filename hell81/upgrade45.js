// ILLUMINATI upgrade #45: hl45-moon-phase (v18.51)
// A small moon glyph in the top-right shows the current lunar phase, computed
// from the date. Static by nature: no motion is added, nothing is removed.
(function () {
  if (window.__hl45Moon) return;
  window.__hl45Moon = true;
  var PHASES = ['new moon','waxing crescent','first quarter','waxing gibbous','full moon','waning gibbous','last quarter','waning crescent'];
  var GLYPHS = ['\u25CF','\uD83C\uDF12','\uD83C\uDF13','\uD83C\uDF14','\u25CB','\uD83C\uDF16','\uD83C\uDF17','\uD83C\uDF18'];
  var MS = 86400000, CYC = 29.530588853;
  var ref = Date.UTC(2000, 0, 6, 18, 14); // known new moon
  function start() {
    if (!document.body || document.getElementById('hl45-moon')) return;
    var days = (Date.now() - ref) / MS;
    var frac = ((days % CYC) + CYC) % CYC;
    var idx = Math.round(frac / CYC * 8) % 8;
    var d = document.createElement('div');
    d.id = 'hl45-moon';
    d.title = PHASES[idx] + ' \u2014 the eye watches';
    d.textContent = GLYPHS[idx];
    d.style.cssText = 'position:fixed;top:10px;right:12px;z-index:9992;pointer-events:none;' +
      'font-size:15px;color:rgba(255,45,60,.75);text-shadow:0 0 8px rgba(255,45,60,.5);';
    document.body.appendChild(d);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();