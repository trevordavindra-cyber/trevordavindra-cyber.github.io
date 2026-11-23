'use strict';
// up30.js — PHASE 24 SOUND LAB (Nov 23 2026)
// beat sync check, music start finder, ducking plan, silence check, fade plan,
// sound sync score, sfx placement, vo timing, audio fix list, audio report
(function(){
if(window.__tk2up30)return;window.__tk2up30=1;
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
if(!E.f30)E.f30={last:{},reports:0};

// bpm guess per style, clamped to a sane 60-180 so the grid never goes wild
function bpmGuess(){
  var map={phonk:145,basketball:140,trap:150,gaming:135,anime:140,fitness:145,tvshows:120,doc:110,cinematic:100,custom:130};
  var bpm=map[String(S.style||'custom').toLowerCase()]||130;
  return Math.max(60,Math.min(180,bpm));
}
function beatGrid(){
  var bpm=bpmGuess(),step=60/bpm,pts=[];
  for(var t=step;t<totalDur();t+=step)pts.push(+t.toFixed(2));
  return {bpm:bpm,step:+step.toFixed(3),beats:pts};
}
function audioState(){
  if(!S.clips.length)return null;
  var cuts=cutTimes(),g=beatGrid(),tot=+totalDur().toFixed(1);
  // on-beat: a cut within 120ms of a beat
  var on=0;for(var i=0;i<cuts.length;i++){
    for(var j=0;j<g.beats.length;j++){if(Math.abs(cuts[i]-g.beats[j])<=0.12){on++;break}}
  }
  var captions=S.captions||[];
  // caption-covered spans (for ducking / silence)
  var covered=[];
  for(var k=0;k<captions.length;k++){covered.push([captions[k].t0,captions[k].t1])}
  covered.sort(function(a,b){return a[0]-b[0]});
  // merged caption coverage
  var merged=[];for(var m=0;m<covered.length;m++){
    var c=covered[m];
    if(merged.length&&c[0]<=merged[merged.length-1][1])merged[merged.length-1][1]=Math.max(merged[merged.length-1][1],c[1]);
    else merged.push([c[0],c[1]]);
  }
  // dead air: spans with no cut within 0.8s and no caption
  var dead=[];
  var marks=cuts.slice();
  for(var t=0.5;t<tot-0.5;t+=0.5){
    var nearCut=false;for(var a=0;a<marks.length;a++){if(Math.abs(t-marks[a])<0.8){nearCut=true;break}}
    var inCap=false;for(var b=0;b<merged.length;b++){if(t>=merged[b][0]&&t<=merged[b][1]){inCap=true;break}}
    if(!nearCut&&!inCap)dead.push(+t.toFixed(1));
  }
  var music=S.musicId&&M[S.musicId]?M[S.musicId]:null;
  return {tot:tot,cuts:cuts,bpm:g.bpm,step:g.step,onBeat:g.beats.length?on:0,beatsN:g.beats.length,
    merged:merged,dead:dead,music:m,gain:typeof S.musicGain==='number'?S.musicGain:0.8,offset:typeof S.musicOffset==='number'?S.musicOffset:0};
}
function beatSync(){
  var r=audioState();if(!r){log('beat sync: nothing on the timeline');return}
  var pct=r.beatsN?Math.round(r.onBeat/Math.max(r.cuts.length,1)*100):0;
  var verdict=pct>=70?'locked in':pct>=45?'close, nudge the cuts':'off the grid';
  log('BEAT SYNC — '+r.onBeat+' of '+r.cuts.length+' cuts land on the '+r.bpm+' BPM grid ('+pct+'%) — '+verdict,pct<45);
  E.f30.last.beat=pct;saveE();
}
function musicStart(){
  var r=audioState();if(!r){log('music start: nothing on the timeline');return}
  if(!r.music){log('music start: no music set');return}
  if(!r.music.dur){log('music start: duration not read yet — play it once, then re-run');return}
  // find the offset so beat #1 lands exactly on the first cut
  var first=r.cuts.length?r.cuts[0]:0;
  var off=+(first-r.step).toFixed(2);
  var fits=off>=-0.5&&r.music.dur>=r.tot;
  log('MUSIC START — set offset to '+off+'s so a '+r.bpm+' BPM beat hits the first cut at '+first.toFixed(1)+'s'+(fits?'':' — check the track still covers '+r.tot.toFixed(1)+'s'),true);
  E.f30.last.offset=off;saveE();
}
function duckPlan(){
  var r=audioState();if(!r){log('ducking plan: nothing on the timeline');return}
  if(!r.merged.length){log('ducking plan: no captions yet — nothing to duck under');return}
  var dips=r.merged.slice(0,3).map(function(m){return Math.round(m[0])+'s-'+Math.round(m[1])+'s'});
  log('DUCKING PLAN — dip music gain '+Math.round(r.gain*100)+'% -> 45% under '+r.merged.length+' caption span(s): '+dips.join(', ')+(r.merged.length>3?' + '+(r.merged.length-3)+' more':''),true);
  E.f30.last.duck=r.merged.length;saveE();
}
function silence(){
  var r=audioState();if(!r){log('silence check: nothing on the timeline');return}
  // collapse consecutive dead-air ticks into spans
  var spans=[],cur=null;
  for(var i=0;i<r.dead.length;i++){
    if(cur&&r.dead[i]-cur[1]<=0.55)cur[1]=r.dead[i];
    else{if(cur)spans.push(cur);cur=[r.dead[i],r.dead[i]]}
  }
  if(cur)spans.push(cur);
  if(!spans.length)log('silence check — no dead air: every gap has a cut or a caption');
  else{
    var msg=spans.slice(0,3).map(function(s){return s[0]+'s-'+s[1]+'s ('+(s[1]-s[0]).toFixed(1)+'s)'}).join(', ');
    log('SILENCE CHECK — '+spans.length+' dead-air span(s): '+msg+(spans.length>3?' + more':'')+' — cover them with a cut, caption, or sound',spans.length>0);
  }
  E.f30.last.dead=spans.length;saveE();
}
function fadePlan(){
  var r=audioState();if(!r){log('fade plan: nothing on the timeline');return}
  var fi=r.tot<=15?0.8:r.tot<=30?1.2:2.0;
  var fo=r.tot<=15?1.0:r.tot<=30?1.5:2.5;
  log('FADE PLAN — fade in 0-'+fi.toFixed(1)+'s, fade out '+(r.tot-fo).toFixed(1)+'-'+r.tot.toFixed(1)+'s (music gain '+Math.round(r.gain*100)+'%), or cut the audio dead at the loop point for a hard loop',true);
  E.f30.last.fade={fi:fi,fo:fo};saveE();
}
function syncScore(){
  var r=audioState();if(!r){log('sound sync score: nothing on the timeline');return}
  var score=100;
  var pct=r.beatsN?Math.round(r.onBeat/Math.max(r.cuts.length,1)*100):0;
  if(pct<45)score-=30;else if(pct<70)score-=12;
  if(!r.music)score-=35;else if(r.music.dur<r.tot)score-=20;
  if(r.dead.length>6)score-=15;else if(r.dead.length>2)score-=8;
  if(!S.captions.length)score-=10;
  var verdict=score>=85?'locked':score>=60?'tunable':'needs work';
  log('SOUND SYNC SCORE '+score+'/100 ('+verdict+') — '+pct+'% on-beat, '+(r.music?'music set':'no music')+', '+r.dead.length+' dead-air tick(s)',score<60);
  E.f30.last.score=score;saveE();
}
function sfxPlan(){
  var r=audioState();if(!r){log('sfx placement: nothing on the timeline');return}
  // biggest gaps between cuts = the moments that need impact
  var gaps=[];
  for(var i=1;i<r.cuts.length;i++)gaps.push({at:r.cuts[i],gap:+(r.cuts[i]-r.cuts[i-1]).toFixed(2)});
  gaps.sort(function(a,b){return b.gap-a.gap});
  if(!gaps.length){log('sfx placement: need 2+ cuts');return}
  var hits=gaps.slice(0,3).map(function(g){return g.at+'s'}).join(', ');
  log('SFX PLACEMENT — impact hits at '+hits+' (longest gaps after a stretch) + a whoosh on the loop point',true);
  E.f30.last.sfx=gaps[0].at;saveE();
}
function voTiming(){
  var r=audioState();if(!r){log('vo timing: nothing on the timeline');return}
  if(!r.merged.length){log('vo timing: no captions yet — the whole '+r.tot+'s cut is open for a voiceover');return}
  // longest caption-free span
  var best=[0,0],prev=0;
  for(var i=0;i<r.merged.length;i++){
    var gap=[prev,r.merged[i][0]];
    if(gap[1]-gap[0]>best[1]-best[0])best=gap;
    prev=r.merged[i][1];
  }
  if(r.tot-prev>best[1]-best[0])best=[prev,r.tot];
  if(best[1]-best[0]<1.5)log('vo timing: captions cover nearly everything — trim one caption block to open a VO window');
  else log('VO TIMING — widest caption-free window: '+best[0].toFixed(1)+'s-'+best[1].toFixed(1)+'s ('+(best[1]-best[0]).toFixed(1)+'s) — about '+Math.max(1,Math.floor((best[1]-best[0])*2.5))+' words fit there',true);
  E.f30.last.vo=best;saveE();
}
function fixList(){
  var r=audioState();if(!r){log('audio fix list: nothing on the timeline');return}
  var fixes=[];
  if(!r.music)fixes.push('no music set — pick a track before export');
  else if(r.music.dur<r.tot)fixes.push('track is '+(r.tot-r.music.dur).toFixed(1)+'s short — loop it or stack a second track');
  var pct=r.beatsN?Math.round(r.onBeat/Math.max(r.cuts.length,1)*100):0;
  if(r.cuts.length&&pct<45)fixes.push('only '+pct+'% of cuts on the '+r.bpm+' BPM grid — nudge cut times onto the beat');
  if(r.dead.length>6)fixes.push('dead air in '+r.dead.length+' spots — cover the longest span first');
  if(!S.captions.length)fixes.push('no captions — ducking and VO have nothing to anchor to');
  if(!fixes.length)fixes.push('nothing critical — audio is tight');
  log('AUDIO FIX LIST (top 3) — '+fixes.slice(0,3).map(function(f,i){return (i+1)+') '+f}).join('  '),true);
  E.f30.last.fixes=fixes.slice(0,3);saveE();
}
function report(){
  var r=audioState();if(!r){log('audio report: nothing on the timeline');return}
  E.f30.reports++;
  var lines=[
    'TIKTOK2 SOUND REPORT #'+E.f30.reports+' — '+new Date().toLocaleString(),
    'clips: '+S.clips.length+'  length: '+r.tot+'s  style: '+S.style,
    'beat grid: '+r.bpm+' BPM ('+r.step.toFixed(2)+'s per beat)',
    'music: '+(r.music?r.music.name+' dur '+r.music.dur.toFixed(1)+'s gain '+Math.round(r.gain*100)+'% offset '+r.offset+'s':'none'),
    'cuts: '+r.cuts.length+'  on-beat: '+(r.beatsN?Math.round(r.onBeat/Math.max(r.cuts.length,1)*100)+'%':'n/a'),
    'dead-air ticks: '+r.dead.length+'  caption spans: '+r.merged.length,
    '',
    'cut times:',(r.cuts.length?r.cuts.map(function(c){return c+'s'}).join(', '):'  none'),
    '',
    'open fixes: '+((E.f30.last.fixes||[]).join(' | ')||'none logged'),
    '',
    'dead-air ticks: '+(r.dead.length?r.dead.join(', ')+'s':'none')
  ].join('\n');
  if(dl('tiktok2-sound-report-'+E.f30.reports+'.txt',lines))log('sound report downloaded (#'+E.f30.reports+')');
}
function mount(){
  if($('f30card'))return;
  var card=document.createElement('div');card.className='card';card.id='f30card';
  var h=document.createElement('h2');h.textContent='SOUND LAB';card.appendChild(h);
  var r1=mkRow();r1.appendChild(mkBtn('BEAT SYNC CHECK',beatSync,'1 1 auto','f30b1'));r1.appendChild(mkBtn('MUSIC START FINDER',musicStart,'1 1 auto','f30b2'));card.appendChild(r1);
  var r2=mkRow();r2.appendChild(mkBtn('DUCKING PLAN',duckPlan,'1 1 auto','f30b3'));r2.appendChild(mkBtn('SILENCE CHECK',silence,'1 1 auto','f30b4'));card.appendChild(r2);
  var r3=mkRow();r3.appendChild(mkBtn('FADE PLAN',fadePlan,'1 1 auto','f30b5'));r3.appendChild(mkBtn('SOUND SYNC SCORE',syncScore,'1 1 auto','f30b6'));card.appendChild(r3);
  var r4=mkRow();r4.appendChild(mkBtn('SFX PLACEMENT',sfxPlan,'1 1 auto','f30b7'));r4.appendChild(mkBtn('VO TIMING',voTiming,'1 1 auto','f30b8'));card.appendChild(r4);
  var r5=mkRow();r5.appendChild(mkBtn('AUDIO FIX LIST',fixList,'1 1 auto','f30b9'));r5.appendChild(mkBtn('AUDIO REPORT .TXT',report,'1 1 auto','f30b10'));card.appendChild(r5);
  var note=document.createElement('div');note.className='note';note.id='f30note';note.textContent='sound lab tunes what the video sounds like: beat sync check grades your cuts against the bpm grid, music start finder finds the offset that lands a beat on the first cut, ducking plan dips the music under captions, silence check finds dead air, fade plan times the fades, sound sync score grades it all, sfx placement picks impact moments, vo timing finds the open window, the fix list ranks what to change, and the report downloads it all.';
  card.appendChild(note);
  var hs=document.querySelectorAll('.card h2'),anchor=null;
  for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('Retention Lab')>=0){anchor=hs[i].parentElement;break}}
  if(anchor){if(anchor.nextSibling)anchor.parentElement.insertBefore(card,anchor.nextSibling);else anchor.parentElement.appendChild(card)}
  else{var ap=document.querySelector('#panelcol')||document.body;ap.appendChild(card)}
  log('sound lab live — beat sync check, music start finder, ducking plan, silence check, fade plan, sound sync score, sfx placement, vo timing, audio fix list, audio report');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();