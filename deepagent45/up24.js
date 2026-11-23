/* deepagent45 up24.js - upgrade pack 24: custom instructions (v1.0) */
(function(){
if(window.__u24)return;window.__u24=1;
if(!window.CG){console.log('[up24.js v1.0] core api missing, upgrade inert');return}
var ur=document.getElementById('upd');
if(ur){var vv=ur.querySelector('.val');if(vv)vv.textContent='2.9.19(31)';ur.onclick=function(){sys('2.9.19(31) - you are up to date')}}
function T(m){
 try{sys(m)}
 catch(e){console.log('[up24] '+m)}
}
var st=document.createElement('style');st.id='u24style';document.head.appendChild(st);
st.textContent='#u24ov{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:2147483000;display:none}#u24ov.on{display:flex;align-items:center;justify-content:center}#u24card{background:var(--card,#fff);color:var(--tx,#111);border-radius:16px;padding:18px;width:min(92vw,420px);box-shadow:0 12px 40px rgba(0,0,0,.25)}#u24card h3{margin:0 0 8px;font-size:15px}#u24ta{width:100%;min-height:110px;resize:vertical;border:1px solid rgba(0,0,0,.15);border-radius:10px;padding:10px;font:inherit;font-size:14px;background:transparent;color:inherit;box-sizing:border-box}#u24hint{font-size:11px;color:var(--dim,#888);margin:6px 0 12px}#u24btns{display:flex;gap:8px;justify-content:flex-end}#u24btns button{border:0;border-radius:999px;padding:8px 16px;font:inherit;font-size:13px;cursor:pointer}#u24save{background:var(--tx,#111);color:var(--bg,#fff)}#u24x{background:rgba(0,0,0,.06);color:inherit}';
var ov=document.createElement('div');ov.id='u24ov';
ov.innerHTML='<div id="u24card"><h3>Custom instructions</h3><textarea id="u24ta" placeholder="How should the AI answer you? e.g. always answer in one word"></textarea><div id="u24hint">Applied to every new message in every chat.</div><div id="u24btns"><button id="u24x" type="button">Cancel</button><button id="u24save" type="button">Save</button></div></div>';
document.body.appendChild(ov);
var ta=document.getElementById('u24ta');
function open(){ta.value=localStorage.getItem('ds_persona')||'';ov.classList.add('on');try{ta.focus()}catch(e){}}
function close(){ov.classList.remove('on')}
document.addEventListener('click',function(e){
 var t=e.target;
 if(t.closest&&t.closest('.row[data-go="pers"]')){e.preventDefault();e.stopPropagation();open();return}
 if(t.closest&&t.closest('#u24x')){e.preventDefault();e.stopPropagation();close();return}
 if(t.id==='u24ov'){close();return}
 if(t.closest&&t.closest('#u24save')){
  e.preventDefault();e.stopPropagation();
  var v=ta.value.trim();
  if(v){localStorage.setItem('ds_persona',v);T('custom instructions saved')}else{localStorage.removeItem('ds_persona');T('custom instructions cleared')}
  close();
 }
},true);
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&ov.classList.contains('on')){e.stopPropagation();close()}},true);
var of=window.fetch;
window.fetch=function(u,o){
 try{
  var s=String(u);
  if(o&&o.method&&String(o.method).toUpperCase()==='POST'&&o.body&&typeof o.body==='string'&&s.indexOf('pollinations')>-1&&o.body.indexOf('"messages"')>-1){
   var p=JSON.parse(o.body);
   if(p&&Array.isArray(p.messages)&&p.messages.length&&p.messages[0]&&p.messages[0].role!=='system'){
    var txt=localStorage.getItem('ds_persona');
    if(txt){p.messages.unshift({role:'system',content:txt});o=Object.assign({},o,{body:JSON.stringify(p)})}
   }
  }
 }catch(e){}
 return of.apply(this,[u,o]);
};
console.log('[chatgpt up24.js v1.0] custom instructions loaded: settings > Personalization now opens an instructions editor applied to every send');
})();
