/* hl186-seal — THE SEAL: copying anything from the record stamps a one-time gold seal toast ("SEALED · COPIED"), debounced so a burst of copies shows one seal */
(function () {
  if (window.__HL186) return; window.__HL186 = 1;
  var css = [
    '#hl186-seal{position:fixed;left:50%;bottom:96px;transform:translateX(-50%) translateY(8px);z-index:2147483000;pointer-events:none;opacity:0;transition:opacity .25s ease,transform .25s ease;background:linear-gradient(135deg,rgba(12,10,6,.96),rgba(24,18,8,.96));border:1px solid rgba(201,162,39,.55);border-radius:999px;padding:9px 18px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;letter-spacing:.14em;color:#f0d67a;box-shadow:0 6px 24px rgba(0,0,0,.6),0 0 12px rgba(201,162,39,.18);white-space:nowrap;}',
    '#hl186-seal.on{opacity:1;transform:translateX(-50%) translateY(0);}'
  ].join('\n');
  function build() {
    if (document.getElementById('hl186-seal')) return true;
    var s = document.createElement('style');
    s.id = 'hl186-style';
    s.textContent = css;
    (document.head || document.documentElement).appendChild(s);
    var d = document.createElement('div');
    d.id = 'hl186-seal';
    d.textContent = '\u2726 SEALED \u00b7 COPIED';
    document.body.appendChild(d);
    return true;
  }
  var last = 0, hideTmr = null;
  function stamp() {
    var now = Date.now();
    if (now - last < 1500) return;
    last = now;
    var d = document.getElementById('hl186-seal');
    if (!d) return;
    d.classList.add('on');
    if (hideTmr) clearTimeout(hideTmr);
    hideTmr = setTimeout(function () { d.classList.remove('on'); }, 1900);
  }
  function boot() {
    if (!document.body) return false;
    build();
    document.addEventListener('copy', function (e) {
      var t = '';
      try { t = (e.clipboardData && e.clipboardData.getData('text/plain')) || (window.getSelection ? String(window.getSelection()) : ''); } catch (err) { t = ''; }
      if (t && t.trim()) stamp();
    }, true);
    return true;
  }
  window.__HL186_IV = setInterval(function () { if (boot()) clearInterval(window.__HL186_IV); }, 1800);
  setTimeout(function () { if (window.__HL186_IV) clearInterval(window.__HL186_IV); }, 120000);
})();
