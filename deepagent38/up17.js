/* deepagent38 up17.js - upgrade pack 17: image welcome chip routing (v1.0) */
(function(){
if(window.__u17)return;window.__u17=1;
if(!window.CG){console.log('[up17.js v1.0] core api missing, upgrade inert');return}
var ur=document.getElementById('upd');
if(ur){var vv=ur.querySelector('.val');if(vv)vv.textContent='2.9.16(23)';ur.onclick=function(){sys('2.9.16(23) - you are up to date')}}
var DEFIMG='make an image of a neon city at night';
document.addEventListener('click',function(e){
 var t=e.target&&e.target.closest?e.target.closest('.wchip'):null;
 if(!t)return;
 var label=(t.textContent||'').toLowerCase();
 if(label.indexOf('image')===-1)return;
 e.preventDefault();e.stopImmediatePropagation();
 var inp=document.getElementById('inp');
 if(!inp){console.log('[up17] composer missing, chip left to the app');return}
 inp.value=DEFIMG;
 try{inp.dispatchEvent(new Event('input',{bubbles:true}))}catch(x){}
 var send=document.getElementById('send');
 if(send){console.log('[up17] image welcome chip routed to the image studio');send.click()}
 else{console.log('[up17] send button missing, chip left to the app')}
},true);
console.log('[chatgpt up17.js v1.0] image welcome chip routing loaded: the Create image chip now goes straight to the image studio');
})();
