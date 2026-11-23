/* deepagent44 up23.js - upgrade pack 23: collapsible long messages (v1.0) */
(function(){
if(window.__u23)return;window.__u23=1;
if(!window.CG){console.log('[up23.js v1.0] core api missing, upgrade inert');return}
var ur=document.getElementById('upd');
if(ur){var vv=ur.querySelector('.val');if(vv)vv.textContent='2.9.19(30)';ur.onclick=function(){sys('2.9.19(30) - you are up to date')}}
function T(m){
 try{sys(m)}
 catch(e){console.log('[up23] '+m)}
}
var st=document.createElement('style');st.id='u23style';document.head.appendChild(st);
st.textContent='#chat .msg.ai .u23body{display:block}#chat .msg.ai.u23c .u23body{max-height:340px;overflow:hidden;position:relative;padding-bottom:0}#chat .msg.ai.u23c .u23body:after{content:"";position:absolute;left:0;right:0;bottom:0;height:56px;background:linear-gradient(rgba(255,255,255,0),var(--bg));pointer-events:none}#chat .u23more{display:inline-block;margin:2px 0 6px;color:var(--dim);font-size:12px;cursor:pointer;background:none;border:0;padding:2px 0}#chat .u23more:hover{color:var(--tx)}';
var LIMIT=340;
function longEnough(body){return body.scrollHeight>LIMIT}
function process(m){
 if(!m||m.classList.contains('u23done'))return;
 if(m.querySelector('.u23body')){m.classList.add('u23done');return}
 var acts=m.querySelector('.acts');
 if(!acts)return;
 var body=document.createElement('div');body.className='u23body';
 var n=m.firstChild,moved=false;
 while(n&&n!==acts){var nx=n.nextSibling;body.appendChild(n);moved=true;n=nx}
 if(!moved)return;
 m.insertBefore(body,acts);
 var more=document.createElement('button');more.className='u23more';more.type='button';
 m.insertBefore(more,acts);
 if(longEnough(body)){m.classList.add('u23c');more.textContent='show more'}
 else{more.remove()}
 m.classList.add('u23done');
}
function sweep(){var ms=document.querySelectorAll('#chat .msg.ai');for(var i=0;i<ms.length;i++)process(ms[i])}
var chat=document.getElementById('chat');
var mo=null;
if(chat){
 mo=new MutationObserver(function(){if(mo){mo.disconnect();try{sweep()}finally{mo.observe(chat,{childList:true,subtree:true})}}});
 mo.observe(chat,{childList:true,subtree:true});
}
sweep();
document.addEventListener('click',function(e){
 var t=e.target,b=t.closest?t.closest('.u23more'):null;
 if(!b)return;
 e.preventDefault();e.stopPropagation();
 var m=b.closest('.msg.ai');
 if(!m)return;
 var body=m.querySelector('.u23body');
 if(m.classList.contains('u23c')){m.classList.remove('u23c');b.textContent='show less';T('message expanded')}
 else if(body&&longEnough(body)){m.classList.add('u23c');b.textContent='show more';T('message collapsed')}
},true);
console.log('[chatgpt up23.js v1.0] collapsible long messages loaded: long replies collapse with a show more toggle');
})();
