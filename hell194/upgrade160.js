/* hl160-tempus — THE TEMPLE CLOCK: a live gold clock plaque in the upper-left corner, local time with a breathing colon plus session time inside the order */
(function () {
  if (window.__HL160) return; window.__HL160 = 1;
  var css = ".hl160-clock{position:fixed;top:26px;left:26px;z-index:8110;pointer-events:none;color:rgba(197,164,91,.78);font:600 9px 'JetBrains Mono',monospace;letter-spacing:.18em;text-shadow:0 0 8px rgba(197,164,91,.3);line-height:1.7;white-space:nowrap}.hl160-clock .hl160-t{display:block}.hl160-clock .hl160-sub{font-size:8px;color:rgba(197,164,91,.5)}.hl160-clock .hl160-blink{animation:hl160blink 2s steps(1,end) infinite}@keyframes hl160blink{0%,60%{opacity:1}61%,100%{opacity:.25}}@media (prefers-reduced-motion: reduce){.hl160-clock .hl160-blink{animation:none}}@media (max-width:640px){.hl160-clock{top:18px;left:18px;font-size:8px}.hl160-clock .hl160-sub{font-size:7px}}";
  var st = document.createElement('style'); st.id = 'hl160-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var box = null, tEl = null, sEl = null, start = Date.now();
  function two(n) { return (n < 10 ? '0' : '') + n; }
  function build() {
    if (box || !document.body) return false;
    box = document.createElement('div');
    box.className = 'hl160-clock';
    box.setAttribute('aria-hidden', 'true');
    tEl = document.createElement('span'); tEl.className = 'hl160-t';
    sEl = document.createElement('span'); sEl.className = 'hl160-t hl160-sub';
    box.appendChild(tEl); box.appendChild(sEl);
    document.body.appendChild(box);
    return true;
  }
  function tick() {
    if (!box) return;
    var d = new Date();
    var h = d.getHours(), m = d.getMinutes(), s = d.getSeconds();
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var colon = reduced ? ':' : '<span class="hl160-blink">:</span>';
    tEl.innerHTML = two(h) + colon + two(m) + colon + two(s);
    var el = Math.floor((Date.now() - start) / 1000);
    sEl.textContent = 'SESSION ' + two(Math.floor(el / 60)) + ':' + two(el % 60);
  }
  var tries = 0; var iv = setInterval(function () { if (build()) { clearInterval(iv); tick(); setInterval(tick, 1000); } else if (++tries > 90) clearInterval(iv); }, 800);
})();
