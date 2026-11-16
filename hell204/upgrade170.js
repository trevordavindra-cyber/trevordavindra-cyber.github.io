/* hl170-ascent — THE ASCENT: after the eye has travelled down the record, a gold sigil rises at the corner; one touch returns to the first word */
(function () {
  if (window.__HL170) return; window.__HL170 = 1;
  var css = ".hl170-top{position:fixed;right:18px;bottom:140px;z-index:9300;width:42px;height:42px;border-radius:50%;border:1px solid rgba(197,164,91,.55);background:rgba(8,8,8,.92);color:#c5a45b;font-family:Georgia,'Times New Roman',serif;font-size:15px;text-align:center;cursor:pointer;opacity:0;pointer-events:none;transform:translateY(8px);transition:opacity .4s ease,transform .4s ease,box-shadow .4s ease;box-shadow:0 4px 18px rgba(0,0,0,.65);user-select:none;-webkit-tap-highlight-color:transparent}.hl170-top.on{opacity:.92;pointer-events:auto;transform:translateY(0)}.hl170-top:hover{box-shadow:0 0 0 1px rgba(197,164,91,.4),0 6px 22px rgba(0,0,0,.8)}@media (max-width:640px){.hl170-top{bottom:118px;right:14px;width:38px;height:38px;font-size:13px}}";
  var st = document.createElement('style'); st.id = 'hl170-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var btn = document.createElement('div');
  btn.className = 'hl170-top'; btn.setAttribute('role', 'button');
  btn.setAttribute('aria-label', 'Return to the first word'); btn.textContent = '\u2191';
  var placed = false;
  function place() { if (placed || !document.body) return; document.body.appendChild(btn); placed = true; }
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
    var t = null;
    el.addEventListener('scroll', function () {
      if (t) return;
      t = setTimeout(function () { t = null; }, 120);
      update();
    }, { passive: true });
  }
  function update() {
    place();
    var s = (scroller && scroller.isConnected) ? scroller : null;
    var y = s ? s.scrollTop : (window.scrollY || document.documentElement.scrollTop || 0);
    if (y > 320) btn.classList.add('on'); else btn.classList.remove('on');
  }
  btn.addEventListener('click', function () {
    var s = (scroller && scroller.isConnected) ? scroller : null;
    try {
      if (s) s.scrollTo({ top: 0, behavior: 'smooth' }); else window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) { if (s) s.scrollTop = 0; else window.scrollTo(0, 0); }
    setTimeout(update, 650);
  });
  var tries = 0; var iv = setInterval(function () {
    if (!document.body) return;
    findScroller(); update();
    if (++tries > 240) clearInterval(iv);
  }, 900);
})();
