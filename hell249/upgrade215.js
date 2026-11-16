/* ILLUMINATI upgrade #215: hl215-mobland (v19.122)
   PHONE HARDENING on top of hl214. Three deeper fixes for phones:
   1. Drawer taps no longer depend on the click event at all: a clean tap on a
      nav/module button (or the hamburger) fires the action straight from
      touchend, so iOS cannot cancel it by turning the tap into a scroll.
      The trailing real click is suppressed so nothing double-fires.
   2. On narrow screens #main itself becomes scrollable, and after a module
      opens the panel is scrolled to the top of #main as well as the page —
      the panel can never again sit out of reach below the live feed.
   3. While the drawer is open the floating minimap rail is inert, so its
      thin strip can no longer swallow taps meant for the menu.
   Nothing is removed: every original handler still runs, the live feed and
   all modules behave exactly as before. Guard: __HL215 */
(function () {
  if (window.__HL215) return; window.__HL215 = true;

  /* ---------- injected CSS ---------- */
  try {
    var st = document.createElement('style');
    st.id = 'hl215-style';
    st.textContent =
      '@media (max-width:760px){#main{overflow-y:auto !important;-webkit-overflow-scrolling:touch}}' +
      'body.ord-nav #hl192,body.ord-nav #hl192-railin,body.ord-nav #hl192-view{pointer-events:none !important}';
    (document.head || document.documentElement).appendChild(st);
  } catch (e) {}

  function mainEl() { return document.getElementById('main') || document.querySelector('main'); }
  function isDrawerBtn(b) {
    return !!(b && b.closest && (b.closest('nav button[data-m]') === b || b.closest('#ordmenu') === b));
  }

  /* ---------- land the panel at the top of #main too ---------- */
  function land() {
    var m = mainEl(); if (!m) return;
    var bs = m.querySelectorAll('button'), feed = null, i;
    for (i = 0; i < bs.length; i++) {
      if (/live feed/i.test((bs[i].textContent || '') + ' ' + (bs[i].getAttribute('aria-label') || ''))) { feed = bs[i]; break; }
    }
    if (!feed) return;
    var target = null;
    if (feed.parentElement === m) {
      var kids = m.children, idx = -1;
      for (i = 0; i < kids.length; i++) { if (kids[i] === feed) { idx = i; break; } }
      for (i = idx - 1; i >= 0; i--) {
        if (/^h[1-3]$/i.test(kids[i].tagName)) { target = kids[i]; break; }
      }
      if (!target) target = feed;
    } else {
      var host = feed.parentElement;
      target = host && host.querySelector ? host.querySelector('h1,h2,h3') : null;
      if (!target) target = host || feed;
    }
    function pass() {
      try {
        var mr = m.getBoundingClientRect(), tr = target.getBoundingClientRect();
        var d = Math.round(tr.top - mr.top - 8);
        if (Math.abs(d) > 4) m.scrollTop += d;
      } catch (e) {}
    }
    pass(); setTimeout(pass, 300); setTimeout(pass, 700);
  }

  /* ---------- return-to-feed lands at the top of the record ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('button') : null;
    if (b && /live feed/i.test((b.textContent || '') + ' ' + (b.getAttribute('aria-label') || '')) && b.closest('#main,main')) {
      setTimeout(function () { try { window.scrollTo(0, 0); } catch (er) {} }, 250);
    }
  }, true);

  /* ---------- touch-first tap handling ---------- */
  var armed = null, SYNTH = false;
  var fired = new WeakSet();          /* buttons we already fired from touchend */
  function bury(b) { try { fired.add(b); setTimeout(function () { fired.delete(b); }, 700); } catch (e) {} }

  function drawerOpen() { return document.body.classList.contains('ord-nav'); }

  document.addEventListener('touchstart', function (e) {
    var t = e.touches && e.touches[0]; if (!t) { armed = null; return; }
    var b = e.target && e.target.closest ? e.target.closest('button[data-m], #ordmenu') : null;
    armed = b ? { b: b, x: t.clientX, y: t.clientY, t: Date.now() } : null;
  }, { capture: true, passive: true });

  document.addEventListener('touchmove', function () {
    /* any real scroll cancels the pending tap-fire */
    if (armed) armed.moved = true;
  }, { capture: true, passive: true });

  document.addEventListener('touchend', function (e) {
    if (!armed) return;
    if (armed.moved) { armed = null; return; }
    var t = e.changedTouches && e.changedTouches[0]; if (!t) { armed = null; return; }
    var b = armed.b, x0 = armed.x, y0 = armed.y, t0 = armed.t;
    armed = null;
    if (!b || !b.isConnected) return;
    if (Math.abs(t.clientX - x0) > 14 || Math.abs(t.clientY - y0) > 14) return;
    if (Date.now() - t0 > 800) return;
    if (fired.has(b)) return;
    bury(b);
    if (b.id === 'ordmenu') {
      /* hamburger: toggle straight from the touch, suppress the trailing click */
      setTimeout(function () { try { document.body.classList.toggle('ord-nav'); } catch (er) {} }, 0);
    } else {
      setTimeout(function () {
        try {
          SYNTH = true; b.click(); SYNTH = false;
          setTimeout(land, 220); setTimeout(land, 750);
        } catch (er) { SYNTH = false; }
      }, 0);
    }
  }, { capture: true, passive: true });

  /* suppress the real click that follows a touch we already handled */
  document.addEventListener('click', function (e) {
    if (SYNTH) return;
    var b = e.target && e.target.closest ? e.target.closest('button[data-m], #ordmenu') : null;
    if (!b) return;
    if (fired.has(b)) { e.stopPropagation(); e.preventDefault(); }
  }, true);
})();
