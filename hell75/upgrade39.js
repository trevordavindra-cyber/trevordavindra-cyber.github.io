// ILLUMINATI upgrade #39: hl39-clock-chip (v18.45)
// Tiny top-right clock chip showing real local time, ticking every second.
// Additive, guarded, reduced-motion-safe (text only). Injected by overnight upgrade run.
(function(){
  if(!document||!document.body)return;
  function start(){
    if(document.getElementById('hl39-clock'))return;
    var c=document.createElement('div');
    c.id='hl39-clock';
    c.style.cssText='position:fixed;top:12px;right:12px;z-index:9995;font-family:monospace;font-size:10px;'+
      'letter-spacing:1px;color:rgba(0,229,255,.75);background:rgba(0,0,0,.55);border:1px solid rgba(0,229,255,.25);'+
      'border-radius:4px;padding:3px 8px;pointer-events:none;';
    document.body.appendChild(c);
    function tick(){
      var d=new Date();
      var h=d.getHours(),m=d.getMinutes(),s=d.getSeconds();
      var ap=h>=12?'PM':'AM';
      h=h%12||12;
      c.textContent=String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')+' '+ap;
    }
    tick();
    setInterval(tick,1000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);
  else start();
})();