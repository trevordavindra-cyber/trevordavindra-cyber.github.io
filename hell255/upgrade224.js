/* ILLUMINATI upgrade #224: hl224-liverun (v19.128)
   RUN on code blocks that can run whole: complete HTML pages and standalone
   JS. Opens the code in a fresh sandboxed window, no server needed. Additive.
   Guard: __HL224 */
(function () {
  if (window.__HL224) return; window.__HL224 = true;
  function add(head) {
    if (head.dataset.hl224 === '1') return;
    var blk = head.parentElement;
    var pre = blk && blk.querySelector('pre.hlpre');
    if (!pre) return;
    var lang = blk.dataset.hllang || '';
    var t = pre.textContent || '';
    var isHtml = lang === 'html' || /<html[\s>]/i.test(t) || /<!doctype/i.test(t);
    var isJs = lang === 'javascript' || lang === 'js';
    if (isJs && !/(document|window|console|alert|fetch)\./.test(t) && !/<canvas|addEventListener/.test(t)) return;
    if (!isHtml && !isJs) return;
    head.dataset.hl224 = '1';
    var b = document.createElement('button'); b.type = 'button'; b.className = 'hlbtn'; b.textContent = 'RUN';
    b.addEventListener('click', function (ev) {
      ev.preventDefault(); ev.stopPropagation();
      var src = isHtml ? t : ('<!doctype html><html><head><meta charset="utf-8"></head><body><script type="text/javascript">' + t + '<\/script></body></html>');
      try {
        var blob = new Blob([src], { type: 'text/html' });
        var u = URL.createObjectURL(blob);
        window.open(u, '_blank');
        setTimeout(function () { URL.revokeObjectURL(u); }, 20000);
      } catch (e) { b.textContent = 'NO'; setTimeout(function () { b.textContent = 'RUN'; }, 1200); }
    });
    head.appendChild(b);
  }
  var chat = null, obs = null;
  function sweep() {
    if (!chat || document.body.classList.contains('pre')) return;
    var hs = chat.querySelectorAll('.hlhead');
    for (var i = 0; i < hs.length; i++) { try { add(hs[i]); } catch (e) {} }
  }
  function arm() {
    var c = document.getElementById('chat');
    if (!c) return;
    if (c !== chat) { chat = c; if (obs) obs.disconnect(); obs = new MutationObserver(sweep); obs.observe(c, { childList: true, subtree: true }); }
    sweep();
  }
  arm(); setInterval(arm, 2000);
  try { console.log('[hl224] online: RUN on runnable code blocks'); } catch (e) {}
})();
