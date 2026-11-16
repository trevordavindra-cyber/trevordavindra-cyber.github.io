/* hl179-reverie — THE REVERIE: when the seal-holder returns after a long absence, the circle acknowledges them with an hour-counted greeting */
(function () {
  if (window.__HL179) return; window.__HL179 = 1;
  var css = "#hl179-toast{position:fixed;left:50%;bottom:110px;transform:translateX(-50%) translateY(10px);background:#0d0b07;border:1px solid rgba(216,180,90,.65);color:#e8cf8e;font:10px/1.5 'Courier New',monospace;letter-spacing:.12em;padding:10px 18px;border-radius:2px;z-index:9400;opacity:0;pointer-events:none;transition:opacity .4s ease,transform .4s ease;text-transform:uppercase;white-space:nowrap;box-shadow:0 4px 20px rgba(0,0,0,.65),0 0 18px rgba(216,180,90,.14);text-align:center}#hl179-toast.on{opacity:1;transform:translateX(-50%) translateY(0)}";
  var st = document.createElement('style'); st.id = 'hl179-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var awayAt = 0, armed = true, toast = null, toastT = null;
  function ensureToast() {
    if (!document.body) return false;
    if (!toast) {
      toast = document.createElement('div'); toast.id = 'hl179-toast'; document.body.appendChild(toast);
    }
    return true;
  }
  function fmt(ms) {
    var m = Math.round(ms / 60000);
    if (m < 60) return m + ' MIN';
    var h = Math.floor(m / 60), r = m % 60;
    return h + 'H' + (r ? ' ' + r + 'M' : '');
  }
  function onVis() {
    if (document.visibilityState === 'hidden') { awayAt = Date.now(); armed = true; }
    else if (awayAt && armed) {
      var gone = Date.now() - awayAt;
      armed = false;
      if (gone > 15 * 60000 && ensureToast()) {
        toast.textContent = 'THE CIRCLE KEPT YOUR SEAT \u00b7 AWAY ' + fmt(gone);
        toast.classList.add('on');
        clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove('on'); }, 5000);
      }
    }
  }
  var iv = setInterval(function () {
    if (document.body && typeof document.visibilityState !== 'undefined') {
      document.addEventListener('visibilitychange', onVis);
      clearInterval(iv);
    }
  }, 600);
})();
