/* hl154-resume — remembers your reading depth in the record and offers to resume after a reload */
(function () {
  if (window.__HL154) return; window.__HL154 = 1;
  var KEY = 'hl154-resume';
  var css = ".hl154-pill{position:fixed;left:50%;bottom:96px;transform:translateX(-50%) translateY(10px);z-index:8460;background:rgba(11,11,11,.95);border:1px solid #C5A45B;color:#C5A45B;font:600 9px 'JetBrains Mono',monospace;letter-spacing:.14em;padding:9px 16px;border-radius:20px;box-shadow:0 4px 22px rgba(0,0,0,.6),0 0 14px rgba(197,164,91,.18);cursor:pointer;opacity:0;pointer-events:none;transition:opacity .35s,transform .35s;white-space:nowrap}.hl154-pill.on{opacity:1;pointer-events:auto;transform:translateX(-50%) translateY(0)}.hl154-pill:hover{background:rgba(197,164,91,.12)}@media (max-width:640px){.hl154-pill{bottom:86px;font-size:8.5px}}";
  var st = document.createElement('style'); st.id = 'hl154-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var pill = null, scroller = null, hideTimer = null;
  function findScroller() {
    var ids = ['feedlist', 'chat', 'feed', 'messages'];
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (el && el.scrollHeight > el.clientHeight + 40) return el;
    }
    var doc = document.scrollingElement || document.documentElement;
    if (doc && doc.scrollHeight > doc.clientHeight + 40) return doc;
    return null;
  }
  function chatLines() {
    var chat = document.getElementById('chat');
    return chat ? chat.querySelectorAll('.line').length : 0;
  }
  function track() {
    scroller = findScroller();
    if (!scroller) return;
    var max = scroller.scrollHeight - scroller.clientHeight;
    if (max <= 0) return;
    var r = scroller.scrollTop / max;
    var lines = chatLines();
    if (r > 0.05 && lines > 8) {
      try { localStorage.setItem(KEY, JSON.stringify({ r: r, n: lines, ts: Date.now() })); } catch (e) {}
    }
  }
  function show() {
    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
    if (!saved || !saved.r) return;
    if (Date.now() - (saved.ts || 0) > 43200000) return;
    var lines = chatLines();
    if (!lines || Math.abs(lines - saved.n) > 2) return;
    var sc = findScroller();
    if (!sc) return;
    var max = sc.scrollHeight - sc.clientHeight;
    var cur = max > 0 ? sc.scrollTop / max : 0;
    if (Math.abs(cur - saved.r) < 0.06) return;
    pill.textContent = 'RESUME READING · ' + Math.round(saved.r * 100) + '%';
    pill.classList.add('on');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, 14000);
  }
  function hide() {
    if (pill) pill.classList.remove('on');
    clearTimeout(hideTimer);
  }
  function jump() {
    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
    hide();
    if (!saved || !scroller) return;
    var max = scroller.scrollHeight - scroller.clientHeight;
    var to = saved.r * max;
    var rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    try { scroller.scrollTo({ top: to, behavior: rm ? 'auto' : 'smooth' }); } catch (e) { scroller.scrollTop = to; }
  }
  function build() {
    if (pill || !document.body) return false;
    var chat = document.getElementById('chat'); if (!chat) return false;
    pill = document.createElement('div'); pill.className = 'hl154-pill'; pill.setAttribute('role', 'button');
    pill.textContent = 'RESUME READING';
    pill.addEventListener('click', jump);
    document.body.appendChild(pill);
    var deb = null;
    addEventListener('scroll', function () {
      clearTimeout(deb);
      deb = setTimeout(track, 600);
    }, true);
    setTimeout(show, 6000);
    return true;
  }
  var tries = 0; var iv = setInterval(function () { if (build()) clearInterval(iv); else if (++tries > 90) clearInterval(iv); }, 800);
})();
