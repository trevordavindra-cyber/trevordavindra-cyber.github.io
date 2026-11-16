/* ILLUMINATI upgrade #201: hl201-noPlaque (v19.109)
   Permanently deletes the empty gold plaque that sits above the composer
   (.hl194-plaque). It never shows again in any state: not on the gates,
   not on the splash, not inside the order. A stylesheet rule plus an inline
   !important re-assert on a fast loop wins against any upgrade that tries
   to restore it. Guard: __HL201 */
(function () {
  if (window.__HL201) return; window.__HL201 = true;

  var st = document.createElement('style');
  st.id = 'hl201-noPlaque';
  st.textContent = 'body .hl194-plaque{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}';
  document.head.appendChild(st);

  function kill() {
    var list = document.querySelectorAll('.hl194-plaque');
    for (var i = 0; i < list.length; i++) {
      var e = list[i];
      if (e.style.display !== 'none' || e.style.getPropertyPriority('display') !== 'important') e.style.setProperty('display', 'none', 'important');
      if (e.style.visibility !== 'hidden') e.style.setProperty('visibility', 'hidden', 'important');
      if (e.style.opacity !== '0') e.style.setProperty('opacity', '0', 'important');
      if (e.style.pointerEvents !== 'none') e.style.setProperty('pointer-events', 'none', 'important');
    }
  }

  if (document.body) kill();
  setInterval(kill, 150);
  var mo = new MutationObserver(kill);
  function arm() {
    try { mo.observe(document.documentElement, { childList: true, subtree: true }); } catch (err) {}
    try { if (document.body) mo.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'] }); } catch (err) {}
  }
  if (document.documentElement) arm(); else document.addEventListener('DOMContentLoaded', arm);
})();
