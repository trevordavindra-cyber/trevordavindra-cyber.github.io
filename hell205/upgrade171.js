/* hl171-lumen — THE LUMEN: when the composer holds words, a faint gold halo breathes around it; the empty channel rests dark */
(function () {
  if (window.__HL171) return; window.__HL171 = 1;
  var css = "textarea.hl171-lit{box-shadow:0 0 26px rgba(197,164,91,.30),0 0 0 1px rgba(197,164,91,.38)!important;border-color:rgba(197,164,91,.55)!important;transition:box-shadow .6s ease,border-color .6s ease}textarea{transition:box-shadow .6s ease,border-color .6s ease}";
  var st = document.createElement('style'); st.id = 'hl171-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  function tune(ta) {
    if (!ta || ta.__hl171) return;
    ta.__hl171 = 1;
    function sync() {
      var has = (ta.value || '').trim().length > 0;
      ta.classList.toggle('hl171-lit', has);
    }
    ta.addEventListener('input', sync);
    ta.addEventListener('change', sync);
    sync();
  }
  var tries = 0; var iv = setInterval(function () {
    if (!document.body) return;
    var tas = document.querySelectorAll('textarea');
    for (var i = 0; i < tas.length; i++) tune(tas[i]);
    if (++tries > 240 && tas.length) clearInterval(iv);
  }, 900);
})();
