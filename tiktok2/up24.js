'use strict';
// up24.js — PHASE 18 AUDIO LAB (Nov 23 2026)
// music balance, beat offset nudge, waveform strip, four synth sfx,
// audio report, silence scan, music length check
(function(){
if(window.__tk2up24)return;window.__tk2up24=1;
function $(id){return document.getElementById(id)}
function mkBtn(t,fn,fl,id){var b=document.createElement('button');b.className='btn';b.textContent=t;b.style.flex=fl||'0 0 auto';if(id)b.id=id;b.onclick=fn;return b}
function mkRow(gap){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap=(gap||6)+'px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function mkList(id){var l=document.createElement('div');l.id=id;l.style.marginTop='6px';return l}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function saveE(){try{if(typeof save==='function')save()}catch(e){}}
function cur(){return S.clips.find(function(x){return x.id===S.selected})}
function clampC(v,a,b){return Math.max(a,Math.min(b,v))}
function clipDur(c){return (c.end-c.start)/(c.speed||1)}
function totalDur(){return S.clips.reduce(function(a,c){return a+clipDur(c)},0)}

async function musicBuf(){
  if(!S.musicId||!M[S.musicId]){log('no music loaded — add an audio file in the library first');return null}
  var mm=M[S.musicId];
  if(!mm.buf){
    try{
      var actx=new (window.AudioContext||window.webkitAudioContext)();
      mm.buf=await actx.decodeAudioData(await mm.blob.arrayBuffer());
      try{actx.close()}catch(e){}
    }catch(e){log('music could not be decoded');return null}
  }
  return mm.buf;
}

// 1 music balance (engine music gain)
function setBalance(){
  var v=parseFloat($('f24bal').value);
  if(isNaN(v)||v<0||v>2){log('enter music volume 0 to 2 (1 = 100%)');return}
  S.musicGain=v;saveE();
  log('music balance set: '+Math.round(v*100)+'% — the preview mix plays music at this level',true);
}
// 2 beat offset nudge (engine music offset, seconds)
function nudge(dir){
  S.musicOffset=clampC((S.musicOffset||0)+dir*0.1,-30,30);
  saveE();
  log('music shifted '+(dir>0?'+':'')+S.musicOffset.toFixed(1)+'s against the timeline',true);
}
// 3 waveform strip (decode + draw the music along the timeline length)
function drawWave(){
  musicBuf().then(function(buf){
    if(!buf)return;
    var cv=$('f24wave');
    if(!cv){cv=document.createElement('canvas');cv.id='f24wave';cv.width=320;cv.height=64;cv.style.width='100%';cv.style.border='1px solid #1c2740';cv.style.borderRadius='8px';cv.style.background='#05090f';cv.style.marginTop='8px';$('f24wavebox').appendChild(cv)}
    var ctx=cv.getContext('2d');ctx.fillStyle='#05090f';ctx.fillRect(0,0,320,64);
    var ch=buf.getChannelData(0),sr=buf.sampleRate,cols=160,td=totalDur()||1;
    for(var i=0;i<cols;i++){
      // timeline second mapped back to music source second (offset applied, loops)
      var ts=td*i/cols;
      var src=((S.musicOffset||0)+ts)%buf.duration;
      var a=Math.max(0,Math.round((src-0.08)*sr)),b=Math.min(ch.length,Math.round((src+0.08)*sr));
      var pk=0;for(var j=a;j<b;j+=4){var v=Math.abs(ch[j]);if(v>pk)pk=v}
      var h=Math.max(1,pk*26);
      ctx.fillStyle=pk>0.5?'#ff2d55':'#00e5ff';
      ctx.fillRect(i*2,32-h,1.4,h*2);
    }
    ctx.fillStyle='#7d90b6';ctx.font='9px monospace';
    ctx.fillText('music wave across '+td.toFixed(1)+'s timeline (red = loud)',6,61);
    log('waveform drawn: '+td.toFixed(1)+'s timeline mapped across the music (offset '+(S.musicOffset||0).toFixed(1)+'s included)',true);
  });
}
// 4-7 synth sfx via OfflineAudioContext, real WAVs added to the media library
function encWav(buf){
  var n=buf.length,chs=buf.numberOfChannels,sr=buf.sampleRate,b16=n*chs*2;
  var ab=new ArrayBuffer(44+b16),v=new DataView(ab);
  function wstr(o,s){for(var i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i))}
  wstr(0,'RIFF');v.setUint32(4,36+b16,true);wstr(8,'WAVE');wstr(12,'fmt ');
  v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,chs,true);
  v.setUint32(24,sr,true);v.setUint32(28,sr*chs*2,true);v.setUint16(32,chs*2,true);v.setUint16(34,16,true);
  wstr(36,'data');v.setUint32(40,b16,true);
  var off=44;var chsD=[];for(var c=0;c<chs;c++)chsD.push(buf.getChannelData(c));
  for(var i=0;i<n;i++)for(var c2=0;c2<chs;c2++){var s=Math.max(-1,Math.min(1,chsD[c2][i]));v.setInt16(off,s<0?s*32768:s*32767,true);off+=2}
  return new Blob([ab],{type:'audio/wav'});
}
function noiseSrc(oc,dur){
  var nb=oc.createBuffer(1,Math.ceil(oc.sampleRate*dur),oc.sampleRate);
  var d=nb.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  var s=oc.createBufferSource();s.buffer=nb;return s;
}
function makeFx(kind){
  var spec={whoosh:{d:1.2},pop:{d:0.25},riser:{d:2.0},boom:{d:1.6}}[kind];
  if(!spec)return log('unknown fx');
  var oc=new OfflineAudioContext(1,Math.ceil(44100*spec.d),44100);
  var g=oc.createGain();g.connect(oc.destination);
  if(kind==='whoosh'){
    var s=noiseSrc(oc,spec.d);var f=oc.createBiquadFilter();f.type='bandpass';f.Q.value=1.4;
    f.frequency.setValueAtTime(300,0);f.frequency.exponentialRampToValueAtTime(3200,spec.d*0.55);
    f.frequency.exponentialRampToValueAtTime(500,spec.d);
    s.connect(f);f.connect(g);
    g.gain.setValueAtTime(0.0001,0);g.gain.exponentialRampToValueAtTime(0.9,spec.d*0.45);
    g.gain.exponentialRampToValueAtTime(0.0001,spec.d);s.start(0);
  }else if(kind==='pop'){
    var o=oc.createOscillator();o.type='sine';
    o.frequency.setValueAtTime(380,0);o.frequency.exponentialRampToValueAtTime(900,0.09);
    o.connect(g);g.gain.setValueAtTime(0.9,0);g.gain.exponentialRampToValueAtTime(0.0001,spec.d);o.start(0);o.stop(spec.d);
  }else if(kind==='riser'){
    var o2=oc.createOscillator();o2.type='sawtooth';
    o2.frequency.setValueAtTime(110,0);o2.frequency.exponentialRampToValueAtTime(1050,spec.d);
    var f2=oc.createBiquadFilter();f2.type='lowpass';f2.frequency.setValueAtTime(900,0);f2.frequency.exponentialRampToValueAtTime(6000,spec.d);
    o2.connect(f2);f2.connect(g);
    g.gain.setValueAtTime(0.05,0);g.gain.exponentialRampToValueAtTime(0.75,spec.d*0.92);g.gain.exponentialRampToValueAtTime(0.0001,spec.d);o2.start(0);o2.stop(spec.d);
    var s2=noiseSrc(oc,spec.d);var g2=oc.createGain();g2.gain.value=0.12;s2.connect(g2);g2.connect(oc.destination);s2.start(0);
  }else if(kind==='boom'){
    var o3=oc.createOscillator();o3.type='sine';
    o3.frequency.setValueAtTime(85,0);o3.frequency.exponentialRampToValueAtTime(32,spec.d*0.8);
    o3.connect(g);g.gain.setValueAtTime(1.0,0);g.gain.exponentialRampToValueAtTime(0.0001,spec.d);o3.start(0);o3.stop(spec.d);
    var s3=noiseSrc(oc,spec.d);var f3=oc.createBiquadFilter();f3.type='lowpass';f3.frequency.value=220;
    var g3=oc.createGain();g3.gain.setValueAtTime(0.4,0);g3.gain.exponentialRampToValueAtTime(0.0001,spec.d*0.9);
    s3.connect(f3);f3.connect(g3);g3.connect(oc.destination);s3.start(0);
  }
  oc.startRendering().then(function(buf){
    var blob=encWav(buf);
    addMedia(new File([blob],'tk2-'+kind+'-fx.wav',{type:'audio/wav'}),'audio').then(function(m){
      log('added '+m.name+' ('+spec.d.toFixed(1)+'s sfx) — it is in the library, use it as music or a layer',true);
    });
  }).catch(function(e){log(kind+' render failed: '+e.message)});
}
// 8 audio report (reads every audio setting actually on the project)
function report(){
  var lines=[];
  lines.push('music: '+(S.musicId&&M[S.musicId]?M[S.musicId].name:'none')+' at '+Math.round((S.musicGain||0)*100)+'%');
  lines.push('offset '+(S.musicOffset||0).toFixed(1)+'s');
  var fades=0,muted=0;
  S.clips.forEach(function(c){if(c.afIn||c.afOut)fades++;if(c.muted)muted++});
  lines.push('clips with fades: '+fades+' of '+S.clips.length+(muted?' · '+muted+' muted':''));
  var extra=[];
  if(S.voId&&M[S.voId])extra.push('voiceover '+M[S.voId].name);
  if(E.duck)extra.push('duck '+E.duck);
  if(extra.length)lines.push(extra.join(' · '));
  log('audio report — '+lines.join(' | '),true);
}
// 9 silence scan (read-only: flags clips with dead air at the edges)
async function silScan(){
  if(!S.clips.length)return log('no clips to scan');
  log('silence scan: reading '+S.clips.length+' clips…',true);
  var actx=new (window.AudioContext||window.webkitAudioContext)();
  var bad=[];
  for(var i=0;i<S.clips.length;i++){
    var c=S.clips[i],m=M[c.src];if(!m||m.kind!=='video')continue;
    try{
      if(!m.buf)m.buf=await actx.decodeAudioData(await m.blob.arrayBuffer());
      var sr=m.buf.sampleRate,ch=m.buf.getChannelData(0);
      function rms(at){
        var a=Math.round(Math.max(0,Math.min(at,m.buf.duration-0.05))*sr),s=0,n=0;
        for(var j=a;j<Math.min(a+Math.round(sr*0.05),ch.length);j+=4){var v=ch[j];s+=v*v;n++}
        return n?Math.sqrt(s/n):1;
      }
      if(rms(c.start)<0.015)bad.push((i+1)+' in');
      if(rms(c.end-0.05)<0.015)bad.push((i+1)+' out');
    }catch(e){}
  }
  try{actx.close()}catch(e){}
  log(bad.length?'silent edges on: '+bad.join(', ')+' — select the clip and run SILENCE TRIM in Studio II':'every clip opens and closes with sound — no dead air',true);
}
// 10 music length check
function lenCheck(){
  musicBuf().then(function(buf){
    if(!buf)return;
    var td=totalDur(),md=buf.duration,off=(S.musicOffset||0)%md;
    var left=md-off;
    if(left>=td)log('music check: timeline '+td.toFixed(1)+'s — music covers it with '+left.toFixed(1)+'s spare from the offset',true);
    else log('music check: timeline '+td.toFixed(1)+'s — music runs short by '+(td-left).toFixed(1)+'s before it loops (loop restarts at '+(md-off).toFixed(1)+'s)',true);
  });
}

if(!window.S)return;
var S=window.S,M=window.M,E=window.S.eco=window.S.eco||{};

function mount(){
if($('f24bal'))return;
var card=document.createElement('div');card.className='card';
var h=document.createElement('h2');h.textContent='Audio Lab (Phase 18)';card.appendChild(h);
var r1=mkRow();var gi=document.createElement('input');gi.id='f24bal';gi.placeholder='music volume 0-2 (1 = 100%)';gi.type='number';gi.min=0;gi.max=2;gi.step=0.05;gi.value=S.musicGain||0.8;r1.appendChild(gi);r1.appendChild(mkBtn('SET BALANCE',setBalance,'1 1 auto','f24b1'));card.appendChild(r1);
var r2=mkRow();r2.appendChild(mkBtn('MUSIC -0.1S',function(){nudge(-1)},'1 1 auto','f24b2'));r2.appendChild(mkBtn('MUSIC +0.1S',function(){nudge(1)},'1 1 auto','f24b3'));card.appendChild(r2);
var r3=mkRow();r3.appendChild(mkBtn('DRAW WAVEFORM',drawWave,'1 1 auto','f24b4'));card.appendChild(r3);
var wb=document.createElement('div');wb.id='f24wavebox';card.appendChild(wb);
var r4=mkRow();r4.appendChild(mkBtn('WHOOSH',function(){makeFx('whoosh')},'1 1 auto','f24b5'));r4.appendChild(mkBtn('POP',function(){makeFx('pop')},'1 1 auto','f24b6'));card.appendChild(r4);
var r5=mkRow();r5.appendChild(mkBtn('RISER',function(){makeFx('riser')},'1 1 auto','f24b7'));r5.appendChild(mkBtn('BOOM',function(){makeFx('boom')},'1 1 auto','f24b8'));card.appendChild(r5);
var r6=mkRow();r6.appendChild(mkBtn('AUDIO REPORT',report,'1 1 auto','f24b9'));r6.appendChild(mkBtn('SILENCE SCAN',function(){silScan()}, '1 1 auto','f24b10'));card.appendChild(r6);
var r7=mkRow();r7.appendChild(mkBtn('MUSIC LENGTH CHECK',lenCheck,'1 1 auto','f24b11'));card.appendChild(r7);
var note=document.createElement('div');note.className='note';note.textContent='balance and offset drive the real preview mix, the waveform maps your music across the timeline, the four fx are synthesized wavs added straight to the library, silence scan flags dead air for studio ii trim, and the length check tells you when the music loops.';
card.appendChild(note);
var hs=document.querySelectorAll('.card h2');var anchor=null;
for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('Creator Analytics')>=0){anchor=hs[i].parentElement;break}}
if(!anchor){for(var j=0;j<hs.length;j++){if(hs[j].textContent.indexOf('Finishing Lab')>=0){anchor=hs[j].parentElement;break}}}
if(anchor){if(anchor.nextSibling)anchor.parentElement.insertBefore(card,anchor.nextSibling);else anchor.parentElement.appendChild(card)}
log('audio lab live — balance, beat offset, waveform, sfx synth, silence scan');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();