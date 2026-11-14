// ILLUMINATI upgrade #60: hl60-visit-omen (v18.68)
// A small counter chip on the lower-left edge (above the sentinel
// stack) that reads "SUMMONING #N": N is how many times this browser
// has opened the terminal, kept in localStorage. One write per page
// load, no listeners, no timers, pointer-events none.
(function(){
  try{
    if(window.__HL60) return; window.__HL60=1;
    var n=0;
    try{ n=parseInt(localStorage.getItem('hl60-visits')||'0',10)||0; }catch(e){}
    n=n+1;
    try{ localStorage.setItem('hl60-visits', String(n)); }catch(e){}
    var el=document.createElement('div');
    el.id='hl60-visit'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:90px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(80,220,220,.55);text-shadow:0 0 6px rgba(40,200,200,.25);user-select:none;');
    el.textContent='SUMMONING #'+n;
    (document.body||document.documentElement).appendChild(el);
  }catch(e){}
})();
