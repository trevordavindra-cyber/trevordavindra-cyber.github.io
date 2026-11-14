// ILLUMINATI upgrade #62: hl62-hoard-omen (v18.70)
// A lower-left chip (next slot under the visit counter) that reads
// "HOARD N" — how much this browser's origin storage actually holds
// (vault, memory, settings, everything the order keeps). One async
// read at load via navigator.storage.estimate(); no timers, no
// listeners, pointer-events none. Hides itself if the browser
// refuses the estimate.
(function(){
  try{
    if(window.__HL62) return; window.__HL62=1;
    var el=document.createElement('div');
    el.id='hl62-hoard'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:106px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(80,220,220,.5);text-shadow:0 0 6px rgba(40,200,200,.2);user-select:none;white-space:nowrap;');
    el.textContent='HOARD —';
    (document.body||document.documentElement).appendChild(el);
    function fmt(b){
      if(b>=1048576) return (b/1048576).toFixed(1)+' MB';
      if(b>=1024) return Math.round(b/1024)+' KB';
      return b+' B';
    }
    if(navigator.storage && navigator.storage.estimate){
      navigator.storage.estimate().then(function(est){
        el.textContent='HOARD '+fmt(est.usage||0);
      }).catch(function(){ el.textContent=''; });
    } else { el.textContent=''; }
  }catch(e){}
})();
