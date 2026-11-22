/* deepagent26 up5.js - upgrade pack 5: edit your message and resend (v1.0) */
(function(){
var CH=document.getElementById('chat');
if(!CH||!window.CG){console.log('[up5.js v1.0] core api missing, upgrade inert');return}
function addBtn(d){
 var b=document.createElement('button');b.title='edit message';b.className='up5edit';
 b.style.cssText='display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;margin-left:8px;vertical-align:middle;border:0;background:transparent;color:#6b6b6b;cursor:pointer;border-radius:6px;flex:0 0 auto';
 b.innerHTML='<svg viewBox="0 0 24 24" style="width:14px;height:14px" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13 7l4 4"/></svg>';
 d.appendChild(b);
}
function hook(){
 var yos=CH.querySelectorAll('.you');
 for(var i=0;i<yos.length;i++){var d=yos[i];
  if(d.querySelector('.up5edit')){continue}
  if(d.querySelector('textarea')){continue}
  addBtn(d)}
}
function startEdit(d){
 if(d.dataset.up5orig!==undefined)return;
 d.dataset.up5orig=(d.dataset.up5text||d.textContent||'');
 d.innerHTML='';
 var ta=document.createElement('textarea');ta.className='up5ta';ta.value=d.dataset.up5orig;
 ta.style.cssText='width:100%;box-sizing:border-box;border:1px solid var(--ln);border-radius:10px;background:transparent;color:var(--tx);font:14px/1.5 inherit;padding:8px;resize:vertical;min-height:60px';
 var row=document.createElement('div');row.style.cssText='display:flex;gap:8px;margin-top:6px;justify-content:flex-end';
 var cx=document.createElement('button');cx.textContent='Cancel';cx.className='up5cancel';
 cx.style.cssText='background:transparent;color:var(--dim);border:1px solid var(--ln);border-radius:16px;padding:6px 14px;font-size:13px;cursor:pointer';
 var sv=document.createElement('button');sv.textContent='Send';sv.className='up5save';
 sv.style.cssText='background:#0d0d0d;color:#fff;border:0;border-radius:16px;padding:6px 14px;font-size:13px;cursor:pointer';
 row.appendChild(cx);row.appendChild(sv);d.appendChild(ta);d.appendChild(row);
 try{ta.focus()}catch(e){}
}
function cancelEdit(d){
 var t=d.dataset.up5orig||'';delete d.dataset.up5orig;
 d.textContent=t;addBtn(d);
}
function saveEdit(d){
 try{
  var ta=d.querySelector('textarea.up5ta');var txt=(ta&&ta.value||'').trim();
  var orig=d.dataset.up5orig||'';if(!txt)txt=orig;
  var h=CG.hist();var yus=CH.querySelectorAll('.you');var k=Array.prototype.indexOf.call(yus,d);
  var uidx=[];for(var i=0;i<h.length;i++){if(h[i].role==='user')uidx.push(i)}
  var idx=(k>-1&&uidx[k]!==undefined)?uidx[k]:uidx[uidx.length-1];
  console.log('[up5] edit: bubble',k,'hist idx',idx,'->',txt);
  if(idx===undefined){cancelEdit(d);return}
  var p=d.parentNode;var n=d;while(n){var nx=n.nextSibling;p.removeChild(n);n=nx}
  CG.load(h.slice(0,idx));
  var inp=document.getElementById('inp');inp.value=txt;
  document.getElementById('send').click();
  console.log('[up5] resent');
 }catch(e){console.log('[up5] edit error',e&&e.message);cancelEdit(d)}
}
document.addEventListener('click',function(ev){
 var t=ev.target;if(!t||!t.closest)return;
 var b=t.closest('.up5edit');if(b){ev.preventDefault();ev.stopPropagation();var d=b.closest('.you');if(d)startEdit(d);return}
 var s=t.closest('.up5save');if(s){ev.preventDefault();ev.stopPropagation();var d2=s.closest('.you');if(d2)saveEdit(d2);return}
 var c=t.closest('.up5cancel');if(c){ev.preventDefault();ev.stopPropagation();var d3=c.closest('.you');if(d3)cancelEdit(d3);return}
},true);
new MutationObserver(function(){setTimeout(hook,0)}).observe(CH,{childList:true,subtree:true});
hook();
console.log('[chatgpt up5.js v1.0] edit message loaded');
})();
