'use strict';
// up19.js — PHASE 13 RELIABILITY II (Nov 23 2026) // auto-save heartbeat, shadow copy,
// offline banner, perf monitor, storage cleanup, health score, panic reset,
// checkpoint diff, orphaned media finder, unsaved-changes indicator
(function(){
if(window.__tk2up19)return;window.__tk2up19=1;
function $(id){return document.getElementById(id)}
function lsGet(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}}
function hh(at){try{return new Date(at).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})}catch(e){return ''}}
function fmtB(b){return b>1048576?(Math.round(b/1048576*10)/10)+' MB':(Math.round(b/1024*10)/10)+' KB'}
function clipDur(c){return (c.end-c.start)/(c.speed||1)}
function totalD(){var t=0;for(var i=0;i<S.clips.length;i++)t+=clipDur(S.clips[i]);return t}
function mkBtn(t,fn,fl,id){var b=document.createElement('button');b.className='btn';b.textContent=t;b.style.flex=fl||'0 0 auto';if(id)b.id=id;b.onclick=fn;return b}
function mkInp(id,ph){var i=document.createElement('input');i.id=id;i.placeholder=ph||'';return i}
function mkRow(gap){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap=(gap||6)+'px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function mkList(id){var l=document.createElement('div');l.id=id;l.style.marginTop='6px';return l}

if(!S.eco)S.eco={};
var E=S.eco;
if(!E.r13)E.r13={as:1,lastEdits:null,savedEdits:0};
function saveE(){try{save()}catch(e){}}

// --- 1+2 auto-save heartbeat + shadow copy
var shadowKey='tk2shadow';
function writeShadow(){
  try{
    var meta={};Object.keys(M).forEach(function(k){meta[k]={id:M[k].id,name:M[k].name,kind:M[k].kind,dur:M[k].dur}});
    var d=Object.assign({},S,{media:meta,variations:[]});d.selected=null;
    localStorage.setItem(shadowKey,JSON.stringify({d:d,at:Date.now()}));
    return true;
  }catch(e){log('shadow write failed: '+e.message);return false}
}
function heartbeat(){
  if(!E.r13.as)return;
  var e=(E.ops&&E.ops.edits)||0;
  if(E.r13.lastEdits===null){E.r13.lastEdits=e;return}
  if(e===E.r13.lastEdits)return;
  E.r13.lastEdits=e;
  try{save()}catch(err){log('auto-save failed: '+err.message);return}
  E.r13.savedEdits=e;
  writeShadow();
  renderDirty();
  log('auto-save heartbeat: saved + shadow copy written',true);
}
setInterval(heartbeat,60000);
function toggleAs(){E.r13.as=E.r13.as?0:1;saveE();renderDirty();log('auto-save heartbeat '+(E.r13.as?'ON — saves every minute when there are changes':'OFF'),true)}
function makeShadow(){if(writeShadow())log('shadow copy written ('+hh(Date.now())+') — restore it any time',true)}
function restoreShadow(){
  var s=lsGet(shadowKey,null);
  if(!s||!s.d){log('no shadow copy yet — make one first');return}
  try{localStorage.setItem('tk2proj',JSON.stringify(s.d));restore();log('shadow copy restored ('+hh(s.at)+') — check the timeline',true)}
  catch(e){log('shadow restore failed: '+e.message)}
}

// --- 3 offline banner
var ban=null;
function banner(){
  if(!ban){
    ban=document.createElement('div');
    ban.id='p1off';
    ban.style.cssText='position:fixed;top:0;left:0;right:0;z-index:99;background:#7a1622;color:#fff;font-size:11px;font-weight:800;letter-spacing:1px;text-align:center;padding:6px;display:none';
    ban.textContent='OFFLINE — editing still works, saving and sharing need the internet';
    document.body.appendChild(ban);
  }
  ban.style.display=navigator.onLine?'none':'block';
}
window.addEventListener('online',banner);window.addEventListener('offline',banner);

// --- 4 perf monitor
function perf(){
  var frames=0;var t0=performance.now();
  function tick(){frames++;if(performance.now()-t0<1200)requestAnimationFrame(tick);else{
    var sec=(performance.now()-t0)/1000;var fps=Math.round(frames/sec);
    var extra='';if(performance.memory&&performance.memory.usedJSHeapSize)extra=' · js heap '+fmtB(performance.memory.usedJSHeapSize);
    log('perf: '+fps+' fps idle'+extra,true);
  }}
  requestAnimationFrame(tick);
  var ts=performance.now();
  try{save();log('save() took '+Math.round(performance.now()-ts)+' ms');}catch(e){log('save timing failed: '+e.message)}
}

// --- 5 storage cleanup
function cleanScan(){
  var l=$('p1cleanList');if(!l)return;l.innerHTML='';
  var rows=[];
  try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf('tk2')===0)rows.push([k,(localStorage.getItem(k)||'').length*2])}}catch(e){}
  rows.sort(function(a,b){return b[1]-a[1]});
  var top=rows.slice(0,5);
  if(!top.length){var e=document.createElement('div');e.className='note';e.textContent='nothing stored locally yet';l.appendChild(e);return}
  for(var j=0;j<top.length;j++){(function(idx){
    var r=document.createElement('div');r.className='note';r.style.display='flex';r.style.gap='6px';r.style.alignItems='center';
    var s=document.createElement('span');s.textContent=top[idx][0]+' · '+fmtB(top[idx][1]);s.style.flex='1 1 auto';r.appendChild(s);
    var db=mkBtn('DELETE',function(){
      try{localStorage.removeItem(top[idx][0])}catch(e){}
      if(top[idx][0]==='tk2proj'){log('project data key removed — reload to start clean, or restore a checkpoint/shadow first')}
      else{log('deleted '+top[idx][0]+' ('+fmtB(top[idx][1])+' freed)',true)}
      cleanScan();
    },'0 0 auto');
    r.appendChild(db);l.appendChild(r);
  })(j)}
}

