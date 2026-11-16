/* hl166-watchword — THE WATCHWORD: type NOVUS anywhere outside the composer and the Order answers — an all-seeing eye seal descends with a gold shimmer, counted in the annals */
(function () {
  if (window.__HL166) return; window.__HL166 = 1;
  var css = ".hl166-eye{position:fixed;top:14%;left:50%;transform:translate(-50%,-8px) scale(.92);z-index:9850;pointer-events:none;opacity:0;transition:opacity .5s ease,transform .5s cubic-bezier(.2,.7,.2,1);text-align:center;color:#c5a45b;font-family:Georgia,'Times New Roman',serif;letter-spacing:.42em;text-transform:uppercase}.hl166-eye.on{opacity:1;transform:translate(-50%,0) scale(1)}.hl166-eye .hl166-glyph{font-size:44px;line-height:1;filter:drop-shadow(0 0 14px rgba(197,164,91,.65))}.hl166-eye .hl166-word{font-size:12px;margin-top:10px}.hl166-eye .hl166-count{font-size:10px;opacity:.55;margin-top:4px;letter-spacing:.3em}.hl166-shimmer{position:fixed;inset:0;z-index:9800;pointer-events:none;opacity:0;background:radial-gradient(ellipse at 50% 30%,rgba(197,164,91,.10),transparent 62%);transition:opacity .7s ease}.hl166-shimmer.on{opacity:1}";
  var st = document.createElement('style'); st.id = 'hl166-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var eye = null, shimmer = null;
  function ensure() {
    if (eye || !document.body) return false;
    shimmer = document.createElement('div'); shimmer.className = 'hl166-shimmer'; shimmer.setAttribute('aria-hidden', 'true');
    eye = document.createElement('div'); eye.className = 'hl166-eye'; eye.setAttribute('aria-hidden', 'true');
    eye.innerHTML = '<div class="hl166-glyph">\u{1F441}</div><div class="hl166-word">THE WATCHWORD IS ACCEPTED</div><div class="hl166-count"></div>';
    document.body.appendChild(shimmer); document.body.appendChild(eye);
    return true;
  }
  function strike() {
    try {
      var n = 0;
      try { n = parseInt(localStorage.getItem('hl166-watchword') || '0', 10) + 1; localStorage.setItem('hl166-watchword', String(n)); } catch (e) { n = 1; }
      var c = eye.querySelector('.hl166-count');
      if (c) c.textContent = n === 1 ? 'FIRST WITNESS' : 'WITNESS \u00B7 ' + n;
      eye.classList.add('on'); shimmer.classList.add('on');
      clearTimeout(strike._t1);
      strike._t1 = setTimeout(function () { eye.classList.remove('on'); shimmer.classList.remove('on'); }, 2600);
    } catch (e) {}
  }
  var buf = '';
  var tries = 0; var iv = setInterval(function () {
    if (ensure()) {
      clearInterval(iv);
      document.addEventListener('keydown', function (ev) {
        var t = ev.target;
        if (t && (t.tagName === 'TEXTAREA' || t.tagName === 'INPUT' || t.isContentEditable)) return;
        if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
        if (ev.key && ev.key.length === 1) {
          buf = (buf + ev.key.toLowerCase()).slice(-5);
          if (buf === 'novus') { buf = ''; strike(); }
        }
      }, true);
    } else if (++tries > 90) clearInterval(iv);
  }, 800);
})();
