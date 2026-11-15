// ILLUMINATI upgrade #98: hl98-paste-omen (v19.06)
// A left-edge chip counting real paste events on the terminal:
// "PASTE N", driven by document-level capture of the paste event
// (fires whenever text is pasted anywhere on the page). Event-driven,
// no timers, never blocks anything. __HL98 guard.
(function(){
  try{
    if(window.__HL98) return; window.__HL98=1;
    var el=document.createElement('div');
    el.id='hl98-paste'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:650px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(140,255,180,.4);text-shadow:0 0 6px rgba(100,255,150,.18);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    var n=0;
    function show(){
      try{
        el.textContent='PASTE '+n;
        el.style.opacity='1';
      }catch(e){}
    }
    document.addEventListener('paste',function(){ n++; show(); },{capture:true,passive:true});
    show();
  }catch(e){}
})();
