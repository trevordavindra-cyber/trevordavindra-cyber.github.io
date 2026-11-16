/* ILLUMINATI upgrade #135 - hl135-thinkglow (v19.42)
   While the AI is generating, the send row breathes with a slow gold glow and
   the [SEND] button carries a passing shimmer; when the answer settles the row
   dims back. Reduced motion respected. Removes nothing. */
(function () {
  if (window.__HL135) return; window.__HL135 = 1;
  var css = [
    '.hl135-row{transition:box-shadow 1.2s ease;}',
    'body.hl135-busy .hl135-row{animation:hl135-glow 2.4s ease-in-out infinite;}',
    '@keyframes hl135-glow{0%,100%{box-shadow:0 0 0 rgba(212,175,55,0);}50%{box-shadow:0 0 22px rgba(212,175,55,.30);}}',
    'body.hl135-busy #send{position:relative;overflow:hidden;}',
    'body.hl135-busy #send::after{content:"";position:absolute;inset:0;background:linear-gradient(105deg,rgba(212,175,55,0) 35%,rgba(212,175,55,.38) 50%,rgba(212,175,55,0) 65%);transform:translateX(-130%);animation:hl135-shimmer 1.7s linear infinite;pointer-events:none;}',
    '@keyframes hl135-shimmer{to{transform:translateX(130%);}}',
    'body.hl135-busy #stop{animation:hl135-stoppulse 1.4s ease-in-out infinite;}',
    '@keyframes hl135-stoppulse{0%,100%{opacity:.85;}50%{opacity:1;}}',
    '@media (prefers-reduced-motion: reduce){body.hl135-busy .hl135-row{animation:none;}body.hl135-busy #send::after{display:none;}body.hl135-busy #stop{animation:none;}}'
  ].join('\n');
  var st = document.createElement('style'); st.id = 'hl135-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  function busy() {
    var send = document.getElementById('send');
    var stop = document.getElementById('stop');
    var b = false;
    if (stop) b = b || (!stop.classList.contains('hidden') && stop.offsetParent !== null);
    if (send) b = b || send.disabled === true;
    if (document.body.classList.contains('hl135-busy') !== b) document.body.classList.toggle('hl135-busy', b);
  }
  function attach() {
    var send = document.getElementById('send');
    if (!send) { setTimeout(attach, 400); return; }
    var row = send.parentElement;
    if (row && !row.classList.contains('hl135-row')) row.classList.add('hl135-row');
    busy();
    var mo = new MutationObserver(busy);
    mo.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['disabled', 'class', 'style'] });
  }
  attach();
})();
