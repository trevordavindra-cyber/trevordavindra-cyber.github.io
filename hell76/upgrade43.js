// ILLUMINATI upgrade #43: hl43-whisper (v18.49)
// An italic red occult whisper fades in and out in the lower-left every ~75 s,
// cycling through quiet lines. Static under reduced motion.
(function () {
  if (window.__hl43Whisper) return;
  window.__hl43Whisper = true;
  var LINES = ['the eye was open before you opened it','you found this path, not by accident','nine lights, one watch','the mirror remembers every visitor'];
  function start() {
    if (!document.body || document.getElementById('hl43-whisper')) return;
    var d = document.createElement('div');
    d.id = 'hl43-whisper';
    d.style.cssText = 'position:fixed;left:16px;bottom:38px;z-index:9993;pointer-events:none;' +
      'font-family:monospace;font-style:italic;font-size:11px;letter-spacing:2px;' +
      'color:rgba(255,45,60,.55);opacity:0;transition:opacity 1.2s;';
    document.body.appendChild(d);
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) {
      d.style.opacity = '1'; d.textContent = LINES[0]; return;
    }
    var i = 0;
    function flash() {
      var el = document.getElementById('hl43-whisper');
      if (!el) return;
      el.textContent = LINES[i % LINES.length]; i++;
      el.style.opacity = '1';
      setTimeout(function () { el.style.opacity = '0'; }, 4200);
    }
    flash();
    setInterval(flash, 75000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
