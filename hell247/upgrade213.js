/* ILLUMINATI upgrade #213: hl213-navreveal (v19.120)
   MENU TAPS ALWAYS LAND YOU IN THE MODULE YOU PICKED, ON PHONES INCLUDED.
   What the screen recording showed: the drawer stays open, a tap on a menu
   item after scrolling the drawer can be cancelled by iOS (no click ever
   fires, the drawer just sits there), and when the click does fire the
   module's panel is appended below the live feed where nothing scrolled
   you, so it looks like the menu sent you back to the chat.
   Fixes, purely additive (every original handler still runs):
   1) tap keeper: a clean tap on a menu button that iOS cancels (no click
      within 400ms) is re-fired once, so the module still opens;
   2) reveal: the panel that the tap adds or uncovers is found by diffing
      #main before/after and scrolled to the top of the screen, retried,
      so late-rendered panels are caught too;
   3) the drawer is closed for real after any menu tap.
   Guard: __HL213 */
(function () {
  if (window.__HL213) return; window.__HL213 = true;

  function drawerOpen() { return document.body.classList.contains('ord-nav'); }
  function closeDrawer() { try { document.body.classList.remove('ord-nav'); } catch (e) {} }
  function mainEl() { return document.getElementById('main') || document.querySelector('main'); }

  /* --- snapshot of #main's direct children: identity + visibility --- */
  function snap() {
    var m = mainEl(); if (!m) return null;
    var set = new Set(), hid = new Set();
    for (var i = 0; i < m.children.length; i++) {
      var c = m.children[i]; set.add(c);
      try { if (getComputedStyle(c).display === 'none') hid.add(c); } catch (e) {}
    }
    return { set: set, hid: hid };
  }

  function visible(c) {
    try { if (getComputedStyle(c).display === 'none') return false;
      var r = c.getBoundingClientRect(); return r.width > 2 && r.height > 2; } catch (e) { return false; }
  }

  function findReveal(pre) {
    var m = mainEl(); if (!m || !pre) return null;
    for (var i = 0; i < m.children.length; i++) {
      var c = m.children[i];
      if (!pre.set.has(c) && visible(c)) return c;
      if (pre.set.has(c) && pre.hid.has(c) && visible(c)) return c;
    }
    for (var j = 0; j < m.children.length; j++) {
      var d = m.children[j];
      if (!pre.set.has(d)) {
        var inside = d.querySelector ? d.querySelector('h1,h2,h3,textarea,button,input,select') : null;
        if (inside && visible(d)) return d;
      }
    }
    return null;
  }

  function toTop(el) {
    try {
      el.scrollIntoView({ behavior: 'auto', block: 'start' });
      var r = el.getBoundingClientRect();
      if (Math.abs(r.top) > 4) {
        var a = el.parentElement;
        while (a && a !== document.body) {
          var cs = getComputedStyle(a);
          if (/(auto|scroll)/.test(cs.overflowY)) { a.scrollTop += r.top; break; }
          a = a.parentElement;
        }
        window.scrollTo(0, window.pageYOffset + r.top);
      }
    } catch (e) {}
  }

  function reveal(pre, round) {
    if (!round) round = 0;
    closeDrawer();
    var hit = findReveal(pre);
    if (hit) { toTop(hit); return; }
    if (round < 4) setTimeout(function () { reveal(pre, round + 1); }, round === 0 ? 330 : 550);
  }

  /* 1) menu tap: snapshot, close the drawer, reveal what the tap opens */
  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('#nav button[data-m]') : null;
    if (!b) return;
    var pre = snap();
    markFired(b);
    setTimeout(function () { reveal(pre, 0); }, 140);
    setTimeout(function () { reveal(pre, 2); }, 900);
  }, true);

  /* 2) tap keeper: iOS cancels the click after the drawer was scrolled;
     a clean tap that produced no click is re-fired once */
  var tap = null, fired = new WeakSet();
  function markFired(b) { try { fired.add(b); setTimeout(function () { fired.delete(b); }, 600); } catch (e) {} }
  document.addEventListener('pointerdown', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('#nav button[data-m]') : null;
    tap = b ? { b: b, x: e.clientX, y: e.clientY, t: Date.now() } : null;
  }, true);
  document.addEventListener('pointerup', function (e) {
    if (!tap) return;
    var b = tap.b;
    var dx = Math.abs(e.clientX - tap.x), dy = Math.abs(e.clientY - tap.y), dt = Date.now() - tap.t;
    tap = null;
    if (dx > 14 || dy > 14 || dt > 800) return;
    setTimeout(function () {
      try {
        if (!fired.has(b) && b.isConnected && drawerOpen()) { fired.add(b); b.click(); }
      } catch (err) {}
    }, 420);
  }, true);
})();
