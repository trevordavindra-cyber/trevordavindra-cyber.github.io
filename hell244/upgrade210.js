/* ILLUMINATI upgrade #210: hl210-railKeep (v19.117)
   KEEPS THE BUTTON RAIL ON SCREEN WHILE THE CHAT IS UP. Two fixes:
   1) The code forge's context window (upgrade 209) opened full-width and
      laid itself across the right-hand rail, so the moment a reply started
      streaming code the whole column of buttons vanished under it. The
      window now stops 58px short of the right edge — the rail's own
      column — and the reopen chip moves over with it. Nothing about the
      window's content or behavior changes.
   2) A keeper loop re-asserts the eight rail buttons whenever the chat is
      up: if anything sets one to display:none it is cleared in the same
      pass, so no later upgrade can ever swallow the rail mid-conversation.
      During the entry gates the keeper stands down, so the
      buttons-hidden-until-chat behavior (upgrade 203) is untouched.
   Guard: __HL210 */
(function () {
  if (window.__HL210) return; window.__HL210 = true;

  var RAIL = ['.hl139-chip', '.hl140-chip', '.hl146-chip', '.hl143-zbtn', '.hl149-chip', '.hl150-chip', '.hl151-chip', '.hl155-chip'];
  var R = '58px';

  /* ---------- 1) context window geometry ---------- */
  function shape() {
    var p = document.getElementById('hl209-win');
    if (p && p.style.right !== R) p.style.setProperty('right', R, 'important');
    var c = document.getElementById('hl209-chip');
    if (c && c.style.right !== R) c.style.setProperty('right', R, 'important');
  }
  if (document.body) shape();
  setInterval(shape, 300);

  /* ---------- 2) rail keeper ---------- */
  function chatUp() {
    var app = document.getElementById('app');
    if (!app) return false;
    var cs;
    try { cs = getComputedStyle(app); } catch (e) { return false; }
    return cs.opacity === '1' && cs.pointerEvents === 'auto';
  }
  function keep() {
    if (!chatUp()) return;
    for (var i = 0; i < RAIL.length; i++) {
      var list = document.querySelectorAll(RAIL[i]);
      for (var j = 0; j < list.length; j++) {
        var e = list[j];
        if (e.style.display === 'none') e.style.removeProperty('display');
      }
    }
  }
  if (document.body) keep();
  setInterval(keep, 500);
})();
