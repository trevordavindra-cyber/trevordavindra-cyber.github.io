// ILLUMINATI upgrade #27: hl27-fps-chip (v18.33)
// Tiny FPS meter chip in the bottom-right corner, real measured frames per second.
// Additive, guarded, reduced-motion-safe. Injected by overnight upgrade run.
(function(){
  if(!document||!document.body)return;
  function start(){
    if(document.getElementById('hl27-fps'))return;
    var chip=document.createElement('div');
    chip.id='hl27-fps';
    chip.style.cssText='position:fixed;right:24px;bottom:24px;z-index:9995;font-family:monospace;font-size:9px;'+
      'letter-spacing:1px;color:rgba(0,229,255,.7);background:rgba(0,0,0,.5);border:1px solid rgba(0,229,255,.2);'+
      'border-radius:4px;padding:2px 6px;pointer-events:none;';
    chip.textContent='FPS —';
    document.body.appendChild(chip);
    var frames=0,last=performance.now();
    function loop(t){
      frames++;
      if(t-last>=1000){
        var el=document.getElementById('hl27-fps');
        if(el)el.textContent='FPS '+frames;
        frames=0;last=t;
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);
  else start();
})();