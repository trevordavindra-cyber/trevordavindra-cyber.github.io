/* ILLUMINATI upgrade #198: hl198-hintfix — the gold "PRESS / TO SPEAK" box
   is the hl181 desktop keyboard hint; on touch devices it has no meaning and
   floats over the chat. On phones/tablets it is removed and blocked; on
   desktop (physical keyboard) it keeps working exactly as before. */
(function () {
  if (window.__HL198) return; window.__HL198 = 1;
  try {
    var st = document.createElement('style'); st.id = 'hl198-style';
    st.textContent = '@media (pointer:coarse),(hover:none){#hl181-hint{display:none!important;opacity:0!important;visibility:hidden!important}}';
    (document.head || document.documentElement).appendChild(st);
  } catch (e) { }
  var touch = false;
  try {
    touch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) ||
      window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(hover: none)').matches;
  } catch (e) { }
  if (!touch) return;
  function purge() {
    try {
      var h = document.getElementById('hl181-hint');
      if (h && h.parentNode) h.parentNode.removeChild(h);
    } catch (e) { }
  }
  purge();
  var mo = new MutationObserver(purge);
  var armed = false;
  function arm() {
    if (document.body && !armed) { armed = true; mo.observe(document.body, { childList: true }); purge(); }
    return armed;
  }
  if (!arm()) {
    var iv = setInterval(function () { if (arm()) clearInterval(iv); }, 700);
    setTimeout(function () { clearInterval(iv); }, 120000);
  }
})();
