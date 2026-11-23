'use strict';
// PHASE 5-8 part 1: sound design studio, motion tracking, mood engine — real processing
var SD={comp:1,eq:1,duck:1,sfx:1};
try{Object.assign(SD,JSON.parse(localStorage.getItem('tk2sd')||'{}'))}catch(e){}
function sdSave(){try{localStorage.setItem('tk2sd',JSON.stringify(SD))}catch(e){}}
var AUD={};
var _noise=null;
function noiseBuf(actx){if(_noise)return _noise;var b=actx.createBuffer(1,Math.floor(actx.sampleRate*0.6),actx.sampleRate);var d=b.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=Math.random()*2-1;_noise=b;return b}
window.fxAudioHook=function(actx,master,mg){
  AUD.actx=actx;AUD.master=master;AUD.mg=mg||null;
  if(mg&&(SD.comp||SD.eq)){
    try{
      var comp=actx.createDynamicsCompressor();comp.threshold.value=-18;comp.knee.value=12;comp.ratio.value=3;comp.attack.value=.004;comp.release.value=.2;
      var low=actx.createBiquadFilter();low.type='lowshelf';low.frequency.value=180;low.gain.value=SD.eq?2.5:0;
      var high=actx.createBiquadFilter();high.type='highshelf';high.frequency.value=5200;high.gain.value=SD.eq?1.8:0;
      mg.disconnect();mg.connect(comp);comp.connect(low);low.connect(high);high.connect(master);
      AUD.chain=[comp,low,high];
    }catch(e){}
  }
};
function sfxImpact(at){var a=AUD.actx;if(!a||!SD.sfx)return;
  var o=a.createOscillator();o.type='sine';o.frequency.setValueAtTime(120,at);o.frequency.exponentialRampToValueAtTime(38,at+0.18);
  var g=a.createGain();g.gain.setValueAtTime(.7,at);g.gain.exponentialRampToValueAtTime(.001,at+0.25);
  o.connect(g);g.connect(AUD.master);o.start(at);o.stop(at+0.3);
  var nb=a.createBufferSource();nb.buffer=noiseBuf(a);var hp=a.createBiquadFilter();hp.type='highpass';hp.frequency.value=2200;
  var ng=a.createGain();ng.gain.setValueAtTime(.4,at);ng.gain.exponentialRampToValueAtTime(.001,at+0.08);
  nb.connect(hp);hp.connect(ng);ng.connect(AUD.master);nb.start(at);nb.stop(at+0.1);}
function sfxWhoosh(at){var a=AUD.actx;if(!a||!SD.sfx)return;
  var nb=a.createBufferSource();nb.buffer=noiseBuf(a);
  var bp=a.createBiquadFilter();bp.type='bandpass';bp.Q.value=1.2;
  bp.frequency.setValueAtTime(400,at);bp.frequency.exponentialRampToValueAtTime(3500,at+0.22);bp.frequency.exponentialRampToValueAtTime(300,at+0.4);
  var g=a.createGain();g.gain.setValueAtTime(.001,at);g.gain.exponentialRampToValueAtTime(.4,at+0.18);g.gain.exponentialRampToValueAtTime(.001,at+0.42);
  nb.connect(bp);bp.connect(g);g.connect(AUD.master);nb.start(at);nb.stop(at+0.5);}
