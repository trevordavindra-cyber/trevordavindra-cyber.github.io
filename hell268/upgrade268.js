/* ILLUMINATI upgrade #268: hl268-uisteady (v19.174)
   "Upgrade everything" batch 1 - closes two standing interface bugs:
   1. the long line of quick-action buttons (what can you do? / explain
      something interesting / /image a mountain at sunset / /help) sometimes
      vanishes right after a message is sent. The row is now watched and
      brought back the moment it disappears.
   2. the small floating buttons on the right edge keep disappearing the
      same way. They get the same treatment.
   Conservative by design: only elements that were VISIBLE at load are ever
   restored, and only when no picker/intro panel is open - it re-shows, it
   never hides, moves or removes anything. Nothing else touched.
   Guard: __HL268 */
(function () {
  if (window.__HL268) return; window.__HL268 = true;

  var watched = [];
  var CHIPS = /^(what can you do\?|explain something interesting|\/image a mountain at sunset|\/help)$/i;

  function vis(el) {
    var s = window.getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false;
    var r = el.getBoundingClientRect();
    return r.width > 2 && r.height > 2;
  }
  function collect() {
    watched.length = 0;
    var all = document.querySelectorAll('button, div, span');
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (!el.parentElement) continue;
      var txt = (el.textContent || '').trim();
      var isChip = el.tagName === 'BUTTON' && CHIPS.test(txt);
      var r = el.getBoundingClientRect();
      var rightEdge = r.left > 0 && r.right >= (window.innerWidth - 70) && r.width <= 90 && r.height <= 90 && r.width > 8 && r.height > 8;
      if (!isChip && !rightEdge) continue;
      if (!vis(el)) continue;
      watched.push({ el: el, show: el.style.cssText || '', chip: isChip });
    }
    try { console.log('[hl268] steady watch on ' + watched.length + ' buttons'); } catch (e) {}
  }

  function tick() {
    if (!watched.length) { collect(); if (!watched.length) return; }
    var modal = (document.body.textContent || '').indexOf('AI MODEL SELECTION') > -1 && document.body.textContent.indexOf('OMNI FUSION') > -1 && (function () { var f = false; var hs = document.querySelectorAll('h3'); for (var i = 0; i < hs.length; i++) { if (/AI MODEL SELECTION/i.test(hs[i].textContent || '') && hs[i].offsetParent) { f = true; break; } } return f; })();
    var intro = (document.body.textContent || '').indexOf('TAP TO ENTER') > -1;
    if (modal || intro) return;
    for (var i = 0; i < watched.length; i++) {
      var w = watched[i];
      if (!w.el.isConnected) { continue; }
      if (!vis(w.el)) {
        w.el.style.cssText = w.show;
        if (getComputedStyle(w.el).display === 'none') { w.el.style.display = ''; }
        if (!vis(w.el)) {
          var p = w.el.parentElement;
          if (p && getComputedStyle(p).display === 'none') { p.style.display = ''; }
          if (p && p.parentElement && getComputedStyle(p.parentElement).display === 'none') { p.parentElement.style.display = ''; }
        }
        if (vis(w.el)) { try { console.log('[hl268] brought back a button: ' + ((w.el.textContent || '').trim().slice(0, 24))); } catch (e2) {} }
      }
    }
  }

  var tries = 0;
  var boot = setInterval(function () {
    tries++;
    if (document.body && document.body.textContent.indexOf('TAP TO ENTER') === -1) { clearInterval(boot); collect(); setInterval(tick, 1500); }
    else if (tries > 40) clearInterval(boot);
  }, 1000);
  try { console.log('[hl268] ui-steady online: quick chips + edge buttons watched and restored'); } catch (e3) {}
})();
