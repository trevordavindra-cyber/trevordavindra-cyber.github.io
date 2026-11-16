/* hl190-compass — THE COMPASS: when the record is scrolled away from its newest line, a gold compass sigil rises at the lower right; one tap glides the record back to the newest seal. Capture-phase scroll listener, hides itself at the bottom, purely additive */
(function () {
  if (window.__HL190) return; window.__HL190 = 1;
  var css = [
    '#hl190-fab{position:fixed;right:12px;bottom:96px;z-index:2147482900;width:38px;height:38px;border-radius:50%;border:1px solid rgba(201,162,39,.5);background:linear-gradient(160deg,rgba(12,10,6,.94),rgba(24,18,8,.94));color:#f0d67a;font-size:15px;line-height:36px;text-align:center;box-shadow:0 4px 18px rgba(0,0,0,.55),0 0 10px rgba(201,162,39,.15);cursor:pointer;user-select:none;-webkit-user-select:none;opacity:0;pointer-events:none;transform:translateY(8px);transition:opacity .22s ease,transform .22s ease,box-shadow .18s ease;}',
    '#hl190-fab.on{opacity:1;pointer-events:auto;transform:translateY(0);}',
    '#hl190-fab:active{transform:scale(.92);}',
    '#hl190-fab:hover{box-shadow:0 4px 22px rgba(0,0,0,.6),0 0 16px rgba(201,162,39,.3);}'
  ].join('\n');
  var scroller = null;
  function findScroller() {
    if (scroller && scroller.isConnected) return scroller;
    scroller = null;
    var n = document.getElementById('chat');
    while (n && n !== document.documentElement) {
      if (n.scrollHeight > n.clientHeight + 4) {
        var cs = getComputedStyle(n);
        if (cs.overflowY === 'auto' || cs.overflowY === 'scroll' || n === document.documentElement || n === document.body) { scroller = n; break; }
      }
      n = n.parentElement;
    }
    if (!scroller) {
      var de = document.documentElement;
      if (de.scrollHeight > de.clientHeight + 4) scroller = de;
    }
    return scroller;
  }
  function nearBottom() {
    var s = findScroller();
    if (!s) return true;
    return (s.scrollHeight - s.scrollTop - s.clientHeight) < 60;
  }
  function build() {
    if (document.getElementById('hl190-fab')) return true;
    var s = document.createElement('style');
    s.id = 'hl190-style';
    s.textContent = css;
    (document.head || document.documentElement).appendChild(s);
    var fab = document.createElement('div');
    fab.id = 'hl190-fab';
    fab.title = 'Return to the newest seal';
    fab.textContent = '\u25c6';
    document.body.appendChild(fab);
    fab.addEventListener('click', function (e) {
      e.stopPropagation();
      var sc = findScroller();
      if (!sc) return;
      try { sc.scrollTo({ top: sc.scrollHeight, behavior: 'smooth' }); } catch (err) { sc.scrollTop = sc.scrollHeight; }
      fab.classList.remove('on');
    });
    document.addEventListener('scroll', function () {
      var f = document.getElementById('hl190-fab');
      if (!f) return;
      if (nearBottom()) f.classList.remove('on'); else f.classList.add('on');
    }, true);
    return true;
  }
  window.__HL190_IV = setInterval(function () { if (document.body && build()) clearInterval(window.__HL190_IV); }, 1800);
  setTimeout(function () { if (window.__HL190_IV) clearInterval(window.__HL190_IV); }, 120000);
})();
