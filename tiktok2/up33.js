'use strict';
// up33.js - PHASE 27 REVIEW LAB (Nov 23 2026)
// three reviewers, panel score, risk flags, virality estimate, ctr guess,
// first comment, blind spots, verdict, one-line pitch, review sheet
(function(){
if(window.__tk2up33)return;window.__tk2up33=1;
function $(id){return document.getElementById(id)}
function mkBtn(t,fn,fl,id){var b=document.createElement('button');b.className='btn';b.textContent=t;b.style.flex=fl||'0 0 auto';if(id)b.id=id;b.onclick=fn;return b}
function mkRow(gap){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap=(gap||6)+'px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function saveE(){try{if(typeof save==='function')save()}catch(e){}}
function S(){try{return window.S||window.state||window.APPSTATE||{}}catch(e){return {}}}
function clipDur(c){var st=parseFloat(c.start),en=parseFloat(c.end);if(!isFinite(st)||!isFinite(en))return 0;return Math.max(0,(en-st))/(c.speed||1)}
function clips(){var s=S();var a=(s&&s.clips)||[];var out=[],t=0;for(var i=0;i<a.length;i++){var d=clipDur(a[i]);if(d>0.05){t+=d;out.push({c:a[i],d:d,src:a[i],st:t-d})}}return out}
function total(){var a=clips(),t=0;for(var i=0;i<a.length;i++)t+=a[i].d;return t}
function needClips(){var a=clips();if(!a.length){log('review lab: add clips to the timeline first');return null}return a}
function style(){var s=S();return (s&&(s.style||s.currentStyle||s.look))||null}
function styleName(){var st=style();return (st&&(st.name||st.id||st.label))||'default'}
function transTypes(){var cs=clips();var m={},u=0;for(var i=0;i<cs.length;i++){var tr=cs[i].src.transition||cs[i].src.trans||'cut';if(!m[tr]){m[tr]=1;u++}}return u}
function capsCount(){var s=S();var c=(s&&(s.captions||s.caps||s.subtitles))||[];return c.length}
function layersCount(){var s=S();var c=(s&&(s.layers||s.textLayers||s.overlays))||[];return c.length}
function musicOn(){var s=S();return !!((s&&(s.music||s.audio||s.musicUrl)))}
function gradeOn(){var s=S();return !!(s&&(s.grade||s.colorGrade||s.lookGrade))}
function coverTitle(){var s=S();return (s&&(s.coverTitle||s.coverText||s.coverTitleText))||''}
function dl(name,text){try{var b=new Blob([text],{type:'text/plain'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a)},300);return true}catch(e){log('download failed: '+e.message);return false}}
function uniqueName(base,ext){var n=base+'.'+ext;try{var t=new Date();var s=(''+t.getHours()).padStart(2,'0')+(''+t.getMinutes()).padStart(2,'0')+(''+t.getSeconds()).padStart(2,'0');n=base+'_'+s+'.'+ext}catch(e){}return n}
function scores(){
  var cs=clips();if(!cs.length)return null;var t=total();if(t<=0)return null;
  var ret=50,rn=[];
  if(cs[0].d<1.6){ret+=15}else{rn.push('opening clip '+Math.round(cs[0].d*10)/10+'s is long for a hook, 1.5s or less')}
  var per10=cs.length/Math.max(0.1,t)*10;
  if(per10>=3&&per10<=8){ret+=10}else if(per10>8){rn.push('pacing '+Math.round(per10*10)/10+'/10s may read chaotic')}else{rn.push('pacing is slow '+Math.round(per10*10)/10+'/10s')}
  if(musicOn()){ret+=10}else{rn.push('no music on the timeline')}
  if(capsCount()>0){ret+=8}else{rn.push('no captions yet')}
  if(Math.abs(cs[cs.length-1].d-cs[0].d)<0.3){ret+=7}else{rn.push('loopback off: open '+Math.round(cs[0].d*10)/10+'s vs end '+Math.round(cs[cs.length-1].d*10)/10+'s')}
  ret=Math.max(5,Math.min(98,Math.round(ret)));
  var stl=45,sn=[];
  if(gradeOn()){stl+=12}else{sn.push('no color grade applied')}
  if(transTypes()>=3){stl+=12}else{sn.push('only '+transTypes()+' transition type(s) in use, vary them')}
  if(layersCount()){stl+=8}else{sn.push('no text layers for polish')}
  var spd=0;for(var i=0;i<cs.length;i++){if((cs[i].src.speed||1)!==1)spd++}
  if(spd>=Math.max(2,Math.round(cs.length*0.2))){stl+=10}else{sn.push('flat speed: add a ramp or a 1.3x moment')}
  stl=Math.max(5,Math.min(98,Math.round(stl)));
  var alg=40,an=[];
  if(t>=12&&t<=60){alg+=15}else if(t>60){an.push('cut is '+Math.round(t)+'s, over 60s hurts completion rate')}else{an.push('cut is only '+Math.round(t*10)/10+'s, short for watch time')}
  var seen={},reuse=0;for(var j=0;j<cs.length;j++){var k=(cs[j].src.src||cs[j].src.name||'f'+j);seen[k]=(seen[k]||0)+1}
  for(var k2 in seen){if(seen[k2]>1)reuse++}
  if(reuse){alg+=10;an.push('plus: '+reuse+' clip(s) reused, rewatches help')}
  if(musicOn())alg+=8;
  if(capsCount()>=3){alg+=8}else{an.push('only '+capsCount()+' caption line(s), 3+ reads better in feed')}
  alg=Math.max(5,Math.min(98,Math.round(alg)));
  return {ret:ret,rn:rn,stl:stl,sn:sn,alg:alg,an:an,t:t,cs:cs,per10:per10};
}
function reviewers(){var x=needClips();if(!x)return;var s=scores();if(!s)return;
log('REVIEWER 1/3 RETENTION HAWK - '+s.ret+'/100: '+(s.rn.length?s.rn.slice(0,3).join(' | '):'hook, pacing, music, captions and loop all check out'),true);
log('REVIEWER 2/3 STYLE CRITIC - '+s.stl+'/100: '+(s.sn.length?s.sn.slice(0,3).join(' | '):'grade, transitions, layers and speed moves all land'),true);
log('REVIEWER 3/3 ALGO BRAIN - '+s.alg+'/100: '+(s.an.length?s.an.slice(0,3).join(' | '):'length, reuse, music and captions feed the algorithm well'),true);
saveE()}
function panel(){var x=needClips();if(!x)return;var s=scores();if(!s)return;var p=Math.round(s.ret*0.45+s.stl*0.25+s.alg*0.30);
var g=p>=80?'A':p>=70?'B':p>=60?'C':p>=50?'D':'F';
log('PANEL SCORE - '+p+'/100 (grade '+g+', retention hawk '+s.ret+' x45% + style critic '+s.stl+' x25% + algo brain '+s.alg+' x30%)',true);saveE()}
function risks(){var x=needClips();if(!x)return;var s=scores();if(!s)return;var all=s.rn.concat(s.sn).concat(s.an);if(!all.length)all=['no structural risks found - polish the first frame and ship'];
log('RISK FLAGS (top 5) - '+all.slice(0,5).map(function(r,i){return (i+1)+') '+r}).join(' | '),true);saveE()}
function virality(){var x=needClips();if(!x)return;var s=scores();if(!s)return;var p=Math.round(s.ret*0.45+s.stl*0.25+s.alg*0.30);
var v=Math.max(1,Math.min(10,Math.round(p/10)));
var band=v>=8?'strong post candidate':v>=6?'solid, one more polish pass pays':v>=4?'needs work before posting':'do not post yet, fix the flags first';
log('VIRALITY ESTIMATE - '+v+'/10 ('+band+', from panel '+p+'/100)',true);saveE()}
function ctr(){var x=needClips();if(!x)return;var s=scores();if(!s)return;var base=3.2;
if(coverTitle())base+=1.2;else log('ctr note: no cover title set, estimates assume none');
if(gradeOn())base+=0.5;if(capsCount()>0)base+=0.4;if(s.cs[0].d<1.6)base+=0.4;
log('CTR GUESS - about '+base.toFixed(1)+'% on the cover+title as-is (site average 3-5%, 5%+ is a banger)',true);saveE()}
function firstComment(){var x=needClips();if(!x)return;var s=scores();if(!s)return;
var msg='which part hits hardest, 1 or '+(s.cs.length>1?2:1)+'? drop your take';
log('FIRST COMMENT - post: "'+msg+'" (pin it; question comments boost ranking and give you a free re-hook)',true);saveE()}
function blind(){var x=needClips();if(!x)return;var s=scores();if(!s)return;var b=[];
var longest=0,li=0;for(var i=0;i<s.cs.length;i++){if(s.cs[i].d>longest){longest=s.cs[i].d;li=i}}
if(longest>s.t*0.35)b.push('clip '+(li+1)+' is '+Math.round(longest*10)/10+'s ('+Math.round(longest/s.t*100)+'% of the cut), split or speed it up');
if(transTypes()<2)b.push('every transition is the same, one flash or punch would break the monotony');
if(!gradeOn())b.push('no color grade, the cut reads raw next to graded feeds');
if(!b.length)b.push('no obvious blind spots left');
log('BLIND SPOTS (top 3) - '+b.slice(0,3).map(function(r,i){return (i+1)+') '+r}).join(' | '),true);saveE()}
function verdict(){var x=needClips();if(!x)return;var s=scores();if(!s)return;var p=Math.round(s.ret*0.45+s.stl*0.25+s.alg*0.30);
var v=p>=75?'SHIP IT':p>=60?'POLISH FIRST':'FIX FIRST';
var why=p>=75?'panel is behind you, post it':p>=60?'clear the top risk flag and it ships':'clear the top 2 risk flags before posting';
log('VERDICT - '+v+' (panel '+p+'/100): '+why,true);saveE()}
function pitch(){var x=needClips();if(!x)return;var s=scores();if(!s)return;
var mood=styleName();var line=s.cs.length+' scenes, '+Math.round(s.t*10)/10+'s, '+mood+' look';
log('PITCH - "'+line+': watch to the end, the last cut flips it" (one-line pitch to test in the caption)',true);saveE()}
function sheet(){var x=needClips();if(!x)return;var s=scores();if(!s)return;var p=Math.round(s.ret*0.45+s.stl*0.25+s.alg*0.30);
var v=Math.max(1,Math.min(10,Math.round(p/10)));
var L=['REVIEW SHEET','generated '+new Date().toString(),'','panel score: '+p+'/100','virality estimate: '+v+'/10','scenes: '+s.cs.length,'total: '+Math.round(s.t*10)/10+'s','pacing: '+Math.round(s.per10*10)/10+' scenes per 10s','','retention hawk '+s.ret+'/100'];for(var i=0;i<s.rn.length;i++)L.push('  - '+s.rn[i]);
L.push('style critic '+s.stl+'/100');for(i=0;i<s.sn.length;i++)L.push('  - '+s.sn[i]);
L.push('algo brain '+s.alg+'/100');for(i=0;i<s.an.length;i++)L.push('  - '+s.an[i]);
L.push('','verdict: '+(p>=75?'SHIP IT':p>=60?'POLISH FIRST':'FIX FIRST'),'cover title: '+(coverTitle()||'none set'),'');
L.push('clips:');for(i=0;i<s.cs.length;i++)L.push('  '+(i+1)+'. '+Math.round(s.cs[i].d*10)/10+'s @'+(s.cs[i].src.speed||1)+'x '+(s.cs[i].src.label||s.cs[i].src.name||''));
dl(uniqueName('review_sheet','txt'),L.join('\n'));log('review sheet .txt downloaded',true);saveE()}
function mount(){
  if($('f33card'))return;
  var card=document.createElement('div');card.className='card';card.id='f33card';
  var h=document.createElement('h2');h.textContent='REVIEW LAB';card.appendChild(h);
  var r1=mkRow();r1.appendChild(mkBtn('THREE REVIEWERS',reviewers,'1 1 auto','f33b1'));r1.appendChild(mkBtn('PANEL SCORE',panel,'1 1 auto','f33b2'));card.appendChild(r1);
  var r2=mkRow();r2.appendChild(mkBtn('RISK FLAGS',risks,'1 1 auto','f33b3'));r2.appendChild(mkBtn('VIRALITY ESTIMATE',virality,'1 1 auto','f33b4'));card.appendChild(r2);
  var r3=mkRow();r3.appendChild(mkBtn('CTR GUESS',ctr,'1 1 auto','f33b5'));r3.appendChild(mkBtn('FIRST COMMENT',firstComment,'1 1 auto','f33b6'));card.appendChild(r3);
  var r4=mkRow();r4.appendChild(mkBtn('BLIND SPOTS',blind,'1 1 auto','f33b7'));r4.appendChild(mkBtn('VERDICT',verdict,'1 1 auto','f33b8'));card.appendChild(r4);
  var r5=mkRow();r5.appendChild(mkBtn('ONE-LINE PITCH',pitch,'1 1 auto','f33b9'));r5.appendChild(mkBtn('REVIEW SHEET .TXT',sheet,'1 1 auto','f33b10'));card.appendChild(r5);
  var note=document.createElement('div');note.className='note';note.id='f33note';note.textContent='review lab is a fake editor panel: three reviewers (retention hawk, style critic, algo brain) score the cut from its own data, the panel score weights them, risk flags rank what to fix, virality and ctr estimate the post, first comment drafts the pinned comment, blind spots catch what you stopped seeing, the verdict says ship or fix, the pitch drafts the hook line, and the sheet downloads it all.';
  card.appendChild(note);
  var hs=document.querySelectorAll('.card h2'),anchor=null;
  for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('STORY LAB')>=0){anchor=hs[i].parentElement;break}}
  if(anchor){if(anchor.nextSibling)anchor.parentElement.insertBefore(card,anchor.nextSibling);else anchor.parentElement.appendChild(card)}
  else{var ap=document.querySelector('#panelcol')||document.body;ap.appendChild(card)}
  log('review lab live - three reviewers, panel score, risk flags, virality estimate, ctr guess, first comment, blind spots, verdict, one-line pitch, review sheet');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
