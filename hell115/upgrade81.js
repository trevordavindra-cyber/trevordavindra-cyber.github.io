// ILLUMINATI upgrade #81: hl81-rune-omen (v18.89)
// A left-edge chip drawing today's Elder Futhark rune: "RUNE FEHU" — a
// deterministic daily draw (same rune all day, new at midnight) from a
// date hash, the way hl77 draws its tarot card. __HL81 guard.
(function(){
  try{
    if(window.__HL81) return; window.__HL81=1;
    var el=document.createElement('div');
    el.id='hl81-rune'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:378px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(255,215,120,.45);text-shadow:0 0 6px rgba(240,190,70,.2);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    var RUNES=['FEHU','URUZ','THURISAZ','ANSUZ','RAIDO','KENAZ','GEBO','WUNJO','HAGALAZ','NAUTHIZ','ISA','JERA','EIHWAZ','PERTHRO','ALGIZ','SOWILO','TIWAZ','BERKANA','EHWAZ','MANNAZ','LAGUZ','INGWAZ','OTHALA','DAGAZ'];
    function hash(str){
      var h=5381;
      for(var i=0;i<str.length;i++){ h=((h<<5)+h+str.charCodeAt(i))>>>0; }
      return h;
    }
    function tick(){
      try{
        var d=new Date();
        var key=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
        var r=RUNES[hash(key)%RUNES.length];
        el.textContent='RUNE '+r;
        el.style.opacity='1';
      }catch(e){}
    }
    tick();
    setInterval(tick,60000);
  }catch(e){}
})();
