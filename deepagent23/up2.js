/* deepagent23 up2.js - upgrade pack 2: unified sidebar + clean chat titles (v1.0) */
(function(){
var DC=document.getElementById('dchats');
if(!DC||!window.CG){console.log('[up2.js v1.0] core api missing, upgrade inert');return}
function base(s,cap){s=String(s||'');var m=s.match(/^[\s\S]*"final"\s*:\s*"([\s\S]*?)"\s*\}?[\s\S]*$/);if(m&&/\{/.test(s))s=m[1];try{var j=JSON.parse(s);if(j&&typeof j.final==='string')s=j.final}catch(e){}
 s=s.replace(/```[\s\S]*?```/g,' code ').replace(/[#*`>_~|]/g,'').replace(/\s+/g,' ').trim();
 cap=cap||60;if(s.length>cap)s=s.slice(0,cap).trim();if(!s)s='New chat';return s}
function firstTitle(m,cap){for(var i=0;i<m.length;i++){if(m[i].r==='u')return base(m[i].c,cap)}return m.length?base(m[0].c,cap):'New chat'}
function load(){try{return JSON.parse(localStorage.getItem('ds_chats')||'[]')}catch(e){return[]}}
function saveAll(a){try{localStorage.setItem('ds_chats',JSON.stringify(a.slice(0,12)))}catch(e){}}
window.__upT=base;
(function(){var a=load(),ch=false,seen={};for(var i=0;i<a.length;i++){var t=firstTitle(a[i].m||[],60);if(t!==a[i].t){a[i].t=t;ch=true}if(seen[t]){a.splice(i,1);i--;ch=true}else seen[t]=1}if(ch)saveAll(a)})();
function legacy(){try{return JSON.parse(localStorage.getItem('ds_h')||'[]')}catch(e){return[]}}
function render(){var a=load(),s2=a.map(function(r){return r.t}).join('|')+'#'+a.length;if(s2===render.s)return;render.s=s2;
 DC.innerHTML='';var old=legacy().map(function(t){return base(t,40)}).filter(function(t){for(var i=0;i<a.length;i++)if(a[i].t===t)return false;return t&&t!=='New chat'}).filter(function(t,i,arr){return arr.indexOf(t)===i}).slice(0,6);
 if(!a.length&&!old.length){var e=document.createElement('div');e.className='dchat';e.setAttribute('data-u2','1');e.style.color='var(--dim)';e.textContent='no chats yet';DC.appendChild(e);return}
 a.forEach(function(rec){var d=document.createElement('div');d.className='dchat';d.setAttribute('data-u2','1');var sp=document.createElement('span');sp.textContent=rec.t;var x=document.createElement('b');x.textContent='\u2715';x.onclick=function(ev){ev.stopPropagation();saveAll(load().filter(function(z){return z.t!==rec.t}));render.s='';render()};d.appendChild(sp);d.appendChild(x);d.onclick=function(){openChat(rec.t)};DC.appendChild(d)});
 if(old.length){var h=document.createElement('div');h.className='dchat';h.setAttribute('data-u2','1');h.style.color='var(--dim)';h.style.fontSize='11px';h.textContent='older';DC.appendChild(h);old.forEach(function(t){var d=document.createElement('div');d.className='dchat';d.setAttribute('data-u2','1');var sp=document.createElement('span');sp.textContent=t;d.appendChild(sp);d.onclick=function(){CG.fresh()};DC.appendChild(d)})}
}
function openChat(t){var a=load(),rec=null;for(var i=0;i<a.length;i++)if(a[i].t===t)rec=a[i];if(!rec)return;CG.clear();CG.fresh();CG.load(rec.m.map(function(m){return{role:m.r==='u'?'user':'assistant',content:m.c}}));for(var k=0;k<rec.m.length;k++)CG.renderMsg(rec.m[k].r,rec.m[k].c);try{localStorage.setItem('ds_chat_last',t)}catch(e){}render.s='';render()}
['menu','newchat','newchatd'].forEach(function(id){var b=document.getElementById(id);if(b&&b.onclick){var old=b.onclick;b.onclick=function(){var r=old.apply(this,arguments);setTimeout(render,0);return r}}});
new MutationObserver(function(){setTimeout(function(){for(var i=0;i<DC.children.length;i++){if(!DC.children[i].getAttribute('data-u2')){render();return}}},0)}).observe(DC,{childList:true});
render();
console.log('[chatgpt up2.js v1.0] unified sidebar + clean titles loaded');
})();
