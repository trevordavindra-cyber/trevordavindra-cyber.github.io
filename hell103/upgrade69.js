// ILLUMINATI upgrade #69: hl69-witching-omen (v18.77)
// A left-edge chip counting down to the witching hour (03:00-04:00
// local): "WITCHING IN 9H 12M", and "WITCHING HOUR" while it runs.
// Recomputed every 60s. No app changes.
(function(){
  try{
    if(window.__HL69) return; window.__HL69=1;
    var el=document.createElement('div');
    el.id='hl69-witch'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:186px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(80,220,220,.5);text-shadow:0 0 6px rgba(40,200,200,.2);user-select:none;white-space:nowrap;');
    (document.body||document.documentElement).appendChild(el);
    function upd(){
      try{
        var n=new Date(), h=n.getHours();
        if(h>=3&&h<4){ el.textContent='WITCHING HOUR'; return; }
        var t=new Date(n); t.setHours(3,0,0,0);
        if(t<=n) t.setDate(t.getDate()+1);
        var ms=t-n, hh=Math.floor(ms/3600000), mm=Math.floor((ms%3600000)/60000);
        el.textContent='WITCHING IN '+hh+'H '+mm+'M';
      }catch(e){ el.textContent=''; }
    }
    upd();
    try{ setInterval(upd,60000); }catch(e){}
  }catch(e){}
})();
