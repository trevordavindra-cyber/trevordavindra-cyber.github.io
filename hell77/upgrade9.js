// ILLUMINATI upgrade #9: hl9-title-twinkle (v18.15)
// Adds a subtle, periodic twinkling effect to the browser tab title, optionally prefixing with a star symbol for visual interest.
// Additive only. Injected by overnight upgrade run.
(()=>{function init(){const b=document.title||'';let s=!1;const i=setInterval(()=>{document.title=s?b:'✦'+b;s=!s;},800);}if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}})();
