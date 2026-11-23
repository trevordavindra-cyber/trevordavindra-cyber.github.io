/* deepagent48 up27.js - upgrade pack 27: inline rename (chats + projects) v1.1 */
(function(){
if(window.__u27)return;window.__u27=1;
var DC=document.getElementById('dchats');
if(!DC){console.log('[up27] sidebar missing, upgrade inert');return}
var WRAP=document.getElementById('u26proj');
function jget(k,d){try{var v=JSON.parse(localStorage.getItem(k)||d);return v}catch(e){return null}}
function jset(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
var st=document.createElement('style');
st.textContent='.u27prn{display:none;color:var(--dim);cursor:pointer;padding:0 4px;font-size:12px;flex-shrink:0}.u26p:hover .u27prn{display:inline}.u27in{flex:1;min-width:50px;padding:2px 6px;border:1px solid rgba(128,128,128,.4);border-radius:6px;font-size:13px;outline:none;background:var(--panel,#fff);color:var(--fg)}';
document.head.appendChild(st);
function renameChatEverywhere(oldT,newT){
 ['ds_chats','ds_h'].forEach(function(k){var a=jget(k,'[]');if(!Array.isArray(a))return;var ch=false;a.forEach(function(r){if(r&&r.t===oldT){r.t=newT;ch=true}});if(ch)jset(k,a)});
 ['ds_titled','ds_pins'].forEach(function(k){var a=jget(k,'[]');if(!Array.isArray(a))return;var i=a.indexOf(oldT);if(i>-1){a[i]=newT;jset(k,a)}});
 try{if(localStorage.getItem('ds_chat_last')===oldT)localStorage.setItem('ds_chat_last',newT)}catch(e){}
 var p=jget('u26projects','{}');if(p&&typeof p==='object'&&!Array.isArray(p)){var ch=false;for(var n in p){var i=(p[n]||[]).indexOf(oldT);if(i>-1){p[n][i]=newT;ch=true}}if(ch)jset('u26projects',p)}
}
function poke(){var t=document.createTextNode('');DC.appendChild(t);setTimeout(function(){if(t.parentNode)t.parentNode.removeChild(t)},30)}
function editChat(row){
 var sp=row.querySelector('span');if(!sp||row.querySelector('.u27in'))return;
 var oldT=sp.textContent;
 var inp=document.createElement('input');inp.className='u27in';inp.value=oldT;
 sp.style.display='none';
 row.insertBefore(inp,sp.nextSibling);
 setTimeout(function(){inp.focus();inp.select()},20);
 var done=false;
 function fin(save){
  if(done)return;done=true;
  var v=inp.value.trim();
  if(inp.parentNode)inp.remove();
  sp.style.display='';
  if(save&&v&&v!==oldT){renameChatEverywhere(oldT,v);sp.textContent=v;poke();console.log('[up27] chat renamed "'+oldT+'" -> "'+v+'"')}
 }
 inp.addEventListener('keydown',function(ev){ev.stopPropagation();if(ev.key==='Enter')fin(true);else if(ev.key==='Escape')fin(false)});
 inp.addEventListener('click',function(ev){ev.stopPropagation()});
 inp.addEventListener('blur',function(){setTimeout(function(){fin(true)},0)});
}
function editProject(pr){
 var nm=pr.querySelector('.pname');if(!nm||pr.querySelector('.u27in'))return;
 var oldN=nm.textContent;
 var inp=document.createElement('input');inp.className='u27in';inp.value=oldN;
 nm.style.display='none';
 pr.insertBefore(inp,nm.nextSibling);
 setTimeout(function(){inp.focus();inp.select()},20);
 var done=false;
 function fin(save){
  if(done)return;done=true;
  var v=inp.value.trim();
  if(inp.parentNode)inp.remove();
  nm.style.display='';
  if(save&&v&&v!==oldN){
   var p=jget('u26projects','{}')||{};
   if(p[v]&&Array.isArray(p[v])){
    var merged=(p[v]).concat(p[oldN]||[]);
    var uniq=[];merged.forEach(function(x){if(uniq.indexOf(x)<0)uniq.push(x)});
    p[v]=uniq;
   }else{p[v]=p[oldN]||[]}
   delete p[oldN];
   jset('u26projects',p);
   var o=jget('u26open','{}')||{};
   if(oldN in o){o[v]=o[oldN];delete o[oldN];jset('u26open',o)}
   nm.textContent=v;
   poke();
   console.log('[up27] project renamed "'+oldN+'" -> "'+v+'"')
  }
 }
 inp.addEventListener('keydown',function(ev){ev.stopPropagation();if(ev.key==='Enter')fin(true);else if(ev.key==='Escape')fin(false)});
 inp.addEventListener('click',function(ev){ev.stopPropagation()});
 inp.addEventListener('blur',function(){setTimeout(function(){fin(true)},0)});
}
function sweep(){
 if(WRAP){
  var ps=WRAP.querySelectorAll('.u26p');
  for(var j=0;j<ps.length;j++){
   if(!ps[j].querySelector('.u27prn')){
    var b2=document.createElement('span');b2.className='u27prn';b2.textContent='\u270E';b2.title='rename project';ps[j].appendChild(b2);
   }
  }
 }
}
new MutationObserver(function(){setTimeout(sweep,0)}).observe(DC,{childList:true,subtree:true});
if(WRAP){new MutationObserver(function(){setTimeout(sweep,0)}).observe(WRAP,{childList:true,subtree:true})}
document.addEventListener('click',function(ev){
 var t=ev.target;
 if(!t||!t.closest)return;
 var prn=t.closest('.u27prn');
 if(prn){
  ev.preventDefault();ev.stopImmediatePropagation();
  var pr=prn.closest('.u26p');
  if(pr)editProject(pr);
  return;
 }
 var rb=t.closest('b[title="rename"]');
 if(rb){
  var row=rb.closest('.dchat');
  if(row){
   ev.preventDefault();ev.stopImmediatePropagation();
   editChat(row);
  }
 }
},true);
(function(){try{var v=document.querySelector('#upd .val');if(v)v.textContent='2.9.22(34)'}catch(e){}})();
sweep();
console.log('[chatgpt up27.js v1.1] inline rename loaded');
})();
