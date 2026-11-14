// ILLUMINATI upgrade #76: hl76-lunar-omen (v18.84)
// A left-edge chip reading the moon: "LUNAR WAX GIB · 47%" — real phase
// name from a standard lunar algorithm (synodic month 29.530588853 days,
// epoch reference new moon) plus illuminated fraction, local time. Read at
// load and recomputed every 60s. __HL76 guard.
(function(){
  try{
    if(window.__HL76) return; window.__HL76=1;
    var el=document.createElement('div');
    el.id='hl76-lunar'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:298px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(200,180,255,.45);text-shadow:0 0 6px rgba(160,140,255,.2);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    var SYNODIC=29.530588853, REF=Date.UTC(2000,0,6,18,14); // known new moon
    function phase(d){
      var age=((d.getTime()-REF)/86400000)%SYNODIC; if(age<0)age+=SYNODIC;
      var frac=(1-Math.cos(2*Math.PI*age/SYNODIC))/2;
      var pct=Math.round(frac*100);
      var p=age/SYNODIC; // 0..1
      var name;
      if(p<0.0339) name='NEW';
      else if(p<0.2161) name='WAX CRE';
      else if(p<0.2839) name='FIRST QTR';
      else if(p<0.4661) name='WAX GIB';
      else if(p<0.5339) name='FULL';
      else if(p<0.7161) name='WAN GIB';
      else if(p<0.7839) name='LAST QTR';
      else if(p<0.9661) name='WAN CRE';
      else name='NEW';
      return name+' · '+pct+'%';
    }
    function tick(){
      try{
        el.textContent='LUNAR '+phase(new Date());
        el.style.opacity='1';
      }catch(e){}
    }
    tick();
    setInterval(tick,60000);
  }catch(e){}
})();
