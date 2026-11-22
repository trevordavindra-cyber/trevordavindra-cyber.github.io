/* deepagent25 up4.js - upgrade pack 4: regenerate the last reply (v1.1) */
(function(){
var CH=document.getElementById('chat');
if(!CH||!window.CG){console.log('[up4.js v1.0] core api missing, upgrade inert');return}
function regen(){
 var h=CG.hist();var last=-1;for(var i=0;i<h.length;i++){if(h[i].role==='user')last=i}
 if(last<0)return;var txt=h[last].content;
 var msgs=CH.querySelectorAll('.msg');var lastYou=null;
 for(var k=msgs.length-1;k>=0;k--){if(msgs[k].classList.contains('you')){lastYou=msgs[k];break}}
 if(lastYou){var n=lastYou;while(n){var nx=n.nextSibling;CH.removeChild(n);n=nx}}
 CG.load(h.slice(0,last));
 var inp=document.getElementById('inp');inp.value=txt;
 document.getElementById('send').click();
}
function addBtn(d){
 var b=document.createElement('button');b.title='regenerate reply';b.className='up4regen';
 b.style.cssText='display:inline-flex;align-items:center;gap:6px;color:var(--dim);font-size:12px;padding:4px 8px;margin:2px 0 12px;border-radius:8px;cursor:pointer';
 b.innerHTML='<svg viewBox="0 0 24 24" style="width:14px;height:14px"><path d="M4 10a8 8 0 1 1 2.3 6.3M4 10V5M4 10h5"/></svg>regenerate';
 b.onclick=function(ev){ev.stopPropagation();regen()};
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
console.log('[chatgpt up4.js v1.1] regenerate loaded');
})();
