// ILLUMINATI upgrade #18: hl18-parallax-eye (v18.24)
// A faint decorative eye glyph floats in the corner and drifts a few pixels opposite mouse movement.
// Additive only, self-designed (relay failed twice: 400 output_token_limit_exceeded). Injected by overnight upgrade run.
(function(){
  if(!document||!document.body)return;
  var d=document,g=document.createElement('div');
  g.id='hl18-eye';
  var s=g.style;
  s.position='fixed';s.top='12%';s.right='6%';s.fontSize='42px';s.color='rgba(0,229,255,.12)';
  s.pointerEvents='none';s.zIndex='1';s.userSelect='none';s.transition='transform .25s ease-out';
  g.textContent='👁';d.body.appendChild(g);
  d.addEventListener('mousemove',function(e){
    if(!e)return;
    var x=(e.clientX/d.documentElement.clientWidth-.5)*-12;
    var y=(e.clientY/d.documentElement.clientHeight-.5)*-12;
    g.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px)';
  },{passive:true});
})();