/* JARVIS up13.js v3 - view switcher: full HUD (the whole desktop Stark layout, scaled down like the desktop screenshot) or big text (the compact phone layout). One tap, remembered. */
(function(){
"use strict";
var FULL='width=1280', COMPACT='width=device-width,initial-scale=1';
function setvp(v){var m=document.querySelector('meta[name="viewport"]');if(m)m.setAttribute('content',v)}
function isFull(){var m=document.querySelector('meta[name="viewport"]');return !!m&&m.getAttribute('content').indexOf('1280')>-1}
var saved=null;try{saved=localStorage.getItem('jvview')}catch(e){}
setvp(saved==='compact'?COMPACT:FULL);
function btn(){
 var b=document.createElement('button');b.id='jvviewbtn';
 b.textContent=isFull()?'◱':'⛶';b.title='toggle full HUD / big text';
 b.onclick=function(){
  var wasFull=isFull();
  setvp(wasFull?COMPACT:FULL);
  try{localStorage.setItem('jvview',wasFull?'compact':'full')}catch(e){}
  b.textContent=wasFull?'◱':'⛶';
  try{feedline('View: '+(wasFull?'big text':'full HUD'))}catch(e){}
 };
 document.body.appendChild(b);
}
if(document.readyState!=='loading')btn();else document.addEventListener('DOMContentLoaded',btn);
try{
 var s=document.createElement('style');
 s.textContent='#jvviewbtn{position:fixed;bottom:64px;right:12px;z-index:99999;width:44px;height:44px;border-radius:12px;border:1px solid rgba(55,209,255,.45);background:rgba(4,10,18,.78);color:#8fd6ff;font-size:20px;box-shadow:0 0 14px rgba(55,209,255,.28)}';
 document.head.appendChild(s);
}catch(e){}
try{console.log('[JARVIS up13.js v3] view switcher on (full HUD = whole desktop layout scaled down)')}catch(e){}
})();
