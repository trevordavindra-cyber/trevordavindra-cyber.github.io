/* hl163-tally — THE SCRIBE'S TALLY: a live gold counter rises beneath the composer while you write, showing words and characters so every transmission is measured before it is sealed */
(function () {
  if (window.__HL163) return; window.__HL163 = 1;
  var css = ".hl163-tally{position:fixed;left:50%;bottom:92px;transform:translateX(-50%);z-index:9600;pointer-events:none;background:rgba(8,8,8,.9);border:1px solid rgba(197,164,91,.4);border-radius:3px;color:rgba(212,175,98,.9);font:600 8px 'JetBrains Mono',monospace;letter-spacing:.18em;padding:4px 9px;text-shadow:0 0 6px rgba(197,164,91,.3);opacity:0;transition:opacity .25s ease;white-space:nowrap}.hl163-tally.hl163-on{opacity:1}@media (max-width:640px){.hl163-tally{bottom:82px;font-size:7px}}";
  var st = document.createElement('style'); st.id = 'hl163-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var box = null, hideTimer = null;
  function ensure() {
    if (box || !document.body) return false;
    box = document.createElement('div');
    box.className = 'hl163-tally';
    box.setAttribute('aria-hidden', 'true');
    document.body.appendChild(box);
    return true;
  }
  function hideSoon() {
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(function () { if (box) box.classList.remove('hl163-on'); }, 1400);
  }
  function count(v) {
    var chars = v.length;
    var words = v.trim() ? v.trim().split(/\s+/).length : 0;
    return 'WORDS ' + words + ' \u00b7 CHARS ' + chars;
  }
  function read() {
    var ta = document.activeElement;
    if (!ta || ta.tagName !== 'TEXTAREA' || !(ta.value || '').length) { hideSoon(); return; }
    if (!ensure()) return;
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    box.textContent = count(ta.value);
    box.classList.add('hl163-on');
  }
  document.addEventListener('input', read, { passive: true });
  document.addEventListener('focusin', read, { passive: true });
  document.addEventListener('focusout', hideSoon, { passive: true });
  var tries = 0; var iv = setInterval(function () { if (ensure()) clearInterval(iv); else if (++tries > 90) clearInterval(iv); }, 800);
})();
