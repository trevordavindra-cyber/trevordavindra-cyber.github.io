// ILLUMINATI upgrade #41: hl41-rune-ticker (v18.47)
// A tiny top-left rune ticker that slowly cycles occult glyphs, purely decorative.
// Additive, guarded, respects prefers-reduced-motion. Injected by overnight upgrade run.
(function(){
  if(!document||!document.body)return;
  function start(){
    if(document.getElementById('hl41-ticker'))return;
    var t=document.createElement('div');
    t.id='hl41-ticker';
    t.style.cssText='position:fixed;top:12px;left:12px;z-index:9992;font-size:13px;letter-spacing:4px;'+
      'color:rgba(0,229,255,.35);font-family:monospace;pointer-events:none;user-select:none;';
    document.body.appendChild(t);
    var RUNES='ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ';
    var i=0;
    var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    function tick(){
      var el=document.getElementById('hl41-ticker');
      if(!el)return;
      var n=5,out='';
      for(var k=0;k<n;k++){out+=RUNES[(i+k)%RUNES.length]+' ';}
      i=(i+1)%RUNES.length;
      el.textContent=out.trim();
    }
    tick();
    if(!RM)setInterval(tick,2500);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);
  else start();
})();