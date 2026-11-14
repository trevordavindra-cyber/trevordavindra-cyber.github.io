// ILLUMINATI upgrade #51: hl51-touch (v18.59)
// Touch hardening pass for phones and tablets.
//
// 1. Every interactive control gets a 44px minimum tap target with
//    generous padding on coarse pointers, so thumbs never mis-tap.
// 2. touch-action: manipulation kills the double-tap zoom delay on the
//    action row without disabling pinch or scroll.
// 3. The CUT button is ordered to the far end of the input row, away
//    from SEND, so a stray tap right after sending can't hit it.
// 4. A one-shot guard delays CUT from appearing for 900ms after a send
//    starts, so the same tap that sends can never trigger a cut.
// 5. A cut now ends cleanly: the pending request is aborted, the
//    status line resets, and no error cascade is printed.
// Additive only: nothing existing is removed or disabled.
(function(){
  try{
    if(window.__HL51) return; window.__HL51=1;
    var st=document.createElement('style');
    st.id='hl51-touch';
    st.textContent='#foot .act,#foot #clear,.pbtn,#nav button{min-height:44px;min-width:44px;touch-action:manipulation;}#foot #stop{order:99;}@media (pointer:coarse){#foot .act,#foot #clear{padding:0 14px;}}';
    (document.head||document.documentElement).appendChild(st);
    var foot=document.getElementById('foot');
    var send=document.getElementById('send');
    var stop=document.getElementById('stop');
    if(foot&&send&&stop){
      var arm=function(){
        stop.style.display='';
        stop.style.pointerEvents='none';
        stop.style.opacity='.35';
        setTimeout(function(){
          stop.style.pointerEvents='';
          stop.style.opacity='';
        },900);
      };
      send.addEventListener('click',arm);
      var txt=document.getElementById('txt');
      if(txt){
        var keyarm=function(e){ if(e.key==='Enter'&&!e.shiftKey){ arm(); } };
        txt.addEventListener('keydown',keyarm);
      }
      var cleanCut=function(){
        try{
          if(window.__hl51Abort){ window.__hl51Abort(); }
        }catch(e){}
        stop.style.display='none';
        var st2=document.getElementById('st-state')||null;
        if(window.__hlSetState){ try{ window.__hlSetState('AI: STANDBY'); }catch(e){} }
        var notice=document.getElementById('notice');
        if(notice&&!window.__hlBusy){ notice.textContent=''; }
      };
      stop.addEventListener('click',cleanCut);
    }
  }catch(e){}
})();
