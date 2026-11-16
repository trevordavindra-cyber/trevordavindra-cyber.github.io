/* hl145-palette — command palette (Cmd/Ctrl+K or P): one box that runs the record's moves */
(function () {
  if (window.__HL145) return; window.__HL145 = 1;
  var css = ".hl145-ov{position:fixed;inset:0;z-index:9450;display:none;background:rgba(4,4,4,.78);backdrop-filter:blur(5px)}.hl145-card{position:absolute;left:50%;top:18%;transform:translateX(-50%);width:min(460px,90vw);background:linear-gradient(160deg,#0b0b0b,#060606);border:1px solid rgba(197,164,91,.45);border-radius:10px;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.7)}.hl145-in{width:100%;box-sizing:border-box;background:transparent;border:0;border-bottom:1px solid rgba(197,164,91,.2);color:#EDE3CE;font:500 13px Inter,system-ui,sans-serif;padding:13px 16px;outline:none}.hl145-in::placeholder{color:rgba(255,255,255,.28);letter-spacing:.08em}.hl145-list{max-height:52vh;overflow:auto;padding:6px 0}.hl145-r{display:flex;justify-content:space-between;align-items:center;padding:10px 16px;cursor:pointer;font:400 12px Inter,system-ui,sans-serif;color:rgba(255,255,255,.8);border-left:2px solid transparent}.hl145-r.sel{background:rgba(197,164,91,.09);border-left-color:#C5A45B;color:#EDE3CE}.hl145-k{font:600 9px ui-monospace,Menlo,monospace;letter-spacing:.1em;color:#C5A45B;background:rgba(197,164,91,.08);border:1px solid rgba(197,164,91,.3);border-radius:4px;padding:2px 6px;white-space:nowrap}.hl145-e{font:400 8.5px Inter,system-ui,sans-serif;letter-spacing:.22em;color:rgba(255,255,255,.28);text-align:center;padding:9px 0 11px}";
  var st = document.createElement('style'); st.id = 'hl145-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var ov, inp, list, sel = 0, shown = [];
  function smooth() { return !matchMedia('(prefers-reduced-motion: reduce)').matches; }
  function feedEl() { return document.querySelector('#feedlist') || document.querySelector('#chat') || document.scrollingElement; }
  function acts() {
    return [
      { l: 'Search the record', k: '/', run: function () { key('/'); } },
      { l: 'Top of the record', k: 'G', run: function () { var f = feedEl(); try { f.scrollTo({ top: 0, behavior: smooth() ? 'smooth' : 'auto' }); } catch (e) { f.scrollTop = 0; } } },
      { l: 'End of the record', k: '\u21e7G', run: function () { var f = feedEl(); try { f.scrollTo({ top: f.scrollHeight, behavior: smooth() ? 'smooth' : 'auto' }); } catch (e) { f.scrollTop = f.scrollHeight; } } },
      { l: 'Command reference', k: '?', run: function () { key('?'); } },
      { l: 'Close the palette', k: 'Esc', run: function () { toggle(false); } }
    ];
  }
  function key(k) {
    var e = new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true });
    (document.activeElement || document.body).dispatchEvent(e);
    if (!e.defaultPrevented) document.dispatchEvent(e);
  }
  function rows() {
    var q = (inp.value || '').trim().toLowerCase();
    var a = acts();
    if (!q) return a;
    return a.filter(function (x) { return x.l.toLowerCase().indexOf(q) > -1; });
  }
  function render() {
    shown = rows(); sel = 0; list.innerHTML = '';
    shown.forEach(function (a, idx) {
      var d = document.createElement('div'); d.className = 'hl145-r' + (idx === 0 ? ' sel' : '');
      var t = document.createElement('span'); t.textContent = a.l;
      var k = document.createElement('span'); k.className = 'hl145-k'; k.textContent = a.k;
      d.appendChild(t); d.appendChild(k);
      d.addEventListener('click', function () { toggle(false); a.run(); });
      d.addEventListener('mousemove', function () { pick(idx); });
      list.appendChild(d);
    });
    if (!shown.length) { var e = document.createElement('div'); e.className = 'hl145-r'; e.textContent = 'No command matches'; list.appendChild(e); }
  }
  function pick(i) {
    sel = i;
    var rs = list.children;
    for (var j = 0; j < rs.length; j++) rs[j].classList.toggle('sel', j === i);
  }
  function toggle(force) {
    if (!ov) return;
    var show = force !== undefined ? force : ov.style.display !== 'block';
    if (show) { inp.value = ''; render(); ov.style.display = 'block'; try { inp.focus(); } catch (e) { } }
    else { ov.style.display = 'none'; inp.blur(); }
  }
  function build() {
    if (ov || !document.body) return;
    ov = document.createElement('div'); ov.className = 'hl145-ov';
    var card = document.createElement('div'); card.className = 'hl145-card'; card.setAttribute('role', 'dialog'); card.setAttribute('aria-label', 'Command palette');
    inp = document.createElement('input'); inp.className = 'hl145-in'; inp.placeholder = 'TYPE A COMMAND'; inp.setAttribute('aria-label', 'Command palette search');
    inp.addEventListener('input', render);
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { toggle(false); e.stopPropagation(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); pick(Math.min(sel + 1, shown.length - 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); pick(Math.max(sel - 1, 0)); }
      else if (e.key === 'Enter') { e.preventDefault(); var a = shown[sel]; if (a) { toggle(false); a.run(); } }
    });
    list = document.createElement('div'); list.className = 'hl145-list';
    var f = document.createElement('div'); f.className = 'hl145-e'; f.textContent = '\u21e7\u21e5 NAVIGATE \u00b7 \u21b5 RUN \u00b7 ESC CLOSE';
    card.appendChild(inp); card.appendChild(list); card.appendChild(f);
    ov.appendChild(card); document.body.appendChild(ov);
    ov.addEventListener('mousedown', function (e) { if (e.target === ov) toggle(false); });
  }
  function onKey(e) {
    var t = e.target;
    var typing = t && (((t.tagName || '').match(/^(INPUT|TEXTAREA|SELECT)$/) || t.isContentEditable));
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); e.stopPropagation(); toggle(); return; }
    if (typing) return;
    if (e.key === 'p' && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); toggle(); return; }
  }
  var tries = 0; var iv = setInterval(function () { build(); if (ov) { clearInterval(iv); document.addEventListener('keydown', onKey, true); } else if (++tries > 90) clearInterval(iv); }, 800);
})();
