// ILLUMINATI upgrade #28: hl28-gate-starfall (v18.34)
// Easter egg: double-click the gate sigil and a shower of tiny falling
// stars rains down the screen for a moment, with a gold console line.
// Purely additive; guards a missing gate element.
(function () {
  if (window.__hl28Starfall) return;
  window.__hl28Starfall = true;
  document.addEventListener('DOMContentLoaded', function () {
    var sigil = document.getElementById('gate');
    if (!sigil) return;
    function spawn() {
      var s = document.createElement('div');
      var sz = (Math.random() * 4 + 2) + 'px';
      s.style.position = 'fixed';
      s.style.width = sz; s.style.height = sz;
      s.style.background = 'white';
      s.style.borderRadius = '50%';
      s.style.top = '-5px';
      s.style.left = (Math.random() * 100) + '%';
      s.style.opacity = '1';
      s.style.pointerEvents = 'none';
      s.style.zIndex = '2147483645';
      s.style.transition = 'top 1s ease-out, opacity 1s ease-out';
      document.body.appendChild(s);
      requestAnimationFrame(function () {
        s.style.top = '100%';
        s.style.opacity = '0';
      });
      setTimeout(function () {
        if (s.parentNode) s.parentNode.removeChild(s);
      }, 1100);
    }
    sigil.addEventListener('dblclick', function () {
      for (var i = 0; i < 30; i++) {
        setTimeout(spawn, Math.random() * 300);
      }
      console.log('%cIlluminatus! Stars descended.', 'color:gold;font-weight:bold;');
    });
  });
})();