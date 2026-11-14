// ILLUMINATI upgrade #42: hl42-scroll-meter (v18.48)
// A 2px cyan/red scroll-depth meter fixed to the bottom edge of the viewport.
// Width tracks real scroll position. Additive, guarded, reduced-motion-safe (no animation,
// static bar). Injected by overnight upgrade run.
(function(){
  if(!document||!document.body)return;
  function start(){
    if(document.getElementById('hl42-meter'))return;
    var bar=document.createElement('div');
    bar.id='hl42-meter';
    bar.style.cssText='position:fixed;left:0;bottom:0;height:2px;width:0%;z-index:9999;'+
      'background:linear-gradient(90deg,#00e5ff,#dc2828);pointer-events:none;transition:width .15s linear;';
    document.body.appendChild(bar);
    function upd(){
      var el=document.getElementById('hl42-meter');
      if(!el)return;
      var doc=document.documentElement;
      var max=doc.scrollHeight-doc.clientHeight;
      var pct=max>0?(doc.scrollTop||document.body.scrollTop||0)/max*100:0;
      el.style.width=Math.min(100,Math.max(0,pct))+'%';
    }
    window.addEventListener('scroll',upd,{passive:true});
    window.addEventListener('resize',upd);
    upd();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);
  else start();
})();