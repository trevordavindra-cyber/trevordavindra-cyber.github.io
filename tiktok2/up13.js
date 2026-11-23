'use strict';
// up13.js — PHASE 7 POLISH LAB PACK (Nov 23 2026)
// smart trim, zoom rhythm, auto color match, text presets, safe zones,
// waveform strip, speed flow arc, hook lab, caption pacer, repetition killer.
// Extends existing state (S.clips/S.overlays/S.captions/M) and hook chains; nothing removed.
(function(){
function $(id){return document.getElementById(id)}
function lsGet(k,d){try{var v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
var SAFE={on:lsGet('tk2safe',false)};
var WF={cv:null,on:lsGet('tk2wf',true)};

// ---------- 1. SMART TRIM: cut the weakest edges using real scene scores ----------
function clipScore(c){
  var m=M[c.src];if(!m||!m.scenes||!m.scenes.length)return null;
  var mid=c.start+(c.end-c.start)*0.5,dur=c.end-c.start;
  var best=null;
  for(var i=0;i<m.scenes.length;i++){var sc=m.scenes[i];
    if(sc.start<=mid&&sc.end>=mid){best=sc.score;break}
    if(sc.start>mid){best=sc.score;break}}
  return best===null?null:best;
}
function sceneScoreAt(m,t){
  if(!m||!m.scenes||!m.scenes.length)return null;
  for(var i=0;i<m.scenes.length;i++){if(t>=m.scenes[i].start&&t<=m.scenes[i].end)return m.scenes[i].score}
  return null;
}
function smartTrim(){
  if(!S.clips.length){log('no clips yet');return}
  var cut=0,n=0;
  S.clips.forEach(function(c){
    var m=M[c.src];if(!m)return;
    var maxTrim=0.5,minDur=0.6;
    var s0=sceneScoreAt(m,c.start),s1=sceneScoreAt(m,c.end-0.01);
    var med=null;
    if(m.scenes&&m.scenes.length){var arr=m.scenes.map(function(x){return x.score}).sort(function(a,b){return a-b});med=arr[Math.floor(arr.length/2)]||0}
    if(s0!==null&&med!==null&&s0<med*0.55){var t=Math.min(maxTrim,(c.end-c.start)*0.25);c.start+=t;cut+=t;n++}
    if(s1!==null&&med!==null&&s1<med*0.55){var t2=Math.min(maxTrim,(c.end-c.start)*0.25);c.end-=t2;cut+=t2;n++}
    if(c.end-c.start<minDur){c.end=c.start+minDur}
  });
  if(!n){log('no weak edges found — footage is already tight',true);return}
  drawTimeline();save();
  log('smart trim: trimmed '+n+' weak edges, saved '+cut.toFixed(1)+'s',true);
}

// ---------- 2. ZOOM RHYTHM: alternating punch-in cycle ----------
function zoomRhythm(){
  if(!S.clips.length){log('no clips yet');return}
  var seq=[1.0,1.09,1.0,1.16];
  S.clips.forEach(function(c,i){c.zoom=seq[i%4]});
  drawTimeline();save();
  log('zoom rhythm set: alternating punch cycle across '+S.clips.length+' clips',true);
}

// ---------- 3. AUTO COLOR MATCH: match every clip to the reference clip ----------
function sampleFrame(m,t){
  return new Promise(function(res){
    try{
      var el=m.el;if(!el){res(null);return}
      var done=false;
      var onS=function(){if(done)return;done=true;el.removeEventListener('seeked',onS);
        try{var cv=document.createElement('canvas');cv.width=48;cv.height=85;var cx=cv.getContext('2d');
          cx.drawImage(el,0,0,48,85);var d=cx.getImageData(0,0,48,85).data;
          var r=0,g=0,b=0,n=0;for(var i=0;i<d.length;i+=4){r+=d[i];g+=d[i+1];b+=d[i+2];n++}
          res({r:r/n,g:g/n,b:b/n});
        }catch(e){res(null)}};
      el.addEventListener('seeked',onS);
      try{el.currentTime=Math.max(0.05,t)}catch(e){onS()}
      setTimeout(function(){if(!done){done=true;el.removeEventListener('seeked',onS);res(null)}},900);
    }catch(e){res(null)}
  });
}
function cmStrip(s,cm){return s?s.split(cm).join('').trim():s}
function colorMatch(){
  if(S.clips.length<2){log('need at least 2 clips to color match');return}
  log('sampling frames for color match…',true);
  var clips=S.clips.slice(0,12);
  (async function(){
    var ref=null;
    for(var i=0;i<clips.length;i++){
      var m=M[clips[i].src];if(!m)continue;
      var f=await sampleFrame(m,clips[i].start+0.2);
      if(!f)continue;
      if(i===0){ref=f;continue}
      var rl=(ref.r*0.299+ref.g*0.587+ref.b*0.114);
      var cl=(f.r*0.299+f.g*0.587+f.b*0.114);
      var rsat=(Math.max(ref.r,ref.g,ref.b)-Math.min(ref.r,ref.g,ref.b))/255;
      var csat=(Math.max(f.r,f.g,f.b)-Math.min(f.r,f.g,f.b))/255;
      var br=clamp(rl/Math.max(6,cl),0.85,1.2);
      var sa=clamp(rsat/Math.max(0.02,csat),0.85,1.2);
      var f2=[];
      if(Math.abs(br-1)>0.03)f2.push('brightness('+br.toFixed(2)+')');
      if(Math.abs(sa-1)>0.03)f2.push('saturate('+sa.toFixed(2)+')');
      var cm=f2.length?' '+f2.join(' '):'';
      var c=clips[i];
      if(c.cm){c.gradeExtra=cmStrip(c.gradeExtra,c.cm)}
      c.cm=cm;
      if(cm)c.gradeExtra=((c.gradeExtra||'')+' '+cm).trim();
    }
    drawTimeline();save();
    log('color match done: '+clips.length+' clips matched to clip 1 (clearing the grade look also clears match)',true);
  })();
}
function clearColorMatch(){
  var n=0;S.clips.forEach(function(c){if(c.cm){c.gradeExtra=cmStrip(c.gradeExtra,c.cm);c.cm='';n++}});
  if(!n){log('no color match applied');return}
  drawTimeline();save();log('color match cleared on '+n+' clips',true);
}

// ---------- 4. TEXT PRESETS: one-tap styled kinetic text ----------
var PRESETS=[
  {label:'CINEMA TITLE',text:'THE BEGINNING',anim:'slideup',y:0.42,size:52,color:'#fff',glow:'rgba(255,255,255,.55)'},
  {label:'NEON LOWER THIRD',text:'@yourhandle',anim:'wave',y:0.8,size:40,color:'#0ff',glow:'rgba(0,229,255,.9)'},
  {label:'HYPE STICKER',text:'INSANE',anim:'pop',y:0.35,size:84,color:'#ff2d78',glow:'rgba(255,45,120,.8)'},
  {label:'KARAOKE POP',text:'SING IT',anim:'typewriter',y:0.68,size:58,color:'#fff',glow:'rgba(255,230,0,.7)'},
  {label:'TICKER',text:'scroll for more',anim:'shake',y:0.9,size:34,color:'#ffe14d',glow:'rgba(255,180,0,.6)'}
];
function textPreset(p){
  var txt=($('p7Txt')&&$('p7Txt').value||'').trim()||p.text;
  var dur=clamp(parseFloat($('p7Dur')&&$('p7Dur').value)||2.5,0.4,20);
  var t0=clamp(parseFloat($('p7At')&&$('p7At').value)||0,0,Math.max(1,totalDur()-0.3));
  S.overlays=S.overlays||[];
  S.overlays.push({id:uid(),text:txt,t0:t0,t1:t0+dur,x:0.5,y:p.y,size:p.size,color:p.color,glow:p.glow,anim:p.anim});
  if($('p7Txt'))$('p7Txt').value='';
  drawTimeline();save();
  log('text preset added ('+p.label+'): "'+txt+'"',true);
}

// ---------- 5. SAFE ZONES overlay + fit text to safe area ----------
function safeFit(){
  var n=0;(S.overlays||[]).forEach(function(o){
    if(o.y<0.14){o.y=0.14;n++}else if(o.y>0.76){o.y=0.76;n++}
  });
  if(!n){log('all text layers are already inside the safe area');return}
  drawTimeline();save();log('moved '+n+' text layers into the safe area',true);
}

// ---------- 6. WAVEFORM STRIP under the music track ----------
function peaksOf(m){
  return new Promise(function(res){
    if(!m){res(null);return}
    var build=function(buf){
      try{
        var ch=buf.getChannelData(0),N=160,per=Math.floor(ch.length/N),out=[];
        for(var i=0;i<N;i++){var mx=0;for(var j=0;j<per;j+=8){var v=Math.abs(ch[i*per+j]);if(v>mx)mx=v}out.push(mx)}
        res(out);
      }catch(e){res(null)}
    };
    if(m.buf&&m.buf.getChannelData){build(m.buf);return}
    try{
      fetch(m.url).then(function(r){return r.arrayBuffer()}).then(function(ab){
        var AC=window.AudioContext||window.webkitAudioContext;if(!AC){res(null);return}
        var ac=new AC();ac.decodeAudioData(ab,function(buf){build(buf);ac.close&&ac.close()},function(){res(null)});
      }).catch(function(){res(null)});
    }catch(e){res(null)}
  });
}
var wfData=null,wfKey='';
function renderWave(){
  if(!WF.cv)return;
  var cx=WF.cv.getContext('2d');var Wd=WF.cv.width=WF.cv.offsetWidth*2||640;var Hd=WF.cv.height=72;
  cx.clearRect(0,0,Wd,Hd);
  cx.fillStyle='rgba(0,229,255,.08)';cx.fillRect(0,0,Wd,Hd);
  var tot=Math.max(0.1,totalDur());
  if(!S.musicId||!M[S.musicId]){cx.fillStyle='rgba(160,190,210,.6)';cx.font='20px monospace';cx.fillText('waveform: no music',12,44);return}
  if(wfData&&wfKey===S.musicId){
    var mid=Hd*0.55;
    cx.fillStyle='rgba(0,229,255,.75)';
    for(var i=0;i<wfData.length;i++){
      var x=i/wfData.length*Wd,h=Math.min(Hd*0.45,Math.max(2,wfData[i]*Hd*0.9));
      cx.fillRect(x,mid-h/2,Math.max(2,Wd/wfData.length-2),h);
    }
    var beats=(M[S.musicId].beats)||[];
    cx.fillStyle='rgba(255,45,120,.8)';
    beats.forEach(function(b){var x=b/tot*Wd;if(x>=0&&x<=Wd)cx.fillRect(x,0,2,10)});
    cx.fillStyle='rgba(160,190,210,.7)';cx.font='20px monospace';
    cx.fillText((M[S.musicId].name||'music').slice(0,18)+' · '+(M[S.musicId].bpm||'?')+'bpm · pink ticks are beats',12,Hd-8);
  }else{
    cx.fillStyle='rgba(160,190,210,.6)';cx.font='20px monospace';cx.fillText('waveform: reading music…',12,44);
    var key=S.musicId;peaksOf(M[S.musicId]).then(function(p){if(p&&key===S.musicId){wfData=p;wfKey=key;renderWave()}});
  }
}

// ---------- 7. SPEED FLOW: graduated pace arc across the timeline ----------
function speedFlow(){
  if(!S.clips.length){log('no clips yet');return}
  var a=clamp(parseFloat($('p7SpA')&&$('p7SpA').value)||0.85,0.4,2),b=clamp(parseFloat($('p7SpB')&&$('p7SpB').value)||1.35,0.4,2.5);
  var n=S.clips.length;
  S.clips.forEach(function(c,i){c.speed=+(a+(b-a)*(n<2?0:i/(n-1))).toFixed(2)});
  drawTimeline();save();
  log('speed flow set: '+a+'x at the open ramping to '+b+'x at the close across '+n+' clips',true);
}

// ---------- 8. HOOK LAB: three hook candidates on the opening ----------
var HOOKS=[
  function(nm){return 'wait for it…'},
  function(nm){return 'nobody watches this part — except you'},
  function(nm){return '3 seconds in and it flips'}
];
var hookIds=[];
function hookLab(){
  if(!S.clips.length){log('no clips yet');return}
  hookIds.forEach(function(id){var ix=(S.overlays||[]).findIndex(function(o){return o.id===id});if(ix>-1)S.overlays.splice(ix,1)});
  hookIds=[];
  S.overlays=S.overlays||[];
  var nm=(S.clips[0]&&M[S.clips[0].src]&&M[S.clips[0].src].name)||'';
  HOOKS.forEach(function(f,i){
    var o={id:uid(),text:f(nm),t0:0,t1:2.2,x:0.5,y:0.3+i*0.06,size:54,color:'#fff',glow:'rgba(0,229,255,.85)',anim:'pop',hook:1};
    S.overlays.push(o);hookIds.push(o.id);
  });
  drawTimeline();save();
  log('hook lab: 3 hooks on the opening — keep one below',true);
}
function hookKeep(i){
  if(!hookIds.length){log('build the hooks first');return}
  var keep=hookIds[i];
  hookIds.forEach(function(id){if(id!==keep){var ix=(S.overlays||[]).findIndex(function(o){return o.id===id});if(ix>-1)S.overlays.splice(ix,1)}});
  var kept=(S.overlays||[]).find(function(o){return o.id===keep});
  if(kept){kept.t1=2.6;kept.y=0.32}
  hookIds=[];
  drawTimeline();save();
  log('hook kept: "'+(kept&&kept.text||'')+'"',true);
}

// ---------- 9. CAPTION PACER: even spacing or punch timing ----------
function capsEven(){
  if(!S.captions.length){log('no captions yet');return}
  var tot=totalDur(),n=S.captions.length,slot=tot/n;
  S.captions.forEach(function(c,i){var w=Math.min(slot*0.92,Math.max(0.8,(c.t1-c.t0)));c.t0=+(i*slot).toFixed(2);c.t1=+(c.t0+w).toFixed(2)});
  drawTimeline();save();
  log('captions spread evenly: '+n+' lines across '+tot.toFixed(1)+'s',true);
}
function capsPunch(){
  if(!S.captions.length){log('no captions yet');return}
  var beats=(S.musicId&&M[S.musicId]&&M[S.musicId].beats)||[];
  var t=0,n=S.captions.length;
  S.captions.forEach(function(c,i){
    var w=Math.min(1.6,Math.max(0.7,(c.t1-c.t0)));
    if(beats.length){
      var bi=0;while(bi<beats.length&&beats[bi]<t-0.05)bi++;
      if(bi<beats.length)t=beats[bi];
    }
    c.t0=+t.toFixed(2);c.t1=+(t+w).toFixed(2);t+=w+0.12;
  });
  drawTimeline();save();
  log('punch captions: max 1.6s per line'+(beats.length?', snapped to beats':''),true);
}

// ---------- 10. REPETITION KILLER: vary near-duplicate back-to-back clips ----------
function repKill(){
  var n=0;
  for(var i=1;i<S.clips.length;i++){
    var a=S.clips[i-1],b=S.clips[i];
    if(a.src===b.src&&Math.abs(a.start-b.start)<0.3){
      b.zoom=+( (b.zoom||1)*(i%2?0.92:1.09) ).toFixed(2);
      b.speed=+clamp((b.speed||1)*(i%2?1.12:0.9),0.4,2.5).toFixed(2);
      b.trans=(i%3===0)?'whip':(i%3===1?'flash':'punch');
      n++;
    }
  }
  if(!n){log('no near-duplicate runs found',true);return}
  drawTimeline();save();
  log('repetition killer: varied '+n+' duplicate clips (zoom, speed, transition)',true);
}

// ---------- hook chain: safe-zone overlay rides fxFrameHook ----------
var prevFrame=window.fxFrameHook;
window.fxFrameHook=function(ctx,t,W,H){
  if(prevFrame)try{prevFrame(ctx,t,W,H)}catch(e){}
  if(SAFE.on){
    ctx.save();
    ctx.strokeStyle='rgba(255,45,120,.55)';ctx.lineWidth=2;ctx.setLineDash([8,6]);
    ctx.strokeRect(W*0.82,0,W*0.18,H*0.12);
    ctx.strokeRect(W*0.82,H*0.12,W*0.18,H*0.66);
    ctx.strokeRect(0,H*0.78,W,H*0.22);
    ctx.fillStyle='rgba(255,45,120,.8)';ctx.font='16px monospace';
    ctx.fillText('SAFE ZONES',W*0.84,H*0.115);
    ctx.restore();
  }
};

// ---------- drawTimeline wrap: waveform strip + safe-zone label refresh ----------
var prevDT=window.drawTimeline;
window.drawTimeline=function(){
  if(prevDT)try{prevDT()}catch(e){}
  if(WF.cv&&WF.on)renderWave();
};

// ---------- UI ----------
function build(){
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='Polish Lab (Phase 7)';card.appendChild(h);
  card.appendChild(mkRow([mkBtn('SMART TRIM',smartTrim,'0 0 48%','p7Trim'),mkBtn('ZOOM RHYTHM',zoomRhythm,'0 0 48%','p7Zoom')]));
  card.appendChild(mkRow([mkBtn('AUTO COLOR MATCH',colorMatch,'0 0 48%','p7Cm'),mkBtn('CLEAR MATCH',clearColorMatch,'0 0 48%','p7CmC')]));
  var txt=document.createElement('input');txt.id='p7Txt';txt.className='inp';txt.placeholder='text (blank = preset default)';txt.style.flex='1 1 100%';
  card.appendChild(txt);
  var pr=mkSel('p7Preset',PRESETS.map(function(p){return p.label}),PRESETS.map(function(_,i){return String(i)}));
  card.appendChild(mkRow([pr,mkBtn('ADD TEXT PRESET',function(){
    var i=parseInt($('p7Preset').value)||0;textPreset(PRESETS[i]);
  },'0 0 40%','p7Tp')]));
  card.appendChild(mkRow([mkBtn('SAFE ZONES '+(SAFE.on?'ON':'OFF'),function(){
    SAFE.on=!SAFE.on;lsSet('tk2safe',SAFE.on);this.textContent='SAFE ZONES '+(SAFE.on?'ON':'OFF');log('safe zones '+(SAFE.on?'on — guides show where the app UI covers your edit':'off'),true);
  },'0 0 48%','p7Safe'),mkBtn('FIT TEXT TO SAFE AREA',safeFit,'0 0 48%','p7Fit')]));
  card.appendChild(mkRow([mkBtn('SPEED FLOW',speedFlow,'0 0 32%','p7Sf'),
    (function(){var a=document.createElement('input');a.id='p7SpA';a.type='number';a.step='0.05';a.value='0.85';a.className='inp';a.placeholder='start x';a.style.flex='0 0 16%';return a})(),
    (function(){var b=document.createElement('input');b.id='p7SpB';b.type='number';b.step='0.05';b.value='1.35';b.className='inp';b.placeholder='end x';b.style.flex='0 0 16%';return b})()]));
  card.appendChild(mkRow([mkBtn('HOOK LAB (3 HOOKS)',hookLab,'0 0 64%','p7Hook'),
    mkBtn('KEEP 1',function(){hookKeep(0)},'0 0 12%','p7K1'),
    mkBtn('2',function(){hookKeep(1)},'0 0 12%','p7K2'),
    mkBtn('3',function(){hookKeep(2)},'0 0 12%','p7K3')]));
  card.appendChild(mkRow([mkBtn('EVEN CAPTIONS',capsEven,'0 0 48%','p7Ce'),mkBtn('PUNCH CAPTIONS',capsPunch,'0 0 48%','p7Cp')]));
  card.appendChild(mkRow([mkBtn('REPETITION KILLER',repKill,'0 0 48%','p7Rep'),
    mkBtn('WAVEFORM '+(WF.on?'ON':'OFF'),function(){
      WF.on=!WF.on;lsSet('tk2wf',WF.on);this.textContent='WAVEFORM '+(WF.on?'ON':'OFF');
      WF.cv.style.display=WF.on?'block':'none';if(WF.on)renderWave();log('waveform strip '+(WF.on?'on':'off'),true);
    },'0 0 48%','p7Wf')]));
  var nn=document.createElement('div');nn.className='note';
  nn.textContent='polish lab: SMART TRIM cuts weak footage edges using scene scores, ZOOM RHYTHM alternates punch-ins, AUTO COLOR MATCH matches every clip to your first clip, text presets add styled kinetic text, SAFE ZONES show where the TikTok app UI sits, SPEED FLOW ramps pace from open to close, HOOK LAB tests three opening hooks, caption pacer evens or punches caption timing, and the repetition killer varies duplicate clips.';
  card.appendChild(nn);
  var anchor=null;
  var hs=document.querySelectorAll('.card h2');
  for(var i=0;i<hs.length;i++){if(hs[i].textContent==='Creator Tools'){anchor=hs[i].parentElement;break}}
  if(anchor&&anchor.parentElement){
    if(anchor.nextSibling)anchor.parentElement.insertBefore(card,anchor.nextSibling);
    else anchor.parentElement.appendChild(card);
  }else{var ps=$('page-studio');if(ps)ps.appendChild(card)}
  // waveform strip under the music track
  try{
    var tm=$('trMusic');
    if(tm&&tm.parentNode){
      var cv=document.createElement('canvas');cv.id='p7Wave';cv.style.width='100%';cv.style.height='36px';cv.style.marginTop='4px';cv.style.borderRadius='8px';cv.style.display=WF.on?'block':'none';
      tm.parentNode.insertBefore(cv,tm.nextSibling);
      WF.cv=cv;renderWave();
    }
  }catch(e){}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
log('polish lab live (up13)',true);
})();