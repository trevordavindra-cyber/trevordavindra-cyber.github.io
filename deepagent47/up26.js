/* deepagent47 up26.js - upgrade pack 26: projects (chat folders) v1.3 */
(function(){
if(window.__u26)return;window.__u26=1;
var DC=document.getElementById('dchats');
if(!DC){console.log('[up26] sidebar missing, upgrade inert');return}
var PK='u26projects',OK='u26open';
function loadP(){try{var o=JSON.parse(localStorage.getItem(PK)||'{}');return o&&typeof o==='object'&&!Array.isArray(o)?o:{}}catch(e){return{}}}
function saveP(o){try{localStorage.setItem(PK,JSON.stringify(o))}catch(e){}}
function loadO(){try{return JSON.parse(localStorage.getItem(OK)||'{}')}catch(e){return{}}}
function saveO(o){try{localStorage.setItem(OK,JSON.stringify(o))}catch(e){}}
function chats(){try{var a=JSON.parse(localStorage.getItem('ds_chats')||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}}
var st=document.createElement('style');st.textContent='#u26proj{padding:2px 8px 6px}#u26head{display:flex;align-items:center;justify-content:space-between;padding:8px 10px 2px}#u26head span{font-size:11px;color:var(--dim);letter-spacing:.04em;text-transform:uppercase}#u26new{border:0;background:none;color:var(--fg);font-size:16px;cursor:pointer;padding:2px 6px;border-radius:6px;line-height:1}#u26new:hover{background:rgba(128,128,128,.14)}.u26p{display:flex;align-items:center;gap:6px;padding:8px 10px;border-radius:10px;cursor:pointer;font-size:14px;color:var(--fg)}.u26p:hover{background:rgba(128,128,128,.12)}.u26p .chev{color:var(--dim);font-size:10px;width:12px;transition:transform .12s}.u26p.open .chev{transform:rotate(90deg)}.u26p .pname{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.u26p .pcnt{font-size:11px;color:var(--dim)}.u26p .pdel{display:none;color:var(--dim);cursor:pointer;padding:0 4px;font-size:12px}.u26p:hover .pdel{display:inline}.u26kids{display:none;padding-left:14px}.u26kids.show{display:block}.u26kids .dchat{padding:7px 10px;font-size:13px}.u26mv{display:none;margin-left:6px;color:var(--dim);cursor:pointer;font-size:12px}.dchat:hover .u26mv{display:inline}#u26menu{position:fixed;z-index:9999;background:var(--panel,#fff);border:1px solid rgba(128,128,128,.25);border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.18);padding:6px;min-width:180px}.u26mi{padding:8px 10px;border-radius:8px;font-size:13px;cursor:pointer;color:var(--fg)}.u26mi:hover{background:rgba(128,128,128,.14)}.u26sep{height:1px;background:rgba(128,128,128,.2);margin:4px 2px}#u26ask{position:fixed;z-index:10000;top:30%;left:50%;transform:translateX(-50%);background:var(--panel,#fff);border:1px solid rgba(128,128,128,.25);border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.22);padding:14px;width:260px;box-sizing:border-box}#u26askt{font-size:13px;font-weight:600;margin-bottom:8px;color:var(--fg)}#u26aski{width:100%;box-sizing:border-box;padding:8px 10px;border:1px solid rgba(128,128,128,.35);border-radius:8px;font-size:14px;outline:none;color:var(--fg);background:var(--panel,#fff)}#u26askr{display:flex;gap:8px;justify-content:flex-end;margin-top:10px}#u26askr button{border:1px solid rgba(128,128,128,.35);background:var(--panel,#fff);color:var(--fg);padding:6px 12px;border-radius:8px;font-size:13px;cursor:pointer}#u26askok{background:#0d0d0d;color:#fff;border-color:#0d0d0d}';
document.head.appendChild(st);
var WRAP=document.createElement('div');WRAP.id='u26proj';DC.parentNode.insertBefore(WRAP,DC);
function closeMenu(){var m=document.getElementById('u26menu');if(m)m.remove()}
function askName(cb){
 closeMenu();
 var m=document.createElement('div');m.id='u26ask';
 var t=document.createElement('div');t.id='u26askt';t.textContent='Project name';m.appendChild(t);
 var inp=document.createElement('input');inp.id='u26aski';inp.placeholder='e.g. Work';m.appendChild(inp);
 var row=document.createElement('div');row.id='u26askr';
 var no=document.createElement('button');no.id='u26askno';no.textContent='Cancel';
 var ok=document.createElement('button');ok.id='u26askok';ok.textContent='Create';
 row.appendChild(no);row.appendChild(ok);m.appendChild(row);
 function done(){m.remove()}
 ok.onclick=function(ev){ev.stopPropagation();var v=inp.value.trim();done();if(v)cb(v)};
 no.onclick=function(ev){ev.stopPropagation();done()};
 m.addEventListener('keydown',function(ev){ev.stopPropagation();if(ev.key==='Enter'){var v=inp.value.trim();done();if(v)cb(v)}else if(ev.key==='Escape'){done()}});
 setTimeout(function(){inp.focus()},30);
 document.body.appendChild(m);
}
function menu(title,x,y){
 closeMenu();var p=loadP(),m=document.createElement('div');m.id='u26menu';
 m.style.left=Math.min(x,window.innerWidth-200)+'px';m.style.top=Math.min(y,window.innerHeight-40*(Object.keys(p).length+2))+'px';
 var inP=null;for(var n in p){if((p[n]||[]).indexOf(title)>-1)inP=n}
 Object.keys(p).forEach(function(n){
  if(n===inP)return;var it=document.createElement('div');it.className='u26mi';it.textContent='move to '+n;
  it.onclick=function(ev){ev.stopPropagation();var q=loadP();var arr=q[n]||[];if(arr.indexOf(title)<0)arr.push(title);q[n]=arr;for(var k in q){if(k!==n){var i=(q[k]||[]).indexOf(title);if(i>-1)q[k].splice(i,1)}}saveP(q);closeMenu();paint();};
  m.appendChild(it)});
 var sep=document.createElement('div');sep.className='u26sep';m.appendChild(sep);
 var np=document.createElement('div');np.className='u26mi';np.textContent='new project\u2026';
 np.onclick=function(ev){ev.stopPropagation();askName(function(n){var q=loadP();if(!q[n])q[n]=[];var arr=q[n];if(arr.indexOf(title)<0)arr.push(title);q[n]=arr;for(var k in q){if(k!==n){var i=(q[k]||[]).indexOf(title);if(i>-1)q[k].splice(i,1)}}saveP(q);closeMenu();paint()})};
 m.appendChild(np);
 if(inP){var rm=document.createElement('div');rm.className='u26mi';rm.textContent='no project';
  rm.onclick=function(ev){ev.stopPropagation();var q=loadP();var i=(q[inP]||[]).indexOf(title);if(i>-1)q[inP].splice(i,1);saveP(q);closeMenu();paint();};
  m.appendChild(rm)}
 document.body.appendChild(m);
}
DC.addEventListener('click',function(ev){
 var mv=ev.target.closest('.u26mv');if(!mv)return;
 var row=mv.closest('.dchat');if(!row)return;
 ev.preventDefault();ev.stopImmediatePropagation();
 var sp=row.querySelector('span');if(!sp)return;
 menu(sp.textContent,ev.clientX,ev.clientY);
},true);
document.addEventListener('click',function(ev){if(!ev.target.closest||!ev.target.closest('#u26menu'))closeMenu()},true);
function sweep(){
 var p=loadP(),inP={};for(var n in p){(p[n]||[]).forEach(function(t){inP[t]=n})}
 var live={};chats().forEach(function(r){live[r.t]=1});
 var ch=false;for(var n in p){var arr=(p[n]||[]).filter(function(t){return live[t]});if(arr.length!==(p[n]||[]).length){p[n]=arr;ch=true}}
 if(ch)saveP(p);
 var rows=DC.querySelectorAll('.dchat');
 for(var i=0;i<rows.length;i++){var sp=rows[i].querySelector('span');rows[i].style.display=(sp&&inP[sp.textContent])?'none':'';
  if(sp&&!rows[i].querySelector('.u26mv')){var mv=document.createElement('span');mv.className='u26mv';mv.textContent='\uD83D\uDCC1';mv.title='move to a project';rows[i].appendChild(mv)}}
 return inP;
}
function paint(){
 var p=loadP(),o=loadO();
 WRAP.innerHTML='';
 var head=document.createElement('div');head.id='u26head';
 var h=document.createElement('span');h.textContent='Projects';head.appendChild(h);
 var nb=document.createElement('button');nb.id='u26new';nb.textContent='+';nb.title='new project';
 nb.onclick=function(){askName(function(n){var q=loadP();if(!q[n])q[n]=[];saveP(q);paint()})};
 head.appendChild(nb);WRAP.appendChild(head);
 Object.keys(p).forEach(function(n){
  var titles=p[n]||[];
  var pr=document.createElement('div');pr.className='u26p'+(o[n]?' open':'');
  var ch=document.createElement('span');ch.className='chev';ch.textContent='\u25B8';pr.appendChild(ch);
  var nm=document.createElement('span');nm.className='pname';nm.textContent=n;pr.appendChild(nm);
  var ct=document.createElement('span');ct.className='pcnt';ct.textContent=titles.length;pr.appendChild(ct);
  var dl=document.createElement('span');dl.className='pdel';dl.textContent='\u2715';dl.title='delete project (chats go back to the list)';
  dl.onclick=function(ev){ev.stopPropagation();var q=loadP();delete q[n];saveP(q);paint()};
  pr.appendChild(dl);
  pr.onclick=function(){var q=loadO();q[n]=!q[n];saveO(q);paint()};
  WRAP.appendChild(pr);
  var kids=document.createElement('div');kids.className='u26kids'+(o[n]?' show':'');
  titles.forEach(function(t){
   var d=document.createElement('div');d.className='dchat';var sp=document.createElement('span');sp.textContent=t;d.appendChild(sp);
   var mv=document.createElement('span');mv.className='u26mv';mv.textContent='\uD83D\uDCC1';mv.title='move to a project';
   mv.onclick=function(ev){ev.stopPropagation();menu(t,ev.clientX,ev.clientY)};
   d.appendChild(mv);
   d.onclick=function(){var rows=DC.querySelectorAll('.dchat');for(var i=0;i<rows.length;i++){var s=rows[i].querySelector('span');if(s&&s.textContent===t){rows[i].click();return}}};
   kids.appendChild(d)});
  WRAP.appendChild(kids);
 });
 sweep();
}
new MutationObserver(function(){setTimeout(function(){sweep();paint()},0)}).observe(DC,{childList:true});
(function(){try{var v=document.querySelector('#upd .val');if(v)v.textContent='2.9.21(33)'}catch(e){}})();
paint();
console.log('[chatgpt up26.js v1.3] projects loaded');
})();
