/* deepagent41 up20.js - upgrade pack 20: archive chats (v1.1) */
(function(){
if(window.__u20)return;window.__u20=1;
if(!window.CG){console.log('[up20.js v1.1] core api missing, upgrade inert');return}
var ur=document.getElementById('upd');
if(ur){var vv=ur.querySelector('.val');if(vv)vv.textContent='2.9.19(27)';ur.onclick=function(){sys('2.9.19(27) - you are up to date')}}
function T(m){
 try{sys(m)}
 catch(e){console.log('[up20] '+m)}
}
var DC=document.getElementById('dchats');
if(!DC){console.log('[up20.js v1.1] dchats missing, upgrade inert');return}
function arcs(){try{return JSON.parse(localStorage.getItem('ds_arc')||'[]')}catch(e){return[]}}
function setArcs(a){try{localStorage.setItem('ds_arc',JSON.stringify(a.slice(0,12)))}catch(e){}}
function isArc(t){return arcs().indexOf(t)>=0}
function toggle(t){var a=arcs(),i=a.indexOf(t);if(i>=0){a.splice(i,1);T('unarchived "'+t+'", back in the list')}else{a.push(t);T('archived "'+t+'", find it under Archived')}setArcs(a);work()}
function work(){
 try{
  var kids=Array.prototype.slice.call(DC.children),rows=[];
  for(var i=0;i<kids.length;i++){
   var k=kids[i];
   if(k.getAttribute&&k.getAttribute('data-u20sec'))continue;
   if(!k.classList||!k.classList.contains('dchat'))continue;
   var sp=k.querySelector('span');if(!sp)continue;
   rows.push({el:k,t:sp.textContent});
  }
  for(var m=0;m<rows.length;m++){
   var r=rows[m];
   r.el.style.display=isArc(r.t)?'none':'';
   if(r.el.getAttribute('data-u20a'))continue;
   r.el.setAttribute('data-u20a','1');
   var b=document.createElement('b');b.className='u20arch';b.title='archive chat';
   b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="4" width="18" height="4"/><path d="M5 8v11h14V8M10 12h4"/></svg>';
   b.style.cssText='display:inline-flex;color:var(--dim);cursor:pointer';
   b.querySelector('svg').style.cssText='width:13px;height:13px';
   (function(rt){b.onclick=function(ev){ev.stopPropagation();toggle(rt)}})(r.t);
   r.el.insertBefore(b,r.el.lastElementChild);
  }
  var al=arcs(),sg=al.join('|');
  var old=DC.querySelector('[data-u20sec]');
  if(old&&old.getAttribute('data-u20sig')===sg)return;
  if(old)old.remove();
  if(!al.length)return;
  var sec=document.createElement('div');sec.setAttribute('data-u20sec','1');sec.setAttribute('data-u20sig',sg);
  var h=document.createElement('div');h.className='dchat';h.style.cssText='color:var(--dim);font-size:11px;cursor:pointer';
  h.textContent='Archived ('+al.length+')';
  var list=document.createElement('div');list.style.display='none';
  h.onclick=function(){list.style.display=list.style.display==='none'?'block':'none'};
  for(var q=0;q<al.length;q++){
   var rr=document.createElement('div');rr.className='dchat';rr.setAttribute('data-u20sec','1');
   rr.style.cssText='color:var(--dim);font-size:12px;cursor:pointer;padding:4px 10px';
   var tb=document.createElement('b');tb.textContent=al[q];tb.style.fontWeight='400';
   rr.appendChild(tb);
   (function(t2){rr.onclick=function(){toggle(t2)}})(al[q]);
   list.appendChild(rr);
  }
  sec.appendChild(h);sec.appendChild(list);DC.appendChild(sec);
 }catch(e){}
}
new MutationObserver(function(){work()}).observe(DC,{childList:true});
work();
console.log('[chatgpt up20.js v1.1] archive chats loaded: hit the box on any chat to tuck it away under Archived');
})();
