/* deepagent24 up3.js - upgrade pack 3: chat search + rename (v1.0) */
(function(){
var DC=document.getElementById('dchats');
if(!DC||!window.CG){console.log('[up3.js v1.0] core api missing, upgrade inert');return}
function load(){try{return JSON.parse(localStorage.getItem('ds_chats')||'[]')}catch(e){return[]}}
function saveAll(a){try{localStorage.setItem('ds_chats',JSON.stringify(a.slice(0,12)))}catch(e){}}
var box=document.getElementById('dsrch');
if(!box){box=document.createElement('input');box.id='dsrch';box.placeholder='Search chats';box.setAttribute('autocomplete','off');box.style.cssText='width:100%;padding:8px 10px;margin:2px 0 6px;border:1px solid var(--ln);border-radius:10px;background:transparent;color:var(--tx);font-family:inherit;font-size:14px;outline:none';DC.parentNode.insertBefore(box,DC)}
function match(rec,q){if((rec.t||'').toLowerCase().indexOf(q)>-1)return true;var m=rec.m||[];for(var i=0;i<m.length;i++){if(String(m[i].c||'').toLowerCase().indexOf(q)>-1)return true}return false}
function entry(rec){var d=document.createElement('div');d.className='dchat';d.setAttribute('data-u2','1');d.setAttribute('data-u3','1');var sp=document.createElement('span');sp.textContent=rec.t;var bx=document.createElement('span');bx.style.cssText='display:flex;gap:6px;flex:0 0 auto';var p=document.createElement('b');p.textContent='\u270e';p.title='rename';p.onclick=function(ev){ev.stopPropagation();var n=prompt('rename chat',rec.t);if(n&&n.trim()&&n.trim()!==rec.t){var nt=n.trim().slice(0,60);var a=load(),idx=-1;for(var i=0;i<a.length;i++){if(a[i].t===rec.t){idx=i;break}}if(idx<0)return;a[idx].t=nt;for(var j=0;j<a.length;j++){if(j!==idx&&a[j].t===nt){a.splice(j,1);j--}}saveAll(a);try{if(localStorage.getItem('ds_chat_last')===rec.t)localStorage.setItem('ds_chat_last',nt)}catch(e){}renderF(true)}};var x=document.createElement('b');x.textContent='\u2715';x.onclick=function(ev){ev.stopPropagation();saveAll(load().filter(function(z){return z.t!==rec.t}));renderF(true)};bx.appendChild(p);bx.appendChild(x);d.appendChild(sp);d.appendChild(bx);d.onclick=function(){openChat(rec.t)};return d}
function openChat(t){var a=load(),rec=null;for(var i=0;i<a.length;i++)if(a[i].t===t)rec=a[i];if(!rec)return;CG.clear();CG.fresh();CG.load(rec.m.map(function(m){return{role:m.r==='u'?'user':'assistant',content:m.c}}));for(var k=0;k<rec.m.length;k++)CG.renderMsg(rec.m[k].r,rec.m[k].c);try{localStorage.setItem('ds_chat_last',t)}catch(e){}renderF(true)}
function renderF(force){var q=(box.value||'').trim().toLowerCase();var a=load();var s2=q+'|'+a.map(function(r){return r.t}).join('|')+'#'+a.length;if(!force&&s2===renderF.s)return;renderF.s=s2;DC.innerHTML='';var list=q?a.filter(function(r){return match(r,q)}):a;
 if(!list.length){var e=document.createElement('div');e.className='dchat';e.setAttribute('data-u2','1');e.setAttribute('data-u3','1');e.style.color='var(--dim)';e.textContent=q?'no chats match':'no chats yet';DC.appendChild(e);return}
 list.forEach(function(rec){DC.appendChild(entry(rec))})}
box.oninput=function(){renderF(true)};
new MutationObserver(function(){setTimeout(function(){var kids=DC.children,mine=0;for(var i=0;i<kids.length;i++){if(kids[i].getAttribute('data-u3'))mine++}if((kids.length&&mine<kids.length)||(!kids.length&&load().length)){renderF(true)}},0)}).observe(DC,{childList:true});
renderF(true);
console.log('[chatgpt up3.js v1.0] chat search + rename loaded');
})();
