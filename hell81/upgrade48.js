// ILLUMINATI upgrade #48: hl48-occult-clock (v18.54)
// A faint cyan chip in the bottom-right corner shows the current local
// time (HH:MM, 24h) beside a small hourglass glyph, refreshed every
// 30 s. Text only: no animation loop, so prefers-reduced-motion needs
// no exception; pointer-events none, adds nothing but one hidden chip.
(function(){
  try{
    if(window.__HL48) return; window.__HL48=1;
    var pad=function(n){return (n<10?'0':'')+n;};
    var paint=function(){
      var d=new Date();
      var el=document.getElementById('hl48-clock');
      if(!el){
        el=document.createElement('div');
        el.id='hl48-clock'; el.setAttribute('aria-hidden','true');
        el.setAttribute('style','position:fixed;right:12px;bottom:12px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:1.5px;color:rgba(80,220,220,.5);text-shadow:0 0 6px rgba(40,200,200,.3);user-select:none;');
        (document.body||document.documentElement).appendChild(el);
      }
      el.textContent='\u231B '+pad(d.getHours())+':'+pad(d.getMinutes());
    };
    paint();
    setInterval(paint,30000);
  }catch(e){}
})();