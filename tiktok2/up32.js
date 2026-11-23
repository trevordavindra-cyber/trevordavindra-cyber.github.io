'use strict';
// up32.js - PHASE 26 STORY LAB (Nov 23 2026)
// story arc check, beat sheet, tension curve, payoff check, loop story check,
// scene count grade, hero clip finder, story fix list, alternate cut, story report
(function(){
if(window.__tk2up32)return;window.__tk2up32=1;
function $(id){return document.getElementById(id)}
function mkBtn(t,fn,fl,id){var b=document.createElement('button');b.className='btn';b.textContent=t;b.style.flex=fl||'0 0 auto';if(id)b.id=id;b.onclick=fn;return b}
function mkRow(gap){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap=(gap||6)+'px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function saveE(){try{if(typeof save==='function')save()}catch(e){}}
function S(){try{return window.S||window.state||window.APPSTATE||{}}catch(e){return {}}}
function clipDur(c){var st=parseFloat(c.start),en=parseFloat(c.end);if(!isFinite(st)||!isFinite(en))return 0;return Math.max(0,(en-st))/(c.speed||1)}
function clips(){var s=S();var a=(s&&s.clips)||[];var out=[],t=0;for(var i=0;i<a.length;i++){var d=clipDur(a[i]);if(d>0.05){t+=d;out.push({c:a[i],d:d,src:a[i],st:t-d})}}return out}
function total(){var a=clips(),t=0;for(var i=0;i<a.length;i++)t+=a[i].d;return t}
function needClips(){var a=clips();if(!a.length){log('story lab: add clips to the timeline first');return null}return a}
function dl(name,text){try{var b=new Blob([text],{type:'text/plain'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a)},300);return true}catch(e){log('download failed: '+e.message);return false}}
function uniqueName(base,ext){var n=base+'.'+ext;try{var t=new Date();var s=(''+t.getHours()).padStart(2,'0')+(''+t.getMinutes()).padStart(2,'0')+(''+t.getSeconds()).padStart(2,'0');n=base+'_'+s+'.'+ext}catch(e){}return n}
// energy model: cut density + speed + short-clip boost; positions are absolute
function segEnergy(cs,from,to){var e=0;for(var i=0;i<cs.length;i++){var seg=cs[i];if(seg.d<=0)continue;var s0=seg.st,s1=seg.st+seg.d;var hit=Math.max(0,Math.min(s1,to)-Math.max(s0,from));if(hit<=0)continue;var local=(seg.d<1.2?1.25:seg.d<2?1.1:seg.d<3.5?1:0.85);var sp=(seg.src.speed||1);e+=hit*(0.6+0.5*Math.min(2.5,sp))*local}return e}
function arcCheck(){var cs=needClips();if(!cs)return;var t=total();if(t<=0){log('story lab: timeline has no length');return}var a1=0,a2=0,a3=0,acc=0;for(var i=0;i<cs.length;i++){var st=acc,en=acc+cs[i].d;acc=en;if(st<t*0.35)a1+=Math.min(cs[i].d,t*0.35-st);if(en>t*0.35&&st<t*0.7)a2+=Math.min(en,t*0.7)-Math.max(st,t*0.35);if(en>t*0.7)a3+=en-Math.max(st,t*0.7)}
var pct=Math.round(a1/t*100);var grade=pct<=35?'good arc shape':'slow open: act 1 is '+pct+'% of the cut';
log('STORY ARC - act1 '+Math.round(a1*10)/10+'s ('+pct+'%), act2 '+Math.round(a2*10)/10+'s, act3 '+Math.round(a3*10)/10+'s of '+Math.round(t*10)/10+'s total: '+grade,true);saveE()}
function beatSheet(){var cs=needClips();if(!cs)return;var t=total();if(t<=0)return;var names=['the hook','the setup','the promise','the turn','the build','the peak','the payoff','the button'];var rows=[];for(var i=0;i<8;i++){var a=t*i/8,b=t*(i+1)/8;var e=segEnergy(cs,a,b);rows.push((i+1)+'. '+names[i]+' ('+Math.round(a*10)/10+'s-'+Math.round(b*10)/10+'s, energy '+Math.round(e*10)/10+')')}
log('BEAT SHEET - '+rows.join(' | '),true);saveE()}
function tensionCurve(){var cs=needClips();if(!cs)return;var t=total();if(t<=0)return;var cv=$('f32cv');if(!cv){cv=document.createElement('canvas');cv.id='f32cv';cv.width=480;cv.height=120;cv.style.cssText='display:block;margin:8px auto;max-width:100%;border:1px solid rgba(255,255,255,.15)';var card=$('f32card');if(card)card.appendChild(cv)}
var ctx=null;try{ctx=cv.getContext('2d')}catch(e){}
if(!ctx){log('story lab: canvas not available in this browser');return}
var N=60,bins=[],max=0;for(var i=0;i<N;i++){var a=t*i/N,b=t*(i+1)/N;var e=segEnergy(cs,a,b);bins.push(e);if(e>max)max=e}
if(max<=0)max=1;ctx.clearRect(0,0,480,120);ctx.strokeStyle='#0ff';ctx.lineWidth=2;ctx.beginPath();for(var j=0;j<N;j++){var x=j/(N-1)*470+5,y=115-(bins[j]/max)*105;if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.stroke();ctx.fillStyle='rgba(0,255,255,.08)';ctx.lineTo(475,115);ctx.lineTo(5,115);ctx.closePath();ctx.fill();
var peak=0,pi=0;for(var k=0;k<N;k++){if(bins[k]>peak){peak=bins[k];pi=k}}
log('TENSION CURVE drawn - peak at '+(Math.round(pi/N*100))+'% through the cut ('+Math.round(t*pi/N*10)/10+'s in). want the peak at 60-80%',true);saveE()}
function payoff(){var cs=needClips();if(!cs)return;var t=total();if(t<=0)return;var e0=segEnergy(cs,0,t*0.2),e1=segEnergy(cs,t*0.8,t);var r=e0>0?e1/e0:0;var verdict=r>=1.15?'strong payoff, ends bigger than it opens':r>=0.85?'even energy, consider a bigger ending push':'weak payoff, the ending is flatter than the opening';
log('PAYOFF CHECK - first 20% energy '+Math.round(e0*10)/10+', last 20% '+Math.round(e1*10)/10+' (ratio '+Math.round(r*100)/100+'): '+verdict,true);saveE()}
function loopCheck(){var cs=needClips();if(!cs)return;if(cs.length<2){log('LOOP CHECK - need 2+ clips to judge a loop');return}var first=cs[0],last=cs[cs.length-1];var d=Math.abs(first.d-last.d);var sd=(first.src.speed||1),sl=(last.src.speed||1);var sp=Math.abs(sd-sl);var score=100;score-=Math.min(40,d*40);score-=Math.min(35,sp*35);var sameLen=d<0.3,sameSp=sp<0.15;score=Math.max(0,Math.round(score));
log('LOOP CHECK - opening '+Math.round(first.d*10)/10+'s @'+sd+'x vs ending '+Math.round(last.d*10)/10+'s @'+sl+'x, loop score '+score+'/100'+(sameLen&&sameSp?' - loops clean':sameLen?' - lengths match, speeds differ':' - consider matching the opening clip length and speed'),true);saveE()}
function sceneGrade(){var cs=needClips();if(!cs)return;var t=total();if(t<=0)return;var per10=cs.length/Math.max(0.1,t)*10;var verdict=per10>=3&&per10<=8?'in the 3-8 scenes per 10s sweet spot':per10<3?'too slow for tiktok pacing, tighten or speed up clips':'very fast, risk of feeling chaotic';
log('SCENE GRADE - '+cs.length+' scenes over '+Math.round(t*10)/10+'s = '+Math.round(per10*10)/10+' scenes per 10s: '+verdict,true);saveE()}
function hero(){var cs=needClips();if(!cs)return;var best=-1,bi=-1;for(var i=0;i<cs.length;i++){var adj=(i>0?1:0)+(i<cs.length-1?1:0);var sc=cs[i].d*0.3+adj*2+Math.min(3,(cs[i].src.speed||1))*1.5;if(sc>best){best=sc;bi=i}}
if(bi<0){log('hero clip: nothing scored');return}var h=cs[bi];log('HERO CLIP - clip '+(bi+1)+' ('+Math.round(h.d*10)/10+'s @'+(h.src.speed||1)+'x, '+(h.src.label||h.src.name||'clip '+(bi+1))+') is the protagonist: most adjacent cuts + solid length, build the hook around it',true);saveE()}
function fixList(){var cs=clips();if(!cs||!cs.length){log('story lab: add clips first');return}var t=total(),fix=[];
if(t<=0){log('story lab: timeline has no length');return}
var a1=0,acc=0;for(var i=0;i<cs.length;i++){var st=acc;acc+=cs[i].d;if(st<t*0.35)a1+=Math.min(cs[i].d,t*0.35-st)}var pct=Math.round(a1/t*100);
if(pct>35)fix.push('act 1 is '+pct+'% of the cut - trim the open so the turn lands by 35%');
var e0=segEnergy(cs,0,t*0.2),e1=segEnergy(cs,t*0.8,t);var r=e0>0?e1/e0:1;if(r<0.85)fix.push('ending energy is only '+Math.round(r*100)/100+'x the opening - push the last 20% (speed up, tighter cuts)');
var per10=cs.length/Math.max(0.1,t)*10;if(per10<3)fix.push('pacing is slow ('+Math.round(per10*10)/10+' scenes per 10s) - cut the longest clip by 20%');
if(!fix.length)fix.push('structure is solid - tighten the opening frame and confirm the hook caption');
log('STORY FIX LIST (top 3) - '+fix.slice(0,3).map(function(x,i){return (i+1)+') '+x}).join(' | '),true);saveE()}
function altCut(){var cs=clips();if(!cs||cs.length<3){log('ALTERNATE CUT - need 3+ clips to suggest a reorder');return}var list=[];for(var i=0;i<cs.length;i++){var adj=(i>0?1:0)+(i<cs.length-1?1:0);list.push({i:i,d:cs[i].d,adj:adj,sp:cs[i].src.speed||1})}
list.sort(function(a,b){return (b.d*0.3+b.adj*2+b.sp*1.5)-(a.d*0.3+a.adj*2+a.sp*1.5)});
var heroIdx=list[0].i,weakIdx=list[list.length-1].i;
if(heroIdx!==0){log('ALTERNATE CUT - move clip '+(heroIdx+1)+' (strongest: '+Math.round(cs[heroIdx].d*10)/10+'s @'+list[0].sp+'x) to the front as the hook, drop clip '+(weakIdx+1)+' to last or cut it, keep the rest in order',true)}else{log('ALTERNATE CUT - strongest clip is already first; instead drop clip '+(weakIdx+1)+' ('+Math.round(cs[weakIdx].d*10)/10+'s) to last or cut it for a tighter arc',true)}saveE()}
function report(){var cs=clips();if(!cs||!cs.length){log('story report: add clips first');return}var t=total();if(t<=0){log('story report: timeline has no length');return}
var L=['STORY REPORT','generated '+new Date().toString(),'','scenes: '+cs.length,'total: '+Math.round(t*10)/10+'s','scenes per 10s: '+Math.round(cs.length/Math.max(0.1,t)*10*10)/10,''];
var a1=0,acc=0;for(var i=0;i<cs.length;i++){var st=acc;acc+=cs[i].d;if(st<t*0.35)a1+=Math.min(cs[i].d,t*0.35-st)}
L.push('act1 share: '+Math.round(a1/t*100)+'% (want 35% or less)');L.push('first20% energy: '+Math.round(segEnergy(cs,0,t*0.2)*10)/10);L.push('last20% energy: '+Math.round(segEnergy(cs,t*0.8,t)*10)/10);L.push('');L.push('clips:');for(var j=0;j<cs.length;j++){L.push('  '+(j+1)+'. '+Math.round(cs[j].d*10)/10+'s @'+(cs[j].src.speed||1)+'x '+(cs[j].src.label||cs[j].src.name||''))}
dl(uniqueName('story_report','txt'),L.join('\n'));log('story report .txt downloaded',true);saveE()}
function mount(){
  if($('f32card'))return;
  var card=document.createElement('div');card.className='card';card.id='f32card';
  var h=document.createElement('h2');h.textContent='STORY LAB';card.appendChild(h);
  var r1=mkRow();r1.appendChild(mkBtn('STORY ARC CHECK',arcCheck,'1 1 auto','f32b1'));r1.appendChild(mkBtn('BEAT SHEET',beatSheet,'1 1 auto','f32b2'));card.appendChild(r1);
  var r2=mkRow();r2.appendChild(mkBtn('TENSION CURVE',tensionCurve,'1 1 auto','f32b3'));r2.appendChild(mkBtn('PAYOFF CHECK',payoff,'1 1 auto','f32b4'));card.appendChild(r2);
  var r3=mkRow();r3.appendChild(mkBtn('LOOP CHECK',loopCheck,'1 1 auto','f32b5'));r3.appendChild(mkBtn('SCENE GRADE',sceneGrade,'1 1 auto','f32b6'));card.appendChild(r3);
  var r4=mkRow();r4.appendChild(mkBtn('HERO CLIP',hero,'1 1 auto','f32b7'));r4.appendChild(mkBtn('STORY FIX LIST',fixList,'1 1 auto','f32b8'));card.appendChild(r4);
  var r5=mkRow();r5.appendChild(mkBtn('ALTERNATE CUT',altCut,'1 1 auto','f32b9'));r5.appendChild(mkBtn('STORY REPORT .TXT',report,'1 1 auto','f32b10'));card.appendChild(r5);
  var note=document.createElement('div');note.className='note';note.id='f32note';note.textContent='story lab reads the edit like a story: arc check maps the three acts, beat sheet names 8 beats, tension curve graphs the energy, payoff check grades the ending against the opening, loop check scores the loopback, scene grade judges pacing, hero clip finds the protagonist, the fix list ranks what to change, alternate cut suggests one reorder, and the report downloads it all.';
  card.appendChild(note);
  var hs=document.querySelectorAll('.card h2'),anchor=null;
  for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('COVER LAB')>=0){anchor=hs[i].parentElement;break}}
  if(anchor){if(anchor.nextSibling)anchor.parentElement.insertBefore(card,anchor.nextSibling);else anchor.parentElement.appendChild(card)}
  else{var ap=document.querySelector('#panelcol')||document.body;ap.appendChild(card)}
  log('story lab live - story arc check, beat sheet, tension curve, payoff check, loop check, scene grade, hero clip, story fix list, alternate cut, story report');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
