// ILLUMINATI upgrade #54: hl54-battery-omen (v18.62)
// A chip at the bottom-right (stacked above the rune-omen chip) reads
// the device Battery Status API where the browser exposes it: a bolt
// plus percent while charging, a plain percent otherwise, red warning
// under 20%. Fully event-driven (levelchange/chargingchange listeners,
// no polling, no animation) and it hides itself entirely on browsers
// or devices that report no battery. pointer-events none, adds nothing
// but one hidden chip.
(function(){
  try{
    if(window.__HL54) return; window.__HL54=1;
    if(!navigator.getBattery) return;
    navigator.getBattery().then(function(b){
      var el=document.createElement('div');
      el.id='hl54-batt'; el.setAttribute('aria-hidden','true');
      el.setAttribute('style','position:fixed;right:12px;bottom:44px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:1.5px;color:rgba(80,220,220,.5);text-shadow:0 0 6px rgba(40,200,200,.3);user-select:none;');
      (document.body||document.documentElement).appendChild(el);
      var paint=function(){
        var pct=Math.round(b.level*100);
        if(b.charging){
          el.textContent='\u26a1 '+pct+'%';
          el.style.color='rgba(80,220,220,.6)';
        }else if(pct<20){
          el.textContent='\u26a0 '+pct+'%';
          el.style.color='rgba(255,90,90,.8)';
        }else{
          el.textContent='\u25cf '+pct+'%';
          el.style.color='rgba(80,220,220,.5)';
        }
      };
      paint();
      b.addEventListener('levelchange',paint);
      b.addEventListener('chargingchange',paint);
    }).catch(function(){});
  }catch(e){}
})();
