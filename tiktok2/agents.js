'use strict';
// PROJECT: ULTIMATE AI TIKTOK EDIT MAKER — autonomous editing intelligence (agent layer)
// Loads after app.js + app2.js. Adds the agent system without touching the engine,
// the assistant or the generator. Every step below runs on real project data.
var CTX={};
var AGDEF=[['director','DIRECTOR'],['music','MUSIC'],['vfx','VFX'],['cinema','CINEMA'],['caption','CAPTION'],['qc','QUALITY CONTROL']];
function agSet(id,txt){var el=$('ag_'+id);if(el)el.textContent=txt}
function agentInit(){
  var card=document.createElement('div');card.className='card';card.id='agentCard';
  var h=document.createElement('h2');h.textContent='Autonomous AI director';card.appendChild(h);
  AGDEF.forEach(function(a){
    var r=document.createElement('div');r.className='kv';
    r.innerHTML='<span>'+a[1]+'</span><b id="ag_'+a[0]+'">idle</b>';
    card.appendChild(r);
  });
  var btn=document.createElement('button');btn.id='btnDirector';btn.textContent='AI DIRECTOR: FULL EDIT';
  btn.onclick=runDirector;card.appendChild(btn);
  var fb=document.createElement('div');fb.className='btnrow';fb.id='fbRow';fb.style.display='none';
  var b1=document.createElement('button');b1.className='ghost small';b1.textContent='GOOD EDIT';b1.onclick=function(){rate(1)};
  var b2=document.createElement('button');b2.className='ghost small';b2.textContent='NOT IT';b2.onclick=function(){rate(-1)};
  fb.appendChild(b1);fb.appendChild(b2);card.appendChild(fb);
  var note=document.createElement('div');note.className='note';note.id='agentNote';
  note.textContent='one tap: it re-analyzes everything, plans, edits, quality-checks and fixes its own work.';
  card.appendChild(note);
  var studio=$('page-studio');
  studio.insertBefore(card,studio.children[1]||null);
}
// ---------- learned preferences (explicit feedback only) ----------
function loadPrefs(){try{return JSON.parse(localStorage.getItem('tk2prefs')||'{}')}catch(e){return {}}}
var PREFS=loadPrefs();
function savePrefs(){try{localStorage.setItem('tk2prefs',JSON.stringify(PREFS))}catch(e){}}
function rate(good){
  PREFS.styleCounts=PREFS.styleCounts||{};
  PREFS.styleCounts[S.style]=(PREFS.styleCounts[S.style]||0)+(good>0?2:-1);
  if(good>0){
    PREFS.pace=PREFS.pace||1;
    var lb=(CTX.lastPlan&&CTX.lastPlan.label)||'';
    if(lb.indexOf('FAST')>-1)PREFS.pace=clamp(PREFS.pace*1.15,0.5,2);
    if(lb.indexOf('CALM')>-1)PREFS.pace=clamp(PREFS.pace*0.9,0.5,2);
    var trs={};(CTX.lastPlan&&CTX.lastPlan.clips||[]).forEach(function(c){trs[c.trans]=(trs[c.trans]||0)+1});
    PREFS.transWeight=trs;
  }
  savePrefs();
  $('fbRow').style.display='none';
  log(good>0?'noted — the director leans into this look next run':'noted — the director shifts away from this look',true);
}
function favoriteStyle(){
  var c=PREFS.styleCounts||{},best=null,bv=-999;
  STYLIST.forEach(function(s){var v=c[s]||0;if(v>bv){bv=v;best=s}});
  return bv>0?best:null;
}
// ---------- music agent: rhythm + intensity ----------
async function musicEnergy(m){
  if(!m)return null;
  try{
    var actx=new (window.AudioContext||window.webkitAudioContext)();
    if(!m.buf)m.buf=await actx.decodeAudioData(await m.blob.arrayBuffer());
    var ch=m.buf.getChannelData(0),sr=m.buf.sampleRate,win=Math.floor(sr*0.25);
    var env=[];
    for(var i=0;i+win<ch.length;i+=win){var s=0;for(var j=0;j<win;j+=8)s+=ch[i+j]*ch[i+j];env.push(Math.sqrt(s/(win/8)))}
    var mx=0;env.forEach(function(v){mx=Math.max(mx,v)});
    if(mx>0)env=env.map(function(v){return v/mx});
    var peaks=env.map(function(v,i){return{v:v,t:i*0.25}}).sort(function(a,b){return b.v-a.v}).slice(0,12).map(function(x){return x.t}).sort(function(a,b){return a-b});
    m.energy={env:env,peaks:peaks};
    actx.close();
    log('music: intensity curve ready, '+peaks.length+' loudest drops marked',true);
    return m.energy;
  }catch(e){log('music energy: '+e.message);return null}
}
// ---------- director agent: the full edit plan ----------
function directorPlan(){
  var fav=favoriteStyle();
  if(fav&&STYLES[fav]&&(PREFS.styleCounts[fav]||0)>(PREFS.styleCounts[S.style]||0)){S.style=fav;log('director: using your liked style ('+STYLES[fav].label+')',true)}
  var st=STYLES[S.style];
  var vids=videoMedias();
  if(!vids.length)throw new Error('no footage in the library');
  var mus=S.musicId&&M[S.musicId]?M[S.musicId]:null;
  var energy=mus&&mus.energy?mus.energy:null;
  var beats=(mus&&mus.beats)||[];
  var paceMult=clamp(PREFS.pace||1,0.5,2);
  var iv=1/(st.pace*paceMult);
  var target=clamp(vids.reduce(function(a,m){return a+(m.dur||0)},0)*0.55,15,34);
  var cutTs=[];
  if(energy&&energy.peaks.length>3){
    cutTs=energy.peaks.filter(function(t){return t<target+2});
  } else if(beats.length>6){
    cutTs=beats.filter(function(t){return t<target});
  } else {
    var t=0;while(t<target){cutTs.push(t);t+=iv}
  }
  // merge too-close cuts, densify long gaps — cuts land on energy drops or beats
  var merged=[];
  cutTs.forEach(function(t){if(!merged.length||t-merged[merged.length-1]>=iv*0.8)merged.push(t)});
  cutTs=merged;
  var filled=[];
  for(var i=0;i<cutTs.length;i++){
    if(i>0){var gap=cutTs[i]-cutTs[i-1],n=Math.floor(gap/iv);
      for(var k=1;k<=n;k++)filled.push(cutTs[i-1]+gap*k/(n+1))}
    filled.push(cutTs[i]);
  }
  cutTs=filled;
  if(!cutTs.length)cutTs=[0];
  // vfx + cinema agents pick treatment per shot from real motion data
  var clips=[],vi=0;
  for(var i=0;i<cutTs.length;i++){
    var d=(i<cutTs.length-1?cutTs[i+1]:cutTs[i]+iv)-cutTs[i];
    if(d<0.3)continue;
    var m=vids[vi%vids.length];vi++;
    var want=Math.min(d,Math.max(0.35,st.clip[0]+Math.random()*(st.clip[1]-st.clip[0])));
    var seg=pickSeg(m,want);
    var sc=null;
    if(m.scenes&&m.scenes.length){
      sc=m.scenes.filter(function(x){return x.start<=seg.start+0.01&&x.end>=seg.end-0.01})[0]||m.scenes[0];
    }
    var motion=sc?sc.score:5;
    var trans=motion>18?['punch','flash','shake'][i%3]:motion>8?st.trans[i%st.trans.length]:'fade';
    var speed=1,ramp=0;
    if(motion>26&&d>0.8){speed=0.9}          // hot footage: steady it down
    if(motion<6&&d>1.2&&st.ramp){ramp=1}     // flat footage: give it a speed ramp
    clips.push({id:uid(),src:m.id,start:seg.start,end:seg.end,speed:speed,ramp:ramp,
      zoom:(i%2?-1:1)*(0.9+Math.random()*0.3),trans:trans,keep:i===0?1:0});
  }
  return{label:'DIRECTOR',clips:clips,style:S.style};
}
// ---------- quality control agent: real checks + auto-fixes ----------
function runQC(planLabel){
  var issues=[],fixed=0,dur=0;
  for(var i=0;i<S.clips.length;i++){
    var c=S.clips[i],m=M[c.src];
    if(!m){issues.push('clip '+(i+1)+' had missing footage — removed');S.clips.splice(i,1);fixed++;i--;continue}
    var d=m.dur||0;
    if(c.start<0){c.start=0;fixed++}
    if(c.end<=c.start+0.15){c.end=Math.min(d,c.start+0.5);fixed++;issues.push('clip '+(i+1)+' too short — extended')}
    if(d&&c.end>d+0.05){c.end=d;fixed++}
    if(!(c.speed>=0.25&&c.speed<=3)){c.speed=1;fixed++}
    if(!c.trans||['cut','flash','fade','punch','whip','shake'].indexOf(c.trans)<0){c.trans='cut';fixed++}
    if(!(c.zoom>=-3&&c.zoom<=3)){c.zoom=1;fixed++}
    dur+=clipOutDur(c);
  }
  var tot=totalDur();
  var before=S.captions.length;
  S.captions=S.captions.filter(function(c){return c&&c.text&&c.text.trim()&&c.t1>c.t0&&c.t0<tot});
  if(S.captions.length!==before){fixed++;issues.push('caption timing out of range — cleaned')}
  var beats=(S.musicId&&M[S.musicId]&&M[S.musicId].beats)||[];
  var aligned=0,n=0,t=0;
  S.clips.forEach(function(c){var st=t;t+=clipOutDur(c);if(st<0.1)return;n++;
    for(var k=0;k<beats.length;k++){if(Math.abs(beats[k]-st)<0.12){aligned++;break}}});
  var score=0;
  if(n)score+=Math.round(aligned/n*40);
  score+=tot>=15&&tot<=45?25:tot<15?12:15;
  var uniq={};S.clips.forEach(function(c){uniq[c.src]=1});
  score+=Math.min(20,Object.keys(uniq).length*5);
  score+=S.captions.length?15:0;
  if(!S.clips.length){issues.push('no clips survived QC');score=0}
  return{issues:issues,fixed:fixed,score:Math.min(100,score),beatsPct:n?Math.round(aligned/n*100):0,dur:tot};
}
// ---------- the coordinated run ----------
async function runDirector(){
  if(playing){log('stop the preview first');return}
  var btn=$('btnDirector');btn.disabled=true;btn.textContent='DIRECTING…';
  $('playhint').style.display='none';
  try{
    agSet('director','working');
    log('director: taking over this edit',true);
    pushHistory('before director');
    // vfx agent: make sure every upload is analyzed
    agSet('vfx','analyzing');
    var vids=videoMedias();
    if(!vids.length)throw new Error('no footage in the library');
    var todo=vids.filter(function(m){return !m.scenes||!m.scenes.length});
    for(var i=0;i<todo.length;i++)await analyzeScenes(todo[i]);
    agSet('vfx',vids.length+' videos mapped');
    // music agent: beats + intensity
    agSet('music','listening');
    var mus=S.musicId&&M[S.musicId]?M[S.musicId]:null;
    if(mus){await musicEnergy(mus);agSet('music',mus.bpm?mus.bpm+' bpm':'done')}
    else agSet('music','none uploaded');
    // cinema agent: shot plan; caption agent: lines
    agSet('cinema','planning');
    var plan=directorPlan();CTX.lastPlan=plan;
    agSet('cinema','done');
    agSet('caption','writing');
    S.style=plan.style;applyPlan(plan);
    if(!S.captions.length)$('capAuto').click();
    S.capStyle=(mus&&mus.energy&&mus.energy.peaks.length>5)?'karaoke':'bold';
    var cs=$('capStyle');if(cs)cs.value=S.capStyle;
    agSet('caption',S.captions.length+' lines');
    drawTimeline();syncStyleChips();save();
    // qc agent: check, fix, re-check
    agSet('qc','checking');
    var q1=runQC(plan.label);
    var q2=runQC(plan.label);
    agSet('qc','score '+q2.score+'/100'+(q2.fixed?' · '+q2.fixed+' fixes':''));
    log('qc: score '+q2.score+'/100, cuts on beat '+q2.beatsPct+'%, length '+q2.dur.toFixed(0)+'s'+(q2.issues.length?' — fixed: '+q2.issues.slice(0,3).join('; '):' — clean'),true);
    // director: build alternatives, score them, keep the winner
    agSet('director','variants');
    var alts=[{label:'FAST-ALT',clips:buildPlan(1.35,'FAST-ALT').clips},{label:'CALM-ALT',clips:buildPlan(0.7,'CALM-ALT').clips}];
    var baseScore=q2.score,baseClips=S.clips.slice();
    var saved=S.clips;
    alts.forEach(function(a){S.clips=a.clips;a.score=runQC(a.label).score});
    S.clips=saved;
    var winner=null;
    alts.forEach(function(a){if(a.score>baseScore&&(!winner||a.score>winner.score))winner=a});
    if(winner){
      S.clips=winner.clips;var qf=runQC(winner.label);
      log('director: '+winner.label+' scored '+qf.score+' vs '+baseScore+' — it won',true);
      baseScore=qf.score;
    }
    S.variations=[{label:'DIRECTOR',clips:baseClips.map(function(c){return Object.assign({},c)})}].concat(alts.map(function(a){return{label:a.label,clips:a.clips.map(function(c){return Object.assign({},c)})}}));
    drawTimeline();save();
    pushHistory('director · '+STYLES[S.style].label+' · '+baseScore+'/100');
    agSet('director','done · '+baseScore+'/100');
    $('fbRow').style.display='flex';
    log('director edit ready: '+S.clips.length+' clips, '+totalDur().toFixed(1)+'s. preview it, then rate it — feedback shapes the next run.',true);
  }catch(e){agSet('director','error');log('director: '+e.message)}
  btn.disabled=false;btn.textContent='AI DIRECTOR: FULL EDIT';
}
// ---------- project history ----------
function pushHistory(label){
  try{
    var h=JSON.parse(localStorage.getItem('tk2hist')||'[]');
    h.unshift({t:Date.now(),label:label,style:S.style,clips:JSON.parse(JSON.stringify(S.clips)),captions:JSON.parse(JSON.stringify(S.captions||[])),musicId:S.musicId,capStyle:S.capStyle});
    localStorage.setItem('tk2hist',JSON.stringify(h.slice(0,15)));
    renderHistory();
  }catch(e){}
}
function renderHistory(){
  var el=$('histList');if(!el)return;
  var h=[];try{h=JSON.parse(localStorage.getItem('tk2hist')||'[]')}catch(e){}
  if(!h.length){el.textContent='no snapshots yet';return}
  el.innerHTML='';
  h.forEach(function(x){
    var d=document.createElement('div');d.className='mitem';
    var dt=new Date(x.t);
    d.innerHTML='<span class="nm">'+esc(x.label)+'</span><span class="meta">'+((x.clips||[]).length)+' clips · '+dt.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})+'</span>';
    var b=document.createElement('button');b.className='ghost small';b.textContent='RESTORE';
    b.onclick=function(){
      S.clips=JSON.parse(JSON.stringify(x.clips||[]));
      S.captions=JSON.parse(JSON.stringify(x.captions||[]));
      S.musicId=x.musicId;S.style=x.style;S.capStyle=x.capStyle||'bold';
      drawTimeline();syncStyleChips();save();
      log('restored: '+x.label,true);
    };
    d.appendChild(b);el.appendChild(d);
  });
}
function histInit(){
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='Project history (restorable)';card.appendChild(h);
  var list=document.createElement('div');list.id='histList';list.className='note';list.textContent='no snapshots yet';card.appendChild(list);
  var row=document.createElement('div');row.className='btnrow';
  var snap=document.createElement('button');snap.className='ghost small';snap.textContent='SNAPSHOT NOW';
  snap.onclick=function(){
    if(!S.clips.length){log('nothing on the timeline to snapshot');return}
    pushHistory('manual snapshot');log('snapshot saved',true);
  };
  row.appendChild(snap);card.appendChild(row);
  $('page-export').appendChild(card);
}
agentInit();histInit();renderHistory();
