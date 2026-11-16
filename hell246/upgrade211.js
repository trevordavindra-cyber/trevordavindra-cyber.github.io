/* ILLUMINATI upgrade #211: hl211-railguard (v19.118)
   THE BUTTONS STAY ON SCREEN AFTER EVERY MESSAGE. A hard guarantee on top of
   upgrades 209/210 for the code-forge context window, on every screen size:
   1) A !important stylesheet rule pins the context window and its reopen
      chip 58px short of the right edge (the rail's own column) from the
      first frame, so the geometry can never race the window opening.
   2) The window's bottom edge is recomputed live from the real position of
      the composer bar, so on tall or short phones (safe-area insets
      included) the window can never lie over the message box or its
      buttons; it only ever lifts higher, never lower than before.
   3) The rail keeper from upgrade 210 keeps standing watch alongside.
      During the entry gates the keeper stands down, so the
      buttons-hidden-until-chat behavior (upgrade 203) is untouched.
   Nothing else changes: window content, copy button, and behavior are as
   upgrade 209 built them.
   Guard: __HL211 */
(function () {
  if (window.__HL211) return; window.__HL211 = true;

  var st = document.createElement('style');
  st.id = 'hl211-style';
  st.textContent = '#hl209-win{right:58px !important}#hl209-chip{right:58px !important}';
  (document.head || document.documentElement).appendChild(st);

  function chatUp() {
    var app = document.getElementById('app');
    if (!app) return false;
    try {
      var cs = getComputedStyle(app);
      return cs.opacity === '1' && cs.pointerEvents === 'auto';
    } catch (e) { return false; }
  }
  function fit() {
    if (!chatUp()) return;
    var p = document.getElementById('hl209-win');
    if (!p) return;
    var foot = document.getElementById('foot');
    if (!foot) return;
    try {
      var r = foot.getBoundingClientRect();
      if (r && r.height > 0 && r.top > 0) {
        var need = Math.round(window.innerHeight - r.top) + 12;
        if (need > 124) p.style.setProperty('bottom', need + 'px', 'important');
      }
    } catch (e) {}
  }
  function keep() {
    if (!chatUp()) return;
    var sel = ['.hl139-chip', '.hl140-chip', '.hl146-chip', '.hl143-zbtn', '.hl149-chip', '.hl150-chip', '.hl151-chip', '.hl155-chip'];
    for (var i = 0; i < sel.length; i++) {
      var list = document.querySelectorAll(sel[i]);
      for (var j = 0; j < list.length; j++) {
        if (list[j].style.display === 'none') list[j].style.removeProperty('display');
      }
    }
  }
  function tick() { try { fit(); } catch (e) {} try { keep(); } catch (e) {} }
  if (document.body) tick();
  setInterval(tick, 500);
})();
