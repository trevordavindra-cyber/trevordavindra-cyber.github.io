/* JARVIS up13.js v1 - full-HUD phone view: phone renders the complete desktop Stark layout (like the desktop screenshot), one tap switches to the big-text compact view */
(function(){
"use strict";
var FULL='width=1280', COMPACT='width=device-width,initial-scale=1';
function setvp(v){var m=document.querySelector('meta[name="viewport"]');if(m)m.setAttribute('content',v)}
var saved=null;try{saved=localStorage.getItem('jvview')}catch(e){}
setvp(saved==='compact'?COMPACT:FULL);
function isFull(){var m=document.querySelector('meta[name="viewport"]');return m&&m.getAttribute('content').indexOf('1280')>-1}
function btn(){
 var b=document.createElement('button');b.id='jvviewbtn';
 b.textContent=isFull()?'◱':'⛶';b.title='toggle full HUD / big text';
 b.onclick=function(){var wasFull=isFull();setvp(wasFull?COMPACT:FULL);try{localStorage.setItem('jvview',wasFull?'compact':'full')}catch(e){}b.textContent=wasFull?'◱':'⛶';try{feedline('View: '+(wasFull?'big text':'full HUD'))}catch(e){}};
 document.body.appendChild(b);
}
if(document.readyState!=='loading')btn();else document.addEventListener('DOMContentLoaded',btn);
try{
 var s=document.createElement('style');
 s.textContent='#jvviewbtn{position:fixed;bottom:64px;right:12px;z-index:9999;width:38px;height:38px;border-radius:10px;border:1px solid rgba(55,209,255,.45);background:rgba(4,10,18,.75);color:#8fd6ff;font-size:18px;box-shadow:0 0 12px rgba(55,209,255,.25)}';
 document.head.appendChild(s);
}catch(e){}
try{console.log('[JARVIS up13.js v1] full-HUD phone view on (viewport 1280, toggle button bottom-right)')}catch(e){}
})();
