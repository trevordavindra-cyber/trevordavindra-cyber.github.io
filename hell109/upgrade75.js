// ILLUMINATI upgrade #75: hl75-orbit-omen (v18.83)
// A left-edge chip naming the day's orbit: "ORBIT SAT · W46" — weekday
// abbreviation plus ISO week number of the year, local time. Read at load
// and recomputed every 60s so it turns over at midnight. __HL75 guard.
(function(){
  try{
    if(window.__HL75) return; window.__HL75=1;
    var el=document.createElement('div');
    el.id='hl75-orbit'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:282px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(120,200,255,.45);text-shadow:0 0 6px rgba(100,180,255,.2);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    function isoWeek(d){
      var t=new Date(d.getFullYear(),d.getMonth(),d.getDate());
      var day=(t.getDay()+6)%7;
      t.setDate(t.getDate()-day+3);
      var first=new Date(t.getFullYear(),0,4);
      var fday=(first.getDay()+6)%7;
      var wk=1+Math.round(((t-first)/86400000-fday)/7);
      return wk;
    }
    function tick(){
      try{
        var now=new Date();
        var wd=['SUN','MON','TUE','WED','THU','FRI','SAT'][now.getDay()];
        el.textContent='ORBIT '+wd+' · W'+isoWeek(now);
        el.style.opacity='1';
      }catch(e){}
    }
    tick();
    setInterval(tick,60000);
  }catch(e){}
})();
