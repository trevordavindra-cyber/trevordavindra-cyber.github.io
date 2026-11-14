// ILLUMINATI upgrade #30: hl30-mouse-glow (v18.36)
// A soft cyan spotlight follows the cursor at low opacity, purely decorative.
// Additive, guarded, disabled under prefers-reduced-motion. Injected by overnight upgrade run.
(function(){
  if(!document||!document.body)return;
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var d=document,g=document.createElement('div');
  g.id='hl30-glow';
  g.style.cssText='position:fixed;left:0;top:0;width:320px;height:320px;margin:-160px 0 0 -160px;border-radius:50%;'+
    'pointer-events:none;z-index:0;background:radial-gradient(circle,rgba(0,229,255,.10) 0%,rgba(0,229,255,.05) 40%,transparent 70%);'+
    'transition:transform .18s ease-out;mix-blend-mode:screen;';
  document.body.appendChild(g);
  var raf=null;
  document.addEventListener('mousemove',function(e){
    if(raf)return;
    raf=requestAnimationFrame(function(){
      g.style.transform='translate('+e.clientX+'px,'+e.clientY+'px)';
      raf=null;
    });
  },{passive:true});
})();