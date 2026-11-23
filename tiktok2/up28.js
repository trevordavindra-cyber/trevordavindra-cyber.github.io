'use strict';
// up28.js — PHASE 22 EXPORT LAB (Nov 23 2026)
// preflight, export history, length presets, trim to target, size estimate,
// export ticket, checklist board, caption proof, music fit, post brief
(function(){
if(window.__tk2up28)return;window.__tk2up28=1;
function $(id){return document.getElementById(id)}
function mkBtn(t,fn,fl,id){var b=document.createElement('button');b.className='btn';b.textContent=t;b.style.flex=fl||'0 0 auto';if(id)b.id=id;b.onclick=fn;return b}
function mkRow(gap){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap=(gap||6)+'px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function mkCb(id,label){var l=document.createElement('label');l.style.display='flex';l.style.alignItems='center';l.style.gap='6px';var i=document.createElement('input');i.type='checkbox';i.id=id;l.appendChild(i);var s=document.createElement('span');s.textContent=label;s.style.fontSize='11px';l.appendChild(s);return l}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function saveE(){try{if(typeof save==='function')save()}catch(e){}}
function clipDur(c){return (c.end-c.start)/(c.speed||1)}
function totalDur(){return S.clips.reduce(function(a,c){return a+clipDur(c)},0)}
function redraw(){try{if(window.drawTimeline)window.drawTimeline()}catch(e){}}
if(!S.eco)S.eco={};var E=S.eco;
if(!E.f28)E.f28={target:0,hist:[],ck:{hook:false,caps:false,music:false,cover:false,wm:false}};
var CKL={hook:'hook grabs in 2s',caps:'captions proofed',music:'music synced to cuts',cover:'cover frame picked',wm:'watermark / brand set'};

function mbps(){return S.res>=1080?8:5}
function codecNote(){
  var ok=false;try{ok=window.MediaRecorder&&MediaRecorder.isTypeSupported('video/mp4;codecs=avc1.42E01E,mp4a.40.2')}catch(e){}
  return ok?'mp4':'webm';
}
function dl(name,text){try{var b=new Blob([text],{type:'text/plain'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a)},300);return true}catch(e){log('download failed: '+e.message);return false}}

// 1) export preflight
function preflight(){
  if(!S.clips.length){log('preflight: nothing on the timeline');return}
  var t=totalDur(),warn=[];
  if(!S.musicId)warn.push('no music set');
  if(!S.captions.length)warn.push('no captions');
  if(E.f28.target&&t>E.f28.target+0.05)warn.push('length '+t.toFixed(1)+'s over '+E.f28.target+'s target');
  if(t<3)warn.push('very short ('+t.toFixed(1)+'s)');
  var miss=[];for(var k in E.f28.ck){if(!E.f28.ck[k])miss.push(CKL[k])}
  if(miss.length)warn.push('checklist: '+miss.join(', '));
  log('PREFLIGHT — '+S.clips.length+' clips, '+t.toFixed(1)+'s, style '+S.style+', '+S.res+'p@'+S.fps+'fps ('+codecNote()+'), music '+(S.musicId&&M[S.musicId]?M[S.musicId].name:'none')+', '+S.captions.length+' caption(s)'+(warn.length?' — WARN: '+warn.join(' | '):' — all clear'),true);
}
// 2) export history: wrap the real export path
function wrapExport(){
  if(typeof window.renderProject!=='function'){log('export path not found — history will log manually');return}
  if(window.__f28wrap)return;window.__f28wrap=1;
  var rp=window.renderProject;
  window.renderProject=function(){
    try{E.f28.hist.push({at:Date.now(),len:+totalDur().toFixed(2),clips:S.clips.length,res:S.res,style:S.style});
      if(E.f28.hist.length>40)E.f28.hist=E.f28.hist.slice(-40);saveE();
      log('export started — recorded in export history ('+E.f28.hist.length+' total)')}
    catch(e){}
    return rp.apply(this,arguments)};
  log('export history armed — every real export is recorded now');
}
function histCsv(){
  if(!E.f28.hist.length){log('no exports recorded yet');return}
  var rows=['time,length_s,clips,res,style'];
  E.f28.hist.forEach(function(h){rows.push(new Date(h.at).toLocaleTimeString()+','+h.len+','+h.clips+','+h.res+','+h.style)});
  dl('tiktok2-export-history.csv',rows.join('\n'));
  log('export history CSV downloaded ('+E.f28.hist.length+' record(s))',true);
}
function histClear(){var n=E.f28.hist.length;E.f28.hist=[];saveE();log('export history cleared ('+n+' record(s))')}
// 3) length presets
function setTarget(v){E.f28.target=v;saveE();var t=totalDur();
  log('target '+v+'s — project is '+t.toFixed(1)+'s ('+(Math.abs(t-v)<0.05?'on target':(t>v?(t-v).toFixed(1)+'s over — use TRIM TO TARGET':(v-t).toFixed(1)+'s under — room for more cuts'))+')',true)}
// 4) trim to target
function trimTo(){
  if(!S.clips.length){log('nothing on the timeline');return}
  var v=E.f28.target;
  if(!v){log('pick a length preset first (15/30/60)');return}
  var t=totalDur();
  if(Math.abs(t-v)<0.05){log('already on target ('+t.toFixed(1)+'s)');return}
  var last=S.clips[S.clips.length-1];
  if(t>v){
    var d=t-v;var src=last.end-last.start;
    if(src-d<0.3){log('cannot trim: last clip only '+src.toFixed(2)+'s of source left');return}
    last.end=+(last.end-d).toFixed(3);saveE();redraw();
    log('trimmed to target: cut '+d.toFixed(2)+'s off the tail — now '+totalDur().toFixed(1)+'s',true);
  }else{
    var d=v-t;var m=M[last.src];
    if(m&&m.dur){d=Math.min(d,Math.max(0,m.dur-last.end))}
    if(d<0.05){log('cannot extend: last clip already uses its full source');return}
    last.end=+(last.end+d).toFixed(3);saveE();redraw();
    log('extended tail by '+d.toFixed(2)+'s toward target — now '+totalDur().toFixed(1)+'s',true);
  }
}
// 5) size estimate
function sizeEst(){
  if(!S.clips.length){log('nothing on the timeline');return}
  var t=totalDur();var mb=t*mbps()*1000000/8/1048576;
  log('size estimate: '+t.toFixed(1)+'s at '+S.res+'p = ~'+mb.toFixed(1)+' MB ('+mbps()+' Mbps, '+codecNote()+') — captions/watermark add negligible bytes',true);
}
// 6) export ticket
function ticket(){
  if(!S.clips.length){log('nothing on the timeline');return}
  var L=['TIKTOK2 EXPORT TICKET','project: '+(S.name||'Untitled'),'date: '+new Date().toLocaleString(),'clips: '+S.clips.length+'  length: '+totalDur().toFixed(2)+'s','style: '+S.style+'  target: '+(E.f28.target||'none')+'s','export: '+S.res+'p @ '+S.fps+'fps ('+codecNote()+', ~'+(totalDur()*mbps()*1000000/8/1048576).toFixed(1)+' MB)','music: '+(S.musicId&&M[S.musicId]?M[S.musicId].name+' gain '+Math.round(S.musicGain*100)+'% offset '+S.musicOffset+'s':'none'),'captions: '+S.captions.length,'','CLIPS'];
  S.clips.forEach(function(c,i){L.push((i+1)+'. '+(c.label||c.name||'clip')+'  src '+c.start.toFixed(2)+'-'+c.end.toFixed(2)+'s  speed x'+(c.speed||1)+'  out '+clipDur(c).toFixed(2)+'s')});
  L.push('','CHECKLIST');for(var k in CKL){L.push((E.f28.ck[k]?'[x] ':'[ ] ')+CKL[k])}
  dl('tiktok2-export-ticket.txt',L.join('\n'));
  log('export ticket downloaded',true);
}
// 7) checklist board
function ckBoard(){
  if(!E.f28.ckAll){
    var r=mkRow();for(var k in CKL){r.appendChild(mkCb('f28ck_'+k,CKL[k]))}r.id='f28ckrow';
    var card2=document.querySelector('#f28note');if(card2&&card2.parentElement)card2.parentElement.insertBefore(r,card2);E.f28.ckAll=1;
    for(var k2 in E.f28.ck){var cb=$('f28ck_'+k2);if(cb)cb.checked=!!E.f28.ck[k2]}
    for(var k3 in CKL){(function(kk){var cb=$('f28ck_'+kk);if(cb)cb.onchange=function(){E.f28.ck[kk]=cb.checked;saveE()}})(k3)}
    log('checklist board shown — 5 pre-post checks, saved with the project',true);return}
  var miss=[];for(var k4 in E.f28.ck){if(!E.f28.ck[k4])miss.push(CKL[k4])}
  if(miss.length)log('checklist: '+miss.length+' open — '+miss.join(', '),true);
  else log('checklist: ALL 5 CLEAR — ready to post',true);
}
// 8) caption proof
function capProof(){
  if(!S.captions.length){log('caption proof: no captions yet');return}
  var bad=[];
  S.captions.forEach(function(c,i){var txt=(c.text||'').trim();
    if(!txt)bad.push((i+1)+': empty text');
    if((c.end||c.t1||0)-(c.start||c.t0||0)<=0)bad.push((i+1)+': zero length');
  });
  for(var i=1;i<S.captions.length;i++){var a=S.captions[i-1],b=S.captions[i];var ae=a.end||a.t1||0,bs=b.start||b.t0||0;if(bs<ae-0.02)bad.push((i+1)+': overlaps #'+i)}
  if(bad.length)log('caption proof: '+bad.length+' issue(s) — '+bad.slice(0,6).join(', '),true);
  else log('caption proof: all '+S.captions.length+' caption(s) clean (text, timing, no overlaps)',true);
}
// 9) music fit
function musicFit(){
  if(!S.musicId||!M[S.musicId]){log('music fit: no music set');return}
  var m=M[S.musicId],t=totalDur();
  if(!m.dur){log('music fit: duration not read yet — play it once, then re-run');return}
  if(m.dur>=t)log('music fit: '+m.name+' ('+m.dur.toFixed(1)+'s) covers the '+t.toFixed(1)+'s cut with '+(m.dur-t).toFixed(1)+'s spare',true);
  else log('music fit: '+m.name+' is '+(t-m.dur).toFixed(1)+'s too short for the '+t.toFixed(1)+'s cut — loop it or add another track',true);
}
// 10) post brief copy
function postBrief(){
  if(!S.clips.length){log('nothing on the timeline');return}
  var st=(S.style||'cinematic').toLowerCase();
  var txt=(S.name||'my edit')+' | '+st+' edit | '+totalDur().toFixed(0)+'s | #'+st.replace(/\s+/g,'')+' #fyp #foryou #edit';
  var done=false;
  try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt);done=true}}catch(e){}
  if(!done){try{var ta=document.createElement('textarea');ta.value=txt;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);done=true}catch(e){}}
  log(done?'post brief copied to clipboard: '+txt:'post brief: '+txt,true);
}

