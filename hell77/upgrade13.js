// ILLUMINATI upgrade #13: Click Counter Expose (v18.19)
// Tracks number of clicks during the visit and stores the count on window.hl13ClickCount.
// Additive only. Injected by overnight upgrade run.
(()=>{if(typeof window!=='object'||!document)return;let count=0;const update=()=>{window.hl13ClickCount=count;};document.addEventListener('click',()=>{count++;update();});window.hl13ClickCount=0;})();
