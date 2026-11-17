/* ILLUMINATI upgrade #226: hl226-countchip (v19.128)
   Every code block head grows a count chip: python . 42 LINES. Additive on
   hl221 blocks. Guard: __HL226 */
(function () {
  if (window.__HL226) return; window.__HL226 = true;
  function add(blk) {
    if (blk.dataset.hl226 === '1') return;
    var lab = blk.querySelector('.hllang');
    var pre = blk.querySelector('pre.hlpre');
    if (!lab || !pre) return;
    blk.dataset.hl226 = '1';
    var lines = (pre.textContent.match(/\n/g) || []).length + 1;
    var lang = blk.dataset.hllang || 'code';
    lab.textContent = lang + ' \u00b7 ' + lines + ' LINES';
  }
  var chat = null, obs = null;
  function sweep() {
    if (!chat || document.body.classList.contains('pre')) return;
    var bs = chat.querySelectorAll('.hlblock');
    for (var i = 0; i < bs.length; i++) { try { add(bs[i]); } catch (e) {} }
  }
  function arm() {
    var c = document.getElementById('chat');
    if (!c) return;
    if (c !== chat) { chat = c; if (obs) obs.disconnect(); obs = new MutationObserver(sweep); obs.observe(c, { childList: true, subtree: true }); }
    sweep();
  }
  arm(); setInterval(arm, 2000);
  try { console.log('[hl226] online: line counts on code blocks'); } catch (e) {}
})();
