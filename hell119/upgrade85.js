// ILLUMINATI upgrade #85: hl85-epoch-omen (v18.93)
// A left-edge chip showing the vessel's true time signature:
// "EPOCH 1763165760" — the live Unix epoch in seconds, ticking every
// second. Pure display, no listeners. __HL85 guard.
(function(){
  try{
    if(window.__HL85) return; window.__HL85=1;
    var el=document.createElement('div');
    el.id='hl85-epoch'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:442px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(255,255,255,.35);text-shadow:0 0 6px rgba(255,255,255,.15);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    function tick(){
      try{
        el.textContent='EPOCH '+Math.floor(Date.now()/1000);
        el.style.opacity='1';
      }catch(e){}
    }
    tick();
    setInterval(tick,1000);
  }catch(e){}
})();
