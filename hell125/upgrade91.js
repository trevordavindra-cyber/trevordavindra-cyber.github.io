// ILLUMINATI upgrade #91: hl91-res-omen (v18.99)
// A left-edge chip reading the vessel's true dimensions: "RES 390x844"
// — the live viewport size from window.innerWidth/innerHeight,
// refreshed every second and on resize/orientation change. Pure
// display. __HL91 guard.
(function(){
  try{
    if(window.__HL91) return; window.__HL91=1;
    var el=document.createElement('div');
    el.id='hl91-res'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:538px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(255,210,120,.4);text-shadow:0 0 6px rgba(255,180,90,.18);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    function read(){
      try{
        el.textContent='RES '+window.innerWidth+'x'+window.innerHeight;
        el.style.opacity='1';
      }catch(e){}
    }
    read();
    setInterval(read,1000);
    window.addEventListener('resize',read,{passive:true});
    window.addEventListener('orientationchange',read,{passive:true});
  }catch(e){}
})();
