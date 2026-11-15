// ILLUMINATI upgrade #93: hl93-click-omen (v19.01)
// A left-edge chip counting every pointer press on the terminal this
// session: "CLICKS 12". Listens on pointerdown at document level in
// capture phase so every button, tap and long-press counts. Event-
// driven, no timers, never blocks anything. __HL93 guard.
(function(){
  try{
    if(window.__HL93) return; window.__HL93=1;
    var el=document.createElement('div');
    el.id='hl93-clicks'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:570px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(140,255,180,.4);text-shadow:0 0 6px rgba(100,255,150,.18);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    var n=0;
    function show(){
      try{
        el.textContent='CLICKS '+n;
        el.style.opacity='1';
      }catch(e){}
    }
    show();
    document.addEventListener('pointerdown',function(){
      try{ n=n+1; show(); }catch(e){}
    },true);
  }catch(e){}
})();
