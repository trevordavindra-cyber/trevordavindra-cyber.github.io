// ILLUMINATI upgrade #91: hl91-awake-omen (v18.99)
// A left-edge chip counting how many times this session woke back up:
// "AWAKE 3" — starts at 1 on page load, +1 every time the tab returns
// from hidden to visible (visibilitychange). Event-driven, no timers,
// never blocks anything. __HL91 guard.
(function(){
  try{
    if(window.__HL91) return; window.__HL91=1;
    var el=document.createElement('div');
    el.id='hl91-awake'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:538px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(140,255,180,.4);text-shadow:0 0 6px rgba(100,255,150,.18);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    var n=1;
    function show(){
      try{
        el.textContent='AWAKE '+n;
        el.style.opacity='1';
      }catch(e){}
    }
    show();
    document.addEventListener('visibilitychange',function(){
      try{
        if(!document.hidden){ n=n+1; show(); }
      }catch(e){}
    },false);
  }catch(e){}
})();
