// ILLUMINATI upgrade #64: hl64-core-omen (v18.72)
// A right-edge chip reading "CORE N GB" from the browser's Device
// Memory API, or "CORES N" from hardwareConcurrency where memory is
// not exposed. One read at load, no timers, no listeners, no app
// changes. Hides itself where the browser gives neither.
(function(){
  try{
    if(window.__HL64) return; window.__HL64=1;
    var d=navigator.deviceMemory, n=navigator.hardwareConcurrency;
    var t=null;
    if(d) t='CORE '+d+' GB';
    else if(n) t='CORES '+n;
    if(!t) return;
    var el=document.createElement('div');
    el.id='hl64-core'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;right:14px;bottom:92px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(80,220,220,.5);text-shadow:0 0 6px rgba(40,200,200,.2);user-select:none;white-space:nowrap;');
    el.textContent=t;
    (document.body||document.documentElement).appendChild(el);
  }catch(e){}
})();
