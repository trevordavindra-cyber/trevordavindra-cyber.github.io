/* ILLUMINATI upgrade #203: hl203-chatGate (v19.111)
   Extends the welcome veil: no buttons or rails show until the chat itself
   is on screen. The old veil opened as soon as the splash was tapped, so the
   side tools flashed during the entry transition; this one keys on the chat
   app actually being visible and interactive (#app opacity 1, pointer events
   on) and re-asserts in the same tick as any change, so nothing flashes.
   Everything returns the moment the chat is reached. Guard: __HL203 */
(function () {
  if (window.__HL203) return; window.__HL203 = true;

  var SELS = ['.hl134-jump','.hl139-chip','.hl140-chip','.hl143-zbtn','.hl146-chip','.hl149-chip','.hl150-chip','.hl151-chip','.hl152-rail','.hl152-thumb','.hl153-orbit','.hl155-chip','.hl156-frame','.hl158-depth','.hl158-seal','.hl159-whisper','#hl188-tab','#hl193-btn','#hl194-btn','#hl132-seal','.hl136-rail','.hl136-thumb'];

  var hidden = [];
  function hide(el) {
    if (!el || el.id === 'hl124' || el.id === 'gate') return;
    for (var i = 0; i < hidden.length; i++) {
      if (hidden[i][0] === el) {
        if (el.style.display !== 'none' || el.style.getPropertyPriority('display') !== 'important') el.style.setProperty('display', 'none', 'important');
        return;
      }
    }
    hidden.push([el, el.style.display]);
    el.style.setProperty('display', 'none', 'important');
  }
  function restoreAll() {
    for (var i = 0; i < hidden.length; i++) {
      try { hidden[i][0].style.display = hidden[i][1]; } catch (err) {}
    }
    hidden = [];
  }

  function chatUp() {
    var app = document.getElementById('app');
    if (!app) return false;
    var cs;
    try { cs = getComputedStyle(app); } catch (err) { return false; }
    return cs.opacity === '1' && cs.pointerEvents === 'auto';
  }

  var moEls = new MutationObserver(function () {
    if (gatedNow) sweep();
  });

  function sweep() {
    for (var i = 0; i < SELS.length; i++) {
      var list = document.querySelectorAll(SELS[i]);
      for (var j = 0; j < list.length; j++) {
        hide(list[j]);
        try { moEls.observe(list[j], { attributes: true, attributeFilter: ['style', 'class'] }); } catch (err) {}
      }
    }
    var kids = document.body ? document.body.children : [];
    for (var k = 0; k < kids.length; k++) {
      var e = kids[k];
      var tag = e.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'LINK' || tag === 'NOSCRIPT' || tag === 'AUDIO' || tag === 'VIDEO') continue;
      if (e.id === 'hl124' || e.id === 'gate' || e.id === 'bg' || e.id === 'ordfx' || e.id === 'ordbg' || e.id === 'ordbgvig' || e.id === 'hl18-eye' || e.id === 'hl177-scribe' || e.id === 'hl160-clock') continue;
      var cs;
      try { cs = getComputedStyle(e); } catch (err) { continue; }
      if (cs.position !== 'fixed' && cs.position !== 'absolute') continue;
      var z = parseInt(cs.zIndex, 10);
      if (isNaN(z) || z < 400) continue;
      if (cs.display === 'none') continue;
      hide(e);
      try { moEls.observe(e, { attributes: true, attributeFilter: ['style', 'class'] }); } catch (err) {}
    }
  }

  var gatedNow = false;
  function sync() {
    var up = chatUp();
    var gateOpen = !!document.getElementById('hl124');
    var gated = gateOpen || !up;
    if (gated) {
      if (!document.body.classList.contains('hl203-gated')) document.body.classList.add('hl203-gated');
      gatedNow = true;
      sweep();
    } else if (gatedNow) {
      document.body.classList.remove('hl203-gated');
      gatedNow = false;
      restoreAll();
    }
  }

  if (document.body) sync();
  setInterval(sync, 150);
  var mo = new MutationObserver(sync);
  function arm() {
    try { mo.observe(document.documentElement, { childList: true, subtree: true }); } catch (err) {}
    try { if (document.body) mo.observe(document.body, { attributes: true, attributeFilter: ['class'] }); } catch (err) {}
    try { var a = document.getElementById('app'); if (a) mo.observe(a, { attributes: true, attributeFilter: ['style', 'class'] }); } catch (err) {}
  }
  if (document.documentElement) arm(); else document.addEventListener('DOMContentLoaded', arm);
})();
