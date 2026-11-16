/* hl187-grimoire — THE GRIMOIRE: press ? outside a text field to open a gold rite-scroll listing the Order's shortcuts; Esc or the veil dismisses it, typing inside the composer is never interrupted */
(function () {
  if (window.__HL187) return; window.__HL187 = 1;
  var css = [
    '#hl187-veil{position:fixed;inset:0;z-index:2147483000;background:rgba(4,3,1,.74);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);display:none;align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity .22s ease;}',
    '#hl187-veil.on{display:flex;opacity:1;}',
    '#hl187-scroll{width:100%;max-width:420px;max-height:80vh;overflow:auto;background:linear-gradient(160deg,#0c0a06,#141008 60%,#0a0804);border:1px solid rgba(201,162,39,.5);border-radius:10px;box-shadow:0 24px 80px rgba(0,0,0,.75),0 0 24px rgba(201,162,39,.12);padding:22px 22px 18px;transform:translateY(10px) scale(.985);transition:transform .22s ease;}',
    '#hl187-veil.on #hl187-scroll{transform:translateY(0) scale(1);}',
    '#hl187-title{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;letter-spacing:.34em;color:#c9a227;text-align:center;margin:0 0 4px;}',
    '#hl187-sub{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:9px;letter-spacing:.2em;color:rgba(240,214,122,.45);text-align:center;margin:0 0 16px;}',
    '.hl187-row{display:flex;align-items:center;gap:12px;padding:9px 0;border-top:1px solid rgba(201,162,39,.16);}',
    '.hl187-row:first-of-type{border-top:none;}',
    '.hl187-key{flex:0 0 auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;color:#f0d67a;border:1px solid rgba(201,162,39,.45);border-radius:5px;padding:3px 9px;min-width:34px;text-align:center;background:rgba(201,162,39,.07);}',
    '.hl187-what{font-size:12.5px;color:rgba(232,224,200,.85);line-height:1.45;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.02em;}',
    '#hl187-foot{margin-top:16px;text-align:center;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:9px;letter-spacing:.18em;color:rgba(240,214,122,.4);}'
  ].join('\n');
  function build() {
    if (document.getElementById('hl187-veil')) return true;
    var s = document.createElement('style');
    s.id = 'hl187-style';
    s.textContent = css;
    (document.head || document.documentElement).appendChild(s);
    var veil = document.createElement('div');
    veil.id = 'hl187-veil';
    veil.innerHTML =
      '<div id="hl187-scroll" role="dialog" aria-label="The Grimoire">' +
        '<h2 id="hl187-title">THE GRIMOIRE</h2>' +
        '<div id="hl187-sub">THE ORDER\'S RITES</div>' +
        '<div class="hl187-row"><span class="hl187-key">/</span><span class="hl187-what">Summon the composer from anywhere</span></div>' +
        '<div class="hl187-row"><span class="hl187-key">ESC</span><span class="hl187-what">Dismiss the composer or this scroll</span></div>' +
        '<div class="hl187-row"><span class="hl187-key">?</span><span class="hl187-what">Open this grimoire</span></div>' +
        '<div class="hl187-row"><span class="hl187-key">\u29c9</span><span class="hl187-what">Copy any reply \u2014 the seal marks it</span></div>' +
        '<div id="hl187-foot">TAP THE VEIL OR PRESS ESC TO CLOSE</div>' +
      '</div>';
    document.body.appendChild(veil);
    veil.addEventListener('click', function (e) { if (e.target === veil) close(); });
    return true;
  }
  function open() { var v = document.getElementById('hl187-veil'); if (v) v.classList.add('on'); }
  function close() { var v = document.getElementById('hl187-veil'); if (v) v.classList.remove('on'); }
  function inField(el) {
    for (var n = el; n && n !== document.body; n = n.parentElement) {
      if (n.tagName === 'TEXTAREA' || n.tagName === 'INPUT' || n.isContentEditable) return true;
    }
    return false;
  }
  function boot() {
    if (!document.body) return false;
    build();
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (inField(e.target)) return;
        e.preventDefault();
        open();
      }
    }, true);
    return true;
  }
  window.__HL187_IV = setInterval(function () { if (boot()) clearInterval(window.__HL187_IV); }, 1800);
  setTimeout(function () { if (window.__HL187_IV) clearInterval(window.__HL187_IV); }, 120000);
})();
