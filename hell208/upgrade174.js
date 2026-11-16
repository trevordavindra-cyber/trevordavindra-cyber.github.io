/* hl174-archivist — THE ARCHIVIST: words left unsent are preserved across the veil; return and find them waiting */
(function () {
  if (window.__HL174) return; window.__HL174 = 1;
  var css = "#hl174-toast{position:fixed;left:50%;transform:translateX(-50%);bottom:96px;z-index:9400;background:rgba(10,8,4,.92);color:#d8b45a;border:1px solid rgba(216,180,90,.45);font:11px/1.4 Georgia,'Times New Roman',serif;letter-spacing:.12em;text-transform:uppercase;padding:8px 14px;border-radius:2px;opacity:0;transition:opacity .6s ease;pointer-events:none;max-width:86vw;text-align:center}#hl174-toast.on{opacity:1}";
  var st = document.createElement('style'); st.id = 'hl174-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var KEY = 'hl174-draft-', timers = {}, toastEl = null, toastTimer = null;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.id = 'hl174-toast'; document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add('on');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.classList.remove('on'); }, 3200);
  }
  function hook(ta, i) {
    if (!ta || ta.__hl174hook) return; ta.__hl174hook = 1;
    var v = ta.value || '';
    var saved = '';
    try { saved = localStorage.getItem(KEY + i) || ''; } catch (e) {}
    if (saved && !v) {
      ta.value = saved;
      try { ta.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) {}
      toast('THE ARCHIVIST · UNSPOKEN WORDS PRESERVED');
    }
    ta.addEventListener('input', function () {
      clearTimeout(timers[i]);
      timers[i] = setTimeout(function () {
        try {
          if (ta.value && ta.value.trim()) localStorage.setItem(KEY + i, ta.value);
          else localStorage.removeItem(KEY + i);
        } catch (e) {}
      }, 400);
    });
  }
  function scan() {
    var tas = document.querySelectorAll('textarea');
    for (var i = 0; i < Math.min(tas.length, 6); i++) hook(tas[i], i);
  }
  scan(); setInterval(scan, 1500);
})();