window.fxTimelineHook=function(actx,master,t0,starts,total){
  AUD.actx=actx;AUD.master=master;
  if(!S.clips.length)return;
  if(AUD.mg&&SD.duck){
    var mgp=AUD.mg.gain,base=S.musicGain;
    try{
      mgp.cancelScheduledValues(t0);mgp.setValueAtTime(base,t0);
      S.clips.forEach(function(c,i){
        if(!c.keep)return;var s=t0+starts[i],e=s+clipOutDur(c);
        mgp.setValueAtTime(base,s);mgp.linearRampToValueAtTime(base*.25,s+.15);
        mgp.setValueAtTime(base*.25,Math.max(s+.16,e-.15));mgp.linearRampToValueAtTime(base,e);
      });
    }catch(e){}
  }
  if(SD.sfx)for(var i=1;i<S.clips.length;i++){
    var tr=S.clips[i].trans,at=t0+starts[i];
    if(tr==='punch'||tr==='flash'||tr==='shake')sfxImpact(at);
    else if(tr==='whip')sfxWhoosh(at);
  }
};
window.fxPreload=async function(SX){
  for(var i=0;i<SX.clips.length;i++){
    var k=SX.clips[i].key;
    if(k&&k.bgSrc&&!k.bg){
      try{
        var im=await new Promise(function(res,rej){var x=new Image();x.onload=function(){res(x)};x.onerror=rej;x.src=k.bgSrc});
        k.bg=im;k.ready=true;
      }catch(e){delete SX.clips[i].key}
    }
  }
};
window.trackPan=function(track,c){
  var W=S.res||720,H=W*16/9;
  var tm=c.start+(c.end-c.start)/2,best=track[0],bd=1e9;
  for(var i=0;i<track.length;i++){var d=Math.abs(track[i].t-tm);if(d<bd){bd=d;best=track[i]}}
  return{x:(0.5-best.x)*W*0.35,y:(0.5-best.y)*H*0.35};
};
// ---------- motion tracking (real block matching) ----------
async function trackMotion(m){
  if(!m||!m.dur)return;
  log('tracking motion: '+m.name);
  var fps=6,n=clamp(Math.ceil(m.dur*fps),8,120);
  var cv=document.createElement('canvas');cv.width=64;cv.height=114;
  var cx=cv.getContext('2d',{willReadFrequently:true});
  var el=document.createElement('video');el.src=m.url;el.muted=true;el.playsInline=true;el.preload='auto';
  await new Promise(function(res){el.onloadeddata=res;el.onerror=res;setTimeout(res,4000)});
  var BW=8,BH=8,gx=cv.width-BW,gy=cv.height-BH,track=[];
  var bx=-1,by=-1;
  for(var i=0;i<n;i++){
    var t=m.dur*(i+0.5)/n;
    try{await seekTo(el,t,2500)}catch(e){continue}
    try{cx.drawImage(el,0,0,cv.width,cv.height)}catch(e){continue}
    var d=cx.getImageData(0,0,cv.width,cv.height).data;
    var lum=new Float32Array(cv.width*cv.height);
    for(var j=0;j<lum.length;j++)lum[j]=0.299*d[j*4]+0.587*d[j*4+1]+0.114*d[j*4+2];
    if(bx<0){
      var bestv=-1;
      for(var yy=2;yy<gy-2;yy+=2)for(var xx=2;xx<gx-2;xx+=2){
        var v=0,mv2=0;
        for(var y2=0;y2<BH;y2++)for(var x2=0;x2<BW;x2++){var l=lum[(yy+y2)*cv.width+xx+x2];v+=l;mv2+=l*l}
        var va=mv2/(BW*BH)-(v/(BW*BH))*(v/(BW*BH));
        if(va>bestv){bestv=va;bx=xx;by=yy}
      }
    } else {
      var bd=1e9,nbx=bx,nby=by;
      for(var dy=-6;dy<=6;dy+=2)for(var dx=-6;dx<=6;dx+=2){
        var xx3=clamp(bx+dx,0,gx),yy3=clamp(by+dy,0,gy),e2=0;
        for(var y3=0;y3<BH;y3++)for(var x3=0;x3<BW;x3++)e2+=Math.abs(lum[(yy3+y3)*cv.width+xx3+x3]-lum[(by+y3)*cv.width+bx+x3]);
        if(e2<bd){bd=e2;nbx=xx3;nby=yy3}
      }
      bx=nbx;by=nby;
    }
    track.push({t:t,x:(bx+BW/2)/cv.width,y:(by+BH/2)/cv.height});
  }
  m.track=track;
  log(m.name+': subject tracked across '+track.length+' frames',true);
  renderTrackList();save();
}
// ---------- loudness intelligence ----------
async function audioIntel(){
  var vids=videoMedias();
  if(!vids.length){log('no footage');return}
  var target=0.08;
  var actx=new (window.AudioContext||window.webkitAudioContext)();
  for(var i=0;i<vids.length;i++){
    var m=vids[i];
    try{
      var buf=await actx.decodeAudioData(await m.blob.arrayBuffer());
      var ch=buf.getChannelData(0),step=Math.max(1,Math.floor(ch.length/2000)),s=0,n=0;
      for(var j=0;j<ch.length;j+=step){s+=ch[j]*ch[j];n++}
      var rms=Math.sqrt(s/Math.max(1,n));
      m.rms=rms;
      var gain=rms>0.001?clamp(target/rms,0.5,2):1;
      S.clips.forEach(function(c){if(c.src===m.id)c.again=Math.round(gain*100)/100});
      log(m.name+': loudness '+rms.toFixed(3)+' → clip gain x'+gain.toFixed(2));
    }catch(e){log(m.name+': no readable audio')}
  }
  actx.close();save();drawTimeline();
  log('loudness normalized (target RMS '+target+')',true);
}
// ---------- mood engine ----------
function moodRead(){
  var vids=videoMedias();
  if(!vids.length)return null;
  var sat=0,brt=0,mo=0,nv=0;
  vids.forEach(function(m){if(m.stats){sat+=m.stats.sat;brt+=m.stats.bright;var s=m.scenes||[],mm2=0;if(s.length){s.forEach(function(x){mm2+=x.score});mm2/=s.length}mo+=mm2;nv++}});
  if(!nv)return null;
  sat/=nv;brt/=nv;mo/=nv;
  var mus=S.musicId&&M[S.musicId]?M[S.musicId]:null;
  var energy=mus&&mus.energy&&mus.energy.peaks&&mus.energy.peaks.length>4?1:0;
  var mood,map;
  if(energy&&mo>10){mood='energetic';map=['football','velocity','gaming']}
  else if(brt<0.34&&sat<0.28){mood='dark';map=['dark','phonk']}
  else if(sat<0.2&&mo<8){mood='melancholic';map=['emotional','documentary']}
  else if(energy){mood='epic';map=['marvel','movies']}
  else{mood='chill';map=['cinematic','luxury']}
  return{mood:mood,styles:map,sat:sat,brt:brt,motion:mo,energy:energy};
}
// ---------- ui ----------
function audioInit(){
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='AI sound design studio';card.appendChild(h);
  [['comp','COMPRESSOR'],['eq','WARM EQ'],['duck','AUTO DUCK MUSIC'],['sfx','TRANSITION SFX']].forEach(function(r){
    var d=document.createElement('div');d.className='kv';
    d.innerHTML='<span>'+r[1]+'</span>';
    var b=document.createElement('button');b.className='ghost small';b.style.width='74px';b.textContent=SD[r[0]]?'ON':'OFF';
    b.onclick=function(){SD[r[0]]=SD[r[0]]?0:1;b.textContent=SD[r[0]]?'ON':'OFF';sdSave();log(r[1].toLowerCase()+' '+(SD[r[0]]?'on':'off'))};
    d.appendChild(b);card.appendChild(d);
  });
  var row=document.createElement('div');row.className='btnrow';
  var b1=document.createElement('button');b1.className='ghost small';b1.textContent='LOUDNESS NORMALIZE';b1.onclick=audioIntel;
  row.appendChild(b1);card.appendChild(row);
  var note=document.createElement('div');note.className='note';
  note.textContent='compressor + eq master the music and sfx bus; duck drops music under your original audio; sfx are synthesized per transition type; loudness normalize evens out clip volumes. all apply on next preview/export.';
  card.appendChild(note);
  $('page-studio').appendChild(card);
}
function renderTrackList(){
  var el=$('trackList');if(!el)return;
  var vids=videoMedias();
  if(!vids.length){el.innerHTML='<div class="note">no footage yet</div>';return}
  el.innerHTML='';
  vids.forEach(function(m){
    var d=document.createElement('div');d.className='mitem';
    d.innerHTML='<span class="nm">'+esc(m.name)+'</span><span class="meta">'+(m.track?'tracked · '+m.track.length+' pts':'not tracked')+'</span>';
    var b=document.createElement('button');b.className='ghost small';b.textContent=m.track?'RETRACK':'TRACK';
    b.onclick=async function(){b.disabled=true;await trackMotion(m);b.disabled=false};
    d.appendChild(b);el.appendChild(d);
  });
}
function trackInit(){
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='Intelligent motion tracking';card.appendChild(h);
  var list=document.createElement('div');list.id='trackList';card.appendChild(list);
  var note=document.createElement('div');note.className='note';
  note.textContent='block-matching tracker follows the busiest subject through each video. after tracking, tap a clip in the timeline and switch SUBJECT LOCK on — the camera pans to keep the subject centered.';
  card.appendChild(note);
  $('page-library').appendChild(card);
  renderTrackList();
}
function moodInit(){
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='Emotion + mood analysis';card.appendChild(h);
  var kv=document.createElement('div');kv.className='kv';kv.innerHTML='<span id="moodRead">tap read below</span>';card.appendChild(kv);
  var row=document.createElement('div');row.className='btnrow';
  var b1=document.createElement('button');b1.className='ghost small';b1.textContent='READ MOOD';
  b1.onclick=function(){
    var mr=moodRead();
    $('moodRead').innerHTML=mr?('footage reads <b>'+mr.mood+'</b> (saturation '+mr.sat.toFixed(2)+', brightness '+mr.brt.toFixed(2)+', motion '+mr.motion.toFixed(0)+(mr.energy?', high music energy':'')+') → fits '+(STYLES[mr.styles[0]]?STYLES[mr.styles[0]].label:mr.styles[0])):'add analyzed footage first';
    if(mr)window.__mood=mr;
  };
  var b2=document.createElement('button');b2.className='ghost small';b2.textContent='MATCH STYLE TO MOOD';
  b2.onclick=function(){
    var mr=window.__mood||moodRead();window.__mood=mr;
    if(!mr){log('add analyzed footage first');return}
    S.style=mr.styles[0];syncStyleChips();save();
    log('style matched to mood: '+STYLES[S.style].label,true);
  };
  row.appendChild(b1);row.appendChild(b2);card.appendChild(row);
  $('page-studio').appendChild(card);
}
audioInit();trackInit();moodInit();
