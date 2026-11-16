/* hl176-marginalia — THE MARGINALIA: fine engraved corner brackets frame the chamber like a sealed document */
(function () {
  if (window.__HL176) return; window.__HL176 = 1;
  var css = ".hl176-br{position:fixed;width:34px;height:34px;z-index:9200;pointer-events:none;opacity:.55;transition:opacity .8s ease}.hl176-br::before,.hl176-br::after{content:'';position:absolute;background:linear-gradient(90deg,rgba(216,180,90,.9),rgba(216,180,90,.25))}.hl176-br::before{width:100%;height:1px}.hl176-br::after{width:1px;height:100%;background:linear-gradient(180deg,rgba(216,180,90,.9),rgba(216,180,90,.25))}.hl176-tl{top:8px;left:8px}.hl176-tl::before{top:0;left:0}.hl176-tl::after{top:0;left:0}.hl176-tr{top:8px;right:8px}.hl176-tr::before{top:0;right:0;background:linear-gradient(270deg,rgba(216,180,90,.9),rgba(216,180,90,.25))}.hl176-tr::after{top:0;right:0}.hl176-bl{bottom:8px;left:8px}.hl176-bl::before{bottom:0;left:0}.hl176-bl::after{bottom:0;left:0}.hl176-br2{bottom:8px;right:8px}.hl176-br2::before{bottom:0;right:0;background:linear-gradient(270deg,rgba(216,180,90,.9),rgba(216,180,90,.25))}.hl176-br2::after{bottom:0;right:0}@media (max-width:640px){.hl176-bl,.hl176-br2{display:none}.hl176-tl,.hl176-tr{width:26px;height:26px;opacity:.4}}";
  var st = document.createElement('style'); st.id = 'hl176-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var classes = ['hl176-tl', 'hl176-tr', 'hl176-bl', 'hl176-br2'];
  function place() {
    if (!document.body || document.getElementById('hl176-frame')) return;
    var wrap = document.createElement('div'); wrap.id = 'hl176-frame';
    for (var i = 0; i < classes.length; i++) {
      var c = document.createElement('div'); c.className = 'hl176-br ' + classes[i];
      wrap.appendChild(c);
    }
    document.body.appendChild(wrap);
  }
  var iv = setInterval(function () { if (document.body) { place(); clearInterval(iv); } }, 600);
})();
