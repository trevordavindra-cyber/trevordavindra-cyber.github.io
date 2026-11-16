/* ILLUMINATI upgrade #200: hl200-gateveil (v19.107)
   While the invitation gate (#hl124) is up, nothing else shows: side rail chips,
   bottom tools, plaques, overlays and the seal hide until the user taps YES.
   Enforced every 250ms with inline !important, re-asserted against scripts that
   clear it; the gate itself is raised above every layer. After YES everything
   returns untouched. Guard: __HL200 */
(function () {
  if (window.__HL200) return; window.__HL200 = true;

  var CSS = [
    '#hl124{z-index:2147483000!important;background:#050505!important}'
  ].join('\n');
  var st = document.createElement('style');
  st.id = 'hl200-veil';
  st.textContent = CSS;
  document.head.appendChild(st);

  var SELS = ['.hl134-jump','.hl139-chip','.hl140-chip','.hl143-zbtn','.hl146-chip','.hl149-chip','.hl150-chip','.hl151-chip','.hl152-rail','.hl153-orbit','.hl156-frame','.hl158-depth','.hl159-whisper','.hl194-plaque','#hl188-tab','#hl193-btn','#hl194-btn','#hl132-seal'];

  var hidden = [];
  function hide(el) {
    if (!el || el.id === 'hl124' || el.id === 'hl200-veil') return;
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
  function enforce(on) {
    if (!on) { restoreAll(); return; }
    for (var i = 0; i < SELS.length; i++) {
      var list = document.querySelectorAll(SELS[i]);
      for (var j = 0; j < list.length; j++) hide(list[j]);
    }
    var kids = document.body ? document.body.children : [];
    for (var k = 0; k < kids.length; k++) {
      var e = kids[k];
      var tag = e.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'LINK' || tag === 'NOSCRIPT' || tag === 'AUDIO' || tag === 'VIDEO') continue;
      var cs;
      try { cs = getComputedStyle(e); } catch (err) { continue; }
      if (cs.position !== 'fixed' && cs.position !== 'absolute') continue;
      var z = parseInt(cs.zIndex, 10);
      if (isNaN(z) || z < 400) continue;
      if (cs.display === 'none') continue;
      hide(e);
    }
  }

  var last = null;
  function sync() {
    var gated = !!document.getElementById('hl124');
    if (gated) {
      if (!document.body.classList.contains('hl200-gated')) document.body.classList.add('hl200-gated');
      enforce(true);
    } else if (last) {
      document.body.classList.remove('hl200-gated');
      enforce(false);
    }
    last = gated;
  }

  if (document.body) sync();
  setInterval(sync, 250);
  var mo = new MutationObserver(sync);
  function arm() { try { mo.observe(document.documentElement, { childList: true, subtree: true }); } catch (err) {} }
  if (document.documentElement) arm(); else document.addEventListener('DOMContentLoaded', arm);
})();
