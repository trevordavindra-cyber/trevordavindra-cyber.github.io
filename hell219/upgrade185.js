/* hl185-lantern — THE LANTERN: a gold progress cord across the top of the record viewport that fills as you scroll deeper into the archive, with a diamond marker; hidden when the record sits at its top */
(function () {
  if (window.__HL185) return; window.__HL185 = 1;
  var css = [
    '#hl185-cord{position:fixed;top:0;left:0;right:0;height:2px;z-index:2147483000;pointer-events:none;opacity:0;transition:opacity .35s ease;background:linear-gradient(90deg,rgba(201,162,39,0) 0%,rgba(201,162,39,.28) 60%,rgba(201,162,39,.55) 100%);}',
    '#hl185-cord .hl185-fill{position:absolute;top:0;left:0;height:100%;width:0%;background:linear-gradient(90deg,#7a5c14,#c9a227 70%,#f0d67a);box-shadow:0 0 6px rgba(201,162,39,.55);}',
    '#hl185-cord .hl185-gem{position:absolute;top:50%;width:7px;height:7px;margin-left:-3.5px;transform:translateY(-50%) rotate(45deg) scale(0);background:#f0d67a;box-shadow:0 0 8px rgba(240,214,122,.8);transition:transform .15s ease;}',
    '#hl185-cord.on{opacity:1;}',
    '#hl185-cord.on .hl185-gem{transform:translateY(-50%) rotate(45deg) scale(1);}'
  ].join('\n');
  function inject() {
    var s = document.createElement('style');
    s.id = 'hl185-style';
    s.textContent = css;
    (document.head || document.documentElement).appendChild(s);
  }
  function findScroller() {
    var chat = document.getElementById('chat');
    var n = chat;
    while (n && n !== document.documentElement) {
      if (n.scrollHeight > n.clientHeight + 4) {
        var cs = getComputedStyle(n);
        if (cs.overflowY === 'auto' || cs.overflowY === 'scroll' || n === document.documentElement || n === document.body) return n;
      }
      n = n.parentElement;
    }
    return null;
  }
  function build() {
    if (document.getElementById('hl185-cord')) return true;
    inject();
    var cord = document.createElement('div');
    cord.id = 'hl185-cord';
    cord.innerHTML = '<div class="hl185-fill"></div><div class="hl185-gem"></div>';
    document.body.appendChild(cord);
    return true;
  }
  function tick() {
    var cord = document.getElementById('hl185-cord');
    if (!cord) return;
    var sc = findScroller();
    if (!sc) { cord.classList.remove('on'); return; }
    var max = sc.scrollHeight - sc.clientHeight;
    var p = max > 8 ? Math.min(1, Math.max(0, (sc.scrollTop || 0) / max)) : 0;
    cord.querySelector('.hl185-fill').style.width = (p * 100).toFixed(2) + '%';
    cord.querySelector('.hl185-gem').style.left = (p * 100).toFixed(2) + '%';
    if (p < 0.02) cord.classList.remove('on'); else cord.classList.add('on');
  }
  window.__HL185_IV = setInterval(function () {
    if (document.body && build()) {
      clearInterval(window.__HL185_IV);
      window.addEventListener('scroll', tick, true);
      window.addEventListener('resize', tick);
      setTimeout(tick, 300);
    }
  }, 1800);
  setTimeout(function () { if (window.__HL185_IV) clearInterval(window.__HL185_IV); }, 120000);
})();
