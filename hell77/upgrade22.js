// ILLUMINATI upgrade #22: hl22_scrollbar_flicker (v18.28)
// Briefly flashes scrollbars cyan every 30 seconds for 1 second.
// Additive only. Injected by overnight upgrade run.
(() => {
  if (typeof document === 'undefined' || !document.body) return;
  const css = '*::-webkit-scrollbar{background-color:cyan;color:cyan;} *{scrollbar-color:cyan transparent;}';
  const run = () => {
    const s=document.createElement('style'); s.id='hl22-scrollbar-flicker'; s.textContent=css;
    document.head.appendChild(s);
    setTimeout(()=>{ if (s.parentNode) s.parentNode.removeChild(s); },1000);
  };
  setInterval(run,30000);
})();
