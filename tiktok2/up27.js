'use strict';
// up27.js — PHASE 21 FLOW LAB (Nov 23 2026)
// duplicate clip, ripple delete, even out cuts, punch-in opener, batch speed,
// copy attributes, reverse section, gap check, shift captions, loop section
(function(){
if(window.__tk2up27)return;window.__tk2up27=1;
function $(id){return document.getElementById(id)}
function mkBtn(t,fn,fl,id){var b=document.createElement('button');b.className='btn';b.textContent=t;b.style.flex=fl||'0 0 auto';if(id)b.id=id;b.onclick=fn;return b}
function mkRow(gap){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap=(gap||6)+'px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function mkIn(id,ph,wd){var i=document.createElement('input');i.id=id;i.placeholder=ph;if(wd)i.style.width=wd;return i}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function saveE(){try{if(typeof save==='function')save()}catch(e){}}
function clipDur(c){return (c.end-c.start)/(c.speed||1)}
function totalDur(){return S.clips.reduce(function(a,c){return a+clipDur(c)},0)}
function redraw(){try{if(window.drawTimeline)window.drawTimeline()}catch(e){}}
function idx(){return S.clips.findIndex(function(x){return x.id===S.selected})}
var uq=0;
function nid(){return 'u27_'+Date.now()+'_'+(uq++)}

if(!S.eco)S.eco={};var E=S.eco;
if(!E.f27)E.f27={};

function cur(){return S.clips.find(function(x){return x.id===S.selected})}
function rangeAB(aId,bId){var a=parseInt($(aId).value,10),b=parseInt($(bId).value,10);if(!a||!b||a<1||b<1||a>b||b>S.clips.length){log('enter a valid range 1-'+S.clips.length+' (a must be <= b)');return null}return[a-1,b]}

// 1) duplicate clip
function dupClip(){
  var c=cur();if(!c){log('select a clip first');return}
  var b=Object.assign({},c,{id:nid()});
  S.clips.splice(idx()+1,0,b);saveE();redraw();
  log('clip duplicated — now '+S.clips.length+' clips, '+totalDur().toFixed(1)+'s total',true);
}
// 2) ripple delete: shift later clips' start AND end by removed source length
function rippleDel(){
  var i=idx(),c=cur();if(!c){log('select a clip first');return}
  var d=c.end-c.start;S.clips.splice(i,1);
  for(var k=i;k<S.clips.length;k++){S.clips[k].start-=d;S.clips[k].end-=d}
  S.selected=null;saveE();redraw();
  log('ripple delete: clip '+(i+1)+' removed, '+S.clips.length+' clips left, later clips shifted '+d.toFixed(2)+'s earlier (timeline stays contiguous)',true);
}
// 3) even out cuts: same output duration for every clip, speed clamped
function evenCuts(){
  if(!S.clips.length){log('no clips yet');return}
  var t=totalDur(),avg=t/S.clips.length;
  if(avg<=0.2){log('average cut would be too short, no change made');return}
  var n=0;
  S.clips.forEach(function(c){
    var src=c.end-c.start,sp=Math.max(0.1,Math.min(4,src/avg));
    if(Math.abs((c.speed||1)-sp)>0.01){c.speed=Math.round(sp*100)/100;n++}
  });
  saveE();redraw();
  log('even out cuts: '+n+' clip(s) set to '+avg.toFixed(2)+'s each (speeds clamped 0.1-4.0)',true);
}
// 4) punch-in opener: clip 1 output at most 2.0s
function punchOpen(){
  var c=S.clips[0];if(!c){log('no clips yet');return}
  if(clipDur(c)<=2.0){log('opener is already '+clipDur(c).toFixed(1)+'s — under the 2s cap');return}
  c.speed=Math.max(0.1,Math.min(4,(c.end-c.start)/2.0));c.speed=Math.round(c.speed*100)/100;
  saveE();redraw();
  log('punch-in opener: clip 1 now '+clipDur(c).toFixed(2)+'s (speed '+c.speed+'x)',true);
}
// 5) batch speed on a range, inclusive
function batchSpeed(){
  var r=rangeAB('f27a','f27b');if(!r)return;var m=parseFloat($('f27m').value);
  if(!m||m<0.1||m>4){log('type a speed multiplier between 0.1 and 4');return}
  for(var i=r[0];i<r[1];i++){var c=S.clips[i];c.speed=Math.round(Math.max(0.1,Math.min(4,(c.speed||1)*m))*100)/100}
  saveE();redraw();
  log('batch speed: clips '+(r[0]+1)+'-'+r[1]+' x'+m+' applied',true);
}
// 6) copy attributes selected -> clip N (never id or timing)
function copyAttr(){
  var c=cur();if(!c){log('select the source clip first');return}
  var n=parseInt($('f27to').value,10);
  if(!n||n<1||n>S.clips.length){log('type a target clip number 1-'+S.clips.length);return}
  var t=S.clips[n-1];if(t.id===c.id){log('pick a different target clip');return}
  var got=[];
  ['style','label','tag','tint'].forEach(function(k){if(c[k]!==undefined){t[k]=c[k];got.push(k)}});
  saveE();redraw();
  log('copied to clip '+n+': '+(got.length?got.join(', '):'nothing to copy (source has no style/label/tag/tint)'),true);
}
// 7) reverse a section in place
function revSec(){
  var r=rangeAB('f27a','f27b');if(!r)return;
  var seg=S.clips.slice(r[0],r[1]).reverse();
  for(var i=r[0];i<r[1];i++)S.clips[i]=seg[i-r[0]];
  saveE();redraw();
  log('section '+(r[0]+1)+'-'+r[1]+' reversed',true);
}
// 8) gap check: contiguity report only
function gapCheck(){
  if(S.clips.length<2){log('need at least 2 clips');return}
  var bad=[];
  for(var i=1;i<S.clips.length;i++){var g=S.clips[i].start-S.clips[i-1].end;if(Math.abs(g)>0.02)bad.push((i)+':'+(g>0?'+':'')+g.toFixed(2)+'s')}
  if(!bad.length)log('gap check: timeline is contiguous, no gaps or overlaps',true);
  else log('gap check: '+bad.length+' seam(s) off (later clip start vs previous end) — '+bad.slice(0,6).join(', ')+(bad.length>6?' +'+(bad.length-6)+' more':''),true);
}
// 9) shift captions
function capShift(){
  var d=parseFloat($('f27cd').value);
  if(isNaN(d)||d===0){log('type seconds to shift captions by, e.g. 0.5 or -1');return}
  if(!S.captions||!S.captions.length){log('no captions yet');return}
  S.captions.forEach(function(c){c.start=Math.max(0,c.start+d);c.end=Math.max(0.1,c.end+d)});
  saveE();redraw();
  log('shifted '+S.captions.length+' caption(s) by '+(d>0?'+':'')+d+'s',true);
}
// 10) loop section a..b appended after b, N times
function loopSec(){
  var r=rangeAB('f27a','f27b');if(!r)return;
  var n=parseInt($('f27n').value,10);
  if(!n||n<1||n>3){log('loop count must be 1-3');return}
  var seg=S.clips.slice(r[0],r[1]);
  var copies=[];
  for(var k=0;k<n;k++)seg.forEach(function(c){copies.push(Object.assign({},c,{id:nid()}))});
  S.clips.splice.apply(S.clips,[r[1],0].concat(copies));
  saveE();redraw();
  log('loop: '+(r[1]-r[0])+' clips repeated '+n+'x after clip '+r[1]+' — now '+S.clips.length+' clips, '+totalDur().toFixed(1)+'s total',true);
}

function mount(){
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='Flow Lab (Phase 21)';card.appendChild(h);
  var r1=mkRow();r1.appendChild(mkBtn('DUPLICATE CLIP',dupClip,'1 1 auto','f27b1'));r1.appendChild(mkBtn('RIPPLE DELETE',rippleDel,'1 1 auto','f27b2'));card.appendChild(r1);
  var r2=mkRow();r2.appendChild(mkBtn('EVEN OUT CUTS',evenCuts,'1 1 auto','f27b3'));r2.appendChild(mkBtn('PUNCH-IN OPENER',punchOpen,'1 1 auto','f27b4'));card.appendChild(r2);
  var r3=mkRow();r3.appendChild(mkIn('f27a','#', '40px'));r3.appendChild(mkIn('f27b','#','40px'));r3.appendChild(mkIn('f27m','speed x','62px'));r3.appendChild(mkBtn('BATCH SPEED',batchSpeed,'1 1 auto','f27b5'));r3.appendChild(mkBtn('REVERSE SECTION',revSec,'1 1 auto','f27b6'));card.appendChild(r3);
  var r4=mkRow();r4.appendChild(mkIn('f27to','target #','40px'));r4.appendChild(mkBtn('COPY ATTRIBUTES',copyAttr,'1 1 auto','f27b7'));r4.appendChild(mkBtn('GAP CHECK',gapCheck,'1 1 auto','f27b8'));card.appendChild(r4);
  var r5=mkRow();r5.appendChild(mkIn('f27cd','shift captions by (s)','120px'));r5.appendChild(mkBtn('SHIFT CAPTIONS',capShift,'1 1 auto','f27b9'));card.appendChild(r5);
  var r6=mkRow();r6.appendChild(mkIn('f27n','loop count 1-3','90px'));r6.appendChild(mkBtn('LOOP SECTION',loopSec,'1 1 auto','f27b10'));card.appendChild(r6);
  var note=document.createElement('div');note.className='note';note.textContent='duplicate copies the selected clip after itself, ripple delete removes it and pulls the rest of the timeline shut, even out cuts makes every clip the same length, punch-in opener caps clip 1 at 2 seconds, batch speed and reverse section work on a numbered range, copy attributes moves style/label/tag/tint (never timing), gap check reports seams that are off, shift captions slides every caption in time, and loop section repeats a range right after itself.';
  card.appendChild(note);
  var hs=document.querySelectorAll('.card h2'),anchor=null;
  for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('Project Lab')>=0){anchor=hs[i].parentElement;break}}
  if(anchor){if(anchor.nextSibling)anchor.parentElement.insertBefore(card,anchor.nextSibling);else anchor.parentElement.appendChild(card)}
  else{var ap=document.querySelector('#panelcol')||document.body;ap.appendChild(card)}
  log('flow lab live — duplicate, ripple delete, even cuts, punch opener, batch speed, copy attributes, reverse section, gap check, caption shift, loop section');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();