// ILLUMINATI upgrade #96: hl96-batt-omen (v19.04)
// A left-edge chip reading the terminal's real battery through the
// Battery Status API: "BATT 87%" with a bolt glyph while charging,
// live-updated on levelchange and chargingchange events. Devices or
// browsers without the API show "BATT --". Reads only, never blocks.
// __HL96 guard.
(function(){
  try{
    if(window.__HL96) return; window.__HL96=1;
    var el=document.createElement('div');
    el.id='hl96-batt'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:618px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(140,255,180,.4);text-shadow:0 0 6px rgba(100,255,150,.18);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    function paint(lvl,chg){
      el.textContent = (lvl==null?'BATT --':'BATT '+Math.round(lvl*100)+'%'+(chg?'\u26a1':''));
      el.style.opacity='1';
    }
    if(navigator.getBattery){
      navigator.getBattery().then(function(b){
        try{
          paint(b.level,b.charging);
          b.addEventListener('levelchange',function(){paint(b.level,b.charging);},false);
          b.addEventListener('chargingchange',function(){paint(b.level,b.charging);},false);
        }catch(e){paint(null,false);}
      }).catch(function(){paint(null,false);});
    }else{ paint(null,false); }
  }catch(e){}
})();
