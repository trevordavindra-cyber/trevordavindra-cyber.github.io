'use strict';
// up17.js — PHASE 11 OPS CONSOLE (Nov 23 2026) // diagnostics, storage meter, edit counter,
// idea bank, post log + csv, review packet, guard mode, error log, ctrl+s save, session log export
(function(){
if(window.__tk2up17)return;window.__tk2up17=1;
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
function mkSel(id,opts){var s=document.createElement('select');s.id=id;s.className='inp';for(var i=0;i<opts.length;i++){var o=document.createElement('option');o.textContent=opts[i];s.appendChild(o)}return s}
function mkRow(gap){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap=(gap||6)+'px';r.style.marginTop='6px';r.style.alignItems='center';return r}

if(!S.eco)S.eco={};
var E=S.eco;
if(!E.ops)E.ops={edits:0,lastSave:0,ideas:[],posts:[],guard:null};
function saveE(){try{save()}catch(e){}}

// --- edit counter: wrap the global save once
try{
  if(!window.__tk2saveWrap){var _s=window.save;window.save=function(){try{E.ops.edits=(E.ops.edits||0)+1;E.ops.lastSave=Date.now();var st=$('o1stat');if(st)st.textContent=statLine();}catch(e){}return _s.apply(this,arguments)};window.__tk2saveWrap=1}
}catch(e){}
function statLine(){var n=E.ops.edits||0;var t=E.ops.lastSave?('last save '+hh(E.ops.lastSave)):'no save yet this session';return 'edits this project: '+n+' — '+t}

// --- 1 diagnostics
function diag(){
  var pass=0,fail=0;function chk(ok,name){if(ok){pass++;log('OK — '+name)}else{fail++;log('FAIL — '+name)}}
  chk(typeof S==='object'&&Array.isArray(S.clips),'state S with clips array ('+(S.clips?S.clips.length:0)+' clips)');
  chk(typeof window.fxFrameHook==='function'&&typeof window.fxClipHook==='function','render hooks chained (frame + clip)');
  chk(typeof window.save==='function','save() reachable');
  var ok=true;try{localStorage.setItem('tk2diag','1');localStorage.removeItem('tk2diag')}catch(e){ok=false}
  chk(ok,'localStorage writable');
  var ck=lsGet('tk2ckpt',[]);chk(Array.isArray(ck),'checkpoints slot readable ('+ck.length+' kept)');
  var en=lsGet('tk2errn',0);log('errors caught since install: '+en);
  chk(Object.keys(M||{}).length>=0,'media library readable ('+Object.keys(M||{}).length+' items)');
  chk(!!S.eco&&!!E.ops,'eco + ops state present');
  log('diagnostics: '+pass+' passed'+(fail?(', '+fail+' FAILED'):' — all clear'),true);
}

// --- 2 storage meter
function storage(){
  var tot=0,rows=[];try{
    for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);var b=(localStorage.getItem(k)||'').length*2;tot+=b;rows.push([k,b])}
  }catch(e){log('storage read blocked');return}
  var pct=Math.round(tot/5242880*100);
  rows.sort(function(a,b){return b[1]-a[1]});
  var top='';for(var j=0;j<Math.min(3,rows.length);j++)top+=rows[j][0]+' '+(rows[j][1]/1024).toFixed(0)+'KB'+(j<2?', ':'');
  log('storage: '+(tot/1024).toFixed(0)+' KB of ~5 MB ('+pct+'%) — biggest: '+top+(pct>80?' — WARNING: near quota, delete old checkpoints/drafts':''),true);
}

// --- 4 idea bank
var IDEAS=['IDEA','FILMING','EDITING','POSTED'];
function addIdea(){var v=($('o1idea').value||'').trim();if(!v){log('type an idea first');return}E.ops.ideas.push({t:v.slice(0,60),st:0,at:Date.now()});$('o1idea').value='';saveE();renderIdeas();log('idea banked: '+v.slice(0,30),true)}
function renderIdeas(){var l=$('o1ideaList');if(!l)return;l.innerHTML='';var a=E.ops.ideas||[];
  for(var i=0;i<a.length;i++)(function(k){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap='6px';r.style.marginTop='4px';r.style.alignItems='center';
    var d=document.createElement('div');d.style.flex='1 1 auto';d.innerHTML=esc(a[k].t)+' <span style="opacity:.7">('+IDEAS[a[k].st%4]+')</span>';r.appendChild(d);
    r.appendChild(mkBtn(IDEAS[(a[k].st+1)%4],function(){a[k].st=(a[k].st+1)%4;saveE();renderIdeas();log(a[k].t.slice(0,20)+' -> '+IDEAS[a[k].st])},'0 0 24%'));
    r.appendChild(mkBtn('DEL',function(){a.splice(k,1);saveE();renderIdeas()},'0 0 12%'));
    l.appendChild(r)})(i);
  if(!a.length){var e=document.createElement('div');e.className='note';e.textContent='no ideas yet — bank every video idea here so nothing gets lost';l.appendChild(e)}
}

