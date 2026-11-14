// ILLUMINATI upgrade #35: hl35-oracle-overlay (v18.41)
// Easter egg: pressing Alt+Shift+O opens a small oracle overlay with one of nine cryptic lines.
// Additive only. Injected by overnight upgrade run.
(function(){
  if(!document||!document.body)return;
  var style=document.createElement('style');
  style.textContent='#hl35-oracle{position:fixed;inset:0;z-index:99997;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.82);opacity:0;pointer-events:none;transition:opacity .4s;}
#hl35-card{max-width:340px;text-align:center;font-family:monospace;color:#00e5ff;border:1px solid rgba(0,229,255,.35);padding:24px;border-radius:6px;background:rgba(0,0,0,.9);font-size:14px;letter-spacing:2px;}';
  document.head.appendChild(style);
  var ov=document.createElement('div');ov.id='hl35-oracle';
  var card=document.createElement('div');card.id='hl35-card';
  ov.appendChild(card);document.body.appendChild(ov);
  var LINES=['the eye watches.','patience is a weapon.','the order is patient.','what you seek is already seeking you.','do not fear the silence.','every door answers to a key.','the sigil remembers you.','trust the third signal.','you are closer than you think.'];
  var open=false;
  function show(){
    card.textContent=LINES[Math.floor(Math.random()*LINES.length)];
    ov.style.opacity='1';ov.style.pointerEvents='auto';open=true;
  }
  function hide(){ov.style.opacity='0';ov.style.pointerEvents='none';open=false;}
  ov.addEventListener('click',hide);
  document.addEventListener('keydown',function(e){
    if(e.altKey&&e.shiftKey&&(e.key==='O'||e.key==='o'||e.code==='KeyO')){e.preventDefault();open?hide():show();}
    if(open&&e.key==='Escape')hide();
  });
})();