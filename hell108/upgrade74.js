// ILLUMINATI upgrade #74: hl74-watch-omen (v18.82)
// A left-edge chip tallying focused attention: "ATTENT 12M 34S", the total
// time this page has been visible AND focused since load. The counter only
// accrues second-by-second while the tab is in view and the window has
// focus; a 1s interval accrues nothing while hidden or blurred. __HL74 guard.
(function(){
  try{
    if(window.__HL74) return; window.__HL74=1;
    var el=document.createElement('div');
    el.id='hl74-watch'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:266px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(220,190,90,.5);text-shadow:0 0 6px rgba(220,170,60,.2);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    var s=0;
    function fmt(){
      var m=Math.floor(s/60), r=s%60;
      el.textContent='ATTENT '+m+'M '+String(r).padStart(2,'0')+'S';
    }
    setInterval(function(){
      try{
        if(!document.hidden && document.hasFocus && document.hasFocus()){
          s++; fmt(); el.style.opacity='1';
        }
      }catch(e){}
    },1000);
  }catch(e){}
})();
