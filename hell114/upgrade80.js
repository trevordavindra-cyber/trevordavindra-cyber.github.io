// ILLUMINATI upgrade #80: hl80-zodiac-omen (v18.88)
// A left-edge chip naming today's sign: "ZODIAC SCORPIO" — real date-range
// zodiac from the visitor's local date, recomputed every 60s so it turns
// over at midnight. __HL80 guard.
(function(){
  try{
    if(window.__HL80) return; window.__HL80=1;
    var el=document.createElement('div');
    el.id='hl80-zodiac'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:362px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(200,170,255,.45);text-shadow:0 0 6px rgba(150,110,230,.2);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    var SIGNS=[
      ['CAPRICORN',1,19],['AQUARIUS',2,18],['PISCES',3,20],['ARIES',4,19],
      ['TAURUS',5,20],['GEMINI',6,20],['CANCER',7,22],['LEO',8,22],
      ['VIRGO',9,22],['LIBRA',10,22],['SCORPIO',11,21],['SAGITTARIUS',12,21],
      ['CAPRICORN',12,31]
    ];
    function tick(){
      try{
        var d=new Date(), m=d.getMonth()+1, day=d.getDate(), name=null;
        for(var i=0;i<SIGNS.length;i++){
          if(m<SIGNS[i][1] || (m===SIGNS[i][1] && day<=SIGNS[i][2])){ name=SIGNS[i][0]; break; }
        }
        if(!name) name='CAPRICORN';
        el.textContent='ZODIAC '+name;
        el.style.opacity='1';
      }catch(e){}
    }
    tick();
    setInterval(tick,60000);
  }catch(e){}
})();
