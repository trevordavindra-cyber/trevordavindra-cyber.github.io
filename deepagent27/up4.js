/* deepagent25 up4.js - upgrade pack 4: regenerate the last reply (v1.2) */
(function(){
var CH=document.getElementById('chat');
if(!CH||!window.CG){console.log('[up4.js v1.0] core api missing, upgrade inert');return}
function regen(){
 try{
  var h=CG.hist();var last=-1;for(var i=0;i<h.length;i++){if(h[i].role==='user')last=i}
  console.log('[up4] regen fired, hist',h.length,'last',last);
  if(last<0)return;var txt=h[last].content;
  var yus=CH.querySelectorAll('.you');var lastYou=yus.length?yus[yus.length-1]:null;
  if(lastYou){var p=lastYou.parentNode;var n=lastYou;while(n){var nx=n.nextSibling;p.removeChild(n);n=nx}console.log('[up4] old tail removed')}
  try{CG.load(h.slice(0,last))}catch(e){console.log('[up4] load err',e&&e.message)}
  var inp=document.getElementById('inp');inp.value=txt;
  document.getElementById('send').click();
  console.log('[up4] resubmitted');
 }catch(e){console.log('[up4] regen error',e&&e.message)}
}
function addBtn(d){
 var b=document.createElement('button');b.title='regenerate reply';b.className='up4regen';
 b.style.cssText='display:inline-flex;align-items:center;gap:6px;color:var(--dim);font-size:12px;padding:4px 8px;margin:2px 0 12px;border-radius:8px;cursor:pointer;background:transparent;border:0';
 b.innerHTML='<svg viewBox="0 0 24 24" style="width:14px;height:14px"><path d="M4 10a8 8 0 1 1 2.3 6.3M4 10V5M4 10h5"/></svg>regenerate';
 var sg=d.querySelector('.sugg');if(sg)d.insertBefore(b,sg);else d.appendChild(b);
}
function hook(){
 var ais=CH.querySelectorAll('.msg.ai');
 for(var i=0;i<ais.length;i++){var d=ais[i];if(d.getAttribute('data-u4'))continue;
  if(!d.querySelector('.acts')){setTimeout(hook,300);return}
  d.setAttribute('data-u4','1');addBtn(d)}
}
new MutationObserver(function(){setTimeout(hook,0)}).observe(CH,{childList:true,subtree:true});
hook();
document.addEventListener('click',function(ev){var t=ev.target;if(!t||!t.closest)return;var b=t.closest('.up4regen');if(!b)return;ev.preventDefault();ev.stopPropagation();regen()},true);
console.log('[chatgpt up4.js v1.2] regenerate loaded');
})();
