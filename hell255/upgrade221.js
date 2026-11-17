/* ILLUMINATI upgrade #221: hl221-codewrap (v19.128)
   THE CODE CASEMENT. Fenced code inside chat entries now renders as true code
   blocks: language label, per-block COPY, no soft wrap (scrolls sideways), and
   the full original text kept on the entry so nothing is ever lost. Entries
   still streaming are left alone until their fences close. Guard: __HL221 */
(function () {
  if (window.__HL221) return; window.__HL221 = true;

  var CSS = [
    '.hlblock{margin:8px 0 6px;border:1px solid rgba(212,175,55,.35);border-radius:6px;background:rgba(10,9,6,.85);overflow:hidden}',
    '.hlhead{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 8px;background:rgba(212,175,55,.08);border-bottom:1px solid rgba(212,175,55,.2)}',
    '.hllang{font-size:10px;letter-spacing:.14em;color:#d4af37;text-transform:uppercase;font-family:monospace;white-space:nowrap}',
    '.hlhead .hlbtn{margin-left:6px}',
    '.hlbtn{font-size:10px;letter-spacing:.1em;color:#d4af37;background:none;border:1px solid rgba(212,175,55,.45);border-radius:3px;padding:2px 7px;cursor:pointer;font-family:monospace;flex:0 0 auto}',
    '.hlbtn:hover{background:rgba(212,175,55,.15)}',
    '.hlpre{margin:0;padding:10px 12px;overflow-x:auto;white-space:pre;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;line-height:1.5;color:#e8d9a0;tab-size:4}',
    '.hlprose{white-space:pre-wrap}'
  ].join('\n');
  var st = document.createElement('style'); st.id = 'hl221-css'; st.textContent = CSS;
  (document.head || document.documentElement).appendChild(st);

  function langName(x) { return (x || '').toLowerCase().split(/[^a-z0-9+#]/)[0] || 'code'; }
  function ext(x) {
    var m = { python:'py',py:'py',javascript:'js',js:'js',html:'html',css:'css',json:'json',bash:'sh',shell:'sh',sh:'sh',java:'java',c:'c',cpp:'cpp',cs:'cs',go:'go',rust:'rs',ruby:'rb',php:'php',sql:'sql',typescript:'ts',ts:'ts',yaml:'yml',markdown:'md',xml:'xml' };
    return m[langName(x)] || 'txt';
  }
  window.hl221ext = ext;

  function copyText(t) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(t); return; }
      var ta = document.createElement('textarea'); ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    } catch (e) {}
  }
  window.hl221copy = copyText;

  function makeBlock(lang, code) {
    var blk = document.createElement('div'); blk.className = 'hlblock'; blk.dataset.hllang = lang;
    var hd = document.createElement('div'); hd.className = 'hlhead';
    var lab = document.createElement('span'); lab.className = 'hllang'; lab.textContent = lang;
    hd.appendChild(lab);
    var b = document.createElement('button'); b.type = 'button'; b.className = 'hlbtn'; b.textContent = 'COPY';
    b.addEventListener('click', function (ev) {
      ev.preventDefault(); ev.stopPropagation(); copyText(code);
      b.textContent = 'COPIED'; setTimeout(function () { b.textContent = 'COPY'; }, 1200);
    });
    hd.appendChild(b);
    var pre = document.createElement('pre'); pre.className = 'hlpre'; pre.textContent = code;
    blk.appendChild(hd); blk.appendChild(pre);
    return blk;
  }

  function decorate(lbody) {
    var t = lbody.textContent || '';
    if (t.indexOf('```') === -1) return;
    var marked = lbody.dataset && lbody.dataset.hl221 === '1';
    if (marked && +lbody.dataset.hl221hash === t.length) return;
    var fences = (t.match(/```/g) || []).length;
    var row = lbody.parentElement;
    var rowDone = !!(row && row.querySelector('.arow'));
    if (fences % 2 !== 0 && !rowDone) return;
    if (lbody.dataset) { lbody.dataset.hl221 = '1'; lbody.dataset.hl221hash = String(t.length); lbody.dataset.hlorig = t.slice(0, 60000); }
    var frag = document.createDocumentFragment();
    var re = /```([A-Za-z0-9+#]*)[^\n]*\n([\s\S]*?)```/g, last = 0, m;
    while ((m = re.exec(t))) {
      var preTxt = t.slice(last, m.index);
      if (preTxt.trim()) { var p = document.createElement('div'); p.className = 'hlprose'; p.textContent = preTxt; frag.appendChild(p); }
      frag.appendChild(makeBlock(langName(m[1]), m[2].replace(/\n$/, '')));
      last = re.lastIndex;
    }
    var tail = t.slice(last);
    if (tail.trim()) {
      if (fences % 2 !== 0) {
        var m2 = tail.match(/^```([A-Za-z0-9+#]*)[^\n]*\n([\s\S]*)$/);
        if (m2) {
          if (tail.slice(0, m2.index).trim()) { var p2 = document.createElement('div'); p2.className = 'hlprose'; p2.textContent = tail.slice(0, m2.index); frag.appendChild(p2); }
          frag.appendChild(makeBlock(langName(m2[1]), m2[2].replace(/\n$/, '')));
        } else { var p3 = document.createElement('div'); p3.className = 'hlprose'; p3.textContent = tail; frag.appendChild(p3); }
      } else { var p4 = document.createElement('div'); p4.className = 'hlprose'; p4.textContent = tail; frag.appendChild(p4); }
    }
    lbody.textContent = '';
    lbody.appendChild(frag);
    if (window.hl222light) { try { window.hl222light(lbody); } catch (e) {} }
  }

  var chat = null, obs = null;
  function sweep() {
    if (!chat || document.body.classList.contains('pre')) return;
    var rows = chat.querySelectorAll('.lbody');
    for (var i = 0; i < rows.length; i++) { try { decorate(rows[i]); } catch (e) {} }
  }
  function arm() {
    var c = document.getElementById('chat');
    if (!c) return;
    if (c !== chat) {
      chat = c;
      if (obs) obs.disconnect();
      obs = new MutationObserver(function () { sweep(); });
      obs.observe(c, { childList: true, subtree: true, characterData: true });
      delete c.dataset.hl223; delete c.dataset.hl224; delete c.dataset.hl227;
    }
    sweep();
  }
  arm(); setInterval(arm, 2000);
  try { console.log('[hl221] online: code casement (true code blocks, copy + language)'); } catch (e) {}
})();
