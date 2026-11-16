/* ILLUMINATI upgrade #130: hl130-send-polish (v19.37)
   SEND-AREA POLISH: the composer row goes soft and premium instead of blocky
   (rounded pills, gold SEND, clean labels without brackets), the green bottom
   line and the scanning line are gone, and the drawer opens with a plain dark
   scrim instead of a blur. Nothing else changes. __HL130 guard. */
(function(){
  try{
    if(window.__HL130) return; window.__HL130=1;
    var css=[
      '/* hide green bottom line + scan sweep + load meter */',
      '#hl7-bottom-border,#hl3-scan,#hl42-meter{display:none !important}',
      '/* drawer scrim: no blur */',
      '#ordscim{backdrop-filter:none !important;-webkit-backdrop-filter:none !important;background:rgba(0,0,0,.55) !important}',
      '/* composer row: soft, rounded, less blocky */',
      '#foot{gap:6px !important}',
      '#foot #txt{border-radius:18px !important}',
      '#foot button,#foot .act{border-radius:14px !important;font-weight:600 !important;letter-spacing:.04em !important;white-space:nowrap !important;transition:all .2s !important}',
      '#foot button{background:rgba(16,16,16,.72) !important;border:1px solid rgba(197,164,91,.2) !important;color:#C9C3B4 !important;box-shadow:none !important}',
      '#foot button:hover{border-color:rgba(197,164,91,.45) !important;background:rgba(197,164,91,.07) !important;color:#EAE5D9 !important}',
      '#foot #send{background:linear-gradient(135deg,#C5A45B,#8F7433) !important;color:#0B0A07 !important;border:1px solid rgba(197,164,91,.55) !important;box-shadow:0 4px 18px rgba(197,164,91,.18) !important}',
      '#foot #send:hover{filter:brightness(1.08) !important;background:linear-gradient(135deg,#C5A45B,#8F7433) !important;color:#0B0A07 !important}',
      '#foot #clear{border-color:transparent !important;background:rgba(21,21,21,.55) !important;color:#89857B !important}',
      '#foot #mic,#foot #stop{border-radius:50% !important;width:40px !important;height:40px !important;padding:0 !important}',
      '#foot #ordmodel,#foot .ordchip{border-radius:999px !important;white-space:nowrap !important;overflow:visible !important;padding:0 10px !important;max-width:none !important}',
      '#foot button:not(#mic):not(#stop):not(#send){padding:9px 12px !important}',
      '@media (max-width:820px){#foot button{font-size:12px !important;padding:8px 10px !important}#foot{gap:5px !important}}'
    ].join('\n');
    var s=document.createElement('style'); s.id='hl130-style'; s.textContent=css;
    (document.head||document.documentElement).appendChild(s);

    function polish(){
      var ids=['mic','send','stop','clear'];
      var n=0;
      for(var i=0;i<ids.length;i++){
        var b=document.getElementById(ids[i]);
        if(!b) continue;
        var t=(b.textContent||'').replace(/\[/g,'').replace(/\]/g,'').trim();
        if(t && t!==b.textContent){ b.textContent=t; n++; }
      }
      return n;
    }
    polish();
    var tries=0;
    var iv=setInterval(function(){
      tries++;
      var n=0; try{ n=polish(); }catch(e){}
      if(tries>30||(n===0&&tries>10)) clearInterval(iv);
    },2000);
  }catch(e){ try{console.log('[HL130]',e);}catch(_){} }
})();
