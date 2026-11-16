/* hl144-scrolltop — gold reading-progress bar + back-to-top arrow for the record */
(function () {
  if (window.__HL144) return; window.__HL144 = 1;
  var css = ".hl144-bar{position:fixed;left:0;top:0;height:2px;width:0%;background:linear-gradient(90deg,rgba(197,164,91,.35),#C5A45B);z-index:9500;pointer-events:none;box-shadow:0 0 8px rgba(197,164,91,.4);transition:width .12s linear}.hl144-top{position:fixed;left:14px;bottom:calc(86px + env(safe-area-inset-bottom,0px));z-index:8600;width:36px;height:36px;border-radius:50%;background:rgba(10,10,10,.92);border:1px solid rgba(197,164,91,.55);color:#C5A45B;font:600 13px Inter,system-ui,sans-serif;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 18px rgba(0,0,0,.55);opacity:0;pointer-events:none;transform:translateY(6px);transition:opacity .25s,transform .25s,border-color .2s}.hl144-top.on{opacity:1;pointer-events:auto;transform:translateY(0)}.hl144-top:hover{border-color:#C5A45B}";
  var st = document.createElement('style'); st.id = 'hl144-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var bar, top, raf = 0;
  function feed() { return document.querySelector('#feedlist') || document.querySelector('#chat'); }
  function scroller() { return feed() || document.scrollingElement || document.documentElement; }
  function upd() {
    raf = 0;
    var s = scroller(); if (!s || !bar) return;
    var max = (s.scrollHeight || 0) - (s.clientHeight || 0);
    var p = max > 40 ? Math.min(1, Math.max(0, (s.scrollTop || (s === document.scrollingElement ? (window.pageYOffset || 0) : 0)) / max)) : 0;
    bar.style.width = (p * 100).toFixed(1) + '%';
    if (top) top.classList.toggle('on', p > 0.2);
  }
  function schedule() { if (!raf) raf = requestAnimationFrame(upd); }
  function goTop() {
    var s = scroller();
    var smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    try { s.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' }); } catch (e) { s.scrollTop = 0; }
  }
  function build() {
    if (bar || !document.body) return;
    bar = document.createElement('div'); bar.className = 'hl144-bar'; bar.setAttribute('aria-hidden', 'true');
    top = document.createElement('button'); top.className = 'hl144-top'; top.type = 'button'; top.textContent = '\u2191';
    top.setAttribute('aria-label', 'Back to top of the record');
    top.addEventListener('click', goTop);
    document.body.appendChild(bar); document.body.appendChild(top);
    document.addEventListener('scroll', schedule, true);
    window.addEventListener('resize', schedule);
    setInterval(schedule, 1500);
    upd();
  }
  var tries = 0; var iv = setInterval(function () { build(); if (bar) clearInterval(iv); else if (++tries > 90) clearInterval(iv); }, 800);
})();
