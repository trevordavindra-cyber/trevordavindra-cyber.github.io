// ILLUMINATI upgrade #68: hl68-tongue-omen (v18.76)
// A left-edge chip showing where the terminal speaks from:
// "TONGUE EN-US · NEW_YORK" from the browser language and the
// Intl timezone. One read at load, no timers. Hides itself if
// neither is readable. No app changes.
(function(){
  try{
    if(window.__HL68) return; window.__HL68=1;
    var lang='',zone='';
    try{ lang=(navigator.language||'').toUpperCase(); }catch(e){}
    try{ zone=(Intl.DateTimeFormat().resolvedOptions().timeZone||'').toUpperCase(); }catch(e){}
    if(!lang&&!zone) return;
    var el=document.createElement('div');
    el.id='hl68-tongue'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:170px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(80,220,220,.5);text-shadow:0 0 6px rgba(40,200,200,.2);user-select:none;white-space:nowrap;');
    (document.body||document.documentElement).appendChild(el);
    var t='TONGUE '+(lang||'??')+(zone?(' · '+zone):'');
    el.textContent=t;
  }catch(e){}
})();
