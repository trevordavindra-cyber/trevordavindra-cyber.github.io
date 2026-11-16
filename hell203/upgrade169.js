/* hl169-keyrite — THE KEYRITE: press / anywhere outside an input and the composer is summoned; the first time, the Order explains the rite */
(function () {
  if (window.__HL169) return; window.__HL169 = 1;
  var css = ".hl169-hint{position:fixed;bottom:128px;left:50%;transform:translate(-50%,8px);z-index:9550;pointer-events:none;opacity:0;transition:opacity .5s ease,transform .5s ease;background:rgba(8,8,8,.94);border:1px solid rgba(197,164,91,.5);padding:8px 16px;color:#e8d9a8;font-family:Georgia,'Times New Roman',serif;font-size:11px;letter-spacing:.22em;text-transform:uppercase;box-shadow:0 4px 22px rgba(0,0,0,.7)}.hl169-hint.on{opacity:1;transform:translate(-50%,0)}@media (max-width:640px){.hl169-hint{bottom:112px;font-size:10px}}";
  var st = document.createElement('style'); st.id = 'hl169-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  function isField(el) {
    if (!el) return false;
    var tag = el.tagName;
    return tag === 'TEXTAREA' || tag === 'INPUT' || el.isContentEditable;
  }
  function findComposer() {
    var tas = document.querySelectorAll('textarea');
    for (var i = 0; i < tas.length; i++) {
      var r = tas[i].getBoundingClientRect();
      if (r.width > 0 && r.height > 0) return tas[i];
    }
    return null;
  }
  function showHint(text) {
    var hint = document.createElement('div');
    hint.className = 'hl169-hint';
    hint.setAttribute('aria-hidden', 'true');
    hint.textContent = text;
    document.body.appendChild(hint);
    requestAnimationFrame(function () { hint.classList.add('on'); });
    setTimeout(function () { hint.classList.remove('on'); }, 2800);
    setTimeout(function () { if (hint.parentNode) hint.parentNode.removeChild(hint); }, 3500);
  }
  var bound = false;
  var tries = 0; var iv = setInterval(function () {
    if (!document.body) return;
    if (bound || findComposer()) {
      clearInterval(iv);
      if (!bound) {
        bound = true;
        document.addEventListener('keydown', function (ev) {
          if (ev.key !== '/' || ev.metaKey || ev.ctrlKey || ev.altKey) return;
          if (isField(ev.target)) return;
          var c = findComposer();
          if (!c) return;
          ev.preventDefault();
          c.focus();
          try {
            var seen = localStorage.getItem('hl169-keyrite-seen');
            if (!seen) { localStorage.setItem('hl169-keyrite-seen', '1'); showHint('THE KEYRITE \u00B7 / SUMMONS THE COMPOSER'); }
          } catch (e) {}
        }, true);
      }
    } else if (++tries > 90) clearInterval(iv);
  }, 800);
})();
