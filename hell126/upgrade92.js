// ILLUMINATI upgrade #92: hl92-keystroke-omen (v19.00)
// A left-edge chip counting every keystroke typed into the terminal
// this session: "KEYS 128". Listens on keydown at document level in
// capture phase so it counts even inside inputs. Event-driven, no
// timers, never blocks anything. __HL92 guard.
(function(){
  try{
    if(window.__HL92) return; window.__HL92=1;
    var el=document.createElement('div');
    el.id='hl92-keys'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:554px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(140,255,180,.4);text-shadow:0 0 6px rgba(100,255,150,.18);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    var n=0;
    function show(){
      try{
        el.textContent='KEYS '+n;
        el.style.opacity='1';
      }catch(e){}
    }
    show();
    document.addEventListener('keydown',function(){
      try{ n=n+1; show(); }catch(e){}
    },true);
  }catch(e){}
})();
