// ILLUMINATI upgrade #44: hl44-star-map (v18.50)
// Seven tiny stars scattered across the upper-right sky that twinkle on their
// own schedules. Purely additive: one container div, pointer-events none.
// Under prefers-reduced-motion the stars hold static.
(function () {
  if (window.__hl44Stars) return;
  window.__hl44Stars = true;
  function start() {
    if (!document.body || document.getElementById('hl44-stars')) return;
    var box = document.createElement('div');
    box.id = 'hl44-stars';
    var st = document.createElement('style');
    st.textContent = '#hl44-stars{position:fixed;top:0;right:0;width:220px;height:180px;z-index:9993;pointer-events:none}'
      + '.hl44-star{position:absolute;width:2px;height:2px;border-radius:50%;background:#bfe9ff;box-shadow:0 0 6px rgba(0,229,255,.8)}'
      + '@keyframes hl44tw{0%,100%{opacity:.15}50%{opacity:.9}}'
      + '@media (prefers-reduced-motion: reduce){.hl44-star{animation:none !important;opacity:.5}}';
    document.head.appendChild(st);
    var pts = [[18,22],[64,12],[120,30],[168,54],[92,78],[40,96],[150,120]];
    for (var i = 0; i < pts.length; i++) {
      var s = document.createElement('div');
      s.className = 'hl44-star';
      s.style.left = pts[i][0] + 'px';
      s.style.top = pts[i][1] + 'px';
      s.style.animation = 'hl44tw ' + (2.4 + i * 0.7).toFixed(1) + 's ease-in-out ' + (i * 0.5).toFixed(1) + 's infinite';
      box.appendChild(s);
    }
    document.body.appendChild(box);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();