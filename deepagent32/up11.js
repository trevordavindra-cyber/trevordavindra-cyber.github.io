/* deepagent32 up11.js - upgrade pack 11: keyboard shortcuts (v1.0) */
(function(){
if(!window.CG){console.log('[up11.js v1.0] core api missing, upgrade inert');return}
var ur=document.getElementById('upd');
if(ur){var vv=ur.querySelector('.val');if(vv)vv.textContent='2.9.10(17)';ur.onclick=function(){sys('2.9.10(17) - you are up to date')}}
function stopIcon(){var p=document.querySelector('#send path');return p&&p.getAttribute('d')==='M9 9h6v6H9z'}
function copyLast(){
 try{
  var h=(window.CG&&CG.hist&&CG.hist())||[];
  var last='';for(var i=h.length-1;i>=0;i--){if(h[i].role!=='user'){last=String(h[i].content||'');break}}
  if(!last){console.log('[up11] nothing to copy');return}
  var done=function(){console.log('[up11] last reply copied')};
  function fb(){var ta=document.createElement('textarea');ta.value=last;ta.style.position='fixed';ta.style.left='-9999px';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');done()}catch(e2){console.log('[up11] copy error',e2&&e2.message)}if(ta.parentNode)ta.parentNode.removeChild(ta)}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(last).then(done,fb)}else{fb()}
 }catch(e){console.log('[up11] copy error',e&&e.message)}
}
document.addEventListener('keydown',function(e){
 try{
  var mod=e.ctrlKey||e.metaKey;
  var t=e.target||{};var tag=String(t.tagName||'').toLowerCase();
  var typing=(tag==='input'||tag==='textarea'||t.isContentEditable);
  if(e.key==='Escape'){
   if(stopIcon()){var s=document.getElementById('send');if(s){s.click();console.log('[up11] esc: stop clicked')}}
   return}
  if(mod&&!e.shiftKey&&(e.key==='k'||e.key==='K')){
   e.preventDefault();var b=document.getElementById('dsrch');if(b){b.focus();console.log('[up11] ctrl+k: search focused')}return}
  if(mod&&e.shiftKey&&(e.key==='O'||e.key==='o')){
   e.preventDefault();var n=document.getElementById('newchat')||document.getElementById('newchatd');if(n){n.click();console.log('[up11] ctrl+shift+o: new chat')}return}
  if(mod&&e.shiftKey&&(e.key==='C'||e.key==='c')&&!typing){e.preventDefault();copyLast();return}
  if(e.key==='/'&&!typing){e.preventDefault();var i2=document.getElementById('inp');if(i2){i2.focus();console.log('[up11] slash: composer focused')}return}
 }catch(err){console.log('[up11] shortcut error',err&&err.message)}
},true);
var anchor=document.getElementById('u10rs')||document.getElementById('u10bk')||document.getElementById('dshare');
if(anchor&&anchor.parentNode){
 var ks=document.createElement('div');ks.className='sitem';ks.id='u11ks';
 ks.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/></svg>Keyboard shortcuts';
 ks.onclick=function(){sys('Ctrl+Shift+O new chat | Ctrl+K search chats | Ctrl+Shift+C copy last reply | / focus composer | Esc stop')};
 anchor.parentNode.insertBefore(ks,anchor.nextSibling);
}
console.log('[chatgpt up11.js v1.0] keyboard shortcuts loaded');
})();