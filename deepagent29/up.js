/* deepagent23 up.js - upgrade pack 1: persistent chat history restore (v1.1) */
(function(){
var CH=document.getElementById('chat'),DC=document.getElementById('dchats');
if(!CH||!DC||!window.CG){console.log('[up.js v1.1] core api missing, upgrade inert');return}
var LSK='ds_chats',LAST='ds_chat_last',sig='';
window.__upP=persist;
function load(){try{return JSON.parse(localStorage.getItem(LSK)||'[]')}catch(e){return[]}}
function saveAll(a){try{localStorage.setItem(LSK,JSON.stringify(a.slice(0,12)))}catch(e){}}
function persist(){var h=CG.hist();var m=[];for(var i=0;i<h.length;i++)m.push({r:h[i].role==='user'?'u':'a',c:String(h[i].content||'')});if(!m.length)return;var t='';for(var k=0;k<m.length;k++){if(m[k].r==='u'){t=m[k].c.slice(0,60);break}}if(!t)t='chat';var a=load(),rec={t:t,m:m.slice(-40)},at=-1;for(var j=0;j<a.length;j++){if(a[j].t===t)at=j}if(at>-1)a.splice(at,1);a.unshift(rec);saveAll(a);try{localStorage.setItem(LAST,t)}catch(e){}renderSide()}
function note(t){var d=document.createElement('div');d.className='msg sys';d.textContent=t;CH.appendChild(d);CH.scrollTop=1e9}
function renderSide(){var a=load();var s=a.map(function(r){return r.t}).join('|')+'#'+a.length;if(s===sig)return;sig=s;DC.innerHTML='';if(!a.length){var e=document.createElement('div');e.className='dchat';e.style.color='var(--dim)';e.textContent='no chats yet';DC.appendChild(e);return}a.forEach(function(rec){var d=document.createElement('div');d.className='dchat';var sp=document.createElement('span');sp.textContent=rec.t;var x=document.createElement('b');x.textContent='\u2715';x.onclick=function(ev){ev.stopPropagation();saveAll(load().filter(function(z){return z.t!==rec.t}));renderSide();note('chat deleted')};d.appendChild(sp);d.appendChild(x);d.onclick=function(){openChat(rec.t)};DC.appendChild(d)})}
function openChat(t){var a=load(),rec=null;for(var i=0;i<a.length;i++)if(a[i].t===t)rec=a[i];if(!rec)return;CG.clear();CG.fresh();CG.load(rec.m.map(function(m){return{role:m.r==='u'?'user':'assistant',content:m.c}}));for(var k=0;k<rec.m.length;k++)CG.renderMsg(rec.m[k].r,rec.m[k].c);try{localStorage.setItem(LAST,t)}catch(e){}renderSide()}
new MutationObserver(function(){setTimeout(function(){var last=CH.lastElementChild;if(last&&last.classList&&last.classList.contains('msg')){persist()}else if(!CH.querySelector('.msg')){renderSide()}},0)}).observe(CH,{childList:true});
new MutationObserver(function(){setTimeout(renderSide,0)}).observe(DC,{childList:true});
var lt=null;try{lt=localStorage.getItem(LAST)}catch(e){}
if(lt){var a=load();for(var i=0;i<a.length;i++){if(a[i].t===lt&&a[i].m.length){setTimeout(function(){openChat(lt)},0);break}}}
renderSide();
console.log('[chatgpt up.js v1.1] chat history restore loaded');
})();
