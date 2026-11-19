/* ILLUMINATI upgrade #284: hl284-drawer-scroll (v19.190)
   THE OPENER SCROLLS. On phones the tab opener (the drawer that lists
   COMMAND CENTER down through STATUS and COLLAPSE) could not be dragged:
   its lower entries sat out of reach behind the composer. Three fixes,
   purely additive:
   1. CSS re-asserts the drawer as a real scroller (overflow, pan-y touch
      action, momentum scrolling) and lifts the last entries clear of the
      composer and the floating buttons with bottom clearance.
   2. A finger-drag scroller moves the list straight from touch moves, so
      the drawer follows your finger even if the browser's own pan is
      intercepted by anything else. Gentle inertia glide on release.
   3. Taps stay taps: the drag only engages after a clear vertical pull, so
      opening a module from the drawer works exactly as before.
   Nothing is removed: native scrolling still works when available and every
   original handler still runs. Guard: __HL284 */
(function () {
  if (window.__HL284) return; window.__HL284 = 1;

  /* ---------- CSS ---------- */
  try {
    var stl = document.createElement('style');
    stl.id = 'hl284-style';
    stl.textContent = [
      'body.ord-nav #nav{overflow-y:auto!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important;overscroll-behavior:contain!important;pointer-events:auto!important}',
      'body.ord-nav #nav{padding-bottom:calc(170px + env(safe-area-inset-bottom))!important}',
      '@media (max-width:820px){body.ord-nav #nav{height:100%!important;max-height:100%!important}}'
    ].join('\n');
    (document.head || document.documentElement).appendChild(stl);
  } catch (e) {}

  function isOpen() { return document.body.classList.contains('ord-nav'); }
  function maxTop(n) { return Math.max(0, n.scrollHeight - n.clientHeight); }

  /* ---------- finger-drag scroller ---------- */
  var st0 = 0, y0 = 0, x0 = 0, dragging = false, lastY = 0, lastT = 0, vel = 0, raf = 0;

  function glide(n) {
    cancelAnimationFrame(raf);
    var v = vel;
    function step() {
      if (Math.abs(v) < 0.4) return;
      var before = n.scrollTop;
      var after = Math.min(maxTop(n), Math.max(0, before - v));
      n.scrollTop = after;
      if (after === before || after <= 0 || after >= maxTop(n)) return;
      v *= 0.93;
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }

  function attach(n) {
    n.addEventListener('touchstart', function (e) {
      if (!isOpen()) { dragging = false; return; }
      cancelAnimationFrame(raf);
      var t = e.touches && e.touches[0]; if (!t) return;
      st0 = n.scrollTop; y0 = t.clientY; x0 = t.clientX;
      lastY = y0; lastT = Date.now(); vel = 0; dragging = false;
    }, { capture: true, passive: true });

    n.addEventListener('touchmove', function (e) {
      if (!isOpen()) return;
      var t = e.touches && e.touches[0]; if (!t) return;
      var dy = y0 - t.clientY, dx = t.clientX - x0;
      if (!dragging) {
        if (Math.abs(dy) < 7 || Math.abs(dy) <= Math.abs(dx)) return;
        dragging = true;
      }
      e.preventDefault();  /* our drag owns the motion; the browser's pan steps aside */
      n.scrollTop = Math.max(0, Math.min(maxTop(n), st0 + dy));
      var now = Date.now(), dt = now - lastT;
      if (dt > 0 && dt < 70) vel = (t.clientY - lastY) / dt * 16;
      lastY = t.clientY; lastT = now;
    }, { capture: true, passive: false });

    n.addEventListener('touchend', function () {
      if (dragging) { dragging = false; glide(n); }
    }, { capture: true, passive: true });
    n.addEventListener('touchcancel', function () { dragging = false; }, { capture: true, passive: true });
  }

  var tries = 0;
  (function hunt() {
    var n = document.getElementById('nav');
    if (n && !n.__hl284) { n.__hl284 = 1; attach(n); return; }
    if (tries++ < 40) setTimeout(hunt, 250);
  })();
})();
