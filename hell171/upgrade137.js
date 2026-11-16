/* hl137: reply-rise - messages glide in with a brief gold edge-glow */
(function () {
  if (window.__HL137) return; window.__HL137 = true;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var css = "@keyframes hl137rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes hl137glow{0%{box-shadow:0 0 0 rgba(201,168,79,0)}30%{box-shadow:0 0 18px rgba(201,168,79,.35)}100%{box-shadow:0 0 0 rgba(201,168,79,0)}}.hl137-in{animation:hl137rise .5s cubic-bezier(.2,.7,.3,1) both}.hl137-glow{animation:hl137glow 1.4s ease-out both}";
  var st = document.createElement('style'); st.id = 'hl137-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var feed = document.getElementById('feedlist') || document.getElementById('chat');
  if (!feed) return;
  function mark(el) {
    if (!el || el.nodeType !== 1 || el.dataset.hl137) return;
    el.dataset.hl137 = '1';
    el.classList.add('hl137-in');
    el.classList.add('hl137-glow');
  }
  new MutationObserver(function (muts) {
    muts.forEach(function (m) {
      for (var i = 0; i < m.addedNodes.length; i++) mark(m.addedNodes[i]);
    });
  }).observe(feed, { childList: true, subtree: false });
})();
