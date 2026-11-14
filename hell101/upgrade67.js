// ILLUMINATI upgrade #67: hl67-year-omen (v18.75)
// A left-edge chip showing where the year stands: "YEAR 318/365 87%"
// (day of year and percent elapsed, local time). Read at load and
// re-read every 60s so it rolls over at midnight. No app changes.
(function(){
  try{
    if(window.__HL67) return; window.__HL67=1;
    var el=document.createElement('div');
    el.id='hl67-year'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:154px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(80,220,220,.5);text-shadow:0 0 6px rgba(40,200,200,.2);user-select:none;white-space:nowrap;');
    (document.body||document.documentElement).appendChild(el);
    function upd(){
      try{
        var n=new Date();
        var s=new Date(n.getFullYear(),0,1);
        var e=new Date(n.getFullYear()+1,0,1);
        var day=Math.floor((n-s)/86400000)+1;
        var total=Math.round((e-s)/86400000);
        var pct=Math.round(day/total*100);
        el.textContent='YEAR '+day+'/'+total+' '+pct+'%';
      }catch(e){ el.textContent=''; }
    }
    upd();
    try{ setInterval(upd,60000); }catch(e){}
  }catch(e){}
})();
