/* ILLUMINATI upgrade #223: hl223-savetab (v19.128)
   SAVE on every code block: downloads the block as a real file with the right
   extension (python -> .py, html -> .html, ...). Additive. Guard: __HL223 */
(function () {
  if (window.__HL223) return; window.__HL223 = true;
  var n = 0;
  function add(head) {
    if (head.dataset.hl223 === '1') return;
    var blk = head.parentElement;
    var pre = blk && blk.querySelector('pre.hlpre');
    if (!pre) return;
    head.dataset.hl223 = '1';
    var lang = (blk.dataset.hllang || 'code');
    var b = document.createElement('button'); b.type = 'button'; b.className = 'hlbtn'; b.textContent = 'SAVE';
    b.addEventListener('click', function (ev) {
      ev.preventDefault(); ev.stopPropagation(); n++;
      var name = 'illuminati-' + n + '.' + (window.hl221ext ? window.hl221ext(lang) : 'txt');
      try {
        var blob = new Blob([pre.textContent], { type: 'text/plain' });
        var u = URL.createObjectURL(blob);
        var a = document.createElement('a'); a.href = u; a.download = name;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(u); }, 3000);
      } catch (e) {}
      b.textContent = 'SAVED'; setTimeout(function () { b.textContent = 'SAVE'; }, 1200);
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
  try { console.log('[hl223] online: SAVE on every code block'); } catch (e) {}
})();
