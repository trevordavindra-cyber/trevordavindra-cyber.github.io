// ILLUMINATI upgrade #101: hl101-core-omen (v19.09)
// A left-edge chip reading the terminal's real CPU core count:
// "CORES N" from navigator.hardwareConcurrency, fallback "CORES --"
// when the browser withholds it. Read once at boot, never blocks
// anything. __HL101 guard.
(function(){
  try{
    if(window.__HL101) return; window.__HL101=1;
    var el=document.createElement('div');
    el.id='hl101-core'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:698px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(140,255,180,.4);text-shadow:0 0 6px rgba(100,255,150,.18);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    function show(){
      try{
        el.textContent='CORES '+(navigator.hardwareConcurrency||'--');
        el.style.opacity='1';
      }catch(e){}
    }
    if(document.readyState!=='loading'){ show(); }
    else{ document.addEventListener('DOMContentLoaded',show,{once:true}); }
  }catch(e){}
})();
