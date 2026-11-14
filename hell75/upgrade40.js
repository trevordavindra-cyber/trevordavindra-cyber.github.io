// ILLUMINATI upgrade #40: hl40-moon-chip (v18.46)
// Tiny top-left chip showing the real current moon phase glyph, computed from the actual lunar cycle.
// Additive, guarded, reduced-motion-safe (static text). Injected by overnight upgrade run.
(function(){
  if(!document||!document.body)return;
  function start(){
    if(document.getElementById('hl40-moon'))return;
    var c=document.createElement('div');
    c.id='hl40-moon';
    c.style.cssText='position:fixed;top:34px;left:12px;z-index:9992;font-family:monospace;font-size:11px;'+
      'color:rgba(255,255,255,.5);background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.15);'+
      'border-radius:4px;padding:2px 6px;pointer-events:none;';
    document.body.appendChild(c);
    function phase(){
      var synodic=29.53058867;
      var known=Date.UTC(2000,0,6,18,14);
      var days=(Date.now()-known)/86400000;
      var p=((days%synodic)+synodic)%synodic;
      var f=p/synodic;
      var g;
      if(f<0.03||f>0.97)g='● NEW';
      else if(f<0.22)g='🌒';
      else if(f<0.28)g='◐ FIRST QUARTER';
      else if(f<0.47)g='🌔';
      else if(f<0.53)g='○ FULL';
      else if(f<0.72)g='🌖';
      else if(f<0.78)g='◔ LAST QUARTER';
      else g='🌘';
      var el=document.getElementById('hl40-moon');
      if(el)el.textContent='MOON '+g;
    }
    phase();
    setInterval(phase,3600000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);
  else start();
})();