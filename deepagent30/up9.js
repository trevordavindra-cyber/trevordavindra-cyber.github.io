/* deepagent30 up9.js - upgrade pack 9: scroll-to-bottom button + download chat as markdown (v1.0) */
(function(){
if(!window.CG){console.log('[up9.js v1.0] core api missing, upgrade inert');return}
var st=document.createElement('style');
st.textContent='#u9down{position:fixed;left:50%;transform:translateX(-50%);bottom:150px;z-index:9;width:34px;height:34px;border-radius:50%;border:1px solid var(--ln);background:var(--bg);color:var(--tx);display:none;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.18)}#u9down.show{display:flex}#u9down svg{width:16px;height:16px}';
document.head.appendChild(st);
var CH=document.getElementById('chat');
if(!CH){console.log('[up9.js v1.0] chat node missing, upgrade inert');return}
var b=document.createElement('button');b.id='u9down';b.title='scroll to bottom';
b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M6 13l6 6 6-6"/></svg>';
b.onclick=function(){CH.scrollTo({top:CH.scrollHeight,behavior:'smooth'});console.log('[up9] scroll to bottom')};
document.getElementById('main').appendChild(b);
function tick(){var far=CH.scrollHeight-CH.scrollTop-CH.clientHeight>200;b.classList.toggle('show',far)}
CH.addEventListener('scroll',tick,{passive:true});
new MutationObserver(tick).observe(CH,{childList:true,subtree:true});
tick();
var ur=document.getElementById('upd');
if(ur){var vv=ur.querySelector('.val');if(vv)vv.textContent='2.9.8(15)';ur.onclick=function(){sys('2.9.8(15) - you are up to date')}}
var ds=document.getElementById('dshare');
if(ds&&ds.parentNode){
 var dn=document.createElement('div');dn.className='sitem';dn.id='u9dl';
 dn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M8 11l4 4 4-4M5 21h14"/></svg>Download chat';
 dn.onclick=function(){
  try{
   var h=window.CG.hist()||[];
   var name='';try{name=String(localStorage.getItem('ds_chat_last')||'chat').replace(/[^\w\- ]+/g,'').trim()}catch(e){}
   if(!name)name='chat';
   var md='';for(var i=0;i<h.length;i++){md+=(h[i].role==='user'?'## You\n\n':'## ChatGPT\n\n')+String(h[i].content||'')+'\n\n'}
   if(!md)md='(empty chat)\n';
   var bl=new Blob([md],{type:'text/markdown'});var u=URL.createObjectURL(bl);
   var a=document.createElement('a');a.href=u;a.download=name+'.md';document.body.appendChild(a);a.click();
   setTimeout(function(){URL.revokeObjectURL(u);if(a.parentNode)a.parentNode.removeChild(a)},500);
   console.log('[up9] chat downloaded as markdown');
  }catch(e){console.log('[up9] download error',e&&e.message)}
 };
 ds.parentNode.insertBefore(dn,ds.nextSibling);
}
console.log('[chatgpt up9.js v1.0] scroll-to-bottom + download chat as markdown loaded');
})();