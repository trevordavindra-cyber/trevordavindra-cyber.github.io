// ILLUMINATI upgrade #104: hl104-dark-omen (v19.12)
// A left-edge chip naming the terminal's palette side:
// "DARK 1" when the browser prefers-color-scheme is dark,
// "DARK 0" otherwise, read once at boot. Reads only, never
// blocks anything. __HL104 guard.
(function(){
  try{
    if(window.__HL104) return; window.__HL104=1;
    var el=document.createElement('div');
    el.id='hl104-dark'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:746px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(140,255,180,.4);text-shadow:0 0 6px rgba(100,255,150,.18);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    function show(){
      try{
        var dark=0;
        try{ dark=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?1:0; }catch(e){}
        el.textContent='DARK '+dark;
        el.style.opacity='1';
      }catch(e){}
    }
    if(document.readyState!=='loading'){ show(); }
    else{ document.addEventListener('DOMContentLoaded',show,{once:true}); }
  }catch(e){}
})();
