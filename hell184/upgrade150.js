/* hl150-stats — RECORD STATISTICS: entries, words, reading time, longest entry */
(function () {
  if (window.__HL150) return; window.__HL150 = 1;
  var css = ".hl150-chip{position:fixed;z-index:8560;width:34px;height:34px;border-radius:50%;background:rgba(13,13,13,.92);border:1px solid rgba(197,164,91,.45);color:#C5A45B;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:.72;transition:opacity .2s,border-color .2s;box-sizing:border-box;padding:0}.hl150-chip:hover{opacity:1;border-color:rgba(197,164,91,.8)}.hl150-chip svg{width:15px;height:15px;fill:none;stroke:#C5A45B;stroke-width:1.7;pointer-events:none}.hl150-ov{position:fixed;inset:0;z-index:9470;display:none;background:rgba(4,4,4,.78);backdrop-filter:blur(5px)}.hl150-card{position:absolute;left:50%;top:18%;transform:translateX(-50%);width:min(420px,92vw);background:linear-gradient(160deg,#0b0b0b,#060606);border:1px solid rgba(197,164,91,.45);border-radius:10px;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.7)}.hl150-h{padding:14px 18px 10px;font:600 10px Inter,system-ui,sans-serif;letter-spacing:.28em;color:#C5A45B;border-bottom:1px solid rgba(197,164,91,.2)}.hl150-grid{padding:8px 0}.hl150-r{display:flex;justify-content:space-between;align-items:baseline;padding:10px 18px;border-bottom:1px solid rgba(255,255,255,.04)}.hl150-k{font:600 9px Inter,system-ui,sans-serif;letter-spacing:.2em;color:rgba(255,255,255,.45)}.hl150-v{font:600 13px 'JetBrains Mono',monospace;color:#C5A45B}.hl150-sub{font:400 8.5px Inter,system-ui,sans-serif;color:rgba(255,255,255,.3);margin-left:6px}.hl150-long{padding:12px 18px;font:400 11px Inter,system-ui,sans-serif;color:rgba(255,255,255,.55);font-style:italic;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}.hl150-f{font:400 8.5px Inter,system-ui,sans-serif;letter-spacing:.22em;color:rgba(255,255,255,.28);text-align:center;padding:9px 0 11px}";
  var st = document.createElement('style'); st.id = 'hl150-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var chip, ov, rows = {};
  function svgChart() { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19V11M12 19V5M19 19v-6"/></svg>'; }
  function compute() {
    var chat = document.getElementById('chat'); var lines = chat ? chat.querySelectorAll('.line') : [];
    var words = 0, chars = 0, longest = '', longN = 0;
    lines.forEach(function (l, i) {
      var t = ((l.querySelector('.lbody') || l).textContent || '').trim();
      var w = t ? t.split(/\s+/).length : 0;
      words += w; chars += t.length;
      if (t.length > longN) { longN = t.length; longest = t; }
    });
    var mins = Math.max(1, Math.round(words / 220));
    return { n: lines.length, words: words, chars: chars, mins: mins, longest: longest };
  }
  function render() {
    var s = compute();
    rows.n.textContent = String(s.n);
    rows.w.textContent = String(s.words);
    rows.c.textContent = String(s.chars);
    rows.t.innerHTML = s.mins + '<span class="hl150-sub">MIN AT 220 WPM</span>';
    rows.l.textContent = s.longest ? ('\u201c' + s.longest.slice(0, 120) + (s.longest.length > 120 ? '\u2026' : '') + '\u201d') : 'no entries yet';
  }
  function toggle(force) {
    if (!ov) return;
    var show = force !== undefined ? force : ov.style.display !== 'block';
    if (show) { render(); ov.style.display = 'block'; }
    else ov.style.display = 'none';
  }
  function positionChip() {
    if (!chip) return;
    var max = 0, found = false;
    ['.hl139-chip', '.hl140-chip', '.hl143-zbtn', '.hl146-chip', '.hl149-chip'].forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom > max) { max = r.bottom; found = true; }
      });
    });
    var top = found ? Math.min(max + 14, window.innerHeight - 60) : (window.innerHeight * 0.5 + 192);
    chip.style.top = Math.max(40, top) + 'px';
    chip.style.right = (window.innerWidth <= 640 ? '7px' : '10px');
  }
  function build() {
    if (chip || !document.body) return false;
    var chat = document.getElementById('chat'); if (!chat) return false;
    chip = document.createElement('button'); chip.className = 'hl150-chip'; chip.type = 'button';
    chip.setAttribute('aria-label', 'Record statistics'); chip.title = 'Record statistics';
    chip.innerHTML = svgChart();
    chip.addEventListener('click', function () { toggle(); });
    document.body.appendChild(chip); positionChip();
    setTimeout(positionChip, 3500); addEventListener('resize', positionChip);
    ov = document.createElement('div'); ov.className = 'hl150-ov';
    var card = document.createElement('div'); card.className = 'hl150-card'; card.setAttribute('role', 'dialog'); card.setAttribute('aria-label', 'Record statistics');
    var h = document.createElement('div'); h.className = 'hl150-h'; h.textContent = 'RECORD STATISTICS';
    var g = document.createElement('div'); g.className = 'hl150-grid';
    function row(k, id) {
      var r = document.createElement('div'); r.className = 'hl150-r';
      var kk = document.createElement('span'); kk.className = 'hl150-k'; kk.textContent = k;
      var vv = document.createElement('span'); vv.className = 'hl150-v'; vv.id = id;
      r.appendChild(kk); r.appendChild(vv); g.appendChild(r); return vv;
    }
    rows.n = row('ENTRIES', 'hl150-n');
    rows.w = row('WORDS', 'hl150-w');
    rows.c = row('CHARACTERS', 'hl150-c');
    rows.t = row('EST. READING TIME', 'hl150-t');
    var long = document.createElement('div'); long.className = 'hl150-r';
    var lk = document.createElement('span'); lk.className = 'hl150-k'; lk.textContent = 'LONGEST ENTRY';
    rows.l = document.createElement('span'); rows.l.className = 'hl150-v'; rows.l.id = 'hl150-longv'; rows.l.style.maxWidth = '55%';
    long.appendChild(lk); long.appendChild(rows.l); g.appendChild(long);
    var f = document.createElement('div'); f.className = 'hl150-f'; f.textContent = 'LIVE COUNT \u00b7 ESC CLOSE';
    card.appendChild(h); card.appendChild(g); card.appendChild(f);
    ov.appendChild(card); document.body.appendChild(ov);
    ov.addEventListener('mousedown', function (e) { if (e.target === ov) toggle(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && ov.style.display === 'block') { e.stopPropagation(); toggle(false); }
    }, true);
    return true;
  }
  var tries = 0; var iv = setInterval(function () { if (build()) clearInterval(iv); else if (++tries > 90) clearInterval(iv); }, 800);
})();
