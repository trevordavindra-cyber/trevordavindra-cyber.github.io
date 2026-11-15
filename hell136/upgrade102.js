// ILLUMINATI upgrade #102: hl102-lang-omen (v19.10)
// A left-edge chip naming the terminal's real language setting:
// "LANG <locale>" from navigator.language (e.g. LANG en-US), read
// once at boot, fallback "LANG --" when the browser withholds it.
// Reads only, never blocks anything. __HL102 guard.
(function(){
  try{
    if(window.__HL102) return; window.__HL102=1;
    var el=document.createElement('div');
    el.id='hl102-lang'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:714px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(140,255,180,.4);text-shadow:0 0 6px rgba(100,255,150,.18);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    function show(){
      try{
        el.textContent='LANG '+(navigator.language||'--');
        el.style.opacity='1';
      }catch(e){}
    }
    if(document.readyState!=='loading'){ show(); }
    else{ document.addEventListener('DOMContentLoaded',show,{once:true}); }
  }catch(e){}
})();
