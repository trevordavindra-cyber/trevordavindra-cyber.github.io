// ILLUMINATI upgrade #95: hl95-net-omen (v19.03)
// A left-edge chip showing the terminal's live connection state:
// "NET UP" or "NET DOWN" — driven by the browser's online/offline
// events, checked against navigator.onLine at load. Event-driven, no
// timers, never blocks anything. __HL95 guard.
(function(){
  try{
    if(window.__HL95) return; window.__HL95=1;
    var el=document.createElement('div');
    el.id='hl95-net'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:602px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(140,255,180,.4);text-shadow:0 0 6px rgba(100,255,150,.18);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    function show(){
      try{
        var up=navigator.onLine;
        el.textContent='NET '+(up?'UP':'DOWN');
        el.style.color=up?'rgba(140,255,180,.4)':'rgba(255,120,120,.55)';
        el.style.opacity='1';
      }catch(e){}
    }
    show();
    window.addEventListener('online',show,false);
    window.addEventListener('offline',show,false);
  }catch(e){}
})();
