// ILLUMINATI upgrade #99: hl99-dpr-omen (v19.07)
// A left-edge chip reading the terminal's real pixel density:
// "DPR N.N" from devicePixelRatio, refreshed on every resize event
// (covers zoom and moving between displays). Reads only, never
// blocks anything. __HL99 guard.
(function(){
  try{
    if(window.__HL99) return; window.__HL99=1;
    var el=document.createElement('div');
    el.id='hl99-dpr'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:666px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(140,255,180,.4);text-shadow:0 0 6px rgba(100,255,150,.18);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    function show(){
      try{
        el.textContent='DPR '+(Math.round(window.devicePixelRatio*10)/10);
        el.style.opacity='1';
      }catch(e){}
    }
    show();
    window.addEventListener('resize',show,{passive:true});
  }catch(e){}
})();
