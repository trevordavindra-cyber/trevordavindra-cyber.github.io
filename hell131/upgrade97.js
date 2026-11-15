// ILLUMINATI upgrade #97: hl97-screen-omen (v19.05)
// A left-edge chip reading the terminal's real viewport through the
// window's own geometry: "W:H" from innerWidth/innerHeight, live
// on every resize and orientationchange event. Reads only, never
// blocks anything. __HL97 guard.
(function(){
  try{
    if(window.__HL97) return; window.__HL97=1;
    var el=document.createElement('div');
    el.id='hl97-scr'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:634px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(140,255,180,.4);text-shadow:0 0 6px rgba(100,255,150,.18);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    function show(){
      try{
        el.textContent=window.innerWidth+'\u00d7'+window.innerHeight;
        el.style.opacity='1';
      }catch(e){}
    }
    show();
    window.addEventListener('resize',show,{passive:true});
    window.addEventListener('orientationchange',show,{passive:true});
  }catch(e){}
})();
