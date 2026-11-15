// ILLUMINATI upgrade #106: hl106-dpr-omen (v19.14)
// A left-edge chip naming the terminal's pixel scale:
// "DPR 2.0" from window.devicePixelRatio read once at boot.
// Reads only, never blocks anything. __HL106 guard.
(function(){
  try{
    if(window.__HL106) return; window.__HL106=1;
    var el=document.createElement('div');
    el.id='hl106-dpr'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:778px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(140,255,180,.4);text-shadow:0 0 6px rgba(100,255,150,.18);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    function show(){
      try{
        var d=1;
        try{ d=window.devicePixelRatio||1; }catch(e){}
        el.textContent='DPR '+(Math.round(d*10)/10);
        el.style.opacity='1';
      }catch(e){}
    }
    if(document.readyState!=='loading'){ show(); }
    else{ document.addEventListener('DOMContentLoaded',show,{once:true}); }
  }catch(e){}
})();
