// ILLUMINATI upgrade #17: Cursor Compass (v18.23)
// Adds a subtle directional cursor glow. Additive only. Injected by overnight upgrade run.
(function(){
  const style=document.createElement('style');
  style.textContent='.hl17-dot{position:fixed;width:6px;height:6px;border-radius:50%;background:cyan;pointer-events:none;mix-blend-mode:screen;z-index:9999;box-shadow:0 0 12px cyan;}';
  document.head.appendChild(style);
  const dot=document.createElement('div');
  dot.className='hl17-dot';
  document.body.appendChild(dot);
  document.addEventListener('mousemove',e=>{dot.style.left=(e.clientX-3)+'px';dot.style.top=(e.clientY-3)+'px';},{passive:true});
})();