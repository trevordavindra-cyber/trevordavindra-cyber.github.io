// ILLUMINATI upgrade #8: Session Timer Chip (v18.14)
// Adds a small corner chip that shows elapsed time since the page loaded (a tiny HUD stat). Self-creating element, additive only, does not touch existing features.
// Designed by Fo directly this cycle after relay failures (curl 000, then 402 FREE_LIMIT).
(function(){
  var d=document; if(!d) return;
  function init(){
    if(d.getElementById('hl8-session-chip')) return;
    var st=d.createElement('style');
    st.textContent='.hl8-session-chip{position:fixed;bottom:14px;left:14px;z-index:9000;font-family:inherit;font-size:10px;letter-spacing:1px;padding:4px 8px;border:1px solid rgba(255,255,255,0.18);border-radius:10px;background:rgba(0,0,0,0.45);color:rgba(255,255,255,0.65);pointer-events:none;text-transform:uppercase;}';
    d.head.appendChild(st);
    var chip=d.createElement('div'); chip.id='hl8-session-chip'; chip.className='hl8-session-chip'; chip.textContent='SESSION 0:00';
    d.body.appendChild(chip);
    var t0=Date.now();
    function tick(){
      var s=Math.floor((Date.now()-t0)/1000), m=Math.floor(s/60), r=s%60;
      var el=d.getElementById('hl8-session-chip'); if(!el) return;
      el.textContent='SESSION '+m+':'+(r<10?'0':'')+r;
    }
    setInterval(tick,1000);
  }
  if(d.readyState==='loading') d.addEventListener('DOMContentLoaded',init); else init();
})();
