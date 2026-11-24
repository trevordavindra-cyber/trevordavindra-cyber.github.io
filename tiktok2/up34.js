'use strict';
// up34.js - PHASE 28 MOTION LAB (Nov 23 2026)
// still frame scan, black bar check, motion score, auto zoom pass, shake pass,
// ramp suggestions, cut density check, motion fix list, one-tap motion pass, motion report
(function(){
if(window.__tk2up34)return;window.__tk2up34=1;
function $(id){return document.getElementById(id)}
function mkBtn(t,fn,fl,id){var b=document.createElement('button');b.className='btn';b.textContent=t;b.style.flex=fl||'0 0 auto';if(id)b.id=id;b.onclick=fn;return b}
function mkRow(gap){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap=(gap||6)+'px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function saveE(){try{if(typeof save==='function')save()}catch(e){}}
function S(){try{return window.S||window.state||window.APPSTATE||{}}catch(e){return {}}}
function clipDur(c){var st=parseFloat(c.start),en=parseFloat(c.end);if(!isFinite(st)||!isFinite(en))return 0;return Math.max(0,(en-st))/(c.speed||1)}
function clips(){var s=S();var a=(s&&s.clips)||[];var out=[],t=0;for(var i=0;i<a.length;i++){var d=clipDur(a[i]);if(d>0.05){t+=d;out.push({c:a[i],d:d,i:i,st:t-d})}}return out}
function total(){var a=clips(),t=0;for(var i=0;i<a.length;i++)t+=a[i].d;return t}
function needClips(){var a=clips();if(!a.length){log('motion lab: add clips to the timeline first');return null}return a}
function camOf(c){return (c.camera||c.cam||c.ken||c.motion||c.move||null)}
function zoomOf(c){var z=(typeof c.zoom==='number')?c.zoom:parseFloat(c.zoom);return isFinite(z)?z:1}
function isStill(c){var z=zoomOf(c);var tr=(c.transition||c.trans||'cut');var staticTr=(tr==='cut'||tr==='fade'||tr==='none'||!tr);
return Math.abs((c.speed||1)-1)<0.05&&Math.abs(z-1)<0.05&&staticTr&&!camOf(c)}
function isBarRisk(c){return zoomOf(c)<0.95&&!camOf(c)}
function analyze(){var cs=clips();if(!cs.length)return null;var t=total();if(t<=0)return null;
var stills=[],bars=[],shakes=0,moves=0,ramps=0;
for(var i=0;i<cs.length;i++){var c=cs[i].c;
  if(isStill(c))stills.push(i);
  if(isBarRisk(c))bars.push(i);
  var tr=(c.transition||c.trans||'cut');if(tr==='shake')shakes++;
  if(camOf(c))moves++;
  if(Math.abs((c.speed||1)-1)>=0.15)ramps++;
}
var per10=cs.length/Math.max(0.1,t)*10;
var movingShare=1-stills.length/cs.length;
var score=40;
if(movingShare>=0.85)score+=25;else if(movingShare>=0.6)score+=15;else score+=5;
if(per10>=3&&per10<=9)score+=15;else score+=3;
if(shakes>0)score+=8;
if(ramps>=2)score+=8;else if(ramps===1)score+=4;
if(!bars.length)score+=4;
score=Math.max(5,Math.min(98,Math.round(score)));
return {cs:cs,t:t,stills:stills,bars:bars,shakes:shakes,moves:moves,ramps:ramps,per10:per10,movingShare:movingShare,score:score};
}
function scan(){var x=needClips();if(!x)return;var a=analyze();if(!a)return;
if(!a.stills.length){log('STILL FRAME SCAN - every clip has motion (speed, zoom, camera move or transition)',true)}
else{log('STILL FRAME SCAN - '+a.stills.length+' of '+a.cs.length+' clip(s) are still frames: #'+a.stills.map(function(i){return i+1}).join(', #')+' (no speed, zoom, camera move or motion transition)',true)}
saveE()}
function bars(){var x=needClips();if(!x)return;var a=analyze();if(!a)return;
if(!a.bars.length){log('BLACK BAR CHECK - no clip risks black bars (all zoomed in or camera-moved to fill frame)',true)}
else{log('BLACK BAR CHECK - '+a.bars.length+' clip(s) may show black bars (zoom under 1.0 with no camera move): #'+a.bars.map(function(i){return i+1}).join(', #'),true)}
saveE()}
function score(){var x=needClips();if(!x)return;var a=analyze();if(!a)return;
log('MOTION SCORE - '+a.score+'/100 ('+Math.round(a.movingShare*100)+'% clips moving, '+Math.round(a.per10*10)/10+' cuts/10s, '+a.shakes+' shake, '+a.moves+' camera moves, '+a.ramps+' speed ramps)',true);saveE()}
function zoomPass(){var x=needClips();if(!x)return;var a=analyze();if(!a)return;var n=0;
for(var k=0;k<a.stills.length;k++){var c=a.cs[a.stills[k]].c;if(!(typeof c.zoom==='number'&&c.zoom>1.05)){c.zoom=1.15;n++}}
if(n){saveE();log('AUTO ZOOM PASS - pushed 1.15x zoom into '+n+' still clip(s) so every cut moves',true)}
else{log('AUTO ZOOM PASS - nothing to do, flagged clips already have zoom');}}
function shakePass(){var x=needClips();if(!x)return;var a=analyze();if(!a)return;var n=0;
for(var k=0;k<a.stills.length&&n<3;k++){var c=a.cs[a.stills[k]].c;var tr=(c.transition||c.trans||'cut');if(tr==='cut'||tr==='none'||!tr){c.transition='shake';n++}}
if(n){saveE();log('SHAKE PASS - set camera-shake transitions on '+n+' still clip(s)',true)}
else{log('SHAKE PASS - nothing to change, still clips already have motion transitions');}}
function ramps(){var x=needClips();if(!x)return;var a=analyze();if(!a.return);
var sorted=a.cs.slice().sort(function(p,q){return q.d-p.d}).slice(0,3);
var out=sorted.map(function(it){return 'clip '+(it.i+1)+' ('+Math.round(it.d*10)/10+'s: ramp 1.0 to 1.3x over it)'}).join(' | ');
log('RAMP SPOTS (3 longest) - '+out,true);saveE()}
function density(){var x=needClips();if(!x)return;var a=analyze();if(!a.return);
var ok=a.per10>=3&&a.per10<=9;
log('CUT DENSITY - '+Math.round(a.per10*10)/10+' cuts per 10s ('+(ok?'in the 3-9 sweet spot':'outside the sweet spot: '+(a.per10<3?'add cuts or trim long holds':'slow down, it reads chaotic'))+')',true);saveE()}
function fixes(){var x=needClips();if(!x)return;var a=analyze();if(!a.return);var f=[];
if(a.stills.length)f.push(a.stills.length+' still frame(s): run AUTO ZOOM PASS or SHAKE PASS');
if(a.bars.length)f.push(a.bars.length+' black-bar risk clip(s): zoom them to 1.1x+');
if(a.per10<3)f.push('only '+Math.round(a.per10*10)/10+' cuts/10s: split the longest clips');
if(a.ramps<2)f.push('flat speed: add ramps on the 2 longest clips');
if(!f.length)f.push('motion looks clean, ship it');
log('MOTION FIX LIST (top 3) - '+f.slice(0,3).map(function(r,i){return (i+1)+') '+r}).join(' | '),true);saveE()}
function pass(){var x=needClips();if(!x)return;var a=analyze();if(!a.return);
var z=0,sh=0;
for(var k=0;k<a.stills.length;k++){var c=a.cs[a.stills[k]].c;
  if(!(typeof c.zoom==='number'&&c.zoom>1.05)){c.zoom=1.15;z++}
  var tr=(c.transition||c.trans||'cut');
  if(sh<3&&(tr==='cut'||tr==='none'||!tr)&&isStill(c)){c.transition='shake';sh++}
}
if(z||sh){saveE();log('MOTION PASS - '+z+' zoom fix(es) + '+sh+' shake transition(s) applied; rescoring: ',true);var a2=analyze();if(a2)log('MOTION SCORE after pass - '+a2.score+'/100 (was '+a.score+')',true)}
else{log('MOTION PASS - nothing to fix, every clip already moves');}}
function report(){var x=needClips();if(!x)return;var a=analyze();if(!a.return);
var L=['MOTION REPORT','generated '+new Date().toString(),'','motion score: '+a.score+'/100','clips: '+a.cs.length,'total: '+Math.round(a.t*10)/10+'s','cuts per 10s: '+Math.round(a.per10*10)/10,'still frames: '+(a.stills.length?a.stills.map(function(i){return i+1}).join(', '):'none'),'black bar risks: '+(a.bars.length?a.bars.map(function(i){return i+1}).join(', '):'none'),'shake transitions: '+a.shakes,'camera moves: '+a.moves,'speed ramps: '+a.ramps,'','clips:'];
for(var i=0;i<a.cs.length;i++){var c=a.cs[i].c;L.push('  '+(i+1)+'. '+Math.round(a.cs[i].d*10)/10+'s speed '+(c.speed||1)+'x zoom '+zoomOf(c)+' trans '+(c.transition||c.trans||'cut')+(camOf(c)?' cam':'')+(isStill(c)?'  <-- STILL':''))}
try{var b=new Blob([L.join('\n')],{type:'text/plain'});var el=document.createElement('a');el.href=URL.createObjectURL(b);el.download='motion_report.txt';document.body.appendChild(el);el.click();setTimeout(function(){document.body.removeChild(el)},300)}catch(e){log('download failed: '+e.message);return}
log('motion report .txt downloaded',true);saveE()}
function mount(){
  if($('f34card'))return;
  var card=document.createElement('div');card.className='card';card.id='f34card';
  var h=document.createElement('h2');h.textContent='MOTION LAB';card.appendChild(h);
  var r1=mkRow();r1.appendChild(mkBtn('STILL FRAME SCAN',scan,'1 1 auto','f34b1'));r1.appendChild(mkBtn('BLACK BAR CHECK',bars,'1 1 auto','f34b2'));card.appendChild(r1);
  var r2=mkRow();r2.appendChild(mkBtn('MOTION SCORE',score,'1 1 auto','f34b3'));r2.appendChild(mkBtn('AUTO ZOOM PASS',zoomPass,'1 1 auto','f34b4'));card.appendChild(r2);
  var r3=mkRow();r3.appendChild(mkBtn('SHAKE PASS',shakePass,'1 1 auto','f34b5'));r3.appendChild(mkBtn('RAMP SPOTS',ramps,'1 1 auto','f34b6'));card.appendChild(r3);
  var r4=mkRow();r4.appendChild(mkBtn('CUT DENSITY',density,'1 1 auto','f34b7'));r4.appendChild(mkBtn('MOTION FIX LIST',fixes,'1 1 auto','f34b8'));card.appendChild(r4);
  var r5=mkRow();r5.appendChild(mkBtn('MOTION PASS (ONE TAP)',pass,'1 1 auto','f34b9'));r5.appendChild(mkBtn('MOTION REPORT .TXT',report,'1 1 auto','f34b10'));card.appendChild(r5);
  var note=document.createElement('div');note.className='note';note.id='f34note';note.textContent='motion lab kills the two things that kill a tiktok: still frames and black bars. it scans every clip for real motion, scores the cut, then one tap pushes zoom and shake into the dead spots. still frames scan, black bar check, motion score, auto zoom pass, shake pass, ramp spots, cut density, motion fix list, one-tap motion pass, motion report.';
  card.appendChild(note);
  var hs=document.querySelectorAll('.card h2'),anchor=null;
  for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('REVIEW LAB')>=0){anchor=hs[i].parentElement;break}}
  if(anchor){if(anchor.nextSibling)anchor.parentElement.insertBefore(card,anchor.nextSibling);else anchor.parentElement.appendChild(card)}
  else{var ap=document.querySelector('#panelcol')||document.body;ap.appendChild(card)}
  log('motion lab live - still frame scan, black bar check, motion score, auto zoom pass, shake pass, ramp spots, cut density, motion fix list, one-tap motion pass, motion report');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
