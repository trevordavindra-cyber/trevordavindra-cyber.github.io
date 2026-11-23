/* deepagent46 up25.js - upgrade pack 25: prompt library (v1.0) */
(function(){
if(window.__u25)return;window.__u25=1;
if(!window.CG){console.log('[up25.js v1.0] core api missing, upgrade inert');return}
var ur=document.getElementById('upd');
if(ur){var vv=ur.querySelector('.val');if(vv)vv.textContent='2.9.20(32)';ur.onclick=function(){sys('2.9.20(32) - you are up to date')}}
function T(m){try{sys(m)}catch(e){console.log('[up25] '+m)}}
var KEY='u25prompts';
function load(){try{return JSON.parse(localStorage.getItem(KEY))||[]}catch(e){return[]}}
function save(a){try{localStorage.setItem(KEY,JSON.stringify(a))}catch(e){}}
if(!localStorage.getItem(KEY)){save([{t:'Explain simply',p:'explain this like i am five, in plain words:'},{t:'Bullet summary',p:'summarize the following in 5 short bullet points:'},{t:'Fix my code',p:'here is my code. find the bug and explain the fix, do not rewrite the whole thing:'}])}
var st=document.createElement('style');st.id='u25style';document.head.appendChild(st);
st.textContent='#u25ov{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:2147483000;display:none}#u25ov.on{display:flex;align-items:center;justify-content:center}#u25card{background:var(--card,#fff);color:var(--tx,#111);border-radius:16px;padding:18px;width:min(92vw,460px);max-height:80vh;overflow:auto;box-shadow:0 12px 40px rgba(0,0,0,.25)}#u25card h3{margin:0 0 10px;font-size:15px}.u25row{border:1px solid rgba(0,0,0,.1);border-radius:12px;padding:10px;margin-bottom:8px}.u25t{font-weight:600;font-size:14px}.u25p{font-size:12px;color:var(--dim,#888);margin:4px 0 8px;white-space:pre-wrap;word-break:break-word}.u25acts{display:flex;gap:6px}.u25acts button,#u25btns button,#u25add{border:0;border-radius:999px;padding:6px 12px;font:inherit;font-size:12px;cursor:pointer;background:rgba(0,0,0,.06);color:inherit}.u25use{background:var(--tx,#111);color:var(--bg,#fff)}#u25add{width:100%;margin-top:4px}#u25form{display:none;border:1px solid rgba(0,0,0,.1);border-radius:12px;padding:10px;margin-bottom:8px}#u25form.on{display:block}#u25form input,#u25form textarea{width:100%;box-sizing:border-box;border:1px solid rgba(0,0,0,.15);border-radius:10px;padding:8px;font:inherit;font-size:13px;background:transparent;color:inherit;margin-bottom:6px}#u25form textarea{min-height:60px;resize:vertical}#u25hint{font-size:11px;color:var(--dim,#888);margin:10px 0 0}';
var ov=document.createElement('div');ov.id='u25ov';
ov.innerHTML='<div id="u25card"><h3>Prompt library</h3><div id="u25form"><input id="u25ft" placeholder="title"><textarea id="u25fp" placeholder="the prompt text"></textarea><div style="display:flex;gap:8px;justify-content:flex-end"><button data-u25act="fsave">Save prompt</button></div></div><div id="u25list"></div><button id="u25add" data-u25act="new">+ New prompt</button><div id="u25hint">Saved prompts live in this browser. Insert fills the composer without sending.</div><div id="u25btns" style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px"><button data-u25act="close">Close</button></div></div>';
document.body.appendChild(ov);
var list=document.getElementById('u25list'),form=document.getElementById('u25form'),ft=document.getElementById('u25ft'),fp=document.getElementById('u25fp');
var editIdx=-1;
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function render(){var a=load();list.innerHTML=a.length?a.map(function(x,i){return '<div class="u25row"><div class="u25t">'+esc(x.t)+'</div><div class="u25p">'+esc(x.p)+'</div><div class="u25acts"><button class="u25use" data-u25act="use" data-i="'+i+'">insert</button><button data-u25act="edit" data-i="'+i+'">edit</button><button data-u25act="del" data-i="'+i+'">delete</button></div></div>'}).join(''):'<div style="font-size:12px;color:var(--dim,#888);margin-bottom:8px">no prompts yet, add one below</div>'}
function setForm(t,p,show){ft.value=t||'';fp.value=p||'';form.classList.toggle('on',!!show)}
function open(){render();setForm('','',false);editIdx=-1;ov.classList.add('on');try{ft.blur()}catch(e){}}
function close(){ov.classList.remove('on');setForm('','',false);editIdx=-1}
if(!document.getElementById('u25lib')){
 var dshare=document.getElementById('dshare');
 if(dshare){var lib=document.createElement('div');lib.id='u25lib';lib.className='sitem';lib.innerHTML='<svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h10M4 18h16"/></svg>Prompt library';dshare.parentNode.insertBefore(lib,dshare)}
}
document.addEventListener('click',function(e){
 var t=e.target;
 if(t.closest&&t.closest('#u25lib')){e.preventDefault();e.stopPropagation();open();return}
 if(!ov.classList.contains('on'))return;
 if(t.id==='u25ov'){close();return}
 if(t.closest&&t.closest('[data-u25act="close"]')){e.preventDefault();e.stopPropagation();close();return}
 var b=t.closest&&t.closest('[data-u25act]');
 if(!b)return;
 e.preventDefault();e.stopPropagation();
 var act=b.getAttribute('data-u25act'),i=parseInt(b.getAttribute('data-i')||'-1',10);
 if(act==='new'){editIdx=-1;setForm('','',true);try{ft.focus()}catch(e2){}return}
 if(act==='fsave'){
  var tt=ft.value.trim(),pp=fp.value.trim(),wasEdit=editIdx>-1;
  if(!tt||!pp){T('give the prompt a title and text');return}
  var a=load();
  if(wasEdit){a[editIdx]={t:tt,p:pp}}else{a.push({t:tt,p:pp})}
  save(a);setForm('','',false);editIdx=-1;render();T(wasEdit?'prompt updated':'prompt saved');
  return}
 if(act==='use'){
  var a2=load(),x=a2[i];
  if(x){var inp=document.getElementById('inp');
   if(inp){inp.value=x.p;try{inp.dispatchEvent(new Event('input',{bubbles:true}))}catch(e2){}close();try{inp.focus()}catch(e3){}T('prompt inserted into the composer')}
   else{T('composer not found')}}
  return}
 if(act==='edit'){var a3=load(),x3=a3[i];if(x3){editIdx=i;setForm(x3.t,x3.p,true);try{ft.focus()}catch(e4){}}return}
 if(act==='del'){var a4=load();a4.splice(i,1);save(a4);render();T('prompt deleted');return}
},true);
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&ov.classList.contains('on')){e.stopPropagation();close()}},true);
console.log('[chatgpt up25.js v1.0] prompt library loaded: sidebar > Prompt library saves and inserts reusable prompts');
})();
