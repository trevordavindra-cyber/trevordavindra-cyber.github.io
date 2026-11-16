/* hl183-oration — THE ORATION: every new word the Order speaks rises into the record with a slow gold dawn; nothing already on the page re-animates */
(function () {
  if (window.__HL183) return; window.__HL183 = 1;
  var css = document.createElement('style');
  css.id = 'hl183-style';
  css.textContent = [
    '@keyframes hl183-rise{0%{opacity:0;transform:translateY(12px) scale(.985);filter:brightness(1.35);}60%{opacity:1;filter:brightness(1.06);}100%{opacity:1;transform:none;filter:none;}}',
    '.hl183-in{animation:hl183-rise .65s cubic-bezier(.22,.61,.36,1) both;}',
    '@media (prefers-reduced-motion: reduce){.hl183-in{animation:none;}}'
  ].join('');
  (document.head || document.documentElement).appendChild(css);
  var host = null;
  function mark(node) {
    if (!node || node.nodeType !== 1) return;
    if (node.dataset.hl183seen) return;
    node.dataset.hl183seen = '1';
    node.classList.add('hl183-in');
  }
  function boot() {
    host = document.getElementById('chat');
    if (!host) return false;
    for (var i = 0; i < host.children.length; i++) {
      host.children[i].dataset.hl183seen = '1';
    }
    var mo = new MutationObserver(function (muts) {
      for (var j = 0; j < muts.length; j++) {
        var nodes = muts[j].addedNodes;
        for (var k = 0; k < nodes.length; k++) {
          var n = nodes[k];
          if (n.nodeType === 1 && host.contains(n)) mark(n);
        }
      }
    });
    mo.observe(host, { childList: true, subtree: true });
    return true;
  }
  window.__HL183_IV = setInterval(function () { if (boot()) clearInterval(window.__HL183_IV); }, 1500);
  setTimeout(function () { if (window.__HL183_IV) clearInterval(window.__HL183_IV); }, 120000);
})();
