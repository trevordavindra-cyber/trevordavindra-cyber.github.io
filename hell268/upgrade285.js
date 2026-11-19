/* ILLUMINATI upgrade #285: hl285-opener-reach (v19.191)
   EVERY TAB WITHIN REACH. The tab opener's list is taller than a phone
   screen, and swiping it can still refuse on some phones, so the lower
   entries sat out of reach. This upgrade makes reach certain two ways:
   1. On phones the drawer list compacts (tighter rows, smaller labels) so
      every entry fits on screen without any scrolling at all.
   2. Two small gold arrows ride the drawer's edge while it is open: tap up
      or down and the list glides a page in that direction. They are plain
      floating buttons, the same kind that already answer taps reliably on
      phones, so they work even where swipes do not.
   Nothing is removed: the list, its entries, swiping when it works, and
   every original handler still run. Guard: __HL285 */
(function () {
  if (window.__HL285) return; window.__HL285 = 1;

  /* ---------- CSS: compact list + edge arrows ---------- */
  try {
    var stl = document.createElement('style');
    stl.id = 'hl285-style';
    stl.textContent = [
      '@media (max-width:820px){',
      ' body.ord-nav #nav button{padding-top:5px!important;padding-bottom:5px!important;font-size:9.5px!important;letter-spacing:.12em!important}',
      ' body.ord-nav #nav{gap:1px!important;padding-top:calc(10px + env(safe-area-inset-top))!important;padding-bottom:calc(118px + env(safe-area-inset-bottom))!important}',
      ' body.ord-nav #nav .ordg{margin:7px 10px 3px!important;font-size:7.5px!important;letter-spacing:.3em!important}',
      '}',
      '#hl285-up,#hl285-dn{position:fixed;left:min(248px,calc(84vw - 36px));width:34px;height:34px;border-radius:50%;background:linear-gradient(160deg,rgba(12,10,6,.96),rgba(24,18,8,.96));border:1px solid rgba(201,162,39,.55);color:#f0d67a;font-size:13px;line-height:32px;text-align:center;z-index:2147482000;display:none;box-shadow:0 4px 18px rgba(0,0,0,.6);cursor:pointer;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent}',
      'body.ord-nav #hl285-up,body.ord-nav #hl285-dn{display:block}',
      '#hl285-up{bottom:calc(158px + env(safe-area-inset-bottom))}',
      '#hl285-dn{bottom:calc(112px + env(safe-area-inset-bottom))}',
      '#hl285-up:active,#hl285-dn:active{transform:scale(.92)}'
    ].join('\n');
    (document.head || document.documentElement).appendChild(stl);
  } catch (e) {}

  function navEl() { return document.getElementById('nav'); }
  function maxTop(n) { return Math.max(0, n.scrollHeight - n.clientHeight); }
  var raf = 0;

  function glide(n, dir) {
    cancelAnimationFrame(raf);
    var step = Math.max(180, n.clientHeight * 0.8) * dir;
    var start = n.scrollTop;
    var target = Math.max(0, Math.min(maxTop(n), start + step));
    var t0 = Date.now();
    (function go() {
      var k = Math.min(1, (Date.now() - t0) / 280);
      var e = 1 - Math.pow(1 - k, 3);
      n.scrollTop = start + (target - start) * e;
      if (k < 1) raf = requestAnimationFrame(go);
    })();
  }

  function makeBtn(id, label, dir) {
    if (document.getElementById(id)) return;
    var b = document.createElement('div');
    b.id = id; b.textContent = label;
    b.setAttribute('role', 'button');
    b.setAttribute('aria-label', dir < 0 ? 'scroll the tab list up' : 'scroll the tab list down');
    var done = false;
    function fire(e) {
      if (done) return; done = true;
      setTimeout(function () { done = false; }, 700);
      var n = navEl(); if (!n) return;
      glide(n, dir);
      try { e.preventDefault(); } catch (er) {}
      try { e.stopPropagation(); } catch (er) {}
    }
    b.addEventListener('touchend', fire, { passive: false });
    b.addEventListener('click', function (e) { if (!e.__hl285skip) fire(e); });
    document.body.appendChild(b);
  }

  var tries = 0;
  (function hunt() {
    if (!document.getElementById('hl285-up') && document.body) {
      makeBtn('hl285-up', '\u25B2', -1);
      makeBtn('hl285-dn', '\u25BC', 1);
    }
    if (tries++ < 40) setTimeout(hunt, 250);
  })();
})();
