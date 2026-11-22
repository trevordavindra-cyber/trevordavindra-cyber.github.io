/* deepagent42 up21.js - upgrade pack 21: text size setting (v1.0) */
(function(){
if(window.__u21)return;window.__u21=1;
if(!window.CG){console.log('[up21.js v1.0] core api missing, upgrade inert');return}
var ur=document.getElementById('upd');
if(ur){var vv=ur.querySelector('.val');if(vv)vv.textContent='2.9.19(28)';ur.onclick=function(){sys('2.9.19(28) - you are up to date')}}
function T(m){
 try{sys(m)}
 catch(e){console.log('[up21] '+m)}
}
var LEVELS=[['Small','13px'],['Medium','16px'],['Large','19px']];
function cur(){var i=0;try{i=parseInt(localStorage.getItem('ds_font')||'1',10)}catch(e){i=1}
 if(isNaN(i)||i<0||i>2)i=1;return i}
var st=document.createElement('style');st.id='u21style';document.head.appendChild(st);
function apply(){
 var i=cur();
 st.textContent='#chat .msg.ai,#chat .msg.me{font-size:'+LEVELS[i][1]+'}';
 var b=document.getElementById('u21fs');if(b)b.title='text size: '+LEVELS[i][0].toLowerCase()+' (click to change)';
}
var right=document.querySelector('#top .tright');
if(right&&!document.getElementById('u21fs')){
 var b=document.createElement('button');b.className='circ';b.id='u21fs';b.title='text size';
 b.innerHTML='<span style="font-size:12px;font-weight:600">Aa</span>';
 b.onclick=function(){var i=(cur()+1)%3;try{localStorage.setItem('ds_font',String(i))}catch(e){};apply();T('text size: '+LEVELS[cur()][0].toLowerCase())};
 var pfp=document.getElementById('pfp');right.insertBefore(b,pfp||null);
}
apply();
console.log('[chatgpt up21.js v1.0] text size setting loaded: Aa button in the top bar cycles small / medium / large');
})();
