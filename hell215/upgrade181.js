/* hl181-invocation — THE INVOCATION: press "/" anywhere to summon the composer, Esc to dismiss it; a one-time gold seal teaches the word */
(function () {
  if (window.__HL181) return; window.__HL181 = 1;
  var css = document.createElement('style');
  css.id = 'hl181-style';
  css.textContent = [
    '#hl181-hint{position:fixed;left:50%;bottom:118px;transform:translateX(-50%) translateY(14px);',
    'background:linear-gradient(135deg,#14100a,#0c0a06);border:1px solid rgba(198,166,77,.55);',
    'color:#c6a64d;font:600 11px/1.4 Georgia,"Times New Roman",serif;letter-spacing:.14em;',
    'padding:9px 16px;border-radius:2px;z-index:2147483000;pointer-events:none;opacity:0;',
    'transition:opacity .5s ease,transform .5s ease;box-shadow:0 0 22px rgba(0,0,0,.75),0 0 10px rgba(198,166,77,.18);',
    'text-transform:uppercase;white-space:nowrap;max-width:92vw;overflow:hidden;text-overflow:ellipsis;}',
    '#hl181-hint.on{opacity:1;transform:translateX(-50%) translateY(0);}',
    '#hl181-hint .hl181-k{display:inline-block;border:1px solid rgba(198,166,77,.7);border-radius:3px;',
    'padding:1px 6px;margin:0 4px;font-size:11px;background:rgba(198,166,77,.08);}'
  ].join('');
  (document.head || document.documentElement).appendChild(css);
  var shown = false, hid = false;
  function focusComposer() {
    var tas = document.querySelectorAll('textarea');
    for (var i = 0; i < tas.length; i++) {
      var r = tas[i].getBoundingClientRect();
      if (r.width > 40 && r.height > 16) { tas[i].focus(); return true; }
    }
    var ces = document.querySelectorAll('[contenteditable="true"]');
    for (var j = 0; j < ces.length; j++) {
      var cr = ces[j].getBoundingClientRect();
      if (cr.width > 40 && cr.height > 16) { ces[j].focus(); return true; }
    }
    return false;
  }
  function showHint() {
    if (shown || hid) return; shown = true;
    var h = document.createElement('div');
    h.id = 'hl181-hint';
    h.innerHTML = 'Press <span class="hl181-k">/</span> to speak';
    document.body.appendChild(h);
    setTimeout(function () { h.classList.add('on'); }, 60);
    setTimeout(function () {
      h.classList.remove('on');
      setTimeout(function () { if (h.parentNode) h.parentNode.removeChild(h); }, 600);
    }, 4200);
  }
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var tag = (e.target && e.target.tagName || '').toLowerCase();
    var typing = tag === 'input' || tag === 'textarea' || (e.target && e.target.isContentEditable);
    if (e.key === '/' && !typing) {
      if (focusComposer()) { e.preventDefault(); if (shown) hid = true; }
    } else if (e.key === 'Escape' && !typing) {
      var ae = document.activeElement;
      if (ae && (ae.tagName === 'TEXTAREA' || ae.isContentEditable)) ae.blur();
    }
  }, true);
  function boot() {
    if (!document.body) return;
    setTimeout(showHint, 9000);
    if (window.__HL181_IV) clearInterval(window.__HL181_IV);
  }
  window.__HL181_IV = setInterval(function () { if (document.body) boot(); }, 1500);
  setTimeout(function () { if (window.__HL181_IV) clearInterval(window.__HL181_IV); }, 120000);
})();
