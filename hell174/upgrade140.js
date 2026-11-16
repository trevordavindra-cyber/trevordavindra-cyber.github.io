/* hl140-export — archive the record: download the chat transcript as a dated markdown file */
(function () {
  if (window.__HL140) return; window.__HL140 = 1;
  var css = ".hl140-chip{position:fixed;right:10px;top:calc(50% - 34px);z-index:8500;width:34px;height:34px;border-radius:50%;background:rgba(13,13,13,.92);border:1px solid rgba(197,164,91,.45);color:#C5A45B;font:400 15px/32px Georgia,serif;text-align:center;cursor:pointer;opacity:.72;transition:opacity .2s,border-color .2s;padding:0}.hl140-chip:hover{opacity:1;border-color:#C5A45B}.hl140-done{animation:hl140pop .5s ease 1}@keyframes hl140pop{0%{transform:scale(1)}40%{transform:scale(1.18)}100%{transform:scale(1)}}@media (prefers-reduced-motion:reduce){.hl140-done{animation:none}}@media (max-width:820px){.hl140-chip{width:30px;height:30px;line-height:28px;top:calc(50% - 22px);right:7px;font-size:13px}}";
  var st = document.createElement('style'); st.id = 'hl140-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  function feed() { return document.querySelector('#feedlist') || document.querySelector('#chat'); }
  function ts(t) { try { return new Date(t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); } catch (e) { return ''; } }
  function stampOf(el) {
    if (el.dataset && el.dataset.hl138t) return ts(parseInt(el.dataset.hl138t, 10));
    return '';
  }
  function stampOfMark(el) {
    var s = el.querySelector('span'); return s ? s.textContent.replace(/^\u25C8\s*/, '') : '';
  }
  function buildMd() {
    var f = feed(); if (!f) return '';
    var lines = ['# ILLUMINATI RECORD', '', 'Archived ' + new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }), ''];
    var n = 0;
    Array.prototype.forEach.call(f.children, function (c) {
      var txt = (c.textContent || '').trim();
      if (!txt) return;
      if (c.classList && c.classList.contains('hl138-mark')) { lines.push('---  ' + stampOfMark(c) + '  ---', ''); return; }
      n++;
      var st = stampOf(c);
      lines.push('**' + (st ? '[' + st + '] ' : '') + 'ENTRY ' + n + '**', '', txt, '');
    });
    if (!n) lines.push('_The record is empty._', '');
    lines.push('---', '', 'ILLUMINATI \u00b7 sealed record \u00b7 ' + new Date().toISOString().slice(0, 10));
    return lines.join('\n');
  }
  function save() {
    var md = buildMd(); if (!md) return;
    var d = new Date();
    function p(x) { return (x < 10 ? '0' : '') + x; }
    var name = 'illuminati-record-' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '-' + p(d.getHours()) + p(d.getMinutes()) + '.md';
    try {
      var blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a'); a.href = url; a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    } catch (e) { return; }
    if (chip) { chip.classList.remove('hl140-done'); void chip.offsetWidth; chip.classList.add('hl140-done'); }
  }
  var chip;
  function build() {
    if (chip || !document.body) return;
    chip = document.createElement('button'); chip.className = 'hl140-chip'; chip.type = 'button';
    chip.title = 'Archive the record'; chip.textContent = '\u21E9'; chip.setAttribute('aria-label', 'Download the chat record as markdown');
    chip.addEventListener('click', save);
    document.body.appendChild(chip);
  }
  var tries = 0; var iv = setInterval(function () { build(); if (chip) clearInterval(iv); else if (++tries > 90) clearInterval(iv); }, 800);
})();
