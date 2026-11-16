/* hl139-chatfind — floating search over the chat record: chip, bar, gold match jumps */
(function () {
  if (window.__HL139) return; window.__HL139 = 1;
  var css = ".hl139-chip{position:fixed;right:10px;top:calc(50% - 78px);z-index:8500;width:34px;height:34px;border-radius:50%;background:rgba(13,13,13,.92);border:1px solid rgba(197,164,91,.45);color:#C5A45B;font:400 17px/32px Georgia,serif;text-align:center;cursor:pointer;opacity:.72;transition:opacity .2s,border-color .2s;padding:0}.hl139-chip:hover{opacity:1;border-color:#C5A45B}.hl139-bar{position:fixed;top:52px;left:50%;transform:translateX(-50%);z-index:8600;display:none;align-items:center;gap:8px;background:rgba(10,10,10,.96);border:1px solid rgba(197,164,91,.5);border-radius:6px;padding:8px 10px;max-width:min(560px,92vw);box-shadow:0 6px 24px rgba(0,0,0,.6)}.hl139-bar.on{display:flex}.hl139-bar input{flex:1;min-width:140px;background:transparent;border:none;outline:none;color:#D8D2C4;font:400 13px 'JetBrains Mono',monospace;letter-spacing:.04em}.hl139-bar input::placeholder{color:#5E5D55;text-transform:uppercase;font-size:10px;letter-spacing:.14em}.hl139-count{font:400 10px 'JetBrains Mono',monospace;color:#C5A45B;letter-spacing:.08em;white-space:nowrap;min-width:52px;text-align:center}.hl139-btn{background:transparent;border:1px solid rgba(197,164,91,.4);color:#C5A45B;font:600 10px Inter,system-ui,sans-serif;letter-spacing:.1em;border-radius:4px;padding:5px 8px;cursor:pointer;white-space:nowrap}.hl139-btn:hover{border-color:#C5A45B}.hl139-flash{animation:hl139flash 1.3s ease 1}@keyframes hl139flash{0%{background:rgba(197,164,91,.22);outline:1px solid rgba(197,164,91,.6);outline-offset:-1px}100%{background:transparent;outline:1px solid transparent}}@media (prefers-reduced-motion:reduce){.hl139-flash{animation:none;background:rgba(197,164,91,.18);outline:1px solid rgba(197,164,91,.5);outline-offset:-1px}}@media (max-width:820px){.hl139-chip{width:30px;height:30px;line-height:28px;top:calc(50% - 60px);right:7px;font-size:15px}.hl139-bar{top:46px;padding:7px 8px}}";
  var st = document.createElement('style'); st.id = 'hl139-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var chip, bar, inp, cnt, matches = [], idx = -1;
  function feed() { return document.querySelector('#feedlist') || document.querySelector('#chat'); }
  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function scan() {
    matches = []; idx = -1;
    var q = inp.value.trim().toLowerCase(), f = feed();
    if (!q || !f) { cnt.textContent = matches.length ? '' : '\u2014'; return; }
    Array.prototype.forEach.call(f.children, function (c) {
      if (c.classList.contains('hl138-mark') || c.classList.contains('hl139-flash')) return;
      var t = (c.textContent || '').toLowerCase();
      if (t.indexOf(q) >= 0) matches.push(c);
    });
    cnt.textContent = matches.length ? '0/' + matches.length : 'NO HIT';
    if (matches.length) go(0, true);
  }
  function go(n, first) {
    if (!matches.length) return;
    if (!first) idx = (idx + n + matches.length) % matches.length; else idx = 0;
    cnt.textContent = (idx + 1) + '/' + matches.length;
    var el = matches[idx];
    try { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) { el.scrollIntoView(true); }
    el.classList.remove('hl139-flash'); void el.offsetWidth; el.classList.add('hl139-flash');
    setTimeout(function () { el.classList.remove('hl139-flash'); }, 1400);
  }
  function open() {
    bar.classList.add('on'); inp.value = ''; cnt.textContent = '\u2014';
    try { inp.focus(); } catch (e) { }
  }
  function close() { bar.classList.remove('on'); inp.blur(); }
  function build() {
    if (chip || !document.body) return;
    chip = document.createElement('button'); chip.className = 'hl139-chip'; chip.type = 'button';
    chip.title = 'Search the record'; chip.textContent = '\u2315'; chip.setAttribute('aria-label', 'Search the record');
    chip.addEventListener('click', function () { bar.classList.contains('on') ? close() : open(); });
    document.body.appendChild(chip);
    bar = document.createElement('div'); bar.className = 'hl139-bar';
    inp = document.createElement('input'); inp.type = 'text'; inp.placeholder = 'SEARCH THE RECORD\u2026'; inp.autocomplete = 'off';
    cnt = document.createElement('span'); cnt.className = 'hl139-count'; cnt.textContent = '\u2014';
    var prev = document.createElement('button'); prev.className = 'hl139-btn'; prev.type = 'button'; prev.textContent = '\u2191 PREV';
    var next = document.createElement('button'); next.className = 'hl139-btn'; next.type = 'button'; next.textContent = 'NEXT \u2193';
    var x = document.createElement('button'); x.className = 'hl139-btn'; x.type = 'button'; x.textContent = '\u2715';
    prev.addEventListener('click', function () { go(-1); });
    next.addEventListener('click', function () { go(1); });
    x.addEventListener('click', close);
    inp.addEventListener('input', scan);
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); go(e.shiftKey ? -1 : 1); }
      else if (e.key === 'Escape') { e.preventDefault(); close(); }
    });
    bar.appendChild(inp); bar.appendChild(cnt); bar.appendChild(prev); bar.appendChild(next); bar.appendChild(x);
    document.body.appendChild(bar);
  }
  document.addEventListener('keydown', function (e) {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
    var a = document.activeElement;
    if (a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.isContentEditable)) return;
    e.preventDefault(); build(); open();
  });
  var tries = 0; var iv = setInterval(function () { build(); if (chip && feed()) clearInterval(iv); else if (++tries > 90) clearInterval(iv); }, 800);
})();
