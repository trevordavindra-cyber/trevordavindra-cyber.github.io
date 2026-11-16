/* hl138-timemarkers — gold feed time markers + per-message timestamps */
(function () {
  if (window.__HL138) return; window.__HL138 = 1;
  var GAP = 5 * 60 * 1000;
  var css = ".hl138-mark{display:flex;align-items:center;gap:10px;margin:14px 6px 8px;opacity:0;animation:hl138fade .6s ease .05s both}.hl138-mark::before,.hl138-mark::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(197,164,91,.35),transparent)}.hl138-mark::after{background:linear-gradient(90deg,rgba(197,164,91,.35),transparent)}.hl138-mark span{font:600 9px/1 Inter,system-ui,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#C5A45B;white-space:nowrap}.hl138-ts{display:block;margin-top:4px;text-align:right;font:400 9px/1 'JetBrains Mono',monospace;color:#6E6A5C;letter-spacing:.08em;pointer-events:none}@keyframes hl138fade{from{opacity:0}to{opacity:.85}}@media (prefers-reduced-motion:reduce){.hl138-mark{animation:none;opacity:.85}}";
  var st = document.createElement('style'); st.id = 'hl138-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  function fmt(t) { try { return new Date(t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); } catch (e) { return ''; } }
  function feeds() {
    var out = []; ['#feedlist', '#chat'].forEach(function (sel) { var el = document.querySelector(sel); if (el && out.indexOf(el) < 0) out.push(el); }); return out;
  }
  function skip(n) { return !(n instanceof Element) || n.classList.contains('hl138-mark') || n.classList.contains('hl138-ts'); }
  var inserting = false;
  function stamp(el, t) {
    if (el.querySelector(':scope > .hl138-ts')) return;
    var s = document.createElement('span'); s.className = 'hl138-ts'; s.textContent = fmt(t); el.appendChild(s);
  }
  function mark(el, t) {
    if (!el.parentNode) return;
    inserting = true;
    var m = document.createElement('div'); m.className = 'hl138-mark';
    var s = document.createElement('span'); s.textContent = '\u25C8 ' + fmt(t); m.appendChild(s);
    el.parentNode.insertBefore(m, el);
    inserting = false;
  }
  function handle(n) {
    if (inserting || skip(n) || n.dataset.hl138ts) return;
    var now = Date.now();
    var p = n.previousElementSibling;
    var pt = 0;
    while (p) { if (!skip(p) && p.dataset && p.dataset.hl138t) { pt = parseInt(p.dataset.hl138t, 10); break; } p = p.previousElementSibling; }
    n.dataset.hl138t = String(now); n.dataset.hl138ts = '1';
    try { stamp(n, now); } catch (e) { }
    if (pt && now - pt > GAP) mark(n, now);
  }
  function wire() {
    var fs = feeds(); if (!fs.length) return false;
    fs.forEach(function (f) {
      if (f.dataset.hl138w) return; f.dataset.hl138w = '1';
      Array.prototype.forEach.call(f.children, function (c) {
        if (skip(c) || c.dataset.hl138ts) return;
        c.dataset.hl138t = String(Date.now()); c.dataset.hl138ts = '1';
      });
      new MutationObserver(function (ms) {
        ms.forEach(function (m) { Array.prototype.forEach.call(m.addedNodes, handle); });
      }).observe(f, { childList: true, subtree: false });
    });
    return true;
  }
  setInterval(function () { if (!wire()) return;
    feeds().forEach(function (f) {
      Array.prototype.forEach.call(f.children, function (c) {
        if (skip(c) || !c.dataset.hl138ts) return;
        if (!c.querySelector(':scope > .hl138-ts')) { try { stamp(c, parseInt(c.dataset.hl138t, 10) || Date.now()); } catch (e) { } }
      });
    });
  }, 1500);
  var tries = 0; var iv = setInterval(function () { if (wire() || ++tries > 75) clearInterval(iv); }, 800);
})();
