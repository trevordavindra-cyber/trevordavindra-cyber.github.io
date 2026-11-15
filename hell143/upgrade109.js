// ILLUMINATI upgrade #109: hl109-batt-omen (v19.17)
// A left-edge chip naming the machine's charge, straight
// from the browser battery API: "BATT 87%" or "BATT 87%+"
// while it charges, read once at boot when the browser
// exposes the value (it stays dark otherwise). Reads only.
// __HL109 guard.
(function(){
  try{
    if(window.__HL109) return; window.__HL109=1;
    var el=document.createElement('div');
    el.id='hl109-batt'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:826px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(140,255,180,.4);text-shadow:0 0 6px rgba(100,255,150,.18);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    function show(){
      try{
        if(!navigator.getBattery) return;
        navigator.getBattery().then(function(b){
          try{
            var pct=Math.round(b.level*100);
            el.textContent='BATT '+pct+'%'+(b.charging?'+':'');
            el.style.opacity='1';
          }catch(e){}
        }).catch(function(){});
      }catch(e){}
    }
    if(document.readyState!=='loading'){ show(); }
    else{ document.addEventListener('DOMContentLoaded',show,{once:true}); }
  }catch(e){}
})();
