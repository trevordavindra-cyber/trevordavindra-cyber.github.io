// ILLUMINATI upgrade #53: hl53-latency-omen (v18.61)
// A chip above the link chip, bottom-left: measures every pollinations
// text-relay request through a transparent fetch wrapper and shows the
// last answer's latency plus a rolling average of the last five.
// Cyan when fast, amber when slow, red when stalled. Event-driven only:
// no timers, no polling, no animation; pointer-events none, adds
// nothing but one hidden chip until the first real answer is timed.
(function(){
  try{
    if(window.__HL53) return; window.__HL53=1;
    var el=document.createElement('div');
    el.id='hl53-latency'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:58px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:1.5px;color:rgba(80,220,220,0);text-shadow:0 0 6px rgba(40,200,200,.25);user-select:none;transition:color .4s;');
    (document.body||document.documentElement).appendChild(el);
    var times=[];
    var fmt=function(s){ return s<10 ? s.toFixed(1)+'s' : Math.round(s)+'s'; };
    var paint=function(){
      var last=times[times.length-1];
      if(!last) return;
      var col = last<3 ? 'rgba(80,220,220,.6)' : last<8 ? 'rgba(230,190,90,.75)' : 'rgba(255,90,90,.8)';
      var sh  = last<3 ? '0 0 6px rgba(40,200,200,.3)' : last<8 ? '0 0 6px rgba(210,170,70,.3)' : '0 0 6px rgba(220,60,60,.3)';
      var txt='\u29d6 '+fmt(last);
      if(times.length>1){
        var avg=0; for(var i=0;i<times.length;i++) avg+=times[i]; avg/=times.length;
        txt+='  AVG '+fmt(avg);
      }
      el.textContent=txt; el.style.color=col; el.style.textShadow=sh;
    };
    var of=window.fetch;
    if(typeof of!=='function') return;
    window.fetch=function(){
      var t0=Date.now(), isPoll=false, url=arguments[0];
      try{
        var u=(url&&url.url)?url.url:String(url||'');
        if(u.indexOf('text.pollinations.ai')>-1) isPoll=true;
      }catch(e){}
      var p=of.apply(this,arguments);
      if(isPoll){
        try{ p.then(function(){ times.push((Date.now()-t0)/1000); if(times.length>5) times.shift(); paint(); }).catch(function(){}); }catch(e){}
      }
      return p;
    };
  }catch(e){}
})();
