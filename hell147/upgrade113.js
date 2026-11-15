/* ILLUMINATI upgrade #113: hl113-mobile-fixes (v19.21)
   Two phone fixes, desktop untouched:
   1) the bottom input box (#txt): on phones its text was oversized and the
      placeholder wrapped onto two clipped lines. Now: 15px text, one 44px
      line, vertically centered, and on small screens the placeholder reads
      "ENTER QUERY…" so it always fits. Desktop keeps the full placeholder.
   2) the REA quick-open buttons (rea · REA itself / llama.cpp): rewired the
      bulletproof way. Old listeners are fully cleared (nodes are cloned), a
      MutationObserver re-wires anything re-rendered later, and every press
      gives instant visible feedback (loading line + scroll to results).
      Wiring uses the upgrade112 engine (window.HL112) so no logic is copied.
*/
(function(){
  if(window.__HL113) return; window.__HL113=true;
  function $(id){return document.getElementById(id);}
  function el(t,c,h){var e=document.createElement(t); if(c)e.className=c; if(h!=null)e.innerHTML=h; return e;}

  /* ---- 1) input box fits on phones ---- */
  var css=el('style'); css.id='hl113-style';
  css.textContent=[
    '@media (max-width:820px){',
    ' #txt{font-size:15px !important;line-height:1.3 !important;height:44px !important;min-height:44px !important;max-height:44px !important;padding:8px 12px !important;overflow:hidden !important;box-sizing:border-box !important;}',
    ' #foot{align-items:center !important;}',
    '}',
    '#rea-quick button{touch-action:manipulation;-webkit-tap-highlight-color:transparent;}',
    '#rea-quick button:active{filter:brightness(1.6);}'
  ].join('\n');
  (document.head||document.documentElement).appendChild(css);

  var ORIGPH=null;
  function fixPh(){
    var t=$('txt'); if(!t)return;
    if(ORIGPH===null)ORIGPH=t.placeholder||'';
    var m=window.matchMedia&&window.matchMedia('(max-width:820px)').matches;
    var want=m?'ENTER QUERY…':ORIGPH;
    if(t.placeholder!==want)t.placeholder=want;
  }
  fixPh();
  window.addEventListener('resize',fixPh);

  /* ---- 2) REA wiring that cannot go stale ---- */
  var QUICK=[{o:'morluto',r:'rea'},{o:'ggml-org',r:'llama.cpp'}];
  function api(){return window.HL112;}
  function wireQuick(b){
    var txt=(b.textContent||'').trim().toLowerCase();
    var d=txt.indexOf('llama')===0?QUICK[1]:QUICK[0];
    var n=b.cloneNode(true);
    n.dataset.hl113='1';
    n.onclick=function(){
      var A=api(); if(!A)return;
      var meta=$('rea-meta'); if(meta)meta.innerHTML='<b>'+d.o+'/'+d.r+'</b> — loading…';
      var res=$('rea-results')||$('rea-meta');
      if(res&&res.scrollIntoView){try{res.scrollIntoView({block:'start',behavior:'smooth'});}catch(e){}}
      A.openRepo(d.o,d.r);
    };
    if(b.parentNode)b.parentNode.replaceChild(n,b);
  }
  function cloneWire(id,fn){
    var b=$(id); if(!b||b.dataset.hl113)return;
    var n=b.cloneNode(true);
    n.dataset.hl113='1'; n.onclick=fn;
    if(b.parentNode)b.parentNode.replaceChild(n,b);
  }
  function wireAll(){
    var A=api(); if(!A)return false;
    var q=$('rea-q');
    if(q&&!q.dataset.hl113){
      var nq=q.cloneNode(true); nq.dataset.hl113='1';
      nq.onkeydown=function(e){if(e.key==='Enter')A.search();};
      if(q.parentNode)q.parentNode.replaceChild(nq,q);
    }
    var filt=$('rea-filt');
    if(filt&&!filt.dataset.hl113){
      var nf=filt.cloneNode(true); nf.dataset.hl113='1';
      nf.onkeydown=function(e){if(e.key==='Enter'){A.reset();A.render(nf.value||'');}};
      if(filt.parentNode)filt.parentNode.replaceChild(nf,filt);
    }
    cloneWire('rea-go',function(){A.search();});
    cloneWire('rea-fb',function(){A.reset();A.render(($('rea-filt')||{}).value||'');});
    cloneWire('rea-cat',function(){A.catalog();});
    var quick=$('rea-quick');
    if(quick){
      var bs=quick.querySelectorAll('button');
      for(var i=0;i<bs.length;i++){ if(!bs[i].dataset.hl113)wireQuick(bs[i]); }
    }
    return !!quick;
  }
  var tries=0;
  (function boot(){
    if(wireAll())return;
    if(++tries<120)setTimeout(boot,250);
  })();
  /* anything re-rendered later gets wired the moment it appears */
  var mo=new MutationObserver(function(){wireAll();});
  setTimeout(function(){var s=$('m-rea')||document.body; if(s)mo.observe(s,{childList:true,subtree:true});},1200);
})();
