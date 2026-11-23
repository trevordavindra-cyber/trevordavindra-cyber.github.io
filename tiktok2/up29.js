'use strict';
// up29.js — PHASE 23 RETENTION LAB (Nov 23 2026)
// modeled watch-through, hook score, drop-off hotspots, rewatch loop check,
// pacing score, caption density, cta timing, retention strip, fix list, report
(function(){
if(window.__tk2up29)return;window.__tk2up29=1;
function $(id){return document.getElementById(id)}
function mkBtn(t,fn,fl,id){var b=document.createElement('button');b.className='btn';b.textContent=t;b.style.flex=fl||'0 0 auto';if(id)b.id=id;b.onclick=fn;return b}
function mkRow(gap){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap=(gap||6)+'px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function saveE(){try{if(typeof save==='function')save()}catch(e){}}
function clipDur(c){return (c.end-c.start)/(c.speed||1)}
function totalDur(){return S.clips.reduce(function(a,c){return a+clipDur(c)},0)}
function cutTimes(){
  var t=[],acc=0;
  for(var i=0;i<S.clips.length;i++){acc+=clipDur(S.clips[i]);if(i<S.clips.length-1)t.push(+acc.toFixed(2))}
  return t;
}
function dl(name,text){try{var b=new Blob([text],{type:'text/plain'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a)},300);return true}catch(e){log('download failed: '+e.message);return false}}
if(!S.eco)S.eco={};var E=S.eco;
if(!E.f29)E.f29={last:{},reports:0};

// modeled retention: viewer keeps watching while cuts keep coming; long unbroken
// stretches bleed audience. hooks decay if the first 1.5s is one long clip.
function retentionCurve(){
  var tot=totalDur();if(!tot)return null;
  var cuts=cutTimes();
  var seg=0.5,pts=[],k=0;
  var hold=0.97,minHold=0.35;
  var pace=cuts.length/Math.max(tot,0.1)*10; // cuts per 10s
  var hookBoost=pace>=8?0.02:0;
  for(var t=0;t<=tot;t+=seg){
    // gap since last cut
    var last=0;for(var i=0;i<cuts.length;i++){if(cuts[i]<=t)last=cuts[i]}
    var gap=t-last;
    var decay=Math.pow(0.985,Math.max(0,gap-1.2)*2);
    var keep=Math.max(minHold,hold*decay+hookBoost*Math.min(t,2));
    if(t>0)keep=Math.min(keep,pts[pts.length-1].v);
    else keep=Math.min(keep,1);
    pts.push({t:+t.toFixed(1),v:+keep.toFixed(3)});
  }
  var drops=[];
  for(var j=1;j<pts.length;j++){
    var d=pts[j-1].v-pts[j].v;
    if(d>0.03)drops.push({at:pts[j].t,loss:+d.toFixed(3)});
  }
  drops.sort(function(a,b){return b.loss-a.loss});
  return {tot:+tot.toFixed(1),pts:pts,cuts:cuts,pace:+pace.toFixed(1),drops:drops.slice(0,5),
    endKeep:+pts[pts.length-1].v.toFixed(2),avg:+(pts.reduce(function(a,p){return a+p.v},0)/pts.length).toFixed(2)};
}
function hookScore(){
  if(!S.clips.length){log('hook score: nothing on the timeline');return null}
  var first=clipDur(S.clips[0]);
  var capIn2=S.captions.filter(function(c){return c.t0<2}).length;
  var score=100;
  if(first>2.0)score-=35;else if(first>1.2)score-=20;
  if(!capIn2)score-=30;
  var l1=(S.clips[0].label||'').trim();
  if(!l1)score-=10;
  if(!((S.clips[0].tag||'').trim()))score-=5;
  score=Math.max(5,Math.min(100,score));
  var verdict=score>=75?'strong hook':score>=50?'ok, tunable':'weak — first 2s needs work';
  var out={score:score,verdict:verdict,first:first.toFixed(2),capIn2:capIn2,label:!!l1};
  log('HOOK SCORE '+score+'/100 ('+verdict+') — opener '+first.toFixed(1)+'s'+(capIn2?' + caption in first 2s':', no caption in first 2s')+(l1?' + label':'')+(first>2?' — cut the opener under 2s':''),score<50);
  E.f29.last.hook=out;saveE();return out;
}
function hotspots(){
  var r=retentionCurve();
  if(!r){log('drop-off hotspots: nothing on the timeline');return}
  if(!r.drops.length){log('drop-off hotspots: model shows no big bleed points — cuts keep the audience');return}
  var msg=r.drops.map(function(d,i){return '#'+(i+1)+' at '+d.at+'s (-'+Math.round(d.loss*100)+'% modeled)'}).join(' | ');
  log('DROP-OFF HOTSPOTS — '+msg,true);
  log('fixes: '+r.drops.slice(0,3).map(function(d){return 'add a cut, style change or caption pop near '+d.at+'s'}).join('; '));
  E.f29.last.drops=r.drops;saveE();
}
function loopCheck(){
  if(S.clips.length<2){log('rewind loop: need 2+ clips');return}
  var first=S.clips[0],last=S.clips[S.clips.length-1];
  var same=(first.style||S.style)===(last.style||S.style);
  var capFirst=S.captions.length&&S.captions[0].t0<1.5;
  var tot=totalDur();
  var pts=0;
  if(same)pts+=1;
  if(tot<=15)pts+=1;
  if(!capFirst)pts+=1;
  if(clipDur(last)<=1.6)pts+=1;
  var verdict=pts>=3?'loops well — watch again is likely':pts>=2?'decent loop potential':'one-way watch — ending does not invite a rewatch';
  log('REWIND LOOP — '+pts+'/4 loop signals: '+(same?'style matches opener':'style mismatch')+', '+(tot<=15?'short ('+tot.toFixed(1)+'s)':'long ('+tot.toFixed(1)+'s)')+', '+(capFirst?'spoiler caption up front':'clean opening')+', '+(clipDur(last)<=1.6?'snappy ending':'slow ending')+' — '+verdict,true);
  E.f29.last.loop={pts:pts,verdict:verdict};saveE();
}
function pacingScore(){
  var r=retentionCurve();
  if(!r){log('pacing score: nothing on the timeline');return}
  var p=r.pace,verdict;
  if(p>=6&&p<=10)verdict='in the sweet spot (6-10 cuts / 10s)';
  else if(p<6)verdict='slow — viewers drift during long clips';
  else verdict='hyper — fine for phonk, risky elsewhere';
  log('PACING SCORE — '+p+' cuts / 10s, '+verdict,true);
  if(p<6){var longest=0,li=-1;S.clips.forEach(function(c,i){var d=clipDur(c);if(d>longest){longest=d;li=i}});
    log('fastest fix: clip '+(li+1)+' runs '+longest.toFixed(1)+'s — speed it up or split it')}
  E.f29.last.pace=p;saveE();
}
function capDensity(){
  if(!S.captions.length){log('caption density: no captions yet');return}
  var bad=[],tot=0;
  S.captions.forEach(function(c){
    var d=(c.t1-c.t0)||0.01;var cps=(c.text||'').length/d;tot+=cps;
    if(cps>18)bad.push({t0:c.t0,cps:+cps.toFixed(1),txt:(c.text||'').slice(0,24)});
  });
  if(!bad.length)log('caption density — all '+S.captions.length+' captions read comfortably (avg '+(tot/S.captions.length).toFixed(1)+' chars/s, under the 18/s wall)');
  else log('CAPTION DENSITY — '+bad.length+' of '+S.captions.length+' too dense to read: '+bad.slice(0,3).map(function(b){return b.t0+'s ('+b.cps+'/s) "'+b.txt+'"'}).join(' | ')+' — split them or shorten the text',true);
  E.f29.last.capBad=bad.length;saveE();
}
function ctaTiming(){
  var r=retentionCurve();
  if(!r){log('cta timing: nothing on the timeline');return}
  var slot=null;
  for(var i=0;i<r.pts.length;i++){if(r.pts[i].v<0.75){slot=r.pts[i].t;break}}
  var capCount=S.captions.length;
  if(!slot)slot=+(r.tot*0.8).toFixed(1);
  log('CTA TIMING — modeled hold dips under 75% around '+slot+'s — put the loop/CTA line there'+(capCount?' (after caption '+capCount+')':' (no captions yet — the CTA would be your first)'),true);
  E.f29.last.cta=slot;saveE();
}
function strip(){
  var r=retentionCurve();
  if(!r){log('retention strip: nothing on the timeline');return}
  var c=document.createElement('canvas');c.width=640;c.height=46;c.style.width='100%';c.style.marginTop='6px';
  var x=c.getContext('2d');x.fillStyle='#04050a';x.fillRect(0,0,640,46);
  var n=r.pts.length;
  for(var i=0;i<n;i++){
    var v=r.pts[i].v,col=v>0.8?'#00e5ff':v>0.6?'#ffc933':'#ff2d55';
    x.fillStyle=col;x.fillRect(i*(640/n),46-(v*40),640/n-0.5,v*40);
  }
  x.fillStyle='#8fa3b8';x.font='9px monospace';x.fillText('0s',2,10);x.fillText(r.tot+'s',616,10);x.fillText('modeled hold — cyan strong / yellow slipping / red bleed',128,10);
  var old=$('f29strip');if(old&&old.parentElement)old.parentElement.removeChild(old);
  c.id='f29strip';
  var card=$('f29card')||document.body;card.appendChild(c);
  log('retention strip drawn — '+n+' points, ends at '+Math.round(r.endKeep*100)+'% modeled hold');
}
function fixList(){
  var r=retentionCurve();
  if(!r){log('fix list: nothing on the timeline');return}
  var fixes=[];
  var first=clipDur(S.clips[0]||{end:0,start:0});
  if(!S.captions.some(function(c){return c.t0<2}))fixes.push('no caption in the first 2s — add a hook line');
  if(first>2)fixes.push('opener runs '+first.toFixed(1)+'s — split or speed it under 2s');
  if(r.pace<6)fixes.push('pacing '+r.pace+' cuts/10s — too slow, trim the fat');
  if(r.pace>12)fixes.push('pacing '+r.pace+' cuts/10s — frantic, let 1-2 clips breathe');
  if(r.drops.length&&r.drops[0].loss>0.04)fixes.push('biggest modeled bleed at '+r.drops[0].at+'s — cut/style change there');
  if(totalDur()>60)fixes.push('length '+totalDur().toFixed(0)+'s — shorts this long need a mid re-hook');
  if(!fixes.length)fixes.push('nothing critical — post it');
  log('FIX LIST (top 3) — '+fixes.slice(0,3).map(function(f,i){return (i+1)+') '+f}).join('  '),true);
  E.f29.last.fixes=fixes.slice(0,3);saveE();
}
function report(){
  var r=retentionCurve();
  if(!r){log('report: nothing on the timeline');return}
  E.f29.reports++;
  var hook=E.f29.last.hook;
  var lines=[
    'TIKTOK2 RETENTION REPORT #'+E.f29.reports+' — '+new Date().toLocaleString(),
    'clips: '+S.clips.length+'  length: '+r.tot+'s  style: '+S.style,
    'cuts/10s: '+r.pace+'  modeled avg hold: '+Math.round(r.avg*100)+'%  modeled end hold: '+Math.round(r.endKeep*100)+'%',
    hook?('hook score: '+hook.score+'/100 ('+hook.verdict+')'):'hook score: not run yet',
    '',
    'drop-off hotspots:',
    (r.drops.length?r.drops.map(function(d){return '  '+d.at+'s  -'+Math.round(d.loss*100)+'% modeled'}).join('\n'):'  none modeled'),
    '',
    'open fixes: '+((E.f29.last.fixes||[]).join(' | ')||'none logged'),
    '',
    'per-second modeled hold:',
    r.pts.map(function(p){return p.t+'s '+Math.round(p.v*100)+'%'}).join(', ')
  ].join('\n');
  if(dl('tiktok2-retention-report-'+E.f29.reports+'.txt',lines))log('retention report downloaded (#'+E.f29.reports+')');
}
function mount(){
  if($('f29card'))return;
  var card=document.createElement('div');card.className='card';card.id='f29card';
  var h=document.createElement('h2');h.textContent='RETENTION LAB';card.appendChild(h);
  var r1=mkRow();r1.appendChild(mkBtn('HOOK SCORE',hookScore,'1 1 auto','f29b1'));r1.appendChild(mkBtn('DROP-OFF HOTSPOTS',hotspots,'1 1 auto','f29b2'));card.appendChild(r1);
  var r2=mkRow();r2.appendChild(mkBtn('REWIND LOOP CHECK',loopCheck,'1 1 auto','f29b3'));r2.appendChild(mkBtn('PACING SCORE',pacingScore,'1 1 auto','f29b4'));card.appendChild(r2);
  var r3=mkRow();r3.appendChild(mkBtn('CAPTION DENSITY',capDensity,'1 1 auto','f29b5'));r3.appendChild(mkBtn('CTA TIMING',ctaTiming,'1 1 auto','f29b6'));card.appendChild(r3);
  var r4=mkRow();r4.appendChild(mkBtn('RETENTION STRIP',strip,'1 1 auto','f29b7'));r4.appendChild(mkBtn('FIX LIST',fixList,'1 1 auto','f29b8'));card.appendChild(r4);
  var r5=mkRow();r5.appendChild(mkBtn('FULL REPORT .TXT',report,'1 1 auto','f29b9'));card.appendChild(r5);
  var note=document.createElement('div');note.className='note';note.id='f29note';note.textContent='retention lab models where viewers stop watching: hook score grades your first 2 seconds, hotspots and the strip show the bleed points, pacing score checks cut rhythm, caption density flags text that reads too fast, cta timing picks where the loop line lands, rewind loop check grades replay value, fix list ranks what to change, and the report downloads it all.';
  card.appendChild(note);
  var hs=document.querySelectorAll('.card h2'),anchor=null;
  for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('Export Lab')>=0){anchor=hs[i].parentElement;break}}
  if(anchor){if(anchor.nextSibling)anchor.parentElement.insertBefore(card,anchor.nextSibling);else anchor.parentElement.appendChild(card)}
  else{var ap=document.querySelector('#panelcol')||document.body;ap.appendChild(card)}
  log('retention lab live — hook score, drop-off hotspots, rewind loop check, pacing score, caption density, cta timing, retention strip, fix list, full report');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
