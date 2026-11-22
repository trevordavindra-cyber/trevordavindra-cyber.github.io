/* deepagent40 up19.js - upgrade pack 19: try again (v1.0) */
(function(){
if(window.__u19)return;window.__u19=1;
if(!window.CG){console.log('[up19.js v1.0] core api missing, upgrade inert');return}
var ur=document.getElementById('upd');
if(ur){var vv=ur.querySelector('.val');if(vv)vv.textContent='2.9.18(25)';ur.onclick=function(){sys('2.9.18(25) - you are up to date')}}
function T(m){try{sys(m)}catch(e){console.log('[up19] '+m)}}
function generating(){var p=document.querySelector('#send path');return p&&p.getAttribute('d')==='M9 9h6v6H9z'}
var chat=document.getElementById('chat');
if(!chat){console.log('[up19.js v1.0] chat missing, upgrade inert');return}
var btn=document.createElement('button');
btn.setAttribute('data-u19','1');
btn.title='try again';
btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v4h4"/></svg>';
btn.style.display='none';
chat.addEventListener('click',function(e){
 var b=e.target&&e.target.closest?e.target.closest('[data-u19]'):null;
 if(!b)return;
 e.preventDefault();e.stopImmediatePropagation();
 if(generating()){T('still answering, one moment');return}
 var h=(window.CG&&CG.hist&&CG.hist())||[];
 var last='';for(var i=h.length-1;i>=0;i--){if(h[i].role==='user'){last=String(h[i].content||'');break}}
 if(!last){T('nothing to try again yet');return}
 var inp=document.getElementById('inp');
 if(!inp){T('composer missing');return}
 inp.value=last;
 var s=document.getElementById('send');
 if(s){console.log('[up19] try again: re-asking the last prompt');s.click()}else{T('send button missing')}
},true);
function place(){
 var ais=chat.querySelectorAll('.msg.ai');
 if(!ais.length){btn.style.display='none';return}
 var bar=ais[ais.length-1].querySelector('.acts');
 if(!bar){btn.style.display='none';return}
 if(btn.parentNode!==bar){btn.style.display='';bar.appendChild(btn)}
 var old=document.querySelectorAll('[data-u19]');
 for(var i=0;i<old.length;i++){if(old[i]!==btn&&old[i].parentNode)old[i].parentNode.removeChild(old[i])}
}
var mo=new MutationObserver(function(){try{place()}catch(e){}});
mo.observe(chat,{childList:true,subtree:true});
place();
console.log('[chatgpt up19.js v1.0] try again loaded: a retry arrow on the latest reply re-asks your last prompt');
})();
