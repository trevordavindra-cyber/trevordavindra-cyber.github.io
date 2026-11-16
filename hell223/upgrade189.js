/* hl189-recall — THE RECALL: terminal-style prompt memory. Enter with a question saves it; ArrowUp on an empty composer draws the last question back; repeated ArrowUp walks further back through the session's questions while the restored text still stands. Real keystrokes (trusted input) reset the walk; the restore's own synthetic input event does not. ArrowUp never hijacks a composer holding user-typed text */
(function () {
  if (window.__HL189) return; window.__HL189 = 1;
  var hist = [];
  var MAX = 30;
  var idx = -1;
  var holding = false;
  function composer() {
    var tas = Array.prototype.filter.call(document.querySelectorAll('textarea'), function (t) {
      return t.offsetParent !== null || getComputedStyle(t).display !== 'none';
    });
    if (!tas.length) return null;
    tas.sort(function (a, b) { return (b.clientHeight || 0) - (a.clientHeight || 0); });
    return tas[0];
  }
  document.addEventListener('keydown', function (e) {
    var ta = composer();
    if (!ta) return;
    if (e.target !== ta && !ta.contains(e.target)) return;
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
      var v = (ta.value || '').trim();
      if (v && (hist.length === 0 || hist[hist.length - 1] !== v)) {
        hist.push(v);
        if (hist.length > MAX) hist.shift();
      }
      holding = false; idx = -1;
      return;
    }
    if (e.key === 'ArrowUp' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      if (!hist.length) return;
      var cur = (ta.value || '');
      if (holding) { idx = Math.min(idx + 1, hist.length - 1); }
      else {
        if (cur.trim()) return;
        idx = 0;
      }
      e.preventDefault();
      holding = true;
      var restored = hist[hist.length - 1 - idx];
      ta.value = restored;
      try { ta.dispatchEvent(new Event('input', { bubbles: true })); } catch (err) {}
      try {
        ta.focus();
        if (typeof ta.setSelectionRange === 'function') ta.setSelectionRange(restored.length, restored.length);
      } catch (err) {}
    }
  }, true);
  document.addEventListener('input', function (e) {
    if (!e.isTrusted) return; /* the recall's own synthetic refill never resets the walk */
    var ta = composer();
    if (ta && e.target === ta && (ta.value || '').trim()) { holding = false; idx = -1; }
  }, true);
})();
