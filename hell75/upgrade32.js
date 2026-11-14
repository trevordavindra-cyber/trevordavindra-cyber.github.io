// ILLUMINATI upgrade #32: hl32-type-the-eye (v18.38)
// Easter egg: typing E-Y-E anywhere on the page triggers a brief 'THE EYE IS OPEN' overlay.
// Additive only. Injected by overnight upgrade run.
(function(){
  if(!document||!document.body)return;
  var buf='';
  var style=document.createElement('style');
  style.textContent='#hl32-eye-overlay{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:99999;background:rgba(0,0,0,.75);color:#00e5ff;font-family:monospace;font-size:28px;letter-spacing:6px;opacity:0;transition:opacity .5s;pointer-events:none;}';
  document.head.appendChild(style);
  var ov=document.createElement('div');
  ov.id='hl32-eye-overlay';
  ov.textContent='THE EYE IS OPEN';
  document.body.appendChild(ov);
  var shown=false;
  document.addEventListener('keydown',function(e){
    if(e.key&&e.key.length===1){
      buf=(buf+e.key.toUpperCase()).slice(-3);
      if(buf==='EYE'&&!shown){
        shown=true;
        ov.style.opacity='1';
        setTimeout(function(){ov.style.opacity='0';shown=false;},2500);
      }
    }
  });
})();