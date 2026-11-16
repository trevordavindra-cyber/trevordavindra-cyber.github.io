/* ILLUMINATI upgrade #205: hl205-railAlign (v19.113)
   Lines the right-side tool buttons up into one perfectly straight vertical
   column, every button the same 34px circle at the same distance from the
   right edge, evenly spaced, in their original top-to-bottom order. Purely
   geometric: no button is added, removed or re-wired, and every click keeps
   doing exactly what it did. Re-asserted on a gentle loop so upgrades that
   reposition their own buttons stay aligned too. Guard: __HL205 */
(function () {
  if (window.__HL205) return; window.__HL205 = true;

  var SELS = ['.hl139-chip','.hl140-chip','.hl146-chip','.hl143-zbtn','.hl149-chip','.hl150-chip','.hl151-chip','.hl155-chip'];
  var SIZE = 34, GAP = 44, RIGHT = 8;

  function layout() {
    var els = [];
    for (var i = 0; i < SELS.length; i++) {
      var e = document.querySelector(SELS[i]);
      if (!e) continue;
      var cs;
      try { cs = getComputedStyle(e); } catch (err) { continue; }
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      els.push([e, e.getBoundingClientRect().top]);
    }
    if (els.length < 2) return;
    els.sort(function (a, b) { return a[1] - b[1]; });
    var top = Math.round(els[0][1]);
    for (var j = 0; j < els.length; j++) {
      var el = els[j][0];
      var s = el.style;
      if (s.width !== SIZE + 'px' || s.getPropertyPriority('width') !== 'important') s.setProperty('width', SIZE + 'px', 'important');
      if (s.height !== SIZE + 'px' || s.getPropertyPriority('height') !== 'important') s.setProperty('height', SIZE + 'px', 'important');
      if (s.left !== 'auto') s.setProperty('left', 'auto', 'important');
      if (s.right !== RIGHT + 'px') s.setProperty('right', RIGHT + 'px', 'important');
      if (s.bottom !== 'auto') s.setProperty('bottom', 'auto', 'important');
      var want = (top + j * GAP) + 'px';
      if (s.top !== want) s.setProperty('top', want, 'important');
      if (s.borderRadius !== '50%') s.setProperty('borderRadius', '50%', 'important');
      if (s.lineHeight !== (SIZE - 2) + 'px') s.setProperty('lineHeight', (SIZE - 2) + 'px', 'important');
      if (s.transform !== 'none') s.setProperty('transform', 'none', 'important');
      if (s.margin !== '0px') s.setProperty('margin', '0px', 'important');
    }
  }

  if (document.body) setTimeout(layout, 300);
  setInterval(layout, 500);
  window.addEventListener('resize', layout);
  window.addEventListener('orientationchange', layout);
})();
