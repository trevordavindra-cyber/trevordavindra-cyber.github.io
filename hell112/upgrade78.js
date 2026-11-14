// ILLUMINATI upgrade #78: hl78-power-omen (v18.86)
// A left-edge chip reading the vessel's power: "PWR 84% CHG" — real
// Battery Status API level, with CHG while charging, DRAIN while on
// battery. Hidden entirely where the browser exposes no battery (desktop
// Chrome, Firefox, iOS). __HL78 guard.
(function(){
  try{
    if(window.__HL78) return; window.__HL78=1;
    if(!navigator.getBattery) return;
    var el=document.createElement('div');
    el.id='hl78-power'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:330px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(140,255,160,.45);text-shadow:0 0 6px rgba(110,220,130,.2);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    var bat=null;
    function tick(){
      try{
        var pct=Math.round(bat.level*100);
        el.textContent='PWR '+pct+'% '+(bat.charging?'CHG':'DRAIN');
        el.style.opacity='1';
      }catch(e){}
    }
    navigator.getBattery().then(function(b){
      bat=b;
      tick();
      b.addEventListener('levelchange',tick);
      b.addEventListener('chargingchange',tick);
    }).catch(function(){});
  }catch(e){}
})();
