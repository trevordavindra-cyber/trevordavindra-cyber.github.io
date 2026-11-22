/* JARVIS up13.js v2 - full-HUD phone view: phone renders the whole desktop Stark layout zoomed out (like the desktop screenshot), one tap switches to the big-text compact view. JS-computed zoom so it works in every browser. */
(function(){
"use strict";
function $(i){return document.getElementById(i)}
var saved=null;try{saved=localStorage.getItem('jvview')}catch(e){}
var app=$('app');
function fullOn(){
 document.documentElement.classList.add('jvfull');
 fit();
}
function fullOff(){
 document.documentElement.classList.remove('jvfull');
 if(app){app.style.transform=''}
 document.body.style.height='';
}
function fit(){
 if(!document.documentElement.classList.contains('jvfull')||!app)return;
 var s=Math.min(1,window.innerWidth/1280);
 app.style.transform='scale('+s+')';
 document.body.style.height=Math.ceil(app.offsetHeight*s)+'px';
}
window.addEventListener('resize',fit);
window.addEventListener('orientationchange',fit);
function isFull(){return document.documentElement.classList.contains('jvfull')}
function apply(){if(saved==='compact')fullOff();else fullOn()}
function btn(){
 var b=document.createElement('button');b.id='jvviewbtn';
 b.textContent=isFull()?'◱':'⛶';b.title='toggle full HUD / big text';
 b.onclick=function(){
  if(isFull()){fullOff();saved='compact';b.textContent='⛶'}
  else{fullOn();saved='full';b.textContent='◱'}
  try{localStorage.setItem('jvview',saved)}catch(e){}
  try{feedline('View: '+(isFull()?'full HUD':'big text'))}catch(e){}
 };
 document.body.appendChild(b);
}
if(document.readyState!=='loading'){apply();btn()}else{document.addEventListener('DOMContentLoaded',function(){apply();btn()})}
try{
 var s=document.createElement('style');
 s.textContent='.jvfull body{overflow-x:hidden}#app{transform-origin:top left}.jvfull #app{width:1280px}#jvviewbtn{position:fixed;bottom:64px;right:12px;z-index:99999;width:38px;height:38px;border-radius:10px;border:1px solid rgba(55,209,255,.45);background:rgba(4,10,18,.75);color:#8fd6ff;font-size:18px;box-shadow:0 0 12px rgba(55,209,255,.25)}';
 document.head.appendChild(s);
}catch(e){}
try{console.log('[JARVIS up13.js v2] full-HUD phone view on (JS zoom to 1280px, toggle bottom-right)')}catch(e){}
})();
