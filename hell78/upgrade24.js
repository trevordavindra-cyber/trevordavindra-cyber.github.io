// ILLUMINATI upgrade #24: hl24_scanline_flash (v18.30)
// One-time thin scan line sweep down screen after 20 s
// Additive only. Injected by overnight upgrade run.
(()=>{const el=document.createElement('div');el.style.cssText='position:fixed;top:-100%;left:0;width:100%;height:1px;background:#66ff00;pointer-events:none;z-index:9999;';if(!document.body)return;document.body.appendChild(el);setTimeout(()=>{el.style.transition='top 0.5s linear';el.style.top='100%';},20000);setTimeout(()=>{document.body.removeChild(el);},21000);})();