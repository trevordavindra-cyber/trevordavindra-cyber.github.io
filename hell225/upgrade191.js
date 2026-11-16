/* hl191-vigil — THE VIGIL: while the oracle is composing (the record's newest line is growing), a gold breathing sigil "THE ORACLE SPEAKS" glows above the composer; it settles 1.4s after the words stop. Watches the last record child's text growth, never the page's own chrome; purely additive */
(function () {
  if (window.__HL191) return; window.__HL191 = 1;
  var css = [
    '#hl191-vigil{position:fixed;left:50%;bottom:150px;transform:translateX(-50%) translateY(6px);z-index:2147482800;display:flex;align-items:center;gap:8px;padding:7px 14px;border-radius:999px;border:1px solid rgba(201,162,39,.45);background:linear-gradient(160deg,rgba(12,10,6,.92),rgba(24,18,8,.92));box-shadow:0 4px 20px rgba(0,0,0,.5),0 0 12px rgba(201,162,39,.12);opacity:0;pointer-events:none;transition:opacity .25s ease,transform .25s ease;}',
    '#hl191-vigil.on{opacity:1;transform:translateX(-50%) translateY(0);}',
    '#hl191-gem{width:9px;height:9px;background:#c9a227;transform:rotate(45deg);box-shadow:0 0 10px rgba(201,162,39,.8);animation:hl191-breathe 1.15s ease-in-out infinite;}',
    '@keyframes hl191-breathe{0%,100%{transform:rotate(45deg) scale(.75);opacity:.55;}50%{transform:rotate(45deg) scale(1.15);opacity:1;}}',
    '#hl191-word{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:9.5px;letter-spacing:.3em;color:#f0d67a;white-space:nowrap;}',
    '@media (prefers-reduced-motion: reduce){#hl191-gem{animation:none;}}'
  ].join('\n');
  var lastLen = 0, lastEl = null, timer = null;
  function build() {
    if (document.getElementById('hl191-vigil')) return true;
    if (!document.getElementById('chat')) return false;
    var s = document.createElement('style');
    s.id = 'hl191-style';
    s.textContent = css;
    (document.head || document.documentElement).appendChild(s);
    var v = document.createElement('div');
    v.id = 'hl191-vigil';
    v.innerHTML = '<span id="hl191-gem"></span><span id="hl191-word">THE ORACLE SPEAKS</span>';
    document.body.appendChild(v);
    return true;
  }
  function show() {
    var v = document.getElementById('hl191-vigil');
    if (v) v.classList.add('on');
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      var v2 = document.getElementById('hl191-vigil');
      if (v2) v2.classList.remove('on');
    }, 1400);
  }
  function watch() {
    var chat = document.getElementById('chat');
    if (!chat) return;
    var kids = chat.children;
    var el = kids.length ? kids[kids.length - 1] : null;
    if (!el) { lastLen = 0; lastEl = null; return; }
    var len = (el.textContent || '').length;
    if (el !== lastEl) { lastEl = el; lastLen = len; return; }
    if (len > lastLen + 3) { lastLen = len; show(); }
    else if (len < lastLen) { lastLen = len; }
  }
  function boot() {
    if (!document.body || !build()) return false;
    var mo = new MutationObserver(function () { watch(); });
    mo.observe(document.getElementById('chat'), { childList: true, characterData: true, subtree: true });
    return true;
  }
  window.__HL191_IV = setInterval(function () { if (boot()) clearInterval(window.__HL191_IV); }, 1800);
  setTimeout(function () { if (window.__HL191_IV) clearInterval(window.__HL191_IV); }, 120000);
})();
