/* ILLUMINATI upgrade #227: hl227-copyall (v19.128)
   Answers carrying two or more code blocks get a COPY ALL CODE button on their
   action row: one tap copies every block, stitched in order. Additive.
   Guard: __HL227 */
(function () {
  if (window.__HL227) return; window.__HL227 = true;
  function add(row) {
    if (row.dataset.hl227 === '1') return;
    var lbody = row.parentElement && row.parentElement.querySelector('.lbody');
    if (!lbody) return;
    var blocks = lbody.querySelectorAll('.hlblock');
    if (blocks.length < 2) return;
    row.dataset.hl227 = '1';
    var b = document.createElement('button'); b.type = 'button'; b.className = 'hbtn'; b.textContent = '[COPY ALL]';
    b.addEventListener('click', function (ev) {
      ev.preventDefault(); ev.stopPropagation();
      var out = [];
      for (var i = 0; i < blocks.length; i++) { var pre = blocks[i].querySelector('pre.hlpre'); if (pre) out.push(pre.textContent); }
      if (window.hl221copy) window.hl221copy(out.join('\n\n'));
      b.textContent = '[COPIED]'; setTimeout(function () { b.textContent = '[COPY ALL]'; }, 1200);
    });
    row.appendChild(b);
  }
  var chat = null, obs = null;
  function sweep() {
    if (!chat || document.body.classList.contains('pre')) return;
    var rs = chat.querySelectorAll('.arow');
    for (var i = 0; i < rs.length; i++) { try { add(rs[i]); } catch (e) {} }
  }
  function arm() {
    var c = document.getElementById('chat');
    if (!c) return;
    if (c !== chat) { chat = c; if (obs) obs.disconnect(); obs = new MutationObserver(sweep); obs.observe(c, { childList: true, subtree: true }); }
    sweep();
  }
  arm(); setInterval(arm, 2000);
  try { console.log('[hl227] online: COPY ALL CODE on multi-block answers'); } catch (e) {}
})();
