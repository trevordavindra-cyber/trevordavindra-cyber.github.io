/* deepagent51 up30.js - upgrade pack 30: chat stats (v1.0) */
(function(){
if(window.__u30)return;window.__u30=1;
if(!window.CG){console.log('[up30.js v1.0] core api missing, upgrade inert');return}
var ur=document.getElementById('upd');
if(ur){var vv=ur.querySelector('.val');if(vv)vv.textContent='2.9.22(37)';ur.onclick=function(){sys('2.9.22(37) - you are up to date')}}
var st=document.createElement('style');st.id='u30style';document.head.appendChild(st);
st.textContent='#u30ov{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:2147483000;display:none}#u30ov.on{display:flex;align-items:center;justify-content:center}#u30card{background:var(--card,#fff);color:var(--tx,#111);border-radius:16px;padding:18px;width:min(88vw,360px);max-height:80vh;overflow:auto;box-shadow:0 12px 40px rgba(0,0,0,.25)}#u30card h3{margin:0 0 12px;font-size:15px}.u30r{display:flex;justify-content:space-between;align-items:center;border:1px solid rgba(0,0,0,.08);border-radius:10px;padding:8px 12px;margin-bottom:6px;font-size:13px}.u30r b{font-size:14px}#u30name{font-size:11px;color:var(--dim,#888);margin:-6px 0 10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#u30hint{font-size:11px;color:var(--dim,#888);margin:8px 0 0}#u30btns{display:flex;gap:8px;justify-content:flex-end;margin-top:12px}#u30btns button{border:0;border-radius:999px;padding:6px 12px;font:inherit;font-size:12px;cursor:pointer;background:rgba(0,0,0,.06);color:inherit}.u30empty{font-size:12px;color:var(--dim,#888)}';
var ov=document.createElement('div');ov.id='u30ov';
ov.innerHTML='<div id="u30card"><h3>Chat stats</h3><div id="u30name"></div><div id="u30body"></div><div id="u30hint">counts for the chat that is open right now</div><div id="u30btns"><button data-u30="close">Close</button></div></div>';
document.body.appendChild(ov);
function open(){
 ov.classList.add('on');
 var t='';try{t=localStorage.getItem('ds_chat_last')||''}catch(e){}
 var nm=document.getElementById('u30name');nm.textContent=t?('# '+t):'';
 run();
}
function close(){ov.classList.remove('on')}
function curMsgs(){
 var h=[];
 try{h=window.CG.hist()||[]}catch(e){}
 if(h&&h.length){return h.map(function(m){return{r:m.role==='user'?'u':'a',c:m.content}}),'current'}
 var t='';try{t=localStorage.getItem('ds_chat_last')||''}catch(e){}
 if(!t)return null,'none';
 var a=[];try{a=JSON.parse(localStorage.getItem('ds_chats')||'[]')}catch(e){}
 for(var i=0;i<a.length;i++){if(a[i].t===t)return (a[i].m||[]),'saved'}
 return null,'none';
}
function run(){
 var body=document.getElementById('u30body');
 var m,src;var got=curMsgs();m=got[0];src=got[1];
 if(!m||!m.length){body.innerHTML='<div class="u30empty">start a chat to see stats</div>';return}
 var you=0,ai=0,words=0,chars=0;
 for(var i=0;i<m.length;i++){
  if(m[i].r==='u')you++;else ai++;
  var c=String(m[i].c||'');chars+=c.length;
  var w=c.split(/\s+/).filter(Boolean).length;words+=w;
 }
 var tok=Math.ceil(chars/4);
 var rows=[['messages',you+ai],['from you',you],['from the ai',ai],['words',words],['characters',chars],['est. tokens','~'+tok]];
 body.innerHTML=rows.map(function(r){return '<div class="u30r"><span>'+r[0]+'</span><b>'+r[1]+'</b></div>'}).join('');
 console.log('[up30] chat stats ('+src+'): '+(you+ai)+' msgs, '+you+' you / '+ai+' ai, '+words+' words, '+chars+' chars, ~'+tok+' tokens');
}
document.addEventListener('click',function(e){
 var t=e.target;
 if(t.closest&&t.closest('#u30stats')){e.preventDefault();e.stopPropagation();open();return}
 if(!ov.classList.contains('on'))return;
 if(t.id==='u30ov'){close();return}
 var b=t.closest&&t.closest('[data-u30="close"]');
 if(b){e.preventDefault();e.stopPropagation();close()}
},true);
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&ov.classList.contains('on')){e.stopPropagation();close()}},true);
if(!document.getElementById('u30stats')){
 var dshare=document.getElementById('dshare');
 if(dshare){var s=document.createElement('div');s.id='u30stats';s.className='sitem';s.innerHTML='<svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>Chat stats';dshare.parentNode.insertBefore(s,dshare)}
}
console.log('[chatgpt up30.js v1.0] chat stats loaded: open-chat message, word and token counts in the drawer');
})();
