/* hl175-thread — THE THREAD: a fine gold cord tracks the eye's descent through the record, drawn along the crown of the chamber */
(function () {
  if (window.__HL175) return; window.__HL175 = 1;
  var css = "#hl175-thread{position:fixed;top:0;left:0;height:2px;width:0;z-index:9500;pointer-events:none;background:linear-gradient(90deg,rgba(216,180,90,.95),rgba(216,180,90,.3));box-shadow:0 0 8px rgba(216,180,90,.45);transition:width .25s ease}";
  var st = document.createElement('style'); st.id = 'hl175-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var bar = null;
  function place() {
    if (bar || !document.body) return;
    bar = document.createElement('div'); bar.id = 'hl175-thread';
    document.body.appendChild(bar);
  }
  var scroller = null, boundWin = false;
  function findScroller() {
    if (scroller && scroller.isConnected) return scroller;
    var best = null, bestGap = 0;
    var all = document.querySelectorAll('*');
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      var oy = getComputedStyle(el).overflowY;
      if (oy !== 'auto' && oy !== 'scroll') continue;
      var gap = el.scrollHeight - el.clientHeight;
      if (gap > bestGap && gap > 200) { bestGap = gap; best = el; }
    }
    if (best) { scroller = best; bind(best); } else { bindWin(); }
    return best;
  }
  function bindWin() { if (boundWin || !window.addEventListener) return; boundWin = true; bind(window); }
  function bind(el) {
    if (el.__hl175bound) return; el.__hl175bound = 1;
    el.addEventListener('scroll', update, { passive: true });
  }
  function update() {
    place(); if (!bar) return;
    var s = (scroller && scroller.isConnected) ? scroller : null;
    var y = s ? s.scrollTop : (window.scrollY || document.documentElement.scrollTop || 0);
    var h = s ? (s.scrollHeight - s.clientHeight) : (document.documentElement.scrollHeight - window.innerHeight);
    if (h > 200) {
      var p = Math.max(0, Math.min(1, y / h));
      bar.style.width = (p * 100).toFixed(2) + '%';
    } else { bar.style.width = '0'; }
  }
  window.addEventListener('resize', update);
  var iv = setInterval(function () {
    if (!document.body) return;
    findScroller(); update();
  }, 1200);
})();
