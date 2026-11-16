/* ILLUMINATI upgrade #134 - hl134-feed-jump (v19.41)
   A gold RETURN TO THE FEED chip that appears when you scroll up in a long
   conversation, scrolls you back to the live end of the feed. Additive only:
   no existing behavior touched. Reduced-motion respected. */
(function () {
  if (window.__HL134) return; window.__HL134 = true;
  var css = ''
    + ".hl134-jump{position:fixed;right:18px;bottom:calc(112px + env(safe-area-inset-bottom,0px));z-index:2147482900;display:none;font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#C5A45B;background:rgba(8,8,8,.92);border:1px solid rgba(197,164,91,.45);padding:10px 14px;border-radius:999px;box-shadow:0 0 20px rgba(197,164,91,.14),0 8px 26px rgba(0,0,0,.55);cursor:pointer;opacity:0;transform:translateY(6px);transition:opacity .25s ease,transform .25s ease;pointer-events:none;}"
    + ".hl134-jump.hl134-on{display:block;opacity:1;transform:translateY(0);pointer-events:auto;}"
    + ".hl134-jump:active{transform:translateY(0) scale(.96);}"
    + "@media (max-width:820px){.hl134-jump{right:14px;bottom:calc(100px + env(safe-area-inset-bottom,0px));}}"
    + "@media (prefers-reduced-motion:reduce){.hl134-jump{transition:none;}}";
  var st = document.createElement('style'); st.id = 'hl134-style'; st.textContent = css;
  try { (document.head || document.documentElement).appendChild(st); } catch (e) {}
  var btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'hl134-jump';
  btn.setAttribute('aria-label', 'Return to the live feed');
  btn.textContent = '\u25bc live feed';
  try { (document.body || document.documentElement).appendChild(btn); } catch (e) {}
  function feed() {
    try { return document.getElementById('chat') || document.getElementById('feedlist') || document.getElementById('feed') || document.querySelector('[id$="feed"], .feed'); } catch (e) { return null; }
  }
  function scroller() {
    var f = feed(); if (!f) return null;
    var el = f;
    while (el && el !== document.body) {
      var oy = '';
      try { oy = getComputedStyle(el).overflowY; } catch (e) {}
      if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight + 10) return el;
      el = el.parentElement;
    }
    try { return document.scrollingElement || null; } catch (e) { return null; }
  }
  function far() {
    var s = scroller(); if (!s) return false;
    return (s.scrollHeight - s.scrollTop - s.clientHeight) > 260;
  }
  function refresh() { try { btn.classList.toggle('hl134-on', far()); } catch (e) {} }
  btn.addEventListener('click', function () {
    var s = scroller(); if (!s) return;
    var smooth = true;
    try { smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    try { s.scrollTo({ top: s.scrollHeight, behavior: smooth ? 'smooth' : 'auto' }); }
    catch (e) { s.scrollTop = s.scrollHeight; }
    setTimeout(refresh, 400);
  });
  document.addEventListener('scroll', refresh, true);
  setInterval(refresh, 900);
  refresh();
})();
