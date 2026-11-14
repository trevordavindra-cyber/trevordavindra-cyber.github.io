// ILLUMINATI upgrade #84: hl84-keystroke-omen (v18.92)
// A left-edge chip counting the keys the vessel strikes this session:
// "STROKES 128" — every keydown on the document tallies toward it, SEND
// taps and purge keys included. Passive listener only, never blocks a
// key. __HL84 guard.
(function(){
  try{
    if(window.__HL84) return; window.__HL84=1;
    var el=document.createElement('div');
    el.id='hl84-keys'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:426px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(190,255,150,.45);text-shadow:0 0 6px rgba(140,220,110,.2);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    var n=0, shown=-1;
    function tick(){
      try{
        if(shown!==n){ shown=n; el.textContent='STROKES '+n; }
        el.style.opacity='1';
      }catch(e){}
    }
    tick();
    window.addEventListener('keydown',function(){ n++; tick(); },{passive:true,capture:true});
    setInterval(tick,60000);
  }catch(e){}
})();
