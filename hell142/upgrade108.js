// ILLUMINATI upgrade #108: hl108-view-omen (v19.16)
// A left-edge chip naming the terminal's viewport:
// "VIEW 430x932" from innerWidth x innerHeight read once
// at boot. Reads only, never blocks anything. __HL108 guard.
(function(){
  try{
    if(window.__HL108) return; window.__HL108=1;
    var el=document.createElement('div');
    el.id='hl108-view'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:810px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(140,255,180,.4);text-shadow:0 0 6px rgba(100,255,150,.18);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    function show(){
      try{
        el.textContent='VIEW '+window.innerWidth+'x'+window.innerHeight;
        el.style.opacity='1';
      }catch(e){}
    }
    if(document.readyState!=='loading'){ show(); }
    else{ document.addEventListener('DOMContentLoaded',show,{once:true}); }
  }catch(e){}
})();
