// ILLUMINATI upgrade #5: hl5-hud-flicker (v18.11)
// Adds subtle HUD micro‑interaction: every minute the clock digits briefly flicker, defensive IIFE checks for element and DOM readiness.
// Additive only. Injected by overnight upgrade run.
(function(){var h=document.getElementById('clock');if(!h)return;function f(){h.style.transition='color .1s';h.style.color='inherit';setTimeout(()=>{h.style.color='transparent'},200);}function t(){var d=new Date();if(d.getSeconds()%60===0){f()}}setInterval(t,1000);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',t);else t();})();
