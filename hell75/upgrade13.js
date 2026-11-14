// ILLUMINATI upgrade #13: hl13-title-blink (v18.19)
// Alternates the document title with a version every 2 seconds, subtle dynamic touch.
// Additive only. Injected by overnight upgrade run.
(function(){if(!window||!document)return;var base='ILLUMINATI';var alt='●ILLUMINATI';var on=true;setInterval(function(){try{document.title=on?base:alt;on=!on;}catch(e){}},2000);})();