// ILLUMINATI upgrade #8: Session Timer Chip (v18.14)
// Adds a small chip in the bottom-left showing elapsed time since session start.
// Additive only. Injected by overnight upgrade run.
(function(){
  const start=Date.now();
  function fmt(ms){
    const s=Math.floor(ms/1000),m=Math.floor(s/60),h=Math.floor(m/60);
    return String(h).padStart(2,'0')+':'+String(m%60).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
  }
  function init(){
    if(document.getElementById('hl8-timer'))return;
    const chip=document.createElement('div');
    chip.id='hl8-timer';
    chip.textContent='SESSION 00:00:00';
    chip.style.cssText='position:fixed;bottom:14px;left:14px;z-index:9990;font-family:monospace;font-size:10px;letter-spacing:1px;color:rgba(255,255,255,.55);background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.15);border-radius:4px;padding:2px 6px;pointer-events:none;';
    document.body.appendChild(chip);
    setInterval(function(){const el=document.getElementById('hl8-timer');if(el)el.textContent='SESSION '+fmt(Date.now()-start);},1000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();