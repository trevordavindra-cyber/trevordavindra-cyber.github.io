// ILLUMINATI upgrade #26: hl26_vignette (v18.32)
// Adds a subtle radial vignette pulse after 30 seconds, fading out over 3 seconds.
// Additive only. Injected by overnight upgrade run.
(function(){var f=function(){if(!document.body)return;document.body.style.transition='background 3s ease';document.body.style.background='radial-gradient(circle at center, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 70%)';setTimeout(function(){document.body.style.background='';},3000);};setTimeout(f,30000);})();