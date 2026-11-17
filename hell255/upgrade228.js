/* ILLUMINATI upgrade #228: hl228-wrapkey (v19.128)
   WRAP toggle on every code block head: flips the block between no-wrap
   (scroll sideways) and soft-wrap so long lines can be read on a phone.
   Additive. Guard: __HL228 */
(function () {
  if (window.__HL228) return; window.__HL228 = true;
  function add(head) {
    if (head.dataset.hl228 === '1') return;
    var blk = head.parentElement;
    var pre = blk && blk.querySelector('pre.hlpre');
    if (!pre) return;
    head.dataset.hl228 = '1';
    var b = document.createElement('button'); b.type = 'button'; b.className = 'hlbtn'; b.textContent = 'WRAP';
    b.addEventListener('click', function (ev) {
      ev.preventDefault(); ev.stopPropagation();
      var wrapped = pre.style.whiteSpace === 'pre-wrap';
      pre.style.whiteSpace = wrapped ? 'pre' : 'pre-wrap';
      pre.style.overflowX = wrapped ? 'auto' : 'hidden';
      pre.style.wordBreak = wrapped ? 'normal' : 'break-all';
      b.textContent = wrapped ? 'WRAP' : 'UNWRAP';
    });
    var lab = head.querySelector('.hllang');
    if (lab && lab.nextSibling) head.insertBefore(b, lab.nextSibling); else head.appendChild(b);
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
  try { console.log('[hl228] online: WRAP toggle on code blocks'); } catch (e) {}
})();
