// ILLUMINATI upgrade #17: hl17-double-click-outline (v18.23)
// Double-click pulses the document outline with a subtle cyan box-shadow for 1 second.
// Additive only. Injected by overnight upgrade run.
(()=>{if(!document||!document.documentElement)return;const el=document.documentElement;el.addEventListener('dblclick',()=>{el.style.boxShadow='0 0 10px 3px cyan';setTimeout(()=>{el.style.boxShadow=''},1000);});})();