// ILLUMINATI upgrade #86: hl86-void-omen (v18.94)
// A left-edge chip that watches how long the operator has gone quiet:
// "VOID 42s" — seconds since the last real interaction (pointer, key,
// scroll, touch). Passive listeners only, never blocks anything.
// Updates every second. __HL86 guard.
(function(){
  try{
    if(window.__HL86) return; window.__HL86=1;
    var el=document.createElement('div');
    el.id='hl86-void'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:458px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(255,120,120,.45);text-shadow:0 0 6px rgba(255,80,80,.2);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    var last=Date.now();
    function wake(){ try{ last=Date.now(); }catch(e){} }
    ['pointermove','pointerdown','keydown','wheel','touchstart','scroll'].forEach(function(t){
      try{ window.addEventListener(t,wake,{passive:true}); }catch(e){}
    });
    function tick(){
      try{
        el.textContent='VOID '+Math.max(0,Math.floor((Date.now()-last)/1000))+'s';
        el.style.opacity='1';
      }catch(e){}
    }
    tick();
    setInterval(tick,1000);
  }catch(e){}
})();
