// ILLUMINATI upgrade #43: hl43-whisper (v18.49)
// A short occult whisper fades in and out in the lower-left corner every ~75 s.
// Additive only: one new div, pointer-events none, nothing existing touched;
// under reduced motion it holds one static line and never blinks.
(function () {
  if (window.__hl43Whisper) return;
  window.__hl43Whisper = true;
  var LINES = [
    'the eye is open.',
    'all lights answer to the order.',
    'silence is a signal too.',
    'you were seen arriving.',
    'the circle is not closed yet.'
  ];
  function start() {
    if (!document.body || document.getElementById('hl43-whisper')) return;
    var d = document.createElement('div');
    d.id = 'hl43-whisper';
    d.style.cssText = 'position:fixed;left:16px;bottom:64px;z-index:9993;pointer-events:none;' +
      'font-family:monospace;font-size:10px;letter-spacing:2px;font-style:italic;' +
      'color:rgba(192,0,32,.5);opacity:0;transition:opacity 2.5s;';
    document.body.appendChild(d);
    var i = 0;
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) {
      d.textContent = LINES[0];
      d.style.opacity = '.6';
      return;
    }
    function cycle() {
      var el = document.getElementById('hl43-whisper');
      if (!el) return;
      el.textContent = LINES[i % LINES.length];
      i++;
      el.style.opacity = '.55';
      setTimeout(function () { if (el && el.isConnected) el.style.opacity = '0'; }, 6000);
    }
    cycle();
    setInterval(cycle, 75000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();