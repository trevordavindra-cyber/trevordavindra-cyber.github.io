/* ILLUMINATI upgrade #237: hl237-frameoff (v19.134)
   THE ASK: get rid of the gold outline around the screen. That is hl156's
   "threshold" frame: the double gold lines, the corner seals (the four star
   badges) and the top key diamond. This hides the whole frame, not deletes
   it; everything else stays untouched. Guard: __HL237 */
(function () {
  if (window.__HL237) return; window.__HL237 = true;
  var css = '#hl156-frame,.hl156-frame{display:none!important;visibility:hidden!important;pointer-events:none!important}';
  try {
    var st = document.createElement('style'); st.id = 'hl237-style'; st.textContent = css;
    (document.head || document.documentElement).appendChild(st);
  } catch (e) {}
  function sweep() {
    try {
      var f = document.getElementById('hl156-frame');
      if (f) f.style.setProperty('display', 'none', 'important');
      var ls = document.querySelectorAll('.hl156-frame');
      for (var i = 0; i < ls.length; i++) { try { ls[i].style.setProperty('display', 'none', 'important'); } catch (e) {} }
    } catch (e2) {}
  }
  sweep();
  setInterval(sweep, 1500);
  try { new MutationObserver(sweep).observe(document.body, { childList: true, subtree: true }); } catch (e3) {}
  console.log('[hl237] online: threshold frame hidden (the gold outline around the screen)');
})();