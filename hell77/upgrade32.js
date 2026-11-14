// ILLUMINATI upgrade #32: hl32-type-the-eye (v18.38)
// Easter egg: typing E-Y-E anywhere on the page sends one golden pulse
// through the gate sigil and leaves a line in the console. No UI change.
(function () {
  if (window.__hl32Eye) return;
  window.__hl32Eye = true;
  var SEQ = ['e', 'y', 'e'];
  function start() {
    var idx = 0;
    document.addEventListener('keydown', function (e) {
      var k = (e.key || '').toLowerCase();
      if (k === SEQ[idx]) {
        idx++;
        if (idx === SEQ.length) {
          idx = 0;
          var eye = document.getElementById('gate') || document.querySelector('.gate, #eye-sigil, [data-eye]');
          if (eye) {
            var old = eye.style.boxShadow;
            eye.style.transition = 'box-shadow .2s';
            eye.style.boxShadow = '0 0 42px 10px rgba(255,193,7,.55)';
            setTimeout(function () { eye.style.boxShadow = old || ''; }, 450);
          }
          console.log('%c[EYE] You typed the eye. The eye typed back.', 'color:#ffc107');
        }
      } else {
        idx = (k === SEQ[0]) ? 1 : 0;
      }
    }, true);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else { start(); }
})();
