/* ILLUMINATI upgrade #212: hl212-navfix (v19.119)
   MAKES EVERY MENU ITEM ACTUALLY OPEN ITS PANEL ON PHONES.
   What was wrong: on phones the nav drawer + its scrim could leave a menu
   tap landing on the scrim itself (the drawer closes, the module never
   opens), and when the module DID open it renders below the live feed,
   where no auto-scroll carried you, so a menu tap looked like it just
   sent you back to the chat.
   Fixes, purely additive (original handlers still run first):
   1) after any menu tap, the drawer is closed for real and the opened
      module's section is scrolled to the top of the screen (retried, so
      late-rendered panels are caught too);
   2) if a tap lands on the drawer scrim while a menu button sits at that
      spot, that button is fired instead of being swallowed;
   3) the scrim can no longer sit armed while the drawer is closed.
   Guard: __HL212 */
(function () {
  if (window.__HL212) return; window.__HL212 = true;

  function drawerOpen() { return document.body.classList.contains('ord-nav'); }
  function closeDrawer() { try { document.body.classList.remove('ord-nav'); } catch (e) {} }

  function btnFor(m) {
    try { return document.querySelector('#nav button[data-m="' + m + '"]'); } catch (e) { return null; }
  }

  function sectionFor(m, label) {
    try {
      var sel = document.querySelectorAll('#main section, #main .mod, main section, main .mod');
      var mlow = (m || '').toLowerCase(), llow = (label || '').toLowerCase();
      for (var i = 0; i < sel.length; i++) {
        var s = sel[i];
        var hid = ((s.id || '') + ' ' + (s.getAttribute('data-m') || '')).toLowerCase();
        if (hid && mlow && hid.indexOf(mlow) > -1) return s;
      }
      if (llow) {
        for (var j = 0; j < sel.length; j++) {
          var h = sel[j].querySelector('h3');
          var t = (h ? h.textContent : sel[j].textContent || '').toLowerCase();
          if (t && t.indexOf(llow) > -1) return sel[j];
        }
      }
    } catch (e) {}
    return null;
  }

  function reveal(m, label, round) {
    if (!round) round = 0;
    var b = btnFor(m);
    var sec = sectionFor(m, (b && b.textContent) || label);
    if (sec) {
      try {
        var r = sec.getBoundingClientRect();
        var below = r.top > (window.innerHeight || 800) * 0.6 || r.top < -40 || r.bottom < 80;
        if (below || round === 0) {
          sec.scrollIntoView({ behavior: round ? 'auto' : 'smooth', block: 'start' });
          try { window.scrollTo({ top: window.pageYOffset + sec.getBoundingClientRect().top - 6, behavior: 'auto' }); } catch (e2) {}
        }
      } catch (e) {}
      return;
    }
    if (round < 3) setTimeout(function () { reveal(m, label, round + 1); }, round === 0 ? 320 : 500);
  }

  /* 1) menu tap: close the drawer for real + bring the panel on screen */
  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('#nav button[data-m]') : null;
    if (!b) return;
    var m = b.getAttribute('data-m');
    var label = (b.textContent || '').trim();
    setTimeout(function () {
      if (drawerOpen()) closeDrawer();
      reveal(m, label, 0);
    }, 120);
    setTimeout(function () { if (drawerOpen()) closeDrawer(); reveal(m, label, 1); }, 650);
  }, true);

  /* 2) scrim rescue: a tap meant for a menu button but caught by the scrim
     still opens that module once the drawer has slid away */
  document.addEventListener('pointerdown', function (ev) {
    if (!drawerOpen()) return;
    var sc = document.getElementById('ordscim');
    if (!sc || ev.target !== sc) return;
    var x = ev.clientX, y = ev.clientY, hit = null;
    try {
      var bs = document.querySelectorAll('#nav button[data-m]');
      for (var i = 0; i < bs.length; i++) {
        var r = bs[i].getBoundingClientRect();
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) { hit = bs[i]; break; }
      }
    } catch (e) {}
    if (!hit) return;
    var m = hit.getAttribute('data-m'), label = (hit.textContent || '').trim();
    setTimeout(function () {
      try {
        if (!document.body.classList.contains('ord-nav')) { hit.click(); reveal(m, label, 0); }
      } catch (e) {}
    }, 380);
  }, true);

  /* 3) keep the scrim inert whenever the drawer is closed (belt + suspenders) */
  setInterval(function () {
    if (!drawerOpen()) return;
    var sc = document.getElementById('ordscim');
    if (sc && getComputedStyle(sc).pointerEvents === 'auto' && !document.getElementById('ordmenu')) closeDrawer();
  }, 800);
})();
