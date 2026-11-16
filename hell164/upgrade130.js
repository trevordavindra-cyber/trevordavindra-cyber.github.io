/* ILLUMINATI upgrade #130: hl130-send-polish (v19.37)
   SEND-AREA POLISH: composer row goes soft and premium instead of blocky
   (rounded pills, gold SEND, clean labels, chips never clipped), the green
   bottom line and the scanning line are gone, and the drawer opens with a
   plain dark scrim instead of a blur. Nothing else changes. __HL130 guard. */
(function(){
  try{
    if(window.__HL130) return; window.__HL130=1;
    var css=[
      '/* hide green bottom line + scan sweep + load meter */',
      '#hl7-bottom-border,#hl3-scan,#hl42-meter{display:none !important}',
      '#pgp{border-top:none !important;border-bottom:none !important}',
      '/* drawer scrim: no blur */',
      '#ordscim{backdrop-filter:none !important;-webkit-backdrop-filter:none !important;background:rgba(0,0,0,.55) !important}',
      '/* suggestion chips: never clipped */',
      '#sugs{overflow-x:auto !important;-webkit-overflow-scrolling:touch !important;scrollbar-width:none !important;padding:0 12px !important}',
      '#sugs::-webkit-scrollbar{display:none !important}',
      '#sugs>*{flex:0 0 auto !important;white-space:nowrap !important;max-width:none !important}',
      '#foot{gap:6px !important}',
      '@media (max-width:820px){#foot button{font-size:12px !important}#foot{gap:5px !important}}'
    ].join('\n');
    var s=document.createElement('style'); s.id='hl130-style'; s.textContent=css;
    (document.head||document.documentElement).appendChild(s);

    function set(id,props){
      var el=document.getElementById(id); if(!el) return 0;
      var n=0;
      for(var k in props){ try{ el.style.setProperty(k,props[k],'important'); n++; }catch(e){} }
      return n;
    }
    function polish(){
      var n=0;
      n+=set('send',{'border-radius':'14px','background':'linear-gradient(135deg,#C5A45B,#8F7433)','color':'#0B0A07','border':'1px solid rgba(197,164,91,.55)','box-shadow':'0 4px 18px rgba(197,164,91,.18)','font-weight':'600','padding':'9px 14px','letter-spacing':'.04em'});
      n+=set('mic',{'border-radius':'50%','width':'40px','height':'40px','padding':'0','background':'rgba(16,16,16,.72)','border':'1px solid rgba(197,164,91,.2)','color':'#C9C3B4'});
      n+=set('stop',{'border-radius':'50%','width':'40px','height':'40px','padding':'0','background':'rgba(16,16,16,.72)','border':'1px solid rgba(197,164,91,.2)','color':'#C9C3B4'});
      n+=set('clear',{'border-radius':'14px','background':'rgba(21,21,21,.55)','border':'1px solid rgba(197,164,91,.14)','color':'#89857B','font-weight':'600','padding':'9px 12px'});
      n+=set('txt',{'border-radius':'18px'});
      var om=document.getElementById('ordmodel');
      if(om){ om.style.setProperty('border-radius','999px','important'); om.style.setProperty('white-space','nowrap','important'); om.style.setProperty('max-width','none','important'); om.style.setProperty('padding','0 10px','important'); n++; }
      return n;
    }
    function labels(){
      var ids=['mic','send','stop','clear'];
      var n=0;
      for(var i=0;i<ids.length;i++){
        var b=document.getElementById(ids[i]); if(!b) continue;
        var t=(b.textContent||'').replace(/\[/g,'').replace(/\]/g,'').trim();
        if(t && t!==b.textContent){ b.textContent=t; n++; }
      }
      return n;
    }
    polish(); labels();
    var tries=0;
    var iv=setInterval(function(){
      tries++;
      var n=0;
      try{ n=polish()+labels(); }catch(e){}
      if(tries>45||(n===0&&tries>12)) clearInterval(iv);
    },2000);
  }catch(e){ try{console.log('[HL130]',e);}catch(_){} }
})();
