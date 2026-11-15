/* ILLUMINATI upgrade #111: hl111-mobile-display (v19.19)
   PHONE DISPLAY FIX - on phone-width screens the decorative fixed HUD chips
   (uptime, session, local time, moon, fps, synapse, view/ram/batt vitals,
   zodiac, tarot, midnight, vigil, keystrokes, the floating quote widget and
   the RESTRICTED banner) stack on top of the app and bury the UI.
   Two independent switches, either one alone is enough:
   1) a max-width:820px media query, and
   2) a html.hl111-mobile class driven from window.innerWidth (resize-aware).
   Hides the decoration layer only; desktop and tablets keep everything.
   The SET tab's THEME STUDIO row (#hlthemes) is functional and stays.
   Additive only, no functionality removed. __HL111 guard. */
(function(){
  try{
    if(window.__HL111) return; window.__HL111=1;
    var RULES=[
      '[id^="hl"]:not(#hlthemes){display:none !important;}',
      '#illuminati-quote-widget{display:none !important;}',
      '#class{display:none !important;}',
      '#foot{display:flex;align-items:center;gap:6px;z-index:9600;}',
      '#txt{flex:1 1 auto;min-width:0;width:auto;}',
      '#feed{padding-bottom:96px;}'
    ];
    var mq=RULES.map(function(r){return '  '+r;}).join('\n');
    var css='@media (max-width: 820px){\n'+mq+'\n}\n'
           +RULES.map(function(r){return 'html.hl111-mobile '+r;}).join('\n');
    var s=document.createElement('style');
    s.id='hl111-style'; s.textContent=css;
    (document.head||document.documentElement).appendChild(s);
    function apply(){
      try{
        var m=window.innerWidth&&window.innerWidth<=820;
        if(m){document.documentElement.classList.add('hl111-mobile');}
        else{document.documentElement.classList.remove('hl111-mobile');}
      }catch(e){}
    }
    apply();
    window.addEventListener('resize',apply,{passive:true});
    window.addEventListener('orientationchange',apply);
  }catch(e){}
})();
