'use strict';
// up20.js — PHASE 14 AI DIRECTOR II (Nov 23 2026) // basketball + tv-shows genres,
// storyboard builder, scene classifier, style recognizer, smart clip picks,
// reference matcher, beat fit, director notes, hook check
(function(){
if(window.__tk2up20)return;window.__tk2up20=1;
function $(id){return document.getElementById(id)}
function clipDur(c){return (c.end-c.start)/(c.speed||1)}
function totalD(){var t=0;for(var i=0;i<S.clips.length;i++)t+=clipDur(S.clips[i]);return t}
function tlCpm(){var d=totalD();return d>0?(S.clips.length/Math.max(.1,d)*60):0}
function mkBtn(t,fn,fl,id){var b=document.createElement('button');b.className='btn';b.textContent=t;b.style.flex=fl||'0 0 auto';if(id)b.id=id;b.onclick=fn;return b}
function mkInp(id,ph){var i=document.createElement('input');i.id=id;i.placeholder=ph||'';return i}
function mkRow(gap){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap=(gap||6)+'px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function mkList(id){var l=document.createElement('div');l.id=id;l.style.marginTop='6px';return l}

if(!S.eco)S.eco={};var E=S.eco;
if(!E.ai14)E.ai14={tags:{},board:0,picks:null,refs:[]};
function saveE(){try{save()}catch(e){}}

// --- 1+2 new genre modes: basketball + tv shows (registered into the real style engine)
if(!STYLES.basketball)STYLES.basketball={label:'BASKETBALL',grade:'contrast(1.25) saturate(1.35)',vig:.28,grain:.04,pace:2.1,trans:['punch','shake','flash'],clip:[0.4,1.1],zoom:1.32,cap:'karaoke',bars:0,tint:null};
if(!STYLES.tvshows)STYLES.tvshows={label:'TV SHOWS',grade:'saturate(1.05) contrast(1.08)',vig:.22,grain:.03,pace:1.0,trans:['fade','cut','flash'],clip:[1.0,2.2],zoom:1.1,cap:'bar',bars:.14,tint:null};
if(STYLIST.indexOf('basketball')<0)STYLIST.push('basketball');
if(STYLIST.indexOf('tvshows')<0)STYLIST.push('tvshows');

// --- 3 storyboard builder
function storyboard(){
  var el=$('a1board');el.innerHTML='';
  if(!S.clips.length){el.innerHTML='<span class="tempty">nothing on the timeline</span>';return}
  var t=0;
  S.clips.forEach(function(c,i){
    var m=M[c.src];var d=document.createElement('div');d.className='item';
    d.innerHTML='<b>SCENE '+(i+1)+'</b> '+(m?m.name.slice(0,18):'?')+' · '+(c.start).toFixed(1)+'-'+(c.end).toFixed(1)+'s of source · '+(c.trans||'cut')+' · '+clipDur(c).toFixed(1)+'s on screen'+(c.zoom&&c.zoom!==1?' · zoom '+c.zoom:'');
    el.appendChild(d);t+=clipDur(c);
  });
  E.ai14.board=S.clips.length;saveE();
  log('storyboard built: '+S.clips.length+' scenes, '+t.toFixed(1)+'s total',true);
}

// --- 4 scene classifier
function classify(){
  var el=$('a1tags');el.innerHTML='';
  if(!S.clips.length){el.innerHTML='<span class="tempty">no clips to classify</span>';return}
  E.ai14.tags={};
  S.clips.forEach(function(c,i){
    var m=M[c.src];var tags=[];
    if(c.speed&&c.speed>1.2)tags.push('action');
    if(c.ramp)tags.push('ramp');
    if(clipDur(c)<0.7)tags.push('quick cut');
    if(clipDur(c)>2.5)tags.push('long hold');
    if(c.trans==='fade')tags.push('flow');
    if(c.zoom&&c.zoom>1.25)tags.push('push-in');
    if(m&&m.kind==='audio')tags.push('audio');
    if(m&&m.kind==='video'&&m.stats&&m.stats.cutsPerMin>8)tags.push('busy source');
    if(!tags.length)tags.push('standard');
    E.ai14.tags[i]=tags.join('+');
    var d=document.createElement('div');d.className='item';
    d.innerHTML='<b>#'+(i+1)+'</b> '+tags.join(' · ');
    el.appendChild(d);
  });
  saveE();log('classified '+S.clips.length+' clips by scene type',true);
}

// --- 5 style recognizer
function recognize(){
  if(!S.clips.length){log('style recognizer: add clips first');return}
  var cpm=tlCpm();var transUsed={};S.clips.forEach(function(c){transUsed[c.trans||'cut']=1});
  var capUsed=S.capStyle;var scores=[];
  Object.keys(STYLES).forEach(function(k){
    var d=STYLES[k];var s=0;
    var wantCpm=d.pace*60;s+=Math.max(0,100-Math.abs(wantCpm-cpm)*1.2);
    var hits=0;var pool=d.trans||[];Object.keys(transUsed).forEach(function(t){if(pool.indexOf(t)>=0)hits++});
    s+=hits/Math.max(1,Object.keys(transUsed).length)*100;
    if(d.cap===capUsed)s+=30;
    if(d.ramp&&S.clips.some(function(c){return c.ramp}))s+=20;
    scores.push([k,Math.round(s)]);
  });
  scores.sort(function(a,b){return b[1]-a[1]});
  var top=scores.slice(0,3).map(function(x){return STYLES[x[0]].label+' '+x[1]+'%'});
  log('style reads as: '+top.join(', '),true);
  log('measured '+cpm.toFixed(1)+' cuts/min, transitions '+Object.keys(transUsed).join('/'));
}

// --- 6 smart clip picks
function smartPicks(){
  if(!S.clips.length){log('smart picks: add clips first');return}
  var st=STYLES[S.style]||STYLES.cinematic;var scored=[];
  S.clips.forEach(function(c,i){
    var d=clipDur(c);var s=40;
    if(d>=st.clip[0]&&d<=st.clip[1])s+=40;else s-=Math.min(40,Math.abs(d-(st.clip[0]+st.clip[1])/2)*18);
    if(c.speed&&c.speed>1)s+=12;
    if(c.trans&&c.trans!=='cut')s+=8;
    var m=M[c.src];if(m&&m.stats&&m.stats.cutsPerMin>6)s+=10;
    scored.push([i,Math.round(s)]);
  });
  scored.sort(function(a,b){return b[1]-a[1]});
  var top=scored.slice(0,3);
  E.ai14.picks=top.map(function(x){return x[0]});
  saveE();
  log('smart picks for '+STYLES[S.style].label+': #'+(top[0][0]+1)+' ('+top[0][1]+'%), #'+(top[1][0]+1)+' ('+top[1][1]+'%), #'+(top[2][0]+1)+' ('+top[2][1]+'%) — lead with these',true);
}

// --- 7 reference matcher
function refMatch(){
  var t=$('a1refIn').value.trim().toLowerCase();
  if(!t){log('reference matcher: type a description first');return}
  var keys={phonk:'phonk',anime:'anime',football:'football',basketball:'basketball',gaming:'gaming',game:'gaming',marvel:'marvel',superhero:'marvel',movie:'movies',cinematic:'cinematic',tv:'tvshows',show:'tvshows',velocity:'velocity',luxury:'luxury',documentary:'documentary',doc:'documentary',emotional:'emotional',sad:'emotional',dark:'dark',aesthetic:'dark'};
  var styleK=null;Object.keys(keys).forEach(function(w){if(t.indexOf(w)>-1&&!styleK)styleK=keys[w]});
  var tr=null;['shake','whip','flash','fade','punch'].forEach(function(w){if(t.indexOf(w)>-1&&!tr)tr=w});
  var fast=t.indexOf('fast')>-1||t.indexOf('quick')>-1,slow=t.indexOf('slow')>-1||t.indexOf('calm')>-1;
  var changed=[];
  if(styleK&&STYLES[styleK]){S.style=styleK;changed.push('style → '+STYLES[styleK].label)}
  if(tr){S.clips.forEach(function(c){c.trans=tr});changed.push('transitions → '+tr)}
  if(styleK&&fast&&STYLES[styleK].pace<1.6){S.clips.forEach(function(c){if(c.speed<1.3)c.speed=Math.min(1.6,(c.speed||1)*1.25)});changed.push('speeds up 25% for pace')}
  if(styleK&&slow&&STYLES[styleK].pace>1.2){S.clips.forEach(function(c){if((c.speed||1)>1)c.speed=1});changed.push('speeds reset for calm pace')}
  if(!changed.length){log('reference matcher: no keyword match — try naming a style or transition');return}
  E.ai14.refs.unshift({t:t,at:Date.now()});E.ai14.refs=E.ai14.refs.slice(0,5);
  try{if(window.syncStyleChips)syncStyleChips()}catch(e){}
  drawTimeline();saveE();
  log('reference matched: '+changed.join(', '),true);
}

// --- 8 beat fit
function beatFit(){
  var m=S.musicId?M[S.musicId]:null;
  if(!m){log('beat fit: add music first');return}
  if(!S.clips.length){log('beat fit: add clips first');return}
  var cpm=tlCpm();var best=null,bd=1e9;
  [80,90,100,120,130,140,150,160,174].forEach(function(bpm){
    [0.5,1,2].forEach(function(mult){
      var want=bpm*mult/2;var d=Math.abs(want-cpm);
      if(d<bd){bd=d;best={bpm:bpm,mult:mult,want:want}}
    });
  });
  var cutLen=60/best.bpm*best.mult;
  log('beat fit: timeline runs '+cpm.toFixed(1)+' cuts/min — closest is '+best.bpm+' BPM cutting every '+(best.mult===1?'beat':best.mult===0.5?'half beat':'2 beats')+' ('+best.want.toFixed(1)+'/min, a '+cutLen.toFixed(2)+'s cut)',true);
}

// --- 9 director notes
function director(){
  if(!S.clips.length){log('director notes: add clips first');return}
  var cpm=tlCpm(),tot=totalD(),st=STYLES[S.style]||STYLES.cinematic;
  var variety={};S.clips.forEach(function(c){variety[c.trans||'cut']=1});
  var nVar=Object.keys(variety).length;
  var caps3=S.captions.filter(function(c){return c.t0<3}).length;
  var lines=[];
  lines.push('length '+tot.toFixed(1)+'s — '+(tot<12?'short: aim 15-34s for the algo sweet spot':tot>40?'long: cut to 34s or under for rewatch value':'in the good range'));
  var want=st.pace*60;
  lines.push('pacing '+cpm.toFixed(1)+' cuts/min vs '+STYLES[S.style].label+' target '+want.toFixed(1)+' — '+(cpm<want-8?'speed it up (shorten clips)':cpm>want+8?'slow down slightly':'on pace'));
  lines.push('transitions: only '+nVar+' type'+(nVar===1?'':'s')+' in use — '+(nVar<2?'mix in '+st.trans.slice(0,2).join(' and '):'good variety'));
  lines.push(caps3?'captions: a caption lands inside the first 3s — keep it':'captions: nothing in the first 3s — add a hook caption at 0s');
  lines.push('hook: your first clip is '+clipDur(S.clips[0]).toFixed(1)+'s — '+(clipDur(S.clips[0])>2.5?'tighten it, the hook window is tiny':'good, tight open'));
  lines.forEach(function(l){log('· '+l)});
  log('director notes ready',true);
}

// --- 10 hook check
function hookCheck(){
  if(!S.clips.length){log('hook check: add clips first');return}
  var t=0,hits=0,firstTr=S.clips[0].trans||'cut',caps=[];
  S.clips.forEach(function(c,i){if(t<3)hits++;t+=clipDur(c)});
  S.captions.forEach(function(c){if(c.t0<3)caps.push(c.text.slice(0,30))});
  var verdict='HOOK CHECK: '+hits+' clip'+(hits===1?'':'s')+' in the first 3s, opening transition "'+firstTr+'", ';
  verdict+=caps.length?('caption "'+caps[0]+'" already on screen — strong open'):('no caption in the open — add text at 0s');
  log(verdict,true);
}

function mount(){
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='AI Director II (Phase 14)';card.appendChild(h);

  var row1=mkRow();row1.appendChild(mkBtn('BUILD STORYBOARD',storyboard,'0 0 30%','a1boardBtn'));row1.appendChild(mkBtn('CLASSIFY CLIPS',classify,'0 0 30%','a1classify'));row1.appendChild(mkBtn('RECOGNIZE STYLE',recognize,'0 0 30%','a1recognize'));card.appendChild(row1);

  var row2=mkRow();row2.appendChild(mkBtn('SMART PICKS',smartPicks,'0 0 30%','a1picks'));row2.appendChild(mkBtn('BEAT FIT',beatFit,'0 0 30%','a1beat'));row2.appendChild(mkBtn('DIRECTOR NOTES',director,'0 0 30%','a1notes'));card.appendChild(row2);

  var row3=mkRow();row3.appendChild(mkBtn('HOOK CHECK',hookCheck,'0 0 30%','a1hook'));
  var ri=mkInp('a1refIn','describe a reference edit…');ri.style.flex='1 1 auto';row3.appendChild(ri);
  row3.appendChild(mkBtn('MATCH',refMatch,'0 0 auto','a1refGo'));card.appendChild(row3);

  var cols=document.createElement('div');cols.style.display='flex';cols.style.gap='10px';
  var c1=document.createElement('div');c1.style.flex='1';c1.appendChild(mkList('a1board'));cols.appendChild(c1);
  var c2=document.createElement('div');c2.style.flex='1';c2.appendChild(mkList('a1tags'));cols.appendChild(c2);
  card.appendChild(cols);

  var note=document.createElement('div');note.className='note';
  note.textContent='ai director ii: two new genre modes (basketball + tv shows) in the style row, storyboard builder, scene classifier, style recognizer that reads your own timeline, smart clip picks, reference matcher, beat fit against common bpms, director notes, and a hook check on your first 3 seconds.';
  card.appendChild(note);

  var hs=document.querySelectorAll('.card h2');var anchor=null;
  for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('Reliability II')>=0){anchor=hs[i].parentElement;break}}
  if(!anchor){for(var j=0;j<hs.length;j++){if(hs[j].textContent.indexOf('Growth + Reliability')>=0){anchor=hs[j].parentElement;break}}}
  if(anchor){if(anchor.nextSibling)anchor.parentElement.insertBefore(card,anchor.nextSibling);else anchor.parentElement.appendChild(card)}
  else document.body.appendChild(card);

  try{if(window.syncStyleChips)syncStyleChips()}catch(e){}
  log('ai director ii live — basketball + tv shows modes ready',true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();