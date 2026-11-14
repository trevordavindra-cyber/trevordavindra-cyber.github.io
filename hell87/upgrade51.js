// ILLUMINATI upgrade #51: hl51-touch (v18.59)
// Touch hardening pass: bigger tap targets on every interactive control,
// touch-action manipulation to kill double-tap-zoom on the action row,
// and the CUT button relocated to the far end of the input row so a
// stray thumb never hits it right after SEND. Additive only.
(function(){
  try{
    if(window.__HL51) return; window.__HL51=1;
    var st=document.createElement('style');
    st.id='hl51-touch';
    st.textContent='#foot .act,#foot #clear,.pbtn,#nav button{min-height:44px;min-width:44px;touch-action:manipulation;}#foot #stop{order:99;}@media (pointer:coarse){#foot .act,#foot #clear{padding:0 14px;}}';
    (document.head||document.documentElement).appendChild(st);
  }catch(e){}
})();
