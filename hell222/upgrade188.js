/* hl188-ledger — THE LEDGER: a floating gold sigil opens a slide-in index of every exchange in the record; tap a line to jump to it. Rebuilt fresh each open, purely additive */
(function () {
  if (window.__HL188) return; window.__HL188 = 1;
  var css = [
    '#hl188-tab{position:fixed;left:12px;bottom:96px;z-index:2147482900;width:34px;height:34px;border-radius:50%;border:1px solid rgba(201,162,39,.5);background:linear-gradient(160deg,rgba(12,10,6,.94),rgba(24,18,8,.94));color:#f0d67a;font-size:14px;line-height:32px;text-align:center;box-shadow:0 4px 18px rgba(0,0,0,.55),0 0 10px rgba(201,162,39,.15);cursor:pointer;user-select:none;-webkit-user-select:none;transition:transform .18s ease,box-shadow .18s ease;}',
    '#hl188-tab:active{transform:scale(.92);}',
    '#hl188-tab:hover{box-shadow:0 4px 22px rgba(0,0,0,.6),0 0 16px rgba(201,162,39,.3);}',
    '#hl188-veil{position:fixed;inset:0;z-index:2147483000;background:rgba(4,3,1,.6);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);display:none;}',
    '#hl188-veil.on{display:block;}',
    '#hl188-drawer{position:fixed;top:0;bottom:0;left:0;width:min(320px,86vw);z-index:2147483001;background:linear-gradient(170deg,#0c0a06,#120e07 60%,#0a0804);border-right:1px solid rgba(201,162,39,.45);box-shadow:18px 0 60px rgba(0,0,0,.7);transform:translateX(-102%);transition:transform .26s cubic-bezier(.2,.8,.2,1);display:flex;flex-direction:column;}',
    '#hl188-drawer.on{transform:translateX(0);}',
    '#hl188-head{padding:18px 18px 10px;flex:0 0 auto;}',
    '#hl188-head h2{margin:0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;letter-spacing:.34em;color:#c9a227;}',
    '#hl188-head div{margin-top:4px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:9px;letter-spacing:.2em;color:rgba(240,214,122,.45);}',
    '#hl188-list{flex:1 1 auto;overflow:auto;padding:4px 10px 18px;}',
    '.hl188-item{display:block;width:100%;text-align:left;background:none;border:0;border-top:1px solid rgba(201,162,39,.14);padding:11px 8px;cursor:pointer;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;}',
    '.hl188-item:first-child{border-top:none;}',
    '.hl188-item .n{display:block;font-size:9px;letter-spacing:.22em;color:rgba(201,162,39,.75);margin-bottom:3px;}',
    '.hl188-item .t{display:block;font-size:11.5px;line-height:1.45;color:rgba(232,224,200,.85);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
    '.hl188-item:hover{background:rgba(201,162,39,.06);}',
    '#hl188-empty{padding:24px 14px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px;letter-spacing:.16em;color:rgba(240,214,122,.4);text-align:center;}'
  ].join('\n');
  function build() {
    if (document.getElementById('hl188-drawer')) return true;
    var s = document.createElement('style');
    s.id = 'hl188-style';
    s.textContent = css;
    (document.head || document.documentElement).appendChild(s);
    var veil = document.createElement('div');
    veil.id = 'hl188-veil';
    var drawer = document.createElement('div');
    drawer.id = 'hl188-drawer';
    drawer.innerHTML = '<div id="hl188-head"><h2>THE LEDGER</h2><div>THE RECORD, LINE BY LINE</div></div><div id="hl188-list"></div>';
    var tab = document.createElement('div');
    tab.id = 'hl188-tab';
    tab.title = 'Open the Ledger';
    tab.textContent = '\u2726';
    document.body.appendChild(veil);
    document.body.appendChild(drawer);
    document.body.appendChild(tab);
    tab.addEventListener('click', function (e) { e.stopPropagation(); open(); });
    veil.addEventListener('click', close);
    return true;
  }
  function render() {
    var list = document.getElementById('hl188-list');
    if (!list) return;
    list.innerHTML = '';
    var chat = document.getElementById('chat');
    var kids = chat ? Array.prototype.filter.call(chat.children, function (c) {
      return (c.textContent || '').trim().length > 0;
    }) : [];
    if (!kids.length) {
      list.innerHTML = '<div id="hl188-empty">THE RECORD IS EMPTY. SPEAK, AND IT BEGINS.</div>';
      return;
    }
    kids.forEach(function (c, i) {
      var txt = (c.textContent || '').replace(/\s+/g, ' ').trim();
      if (!txt) return;
      var b = document.createElement('button');
      b.className = 'hl188-item';
      b.type = 'button';
      b.innerHTML = '<span class="n">ENTRY ' + String(i + 1).padStart(2, '0') + '</span><span class="t"></span>';
      b.querySelector('.t').textContent = txt.slice(0, 72);
      b.addEventListener('click', function () {
        try { c.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (err) { c.scrollIntoView(); }
        close();
      });
      list.appendChild(b);
    });
  }
  function open() { var v = document.getElementById('hl188-veil'); var d = document.getElementById('hl188-drawer'); if (v && d) { render(); v.classList.add('on'); d.classList.add('on'); } }
  function close() { var v = document.getElementById('hl188-veil'); var d = document.getElementById('hl188-drawer'); if (v && d) { v.classList.remove('on'); d.classList.remove('on'); } }
  window.__HL188_IV = setInterval(function () { if (document.body && build()) clearInterval(window.__HL188_IV); }, 1800);
  setTimeout(function () { if (window.__HL188_IV) clearInterval(window.__HL188_IV); }, 120000);
})();
