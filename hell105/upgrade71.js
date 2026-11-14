// ILLUMINATI upgrade #71: hl71-vigil-omen (v18.79)
// A left-edge chip showing how long this summoning has been awake:
// "VIGIL 14M 3S" since page load, refreshed every 1s while the tab
// is visible, frozen while hidden. No app changes.
(function(){
  try{
    if(window.__HL71) return; window.__HL71=1;
    var el=document.createElement('div');
    el.id='hl71-vigil'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:218px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(80,220,220,.5);text-shadow:0 0 6px rgba(40,200,200,.2);user-select:none;white-space:nowrap;');
    (document.body||document.documentElement).appendChild(el);
    var t0=Date.now();
    function upd(){
      try{
        var s=Math.floor((Date.now()-t0)/1000);
        var h=Math.floor(s/3600), m=Math.floor((s%3600)/60), ss=s%60;
        el.textContent='VIGIL '+(h?h+'H ':'')+m+'M '+ss+'S';
      }catch(e){}
    }
    upd();
    try{ setInterval(upd,1000); }catch(e){}
  }catch(e){}
})();
