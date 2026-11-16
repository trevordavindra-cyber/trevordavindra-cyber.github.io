/* hl162-echo — THE ECHO CHAMBER: press ArrowUp on an empty composer to recall your last sent prompts, cycle back through them, ArrowDown to move forward, Esc to let go */
(function () {
  if (window.__HL162) return; window.__HL162 = 1;
  var css = ".hl162-toast{position:fixed;left:50%;bottom:118px;transform:translateX(-50%);z-index:9700;pointer-events:none;background:rgba(8,8,8,.92);border:1px solid rgba(197,164,91,.5);border-radius:3px;color:rgba(212,175,98,.92);font:600 8px 'JetBrains Mono',monospace;letter-spacing:.2em;padding:5px 9px;text-shadow:0 0 6px rgba(197,164,91,.35);opacity:0;transition:opacity .3s ease;white-space:nowrap}.hl162-toast.hl162-on{opacity:1}@media (max-width:640px){.hl162-toast{bottom:104px;font-size:7px}}";
  var st = document.createElement('style'); st.id = 'hl162-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var toast = null, toastTimer = null;
  var history = [], idx = -1, cycling = false;
  function ensureToast() {
    if (toast || !document.body) return false;
    toast = document.createElement('div');
    toast.className = 'hl162-toast';
    toast.setAttribute('aria-hidden', 'true');
    document.body.appendChild(toast);
    return true;
  }
  function showToast(text) {
    if (!ensureToast()) return;
    toast.textContent = text;
    toast.classList.add('hl162-on');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('hl162-on'); }, 1500);
  }
  function stop() { cycling = false; idx = -1; }
  document.addEventListener('keydown', function (ev) {
    var ta = ev.target;
    if (!ta || ta.tagName !== 'TEXTAREA') return;
    if (ev.key === 'Enter' && !ev.shiftKey) {
      var v = (ta.value || '').trim();
      if (v && history[history.length - 1] !== v) {
        history.push(v);
        if (history.length > 50) history.shift();
      }
      stop();
      return;
    }
    if (ev.key === 'ArrowUp' && !(ta.value || '').length && history.length) {
      if (!cycling) { cycling = true; idx = history.length; }
      if (idx > 0) {
        idx--;
        ta.value = history[idx];
        ev.preventDefault();
        showToast('ECHO ' + (idx + 1) + '/' + history.length);
      } else {
        showToast('ECHO FIRST');
      }
      return;
    }
    if (ev.key === 'ArrowDown' && cycling) {
      if (idx < history.length - 1) {
        idx++;
        ta.value = history[idx];
        showToast('ECHO ' + (idx + 1) + '/' + history.length);
      } else {
        ta.value = '';
        showToast('ECHO CLEARED');
        stop();
      }
      ev.preventDefault();
      return;
    }
    if (ev.key === 'Escape' && cycling) {
      stop();
      showToast('ECHO RELEASED');
    }
  });
  var tries = 0; var iv = setInterval(function () { if (ensureToast()) clearInterval(iv); else if (++tries > 90) clearInterval(iv); }, 800);
})();
