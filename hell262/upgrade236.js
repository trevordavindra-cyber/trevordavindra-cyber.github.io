/* ILLUMINATI upgrade #236: hl236-railban (v19.133)
   THE ASK: get rid of the round button rail on the right edge (the circled
   stack in the phone screenshot: search, download, dictate, text size,
   pins, stats, lantern, index, and the floating diamond). This hides those
   chips everywhere; the features behind them are not deleted, the shortcuts
   are. The composer, the left cartographer rail, and everything else stay.
   Guard: __HL236 */
(function () {
  if (window.__HL236) return; window.__HL236 = true;

  var css = '.hl139-chip,.hl140-chip,.hl143-zbtn,.hl143-ztag,.hl146-chip,.hl149-chip,.hl150-chip,.hl151-chip,.hl155-chip{display:none!important;visibility:hidden!important;pointer-events:none!important}';
  try {
    var st = document.createElement('style'); st.id = 'hl236-style'; st.textContent = css;
    (document.head || document.documentElement).appendChild(st);
  } catch (e) {}

  function isRightEdge(el) {
    try {
      var r = el.getBoundingClientRect();
      if (!r.width || !r.height || r.width > 70 || r.height > 70) return false;
      return (window.innerWidth - r.right) < 70 && r.top < (window.innerHeight - 40);
    } catch (e) { return false; }
  }

  function sweep() {
    try {
      var sel = '.hl139-chip,.hl140-chip,.hl143-zbtn,.hl143-ztag,.hl146-chip,.hl149-chip,.hl150-chip,.hl151-chip,.hl155-chip';
      var ls = document.querySelectorAll(sel);
      for (var i = 0; i < ls.length; i++) { try { ls[i].style.setProperty('display', 'none', 'important'); ls[i].setAttribute('data-hl236', '1'); } catch (e) {} }
      var all = document.querySelectorAll('div,button');
      for (var j = 0; j < all.length; j++) {
        var el = all[j];
        if (el.getAttribute('data-hl236') === '1') continue;
        var t = (el.textContent || '').trim();
        if (t === '\u25C6' && isRightEdge(el)) { try { el.style.setProperty('display', 'none', 'important'); el.setAttribute('data-hl236', '1'); } catch (e2) {} }
      }
    } catch (e3) {}
  }

  sweep();
  setInterval(sweep, 1500);
  try { new MutationObserver(sweep).observe(document.body, { childList: true, subtree: true }); } catch (e) {}

  console.log('[hl236] online: right-edge round button rail hidden (search/download/dictate/text size/pins/stats/lantern/index/diamond shortcuts)');
})();