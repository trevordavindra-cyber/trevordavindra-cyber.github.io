// ILLUMINATI upgrade #65: hl65-viewport-omen (v18.73)
// A left-edge chip reading "VIEW WxH @R" — the live viewport size
// and device pixel ratio, re-measured on resize and orientation
// change only (no timers). One read at load, no app changes.
(function(){
  try{
    if(window.__HL65) return; window.__HL65=1;
    var el=document.createElement('div');
    el.id='hl65-view'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:122px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(80,220,220,.5);text-shadow:0 0 6px rgba(40,200,200,.2);user-select:none;white-space:nowrap;');
    (document.body||document.documentElement).appendChild(el);
    function upd(){
      try{
        var w=window.innerWidth, h=window.innerHeight, r=window.devicePixelRatio||1;
        el.textContent='VIEW '+w+'x'+h+(r!==1?' @'+(Math.round(r*10)/10):'');
      }catch(e){ el.textContent=''; }
    }
    upd();
    try{ window.addEventListener('resize',upd); window.addEventListener('orientationchange',upd); }catch(e){}
  }catch(e){}
})();
