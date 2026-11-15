// ILLUMINATI upgrade #89: hl89-fps-omen (v18.97)
// A left-edge chip showing the real measured frame rate: "FPS 60" —
// frames counted over each second via requestAnimationFrame, smoothed
// over a 3-second window, settling dark when the tab is hidden (rAF
// pauses) and waking again on return. Pure display, no listeners.
// __HL89 guard.
(function(){
  try{
    if(window.__HL89) return; window.__HL89=1;
    var el=document.createElement('div');
    el.id='hl89-fps'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:506px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(255,140,120,.4);text-shadow:0 0 6px rgba(255,100,80,.18);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    var frames=0, last=0, hist=[], raf;
    function loop(t){
      frames++;
      if(!last) last=t;
      if(t-last>=1000){
        hist.push(Math.round(frames*1000/(t-last)));
        if(hist.length>3) hist.shift();
        frames=0; last=t;
        try{
          var avg=Math.round(hist.reduce(function(a,b){return a+b;},0)/hist.length);
          el.textContent='FPS '+avg;
          el.style.opacity='1';
        }catch(e){}
      }
      raf=requestAnimationFrame(loop);
    }
    document.addEventListener('visibilitychange',function(){
      if(document.hidden){ if(raf) cancelAnimationFrame(raf); raf=null; }
      else if(!raf){ frames=0; last=0; raf=requestAnimationFrame(loop); }
    });
    raf=requestAnimationFrame(loop);
  }catch(e){}
})();
