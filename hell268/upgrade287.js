/* ILLUMINATI upgrade #287: hl287-opener-fit (v19.193)
   EVERY TAB ON ONE SCREEN. The inner-pane experiment is unwrapped: the tab
   list returns to its original home in the drawer with its original
   background and styles, and on phones the list is laid out in a tight
   two-column grid sized so every entry (command tabs, all modules and the
   collapse row) fits on one screen with nothing that needs scrolling. The
   tap arrows and the drag engine stay as backup for any tiny remainder
   past the fold, and the small live readout stays at the drawer's bottom
   edge. Nothing is removed. Guard: __HL287 */
(function () {
  if (window.__HL287) return; window.__HL287 = 1;

  /* ---------- CSS ---------- */
  try {
    var stl = document.createElement('style');
    stl.id = 'hl287-style';
    stl.textContent = [
      '#hl287-mods{display:contents}',
      '@media (max-width:820px){',
      ' body.ord-nav #nav{overflow-y:auto!important;overflow-x:hidden!important;touch-action:pan-y!important;overscroll-behavior:contain!important;padding:0!important;padding-top:calc(12px + env(safe-area-inset-top))!important;padding-bottom:calc(112px + env(safe-area-inset-bottom))!important}',
      ' body.ord-nav #nav button{padding-top:4px!important;padding-bottom:4px!important;font-size:8.5px!important;letter-spacing:.1em!important;min-height:0!important;line-height:1.35!important}',
      ' body.ord-nav #nav .ordg{margin:6px 10px 2px!important;font-size:7px!important;letter-spacing:.3em!important}',
      ' #hl287-mods{display:grid;grid-template-columns:1fr 1fr;gap:2px}',
      ' body.ord-nav #hl286-dbgi{display:block!important}',
      '}'
    ].join('\n');
    (document.head || document.documentElement).appendChild(stl);
  } catch (e) {}

  function navEl() { return document.getElementById('nav'); }

  /* ---------- unwrap hl286's pane ---------- */
  function unwrapPane() {
    var n = navEl(); if (!n) return false;
    var p = document.getElementById('hl286-pane');
    if (!p) return true;
    var kids = Array.prototype.slice.call(p.childNodes);
    for (var i = 0; i < kids.length; i++) n.insertBefore(kids[i], p);
    p.parentNode.removeChild(p);
    return true;
  }

  /* ---------- wrap the module tabs in a two-column grid ---------- */
  function wrapMods() {
    var n = navEl(); if (!n) return;
    if (document.getElementById('hl287-mods')) return;
    var labels = n.querySelectorAll(':scope > div');
    var modsLabel = null;
    for (var i = 0; i < labels.length; i++) {
      if ((labels[i].textContent || '').trim().toUpperCase() === 'MODULES') { modsLabel = labels[i]; break; }
    }
    if (!modsLabel) return;
    var w = document.createElement('div');
    w.id = 'hl287-mods';
    var sib = modsLabel.nextSibling, moved = 0;
    while (sib) {
      var next = sib.nextSibling;
      if (sib.nodeType === 1 && sib.tagName === 'DIV') {
        var t = (sib.textContent || '').trim().toUpperCase();
        if (t === 'TELEMETRY' || t === 'COMMAND') break;
      }
      if (sib.nodeType === 1 && sib.tagName === 'BUTTON') { w.appendChild(sib); moved++; }
      sib = next;
    }
    if (moved) modsLabel.parentNode.insertBefore(w, modsLabel.nextSibling);
  }

  /* ---------- live readout (repoints at the drawer itself) ---------- */
  var touchCount = 0;
  try {
    document.addEventListener('touchmove', function () { touchCount++; }, { capture: true, passive: true });
  } catch (e) {}
  function dbg() {
    var d = document.getElementById('hl286-dbgi'); if (!d) return;
    var n = navEl(); if (!n) { d.textContent = 'NAV WAITING'; return; }
    d.textContent = 'NAV ' + n.scrollHeight + '/' + n.clientHeight + ' top' + Math.round(n.scrollTop) +
      ' tch' + touchCount + ' arr' + (document.getElementById('hl285-up') ? 2 : 0) + ' mods' +
      (document.getElementById('hl287-mods') ? document.getElementById('hl287-mods').children.length : 0);
  }

  var tries = 0;
  (function hunt() {
    unwrapPane();
    wrapMods();
    dbg();
    if (tries++ < 60) setTimeout(hunt, 250);
  })();
  setInterval(dbg, 400);
})();
