'use strict';
// up36.js - PHASE 30 GROWTH LAB (Nov 23 2026)
// watch time estimate, retention projection, replay bait, cta check, pin comment,
// bio check, posting cadence, audience split, signal list, growth report
(function(){
if(window.__tk2up36){return}window.__tk2up36=1;
function $(id){return document.getElementById(id)}
function mkBtn(t,fn,id){var b=document.createElement('button');b.className='btn';b.textContent=t;if(id){b.id=id}b.onclick=fn;return b}
function mkRow(){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap='6px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function saveE(){try{if(typeof save==='function'){save()}}catch(e){}}
function S(){try{return window.S||window.state||window.APPSTATE||{}}catch(e){return {}}}
function clipDur(c){var st=parseFloat(c.start),en=parseFloat(c.end);if(!isFinite(st)||!isFinite(en)){return 0}return Math.max(0,(en-st))/(c.speed||1)}
function clips(){var s=S();var a=(s&&s.clips)||[];var out=[],t=0;for(var i=0;i<a.length;i++){var d=clipDur(a[i]);if(d>0.05){t+=d;out.push({c:a[i],d:d,i:i,st:t-d})}}return out}
function total(){var a=clips(),t=0;for(var i=0;i<a.length;i++){t+=a[i].d}return t}
function needClips(){var a=clips();if(!a.length){log('growth lab: add clips to the timeline first');return null}return a}
function trOf(c){return (c.transition||c.trans||'cut')}
function metrics(){var cs=clips();if(!cs.length){return null}var t=total();if(t<=0){return null}
 var per10=cs.length/Math.max(0.1,t)*10;var durs=[],shakes=0,ramps=0,reused=0,seenSrc={};
 for(var i=0;i<cs.length;i++){var c=cs[i].c;durs.push(cs[i].d);if(trOf(c)==='shake'){shakes++}if(Math.abs((c.speed||1)-1)>=0.15){ramps++}
  var src=(c.srcName||c.name||c.src||'')+'';
  if(src&&seenSrc[src]){reused++}if(src){seenSrc[src]=1}}
 var avg=0;for(var k=0;k<durs.length;k++){avg+=durs[k]}avg=avg/durs.length;
 var st=S();var caps=(st.captions||[]);var capEarly=0,cta=0;
 var ctaWords=['follow','comment','part 2','link','save this','share','tag','duet','try this','watch till'];
 for(var j=0;j<caps.length;j++){var t0=parseFloat(caps[j].t0);if(isFinite(t0)&&t0<2){capEarly++}
  var tx=((caps[j].text||caps[j].t||'')+'').toLowerCase();for(var w=0;w<ctaWords.length;w++){if(tx.indexOf(ctaWords[w])>=0){cta++}}}
 var style=((st.style||st.genre||(cs[0].c?cs[0].c.style:'')||(cs[0].c?cs[0].c.label:'')||'')+'').toUpperCase();
 return {cs:cs,t:t,per10:per10,avg:avg,shakes:shakes,ramps:ramps,opens:cs[0].d,reused:reused,caps:caps,capsN:caps.length,capEarly:capEarly,cta:cta,style:style};
}
function hookFactor(m){var f=0.45;if(m.opens<=2.5){f+=0.15}f-=Math.min(0.12,m.per10*0.012);if(m.capEarly>0){f+=0.05}if(m.t>60){f-=0.05}if(f<0.3){f=0.3}if(f>0.75){f=0.75}return f}
function watchEst(){var x=needClips();if(!x){return}var m=metrics();if(!m){return}
 var f=hookFactor(m);var est=m.t*f;
 log('WATCH TIME EST - model projects an average watch of about '+Math.round(est*10)/10+'s of your '+Math.round(m.t*10)/10+'s ('+Math.round(f*100)+'% completion) - open under 2.5s: '+(m.opens<=2.5?'yes':'no')+', captions in the first 2s: '+(m.capEarly>0?'yes':'no')+', cut churn: '+Math.round(m.per10*10)/10+'/10s',true);saveE()}
function retentionProj(){var x=needClips();if(!x){return}var m=metrics();if(!m){return}
 var f=hookFactor(m);var p1=100,p3=Math.round(100*(m.opens<=2.5?0.85:0.72));
 var ph=Math.round(100*Math.max(0.25,f+0.18));var pe=Math.round(100*Math.max(0.12,f-0.06+(m.t<=30?0.08:0)));
 log('RETENTION PROJ - projected viewers at: 1s '+p1+'% / 3s '+p3+'% / midpoint '+ph+'% / end '+pe+'% (cut density '+Math.round(m.per10*10)/10+'/10s, length '+Math.round(m.t*10)/10+'s)',true);saveE()}
function replayBait(){var x=needClips();if(!x){return}var m=metrics();if(!m){return}
 var first=m.cs[0].c,last=m.cs[m.cs.length-1].c;
 var fs=(first.srcName||first.name||first.src||'')+'',ls=(last.srcName||last.name||last.src||'')+'';
 var loop=fs&&ls&&fs===ls;
 var cleanEnd=(trOf(last)!=='shake');
 var tips=[];
 if(!loop){tips.push('end on the same footage your edit opens with so the loop is invisible')}
 if(!cleanEnd){tips.push('swap the camera-shake on the last clip for a plain cut - shakes read as an ending')}
 if(m.t>30){tips.push('under 30s doubles loop replays; consider a tighter cut')}
 log('REPLAY BAIT - '+(tips.length?tips.join(' | '):'already loops clean: same open/end footage, clean last cut, short runtime'),true);saveE()}
function ctaCheck(){var x=needClips();if(!x){return}var m=metrics();if(!m){return}
 if(m.cta>0){log('CTA CHECK - '+m.cta+' call-to-action line(s) already in the captions - good, keep one before the final cut',true)}
 else{log('CTA CHECK - no call to action found. add one caption like "part 2 tomorrow" or "save this for later" in the last 5s',true)}
 saveE()}
function pinComment(){var x=needClips();if(!x){return}var m=metrics();if(!m){return}
 var st=S();var genre=((st.genre||m.style||'edit')+'').toLowerCase();
 var q=m.per10>=7?'phonk or lofi - which version should i drop next?':'what should i cut next?';
 var line='made this '+genre+' edit - '+q+' (part 2 if this hits 1k)';
 try{navigator.clipboard.writeText(line)}catch(e){}
 log('PIN COMMENT (copied) - '+line,true);saveE()}
function bioCheck(){var x=needClips();if(!x){return}
 var st=S();var h=(st.handle||st.watermark||st.brand||st.username||'')+'';
 if(h){log('BIO CHECK - watermark handle "'+h+'" is set on this project - make sure the bio link and pin comment use the same name',true)}
 else{log('BIO CHECK - no watermark handle saved in the project. set one in the branding/watermark box so viewers can find the account',true)}
 saveE()}
function cadence(){var x=needClips();if(!x){return}var m=metrics();if(!m){return}
 var plan='';
 if(m.t<=20){plan='short cut: 1 post a day, 6-10pm, 5 days a week - short runtimes reward volume'}
 else if(m.t<=45){plan='mid cut: 4 posts a week (Mon Tue Thu Fri) at 7pm, batch render 3 variations per session'}
 else{plan='long cut: 3 posts a week (Mon Wed Sat) at 7pm, spend the off days cutting the next one'}
 log('CADENCE - '+plan+' - keep every post in the same format so the series reads as one',true);saveE()}
function audienceSplit(){var x=needClips();if(!x){return}var m=metrics();if(!m){return}
 var r1=Math.round((m.t<=60?100:60+Math.max(0,80-m.t)));var r2=Math.round((m.t<=90?95:70));
 var r3=Math.round((m.t<=60&&m.per10<=8?92:70));
 log('AUDIENCE SPLIT - platform fit: tiktok '+r1+'% / reels '+r2+'% / shorts '+r3+'% - '+(m.t>60?'trim under 60s to open all three':'length fits all three feeds'),true);saveE()}
function signalList(){var x=needClips();if(!x){return}var m=metrics();if(!m){return}
 var rows=[];
 rows.push((m.opens<=2.5?'PASS':'FIX')+' hook under 2.5s (open '+Math.round(m.opens*10)/10+'s)');
 rows.push((m.capEarly>0?'PASS':'FIX')+' caption in first 2s');
 rows.push((m.per10>=3&&m.per10<=9?'PASS':'FIX')+' cut density 3-9/10s ('+Math.round(m.per10*10)/10+')');
 rows.push((m.cta>0?'PASS':'FIX')+' call to action present');
 rows.push((m.reused===0?'PASS':'FIX')+' no repeated source footage ('+m.reused+' reused)');
 rows.push((m.t<=60?'PASS':'FIX')+' runtime under 60s ('+Math.round(m.t*10)/10+'s)');
 var np=0;for(var i=0;i<rows.length;i++){if(rows[i].indexOf('PASS')===0){np++}}
 log('SIGNAL LIST - '+np+'/'+rows.length+' algorithm signals green: '+rows.join(' | '),true);saveE()}
function growthReport(){var x=needClips();if(!x){return}var m=metrics();if(!m){return}
 var f=hookFactor(m);var L=['GROWTH REPORT','generated '+new Date().toString(),'','runtime '+Math.round(m.t*10)/10+'s, '+m.cs.length+' clips, '+Math.round(m.per10*10)/10+' cuts/10s','watch model: '+Math.round(m.t*f*10)/10+'s avg watch ('+Math.round(f*100)+'% completion)','hook open '+Math.round(m.opens*10)/10+'s, captions '+m.capsN+' ('+m.capEarly+' early), cta lines '+m.cta,'reused footage: '+m.reused,'style: '+(m.style||'not set'),'','signals and cadence are in the log - run SIGNAL LIST and CADENCE before exporting','','clips:'];
 for(var i=0;i<m.cs.length;i++){L.push('  '+(i+1)+'. '+Math.round(m.cs[i].d*10)/10+'s trans '+trOf(m.cs[i].c)+' speed '+(m.cs[i].c.speed||1)+'x')}
 try{var blob=new Blob([L.join('\n')],{type:'text/plain'});var el=document.createElement('a');el.href=URL.createObjectURL(blob);el.download='growth_report.txt';document.body.appendChild(el);el.click();setTimeout(function(){document.body.removeChild(el)},300)}catch(e){log('download failed: '+e.message);return}
 log('growth report .txt downloaded',true);saveE()}
function mount(){
  if($('f36card')){return}
  var card=document.createElement('div');card.className='card';card.id='f36card';
  var h=document.createElement('h2');h.textContent='GROWTH LAB';card.appendChild(h);
  var r1=mkRow();r1.appendChild(mkBtn('WATCH TIME EST',watchEst,'f36b1'));r1.appendChild(mkBtn('RETENTION PROJ',retentionProj,'f36b2'));card.appendChild(r1);
  var r2=mkRow();r2.appendChild(mkBtn('REPLAY BAIT',replayBait,'f36b3'));r2.appendChild(mkBtn('CTA CHECK',ctaCheck,'f36b4'));card.appendChild(r2);
  var r3=mkRow();r3.appendChild(mkBtn('PIN COMMENT',pinComment,'f36b5'));r3.appendChild(mkBtn('BIO CHECK',bioCheck,'f36b6'));card.appendChild(r3);
  var r4=mkRow();r4.appendChild(mkBtn('CADENCE',cadence,'f36b7'));r4.appendChild(mkBtn('AUDIENCE SPLIT',audienceSplit,'f36b8'));card.appendChild(r4);
  var r5=mkRow();r5.appendChild(mkBtn('SIGNAL LIST',signalList,'f36b9'));r5.appendChild(mkBtn('GROWTH REPORT .TXT',growthReport,'f36b10'));card.appendChild(r5);
  var note=document.createElement('div');note.className='note';note.id='f36note';note.textContent='growth lab models the audience: it estimates average watch time and projects a retention curve, checks the loop seam for replays, audits calls to action, drafts the pinned comment, checks the handle, plans the posting cadence, splits fit across tiktok/reels/shorts, runs the algorithm signal checklist and exports the report.';
  card.appendChild(note);
  var hs=document.querySelectorAll('.card h2'),anchor=null;
  for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('TREND LAB')>=0){anchor=hs[i].parentElement;break}}
  if(anchor){if(anchor.nextSibling){anchor.parentElement.insertBefore(card,anchor.nextSibling)}else{anchor.parentElement.appendChild(card)}}
  else{var ap=document.querySelector('#panelcol')||document.body;ap.appendChild(card)}
  log('growth lab live - watch time est, retention proj, replay bait, cta check, pin comment, bio check, cadence, audience split, signal list, growth report');
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',mount)}else{mount()}
})();