/* deepagent37 up16.js - upgrade pack 16: temp-chat sync guard (v1.0) */
(function(){
if(window.__u16)return;window.__u16=1;
if(!window.CG){console.log('[up16.js v1.0] core api missing, upgrade inert');return}
var ur=document.getElementById('upd');
if(ur){var vv=ur.querySelector('.val');if(vv)vv.textContent='2.9.15(22)';ur.onclick=function(){sys('2.9.15(22) - you are up to date')}}
var KEYS={'ds_chats':1,'ds_h':1,'ds_chat_last':1,'ds_titled':1};
var _si=Storage.prototype.setItem,_ri=Storage.prototype.removeItem;
function tempOn(){try{return localStorage.getItem('ds_temp')==='1'}catch(e){return false}}
function isLS(s){try{return s===window.localStorage}catch(e){return false}}
function isKey(k){return Object.prototype.hasOwnProperty.call(KEYS,String(k))}
Storage.prototype.setItem=function(k,v){
 if(isLS(this)&&tempOn()&&isKey(k)){window.__u16blocked=(window.__u16blocked||0)+1;console.log('[up16] blocked a chat save ('+k+')');return}
 return _si.call(this,k,v)};
Storage.prototype.removeItem=function(k){
 if(isLS(this)&&tempOn()&&isKey(k)){console.log('[up16] blocked a chat delete ('+k+')');return}
 return _ri.call(this,k)};
console.log('[chatgpt up16.js v1.0] temp-chat sync guard loaded: chat storage writes are intercepted live while temporary chat is on (up12 snapshot guard stays as a second layer)');
})();