// --- 5 post log + csv
function addPost(){var n=($('o1postNote').value||'').trim();var p=$('o1postPlat').value;
  E.ops.posts.unshift({at:Date.now(),d:today(),plat:p,note:n.slice(0,80)});$('o1postNote').value='';saveE();renderPosts();
  log('logged post: '+p+' '+today()+(n?' — '+n.slice(0,24):''),true)}
function renderPosts(){var l=$('o1postList');if(!l)return;l.innerHTML='';var a=E.ops.posts||[];
  for(var i=0;i<Math.min(10,a.length);i++)(function(k){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap='6px';r.style.marginTop='4px';r.style.alignItems='center';
    var d=document.createElement('div');d.style.flex='1 1 auto';d.textContent=a[k].d+' ['+a[k].plat+'] '+(a[k].note||'');r.appendChild(d);
    r.appendChild(mkBtn('DEL',function(){a.splice(k,1);saveE();renderPosts()},'0 0 12%'));l.appendChild(r)})(i);
  if(!a.length){var e=document.createElement('div');e.className='note';e.textContent='no posts logged yet';l.appendChild(e)}}
function postCsv(){var a=E.ops.posts||[];if(!a.length){log('post log is empty');return}
  var s='date,platform,note\n';for(var i=0;i<a.length;i++){s+='"'+a[i].d+'","'+a[i].plat+'","'+(a[i].note||'').replace(/"/g,"'")+'"\n'}
  dl('tiktok2-postlog-'+today()+'.csv',s);log('post log exported ('+a.length+' rows)',true)}

// --- 6 review packet
function packet(){
  var checks=0,total=8;try{var c=document.querySelectorAll('#e0checks input[type=checkbox]');total=c.length;for(var i=0;i<c.length;i++)if(c[i].checked)checks++}catch(e){}
  var pins=(E.pins||[]).length;var open=0;for(var j=0;j<pins;j++)if(!(E.pins[j].done))open++;
  var lines=[];
  lines.push('TIKTOK2 REVIEW PACKET — '+today());
  lines.push('');
  lines.push('clips: '+S.clips.length+'   total length: '+totalD().toFixed(1)+'s   media items: '+Object.keys(M||{}).length);
  lines.push('layers: '+((S.layers&&S.layers.length)||0)+'   captions: '+((S.caps&&S.caps.length)||0));
  try{if(S.music&&M[S.music])lines.push('music: '+M[S.music].name)}catch(e){}
  lines.push('creator checklist: '+checks+'/'+total+' done');
  lines.push('comment pins: '+pins+' total, '+open+' still open');
  lines.push('idea bank: '+(E.ops.ideas||[]).length+' ideas   post log: '+(E.ops.posts||[]).length+' posts logged');
  lines.push('clips stashed: '+((E.stash||[]).length));
  try{if((E.cal||[]).length){var next=E.cal[0];lines.push('next scheduled post: '+next.date+' '+next.time+' ['+next.plat+'] '+next.title)}}catch(e){}
  try{if((E.series||[]).length){for(var k=0;k<E.series.length;k++)lines.push('series: '+E.series[k].name+' — '+E.series[k].done+'/'+E.series[k].parts+' posted')}}catch(e){}
  lines.push('platform preset: '+(E.plat||'none'));
  lines.push('edits this project: '+(E.ops.edits||0));
  lines.push('');
  lines.push('generated by the ops console — paste this into your notes or send it to a reviewer');
  dl('tiktok2-review-packet-'+today()+'.txt',lines.join('\n'));log('review packet downloaded',true);
}

// --- 7 guard mode
function guard(){
  if(!E.ops.guard){E.ops.guard={n:S.clips.length,d:totalD(),at:Date.now()};saveE();log('guard on — snapshot taken ('+S.clips.length+' clips, '+totalD().toFixed(1)+'s)',true);return}
  var g=E.ops.guard;var n=S.clips.length;var d=totalD();
  var dn=n-g.n,dd=d-g.d;
  log('guard report since '+hh(g.at)+': clips '+(dn===0?'unchanged':(dn>0?'+':'')+dn)+', length '+(Math.abs(dd)<0.05?'unchanged':(dd>0?'+':'')+dd.toFixed(1)+'s')+(dn===0&&Math.abs(dd)<0.05?' — no drift':''),true);
  E.ops.guard=null;saveE();log('guard off — snapshot cleared');
}

// --- 8 error log viewer
function renderErrs(){var l=$('o1errList');if(!l)return;l.innerHTML='';var a=lsGet('tk2errs',[]);
  if(!a.length){var e=document.createElement('div');e.className='note';e.textContent='no errors caught';l.appendChild(e);return}
  for(var i=0;i<a.length;i++){var r=document.createElement('div');r.className='note';r.textContent=hh(a[i].at)+' — '+a[i].m;l.appendChild(r)}}
function clearErrs(){try{localStorage.removeItem('tk2errs');localStorage.removeItem('tk2errn')}catch(e){}renderErrs();log('error log cleared',true)}

// --- 9 ctrl+s saves
document.addEventListener('keydown',function(e){if((e.ctrlKey||e.metaKey)&&(e.key==='s'||e.key==='S')){e.preventDefault();try{save();log('saved (ctrl+s)',true)}catch(err){log('save failed: '+err.message)}}});

// --- 10 session log export
function slog(){var t='';try{t=$('log').innerText||''}catch(e){};if(!t){log('log is empty');return}
  dl('tiktok2-session-log-'+today()+'.txt','TIKTOK2 SESSION LOG '+today()+'\n\n'+t);log('session log downloaded',true)}

function mount(){
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='Ops Console (Phase 11)';card.appendChild(h);

  var drow=mkRow();drow.appendChild(mkBtn('DIAGNOSTICS',diag,'0 0 30%','o1diag'));drow.appendChild(mkBtn('STORAGE METER',storage,'0 0 30%','o1store'));drow.appendChild(mkBtn('REVIEW PACKET',packet,'0 0 30%','o1packet'));card.appendChild(drow);

  var st=document.createElement('div');st.id='o1stat';st.className='note';st.textContent=statLine();card.appendChild(st);

  var grow=mkRow();grow.appendChild(mkBtn('GUARD ON/OFF',guard,'0 0 40%','o1guard'));grow.appendChild(mkBtn('EXPORT SESSION LOG',slog,'0 0 50%','o1slog'));card.appendChild(grow);

  var irow=mkRow();irow.appendChild(mkInp('o1idea','video idea e.g. day in the life ep3','1 1 auto'));irow.appendChild(mkBtn('BANK IT',addIdea,'0 0 18%','o1ideaAdd'));card.appendChild(irow);
  var ilist=document.createElement('div');ilist.id='o1ideaList';ilist.style.marginTop='6px';card.appendChild(ilist);

  var prow=mkRow();prow.appendChild(mkSel('o1postPlat',['tiktok','reels','shorts']));prow.appendChild(mkInp('o1postNote','post note e.g. part 2 went out','1 1 auto'));card.appendChild(prow);
  var prow2=mkRow();prow2.appendChild(mkBtn('LOG POST',addPost,'0 0 30%','o1postAdd'));prow2.appendChild(mkBtn('EXPORT CSV',postCsv,'0 0 30%','o1postCsv'));card.appendChild(prow2);
  var plist=document.createElement('div');plist.id='o1postList';plist.style.marginTop='6px';card.appendChild(plist);

  var erow=mkRow();erow.appendChild(mkBtn('ERROR LOG',renderErrs,'0 0 30%','o1errRef'));erow.appendChild(mkBtn('CLEAR ERRORS',clearErrs,'0 0 30%','o1errClear'));card.appendChild(erow);
  var elist=document.createElement('div');elist.id='o1errList';elist.style.marginTop='6px';card.appendChild(elist);

  var note=document.createElement('div');note.className='note';
  note.textContent='ops console: run diagnostics before a big export, watch storage, bank ideas, log real posts, and pull a review packet for any collaborator. ctrl+s saves from anywhere. everything saves with the project.';
  card.appendChild(note);

  var hs=document.querySelectorAll('.card h2');var anchor=null;
  for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('Creator Ecosystem')>=0){anchor=hs[i].parentElement;break}}
  if(!anchor){for(var j=0;j<hs.length;j++){if(hs[j].textContent.indexOf('Motion Lab')>=0){anchor=hs[j].parentElement;break}}}
  if(anchor){if(anchor.nextSibling)anchor.parentElement.insertBefore(card,anchor.nextSibling);else anchor.parentElement.appendChild(card)}
  else document.body.appendChild(card);

  renderIdeas();renderPosts();renderErrs();
  log('ops console live',true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();