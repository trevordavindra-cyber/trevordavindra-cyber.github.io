// ILLUMINATI upgrade #94: hl94-idle-omen (v19.02)
// A left-edge chip showing how long the terminal has gone untouched:
// "IDLE 0:02:41" — seconds since the last keypress or pointer press,
// ticking once a second, H:MM:SS like the uptime chip. One timer,
// event-driven listeners for resets, never blocks anything. __HL94
// guard.
(function(){
  try{
    if(window.__HL94) return; window.__HL94=1;
    var el=document.createElement('div');
    el.id='hl94-idle'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:586px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(140,255,180,.4);text-shadow:0 0 6px rgba(100,255,150,.18);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    var last=Date.now();
    function pad(n){ return (n<10?'0':'')+n; }
    function show(){
      try{
        var t=Math.floor((Date.now()-last)/1000);
        var h=Math.floor(t/3600), m=Math.floor(t/60)%60, s=t%60;
        el.textContent='IDLE '+h+':'+pad(m)+':'+pad(s);
        el.style.opacity='1';
      }catch(e){}
    }
    function reset(){ try{ last=Date.now(); show(); }catch(e){} }
    show();
    document.addEventListener('keydown',reset,true);
    document.addEventListener('pointerdown',reset,true);
    setInterval(show,1000);
  }catch(e){}
})();
