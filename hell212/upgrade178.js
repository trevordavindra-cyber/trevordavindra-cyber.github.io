/* hl178-rubric — THE RUBRIC: the master title is set as engraved gold — molten gradient fill, deep letterpress shadow, tightened tracking */
(function () {
  if (window.__HL178) return; window.__HL178 = 1;
  var css = ".hl178-rubric{background:linear-gradient(180deg,#f6e7ac 0%,#e3c179 38%,#c39b4a 62%,#8f6f2a 100%) !important;-webkit-background-clip:text !important;background-clip:text !important;color:transparent !important;-webkit-text-fill-color:transparent !important;filter:drop-shadow(0 1px 0 rgba(0,0,0,.9)) drop-shadow(0 2px 6px rgba(0,0,0,.5)) !important;letter-spacing:6.5px !important;text-rendering:optimizeLegibility}";
  var st = document.createElement('style'); st.id = 'hl178-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var tries = 0;
  var iv = setInterval(function () {
    tries++;
    var els = document.querySelectorAll('.title');
    for (var i = 0; i < els.length; i++) {
      var t = (els[i].textContent || '').trim();
      if (/ILLUMINATI\s*AI\s*INITIATIVE/i.test(t)) {
        if (!els[i].classList.contains('hl178-rubric')) els[i].classList.add('hl178-rubric');
        clearInterval(iv); return;
      }
    }
    if (tries > 120) clearInterval(iv);
  }, 500);
})();
