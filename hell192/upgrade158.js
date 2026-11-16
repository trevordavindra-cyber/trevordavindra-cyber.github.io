/* hl158-depth — THE DESCENT: a diamond seal rides the record rail's gold fill, with a live DEPTH readout and threshold pulses at each quarter */
(function () {
  if (window.__HL158) return; window.__HL158 = 1;
  var css = ".hl158-seal{position:absolute;left:5px;width:11px;height:11px;transform:translate(-50%,-50%) rotate(45deg);background:#C5A45B;box-shadow:0 0 12px rgba(197,164,91,.6);pointer-events:none;z-index:1;transition:top .2s ease}.hl158-depth{position:absolute;left:50%;bottom:-26px;transform:translateX(-50%);color:#C5A45B;font:600 8.5px 'JetBrains Mono',monospace;letter-spacing:.14em;background:rgba(11,11,11,.92);border:1px solid rgba(197,164,91,.45);padding:3px 7px;border-radius:4px;white-space:nowrap;pointer-events:none;opacity:.92}.hl158-depth b{font-weight:700}.hl158-thresh{animation:hl158glow .9s ease}@keyframes hl158glow{0%{box-shadow:0 0 6px rgba(197,164,91,.3)}50%{box-shadow:0 0 26px rgba(197,164,91,.95),0 0 44px rgba(197,164,91,.5)}100%{box-shadow:0 0 10px rgba(197,164,91,.35)}}@media (prefers-reduced-motion: reduce){.hl158-thresh{animation:none}}@media (max-width:640px){.hl158-depth{bottom:-24px;font-size:8px;padding:2px 6px}}";
  var st = document.createElement('style'); st.id = 'hl158-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var rail = null, fill = null, seal = null, depth = null, lastQ = -1, shown = false;
  function wire() {
    if (rail) return true;
    rail = document.querySelector('.hl152-rail');
    fill = document.querySelector('.hl152-fill');
    if (!rail || !fill) return false;
    seal = document.createElement('div'); seal.className = 'hl158-seal'; rail.appendChild(seal);
    depth = document.createElement('div'); depth.className = 'hl158-depth'; rail.appendChild(depth);
    return true;
  }
  function tick() {
    if (!wire()) return;
    var h = rail.getBoundingClientRect().height;
    if (!h) return;
    var fh = fill.getBoundingClientRect().height;
    var p = Math.min(1, Math.max(0, fh / h));
    seal.style.top = (p * 100) + '%';
    var pct = Math.round(p * 100);
    if (depth.textContent.indexOf('' + pct) === -1) depth.innerHTML = 'DEPTH <b>' + pct + '%</b>';
    var q = pct >= 99 ? 4 : Math.floor(pct / 25);
    if (q > 0 && q > lastQ) {
      lastQ = q;
      if (!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
        fill.classList.remove('hl158-thresh'); void fill.offsetWidth; fill.classList.add('hl158-thresh');
      }
    }
    if (pct < 5 && lastQ > 0) lastQ = 0;
    if (!shown) { shown = true; }
  }
  var tries = 0; var iv = setInterval(function () { if (wire()) { clearInterval(iv); setInterval(tick, 400); tick(); } else if (++tries > 90) clearInterval(iv); }, 800);
  addEventListener('resize', function () { if (rail) tick(); });
})();
