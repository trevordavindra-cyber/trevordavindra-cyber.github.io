'use strict';
// up35.js - PHASE 29 TREND LAB (Nov 23 2026)
// trend fit check, hashtag builder, post time picker, format preset, cycle format,
// duet prep, greenscreen plan, sound tag, hook lines, trend report
(function(){
if(window.__tk2up35)return;window.__tk2up35=1;
function $(id){return document.getElementById(id)}
function mkBtn(t,fn,fl,id){var b=document.createElement('button');b.className='btn';b.textContent=t;b.style.flex=fl||'0 0 auto';if(id)b.id=id;b.onclick=fn;return b}
function mkRow(gap){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap=(gap||6)+'px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function saveE(){try{if(typeof save==='function')save()}catch(e){}}
function S(){try{return window.S||window.state||window.APPSTATE||{}}catch(e){return {}}}
function clipDur(c){var st=parseFloat(c.start),en=parseFloat(c.end);if(!isFinite(st)||!isFinite(en))return 0;return Math.max(0,(en-st))/(c.speed||1)}
function clips(){var s=S();var a=(s&&s.clips)||[];var out=[],t=0;for(var i=0;i<a.length;i++){var d=clipDur(a[i]);if(d>0.05){t+=d;out.push({c:a[i],d:d,i:i,st:t-d})}}return out}
function total(){var a=clips(),t=0;for(var i=0;i<a.length;i++)t+=a[i].d;return t}
function needClips(){var a=clips();if(!a.length){log('trend lab: add clips to the timeline first');return null}return a}
function trOf(c){return (c.transition||c.trans||'cut')}
function touched(c){var z=(typeof c.zoom==='number')?c.zoom:parseFloat(c.zoom);z=isFinite(z)?z:1;
return Math.abs((c.speed||1)-1)>0.02||Math.abs(z-1)>0.02||(trOf(c)!=='cut'&&trOf(c)!=='none'&&!!(c.transition||c.trans))}
var FORMATS=[
 {name:'PHONK EDIT',hint:'fast cuts, shake, ramps',check:function(m){var hit=0,tot=0;tot++;hit+=m.per10>=7?1:0;tot++;hit+=m.shakes>=2?1:0;tot++;hit+=m.ramps>=2?1:0;tot++;hit+=m.avg<=1.8?1:0;return {hit:hit,tot:tot}}},
 {name:'PHOTO DUMP',hint:'longer holds, lots of captions',check:function(m){var hit=0,tot=0;tot++;hit+=m.avg>=2.2?1:0;tot++;hit+=m.capsN>=3?1:0;tot++;hit+=m.per10<=4?1:0;tot++;hit+=m.shakes===0?1:0;return {hit:hit,tot:tot}}},
 {name:'POV',hint:'snappy open, caption up fast',check:function(m){var hit=0,tot=0;tot++;hit+=m.opens<=2.5?1:0;tot++;hit+=m.capEarly>=1?1:0;tot++;hit+=m.per10>=3&&m.per10<=8?1:0;return {hit:hit,tot:tot}}},
 {name:'TUTORIAL',hint:'steady pace, clean cuts',check:function(m){var hit=0,tot=0;tot++;hit+=m.per10>=2&&m.per10<=5?1:0;tot++;hit+=m.shakes===0?1:0;tot++;hit+=m.ramps<=1?1:0;tot++;hit+=m.avg>=1.5?1:0;return {hit:hit,tot:tot}}}
];
var fmtIdx=0;
function metrics(){var cs=clips();if(!cs.length){return null}var t=total();if(t<=0){return null}
 var per10=cs.length/Math.max(0.1,t)*10;var durs=[],shakes=0,ramps=0;
 for(var i=0;i<cs.length;i++){var c=cs[i].c;durs.push(cs[i].d);if(trOf(c)==='shake')shakes++;if(Math.abs((c.speed||1)-1)>=0.15)ramps++}
 var avg=0;for(var k=0;k<durs.length;k++)avg+=durs[k];avg=avg/durs.length;
 var st=S();var caps=(st.captions||[]);var capEarly=0;
 for(var j=0;j<caps.length;j++){var t0=parseFloat(caps[j].t0);if(isFinite(t0)&&t0<2)capEarly++}
 var style=((st.style||st.genre||cs[0].c.style||cs[0].c.label||'')+'').toUpperCase();
 return {cs:cs,t:t,per10:per10,avg:avg,shakes:shakes,ramps:ramps,opens:cs[0].d,caps:caps,capsN:caps.length,capEarly:capEarly,style:style};
}
function bestFmt(m){var bi=0,bs=-1,rows=[];
 for(var i=0;i<FORMATS.length;i++){var r=FORMATS[i].check(m);var pct=Math.round(r.hit/r.tot*100);rows.push(FORMATS[i].name+' '+pct+'%');if(pct>bs){bs=pct;bi=i}}
 return {best:bi,rows:rows}}
function fit(){var x=needClips();if(!x){return}var m=metrics();if(!m){return}
 var b=bestFmt(m);log('TREND FIT - closest format: '+FORMATS[b.best].name+' ('+b.rows.join(' | ')+')',true);saveE()}
function tags(){var x=needClips();if(!x){return}var m=metrics();if(!m){return}
 var b=bestFmt(m);var st=S();var genre=((st.genre||'')+'').toLowerCase().replace(/[^a-z0-9]/g,'');
 var raw=['fyp','foryoupage',FORMATS[b.best].name.split(' ')[0].toLowerCase(),m.style.toLowerCase().replace(/[^a-z0-9]/g,''),genre?'tiktok'+genre:'editing'];
 var seen={},out=[];for(var i=0;i<raw.length;i++){var w=raw[i];if(!w)continue;if(!seen[w]){seen[w]=1;out.push('#'+w)}}
 if(out.length>5)out=out.slice(0,5);
 var line=out.join(' ');
 try{navigator.clipboard.writeText(line)}catch(e){}
 log('HASHTAGS (copied) - '+line,true);saveE()}
function postTime(){var x=needClips();if(!x){return}
var slots=[];var names=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];var d=new Date();
for(var k=0;k<4&&slots.length<3;k++){var dd=new Date(d.getFullYear(),d.getMonth(),d.getDate()+k,19,0,0);
 if(dd.getTime()<=d.getTime())continue;
 slots.push(names[dd.getDay()]+' '+(dd.getMonth()+1)+'/'+dd.getDate()+' 7:00pm')}
if(!slots.length)slots=['tomorrow 7:00pm'];
log('POST TIME - best windows (your local time): '+slots.join(' | ')+' - evenings 6-10pm are the heaviest scroll traffic',true);saveE()}
function preset(){var x=needClips();if(!x){return}var m=metrics();if(!m){return}
 var f=FORMATS[fmtIdx%FORMATS.length];var n=0;
 for(var i=0;i<m.cs.length;i++){var c=m.cs[i].c;if(touched(c))continue;
  if(f.name==='PHONK EDIT'){if((c.speed||1)<1.1)c.speed=1.15;if((trOf(c)==='cut'||trOf(c)==='none'||!(c.transition||c.trans))&&n<2)c.transition='shake'}
  else if(f.name==='PHOTO DUMP'){if((c.speed||1)>1)c.speed=1;if(trOf(c)==='shake'&&n<2)c.transition='fade'}
  else if(f.name==='POV'){if(i===0&&!(typeof c.zoom==='number'&&c.zoom>1.02))c.zoom=1.08}
  else{if((c.speed||1)!==1)c.speed=1;if(trOf(c)==='shake')c.transition='cut'}
  n++}
 if(n){saveE();log('FORMAT PRESET - '+f.name+' ('+f.hint+') applied to '+n+' untouched clip(s); untouched or customized clips were skipped',true)}
 else{log('FORMAT PRESET - every clip already customized, nothing changed (preset target: '+f.name+')')}}
function cycle(){fmtIdx=(fmtIdx+1)%FORMATS.length;log('FORMAT CYCLE - preset target now '+FORMATS[fmtIdx].name+' ('+FORMATS[fmtIdx].hint+'); press FORMAT PRESET to apply it',true)}
function duet(){var x=needClips();if(!x){return}var m=metrics();if(!m){return}
 var ok=[],bad=[];
 (m.opens<=3?ok:bad).push('opener '+Math.round(m.opens*10)/10+'s (duet wants under 3s)');
 var capEarly2=0;for(var i=0;i<m.caps.length;i++){var t0=parseFloat(m.caps[i].t0);if(isFinite(t0)&&t0<2)capEarly2++}
 (capEarly2>0?ok:bad).push('caption in the first 2s');
 (m.t<=60?ok:bad).push('length '+Math.round(m.t*10)/10+'s (duet sweet spot under 60s)');
 var bar=0;for(var k=0;k<Math.min(3,m.cs.length);k++){var c=m.cs[k].c;var z=(typeof c.zoom==='number')?c.zoom:parseFloat(c.zoom);if(isFinite(z)&&z<0.95)bar++}
 (bar===0?ok:bad).push('first 3 clips fill the frame');
 log('DUET PREP - '+(bad.length?'fix first: ':'ready: ')+(bad.length?bad.join(' | '):ok.join(' | ')),true);saveE()}
function green(){var x=needClips();if(!x){return}var m=metrics();if(!m){return}
 var picks=[];for(var i=0;i<m.cs.length;i++){var it=m.cs[i];if(it.d>=2.0&&picks.length<3)picks.push('clip '+(it.i+1)+' ('+Math.round(it.d*10)/10+'s hold)')}
 if(picks.length){log('GREENSCREEN PLAN - best candidates (longest steady holds): '+picks.join(' | '),true)}
 else{log('GREENSCREEN PLAN - no clip holds 2s+, trim a long clip or add one to green-screen over',true)}
 saveE()}
function sound(){var x=needClips();if(!x){return}var m=metrics();if(!m){return}
 var tag=m.per10>=7?'hard music + sfx impacts (phonk, drill)':(m.per10>=4?'trending music, cuts land loosely on the beat':'spoken voiceover over steady music');
 var extra=m.style?(' style '+m.style):'';
 log('SOUND TAG - '+tag+extra,true);saveE()}
function hooks(){var x=needClips();if(!x){return}var m=metrics();if(!m){return}
 var b=bestFmt(m);var f=FORMATS[b.best].name;
 var h1=f==='PHOTO DUMP'?'photo dump nobody asked for but everybody needed':(f==='POV'?'POV: you finally tried this':(f==='TUTORIAL'?'how to do this in under 60 seconds':'wait for the drop at the end'));
 var h2='nobody is talking about this and they should be';
 var h3=(m.style?m.style.toLowerCase():'this edit')+' edit that took way too long';
 log('HOOK LINES - 1) '+h1+' 2) '+h2+' 3) '+h3,true);saveE()}
function report(){var x=needClips();if(!x){return}var m=metrics();if(!m){return}
 var b=bestFmt(m);var L=['TREND REPORT','generated '+new Date().toString(),'','total: '+Math.round(m.t*10)/10+'s, '+m.cs.length+' clips, '+Math.round(m.per10*10)/10+' cuts/10s','avg clip: '+Math.round(m.avg*10)/10+'s, shakes '+m.shakes+', ramps '+m.ramps,'captions: '+m.capsN+' ('+m.capEarly+' start under 2s)','style: '+(m.style||'not set'),'','format fit: '+b.rows.join(' | '),'closest format: '+FORMATS[b.best].name,'preset target: '+FORMATS[fmtIdx].name,'','clips:'];
 for(var i=0;i<m.cs.length;i++){var c=m.cs[i].c;L.push('  '+(i+1)+'. '+Math.round(m.cs[i].d*10)/10+'s speed '+(c.speed||1)+'x trans '+trOf(c)+(touched(c)?' (customized)':''))}
 try{var blob=new Blob([L.join('\n')],{type:'text/plain'});var el=document.createElement('a');el.href=URL.createObjectURL(blob);el.download='trend_report.txt';document.body.appendChild(el);el.click();setTimeout(function(){document.body.removeChild(el)},300)}catch(e){log('download failed: '+e.message);return}
 log('trend report .txt downloaded',true);saveE()}
function mount(){
  if($('f35card'))return;
  var card=document.createElement('div');card.className='card';card.id='f35card';
  var h=document.createElement('h2');h.textContent='TREND LAB';card.appendChild(h);
  var r1=mkRow();r1.appendChild(mkBtn('TREND FIT',fit,'1 1 auto','f35b1'));r1.appendChild(mkBtn('HASHTAGS',tags,'1 1 auto','f35b2'));card.appendChild(r1);
  var r2=mkRow();r2.appendChild(mkBtn('POST TIME',postTime,'1 1 auto','f35b3'));r2.appendChild(mkBtn('FORMAT PRESET',preset,'1 1 auto','f35b4'));card.appendChild(r2);
  var r3=mkRow();r3.appendChild(mkBtn('CYCLE FORMAT',cycle,'1 1 auto','f35b5'));r3.appendChild(mkBtn('DUET PREP',duet,'1 1 auto','f35b6'));card.appendChild(r3);
  var r4=mkRow();r4.appendChild(mkBtn('GREENSCREEN PLAN',green,'1 1 auto','f35b7'));r4.appendChild(mkBtn('SOUND TAG',sound,'1 1 auto','f35b8'));card.appendChild(r4);
  var r5=mkRow();r5.appendChild(mkBtn('HOOK LINES',hooks,'1 1 auto','f35b9'));r5.appendChild(mkBtn('TREND REPORT .TXT',report,'1 1 auto','f35b10'));card.appendChild(r5);
  var note=document.createElement('div');note.className='note';note.id='f35note';note.textContent='trend lab reads the cut like a trend page: it scores which format the edit is closest to (phonk edit, photo dump, pov, tutorial), builds a hashtag set, picks post windows, applies a format preset to untouched clips only, checks duet readiness, finds greenscreen holds, recommends a sound lane, drafts hook lines and exports the report.';
  card.appendChild(note);
  var hs=document.querySelectorAll('.card h2'),anchor=null;
  for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('MOTION LAB')>=0){anchor=hs[i].parentElement;break}}
  if(anchor){if(anchor.nextSibling)anchor.parentElement.insertBefore(card,anchor.nextSibling);else anchor.parentElement.appendChild(card)}
  else{var ap=document.querySelector('#panelcol')||document.body;ap.appendChild(card)}
  log('trend lab live - trend fit, hashtags, post time, format preset, cycle format, duet prep, greenscreen plan, sound tag, hook lines, trend report');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();