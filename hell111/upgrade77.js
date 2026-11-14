// ILLUMINATI upgrade #77: hl77-tarot-omen (v18.85)
// A left-edge chip drawing the day's card: "TAROT THE MOON · XVIII" — one
// of the 22 major arcana picked by a deterministic hash of the date, so
// every visitor sees the same card all day and a new one at midnight.
// Recomputed every 60s. __HL77 guard.
(function(){
  try{
    if(window.__HL77) return; window.__HL77=1;
    var el=document.createElement('div');
    el.id='hl77-tarot'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:314px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(255,210,120,.45);text-shadow:0 0 6px rgba(255,180,90,.2);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    var ARC=['THE FOOL','THE MAGICIAN','THE HIGH PRIESTESS','THE EMPRESS','THE EMPEROR','THE HIEROPHANT','THE LOVERS','THE CHARIOT','STRENGTH','THE HERMIT','WHEEL OF FORTUNE','JUSTICE','THE HANGED MAN','DEATH','TEMPERANCE','THE DEVIL','THE TOWER','THE STAR','THE MOON','THE SUN','JUDGEMENT','THE WORLD'];
    var NUM=['0','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI'];
    function draw(){
      var d=new Date(), s=d.getFullYear()*372+(d.getMonth()+1)*31+d.getDate();
      s=(s*2654435761)>>>0; s=(s^(s>>>13))>>>0;
      var i=s%22;
      return 'TAROT '+ARC[i]+' · '+NUM[i];
    }
    function tick(){
      try{
        el.textContent=draw();
        el.style.opacity='1';
      }catch(e){}
    }
    tick();
    setInterval(tick,60000);
  }catch(e){}
})();
