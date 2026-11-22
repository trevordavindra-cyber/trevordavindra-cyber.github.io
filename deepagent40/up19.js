/* deepagent40 up19.js - upgrade pack 19: message details (v1.2, timestamps + star) */
(function(){
if(window.__u19)return;window.__u19=1;
if(!window.CG){console.log('[up19.js v1.2] core api missing, upgrade inert');return}
var ur=document.getElementById('upd');
if(ur){var vv=ur.querySelector('.val');if(vv)vv.textContent='2.9.18(25)';ur.onclick=function(){sys('2.9.18(25) - you are up to date')}}
function T(m){try{sys(m)}catch(e){console.log('[up19] '+m)}}
var chat=document.getElementById('chat');
if(!chat){console.log('[up19.js v1.2] chat missing, upgrade inert');return}
function hms(d){var h=d.getHours(),m=d.getMinutes();return (h<10?'0':'')+h+':'+(m<10?'0':'')+m}
var starred=[];
try{starred=JSON.parse(localStorage.getItem('ds_star')||'[]')}catch(e){starred=[]}
function save(){try{localStorage.setItem('ds_star',JSON.stringify(starred.slice(0,50)))}catch(e){}}
function stamp(d){
 if(d.getAttribute('data-u19t'))return;
 d.setAttribute('data-u19t','1');
 var s=document.createElement('span');s.className='u19t';
 s.style.cssText='display:block;font-size:11px;color:#8e8ea0;margin:4px 0 0 2px';
 s.textContent=hms(new Date());
 d.appendChild(s);
}
var sbtn=document.createElement('button');
sbtn.setAttribute('data-u19s','1');sbtn.title='star reply';sbtn.style.display='none';
sbtn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2-5.6-3.1-5.6 3.1 1.3-6.2L3 9.5l6.3-.7z"/></svg>';
chat.addEventListener('click',function(e){
 var b=e.target&&e.target.closest?e.target.closest('[data-u19s]'):null;
 if(!b)return;
 e.preventDefault();e.stopImmediatePropagation();
 var d=b.closest('.msg.ai');var raw=d&&d.dataset.raw||'';
 var i=-1;for(var k=0;k<starred.length;k++){if(starred[k].txt===raw){i=k;break}}
 if(i>=0){starred.splice(i,1);b.classList.remove('on');T('star removed')}
 else{starred.push({t:hms(new Date()),txt:raw.slice(0,300)});b.classList.add('on');T('starred, see it under Starred in the sidebar')}
 save();syncCount();
},true);
var panel=document.createElement('div');panel.id='u19panel';
panel.style.cssText='display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:70';
panel.innerHTML='<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;color:#0d0d0d;border-radius:14px;padding:18px;max-width:520px;width:90%;max-height:70vh;overflow:auto;box-shadow:0 10px 40px rgba(0,0,0,.25)"><div style="display:flex;align-items:center;justify-content:space-between"><b id="u19pcount">Starred (0)</b><button id="u19x" style="border:0;background:none;cursor:pointer;font-size:18px;color:#0d0d0d">&#10005;</button></div><div id="u19list" style="margin-top:10px"></div></div>';
document.body.appendChild(panel);
panel.addEventListener('click',function(e){
 if(e.target===panel||e.target.id==='u19x'){panel.style.display='none';return}
 if(e.target&&e.target.classList&&e.target.classList.contains('u19row')){panel.style.display='none';var inp=document.getElementById('inp');if(inp){inp.value=e.target.getAttribute('data-full')||e.target.textContent;inp.focus()}}
});
function syncCount(){var a=document.getElementById('u19stars');if(a)a.textContent='Starred ('+starred.length+')';var b=document.getElementById('u19pcount');if(b)b.textContent='Starred ('+starred.length+')'}
function renderPanel(){
 var l=document.getElementById('u19list');if(!l)return;
 l.innerHTML='';
 if(!starred.length){l.innerHTML='<div style="color:#8e8ea0;font-size:13px;padding:8px 0">no starred replies yet, hit the star on a reply</div>';return}
 for(var i=starred.length-1;i>=0;i--){
  var r=document.createElement('div');r.className='u19row';r.setAttribute('data-full',starred[i].txt);
  r.style.cssText='padding:8px 10px;border-radius:8px;cursor:pointer;font-size:13px;line-height:1.45';
  r.textContent=(starred[i].txt.length>140?starred[i].txt.slice(0,140)+'\u2026':starred[i].txt)+'  \u00b7  '+starred[i].t;
  var hr=document.createElement('div');hr.style.cssText='height:1px;background:rgba(0,0,0,.07);margin:6px 0';
  l.appendChild(r);l.appendChild(hr);
 }
}
function addDrawer(){
 var d=document.getElementById('dshare');if(!d)return;
 if(document.getElementById('u19menu'))return;
 var m=document.createElement('div');m.id='u19menu';m.className='sitem';
 m.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2-5.6-3.1-5.6 3.1 1.3-6.2L3 9.5l6.3-.7z"/></svg><span id="u19stars">Starred (0)</span>';
 m.onclick=function(){renderPanel();panel.style.display='block'};
 if(d.nextSibling)d.parentNode.insertBefore(m,d.nextSibling);else d.parentNode.appendChild(m);
 syncCount();
}
function isStarred(raw){for(var k=0;k<starred.length;k++){if(starred[k].txt===raw)return true}return false}
function hook(){
 var ais=chat.querySelectorAll('.msg.ai');
 for(var i=0;i<ais.length;i++)stamp(ais[i]);
 var last=ais.length?ais[ais.length-1]:null;
 var bar=last?last.querySelector('.acts'):null;
 if(bar){
  if(sbtn.parentNode!==bar){sbtn.classList.remove('on');sbtn.style.display='';bar.appendChild(sbtn)}
  if(last.dataset.raw&&isStarred(last.dataset.raw))sbtn.classList.add('on');
 }else{sbtn.style.display='none'}
 var yous=chat.querySelectorAll('.you');
 for(var j=0;j<yous.length;j++)stamp(yous[j]);
}
var mo=new MutationObserver(function(){try{hook()}catch(e){}});
mo.observe(chat,{childList:true,subtree:true});
addDrawer();
hook();
console.log('[chatgpt up19.js v1.2] message details loaded: timestamps on every message + star replies, starred list in the sidebar');
})();
