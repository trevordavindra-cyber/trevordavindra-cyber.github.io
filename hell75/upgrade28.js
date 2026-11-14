// ILLUMINATI upgrade #28: hl28-gate-starfall (v18.34)
// Easter egg: double-clicking the gate sigil triggers a brief starfall behind the gate screen.
// Additive, guarded, prefers-reduced-motion respected (stars render static, no animation). Injected by overnight upgrade run.
(function(){
  if(!document||!document.body)return;
  var style=document.createElement('style');
  style.textContent='.hl28-star{position:fixed;width:2px;height:2px;border-radius:50%;background:#fff;pointer-events:none;z-index:9998;box-shadow:0 0 4px rgba(255,255,255,.8);}@media (prefers-reduced-motion:reduce){.hl28-star{animation:none!important;opacity:.3}}@keyframes hl28fall{0%{transform:translateY(0);opacity:1}100%{transform:translateY(120vh);opacity:0}}';
  document.head.appendChild(style);
  var gate=document.getElementById('gate');
  if(!gate)return;
  var sigil=gate.querySelector('svg.sigil')||gate.querySelector('svg');
  if(!sigil)return;
  var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lastTap=0;
  sigil.addEventListener('dblclick',function(e){
    e.preventDefault();
    var now=Date.now();
    if(now-lastTap<400)return;
    lastTap=now;
    for(var i=0;i<24;i++){
      var s=document.createElement('div');
      s.className='hl28-star';
      s.style.left=(Math.random()*100)+'vw';
      s.style.top=(-10-Math.random()*20)+'vh';
      if(!RM){
        s.style.animation='hl28fall '+(1.2+Math.random()*1.4)+'s linear forwards';
        setTimeout(function(el){return function(){if(el.parentNode)el.parentNode.removeChild(el);};}(s),2800);
      }
      document.body.appendChild(s);
    }
  });
})();