/* ILLUMINATI upgrade #129: hl129-institutional-polish (v19.36)
   INSTITUTIONAL REDESIGN - polish layer (pairs with hl127/hl128).
   Consolidates the scattered fixed HUD stat chips into one tidy TELEMETRY block at the
   bottom of the sidebar: every widget stays alive and updating, nothing is removed.
   Sweeps periodically because several chips are created after the gate opens.
   Restyles the existing quick-prompt chips. __HL129 guard. */
(function(){
  try{
    if(window.__HL129) return; window.__HL129=1;
    var css=[
      '#ordtele{display:flex;flex-direction:column;gap:1px;padding:8px 2px 2px;border-top:1px solid rgba(197,164,91,.12);margin-top:12px;max-height:34vh;overflow-y:auto;scrollbar-width:thin}',
      '#ordtele::-webkit-scrollbar{width:4px}#ordtele::-webkit-scrollbar-thumb{background:rgba(197,164,91,.25);border-radius:2px}',
      'body.ord-rail #ordtele{display:none}',
      '.ordtel{position:static !important;left:auto !important;top:auto !important;right:auto !important;bottom:auto !important;width:auto !important;height:auto !important;min-width:0 !important;min-height:0 !important;max-width:none !important;transform:none !important;margin:0 !important;padding:1px 0 !important;background:none !important;border:none !important;border-radius:0 !important;box-shadow:none !important;backdrop-filter:none !important;-webkit-backdrop-filter:none !important;font:9px \'JetBrains Mono\',monospace !important;letter-spacing:.08em !important;color:#6b675c !important;opacity:.9 !important;display:block !important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;filter:none !important;text-shadow:none !important;animation:none !important}',
      '.ordtel b,.ordtel i,.ordtel em{color:#89857b !important;font-style:normal !important}',
      '#sugs{display:flex;gap:8px;flex-wrap:wrap;padding:2px 0 4px}',
      '#sugs button,#chips button{background:rgba(21,21,21,.72);border:1px solid rgba(197,164,91,.22);color:#C9C3B4;font-family:Inter,sans-serif;font-size:12px;padding:9px 14px;border-radius:11px;cursor:pointer;transition:all .2s}',
      '#sugs button:hover,#chips button:hover{border-color:rgba(197,164,91,.5);background:rgba(197,164,91,.07);color:#EAE5D9}',
      '#nav button::after,#nav button::before{content:none !important}',
      '#nav button,#nav button.on{box-shadow:none !important}'
    ].join('\n');
    var s=document.createElement('style'); s.id='hl129-style'; s.textContent=css;
    (document.head||document.documentElement).appendChild(s);

    var TEL=['hl105','hl104','hl103','hl102','hl101','hl100','hl106','hl99','hl97','hl98','hl96','hl78','hl64','hl66','hl65','hl108','hl89','hl70','hl94','hl91','hl90','hl36','hl71','hl92','hl93','hl84','hl74','hl82','hl86','hl55','hl80','hl79','hl77','hl76','hl88','hl40','hl75','hl81','hl41','hl49','hl83','hl85','hl87','hl69','hl73','hl67','hl68','hl47','hl39','hl48','hl45','hl52','hl53','hl63','hl31','hl54','hl8','hl60','hl62','hl43','illuminati-quote-widget','hl37','hl27','hl56','hl57','hl58','hl59','hl61','hl72'];
    function ensure(){
      var nav=document.getElementById('nav'); if(!nav) return false;
      var box=document.getElementById('ordtele');
      if(!box){
        var fold=document.getElementById('ordfold');
        var g=document.createElement('div'); g.className='ordg'; g.textContent='TELEMETRY';
        box=document.createElement('div'); box.id='ordtele';
        if(fold){ nav.insertBefore(g,fold); nav.insertBefore(box,fold); }
        else { nav.appendChild(g); nav.appendChild(box); }
      }
      var n=0;
      for(var i=0;i<TEL.length;i++){
        var el=null; try{el=document.getElementById(TEL[i]);}catch(e){}
        if(!el||el.closest('#ordtele')) continue;
        el.classList.add('ordtel'); box.appendChild(el); n++;
      }
      return n;
    }
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){try{ensure();}catch(e){}});
    else try{ensure();}catch(e){}
    var tries=0;
    var iv=setInterval(function(){
      tries++;
      var moved=0;
      try{ moved=ensure()||0; }catch(e){}
      if(tries>40||(moved===0&&tries>12)){ clearInterval(iv); }
    },1500);
  }catch(e){ try{console.log('[HL129]',e);}catch(_){} }
})();
