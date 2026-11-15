/* ILLUMINATI upgrade #111: hl111-mobile-display (v19.19)
   PHONE DISPLAY FIX - on phone-width screens the decorative fixed HUD chips
   (uptime, local time, moon phase, hidden corners, zodiac, tarot, vigil,
   witching, the floating quote widget and the RESTRICTED banner) stack on
   top of the app and bury the UI. On narrow viewports this hides the
   decoration layer only and keeps the bottom bar clean; desktop and tablets
   keep everything exactly as before. Additive only, no functionality removed.
   __HL111 guard. */
(function(){
  try{
    if(window.__HL111) return; window.__HL111=1;
    var css = [
      '@media (max-width: 820px){',
      '  [style*="position:fixed"][aria-hidden="true"]{display:none !important;}',
      '  [id^="hl"][style*="position:fixed"]{display:none !important;}',
      '  [title="Session uptime"],[title="Hidden corners of the OS"],[title="Local time"],[title="Moon phase"]{display:none !important;}',
      '  #illuminati-quote-widget{display:none !important;}',
      '  #class{display:none !important;}',
      '  #foot{display:flex;align-items:center;gap:6px;z-index:9600;}',
      '  #txt{flex:1 1 auto;min-width:0;width:auto;}',
      '  #feed{padding-bottom:96px;}',
      '}'
    ].join('\n');
    var s=document.createElement('style');
    s.id='hl111-style'; s.textContent=css;
    (document.head||document.documentElement).appendChild(s);
  }catch(e){}
})();
