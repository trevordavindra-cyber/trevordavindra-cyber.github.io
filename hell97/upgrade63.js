// ILLUMINATI upgrade #63: hl63-pulse-omen (v18.71)
// A right-edge chip (next slot up from the battery/offline stack)
// that reads "LINK 4G · 12 MBPS" from the browser's own network
// information: effective connection class plus measured downlink.
// Updates only on the connection's change event; hides itself where
// the browser gives no network info. No timers, no app changes.
(function(){
  try{
    if(window.__HL63) return; window.__HL63=1;
    var c=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
    if(!c) return;
    var el=document.createElement('div');
    el.id='hl63-pulse'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;right:14px;bottom:76px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(80,220,220,.5);text-shadow:0 0 6px rgba(40,200,200,.2);user-select:none;white-space:nowrap;');
    (document.body||document.documentElement).appendChild(el);
    function upd(){
      try{
        var t=(c.effectiveType||'').toUpperCase();
        var d=c.downlink?Math.round(c.downlink)+' MBPS':'';
        if(!t&&!d){ el.textContent=''; return; }
        el.textContent='LINK '+t+(d?' · '+d:'');
      }catch(e){ el.textContent=''; }
    }
    upd();
    try{ c.addEventListener('change',upd); }catch(e){}
  }catch(e){}
})();
