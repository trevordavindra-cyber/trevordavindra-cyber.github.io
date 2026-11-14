// ILLUMINATI upgrade #25: hl25-title-flicker (v18.31)
// Light flicker of the page title every 45 seconds, appending a trailing eye symbol for 2 seconds before reverting to the original.
// Additive only. Injected by overnight upgrade run.
(function(){if(typeof document==='undefined'||!document||!document.title){return;}var orig=document.title||'',eye=' 👁';setInterval(function(){document.title=orig+eye;setTimeout(function(){document.title=orig;},2000);},45000);})();