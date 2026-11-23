/* deepagent49 up28.js - upgrade pack 28: quick prompt chips (v1.0) */
(function(){
if(window.__u28)return;window.__u28=1;
if(!window.CG){console.log('[up28.js v1.0] core api missing, upgrade inert');return}
var ur=document.getElementById('upd');
if(ur){var vv=ur.querySelector('.val');if(vv)vv.textContent='2.9.22(35)';ur.onclick=function(){sys('2.9.22(35) - you are up to date')}}
var KEY='u25prompts';
function load(){try{return JSON.parse(localStorage.getItem(KEY))||[]}catch(e){return[]}}
var bar=document.createElement('div');bar.id='u28bar';
var st=document.createElement('style');st.id='u28style';document.head.appendChild(st);
st.textContent='#u28bar{display:none;gap:6px;overflow-x:auto;padding:6px 2px 2px;scrollbar-width:none;-webkit-overflow-scrolling:touch}#u28bar::-webkit-scrollbar{display:none}#u28bar.on{display:flex}#u28bar .u28chip{flex:0 0 auto;border:0;border-radius:999px;padding:5px 12px;font:inherit;font-size:12px;cursor:pointer;background:rgba(0,0,0,.06);color:inherit;white-space:nowrap;max-width:46vw;overflow:hidden;text-overflow:ellipsis}#u28bar .u28chip:hover{background:rgba(0,0,0,.1)}#u28bar .u28plus{font-weight:600}';
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
var sig=null;
function render(){
 var a=load();
 var s=a.map(function(x){return x.t}).join('\u0001');
 if(s===sig)return;
 sig=s;
 bar.innerHTML=a.map(function(x,i){return '<button class="u28chip" data-u28i="'+i+'" title="'+esc(x.p)+'">'+esc(x.t)+'</button>'}).join('')+'<button class="u28chip u28plus" data-u28plus="1" title="add a prompt">+</button>';
 bar.classList.toggle('on',a.length>0);
}
function mount(){
 var inp=document.getElementById('inp');
 var card=inp&&inp.closest?inp.closest('.ccard'):null;
 if(!card)return;
 if(bar.parentNode!==card){card.insertBefore(bar,card.firstChild)}
 render();
}
document.addEventListener('click',function(e){
 var t=e.target;
 var c=t.closest&&t.closest('.u28chip');
 if(!c||!bar.contains(c))return;
 e.preventDefault();e.stopPropagation();
 if(c.hasAttribute('data-u28plus')){
  var lib=document.getElementById('u25lib');
  if(lib){lib.click()}else{console.log('[up28] prompt library not found')}
  return;
 }
 var i=parseInt(c.getAttribute('data-u28i')||'-1',10),a=load(),x=a[i];
 if(!x)return;
 var inp=document.getElementById('inp');
 if(inp){inp.value=x.p;try{inp.dispatchEvent(new Event('input',{bubbles:true}))}catch(e2){}try{inp.focus()}catch(e3){}console.log('[up28] prompt "'+x.t+'" inserted into the composer')}
},true);
document.addEventListener('click',function(){setTimeout(function(){var a=load();if(a.map(function(x){return x.t}).join('\u0001')!==sig){sig=null;render()}},60)},false);
window.addEventListener('storage',function(e){if(e.key===KEY){sig=null;render()}});
setInterval(mount,1000);
mount();
console.log('[chatgpt up28.js v1.0] quick prompt chips loaded: saved prompts tap-to-insert above the composer');
})();
