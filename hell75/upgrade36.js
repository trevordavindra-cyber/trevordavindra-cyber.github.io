// ILLUMINATI upgrade #36: hl36-uptime-badge (v18.42)
// Tiny bottom-left badge showing real session uptime, ticking every second.
// Additive, guarded, reduced-motion-safe (static text). Injected by overnight upgrade run.
(function(){
  if(!document||!document.body)return;
  var t0=Date.now();
  function start(){
    if(document.getElementById('hl36-uptime'))return;
    var b=document.createElement('div');
    b.id='hl36-uptime';
    b.style.cssText='position:fixed;left:12px;bottom:12px;z-index:9994;font-family:monospace;font-size:9px;'+
      'letter-spacing:1px;color:rgba(255,255,255,.45);background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.15);'+
      'border-radius:4px;padding:2px 6px;pointer-events:none;';
    document.body.appendChild(b);
    function tick(){
      var s=Math.floor((Date.now()-t0)/1000);
      var m=Math.floor(s/60),h=Math.floor(m/60);
      b.textContent='UPTIME '+String(h).padStart(2,'0')+':'+String(m%60).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
    }
    tick();
    setInterval(tick,1000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);
  else start();
})();