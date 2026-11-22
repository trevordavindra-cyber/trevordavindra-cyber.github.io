/* deepagent41 up20.js - upgrade pack 20: pin chats in the sidebar (v1.0) */
(function(){
if(window.__u20)return;window.__u20=1;
if(!window.CG){console.log('[up20.js v1.0] core api missing, upgrade inert');return}
var ur=document.getElementById('upd');
if(ur){var vv=ur.querySelector('.val');if(vv)vv.textContent='2.9.19(26)';ur.onclick=function(){sys('2.9.19(26) - you are up to date')}}
function T(m){try{sys(m)}catch(e){console.log('[up20] '+m)}
var DC=document.getElementById('dchats');
if(!DC){console.log('[up20.js v1.0] dchats missing, upgrade inert');return}
function pins(){try{return JSON.parse(localStorage.getItem('ds_pin')||'[]')}catch(e){return[]}}
function setPins(a){try{localStorage.setItem('ds_pin',JSON.stringify(a.slice(0,10)))}catch(e){}}
function isPinned(t){return pins().indexOf(t)>=0}
function toggle(t){var p=pins(),i=p.indexOf(t);if(i>=0){p.splice(i,1);T('unpinned "'+t+'"')}else{p.push(t);T('pinned "'+t+'", it stays at the top of the sidebar')}setPins(p);decorate(true)}
var busy=false,sig='';
function decorate(force){
 if(busy)return;busy=true;
 setTimeout(function(){
  try{
   var kids=Array.prototype.slice.call(DC.children),rows=[],s='';
   for(var i=0;i<kids.length;i++){
    var k=kids[i];
    if(!k.classList||!k.classList.contains('dchat'))continue;
    var sp=k.querySelector('span');if(!sp)continue;
    rows.push({el:k,t:sp.textContent});
   }
   for(var j=0;j<rows.length;j++)s+=rows[j].t+'|'+(isPinned(rows[j].t)?'1':'0')+';';
   if(s===sig&&!force){busy=false;return}
   sig=s;
   for(var m=0;m<rows.length;m++){
    var r=rows[m];
    if(r.el.getAttribute('data-u20p')){r.el.style.background=isPinned(r.t)?'rgba(0,0,0,.06)':'';continue}
    r.el.setAttribute('data-u20p','1');
    r.el.style.background=isPinned(r.t)?'rgba(0,0,0,.06)':'';
    var b=document.createElement('b');b.className='u20pin';b.textContent='\ud83d\udccc';
    b.style.cssText='cursor:pointer;margin-left:6px;font-size:10px;opacity:'+(isPinned(r.t)?'1':'.2');
    (function(rt){b.onclick=function(ev){ev.stopPropagation();toggle(rt)}})(r.t);
    r.el.appendChild(b);
   }
   for(var n=rows.length-1;n>=0;n--){if(isPinned(rows[n].t))DC.insertBefore(rows[n].el,DC.firstChild)}
  }catch(e){}
  busy=false;
 },0);
}
new MutationObserver(function(){decorate(false)}).observe(DC,{childList:true});
decorate(true);
console.log('[chatgpt up20.js v1.0] pin chats loaded: tap the pin on any chat to keep it at the top of the sidebar');
})();
