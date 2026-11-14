// ILLUMINATI upgrade #29: hl29-grid-drift (v18.35)
// Faint blue grid overlay drifting diagonally behind content, like a slow oscilloscope sweep.
// Additive only; guarded; respects prefers-reduced-motion. Injected by overnight upgrade run.
(function(){
  if(!document||!document.body)return;
  if(document.getElementById('hl29-grid'))return;
  var style=document.createElement('style');
  style.textContent='#hl29-grid{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.14;background-image:linear-gradient(rgba(0,229,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,.5) 1px,transparent 1px);background-size:48px 48px;}@keyframes hl29drift{0%{background-position:0 0}100%{background-position:48px 48px}}@media (prefers-reduced-motion:reduce){#hl29-grid{animation:none}}';
  document.head.appendChild(style);
  var g=document.createElement('div');g.id='hl29-grid';document.body.appendChild(g);
  if(window.matchMedia&&!matchMedia('(prefers-reduced-motion: reduce)').matches){g.style.animation='hl29drift 8s linear infinite';}
})();