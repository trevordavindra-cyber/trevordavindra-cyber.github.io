/* deepagent34 up13.js - upgrade pack 13: read replies aloud (v1.0) */
(function(){
if(!window.CG){console.log('[up13.js v1.0] core api missing, upgrade inert');return}
var ur=document.getElementById('upd');
if(ur){var vv=ur.querySelector('.val');if(vv)vv.textContent='2.9.12(19)';ur.onclick=function(){sys('2.9.12(19) - you are up to date')}}
function toast(t){try{if(typeof sys==='function'){sys(t)}else{console.log('[up13] '+t)}}catch(e){}}
var TTS=window.speechSynthesis||null;
var cur=null;
function stop(){
 if(TTS){try{TTS.cancel()}catch(e){}}
 btnOff();
}
function btnOff(){if(cur){cur.classList.remove('on');cur.title='read reply aloud';cur=null}}
function textOf(d){
 var c=d.cloneNode(true);
 var junk=c.querySelectorAll('button,.sugg,.acts,svg,textarea,input,code');
 for(var i=0;i<junk.length;i++){if(junk[i].parentNode)junk[i].parentNode.removeChild(junk[i])}
 return (c.textContent||'').replace(/\s+/g,' ').trim();
}
function speak(d,b){
 var t=textOf(d);
 if(!t){toast('nothing to read in this reply');return}
 stop();
 if(!TTS){toast('your browser has no speech voices');return}
 var u=new SpeechSynthesisUtterance(t.slice(0,30000));
 u.rate=1;u.pitch=1;u.lang=navigator.language||'en-US';
 u.onend=btnOff;u.onerror=btnOff;
 cur=b;b.classList.add('on');b.title='stop reading';
 TTS.speak(u);
 console.log('[up13] speaking',t.length,'chars');
}
var CH=document.getElementById('chat');
if(!CH){console.log('[up13.js v1.0] chat missing, upgrade inert');return}
function addBtn(d){
 var b=document.createElement('button');b.title='read reply aloud';b.className='up13speak';
 b.style.cssText='display:inline-flex;align-items:center;gap:6px;color:var(--dim);font-size:12px;padding:4px 8px;margin:2px 0 12px;border-radius:8px;cursor:pointer;background:transparent;border:0';
 b.innerHTML='<svg viewBox="0 0 24 24" style="width:14px;height:14px" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>read aloud';
 return b;
}
function hook(){
 var ais=CH.querySelectorAll('.msg.ai');
 for(var i=0;i<ais.length;i++){var d=ais[i];if(d.getAttribute('data-u13'))continue;
  if(!d.querySelector('.acts')){setTimeout(hook,300);return}
  d.setAttribute('data-u13','1');
  var b=addBtn(d);
  var sg=d.querySelector('.sugg');if(sg)d.insertBefore(b,sg);else d.appendChild(b);
 }
}
new MutationObserver(function(){setTimeout(hook,0)}).observe(CH,{childList:true,subtree:true});
hook();
document.addEventListener('click',function(ev){
 var t=ev.target;if(!t||!t.closest)return;
 var b=t.closest('.up13speak');
 if(b){ev.preventDefault();ev.stopPropagation();
  var d=b.closest('.msg.ai');
  if(!d)return;
  if(cur===b){stop();console.log('[up13] read stopped')}
  else{speak(d,b)}
  return;
 }
 if(cur&&(t.closest('#send')||t.closest('.up4regen')||t.closest('#newchat')||t.closest('#newchatd')||t.closest('.up5edit'))){stop();console.log('[up13] read stopped: new activity')}
},true);
var st=document.createElement('style');
st.textContent='.up13speak.on{color:#0d9488}';
document.head.appendChild(st);
console.log('[chatgpt up13.js v1.0] read aloud loaded');
})();
