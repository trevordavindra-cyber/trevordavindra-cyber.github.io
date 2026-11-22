/* deepagent39 up18.js - upgrade pack 18: keyboard shortcuts (v1.0) */
(function(){
if(window.__u18)return;window.__u18=1;
if(!window.CG){console.log('[up18.js v1.0] core api missing, upgrade inert');return}
var ur=document.getElementById('upd');
if(ur){var vv=ur.querySelector('.val');if(vv)vv.textContent='2.9.17(24)';ur.onclick=function(){sys('2.9.17(24) - you are up to date')}}
function T(m){try{sys(m)}catch(e){console.log('[up18] '+m)}}
function vis(el){return el&&getComputedStyle(el).display!=='none'}
document.addEventListener('keydown',function(e){
 if(e.repeat)return;
 var mod=e.ctrlKey||e.metaKey;
 if(mod&&!e.altKey&&!e.shiftKey){
  var k=(e.key||'').toLowerCase();
  if(k==='k'){e.preventDefault();var nc=document.getElementById('newchat');if(nc){nc.click();T('new chat (Cmd/Ctrl+K)')}else{T('new chat button missing')}return}
  if(k==='/'){e.preventDefault();var i=document.getElementById('inp');if(i){i.focus();T('composer focused (Cmd/Ctrl+/)')}return}
 }
 if(e.key==='Escape'&&!mod&&!e.altKey&&!e.ctrlKey&&!e.metaKey){
  var p=document.getElementById('panel'),s=document.getElementById('sheet');
  if(vis(p)){var x=document.getElementById('panx');if(x){x.click();T('panel closed (Esc)')}return}
  if(vis(s)){var sx=document.getElementById('sheetx');if(sx){sx.click();T('settings closed (Esc)')}return}
 }
},true);
console.log('[chatgpt up18.js v1.0] keyboard shortcuts loaded: Cmd/Ctrl+K new chat, Cmd/Ctrl+/ focus composer, Esc closes the open overlay');
})();
