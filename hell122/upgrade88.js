// ILLUMINATI upgrade #88: hl88-moon-omen (v18.96)
// A left-edge chip reading the real sky: "MOON WAX GB 87%" — the lunar
// phase computed from the current date (synodic month 29.530588853 d
// from the Jan 6 2000 18:14 UTC new moon) with its name and lit
// fraction, refreshed every 60s. Pure display, no listeners.
// __HL88 guard.
(function(){
  try{
    if(window.__HL88) return; window.__HL88=1;
    var el=document.createElement('div');
    el.id='hl88-moon'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:490px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(200,180,255,.4);text-shadow:0 0 6px rgba(150,120,255,.18);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    var SYN=29.530588853, NEW=Date.UTC(2000,0,6,18,14,0);
    function name(p){
      if(p<1.0||p>=28.5) return 'NEW';
      if(p<6.4) return 'WAX CR';
      if(p<8.4) return 'FIRST';
      if(p<13.8) return 'WAX GB';
      if(p<15.8) return 'FULL';
      if(p<21.1) return 'WAN GB';
      if(p<23.1) return 'LAST';
      return 'WAN CR';
    }
    function tick(){
      try{
        var days=((Date.now()-NEW)/86400000)%SYN; if(days<0) days+=SYN;
        var lit=Math.round((1-Math.cos(2*Math.PI*days/SYN))/2*100);
        el.textContent='MOON '+name(days)+' '+lit+'%';
        el.style.opacity='1';
      }catch(e){}
    }
    tick();
    setInterval(tick,60000);
  }catch(e){}
})();
