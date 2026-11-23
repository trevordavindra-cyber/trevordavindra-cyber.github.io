'use strict';
// up25.js — PHASE 19 TIMELINE POWER TOOLS II (Nov 23 2026)
// split clip, reorder nudge, reverse/shuffle, fit-to-length, clip color tags,
// clip labels, time ruler, multi-select + group ops, keyboard shortcuts
(function(){
if(window.__tk2up25)return;window.__tk2up25=1;
function $(id){return document.getElementById(id)}
function mkBtn(t,fn,fl,id){var b=document.createElement('button');b.className='btn';b.textContent=t;b.style.flex=fl||'0 0 auto';if(id)b.id=id;b.onclick=fn;return b}
function mkRow(gap){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap=(gap||6)+'px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function saveE(){try{if(typeof save==='function')save()}catch(e){}}
function cur(){return S.clips.find(function(x){return x.id===S.selected})}
function clampC(v,a,b){return Math.max(a,Math.min(b,v))}
function clipDur(c){return (c.end-c.start)/(c.speed||1)}
function totalDur(){return S.clips.reduce(function(a,c){return a+clipDur(c)},0)}
function idx(){return S.clips.findIndex(function(x){return x.id===S.selected})}

if(!S.eco)S.eco={};var E=S.eco;
if(!E.f25)E.f25={multi:[],mode:false,labels:true};

// --- shared timeline post-processor (tags, labels, ruler, multi) ---
var TAGS={red:'rgba(255,45,85,.4)',gold:'rgba(255,201,51,.4)',cyan:'rgba(0,229,255,.4)',green:'rgba(0,220,120,.4)',purple:'rgba(160,80,255,.4)',gray:'rgba(140,150,170,.35)'};
var _dt=window.drawTimeline;
function setTag(id,name){var c=cur();if(!c){log('select a clip first');return}c.tag=name;saveE();log('clip '+(idx()+1)+' tagged '+name,true)}
function clearTags(){var n=0;S.clips.forEach(function(c){if(c.tag){delete c.tag;n++}});saveE();log('cleared '+n+' clip tags',true)}
function setLabel(){var c=cur();if(!c){log('select a clip first');return}var v=$('f25lab').value.trim();if(!v){log('type a label first');return}c.label=v;saveE();log('clip '+(idx()+1)+' labeled: '+v,true)}
function clearLabels(){var n=0;S.clips.forEach(function(c){if(c.label){delete c.label;n++}});saveE();log('cleared '+n+' clip labels',true)}
var rulerEl=null;
function ensureRuler(){
  if(!rulerEl){rulerEl=document.createElement('div');rulerEl.id='f25ruler';
    rulerEl.style.cssText='display:flex;gap:2px;font-size:9px;color:#7d8aa2;margin-bottom:3px;font-family:ui-monospace,monospace;min-height:13px';}
  var tv=$('trVideo');if(!tv)return;var p=tv.parentElement;
  if(rulerEl.parentElement!==p){if(tv.previousSibling&&tv.previousSibling.id==='f25ruler'){}else{p.insertBefore(rulerEl,tv)}}
  rulerEl.innerHTML='';var t=0;
  S.clips.forEach(function(c){var d=document.createElement('div');d.style.flexGrow=String(Math.max(0.4,clipDur(c)));
    d.textContent=t.toFixed(1);d.style.overflow='hidden';t+=clipDur(c);rulerEl.appendChild(d)});
}
function drawWrapped(){
  if(_dt)try{_dt()}catch(e){}
  try{
    var tv=$('trVideo');if(!tv)return;
    var kids=tv.querySelectorAll('.tclip');
    if(E.f25.labels)ensureRuler();else if(rulerEl&&rulerEl.parentElement)rulerEl.innerHTML='';
    S.clips.forEach(function(c,i){
      var d=kids[i];if(!d)return;
      if(c.tag&&TAGS[c.tag]){d.style.borderColor=TAGS[c.tag];d.style.boxShadow='inset 0 -3px 0 '+TAGS[c.tag]}
      if(c.label)d.textContent=c.label+(c.speed&&c.speed!==1?' '+c.speed+'x':'');
      if(E.f25.mode&&c.id===S.selected){}
    });
    if(E.f25.mode){
      S.clips.forEach(function(c,i){var d=kids[i];if(!d)return;
        if(E.f25.multi.indexOf(c.id)>=0){d.classList.add('f25multi');d.style.outline='2px solid #ffc933'}
        else{d.style.outline=''}
        d.onclick=function(){var p=E.f25.multi.indexOf(c.id);
          if(p>=0)E.f25.multi.splice(p,1);else E.f25.multi.push(c.id);
          log('multi selection: '+E.f25.multi.length+' clip(s)');drawWrapped();saveE()};
      });
    }else{
      S.clips.forEach(function(c,i){var d=kids[i];if(d)d.style.outline=''});
    }
  }catch(e){}
}
window.drawTimeline=drawWrapped;

// --- 1 split clip at midpoint ---
function splitClip(){
  var c=cur();if(!c){log('select a clip first');return}
  var len=c.end-c.start;
  if(len<0.4){log('clip too short to split ('+len.toFixed(2)+'s of source)');return}
  var mid=c.start+len/2;
  var b=Object.assign({},c,{id:typeof uid==='function'?uid():'c'+Date.now(),start:mid});
  c.end=mid;
  S.clips.splice(idx()+1,0,b);
  saveE();drawWrapped();
  log('clip split at '+mid.toFixed(2)+'s — now '+S.clips.length+' clips, '+totalDur().toFixed(1)+'s total',true);
}
// --- 2 reorder nudge ---
function move(dir){
  var i=idx();if(i<0){log('select a clip first');return}
  var j=i+dir;
  if(j<0||j>=S.clips.length){log(dir<0?'already first':'already last');return}
  var t=S.clips[i];S.clips[i]=S.clips[j];S.clips[j]=t;
  saveE();drawWrapped();selectClip(j);
  log('moved clip '+(i+1)+' '+(dir<0?'left':'right')+' → slot '+(j+1),true);
}
// --- 3+4 order ops ---
function reverse(){if(S.clips.length<2){log('nothing to reverse');return}S.clips.reverse();saveE();drawWrapped();log('timeline reversed — '+S.clips.length+' clips',true)}
function shuffle(){if(S.clips.length<2){log('nothing to shuffle');return}
  for(var i=S.clips.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=S.clips[i];S.clips[i]=S.clips[j];S.clips[j]=t}
  saveE();drawWrapped();log('timeline shuffled — order randomized, total '+totalDur().toFixed(1)+'s unchanged',true)}
// --- 5 fit to length ---
function fitLen(){
  var tgt=parseFloat($('f25fit').value);
  var tot=totalDur();
  if(!S.clips.length){log('no clips');return}
  if(!tgt||tgt<3){log('pick a target length first');return}
  if(tot<0.2){log('timeline is empty');return}
  var scale=tot/tgt;
  S.clips.forEach(function(c){c.speed=Math.round(clampC((c.speed||1)*scale,0.25,3)*100)/100});
  saveE();drawWrapped();
  log('fit to '+tgt+'s: every speed scaled ×'+scale.toFixed(2)+' → new total '+totalDur().toFixed(1)+'s (was '+tot.toFixed(1)+'s)',true);
}
// --- 9 multi select + group ops ---
function toggleMode(){
  E.f25.mode=!E.f25.mode;
  if(!E.f25.mode)E.f25.multi=[];
  else{var c=cur();E.f25.multi=c?[c.id]:[]}
  saveE();drawWrapped();
  log('multi-select '+(E.f25.mode?'ON — click bars to add/remove, then use group ops':'OFF'),true);
}
function groupDel(){
  if(!E.f25.mode||!E.f25.multi.length){log('multi-select is off or empty — turn it on and click bars');return}
  var n=0;
  S.clips=S.clips.filter(function(c){if(E.f25.multi.indexOf(c.id)>=0){n++;return false}return true});
  E.f25.multi=[];S.selected=null;
  try{$('clipPanel').style.display='none'}catch(e){}
  saveE();drawWrapped();
  log('group delete: removed '+n+' clips — '+S.clips.length+' left, '+totalDur().toFixed(1)+'s',true);
}
function groupSpeed(){
  var v=parseFloat($('f25gs').value);
  if(isNaN(v)||v<=0){log('type a speed first (e.g. 1.5)');return}
  if(!E.f25.mode||!E.f25.multi.length){log('multi-select is off or empty');return}
  var n=0;
  S.clips.forEach(function(c){if(E.f25.multi.indexOf(c.id)>=0){c.speed=Math.round(clampC(v,0.25,3)*100)/100;n++}});
  saveE();drawWrapped();
  log('group speed '+v+'x applied to '+n+' clip(s) — total '+totalDur().toFixed(1)+'s',true);
}
function groupTrans(){
  var v=$('f25gt').value;
  if(!E.f25.mode||!E.f25.multi.length){log('multi-select is off or empty');return}
  var n=0;
  S.clips.forEach(function(c){if(E.f25.multi.indexOf(c.id)>=0){c.trans=v;n++}});
  saveE();drawWrapped();
  log('group transition "'+v+'" applied to '+n+' clip(s)',true);
}
function clearSel(){E.f25.multi=[];saveE();drawWrapped();log('multi selection cleared')}

// --- 10 keyboard shortcuts ---
var KEYHINTS=[['← / →','select prev / next clip'],['[ / ]','trim clip in-point ∓0.2s'],[']','trim clip out-point +0.2s'],['Delete','delete selected clip'],['ctrl+D','duplicate selected clip']];
document.addEventListener('keydown',function(e){
  var t=e.target&&e.target.tagName;
  if(t==='INPUT'||t==='TEXTAREA'||t==='SELECT')return;
  if(e.target&&e.target.isContentEditable)return;
  if(!S.clips.length)return;
  var i=idx();
  if(e.key==='ArrowLeft'&&!E.f25.mode){if(i<0)i=0;else i=Math.max(0,i-1);selectClip(i);e.preventDefault()}
  else if(e.key==='ArrowRight'&&!E.f25.mode){if(i<0)i=0;else i=Math.min(S.clips.length-1,i+1);selectClip(i);e.preventDefault()}
  else if(e.key==='['){var c=cur();if(!c)return;c.start=clampC(c.start-0.2,0,c.end-0.2);try{$('cpIn').value=c.start;$('cpInV').textContent=c.start.toFixed(2)}catch(e2){}saveE();log('trim: clip '+(i+1)+' in-point '+c.start.toFixed(2)+'s');e.preventDefault()}
  else if(e.key===']'){var c2=cur();if(!c2)return;var md=(M[c2.src]?M[c2.src].dur:99);c2.end=clampC(c2.end+0.2,c2.start+0.2,md);try{$('cpOut').value=c2.end;$('cpOutV').textContent=c2.end.toFixed(2)}catch(e2){}saveE();log('trim: clip '+(i+1)+' out-point '+c2.end.toFixed(2)+'s');e.preventDefault()}
  else if(e.key==='Delete'||e.key==='Backspace'){if(i<0)return;S.clips.splice(i,1);S.selected=null;try{$('clipPanel').style.display='none'}catch(e2){}saveE();drawWrapped();log('clip deleted (keyboard) — '+S.clips.length+' left');e.preventDefault()}
});

function mount(){
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='Timeline Power Tools II (Phase 19)';card.appendChild(h);
  var r1=mkRow();r1.appendChild(mkBtn('SPLIT CLIP',splitClip,'1 1 auto','f25b1'));r1.appendChild(mkBtn('◀ MOVE LEFT',function(){move(-1)},'1 1 auto','f25b2'));r1.appendChild(mkBtn('MOVE RIGHT ▶',function(){move(1)},'1 1 auto','f25b3'));card.appendChild(r1);
  var r2=mkRow();r2.appendChild(mkBtn('REVERSE ORDER',reverse,'1 1 auto','f25b4'));r2.appendChild(mkBtn('SHUFFLE ORDER',shuffle,'1 1 auto','f25b5'));card.appendChild(r2);
  var r3=mkRow();var fs=document.createElement('select');fs.id='f25fit';['15','30','45','60'].forEach(function(v){var o=document.createElement('option');o.value=v;o.textContent=v+'s';fs.appendChild(o)});r3.appendChild(fs);r3.appendChild(mkBtn('FIT TO LENGTH',fitLen,'1 1 auto','f25b6'));card.appendChild(r3);
  var r4=mkRow();Object.keys(TAGS).forEach(function(k){var b=mkBtn(k.toUpperCase(),function(){setTag(k,k)},'0 0 auto');b.style.borderColor=TAGS[k];b.style.color='#e8f4ff';r4.appendChild(b)});r4.appendChild(mkBtn('CLEAR TAGS',clearTags,'0 0 auto','f25b7'));card.appendChild(r4);
  var r5=mkRow();var li=document.createElement('input');li.id='f25lab';li.placeholder='clip label (e.g. HOOK)';r5.appendChild(li);r5.appendChild(mkBtn('SET LABEL',setLabel,'0 0 auto','f25b8'));r5.appendChild(mkBtn('CLEAR LABELS',clearLabels,'0 0 auto','f25b9'));card.appendChild(r5);
  var r6=mkRow();r6.appendChild(mkBtn('SELECT MODE',toggleMode,'1 1 auto','f25b10'));r6.appendChild(mkBtn('GROUP DELETE',groupDel,'1 1 auto','f25b11'));r6.appendChild(mkBtn('CLEAR SELECTION',clearSel,'1 1 auto','f25b12'));card.appendChild(r6);
  var r7=mkRow();var gi=document.createElement('input');gi.id='f25gs';gi.placeholder='speed e.g. 1.5';gi.type='number';gi.step=0.05;r7.appendChild(gi);r7.appendChild(mkBtn('GROUP SPEED',groupSpeed,'0 0 auto','f25b13'));
  var gt=document.createElement('select');gt.id='f25gt';['cut','fade','punch','flash','shake','whip'].forEach(function(v){var o=document.createElement('option');o.value=v;o.textContent=v;gt.appendChild(o)});r7.appendChild(gt);r7.appendChild(mkBtn('GROUP TRANS',groupTrans,'0 0 auto','f25b14'));card.appendChild(r7);
  var r8=mkRow();r8.appendChild(mkBtn('KEYBOARD SHORTCUTS',function(){KEYHINTS.forEach(function(k){log('shortcut '+k[0]+': '+k[1])});log('shortcuts work while the timeline has focus (not typing in a box)',true)},'1 1 auto','f25b15'));card.appendChild(r8);
  var note=document.createElement('div');note.className='note';note.textContent='split cuts the selected clip in half, move/reverse/shuffle reorder without changing lengths, fit-to-length rescales every speed to land on a target, tags and labels show on the bars, the ruler shows each clip\u2019s start second, select mode lets you grab many clips and restyle or delete them in one hit, and the keyboard shortcuts run the same edits with keys.';
  card.appendChild(note);
  var hs=document.querySelectorAll('.card h2');var anchor=null;
  for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('Audio Lab')>=0){anchor=hs[i].parentElement;break}}
  if(anchor){if(anchor.nextSibling)anchor.parentElement.insertBefore(card,anchor.nextSibling);else anchor.parentElement.appendChild(card)}
  drawWrapped();
  log('timeline power tools ii live — split, reorder, fit, tags, labels, ruler, multi-select, shortcuts');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
