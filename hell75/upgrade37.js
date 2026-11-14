// ILLUMINATI upgrade #37: hl37-key-hints (v18.43)
// Tiny bottom-center hint bar listing the hidden easter eggs. Purely informational.
// Additive, guarded, reduced-motion-safe (static text). Injected by overnight upgrade run.
(function(){
  if(!document||!document.body)return;
  function start(){
    if(document.getElementById('hl37-hints'))return;
    var h=document.createElement('div');
    h.id='hl37-hints';
    h.style.cssText='position:fixed;left:50%;transform:translateX(-50%);bottom:36px;z-index:9991;font-family:monospace;font-size:9px;'+
      'letter-spacing:1px;color:rgba(255,255,255,.30);background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.10);'+
      'border-radius:4px;padding:2px 8px;pointer-events:none;white-space:nowrap;';
    h.textContent='HIDDEN: ⌘ PALETTE • E-Y-E • O-R-A-C-L-E • ALT+SHIFT+O • 3-CLICK CORNER';
    document.body.appendChild(h);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);
  else start();
})();