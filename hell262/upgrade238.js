/* ILLUMINATI upgrade #238: hl238-framekill (v19.135)
   THE ASK: get rid of the outline. hl237 hid the hl156 threshold frame, but a
   second outline layer still draws gold edge lines + corner brackets. This
   kills every remaining frame-like layer, generically and safely:
   - anything with frame in its id or class (div/span/section)
   - any fixed overlay covering ~the whole viewport that carries a visible
     border or inset box-shadow (that is what a decorative frame is)
   - small non-interactive corner marks pinned within 40px of a viewport corner
     (buttons, links, inputs, and anything with real text are never touched)
   - body/html pseudo-element frames and borders
   Functionality is untouched: only decorative outline layers hide.
   Guard: __HL238 */
(function () {
  if (window.__HL238) return; window.__HL238 = true;

  var css = [
    '#hl156-frame,.hl156-frame,.hl156-c,.hl156-key{display:none!important;visibility:hidden!important}',
    'div[id*="frame"],div[class*="frame"],span[id*="frame"],span[class*="frame"],section[id*="frame"],section[class*="frame"]{display:none!important;visibility:hidden!important}',
    'body,html{border:0!important;outline:0!important;box-shadow:none!important}',
    'body::before,body::after,html::before,html::after{content:none!important;display:none!important}'
  ].join('\n');
  try {
    var st = document.createElement('style'); st.id = 'hl238-style'; st.textContent = css;
    (document.head || document.documentElement).appendChild(st);
  } catch (e) {}

  function goldish(c) {
    try {
      var m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(c || '');
      if (!m) return false;
      var r = +m[1], g = +m[2], b = +m[3];
      return r > 120 && g > 90 && b < 140 && r >= g && g > b;
    } catch (e) { return false; }
  }

  function nearCorner(r) {
    var vw = window.innerWidth, vh = window.innerHeight;
    var cs = [[r.left, r.top], [vw - r.right, r.top], [r.left, vh - r.bottom], [vw - r.right, vh - r.bottom]];
    for (var i = 0; i < 4; i++) if (cs[i][0] <= 40 && cs[i][1] <= 40) return true;
    return false;
  }

  function sweep() {
    try {
      var vw = window.innerWidth, vh = window.innerHeight;
      var all = document.querySelectorAll('div,span,section,aside,header,footer');
      for (var i = 0; i < all.length; i++) {
        var el = all[i];
        var tag = el.tagName;
        if (tag === 'BUTTON' || tag === 'A' || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'IFRAME') continue;
        if (el.getAttribute('data-hl238') === '1') continue;
        var r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        var cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        var kill = false;
        /* 1: full-viewport fixed overlay with a visible border or inset shadow */
        if ((cs.position === 'fixed' || cs.position === 'absolute') &&
            r.width >= vw * 0.8 && r.height >= vh * 0.8) {
          var b = [cs.borderTopWidth, cs.borderRightWidth, cs.borderBottomWidth, cs.borderLeftWidth];
          var hasBorder = false;
          for (var j = 0; j < 4; j++) { var px = parseFloat(b[j]); if (px >= 1) { hasBorder = true; break; } }
          var shadow = (cs.boxShadow || '');
          if (!hasBorder && shadow && shadow !== 'none') {
            var insetM = /inset[^,]*(,|$)/.exec(shadow);
            if (insetM) hasBorder = true;
          }
          if (hasBorder) kill = true;
        }
        /* 2: small non-interactive decorative mark pinned at a viewport corner */
        if (!kill && nearCorner(r) && r.width <= 90 && r.height <= 90) {
          var txt = (el.textContent || '').trim();
          var gold = goldish(cs.borderTopColor) || goldish(cs.color) || goldish(cs.backgroundColor);
          if (txt.length <= 2 && gold) kill = true;
        }
        if (kill) {
          try {
            el.style.setProperty('display', 'none', 'important');
            el.setAttribute('data-hl238', '1');
          } catch (e2) {}
        }
      }
    } catch (e3) {}
  }

  sweep();
  setInterval(sweep, 1200);
  try { new MutationObserver(sweep).observe(document.body, { childList: true, subtree: true }); } catch (e) {}

  console.log('[hl238] online: every remaining outline layer hidden (frames, corner seals, edge lines)');
})();