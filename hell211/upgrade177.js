/* hl177-scribe — THE SCRIBE: select any words in the record and a gold quill-chip appears to copy them at once */
(function () {
  if (window.__HL177) return; window.__HL177 = 1;
  var css = "#hl177-scribe{position:fixed;z-index:9300;display:none;background:#0d0b07;border:1px solid rgba(216,180,90,.55);color:#d8b45a;font:10px/1 'Courier New',monospace;letter-spacing:.14em;padding:7px 12px;border-radius:2px;cursor:pointer;box-shadow:0 4px 18px rgba(0,0,0,.6),0 0 14px rgba(216,180,90,.12);text-transform:uppercase;transition:opacity .15s ease,transform .15s ease;user-select:none;-webkit-user-select:none}#hl177-scribe::before{content:'\u2712';margin-right:6px;font-size:11px}#hl177-scribe:hover{background:#171208;border-color:rgba(216,180,90,.9)}#hl177-toast{position:fixed;left:50%;bottom:96px;transform:translateX(-50%) translateY(8px);background:#0d0b07;border:1px solid rgba(216,180,90,.6);color:#d8b45a;font:10px/1.4 'Courier New',monospace;letter-spacing:.12em;padding:9px 16px;border-radius:2px;z-index:9400;opacity:0;pointer-events:none;transition:opacity .3s ease,transform .3s ease;text-transform:uppercase;white-space:nowrap;box-shadow:0 4px 18px rgba(0,0,0,.6)}#hl177-toast.on{opacity:1;transform:translateX(-50%) translateY(0)}";
  var st = document.createElement('style'); st.id = 'hl177-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var chip = null, toast = null, lastSel = '', hideT = null, toastT = null;
  function ensure() {
    if (!document.body) return false;
    if (!chip) {
      chip = document.createElement('div'); chip.id = 'hl177-scribe'; chip.textContent = 'SCRIBE \u00b7 COPY';
      document.body.appendChild(chip);
      toast = document.createElement('div'); toast.id = 'hl177-toast'; document.body.appendChild(toast);
      chip.addEventListener('pointerdown', function (e) { e.preventDefault(); e.stopPropagation(); });
      chip.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        var t = lastSel; chip.style.display = 'none';
        if (!t) return;
        function done() {
          toast.textContent = '\u2712 ' + (t.length > 32 ? t.slice(0, 32) + '\u2026 ' : '') + 'COPIED TO THE ARCHIVE';
          toast.classList.add('on');
          clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove('on'); }, 2600);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(t).then(done, done); }
        else {
          try { var ta = document.createElement('textarea'); ta.value = t; ta.style.cssText = 'position:fixed;left:-9999px'; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); } catch (err) {}
          done();
        }
      });
    }
    return true;
  }
  function show() {
    if (!ensure()) return;
    var sel = window.getSelection && window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) { chip.style.display = 'none'; return; }
    var txt = String(sel).trim();
    if (!txt) { chip.style.display = 'none'; return; }
    lastSel = txt;
    var r = sel.getRangeAt(0).getBoundingClientRect();
    var top = r.top - 40, left = r.left + r.width / 2 - 52;
    if (top < 8) top = r.bottom + 10;
    if (top > window.innerHeight - 40) top = window.innerHeight - 40;
    if (left < 8) left = 8;
    if (left > window.innerWidth - 120) left = window.innerWidth - 120;
    chip.style.top = top + 'px'; chip.style.left = left + 'px';
    chip.style.display = 'block';
    clearTimeout(hideT); hideT = setTimeout(function () { chip.style.display = 'none'; }, 6000);
  }
  function arm() {
    document.addEventListener('mouseup', function () { setTimeout(show, 30); });
    document.addEventListener('touchend', function () { setTimeout(show, 250); }, { passive: true });
    document.addEventListener('selectionchange', function () {
      if (chip && window.getSelection && window.getSelection().isCollapsed) chip.style.display = 'none';
    });
    window.addEventListener('scroll', function () { if (chip) chip.style.display = 'none'; }, true);
  }
  var iv = setInterval(function () { if (document.body) { ensure(); arm(); clearInterval(iv); } }, 600);
})();
