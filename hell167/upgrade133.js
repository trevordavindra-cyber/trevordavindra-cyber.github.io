/* ILLUMINATI upgrade #133 - hl133-toast-herald (v19.40)
   Gold institutional toast layer: copy actions confirm, empty sends get a notice
   instead of a silent click. Non-blocking, stacks max 3, reduced-motion respected. */
(function () {
  if (window.__HL133) return; window.__HL133 = true;
  var css = ''
    + ".hl133-wrap{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(96px + env(safe-area-inset-bottom,0px));z-index:2147483000;display:flex;flex-direction:column;gap:8px;align-items:center;pointer-events:none;}"
    + ".hl133-toast{font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#C5A45B;background:rgba(8,8,8,.92);border:1px solid rgba(197,164,91,.45);padding:9px 16px;border-radius:2px;box-shadow:0 0 24px rgba(197,164,91,.12),0 8px 28px rgba(0,0,0,.55);opacity:0;transform:translateY(8px);transition:opacity .28s ease,transform .28s ease;max-width:min(88vw,520px);text-align:center;}"
    + ".hl133-toast.hl133-on{opacity:1;transform:translateY(0);}"
    + ".hl133-toast.hl133-err{color:#e0a8a8;border-color:rgba(224,120,120,.45);box-shadow:0 0 24px rgba(224,120,120,.10),0 8px 28px rgba(0,0,0,.55);}"
    + "@media (max-width:820px){.hl133-wrap{bottom:calc(88px + env(safe-area-inset-bottom,0px));}}"
    + "@media (prefers-reduced-motion:reduce){.hl133-toast{transition:none;}}";
  var st = document.createElement('style'); st.id = 'hl133-style'; st.textContent = css;
  try { (document.head || document.documentElement).appendChild(st); } catch (e) {}
  var wrap = null;
  function ensureWrap() {
    if (!wrap || !wrap.isConnected) {
      wrap = document.createElement('div'); wrap.className = 'hl133-wrap';
      (document.body || document.documentElement).appendChild(wrap);
    }
    return wrap;
  }
  function toast(msg, err) {
    try {
      var w = ensureWrap();
      var el = document.createElement('div');
      el.className = 'hl133-toast' + (err ? ' hl133-err' : '');
      el.setAttribute('role', 'status');
      el.textContent = msg;
      w.appendChild(el);
      while (w.children.length > 3) w.removeChild(w.firstChild);
      requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('hl133-on'); }); });
      setTimeout(function () {
        el.classList.remove('hl133-on');
        setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 340);
      }, 2600);
    } catch (e) {}
  }
  window.__hlToast = toast;
  var SEND = /send|transmit/i;
  function isSend(btn) {
    var label = ((btn.textContent || '') + ' ' + (btn.getAttribute('aria-label') || ''));
    return SEND.test(label);
  }
  function boxEmpty() {
    var box = document.querySelector('textarea') || document.querySelector('input[type="text"]');
    return !box || !box.value || !box.value.trim();
  }
  document.addEventListener('click', function (ev) {
    var btn = ev.target && ev.target.closest ? ev.target.closest('button') : null;
    if (!btn || !isSend(btn)) return;
    if (boxEmpty()) toast('Awaiting transmission \u00b7 speak, initiate.', false);
  }, true);
  document.addEventListener('click', function (ev) {
    var el = ev.target && ev.target.closest ? ev.target.closest('[class*="copy"],[title*="copy" i],[aria-label*="copy" i]') : null;
    if (!el) return;
    setTimeout(function () { toast('Transmission sealed to your vault.', false); }, 350);
  }, true);
})();
