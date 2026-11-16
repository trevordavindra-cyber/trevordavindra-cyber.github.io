/* hl147-followtail — while new entries land, a gold JUMP TO LATEST pill keeps you one tap from the live edge */
(function () {
  if (window.__HL147) return; window.__HL147 = 1;
  var css = ".hl147-pill{position:fixed;left:50%;bottom:118px;transform:translateX(-50%);z-index:8700;display:none;align-items:center;gap:8px;background:rgba(10,10,10,.96);border:1px solid rgba(197,164,91,.55);color:#C5A45B;font:600 10px Inter,system-ui,sans-serif;letter-spacing:.12em;border-radius:20px;padding:8px 16px;cursor:pointer;box-shadow:0 8px 30px rgba(0,0,0,.6);max-width:88vw;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.hl147-pill:hover{border-color:#C5A45B;background:rgba(19,17,12,.98)}.hl147-n{display:inline-block;min-width:18px;text-align:center;background:rgba(197,164,91,.14);border:1px solid rgba(197,164,91,.4);border-radius:10px;padding:1px 6px;font-size:9px}.hl147-dot{width:6px;height:6px;border-radius:50%;background:#C5A45B;box-shadow:0 0 8px rgba(197,164,91,.8);animation:hl147blink 1.2s ease-in-out infinite}@keyframes hl147blink{0%,100%{opacity:1}50%{opacity:.25}}@media (max-width:640px){.hl147-pill{bottom:104px;padding:7px 13px;font-size:9px}}";
  var st = document.createElement('style'); st.id = 'hl147-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var pill, nEl, feed, pending = 0, away = false, armed = false;
  function smooth() { return !matchMedia('(prefers-reduced-motion: reduce)').matches; }
  function feedEl() { return document.querySelector('#feedlist') || document.querySelector('#chat') || document.scrollingElement; }
  function atBottom(el) { return el.scrollTop + el.clientHeight >= el.scrollHeight - 70; }
  function toBottom() {
    var el = feedEl();
    try { el.scrollTo({ top: el.scrollHeight, behavior: smooth() ? 'smooth' : 'auto' }); } catch (e) { el.scrollTop = el.scrollHeight; }
    pending = 0; update();
  }
  function update() {
    if (!pill) return;
    if (away && pending > 0) {
      nEl.textContent = String(pending);
      pill.style.display = 'flex';
    } else pill.style.display = 'none';
  }
  function build() {
    if (pill || !document.body) return false;
    feed = feedEl(); if (!feed || !feed.tagName) return false;
    pill = document.createElement('button'); pill.className = 'hl147-pill'; pill.type = 'button';
    pill.setAttribute('aria-label', 'Jump to the newest entries'); pill.title = 'Jump to latest';
    var d = document.createElement('span'); d.className = 'hl147-dot';
    var t = document.createElement('span'); t.textContent = 'JUMP TO LATEST';
    nEl = document.createElement('span'); nEl.className = 'hl147-n'; nEl.textContent = '0';
    pill.appendChild(d); pill.appendChild(t); pill.appendChild(nEl);
    pill.addEventListener('click', toBottom);
    document.body.appendChild(pill);
    feed.addEventListener('scroll', function () {
      var b = atBottom(feed);
      if (b) { away = false; pending = 0; }
      else if (!away) { away = true; pending = 0; }
      update();
    }, { passive: true });
    new MutationObserver(function () {
      if (away) { pending++; update(); }
    }).observe(feed, { childList: true, subtree: true });
    return true;
  }
  var tries = 0; var iv = setInterval(function () { if (build()) clearInterval(iv); else if (++tries > 90) clearInterval(iv); }, 800);
})();
