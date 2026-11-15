// ILLUMINATI upgrade #110: hl110-zone-omen (v19.18)
// A left-edge chip naming the terminal's clock zone:
// "TZ -5.0" from the machine's UTC offset read once at
// boot. Reads only, never blocks anything. __HL110 guard.
(function(){
  try{
    if(window.__HL110) return; window.__HL110=1;
    var el=document.createElement('div');
    el.id='hl110-zone'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:842px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(140,255,180,.4);text-shadow:0 0 6px rgba(100,255,150,.18);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    function show(){
      try{
        var off=-new Date().getTimezoneOffset()/60;
        el.textContent='TZ '+(off>=0?'+':'')+(Math.round(off*10)/10);
        el.style.opacity='1';
      }catch(e){}
    }
    if(document.readyState!=='loading'){ show(); }
    else{ document.addEventListener('DOMContentLoaded',show,{once:true}); }
  }catch(e){}
})();
