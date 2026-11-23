'use strict';
// up18.js — PHASE 12 GROWTH + RELIABILITY (Nov 23 2026) // collab outreach log, feedback inbox,
// content pillars, sound tracker, a/b caption tester, growth goals, auto-heal, integrity check,
// quota watcher, resume summary
(function(){
if(window.__tk2up18)return;window.__tk2up18=1;
function $(id){return document.getElementById(id)}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function lsGet(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}}
function dl(name,text){try{var b=new Blob([text],{type:'text/plain'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},800);}catch(e){log('download blocked: '+e.message)}}
function clipDur(c){return (c.end-c.start)/(c.speed||1)}
function totalD(){var t=0;for(var i=0;i<S.clips.length;i++)t+=clipDur(S.clips[i]);return t}
function hh(at){try{return new Date(at).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})}catch(e){return ''}}
function today(){var d=new Date();function p(n){return (n<10?'0':'')+n}return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())}
function mkBtn(t,fn,fl,id){var b=document.createElement('button');b.className='btn';b.textContent=t;b.style.flex=fl||'0 0 auto';if(id)b.id=id;b.onclick=fn;return b}
function mkInp(id,ph,fl){var i=document.createElement('input');i.id=id;i.className='inp';i.placeholder=ph||'';i.style.flex=fl||'1 1 auto';return i}
function mkRow(gap){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap=(gap||6)+'px';r.style.marginTop='6px';r.style.alignItems='center';return r}

