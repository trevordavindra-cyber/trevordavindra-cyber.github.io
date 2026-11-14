// ILLUMINATI upgrade #82: hl82-scroll-omen (v18.90)
// A left-edge chip measuring how deep the vessel has been read:
// "DEPTH 14VH" — the deepest scroll position this session, measured in
// viewport heights from the real document scroll position. Updates on
// scroll and every 60s. __HL82 guard.
(function(){
  try{
    if(window.__HL82) return; window.__HL82=1;
    var el=document.createElement('div');
    el.id='hl82-scroll'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:394px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(140,200,255,.45);text-shadow:0 0 6px rgba(90,150,230,.2);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    var max=0;
    function tick(){
      try{
        var d=document.documentElement;
        var vh=window.innerHeight||d.clientHeight||1;
        var y=window.scrollY||window.pageYOffset||d.scrollTop||0;
        var depth=Math.round(y/vh);
        if(depth>max) max=depth;
        el.textContent='DEPTH '+max+'VH';
        el.style.opacity='1';
      }catch(e){}
    }
    tick();
    window.addEventListener('scroll',tick,{passive:true});
    setInterval(tick,60000);
  }catch(e){}
})();
