// ILLUMINATI upgrade #79: hl79-season-omen (v18.87)
// A left-edge chip watching the wheel of the year: "SOLSTICE IN 38D" —
// countdown to the next solstice or equinox (fixed UTC instants 2026-2028),
// days until it is under a day, then hours. Recomputed every 60s.
// __HL79 guard.
(function(){
  try{
    if(window.__HL79) return; window.__HL79=1;
    var el=document.createElement('div');
    el.id='hl79-season'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:346px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(255,170,200,.45);text-shadow:0 0 6px rgba(230,120,170,.2);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    var EV=[
      ['SOLSTICE',Date.UTC(2026,11,21,20,50)],
      ['EQUINOX',Date.UTC(2027,2,20,14,25)],
      ['SOLSTICE',Date.UTC(2027,5,21,8,57)],
      ['EQUINOX',Date.UTC(2027,8,23,0,2)],
      ['SOLSTICE',Date.UTC(2027,11,21,20,42)],
      ['EQUINOX',Date.UTC(2028,2,19,20,17)],
      ['SOLSTICE',Date.UTC(2028,5,20,14,45)],
      ['EQUINOX',Date.UTC(2028,8,22,6,19)],
      ['SOLSTICE',Date.UTC(2028,11,21,2,19)]
    ];
    function tick(){
      try{
        var now=Date.now(), pick=null;
        for(var i=0;i<EV.length;i++){ if(EV[i][1]>now){ pick=EV[i]; break; } }
        if(!pick){ el.style.opacity='0'; return; }
        var ms=pick[1]-now;
        var txt;
        if(ms>=86400000) txt=pick[0]+' IN '+Math.floor(ms/86400000)+'D';
        else txt=pick[0]+' IN '+Math.max(1,Math.floor(ms/3600000))+'H';
        el.textContent=txt;
        el.style.opacity='1';
      }catch(e){}
    }
    tick();
    setInterval(tick,60000);
  }catch(e){}
})();
