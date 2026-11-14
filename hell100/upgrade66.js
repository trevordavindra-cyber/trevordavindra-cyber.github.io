// ILLUMINATI upgrade #66: hl66-heap-omen (v18.74)
// A left-edge chip reading "HEAP N MB" from the browser's real
// JavaScript heap usage (performance.memory, Chromium only).
// Read once at load and re-read every 60s; hides itself where the
// browser does not expose the heap. No app changes.
(function(){
  try{
    if(window.__HL66) return; window.__HL66=1;
    var m=performance.memory;
    if(!m||!m.usedJSHeapSize) return;
    var el=document.createElement('div');
    el.id='hl66-heap'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:138px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(80,220,220,.5);text-shadow:0 0 6px rgba(40,200,200,.2);user-select:none;white-space:nowrap;');
    (document.body||document.documentElement).appendChild(el);
    function upd(){
      try{
        var mb=Math.round(m.usedJSHeapSize/1048576);
        el.textContent=mb?('HEAP '+mb+' MB'):'';
      }catch(e){ el.textContent=''; }
    }
    upd();
    try{ setInterval(upd,60000); }catch(e){}
  }catch(e){}
})();
