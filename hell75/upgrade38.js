// ILLUMINATI upgrade #38: hl38-click-ripple (v18.44)
// Subtle cyan ripple on every click, expansion only, nothing moved.
// Additive, guarded, respects prefers-reduced-motion. Injected by overnight upgrade run.
(function(){
  if(!document||!document.body)return;
  var style=document.createElement('style');
  style.textContent='.hl38-ripple{position:fixed;border:2px solid rgba(0,229,255,.5);border-radius:50%;pointer-events:none;z-index:99998;animation:hl38-ripple .6s ease-out forwards;}@keyframes hl38-ripple{0%{width:0;height:0;opacity:.6;}100%{width:120px;height:120px;opacity:0;}}@media (prefers-reduced-motion:reduce){.hl38-ripple{display:none}}';
  document.head.appendChild(style);
  document.addEventListener('click',function(e){
    if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    var r=document.createElement('span');
    r.className='hl38-ripple';
    r.style.left=(e.clientX-60)+'px';
    r.style.top=(e.clientY-60)+'px';
    document.body.appendChild(r);
    setTimeout(function(){if(r.parentNode)r.parentNode.removeChild(r);},700);
  },true);
})();