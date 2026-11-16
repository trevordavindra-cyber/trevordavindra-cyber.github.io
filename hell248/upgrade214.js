/* ILLUMINATI upgrade #214: hl214-reveal2 (v19.121)
   FULL AUDIT FOLLOW-UP for menu taps on phones. What the audit found:
   (a) the module panel is injected below the live feed, and on a phone it
       lands fully below the fold while #main itself does not scroll, so the
       screen must scroll the PAGE to reach it — the old reveal only scrolled
       when it saw a brand-new element, so a second tap (panel already open)
       scrolled nothing and it looked like the menu bounced you back to chat;
   (b) iOS can cancel the click right after the drawer was scrolled, and it
       can also refuse a programmatic scroll while the drawer's close
       transition is still running;
   (c) the left minimap rail floats above the drawer, so a tap on its 7px
       strip glides the record instead of opening a module.
   This upgrade makes the reveal certain: it scrolls to the panel by diff,
   by the panel's own "live feed" marker, by heading match, or to the bottom
   of the record as a last resort; it re-asserts the scroll three times to
   beat the drawer transition; it also re-fires a clean tap whose click iOS
   cancelled, from touch events too. Every original handler still runs.
   Guard: __HL214 */
(function () {
  if (window.__HL214) return; window.__HL214 = true;

  function drawerOpen() { return document.body.classList.contains('ord-nav'); }
  function closeDrawer() { try { document.body.classList.remove('ord-nav'); } catch (e) {} }
  function mainEl() { return document.getElementById('main') || document.querySelector('main'); }

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
  function diffHit(pre) {
    var m = mainEl(); if (!m || !pre) return null;
    for (var i = 0; i < m.children.length; i++) {
      var c = m.children[i];
      if (!pre.set.has(c) && visible(c)) return c;
      if (pre.set.has(c) && pre.hid.has(c) && visible(c)) return c;
    }
    return null;
  }
  function liveFeedHit() {
    var m = mainEl(); if (!m) return null;
    var bs = m.querySelectorAll('button');
    for (var i = 0; i < bs.length; i++) {
      if (/live feed/i.test((bs[i].textContent || '') + ' ' + (bs[i].getAttribute('aria-label') || ''))) return bs[i];
    }
    return null;
  }
  function headHit(label) {
    var m = mainEl(); if (!m || !label) return null;
    var hs = m.querySelectorAll('h1,h2,h3');
    var L = String(label).toLowerCase();
    for (var i = 0; i < hs.length; i++) {
      var t = (hs[i].textContent || '').toLowerCase();
      if (L && t.indexOf(L) >= 0) return hs[i];
    }
    return null;
  }

  function absTop(el) {
    var r = el.getBoundingClientRect();
    return r.top + (window.pageYOffset || document.documentElement.scrollTop || 0);
  }
  function toTop(el, center) {
    try {
      var top = absTop(el);
      var vh = window.innerHeight || 800;
      var y = center ? Math.max(0, top - vh / 2 + 40) : Math.max(0, top - 8);
      window.scrollTo(0, y);
      el.scrollIntoView({ behavior: 'auto', block: center ? 'center' : 'start' });
      var r2 = el.getBoundingClientRect();
      if (Math.abs(center ? (r2.top - vh / 2 + 40) : r2.top) > 30) window.scrollTo(0, y);
    } catch (e) {}
  }

  function findTarget(pre, label) {
    var t = diffHit(pre); if (t) return { el: t, center: false };
    var b = liveFeedHit();
    if (b) {
      var m = mainEl();
      var kids = m.children, idx = -1;
      for (var i = 0; i < kids.length; i++) {
        if (kids[i] === b || (b.parentElement === m && kids[i].contains(b) && kids[i] !== m)) { idx = i; break; }
        if (kids[i].contains && kids[i].contains(b)) { idx = i; break; }
      }
      if (idx > 0) {
        for (var j = idx - 1; j >= 0; j--) {
          if (/^h[1-3]$/i.test(kids[j].tagName) && visible(kids[j])) return { el: kids[j], center: false };
        }
      }
      return { el: b, center: true };
    }
    t = headHit(label); if (t) return { el: t, center: false };
    return null;
  }

  function reveal(pre, label, round) {
    if (!round) round = 0;
    closeDrawer();
    var f = findTarget(pre, label);
    if (f) { toTop(f.el, f.center); }
    else if (round >= 2) {
      try { window.scrollTo(0, document.documentElement.scrollHeight || document.body.scrollHeight); } catch (e) {}
    }
    if (round < 4) setTimeout(function () { reveal(pre, label, round + 1); }, round === 0 ? 260 : 550);
    if (f && round < 2) setTimeout(function () { if (!drawerOpen()) toTop(f.el, f.center); }, 250);
  }

  var lastLabel = null;
  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('#nav button[data-m]') : null;
    if (!b) return;
    lastLabel = (b.textContent || '').trim();
    var pre = snap();
    markFired(b);
    setTimeout(function () { reveal(pre, lastLabel, 0); }, 150);
  }, true);

  /* tap keeper: iOS can cancel the click after the drawer was scrolled;
     a clean tap that produced no click is re-fired once (pointer + touch) */
  var tap = null, fired = new WeakSet();
  function markFired(b) { try { fired.add(b); setTimeout(function () { fired.delete(b); }, 700); } catch (e) {} }
  function arm(b, x, y) { tap = b ? { b: b, x: x, y: y, t: Date.now() } : null; }
  function settle(b, x, y) {
    if (!tap || tap.b !== b) return;
    var dx = Math.abs(x - tap.x), dy = Math.abs(y - tap.y), dt = Date.now() - tap.t;
    tap = null;
    if (dx > 14 || dy > 14 || dt > 800) return;
    setTimeout(function () {
      try {
        if (!fired.has(b) && b.isConnected && drawerOpen()) { fired.add(b); b.click(); }
      } catch (err) {}
    }, 430);
  }
  document.addEventListener('pointerdown', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('#nav button[data-m]') : null;
    arm(b, e.clientX, e.clientY);
  }, true);
  document.addEventListener('pointerup', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('#nav button[data-m]') : null;
    if (b) settle(b, e.clientX, e.clientY);
  }, true);
  document.addEventListener('touchstart', function (e) {
    if (tap) return;
    var t = e.touches && e.touches[0]; if (!t) return;
    var b = e.target && e.target.closest ? e.target.closest('#nav button[data-m]') : null;
    arm(b, t.clientX, t.clientY);
  }, true);
  document.addEventListener('touchend', function (e) {
    var t = e.changedTouches && e.changedTouches[0]; if (!t) return;
    var b = e.target && e.target.closest ? e.target.closest('#nav button[data-m]') : null;
    if (b) settle(b, t.clientX, t.clientY);
  }, true);
})();
