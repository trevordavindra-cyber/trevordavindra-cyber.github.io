// ILLUMINATI upgrade #34: hl34-trail-trail (v18.40)
// A short fading cursor trail of tiny red embers behind the pointer.
// Additive, guarded, respects prefers-reduced-motion (no trail). Injected by overnight upgrade run.
(function(){
  if(!document||!document.body)return;
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var style=document.createElement('style');
  style.textContent='.hl34-ember{position:fixed;width:3px;height:3px;border-radius:50%;background:rgba(220,40,40,.7);pointer-events:none;z-index:9997;box-shadow:0 0 5px rgba(220,40,40,.5);animation:hl34fade .7s ease-out forwards;}@keyframes hl34fade{0%{opacity:.8;transform:scale(1)}100%{opacity:0;transform:scale(.2)}}';
  document.head.appendChild(style);
  var last=0;
  document.addEventListener('mousemove',function(e){
    var now=performance.now();
    if(now-last<50)return;
    last=now;
    var ember=document.createElement('span');
    ember.className='hl34-ember';
    ember.style.left=(e.clientX-1)+'px';
    ember.style.top=(e.clientY-1)+'px';
    document.body.appendChild(ember);
    setTimeout(function(){if(ember.parentNode)ember.parentNode.removeChild(ember);},750);
  },{passive:true});
})();