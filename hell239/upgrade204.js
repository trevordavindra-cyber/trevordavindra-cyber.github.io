/* ILLUMINATI upgrade #204: hl204-plaqueFinal (v19.112)
   Finishes the permanent delete of the reliquary plaque (.hl194-plaque).
   This one runs at parse time from the page head, before any upgrade, and
   strips the plaque's id and class the moment it appears, so no stylesheet
   rule of the reliquary can ever match it again, then keeps it display:none
   inline. The sigil and everything else keep working. Guard: __HL204 */
(function () {
  if (window.__HL204) return; window.__HL204 = true;

  var st = document.createElement('style');
  st.id = 'hl204-css';
  st.textContent = '#hl194-plaque,body .hl194-plaque{display:none!important;visibility:hidden!important;width:0!important;height:0!important;overflow:hidden!important;opacity:0!important;pointer-events:none!important}';
  document.head.appendChild(st);

  function kill() {
    var list = document.querySelectorAll('#hl194-plaque,.hl194-plaque');
    for (var i = 0; i < list.length; i++) {
      var e = list[i];
      if (e.getAttribute('data-hl204') !== '1') {
        e.setAttribute('data-hl204', '1');
        e.removeAttribute('id');
        e.className = e.className.split('hl194-plaque').join(' ').replace(/\s+/g, ' ').trim();
      }
      if (e.style.display !== 'none') e.style.setProperty('display', 'none', 'important');
    }
  }

  if (document.body) kill();
  setInterval(kill, 80);
  var mo = new MutationObserver(kill);
  function arm() {
    try { mo.observe(document.documentElement, { childList: true, subtree: true }); } catch (err) {}
  }
  if (document.documentElement) arm(); else document.addEventListener('DOMContentLoaded', arm);
})();
