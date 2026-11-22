/* deepagent39 up18.js - upgrade pack 18: composer counter (v1.1) */
/* v1.0 (keyboard shortcuts) was superseded: it clashed with up11's shortcuts (up11 owns Ctrl+K search, Ctrl+Shift+O new chat, Esc stop). */
(function(){
if(window.__u18)return;window.__u18=1;
if(!window.CG){console.log('[up18.js v1.1] core api missing, upgrade inert');return}
var ur=document.getElementById('upd');
if(ur){var vv=ur.querySelector('.val');if(vv)vv.textContent='2.9.17(24)';ur.onclick=function(){sys('2.9.17(24) - you are up to date')}}
var inp=document.getElementById('inp');
var card=inp&&inp.closest?inp.closest('.ccard'):null;
if(!inp||!card){console.log('[up18.js v1.1] composer missing, upgrade inert');return}
var c=document.createElement('div');
c.id='u18cnt';
c.style.cssText='display:none;text-align:right;font-size:11px;color:#8e8ea0;padding:2px 6px 0;user-select:none';
card.appendChild(c);
function upd(){
 var v=inp.value||'';
 if(!v.trim()){c.style.display='none';return}
 c.textContent=v.length+' chars ~ '+Math.max(1,Math.round(v.length/4))+' tokens';
 c.style.display='block';
}
inp.addEventListener('input',upd);
console.log('[chatgpt up18.js v1.1] composer counter loaded: live char and token estimate under the input (up11 shortcuts untouched)');
})();
