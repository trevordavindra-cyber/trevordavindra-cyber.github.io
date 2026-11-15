// ILLUMINATI upgrade #90: hl90-uptime-omen (v18.98)
// A left-edge chip tracking how long this session has been alive:
// "UP 0:12:34" — hours:minutes:seconds since the page loaded, read
// from performance.now(), ticking every second. Pure display, no
// listeners. __HL90 guard.
(function(){
  try{
    if(window.__HL90) return; window.__HL90=1;
    var el=document.createElement('div');
    el.id='hl90-up'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:522px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(140,255,180,.4);text-shadow:0 0 6px rgba(100,255,150,.18);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    function pad(n){ return (n<10?'0':'')+n; }
    function tick(){
      try{
        var t=Math.floor(performance.now()/1000);
        var h=Math.floor(t/3600), m=Math.floor(t/60)%60, s=t%60;
        el.textContent='UP '+h+':'+pad(m)+':'+pad(s);
        el.style.opacity='1';
      }catch(e){}
    }
    tick();
    setInterval(tick,1000);
  }catch(e){}
})();
