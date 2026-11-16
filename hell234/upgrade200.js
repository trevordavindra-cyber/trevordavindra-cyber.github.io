/* ILLUMINATI upgrade #200: hl200-gateveil (v19.107)
   While the invitation gate (#hl124) is up, nothing else shows: side rail chips,
   bottom tools, plaques, overlays and the seal hide until the user taps YES.
   The gate itself is raised above every layer so nothing can bleed through.
   After YES everything returns untouched. Guard: __HL200 */
(function () {
  if (window.__HL200) return; window.__HL200 = true;

  var CSS = [
    '#hl124{z-index:2147483000!important;background:#050505!important}',
    'body.hl200-gated .hl134-jump,body.hl200-gated .hl139-chip,body.hl200-gated .hl140-chip,body.hl200-gated .hl143-zbtn,body.hl200-gated .hl146-chip,body.hl200-gated .hl149-chip,body.hl200-gated .hl150-chip,body.hl200-gated .hl151-chip,body.hl200-gated .hl152-rail,body.hl200-gated .hl153-orbit,body.hl200-gated .hl156-frame,body.hl200-gated .hl158-depth,body.hl200-gated .hl159-whisper,body.hl200-gated .hl194-plaque,body.hl200-gated #hl188-tab,body.hl200-gated #hl193-btn,body.hl200-gated #hl194-btn,body.hl200-gated #hl132-seal{display:none!important}'
  ].join('\n');
  var st = document.createElement('style');
  st.id = 'hl200-veil';
  st.textContent = CSS;
  document.head.appendChild(st);

  var hidden = [];
  function sweep(on) {
    var kids = document.body ? document.body.children : [];
    for (var i = 0; i < kids.length; i++) {
      var e = kids[i];
      if (!e || e.id === 'hl124' || e.id === 'hl200-veil') continue;
      var tag = e.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'LINK' || tag === 'NOSCRIPT' || tag === 'AUDIO' || tag === 'VIDEO') continue;
      if (!on) {
        for (var j = 0; j < hidden.length; j++) {
          if (hidden[j][0] === e) { e.style.display = hidden[j][1]; hidden.splice(j, 1); break; }
        }
        continue;
      }
      var cs;
      try { cs = getComputedStyle(e); } catch (err) { continue; }
      if (cs.position !== 'fixed' && cs.position !== 'absolute') continue;
      var z = parseInt(cs.zIndex, 10);
      if (isNaN(z) || z < 400) continue;
      if (cs.display === 'none') continue;
      hidden.push([e, e.style.display]);
      e.style.display = 'none';
    }
  }

  var last = null;
  function sync() {
    var gated = !!document.getElementById('hl124');
    if (gated === last) return;
    last = gated;
    if (gated) {
      document.body.classList.add('hl200-gated');
      sweep(true);
    } else {
      document.body.classList.remove('hl200-gated');
      sweep(false);
      hidden = [];
    }
  }

  if (document.body) sync();
  setInterval(sync, 250);
  var mo = new MutationObserver(sync);
  function arm() { try { mo.observe(document.documentElement, { childList: true, subtree: true }); } catch (err) {} }
  if (document.documentElement) arm(); else document.addEventListener('DOMContentLoaded', arm);
})();
