/* ILLUMINATI upgrade #126: hl126-invite-mobile (v19.35)
   PHONE FIX - the hl111 phone-display rule ([id^="hl"]:not(#hlthemes){display:none!important},
   specificity (1,1,0)) also matched the invitation overlay #hl124, so on screens <=820px
   the intro vanished while #gate was held hidden by hl124-wait: black screen.
   Re-shows ONLY #hl124 on phones with higher-specificity selectors; every other
   element hl111 hides stays hidden. Additive only, no functionality removed. __HL126 guard. */
(function(){
  try{
    if(window.__HL126) return; window.__HL126=1;
    var SHOW='#hl124{display:flex !important;visibility:visible !important;opacity:1 !important;}';
    var css='@media (max-width:820px){\n  :root body '+SHOW+'\n}\n'
           +':root.hl111-mobile body '+SHOW+'\n';
    var s=document.createElement('style'); s.id='hl126-style'; s.textContent=css;
    (document.head||document.documentElement).appendChild(s);
  }catch(e){}
})();
