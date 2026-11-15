// ILLUMINATI upgrade #87: hl87-hex-omen (v18.95)
// A left-edge chip showing the vessel's clock in machine script:
// "HEX 13:0C:0F" — the local time rendered hour:minute:second in
// hexadecimal, ticking every second. Pure display, no listeners.
// __HL87 guard.
(function(){
  try{
    if(window.__HL87) return; window.__HL87=1;
    var el=document.createElement('div');
    el.id='hl87-hex'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:474px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(120,220,255,.4);text-shadow:0 0 6px rgba(90,200,255,.18);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    function hx(n){ return (n<16?'0':'')+n.toString(16).toUpperCase(); }
    function tick(){
      try{
        var d=new Date();
        el.textContent='HEX '+hx(d.getHours())+':'+hx(d.getMinutes())+':'+hx(d.getSeconds());
        el.style.opacity='1';
      }catch(e){}
    }
    tick();
    setInterval(tick,1000);
  }catch(e){}
})();
