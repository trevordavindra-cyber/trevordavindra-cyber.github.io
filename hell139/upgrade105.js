// ILLUMINATI upgrade #105: hl105-online-omen (v19.13)
// A left-edge chip naming the link state the browser itself
// reports at boot: "NET 1" when navigator.onLine is true,
// "NET 0" otherwise. Reads only, never blocks anything.
// __HL105 guard.
(function(){
  try{
    if(window.__HL105) return; window.__HL105=1;
    var el=document.createElement('div');
    el.id='hl105-online'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:762px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(140,255,180,.4);text-shadow:0 0 6px rgba(100,255,150,.18);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    function show(){
      try{
        el.textContent='NET '+(navigator.onLine?1:0);
        el.style.opacity='1';
      }catch(e){}
    }
    if(document.readyState!=='loading'){ show(); }
    else{ document.addEventListener('DOMContentLoaded',show,{once:true}); }
  }catch(e){}
})();
