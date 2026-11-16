/* ILLUMINATI upgrade #202: hl202-plaqueGone (v19.110)
   Finishes the permanent delete of the empty gold plaque (.hl194-plaque).
   The plaque upgrade re-asserts its own inline styles on a loop, which beat
   a slow re-hide; this one watches the element itself and re-asserts in the
   same tick as every change, so it can never come back visible. Nothing
   else about upgrade 160 is touched. Guard: __HL202 */
(function () {
  if (window.__HL202) return; window.__HL202 = true;

  var st = document.createElement('style');
  st.id = 'hl202-plaqueGone';
  st.textContent = 'body .hl194-plaque{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;width:0!important;height:0!important;overflow:hidden!important}';
  document.head.appendChild(st);

  var seen = [];
  var mo2 = new MutationObserver(function () {
    for (var i = 0; i < seen.length; i++) assert(seen[i]);
  });

  function assert(e) {
    e.style.setProperty('display', 'none', 'important');
    e.style.setProperty('visibility', 'hidden', 'important');
    e.style.setProperty('opacity', '0', 'important');
    e.style.setProperty('pointer-events', 'none', 'important');
    e.style.setProperty('width', '0', 'important');
    e.style.setProperty('height', '0', 'important');
    e.style.setProperty('overflow', 'hidden', 'important');
  }
  function attach(e) {
    for (var i = 0; i < seen.length; i++) { if (seen[i] === e) return; }
    seen.push(e);
    assert(e);
    try { mo2.observe(e, { attributes: true, attributeFilter: ['style', 'class'] }); } catch (err) {}
  }
  function sweep() {
    var list = document.querySelectorAll('.hl194-plaque');
    for (var i = 0; i < list.length; i++) attach(list[i]);
  }

  if (document.body) sweep();
  setInterval(sweep, 100);
  var mo = new MutationObserver(sweep);
  function arm() {
    try { mo.observe(document.documentElement, { childList: true, subtree: true }); } catch (err) {}
  }
  if (document.documentElement) arm(); else document.addEventListener('DOMContentLoaded', arm);
})();