if(!S.eco)S.eco={};
var E=S.eco;
if(!E.gr)E.gr={collab:[],fb:[],pillars:[],sounds:[],ab:[],goal:null};
if(!E.rl)E.rl={hash:'',lastHeal:0};
function saveE(){try{save()}catch(e){}}
function csvOf(rows){var out='';for(var i=0;i<rows.length;i++){var r=rows[i];for(var j=0;j<r.length;j++){out+='"'+String(r[j]).replace(/"/g,'""')+'"';if(j<r.length-1)out+=','}out+='\n'}return out}

// --- 1 collab outreach log
var CST=['CONTACTED','WAITING','COLLABED'];
function addCollab(){var v=($('n1col').value||'').trim();if(!v){log('type a creator name or @handle first');return}E.gr.collab.push({t:v.slice(0,50),st:0,at:Date.now()});$('n1col').value='';saveE();renderCollab();log('collab logged: '+v.slice(0,30)+' (CONTACTED)',true)}
function renderCollab(){var l=$('n1colList');if(!l)return;l.innerHTML='';var a=E.gr.collab||[];
  if(!a.length){var e=document.createElement('div');e.className='note';e.textContent='no collabs tracked yet — log everyone you reach out to so nothing gets dropped';l.appendChild(e);return}
  for(var i=0;i<a.length;i++){(function(idx){var r=document.createElement('div');r.className='note';r.style.display='flex';r.style.gap='6px';r.style.alignItems='center';
    var s=document.createElement('span');s.textContent=(idx+1)+'. '+a[idx].t+' ['+CST[a[idx].st%3]+']';s.style.flex='1 1 auto';r.appendChild(s);
    var cb=mkBtn(CST[(a[idx].st+1)%3],function(){a[idx].st=(a[idx].st+1)%3;saveE();renderCollab()},'0 0 auto');
    var db=mkBtn('DEL',function(){a.splice(idx,1);saveE();renderCollab()},'0 0 auto');
    r.appendChild(cb);r.appendChild(db);l.appendChild(r)})(i)}}
function collabCsv(){var a=E.gr.collab||[];if(!a.length){log('no collabs to export yet');return}
  var rows=[['name','status','logged']];for(var i=0;i<a.length;i++)rows.push([a[i].t,CST[a[i].st%3],new Date(a[i].at).toISOString().slice(0,10)]);
  dl('tiktok2-collab-outreach-'+today()+'.csv',csvOf(rows));log('collab log exported ('+a.length+' rows)',true)}

// --- 2 feedback inbox
function addFb(){var v=($('n1fb').value||'').trim();if(!v){log('paste a comment first');return}E.gr.fb.push({t:v.slice(0,120),done:0,at:Date.now()});$('n1fb').value='';saveE();renderFb();log('feedback saved — mark it handled when you act on it',true)}
function renderFb(){var l=$('n1fbList');if(!l)return;l.innerHTML='';var a=E.gr.fb||[];
  if(!a.length){var e=document.createElement('div');e.className='note';e.textContent='no feedback saved yet';l.appendChild(e);return}
  var done=0;for(var i=0;i<a.length;i++)done+=a[i].done?1:0;
  var head=document.createElement('div');head.className='note';head.textContent=done+' of '+a.length+' handled';l.appendChild(head);
  for(var j=0;j<a.length;j++){(function(idx){var r=document.createElement('div');r.className='note';r.style.display='flex';r.style.gap='6px';r.style.alignItems='center';
    var s=document.createElement('span');s.textContent=(a[idx].done?'[handled] ':'[open] ')+a[idx].t;s.style.flex='1 1 auto';r.appendChild(s);
    var ob=mkBtn(a[idx].done?'REOPEN':'DONE',function(){a[idx].done=a[idx].done?0:1;saveE();renderFb()},'0 0 auto');
    var db=mkBtn('DEL',function(){a.splice(idx,1);saveE();renderFb()},'0 0 auto');
    r.appendChild(ob);r.appendChild(db);l.appendChild(r)})(j)}}

// --- 3 content pillars
function addPillar(){var v=($('n1pil').value||'').trim();if(!v){log('name a pillar first (e.g. how-to)');return}
  for(var i=0;i<E.gr.pillars.length;i++)if(E.gr.pillars[i].t.toLowerCase()===v.toLowerCase()){log('pillar already exists');return}
  E.gr.pillars.push({t:v.slice(0,24),q:3,n:0,at:Date.now()});$('n1pil').value='';saveE();renderPillars();log('pillar added: '+v.slice(0,24)+' (goal 3/week, tap +1 POST when you ship one)',true)}
function wkStart(){var d=new Date();var day=(d.getDay()+6)%7;d.setHours(0,0,0,0);d.setDate(d.getDate()-day);return d.getTime()}
function renderPillars(){var l=$('n1pilList');if(!l)return;l.innerHTML='';var a=E.gr.pillars||[];
  if(!a.length){var e=document.createElement('div');e.className='note';e.textContent='no pillars yet — buckets like funny / story / how-to keep the feed balanced';l.appendChild(e);return}
  for(var i=0;i<a.length;i++){(function(idx){var p=a[idx];var r=document.createElement('div');r.className='note';r.style.display='flex';r.style.gap='6px';r.style.alignItems='center';
    var s=document.createElement('span');s.textContent=p.t+': '+p.n+' / '+p.q+' this week'+(p.n>=p.q?' ✓':'');s.style.flex='1 1 auto';r.appendChild(s);
    var pb=mkBtn('+1 POST',function(){p.n++;saveE();renderPillars()},'0 0 auto');
    var db=mkBtn('DEL',function(){a.splice(idx,1);saveE();renderPillars()},'0 0 auto');
    r.appendChild(pb);r.appendChild(db);l.appendChild(r)})(i)}}

// --- 4 sound tracker
function addSound(){var v=($('n1snd').value||'').trim();if(!v){log('type the sound name first');return}E.gr.sounds.push({t:v.slice(0,60),at:Date.now()});$('n1snd').value='';saveE();renderSounds();log('sound tracked: '+v.slice(0,30),true)}
function renderSounds(){var l=$('n1sndList');if(!l)return;l.innerHTML='';var a=E.gr.sounds||[];
  if(!a.length){var e=document.createElement('div');e.className='note';e.textContent='no sounds tracked yet';l.appendChild(e);return}
  for(var i=0;i<a.length;i++){(function(idx){var r=document.createElement('div');r.className='note';r.style.display='flex';r.style.gap='6px';r.style.alignItems='center';
    var s=document.createElement('span');s.textContent=(idx+1)+'. '+a[idx].t+' (added '+new Date(a[idx].at).toISOString().slice(0,10)+')';s.style.flex='1 1 auto';r.appendChild(s);
    var db=mkBtn('DEL',function(){a.splice(idx,1);saveE();renderSounds()},'0 0 auto');r.appendChild(db);l.appendChild(r)})(i)}}

// --- 5 a/b caption tester
function addAb(){var a1=($('n1abA').value||'').trim(),b1=($('n1abB').value||'').trim();
  if(!a1||!b1){log('type both captions (A and B) first');return}
  E.gr.ab.push({a:a1.slice(0,80),b:b1.slice(0,80),w:0,at:Date.now()});$('n1abA').value='';$('n1abB').value='';saveE();renderAb();log('a/b test saved — pick the winner once you know',true)}
function renderAb(){var l=$('n1abList');if(!l)return;l.innerHTML='';var a=E.gr.ab||[];
  if(!a.length){var e=document.createElement('div');e.className='note';e.textContent='no a/b tests yet';l.appendChild(e);return}
  var wins=0,total=0;for(var i=0;i<a.length;i++)if(a[i].w){total++;if(a[i].w===1)wins++}
  var head=document.createElement('div');head.className='note';head.textContent=total?('A wins '+wins+' of '+total+' decided tests'):'none decided yet';l.appendChild(head);
  for(var j=0;j<a.length;j++){(function(idx){var t=a[idx];var r=document.createElement('div');r.className='note';
    var s=document.createElement('div');s.textContent=(t.w===1?'WINNER A':(t.w===2?'WINNER B':'undecided'))+' — A: '+t.a+' | B: '+t.b;r.appendChild(s);
    var rr=mkRow(6);
    var ab=mkBtn('PICK A',function(){t.w=1;saveE();renderAb()},'0 0 auto');
    var bb=mkBtn('PICK B',function(){t.w=2;saveE();renderAb()},'0 0 auto');
    var db=mkBtn('DEL',function(){a.splice(idx,1);saveE();renderAb()},'0 0 auto');
    rr.appendChild(ab);rr.appendChild(bb);rr.appendChild(db);r.appendChild(rr);l.appendChild(r)})(j)}}

// --- 6 growth goals
function setGoal(){var v=parseInt(($('n1goal').value||''),10);if(!v||v<=0){log('type a follower target number first');return}
  E.gr.goal={target:v,cur:0,at:Date.now()};$('n1goal').value='';saveE();renderGoal();log('growth goal set: '+v+' followers — log your count as it grows',true)}
function logGoal(){var g=E.gr.goal;if(!g){log('set a goal first');return}
  var v=parseInt(($('n1goalCur').value||''),10);if(isNaN(v)||v<0){log('type your current follower count first');return}
  var prev=g.cur||0;g.cur=v;g.lastLog=Date.now();$('n1goalCur').value='';saveE();renderGoal();
  log('logged '+v+' followers ('+(v-prev>=0?'+':'')+(v-prev)+' since last) — '+Math.min(100,Math.round(v/g.target*100))+'% of goal',true)}
function renderGoal(){var l=$('n1goalList');if(!l)return;l.innerHTML='';var g=E.gr.goal;
  if(!g){var e=document.createElement('div');e.className='note';e.textContent='no goal set yet';l.appendChild(e);return}
  var pct=Math.min(100,Math.round((g.cur||0)/g.target*100));
  var s=document.createElement('div');s.className='note';s.textContent='target '+g.target+' — current '+(g.cur||0)+' — '+pct+'% there'+(g.lastLog?' (updated '+hh(g.lastLog)+')':'');l.appendChild(s)}

// --- 7 auto-heal
function heal(){var fixes=0;var msgs=[];
  if(!Array.isArray(S.clips)){S.clips=[];fixes++;msgs.push('clips array was missing — reset')}
  for(var i=0;i<S.clips.length;i++){var c=S.clips[i];
    if(typeof c.start!=='number'||isNaN(c.start)){c.start=0;fixes++;msgs.push('clip '+(i+1)+' start reset')}
    if(typeof c.end!=='number'||isNaN(c.end)){c.end=(c.start||0)+3;fixes++;msgs.push('clip '+(i+1)+' end reset')}
    if(c.end<c.start){var tmp=c.start;c.start=c.end;c.end=tmp;fixes++;msgs.push('clip '+(i+1)+' start/end swapped')}
    if(typeof c.speed!=='number'||c.speed<=0||c.speed>4){c.speed=1;fixes++;msgs.push('clip '+(i+1)+' speed reset to 1x')}}
  if(!S.eco||typeof S.eco!=='object'){S.eco={};fixes++;msgs.push('eco state missing — reset')}
  if(!E.gr||typeof E.gr!=='object'){E.gr={collab:[],fb:[],pillars:[],sounds:[],ab:[],goal:null};fixes++;msgs.push('growth state missing — reset')}
  if(!E.rl||typeof E.rl!=='object'){E.rl={hash:'',lastHeal:0};fixes++;msgs.push('reliability state missing — reset')}
  E.rl.lastHeal=Date.now();saveE();
  log('auto-heal: '+(fixes?('fixed '+fixes+' issue'+(fixes>1?'s':'')+' — '+msgs.join('; ')):'state is clean, nothing to fix'),true)}

// --- 8 integrity check
function djb2(s){var h=5381;for(var i=0;i<s.length;i++){h=((h<<5)+h+s.charCodeAt(i))>>>0}return h.toString(16)}
function integrity(){var h=djb2(JSON.stringify(S.clips||[]));
  if(!E.rl.hash){E.rl.hash=h;saveE();log('integrity baseline set ('+h+') — run again later to compare',true);return}
  if(h===E.rl.hash){log('integrity OK — timeline matches baseline ('+h+')',true)}
  else{log('integrity: timeline changed since baseline ('+E.rl.hash+' -> '+h+') — expected if you edited, unexpected if you only opened this page',true);
    E.rl.hash=h;saveE();log('baseline updated to current state')}}

// --- 9 quota watcher
function quota(){var done=false;
  try{if(navigator.storage&&navigator.storage.estimate){navigator.storage.estimate().then(function(e){
    done=true;var used=e.usage||0,q=e.quota||0;
    if(q){var pct=Math.round(used/q*100);log('device storage: '+(used/1048576).toFixed(1)+' MB used of '+(q/1073741824).toFixed(1)+' GB quota ('+pct+'%)'+(pct>80?' — WARNING: near quota, back up and clear old media':''),true)}
    else{log('browser did not report a quota — use the storage meter for project size');done=true}}).catch(function(){done=true;log('storage estimate blocked by the browser — use the storage meter');})}}catch(e){}
  setTimeout(function(){if(!done)log('storage estimate unavailable in this browser — use the storage meter')},1200)}

// --- 10 resume summary
function resume(){var ls=E.ops&&E.ops.lastSave?E.ops.lastSave:0;
  if(ls){var gap=Date.now()-ls;if(gap>600000){var mins=Math.round(gap/60000);
    log('welcome back — '+S.clips.length+' clips, '+totalD().toFixed(1)+'s, last edit '+hh(ls)+' ('+mins+' min ago)',true)}}}

function mount(){
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='Growth + Reliability (Phase 12)';card.appendChild(h);

  var crow=mkRow();crow.appendChild(mkInp('n1col','creator name or @handle','1 1 auto'));crow.appendChild(mkBtn('LOG COLLAB',addCollab,'0 0 22%','n1colAdd'));crow.appendChild(mkBtn('EXPORT CSV',collabCsv,'0 0 22%','n1colCsv'));card.appendChild(crow);
  var clist=document.createElement('div');clist.id='n1colList';clist.style.marginTop='6px';card.appendChild(clist);

  var frow=mkRow();frow.appendChild(mkInp('n1fb','paste a viewer comment','1 1 auto'));frow.appendChild(mkBtn('SAVE',addFb,'0 0 16%','n1fbAdd'));card.appendChild(frow);
  var flist=document.createElement('div');flist.id='n1fbList';flist.style.marginTop='6px';card.appendChild(flist);

  var prow=mkRow();prow.appendChild(mkInp('n1pil','pillar e.g. how-to','1 1 auto'));prow.appendChild(mkBtn('ADD PILLAR',addPillar,'0 0 24%','n1pilAdd'));card.appendChild(prow);
  var plist=document.createElement('div');plist.id='n1pilList';plist.style.marginTop='6px';card.appendChild(plist);

  var srow=mkRow();srow.appendChild(mkInp('n1snd','trending sound name','1 1 auto'));srow.appendChild(mkBtn('TRACK SOUND',addSound,'0 0 24%','n1sndAdd'));card.appendChild(srow);
  var slist=document.createElement('div');slist.id='n1sndList';slist.style.marginTop='6px';card.appendChild(slist);

  var arow=mkRow();arow.appendChild(mkInp('n1abA','caption A','1 1 auto'));arow.appendChild(mkInp('n1abB','caption B','1 1 auto'));arow.appendChild(mkBtn('SAVE TEST',addAb,'0 0 20%','n1abAdd'));card.appendChild(arow);
  var alist=document.createElement('div');alist.id='n1abList';alist.style.marginTop='6px';card.appendChild(alist);

  var grow=mkRow();grow.appendChild(mkInp('n1goal','follower target','1 1 auto'));grow.appendChild(mkBtn('SET GOAL',setGoal,'0 0 20%','n1goalSet'));grow.appendChild(mkInp('n1goalCur','current count','1 1 auto'));grow.appendChild(mkBtn('LOG IT',logGoal,'0 0 18%','n1goalLog'));card.appendChild(grow);
  var glist=document.createElement('div');glist.id='n1goalList';glist.style.marginTop='6px';card.appendChild(glist);

  var rrow=mkRow();rrow.appendChild(mkBtn('AUTO-HEAL',heal,'0 0 30%','n1heal'));rrow.appendChild(mkBtn('INTEGRITY CHECK',integrity,'0 0 30%','n1integ'));rrow.appendChild(mkBtn('QUOTA WATCH',quota,'0 0 30%','n1quota'));card.appendChild(rrow);

  var note=document.createElement('div');note.className='note';
  note.textContent='growth + reliability: track collabs and feedback, plan pillars, test captions, watch your goal — and auto-heal, integrity and quota checks keep the project safe. everything saves with the project.';
  card.appendChild(note);

  var hs=document.querySelectorAll('.card h2');var anchor=null;
  for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('Ops Console')>=0){anchor=hs[i].parentElement;break}}
  if(!anchor){for(var j=0;j<hs.length;j++){if(hs[j].textContent.indexOf('Creator Ecosystem')>=0){anchor=hs[j].parentElement;break}}}
  if(anchor){if(anchor.nextSibling)anchor.parentElement.insertBefore(card,anchor.nextSibling);else anchor.parentElement.appendChild(card)}
  else document.body.appendChild(card);

  renderCollab();renderFb();renderPillars();renderSounds();renderAb();renderGoal();resume();
  log('growth + reliability live',true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();