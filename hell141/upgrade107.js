// ILLUMINATI upgrade #107: hl107-ram-omen (v19.15)
// A left-edge chip naming the machine's memory size:
// "RAM ~8" from navigator.deviceMemory read once at boot
// (the browser reports whole GB buckets; if it hides the
// value the chip stays dark). Reads only, never blocks.
// __HL107 guard.
(function(){
  try{
    if(window.__HL107) return; window.__HL107=1;
    var el=document.createElement('div');
    el.id='hl107-ram'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:794px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(140,255,180,.4);text-shadow:0 0 6px rgba(100,255,150,.18);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    function show(){
      try{
        var gb=null;
        try{ gb=navigator.deviceMemory||null; }catch(e){}
        if(gb){ el.textContent='RAM ~'+gb; el.style.opacity='1'; }
      }catch(e){}
    }
    if(document.readyState!=='loading'){ show(); }
    else{ document.addEventListener('DOMContentLoaded',show,{once:true}); }
  }catch(e){}
})();
