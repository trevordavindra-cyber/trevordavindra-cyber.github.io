/* hl142-shortcuts — command reference overlay (?) + G / Shift+G record jumps */
(function () {
  if (window.__HL142) return; window.__HL142 = 1;
  var css = ".hl142-ov{position:fixed;inset:0;z-index:9400;display:none;background:rgba(4,4,4,.82);backdrop-filter:blur(6px)}.hl142-card{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(420px,88vw);max-height:80vh;overflow:auto;background:linear-gradient(160deg,#0b0b0b,#060606);border:1px solid rgba(197,164,91,.45);border-radius:10px;padding:22px 24px;box-shadow:0 24px 80px rgba(0,0,0,.7)}.hl142-h{font:700 13px 'Cormorant Garamond',Georgia,serif;letter-spacing:.3em;color:#C5A45B;text-align:center;margin:0 0 4px}.hl142-s{font:400 9px Inter,system-ui,sans-serif;letter-spacing:.2em;color:rgba(255,255,255,.35);text-align:center;margin:0 0 14px}.hl142-r{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid rgba(197,164,91,.12);font:400 11px Inter,system-ui,sans-serif;color:rgba(255,255,255,.78)}.hl142-r:last-child{border-bottom:0}.hl142-k{font:600 10px ui-monospace,Menlo,monospace;letter-spacing:.08em;color:#C5A45B;background:rgba(197,164,91,.08);border:1px solid rgba(197,164,91,.3);border-radius:4px;padding:2px 7px;margin-left:6px;white-space:nowrap}.hl142-f{font:400 8.5px Inter,system-ui,sans-serif;letter-spacing:.25em;color:rgba(255,255,255,.3);text-align:center;margin:14px 0 0}";
  var st = document.createElement('style'); st.id = 'hl142-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var ov;
  function feedEl() { return document.querySelector('#feedlist') || document.querySelector('#chat') || document.scrollingElement; }
  function rows() {
    return [['\u2192', 'send the current message'], ['/', 'search the record'], ['N', 'next match'], ['M', 'previous match'], ['G', 'top of the record'], ['\u21e7G', 'end of the record'], ['?', 'toggle this reference']];
  }
  function build() {
    if (ov || !document.body) return;
    ov = document.createElement('div'); ov.className = 'hl142-ov';
    var card = document.createElement('div'); card.className = 'hl142-card'; card.setAttribute('role', 'dialog'); card.setAttribute('aria-label', 'Keyboard command reference');
    var h = document.createElement('p'); h.className = 'hl142-h'; h.textContent = 'COMMAND REFERENCE'; card.appendChild(h);
    var s = document.createElement('p'); s.className = 'hl142-s'; s.textContent = 'KEYS OF THE ORDER'; card.appendChild(s);
    rows().forEach(function (r) {
      var d = document.createElement('div'); d.className = 'hl142-r';
      var a = document.createElement('span'); a.textContent = r[1];
      var k = document.createElement('span'); k.className = 'hl142-k'; k.textContent = r[0];
      d.appendChild(a); d.appendChild(k); card.appendChild(d);
    });
    var f = document.createElement('p'); f.className = 'hl142-f'; f.textContent = 'ESC OR ANYWHERE CLOSES'; card.appendChild(f);
    ov.appendChild(card); document.body.appendChild(ov);
    ov.addEventListener('click', function () { toggle(false); });
  }
  function toggle(force) {
    build(); if (!ov) return;
    var show = force !== undefined ? force : ov.style.display !== 'block';
    ov.style.display = show ? 'block' : 'none';
  }
  function onKey(e) {
    var t = e.target;
    if (t && ((t.tagName || '').match(/^(INPUT|TEXTAREA|SELECT)$/) || t.isContentEditable)) return;
    if (e.key === 'Escape') { toggle(false); return; }
    if (e.key === '?' || (e.key === 'h' && !e.ctrlKey && !e.metaKey && !e.altKey)) { e.preventDefault(); toggle(); return; }
    if (ov && ov.style.display === 'block') return;
    var k = e.key;
    if (k === 'g' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault(); var f = feedEl();
      try { f.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); } catch (err) { f.scrollTop = 0; }
    } else if (k === 'G') {
      e.preventDefault(); var f2 = feedEl();
      try { f2.scrollTo({ top: f2.scrollHeight, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); } catch (err) { f2.scrollTop = f2.scrollHeight; }
    }
  }
  var tries = 0; var iv = setInterval(function () { build(); if (ov) { clearInterval(iv); document.addEventListener('keydown', onKey, true); } else if (++tries > 90) clearInterval(iv); }, 800);
})();
