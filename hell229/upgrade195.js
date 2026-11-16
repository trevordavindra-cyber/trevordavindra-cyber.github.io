/* ILLUMINATI upgrade #195: hl195-restore (v19.102)
   RESTORE TOUCH. Fixes the dead menu: the burger is always tappable, a stuck
   boot state can no longer leave the app untouchable, and any full-screen
   veil/scrim left on without its drawer is swept closed. Double-tap the menu
   button to force-close every overlay at once. Purely additive. Guard: __HL195 */
(function () {
  if (window.__HL195) return; window.__HL195 = true;
  var CSS = [
    '#ordmenu{pointer-events:auto!important}',
    'body.ord-nav #nav{pointer-events:auto!important}',
    '#hl188-drawer:not(.on){pointer-events:none!important}',
    '.hl155-drawer:not(.on){pointer-events:none!important}'
  ].join('\n');
  var st = document.createElement('style'); st.id = 'hl195-style'; st.textContent = CSS;
  (document.head || document.documentElement).appendChild(st);

  function veilStuck() {
    var pairs = [['hl188-veil', 'hl188-drawer'], ['hl187-veil', 'hl187-drawer']];
    for (var i = 0; i < pairs.length; i++) {
      var v = document.getElementById(pairs[i][0]);
      var d = document.getElementById(pairs[i][1]);
      if (v && v.classList.contains('on')) {
        if (!d || !d.classList.contains('on')) { v.classList.remove('on'); return true; }
      }
    }
    var s = document.querySelector('.hl155-scrim');
    var sd = document.querySelector('.hl155-drawer');
    if (s && s.classList.contains('on')) {
      if (!sd || !sd.classList.contains('on')) { s.classList.remove('on'); return true; }
    }
    return false;
  }
  function bootStuck() {
    if (document.getElementById('hl124')) return false;
    var g = document.getElementById('gate');
    if (g) { var cs = getComputedStyle(g); if (cs.display !== 'none' && cs.opacity !== '0' && cs.pointerEvents !== 'none') return false; }
    if (document.body.classList.contains('pre')) { document.body.classList.remove('pre'); return true; }
    return false;
  }
  function breakGlass() {
    var ids = ['hl188-veil', 'hl188-drawer', 'hl187-veil', 'hl187-drawer'];
    for (var i = 0; i < ids.length; i++) { var e = document.getElementById(ids[i]); if (e) e.classList.remove('on'); }
    var q = document.querySelectorAll('.hl155-scrim,.hl155-drawer,.hl150-ov');
    for (var j = 0; j < q.length; j++) q[j].classList.remove('on');
    document.body.classList.remove('ord-nav', 'pre');
  }
  setInterval(function () { bootStuck(); veilStuck(); }, 700);

  var lastTap = 0;
  document.addEventListener('click', function (e) {
    var m = e.target && e.target.closest ? e.target.closest('#ordmenu') : null;
    if (!m) return;
    var now = Date.now();
    if (now - lastTap < 550) { breakGlass(); lastTap = 0; }
    else lastTap = now;
  }, true);
})();