// --- 6 health score
function health(){
  var pts=0;var lines=[];
  var n=lsGet('tk2errn',0);
  var ep=n===0?20:(n<=2?12:(n<=5?6:0));pts+=ep;lines.push('errors '+(n===0?'none':n)+' — '+ep+'/20');
  var cks=lsGet('tk2ckpt',[]);
  var cp=0;
  if(cks.length){var age=Date.now()-cks[0].at;cp=age<900000?15:(age<3600000?10:(age<86400000?5:0))}
  pts+=cp;lines.push('checkpoint '+(cks.length?('fresh '+hh(cks[0].at)):'none yet')+' — '+cp+'/15');
  var ls=(E.ops&&E.ops.lastSave)||0;var sp=0;
  if(ls){var sa=Date.now()-ls;sp=sa<600000?15:(sa<3600000?10:5)}pts+=sp;
  lines.push('last save '+(ls?hh(ls):'never')+' — '+sp+'/15');
  var bytes=0;
  try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf('tk2')===0)bytes+=(localStorage.getItem(k)||'').length*2}}catch(e){}
  var bp=bytes<2500000?20:(bytes<4000000?12:5);pts+=bp;
  lines.push('storage '+fmtB(bytes)+' of ~5 MB budget — '+bp+'/20');
  var bad=0;
  for(var c=0;c<S.clips.length;c++){var x=S.clips[c];if(!(typeof x.start==='number'&&typeof x.end==='number'&&x.end>x.start&&(x.speed||1)>0))bad++}
  var kp=S.clips.length?(bad===0?15:8):10;pts+=kp;
  lines.push('clips '+(S.clips.length?(bad===0?'all sane':bad+' broken'):'none (fine)')+' — '+kp+'/15');
  var miss=0;
  for(var d=0;d<S.clips.length;d++){if(!M[S.clips[d].src])miss++}
  if(S.musicId&&!M[S.musicId])miss++;
  var mp=miss===0?15:(miss<=2?8:0);pts+=mp;
  lines.push('media refs '+(miss===0?'all valid':miss+' missing')+' — '+mp+'/15');
  var score=Math.min(100,pts);
  log('health score: '+score+'/100'+(score>=85?' — solid':(score>=60?' — watch the low lines':' — needs attention')),true);
  for(var q=0;q<lines.length;q++)log(' · '+lines[q]);
}

// --- 7 panic reset
function panic(){
  try{
    renderMediaList();
    if(typeof drawTimeline==='function')drawTimeline();
    banner();
    cleanScan();renderDirty();
    log('panic reset done: UI rebuilt, your project data was never touched',true);
  }catch(e){log('panic reset hit a snag: '+e.message+' — data is still safe')}
}

// --- 8 checkpoint diff
function diff(){
  var cks=lsGet('tk2ckpt',[]);
  if(!cks.length){log('no checkpoints yet — one is taken automatically every 5 minutes');return}
  var c=cks[0].d||{};
  function dur(arr){var t=0;for(var i=0;i<(arr||[]).length;i++){var x=arr[i];t+=((x.end-x.start)/(x.speed||1))}return Math.round(t*10)/10}
  var dc=(c.clips||[]).length,cc=S.clips.length;
  var dd=dur(c.clips),cd=Math.round(totalD()*10)/10;
  var ds=c.style||'?',cs=S.style||'?';
  var dn=(c.captions||[]).length,cn=(S.captions||[]).length;
  log('checkpoint diff ('+hh(cks[0].at)+' vs now):',true);
  log(' · clips: '+dc+' -> '+cc+(dc===cc?' (same)':''));
  log(' · length: '+dd+'s -> '+cd+'s'+(dd===cd?' (same)':''));
  log(' · style: '+ds+' -> '+cs+(ds===cs?' (same)':''));
  log(' · captions: '+dn+' -> '+cn+(dn===cn?' (same)':''));
}

