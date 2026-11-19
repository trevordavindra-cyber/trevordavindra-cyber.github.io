/* ILLUMINATI upgrade #286: hl286-opener-pane (v19.192)
   THE DRAWER GETS ITS OWN SCROLL ENGINE. Swiping the tab opener's list has
   refused on the phone no matter what was layered on top, so the list now
   moves inside a dedicated inner pane: every entry of the tab opener is
   wrapped in a real, purpose-built scroll surface with iOS momentum
   scrolling, touch-action pan-y and its own drag-to-scroll engine. The pane
   owns the whole drawer area, so the list scrolls there no matter what the
   outer container decides to do. A tiny live readout at the drawer's bottom
   edge reports the pane's real measurements so any remaining stick can be
   diagnosed from a screenshot. Nothing is removed: every entry, every
   original handler, the earlier compaction and the tap arrows all still
   run. Guard: __HL286 */
(function () {
  if (window.__HL286) return; window.__HL286 = 1;

  /* ---------- CSS ---------- */
  try {
    var stl = document.createElement('style');
    stl.id = 'hl286-style';
    stl.textContent = [
      '#hl286-pane{display:contents}',
      '#hl286-dbgi{display:none}',
      '@media (max-width:820px){',
      ' body.ord-nav #nav{overflow:visible!important;padding:0!important}',
      ' #hl286-pane{display:block;position:absolute;top:0;left:0;right:0;bottom:0;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;touch-action:pan-y;overscroll-behavior:contain;padding:calc(14px + env(safe-area-inset-top)) 10px calc(118px + env(safe-area-inset-bottom));scrollbar-width:none}',
      ' #hl286-pane::-webkit-scrollbar{display:none}',
      ' body.ord-nav #hl286-dbgi{display:block;position:absolute;left:6px;right:6px;bottom:calc(88px + env(safe-area-inset-bottom));font-size:8px;letter-spacing:.12em;color:rgba(201,162,39,.6);pointer-events:none;text-align:center;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}',
      '}'
    ].join('\n');
    (document.head || document.documentElement).appendChild(stl);
  } catch (e) {}

  function navEl() { return document.getElementById('nav'); }
  function paneEl() { return document.getElementById('hl286-pane'); }

  var touchCount = 0;
  function buildPane() {
    var n = navEl(); if (!n || !n.parentNode) return null;
    var p = paneEl();
    if (!p) {
      p = document.createElement('div');
      p.id = 'hl286-pane';
      var kids = Array.prototype.slice.call(n.childNodes);
      for (var i = 0; i < kids.length; i++) {
        if (kids[i].nodeType === 1 || (kids[i].nodeType === 3 && kids[i].textContent.trim())) {
          if (kids[i].id !== 'hl286-dbgi') p.appendChild(kids[i]);
        }
      }
      n.appendChild(p);
      var d = document.createElement('div');
      d.id = 'hl286-dbgi';
      n.appendChild(d);
      try {
        p.addEventListener('touchmove', function () { touchCount++; }, { passive: true });
      } catch (e) {}
    }
    return p;
  }

  /* move anything later re-added straight into #nav back into the pane */
  try {
    new MutationObserver(function (muts) {
      var n = navEl(), p = paneEl(); if (!n || !p) return;
      for (var i = 0; i < muts.length; i++) {
        var added = muts[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var nd = added[j];
          if (nd.parentNode === n && nd.id !== 'hl286-pane' && nd.id !== 'hl286-dbgi') p.appendChild(nd);
        }
      }
    }).observe(document.documentElement, { childList: true, subtree: true });
  } catch (e) {}

  /* ---------- drag-to-scroll on the pane ---------- */
  function drag(p) {
    var y0 = 0, s0 = 0, on = false, vy = 0, lastY = 0, raf = 0;
    p.addEventListener('touchstart', function (e) {
      var t = e.touches && e.touches[0]; if (!t) return;
      y0 = t.clientY; lastY = y0; s0 = p.scrollTop; on = true; vy = 0;
      cancelAnimationFrame(raf);
    }, { capture: true, passive: true });
    p.addEventListener('touchmove', function (e) {
      if (!on) return;
      var t = e.touches && e.touches[0]; if (!t) return;
      var dy = y0 - t.clientY;
      vy = lastY - t.clientY; lastY = t.clientY;
      if (Math.abs(dy) > 7) {
        try { e.preventDefault(); } catch (er) {}
        p.scrollTop = Math.max(0, Math.min(p.scrollHeight - p.clientHeight, s0 + dy));
      }
    }, { capture: true, passive: false });
    p.addEventListener('touchend', function () {
      if (!on) return; on = false;
      if (Math.abs(vy) < 3) return;
      var v = vy * 14, max = p.scrollHeight - p.clientHeight;
      (function gl() {
        v *= 0.93;
        p.scrollTop = Math.max(0, Math.min(max, p.scrollTop - v));
        if (Math.abs(v) > 0.6) raf = requestAnimationFrame(gl);
      })();
    }, { passive: true });
  }

  /* ---------- point the tap arrows at the pane too ---------- */
  function glidePane(dir) {
    var p = paneEl(); if (!p) return;
    cancelAnimationFrame(window.__hl286raf || 0);
    var step = Math.max(180, p.clientHeight * 0.8) * dir;
    var start = p.scrollTop;
    var target = Math.max(0, Math.min(p.scrollHeight - p.clientHeight, start + step));
    var t0 = Date.now();
    (function go() {
      var k = Math.min(1, (Date.now() - t0) / 280);
      var e = 1 - Math.pow(1 - k, 3);
      p.scrollTop = start + (target - start) * e;
      if (k < 1) window.__hl286raf = requestAnimationFrame(go);
    })();
  }
  function wireArrows() {
    ['hl285-up', 'hl285-dn'].forEach(function (id, i) {
      var b = document.getElementById(id);
      if (!b || b.__hl286wired) return;
      b.__hl286wired = 1;
      var dir = i === 0 ? -1 : 1, done = false;
      function fire(e) {
        if (done) return; done = true;
        setTimeout(function () { done = false; }, 700);
        glidePane(dir);
        try { e.preventDefault(); } catch (er) {}
        try { e.stopPropagation(); } catch (er) {}
      }
      b.addEventListener('touchend', fire, { passive: false });
      b.addEventListener('click', fire);
    });
  }

  /* ---------- live readout ---------- */
  function dbg() {
    var d = document.getElementById('hl286-dbgi'); if (!d) return;
    var p = paneEl(); if (!p) { d.textContent = 'PANE WAITING'; return; }
    d.textContent = 'SCR ' + p.scrollHeight + '/' + p.clientHeight + ' top' + Math.round(p.scrollTop) +
      ' tch' + touchCount + ' arr' + (document.getElementById('hl285-up') ? 2 : 0);
  }

  var tries = 0;
  (function hunt() {
    var p = buildPane();
    if (p && !p.__hl286drag) { p.__hl286drag = 1; drag(p); }
    wireArrows();
    dbg();
    if (tries++ < 60) setTimeout(hunt, 250);
  })();
  setInterval(dbg, 400);
})();
