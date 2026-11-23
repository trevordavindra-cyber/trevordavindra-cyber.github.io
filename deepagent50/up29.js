/* deepagent50 up29.js - upgrade pack 29: search all chats (v1.0) */
(function(){
if(window.__u29)return;window.__u29=1;
if(!window.CG){console.log('[up29.js v1.0] core api missing, upgrade inert');return}
var ur=document.getElementById('upd');
if(ur){var vv=ur.querySelector('.val');if(vv)vv.textContent='2.9.22(36)';ur.onclick=function(){sys('2.9.22(36) - you are up to date')}}
function T(m){try{sys(m)}catch(e){console.log('[up29] '+m)}}
function load(){try{return JSON.parse(localStorage.getItem('ds_chats')||'[]')}catch(e){return[]}}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
var st=document.createElement('style');st.id='u29style';document.head.appendChild(st);
st.textContent='#u29ov{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:2147483000;display:none}#u29ov.on{display:flex;align-items:center;justify-content:center}#u29card{background:var(--card,#fff);color:var(--tx,#111);border-radius:16px;padding:18px;width:min(92vw,460px);max-height:80vh;overflow:auto;box-shadow:0 12px 40px rgba(0,0,0,.25)}#u29card h3{margin:0 0 10px;font-size:15px}#u29q{width:100%;box-sizing:border-box;border:1px solid rgba(0,0,0,.15);border-radius:10px;padding:9px;font:inherit;font-size:13px;background:transparent;color:inherit;margin-bottom:8px}.u29row{border:1px solid rgba(0,0,0,.1);border-radius:12px;padding:10px;margin-bottom:8px;cursor:pointer}.u29row:hover{background:rgba(0,0,0,.04)}.u29t{font-weight:600;font-size:13px}.u29s{font-size:12px;color:var(--dim,#888);margin-top:4px;line-height:1.4;word-break:break-word}#u29hint{font-size:11px;color:var(--dim,#888);margin:8px 0 0}#u29btns{display:flex;gap:8px;justify-content:flex-end;margin-top:12px}#u29btns button{border:0;border-radius:999px;padding:6px 12px;font:inherit;font-size:12px;cursor:pointer;background:rgba(0,0,0,.06);color:inherit}#u29res mark{background:rgba(122,184,255,.45);color:inherit;border-radius:2px}';
var ov=document.createElement('div');ov.id='u29ov';
ov.innerHTML='<div id="u29card"><h3>Search all chats</h3><input id="u29q" placeholder="search every chat, every message"><div id="u29res"></div><div id="u29hint">searches titles and message text across every saved chat. tap a result to open that chat.</div><div id="u29btns"><button data-u29="close">Close</button></div></div>';
document.body.appendChild(ov);
var q=document.getElementById('u29q'),res=document.getElementById('u29res');
function open(){ov.classList.add('on');q.value='';res.innerHTML='<div style="font-size:12px;color:var(--dim,#888)">type to search</div>';try{q.focus()}catch(e){}}
function close(){ov.classList.remove('on')}
function snip(txt,ql){
 var i=txt.toLowerCase().indexOf(ql);
 if(i<0)return esc(txt.slice(0,120));
 var a=Math.max(0,i-50),b=Math.min(txt.length,i+ql.length+70);
 return (a>0?'\u2026':'')+esc(txt.slice(a,i))+'<mark>'+esc(txt.slice(i,i+ql.length))+'</mark>'+esc(txt.slice(i+ql.length,b))+(b<txt.length?'\u2026':'');
}
function run(){
 var ql=q.value.trim().toLowerCase();
 if(!ql){res.innerHTML='<div style="font-size:12px;color:var(--dim,#888)">type to search</div>';return}
 var a=load();
 if(!a.length){res.innerHTML='<div style="font-size:12px;color:var(--dim,#888)">no chats to search yet</div>';return}
 var rows=[],MAX=20;
 for(var i=0;i<a.length&&rows.length<MAX;i++){
  var r=a[i],t=String(r.t||'');
  if(t.toLowerCase().indexOf(ql)>-1){
   var flat='';
   for(var k=0;k<(r.m||[]).length;k++)flat+=(r.m[k].r==='u'?'you: ':'ai: ')+String(r.m[k].c)+' ';
   rows.push({t:t,s:flat.trim()?snip(flat.replace(/\s+/g,' ').trim(),ql):'(title match)'});
   continue;
  }
  var line=null,msgs=r.m||[];
  for(var m2=0;m2<msgs.length;m2++){if(String(msgs[m2].c).toLowerCase().indexOf(ql)>-1){line=(msgs[m2].r==='u'?'you: ':'ai: ')+String(msgs[m2].c);break}}
  if(line)rows.push({t:t,s:snip(line.replace(/\s+/g,' ').trim(),ql)});
 }
 res.innerHTML=rows.length?rows.map(function(r){return '<div class="u29row" data-u29t="'+esc(r.t)+'"><div class="u29t">'+esc(r.t)+'</div><div class="u29s">'+r.s+'</div></div>'}).join(''):'<div style="font-size:12px;color:var(--dim,#888)">no matches</div>';
}
var deb=null;
q.addEventListener('input',function(){if(deb)clearTimeout(deb);deb=setTimeout(run,150)});
function openTitle(t){
 var a=load(),rec=null;
 for(var i=0;i<a.length;i++){if(a[i].t===t){rec=a[i];break}}
 if(!rec){T('chat not found');return}
 try{
  CG.clear();CG.fresh();
  CG.load((rec.m||[]).map(function(m){return{role:m.r==='u'?'user':'assistant',content:m.c}}));
  for(var k=0;k<(rec.m||[]).length;k++)CG.renderMsg(rec.m[k].r,rec.m[k].c);
  try{localStorage.setItem('ds_chat_last',t)}catch(e){}
  close();
  console.log('[up29] opened chat "'+t+'" from search ('+(rec.m||[]).length+' messages)');
 }catch(e){console.log('[up29] open failed: '+e.message)}
}
document.addEventListener('click',function(e){
 var t=e.target;
 if(t.closest&&t.closest('#u29srch')){e.preventDefault();e.stopPropagation();open();return}
 if(!ov.classList.contains('on'))return;
 if(t.id==='u29ov'){close();return}
 var b=t.closest&&t.closest('[data-u29="close"]');
 if(b){e.preventDefault();e.stopPropagation();close();return}
 var row=t.closest&&t.closest('.u29row');
 if(row){openTitle(row.getAttribute('data-u29t')||'')}
},true);
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&ov.classList.contains('on')){e.stopPropagation();close()}},true);
if(!document.getElementById('u29srch')){
 var dshare=document.getElementById('dshare');
 if(dshare){var s=document.createElement('div');s.id='u29srch';s.className='sitem';s.innerHTML='<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>Search all chats';dshare.parentNode.insertBefore(s,dshare)}
}
console.log('[chatgpt up29.js v1.0] search all chats loaded: full-text search across every saved chat, tap a hit to open it');
})();