// --- 9 orphaned media finder
function orphanScan(){
  var l=$('p1orphList');if(!l)return;l.innerHTML='';
  var refs={};for(var i=0;i<S.clips.length;i++)refs[S.clips[i].src]=1;
  if(S.musicId)refs[S.musicId]=1;
  var orph=[];
  Object.keys(M).forEach(function(k){if(!refs[k])orph.push(M[k])});
  if(!orph.length){var e=document.createElement('div');e.className='note';e.textContent='no orphaned media — everything in the library is used by the timeline';l.appendChild(e);return}
  for(var j=0;j<orph.length;j++){(function(idx){
    var r=document.createElement('div');r.className='note';r.style.display='flex';r.style.gap='6px';r.style.alignItems='center';
    var s=document.createElement('span');s.textContent=orph[idx].name+' ('+orph[idx].kind+') — not used by any clip';s.style.flex='1 1 auto';r.appendChild(s);
    var db=mkBtn('REMOVE',function(){
      try{if(orph[idx].url)URL.revokeObjectURL(orph[idx].url)}catch(e){}
      delete M[orph[idx].id];
      try{renderMediaList()}catch(e){}
      saveE();
      log('orphan removed: '+orph[idx].name,true);
      orphanScan();
    },'0 0 auto');
    r.appendChild(db);l.appendChild(r);
  })(j)}
}

// --- 10 unsaved-changes indicator
function renderDirty(){
  var l=$('p1dirtyLine');if(!l)return;
  var e=(E.ops&&E.ops.edits)||0;
  var uns=Math.max(0,e-(E.r13.savedEdits||0));
  var ls=(E.ops&&E.ops.lastSave)||0;
  l.textContent=uns?('unsaved changes: '+uns+' — last save '+(ls?hh(ls):'never')):'all changes saved'+(ls?(' ('+hh(ls)+')'):'');
}
setInterval(renderDirty,5000);
function saveNow(){try{save()}catch(e){log('save failed: '+e.message);return}E.r13.savedEdits=(E.ops&&E.ops.edits)||0;writeShadow();renderDirty();log('saved + shadow copy written',true)}

function mount(){
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='Reliability II (Phase 13)';card.appendChild(h);

  var drow=mkRow();var dl=document.createElement('div');dl.id='p1dirtyLine';dl.className='note';dl.style.flex='1 1 auto';dl.textContent='checking…';drow.appendChild(dl);
  drow.appendChild(mkBtn('SAVE NOW',saveNow,'0 0 22%','p1saveNow'));card.appendChild(drow);

  var arow=mkRow();arow.appendChild(mkBtn('AUTO-SAVE: '+(E.r13.as?'ON':'OFF'),toggleAs,'0 0 30%','p1as'));arow.appendChild(mkBtn('MAKE SHADOW COPY',makeShadow,'0 0 30%','p1shadowMk'));arow.appendChild(mkBtn('RESTORE SHADOW',restoreShadow,'0 0 30%','p1shadowRs'));card.appendChild(arow);

  var brow=mkRow();brow.appendChild(mkBtn('PERF MONITOR',perf,'0 0 30%','p1perf'));brow.appendChild(mkBtn('HEALTH SCORE',health,'0 0 30%','p1health'));brow.appendChild(mkBtn('PANIC RESET',panic,'0 0 30%','p1panic'));card.appendChild(brow);

  var crow=mkRow();crow.appendChild(mkBtn('CHECKPOINT DIFF',diff,'0 0 30%','p1diff'));crow.appendChild(mkBtn('SCAN ORPHANS',orphanScan,'0 0 30%','p1orphScan'));crow.appendChild(mkBtn('SCAN STORAGE',cleanScan,'0 0 30%','p1cleanScan'));card.appendChild(crow);

  var cl=document.createElement('div');cl.style.display='flex';cl.style.gap='10px';
  var c1=document.createElement('div');c1.style.flex='1';c1.appendChild(mkList('p1cleanList'));cl.appendChild(c1);
  var c2=document.createElement('div');c2.style.flex='1';c2.appendChild(mkList('p1orphList'));cl.appendChild(c2);
  card.appendChild(cl);

  var note=document.createElement('div');note.className='note';
  note.textContent='reliability ii: auto-save every minute with a shadow copy behind it, live offline banner, perf + health checks, panic reset that rebuilds the ui without touching data, checkpoint diff, orphaned media finder, storage cleanup. delete on the storage scan only removes what you tap.';
  card.appendChild(note);

  var hs=document.querySelectorAll('.card h2');var anchor=null;
  for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('Growth + Reliability')>=0){anchor=hs[i].parentElement;break}}
  if(!anchor){for(var j=0;j<hs.length;j++){if(hs[j].textContent.indexOf('Ops Console')>=0){anchor=hs[j].parentElement;break}}}
  if(anchor){if(anchor.nextSibling)anchor.parentElement.insertBefore(card,anchor.nextSibling);else anchor.parentElement.appendChild(card)}
  else document.body.appendChild(card);

  banner();renderDirty();cleanScan();orphanScan();
  E.r13.savedEdits=(E.ops&&E.ops.edits)||0;
  log('reliability ii live — auto-save heartbeat '+(E.r13.as?'on':'off'),true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();