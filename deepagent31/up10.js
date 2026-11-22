/* deepagent31 up10.js - upgrade pack 10: backup and restore all chats (v1.0) */
(function(){
if(!window.CG){console.log('[up10.js v1.0] core api missing, upgrade inert');return}
var ur=document.getElementById('upd');
if(ur){var vv=ur.querySelector('.val');if(vv)vv.textContent='2.9.9(16)';ur.onclick=function(){sys('2.9.9(16) - you are up to date')}}
var anchor=document.getElementById('u9dl')||document.getElementById('dshare');
if(!anchor||!anchor.parentNode){console.log('[up10.js v1.0] drawer anchor missing, upgrade inert');return}
function grab(k,d){try{return JSON.parse(localStorage.getItem(k)||d)}catch(e){return JSON.parse(d)}}
var fi=document.createElement('input');fi.type='file';fi.accept='.json,application/json';fi.style.display='none';document.body.appendChild(fi);
var bk=document.createElement('div');bk.className='sitem';bk.id='u10bk';
bk.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v10M8 9l4 4 4-4"/><rect x="4" y="15" width="16" height="6" rx="2"/></svg>Backup all chats';
bk.onclick=function(){
 try{
  var data={app:'chatgpt replica',kind:'all chats backup',v:1,when:new Date().toISOString(),
   chats:grab('ds_chats','[]'),titled:grab('ds_titled','{}'),pins:grab('ds_pins','[]'),
   legacy:grab('ds_h','[]'),last:localStorage.getItem('ds_chat_last')||''};
  var n=(data.chats&&data.chats.length)||0;
  var bl=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});var u=URL.createObjectURL(bl);
  var a=document.createElement('a');a.href=u;a.download='chatgpt-backup-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();
  setTimeout(function(){URL.revokeObjectURL(u);if(a.parentNode)a.parentNode.removeChild(a)},500);
  console.log('[up10] backup saved ('+n+' chats)');
 }catch(e){console.log('[up10] backup error',e&&e.message)}
};
var rs=document.createElement('div');rs.className='sitem';rs.id='u10rs';
rs.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21V11M8 15l4 4 4-4"/><rect x="4" y="3" width="16" height="6" rx="2"/></svg>Restore backup';
rs.onclick=function(){fi.value='';fi.click()};
fi.onchange=function(){
 try{
  var f=fi.files&&fi.files[0];if(!f)return;
  var rd=new FileReader();
  rd.onload=function(){
   try{
    var o=JSON.parse(String(rd.result));
    if(!o||typeof o!=='object'||!Array.isArray(o.chats))throw new Error('not a backup file');
    localStorage.setItem('ds_chats',JSON.stringify(o.chats));
    if(o.titled)localStorage.setItem('ds_titled',JSON.stringify(o.titled));
    if(Array.isArray(o.pins))localStorage.setItem('ds_pins',JSON.stringify(o.pins));
    if(Array.isArray(o.legacy)&&o.legacy.length)localStorage.setItem('ds_h',JSON.stringify(o.legacy));
    if(o.last)localStorage.setItem('ds_chat_last',String(o.last));
    console.log('[up10] restore applied ('+o.chats.length+' chats)');
    if(typeof poke==='function'){poke()}else{location.reload()}
   }catch(e){console.log('[up10] restore error',e&&e.message)}
  };
  rd.readAsText(f);
 }catch(e){console.log('[up10] restore error',e&&e.message)}
};
anchor.parentNode.insertBefore(rs,anchor.nextSibling);
anchor.parentNode.insertBefore(bk,rs);
console.log('[chatgpt up10.js v1.0] backup and restore all chats loaded');
})();