function mount(){
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='Export Lab (Phase 22)';card.appendChild(h);
  var r1=mkRow();r1.appendChild(mkBtn('EXPORT PREFLIGHT',preflight,'1 1 auto','f28b1'));r1.appendChild(mkBtn('EXPORT HISTORY',histCsv,'1 1 auto','f28b2'));card.appendChild(r1);
  var r2=mkRow();r2.appendChild(mkBtn('15s TARGET',function(){setTarget(15)},'1 1 auto','f28b3'));r2.appendChild(mkBtn('30s TARGET',function(){setTarget(30)},'1 1 auto','f28b4'));r2.appendChild(mkBtn('60s TARGET',function(){setTarget(60)},'1 1 auto','f28b5'));r2.appendChild(mkBtn('TRIM TO TARGET',trimTo,'1 1 auto','f28b6'));card.appendChild(r2);
  var r3=mkRow();r3.appendChild(mkBtn('SIZE ESTIMATE',sizeEst,'1 1 auto','f28b7'));r3.appendChild(mkBtn('EXPORT TICKET',ticket,'1 1 auto','f28b8'));card.appendChild(r3);
  var r4=mkRow();r4.appendChild(mkBtn('CHECKLIST BOARD',ckBoard,'1 1 auto','f28b9'));r4.appendChild(mkBtn('CAPTION PROOF',capProof,'1 1 auto','f28b10'));card.appendChild(r4);
  var r5=mkRow();r5.appendChild(mkBtn('MUSIC FIT',musicFit,'1 1 auto','f28b11'));r5.appendChild(mkBtn('POST BRIEF COPY',postBrief,'1 1 auto','f28b12'));card.appendChild(r5);
  var r6=mkRow();r6.appendChild(mkBtn('ARM EXPORT HISTORY',wrapExport,'1 1 auto','f28b13'));r6.appendChild(mkBtn('CLEAR HISTORY',histClear,'1 1 auto','f28b14'));card.appendChild(r6);
  var note=document.createElement('div');note.className='note';note.id='f28note';note.textContent='preflight checks the whole export in one log, export history records every real export automatically, length presets set a 15/30/60 target that preflight and trim-to-target use, size estimate predicts file size from your resolution, export ticket downloads a settings manifest, checklist board keeps 5 pre-post checks with the project, caption proof finds empty or overlapping captions, music fit checks the track covers the cut, and post brief copies a ready posting caption.';
  card.appendChild(note);
  var hs=document.querySelectorAll('.card h2'),anchor=null;
  for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('Flow Lab')>=0){anchor=hs[i].parentElement;break}}
  if(anchor){if(anchor.nextSibling)anchor.parentElement.insertBefore(card,anchor.nextSibling);else anchor.parentElement.appendChild(card)}
  else{var ap=document.querySelector('#panelcol')||document.body;ap.appendChild(card)}
  wrapExport();
  log('export lab live — preflight, export history, length presets, trim to target, size estimate, export ticket, checklist board, caption proof, music fit, post brief');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
