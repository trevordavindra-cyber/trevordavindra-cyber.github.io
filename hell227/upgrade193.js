/* hl193-lumen — THE LUMEN: a reading rite. A small gold ◈ sigil beside the ledger tab (and the L key outside any field) kindles comfortable reading: the whole record scales up with slightly relaxed line-height, persisted across visits, dimmed the same way. A gold pill announces kindle/dim, and the grimoire's rite-scroll gains an L row. Purely additive; nothing existing changes. */
(function () {
  if (window.__HL193) return; window.__HL193 = 1;
  var css = [
    '#hl193-btn{position:fixed;left:54px;bottom:96px;z-index:2147482900;width:34px;height:34px;border-radius:50%;border:1px solid rgba(201,162,39,.5);background:linear-gradient(160deg,rgba(12,10,6,.94),rgba(24,18,8,.94));color:#f0d67a;font-size:13px;line-height:32px;text-align:center;box-shadow:0 4px 18px rgba(0,0,0,.55),0 0 10px rgba(201,162,39,.15);cursor:pointer;user-select:none;-webkit-user-select:none;transition:transform .18s ease,box-shadow .18s ease;}',
    '#hl193-btn:active{transform:scale(.94);}',
    '#hl193-btn.on{border-color:rgba(240,214,122,.95);box-shadow:0 4px 22px rgba(0,0,0,.6),0 0 16px rgba(240,214,122,.4);color:#fff3c4;}',
    'body.hl193-on #chat{zoom:1.14;}',
    'body.hl193-on #chat{line-height:1.62 !important;}',
    '@media (max-width:820px){body.hl193-on #chat{zoom:1.18;}}',
    '#hl193-toast{position:fixed;left:50%;bottom:64px;transform:translateX(-50%) translateY(8px);background:#0d0b07;border:1px solid rgba(216,180,90,.6);color:#d8b45a;font:10px/1.4 "Courier New",monospace;letter-spacing:.12em;padding:9px 16px;border-radius:2px;z-index:9400;opacity:0;pointer-events:none;transition:opacity .3s ease,transform .3s ease;text-transform:uppercase;white-space:nowrap;box-shadow:0 4px 18px rgba(0,0,0,.6);}',
    '#hl193-toast.on{opacity:1;transform:translateX(-50%) translateY(0);}'
  ].join('\n');
  var btn = null, toast = null, toastT = null;
  function apply(on, silent) {
    document.body.classList.toggle('hl193-on', on);
    try { localStorage.setItem('hl193-lumen', on ? '1' : '0'); } catch (e) {}
    if (btn) {
      btn.classList.toggle('on', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.title = on ? 'THE LUMEN: dim the reading rite' : 'THE LUMEN: kindle the reading rite';
    }
    if (!silent && toast) {
      toast.textContent = on ? '\u2726 LUMEN \u00b7 KINDLED' : '\u2726 LUMEN \u00b7 DIMMED';
      toast.classList.add('on');
      clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove('on'); }, 2400);
    }
  }
  function toggle() { apply(!document.body.classList.contains('hl193-on')); }
  function addGrimoireRow() {
    var rows = document.querySelectorAll('.hl187-row');
    if (!rows.length) return false;
    var last = rows[rows.length - 1];
    if (last.parentElement.querySelector('.hl193-row')) return true;
    var div = document.createElement('div');
    div.className = 'hl187-row hl193-row';
    div.innerHTML = '<span class="hl187-key">L</span><span class="hl187-what">Kindle the lumen: the reading rite</span>';
    last.insertAdjacentElement('afterend', div);
    return true;
  }
  function build() {
    if (btn) return true;
    if (!document.getElementById('chat')) return false;
    var s = document.createElement('style'); s.id = 'hl193-style'; s.textContent = css;
    (document.head || document.documentElement).appendChild(s);
    btn = document.createElement('button');
    btn.id = 'hl193-btn'; btn.type = 'button'; btn.textContent = '\u25c8';
    btn.setAttribute('aria-pressed', 'false');
    btn.title = 'THE LUMEN: kindle the reading rite';
    document.body.appendChild(btn);
    toast = document.createElement('div'); toast.id = 'hl193-toast';
    document.body.appendChild(toast);
    btn.addEventListener('click', toggle);
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'l' && e.key !== 'L') return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      var a = document.activeElement;
      if (a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.isContentEditable)) return;
      toggle();
    });
    if (localStorage.getItem('hl193-lumen') === '1') apply(true, true);
    return true;
  }
  var rowTries = 0;
  var rowIV = setInterval(function () { if (addGrimoireRow() || ++rowTries > 40) clearInterval(rowIV); }, 1000);
  window.__HL193_IV = setInterval(function () { if (build()) clearInterval(window.__HL193_IV); }, 1800);
  setTimeout(function () { if (window.__HL193_IV) clearInterval(window.__HL193_IV); }, 120000);
})();
