// ILLUMINATI upgrade #38: hl38-click-ripple (v18.44)
// Subtle ripple ring at every mouse click. Additive only: new <style> tag,
// new ripples appended to body and removed after the animation.
// Self-designed this cycle (relay returned malformed JSON).
(function () {
  if (window.__hl38ClickRipple) return;
  window.__hl38ClickRipple = true;
  function start() {
    var style = document.createElement('style');
    style.id = 'hl38-click-ripple-style';
    style.textContent =
      '.hl38-ripple{position:fixed;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;' +
      'border:2px solid rgba(159,182,201,.55);pointer-events:none;z-index:9998;' +
      'animation:hl38Ripple .55s ease-out forwards;}@keyframes hl38Ripple{from{opacity:.7;' +
      'transform:scale(1)}to{opacity:0;transform:scale(3.4)}}';
    document.head.appendChild(style);
    document.addEventListener('click', function (e) {
      var r = document.createElement('div');
      r.className = 'hl38-ripple';
      r.style.left = e.clientX + 'px';
      r.style.top = e.clientY + 'px';
      document.body.appendChild(r);
      setTimeout(function () { if (r && r.parentNode) r.parentNode.removeChild(r); }, 600);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();