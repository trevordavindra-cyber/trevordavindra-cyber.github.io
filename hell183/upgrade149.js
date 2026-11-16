/* hl149-pins — pin a reply, jump back to it: PIN in each action bar + a gold pins drawer */
(function () {
  if (window.__HL149) return; window.__HL149 = 1;
  var css = ".hl149-chip{position:fixed;z-index:8560;width:34px;height:34px;border-radius:50%;background:rgba(13,13,13,.92);border:1px solid rgba(197,164,91,.45);color:#C5A45B;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:.72;transition:opacity .2s,border-color .2s;box-sizing:border-box;padding:0}.hl149-chip:hover{opacity:1;border-color:rgba(197,164,91,.8)}.hl149-chip svg{width:15px;height:15px;fill:none;stroke:#C5A45B;stroke-width:1.6;pointer-events:none}.hl149-badge{position:absolute;top:-3px;right:-3px;min-width:14px;height:14px;border-radius:7px;background:#C5A45B;color:#0b0b0b;font:700 8px Inter,system-ui,sans-serif;display:flex;align-items:center;justify-content:center;padding:0 3px}.hl149-ov{position:fixed;inset:0;z-index:9460;display:none;background:rgba(4,4,4,.78);backdrop-filter:blur(5px)}.hl149-card{position:absolute;left:50%;top:16%;transform:translateX(-50%);width:min(480px,92vw);max-height:70vh;display:flex;flex-direction:column;background:linear-gradient(160deg,#0b0b0b,#060606);border:1px solid rgba(197,164,91,.45);border-radius:10px;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.7)}.hl149-h{padding:14px 18px 10px;font:600 10px Inter,system-ui,sans-serif;letter-spacing:.28em;color:#C5A45B;border-bottom:1px solid rgba(197,164,91,.2)}.hl149-list{overflow:auto;padding:6px 0}.hl149-r{display:flex;gap:10px;align-items:center;padding:11px 16px;cursor:pointer;border-left:2px solid transparent}.hl149-r:hover{background:rgba(197,164,91,.08);border-left-color:#C5A45B}.hl149-n{font:600 9px 'JetBrains Mono',monospace;color:rgba(197,164,91,.7);white-space:nowrap}.hl149-t{font:400 12px Inter,system-ui,sans-serif;color:rgba(255,255,255,.82);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}.hl149-e{font:400 11px Inter,system-ui,sans-serif;color:rgba(255,255,255,.35);padding:26px 16px;text-align:center;letter-spacing:.1em}.hl149-f{font:400 8.5px Inter,system-ui,sans-serif;letter-spacing:.22em;color:rgba(255,255,255,.28);text-align:center;padding:9px 0 11px}.line.hl149-pin{box-shadow:inset 3px 0 0 rgba(197,164,91,.85)}button.ordact-hl149{background:transparent;border:0;color:#C5A45B;font:600 9px Inter,system-ui,sans-serif;letter-spacing:.12em;cursor:pointer;padding:4px 6px}.line.hl149-flash{animation:hl149flash 1.3s ease 1}@keyframes hl149flash{0%{background:rgba(197,164,91,.22)}100%{background:transparent}}";
  var st = document.createElement('style'); st.id = 'hl149-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var chip, badge, ov, listEl, pinned = [];
  function svgPin() { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4l6 6-2.5.8-3.2 3.2-.8 3.5-6-6 3.5-.8 3.2-3.2L14 4zM9 15l-5 5"/></svg>'; }
  function idxOf(line) {
    var chat = document.getElementById('chat'); if (!chat) return 0;
    var lines = chat.querySelectorAll('.line'); var n = 0;
    for (var i = 0; i < lines.length; i++) { if (lines[i] === line) return n; n++; }
    return n;
  }
  function flash(line) {
    line.classList.remove('hl149-flash'); void line.offsetWidth; line.classList.add('hl149-flash');
    setTimeout(function () { line.classList.remove('hl149-flash'); }, 1400);
  }
  function jump(line) {
    try { line.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' }); } catch (e) { line.scrollIntoView(); }
    setTimeout(function () { flash(line); }, 250);
  }
  function refreshList() {
    if (!listEl) return;
    listEl.innerHTML = '';
    if (!pinned.length) {
      var e = document.createElement('div'); e.className = 'hl149-e'; e.textContent = 'NOTHING PINNED YET \u2014 TAP PIN UNDER A REPLY';
      listEl.appendChild(e); return;
    }
    pinned.forEach(function (p) {
      var r = document.createElement('div'); r.className = 'hl149-r';
      var n = document.createElement('span'); n.className = 'hl149-n'; n.textContent = '#' + p.idx;
      var t = document.createElement('span'); t.className = 'hl149-t'; t.textContent = p.text.slice(0, 90) || '(empty)';
      r.appendChild(n); r.appendChild(t);
      r.addEventListener('click', function () { toggle(false); jump(p.line); });
      listEl.appendChild(r);
    });
  }
  function toggle(force) {
    if (!ov) return;
    var show = force !== undefined ? force : ov.style.display !== 'block';
    if (show) { refreshList(); ov.style.display = 'block'; }
    else ov.style.display = 'none';
  }
  function pinToggle(line, btn) {
    var i = pinned.findIndex(function (p) { return p.line === line; });
    if (i > -1) { pinned.splice(i, 1); line.classList.remove('hl149-pin'); if (btn) btn.textContent = 'PIN'; }
    else { pinned.push({ line: line, idx: idxOf(line), text: (line.querySelector('.lbody') || line).textContent || '' }); line.classList.add('hl149-pin'); if (btn) btn.textContent = 'UNPIN'; }
    if (badge) {
      badge.textContent = String(pinned.length);
      badge.style.display = pinned.length ? 'flex' : 'none';
    }
    if (ov && ov.style.display === 'block') refreshList();
  }
  function addPinBtn(bar, line) {
    if (!bar || bar.querySelector('.ordact-hl149')) return;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'ordact-hl149';
    b.textContent = pinned.some(function (p) { return p.line === line; }) ? 'UNPIN' : 'PIN';
    b.addEventListener('click', function (e) { e.stopPropagation(); pinToggle(line, b); });
    bar.appendChild(b);
  }
  function decorate(line) {
    if (!line || line.dataset.hl149 || !line.classList || !line.classList.contains('imp')) return;
    line.dataset.hl149 = '1';
    var bar = line.querySelector('.ordact');
    if (bar) addPinBtn(bar, line);
  }
  function positionChip() {
    if (!chip) return;
    var max = 0, found = false;
    ['.hl139-chip', '.hl140-chip', '.hl143-zbtn', '.hl146-chip'].forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom > max) { max = r.bottom; found = true; }
      });
    });
    var top = found ? Math.min(max + 14, window.innerHeight - 60) : (window.innerHeight * 0.5 + 148);
    chip.style.top = Math.max(40, top) + 'px';
    chip.style.right = (window.innerWidth <= 640 ? '7px' : '10px');
  }
  function build() {
    if (chip || !document.body) return false;
    var chat = document.getElementById('chat'); if (!chat) return false;
    chip = document.createElement('button'); chip.className = 'hl149-chip'; chip.type = 'button';
    chip.setAttribute('aria-label', 'Pinned replies'); chip.title = 'Pinned replies';
    chip.innerHTML = svgPin() + '<span class="hl149-badge" style="display:none">0</span>';
    badge = chip.querySelector('.hl149-badge');
    chip.addEventListener('click', function () { toggle(); });
    document.body.appendChild(chip); positionChip();
    setTimeout(positionChip, 3500); addEventListener('resize', positionChip);
    ov = document.createElement('div'); ov.className = 'hl149-ov';
    var card = document.createElement('div'); card.className = 'hl149-card'; card.setAttribute('role', 'dialog'); card.setAttribute('aria-label', 'Pinned replies');
    var h = document.createElement('div'); h.className = 'hl149-h'; h.textContent = 'PINNED REPLIES';
    listEl = document.createElement('div'); listEl.className = 'hl149-list';
    var f = document.createElement('div'); f.className = 'hl149-f'; f.textContent = 'TAP A ROW TO JUMP \u00b7 ESC CLOSE';
    card.appendChild(h); card.appendChild(listEl); card.appendChild(f);
    ov.appendChild(card); document.body.appendChild(ov);
    ov.addEventListener('mousedown', function (e) { if (e.target === ov) toggle(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && ov.style.display === 'block') { e.stopPropagation(); toggle(false); }
    }, true);
    Array.prototype.slice.call(chat.querySelectorAll('.line.imp')).forEach(decorate);
    new MutationObserver(function (ms) {
      ms.forEach(function (m) {
        Array.prototype.slice.call(m.addedNodes).forEach(function (n) {
          if (n.nodeType !== 1) return;
          if (n.classList && n.classList.contains('line')) decorate(n);
          else if (n.querySelectorAll) Array.prototype.slice.call(n.querySelectorAll('.line.imp')).forEach(decorate);
        });
      });
      chat.querySelectorAll('.line.imp:not([data-hl149]) .ordact').forEach(function (bar) { decorate(bar.closest('.line.imp')); });
    }).observe(chat, { childList: true, subtree: true });
    return true;
  }
  var tries = 0; var iv = setInterval(function () { if (build()) clearInterval(iv); else if (++tries > 90) clearInterval(iv); }, 800);
})();
