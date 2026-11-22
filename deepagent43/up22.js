/* deepagent43 up22.js - upgrade pack 22: quote reply (v1.0) */
(function(){
if(window.__u22)return;window.__u22=1;
if(!window.CG){console.log('[up22.js v1.0] core api missing, upgrade inert');return}
var ur=document.getElementById('upd');
if(ur){var vv=ur.querySelector('.val');if(vv)vv.textContent='2.9.19(29)';ur.onclick=function(){sys('2.9.19(29) - you are up to date')}}
function T(m){
 try{sys(m)}
 catch(e){console.log('[up22] '+m)}
}
var st=document.createElement('style');st.id='u22style';document.head.appendChild(st);
st.textContent='.acts .u22q svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.acts .u22q{opacity:.6;padding:6px}.acts .u22q:hover{opacity:1}';
function addIcons(){
 var acts=document.querySelectorAll('#chat .msg.ai .acts');
 for(var i=0;i<acts.length;i++){
  if(!acts[i].querySelector('.u22q')){
   var b=document.createElement('button');b.className='u22q';b.title='quote reply';
   b.innerHTML='<svg viewBox="0 0 24 24"><path d="M9 17l-5-5 5-5"/><path d="M4 12h10a6 6 0 0 1 6 6v2"/></svg>';
   acts[i].appendChild(b);
  }
 }
}
var mo=new MutationObserver(addIcons);
var chat=document.getElementById('chat');
if(chat)mo.observe(chat,{childList:true,subtree:true});
addIcons();
document.addEventListener('click',function(e){
 var t=e.target,b=t.closest?t.closest('.acts .u22q'):null;
 if(!b)return;
 e.preventDefault();e.stopPropagation();
 var d=b.closest('.msg.ai'),raw=d&&d.dataset.raw||'';
 var q=String(raw).replace(/\s+/g,' ').trim();
 if(q.length>160)q=q.slice(0,157)+'...';
 var inp=document.getElementById('inp');
 if(!inp){T('composer not found');return}
 inp.value='> '+q+'\n\n';
 inp.focus();
 T('quoted reply added to the composer');
},true);
console.log('[chatgpt up22.js v1.0] quote reply loaded: arrow icon on every AI reply fills the composer with the quote');
})();
