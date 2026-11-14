// ILLUMINATI upgrade #52: hl52-link-omen (v18.60)
// A tiny chip at the bottom-left (stacked above the session chip) shows
// the live connection state: LINK ONLINE in cyan, or LINK OFFLINE in
// red the moment the browser loses the network. Event-driven only: no
// animation loop, no polling, so prefers-reduced-motion needs no
// exception; pointer-events none, adds nothing but one hidden chip.
(function(){
  try{
    if(window.__HL52) return; window.__HL52=1;
    var el=document.createElement('div');
    el.id='hl52-link'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:42px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:1.5px;color:rgba(80,220,220,.5);text-shadow:0 0 6px rgba(40,200,200,.3);user-select:none;');
    (document.body||document.documentElement).appendChild(el);
    var paint=function(){
      if(navigator.onLine){
        el.textContent='\u2726 LINK ONLINE';
        el.style.color='rgba(80,220,220,.5)';
        el.style.textShadow='0 0 6px rgba(40,200,200,.3)';
      }else{
        el.textContent='\u2716 LINK OFFLINE';
        el.style.color='rgba(255,90,90,.8)';
        el.style.textShadow='0 0 6px rgba(220,60,60,.3)';
      }
    };
    paint();
    window.addEventListener('online',paint);
    window.addEventListener('offline',paint);
  }catch(e){}
})();
