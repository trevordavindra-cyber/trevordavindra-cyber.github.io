// ILLUMINATI upgrade #103: hl103-touch-omen (v19.11)
// A left-edge chip declaring the terminal's input class:
// "TOUCH 5" from navigator.maxTouchPoints at boot (TOUCH 0 on a
// desktop without a touch screen). Reads only, never blocks
// anything. __HL103 guard.
(function(){
  try{
    if(window.__HL103) return; window.__HL103=1;
    var el=document.createElement('div');
    el.id='hl103-touch'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:730px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(140,255,180,.4);text-shadow:0 0 6px rgba(100,255,150,.18);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    function show(){
      try{
        var n=0;
        try{ n=navigator.maxTouchPoints|0; }catch(e){}
        el.textContent='TOUCH '+n;
        el.style.opacity='1';
      }catch(e){}
    }
    if(document.readyState!=='loading'){ show(); }
    else{ document.addEventListener('DOMContentLoaded',show,{once:true}); }
  }catch(e){}
})();
