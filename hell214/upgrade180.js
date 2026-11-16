/* hl180-oathkeeper — THE OATHKEEPER: the page asks for confirmation before closing while an unspoken word still sits in the composer */
(function () {
  if (window.__HL180) return; window.__HL180 = 1;
  var armed = false, iv = null;
  function dirty() {
    var tas = document.querySelectorAll('textarea');
    for (var i = 0; i < tas.length; i++) {
      var v = (tas[i].value || '').trim();
      if (v) return true;
    }
    var ces = document.querySelectorAll('[contenteditable="true"]');
    for (var j = 0; j < ces.length; j++) {
      var t = (ces[j].textContent || '').trim();
      if (t) return true;
    }
    return false;
  }
  function rearm() {
    var need = dirty();
    if (need && !armed) { armed = true; window.addEventListener('beforeunload', guard); }
    else if (!need && armed) { armed = false; window.removeEventListener('beforeunload', guard); }
  }
  function guard(e) {
    if (dirty()) { e.preventDefault(); e.returnValue = ''; return ''; }
  }
  function start() {
    document.addEventListener('input', rearm, true);
    rearm();
    if (iv) clearInterval(iv);
  }
  iv = setInterval(function () { if (document.body) { start(); } }, 1500);
  setTimeout(function () { if (iv) clearInterval(iv); }, 120000);
})();
