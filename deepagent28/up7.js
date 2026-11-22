/* deepagent28 up7.js - upgrade pack 7: pin chats in the sidebar (v1.0) */
(function(){
var DC=document.getElementById('dchats');
if(!DC||!window.CG){console.log('[up7.js v1.0] core api missing, upgrade inert');return}
var LSK='ds_pins';
function load(){try{return JSON.parse(localStorage.getItem(LSK)||'[]')}catch(e){return[]}}
function saveAll(a){try{localStorage.setItem(LSK,JSON.stringify(a.slice(0,6)))}catch(e){}}
function isP(t){return load().indexOf(t)>-1}
function toggle(t){var a=load(),i=a.indexOf(t);if(i>-1){a.splice(i,1)}else{a.unshift(t)}saveAll(a);sort();arm();console.log('[up7] pin ->',isP(t)?'pinned':'unpinned',t)}
function arm(){
 for(var i=0;i<DC.children.length;i++){
  var d=DC.children[i];
  if(d.getAttribute('data-u7'))continue;
  d.setAttribute('data-u7','1');
  var sp=d.querySelector('span');if(!sp)continue;
  var t=sp.textContent;
  var b=document.createElement('b');
  b.className='u7pin';b.title=isP(t)?'unpin':'pin';
  b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 17v5"/><path d="M9 3h6l-1 6 3 3v2H7v-2l3-3z"/></svg>';
  b.onclick=function(ev){ev.stopPropagation();toggle(t)};
  d.insertBefore(b,d.lastElementChild);
  d.classList.toggle('pin',isP(t));
 }
}
function sort(){
 var kids=[],i;
 for(i=0;i<DC.children.length;i++){
  var d=DC.children[i],sp=d.querySelector('span');
  kids.push({d:d,p:sp?isP(sp.textContent):false,i:i});
 }
 var want=kids.slice().sort(function(a,b){return (b.p?1:0)-(a.p?1:0)||a.i-b.i});
 var changed=false;
 for(i=0;i<want.length;i++){if(want[i].d!==kids[i].d)changed=true}
 if(!changed)return;
 for(i=0;i<want.length;i++){DC.appendChild(want[i].d)}
}
var busy=false;
new MutationObserver(function(){
 if(busy)return;busy=true;
 setTimeout(function(){arm();sort();busy=false},0);
}).observe(DC,{childList:true});
var st=document.createElement('style');st.textContent='.u7pin{display:inline-flex;color:var(--dim);cursor:pointer}.u7pin svg{width:14px;height:14px}.dchat.pin{background:rgba(217,119,6,.12)}.dchat.pin .u7pin{color:#d97706}body.dark .dchat.pin{background:rgba(217,119,6,.22)}';
document.head.appendChild(st);
arm();sort();
console.log('[up7] chat pin v1.0 loaded, pinned:',load().length);
})();
