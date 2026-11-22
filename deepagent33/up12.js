/* deepagent33 up12.js - upgrade pack 12: temporary chat (v1.0) */
(function(){
if(!window.CG){console.log('[up12.js v1.0] core api missing, upgrade inert');return}
var ur=document.getElementById('upd');
if(ur){var vv=ur.querySelector('.val');if(vv)vv.textContent='2.9.11(18)';ur.onclick=function(){sys('2.9.11(18) - you are up to date')}}
var KEYS=['ds_chats','ds_h','ds_chat_last','ds_titled'];
var snap=null,timer=null;
function readAll(){var o={};for(var i=0;i<KEYS.length;i++){o[KEYS[i]]=localStorage.getItem(KEYS[i])}return JSON.stringify(o)}
function take(){snap=readAll()}
function guard(){
 if(snap===null)return;
 var now=readAll();
 if(now!==snap){
  var o=JSON.parse(snap);
  for(var k in o){try{if(o[k]===null){localStorage.removeItem(k)}else{localStorage.setItem(k,o[k])}}catch(e){}}
  console.log('[up12] temp guard: blocked a save');
 }
}
function on(){
 localStorage.setItem('ds_temp','1');take();
 if(!timer)timer=setInterval(guard,1200);
 btn.classList.add('act');btn.title='temporary chat: on';
 sys('temporary chat on: this chat will not be saved to history');
 console.log('[up12] temp chat on');
}
function off(){
 localStorage.setItem('ds_temp','0');
 if(timer){clearInterval(timer);timer=null}
 snap=null;btn.classList.remove('act');btn.title='temporary chat';
 sys('temporary chat off: chats are saved again');
 console.log('[up12] temp chat off');
}
var tr=document.querySelector('#top .tright');
if(!tr){console.log('[up12.js v1.0] top bar missing, upgrade inert');return}
var btn=document.createElement('button');btn.className='circ';btn.id='u12temp';btn.title='temporary chat';
btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a7 7 0 0 1 7 7v10l-2.3-2-2.35 2-2.35-2-2.35 2L7.3 18 5 20V10a7 7 0 0 1 7-7z"/><circle cx="9.5" cy="10.5" r="0.6"/><circle cx="14.5" cy="10.5" r="0.6"/></svg>';
btn.onclick=function(){if(localStorage.getItem('ds_temp')==='1'){off()}else{on()}};
var pfp=document.getElementById('pfp');
if(pfp&&pfp.parentNode===tr){tr.insertBefore(btn,pfp)}else{tr.appendChild(btn)}
var st=document.createElement('style');
st.textContent='#u12temp{color:var(--dim)}#u12temp.act{color:#0d9488;border-color:#0d9488;box-shadow:0 0 0 1px #0d9488 inset}';
document.head.appendChild(st);
if(localStorage.getItem('ds_temp')==='1'){take();if(!timer)timer=setInterval(guard,1200);btn.classList.add('act');btn.title='temporary chat: on'}
console.log('[chatgpt up12.js v1.0] temporary chat loaded');
})();