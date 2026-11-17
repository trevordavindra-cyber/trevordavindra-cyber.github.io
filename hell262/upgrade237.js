/* ILLUMINATI upgrade #237: hl237-frameoff (v19.134)
   THE ASK: get rid of the outline. The gold double-line frame with the corner
   seals around the whole interface is the hl156 THRESHOLD frame (added at
   hell190). This hides it everywhere, hide-not-delete, so nothing else on the
   page changes. Guard: __HL237 */
(function () {
  if (window.__HL237) return; window.__HL237 = true;

  var css = '#hl156-frame,.hl156-frame{display:none!important;visibility:hidden!important;pointer-events:none!important;opacity:0!important}';
  try {
    var st = document.createElement('style'); st.id = 'hl237-style'; st.textContent = css;
    (document.head || document.documentElement).appendChild(st);
  } catch (e) {}

  function sweep() {
    try {
      var ls = document.querySelectorAll('#hl156-frame,.hl156-frame');
      for (var i = 0; i < ls.length; i++) {
        try {
          ls[i].style.setProperty('display', 'none', 'important');
          ls[i].setAttribute('data-hl237', '1');
        } catch (e) {}
      }
    } catch (e2) {}
  }

  sweep();
  setInterval(sweep, 1500);
  try { new MutationObserver(sweep).observe(document.body, { childList: true, subtree: true }); } catch (e) {}

  console.log('[hl237] online: threshold frame hidden (the gold outline around the screen)');
})();