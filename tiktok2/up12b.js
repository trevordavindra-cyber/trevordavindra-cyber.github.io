'use strict';
// up12b.js — CREATOR TOOLS PACK (Nov 23 2026)
// beat-grid cutting, beat pulse, 3-step ramp split, grade pack (5 looks),
// SRT caption import/export, kinetic text layers, procedural soundtrack generator.
// Chains the existing hook pipeline (up5/up5b/up6/up7/up8 packs untouched).
(function(){
if(window.__tk2up12b)return;window.__tk2up12b=true;
function $(id){return document.getElementById(id)}
function lsGet(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function mkBtn(txt,fn,flex,id){var b=document.createElement('button');b.className='ghost small';b.textContent=txt;b.style.flex=flex||'0 0 30%';if(id)b.id=id;b.onclick=fn;return b}
function mkRow(btns){var r=document.createElement('div');r.className='btnrow';btns.forEach(function(b){r.appendChild(b)});return r}
function mkNote(id){var n=document.createElement('div');n.className='note';if(id)n.id=id;return n}
function mkSel(id,opts,vals){var s=document.createElement('select');s.id=id;s.className='inp';s.style.marginTop='6px';opts.forEach(function(o,i){var el=document.createElement('option');el.value=vals?vals[i]:o;el.textContent=o;s.appendChild(el)});return s}

// ---------- 1. BEAT CUT: snap timeline cut points onto the music beat grid ----------
function beatTimes(){
  var mm=S.musicId&&M[S.musicId];
  if(!mm||!mm.beats||mm.beats.length<4)return null;
  return mm.beats.map(function(b){return b-(S.musicOffset||0)}).filter(function(b){return b>0.15});
}
function beatCut(){
  if(!S.clips.length){log('timeline is empty — nothing to snap');return}
  var bt=beatTimes();
  if(!bt){log('beat cut needs music with detected beats — generate a loop below or tap DETECT BEATS in the library');return}
  var bpm=(M[S.musicId]&&M[S.musicId].bpm)||0;
  var cum=0,snapped=0;
  S.clips.forEach(function(c){
    if(c.ramp){cum+=clipOutDur(c);return}
    var m=M[c.src];var od=clipOutDur(c);
    var target=null;
    for(var i=0;i<bt.length;i++){if(bt[i]>cum+0.32){target=bt[i]-cum;break}}
    if(target==null)target=od;
    var sp=c.speed||1;
    var newEnd=c.start+target*sp;
    if(newEnd>c.start+0.25&&(!m||newEnd<=m.dur)){
      if(Math.abs(target-od)>0.05){c.end=newEnd;snapped++}
    }else if(m&&newEnd>m.dur){
      var newStart=m.dur-target*sp;
      if(newStart>=0&&newStart<c.end-0.25){c.start=newStart;c.end=m.dur;snapped++}
    }
    cum+=clipOutDur(c);
  });
  drawTimeline();save();
  log('beat cut: '+snapped+' of '+S.clips.length+' cuts snapped to the '+(bpm?bpm+' bpm':'beat')+' grid',true);
}

// ---------- 2. BEAT PULSE: the whole frame kicks on every beat ----------
var PULSE={on:lsGet('tk2bp',false)};
function pulseBtn(){
  var b=$('ctPulse');if(!b)return;
  b.textContent='BEAT PULSE: '+(PULSE.on?'ON':'OFF');
}
var prevFrame=window.fxFrameHook;
window.fxFrameHook=function(ctx,t,W,H){
  try{
    if(PULSE.on&&S.musicId&&M[S.musicId]&&M[S.musicId].bpm){
      var per=60/M[S.musicId].bpm;
      var mt=t+(S.musicOffset||0);
      var ph=mt%per;if(ph<0)ph+=per;
      if(ph<0.11){
        var k=1-ph/0.11;var z=0.07*k;
        ctx.save();ctx.filter='none';ctx.globalAlpha=1;
        ctx.drawImage(ctx.canvas,-W*z/2,-H*z/2,W*(1+z),H*(1+z));
        ctx.restore();
      }
    }
  }catch(e){}
  if(prevFrame)try{prevFrame(ctx,t,W,H)}catch(e){}
};

// ---------- 3. RAMP SPLIT: selected clip becomes slow/fast/slow ----------
function rampSplit(){
  var i=-1;
  for(var k=0;k<S.clips.length;k++)if(S.clips[k].id===S.selected)i=k;
  if(i<0){log('select a clip on the timeline first');return}
  var c=S.clips[i],m=M[c.src];
  if(!m){log('clip source missing');return}
  var span=c.end-c.start;
  if(span<0.6){log('clip too short to ramp (needs 0.6s or more)');return}
  var thirds=span/3;
  var speeds=[0.7,1.6,0.75];
  var reps=speeds.map(function(sp,k){
    var nc=Object.assign({},c);
    nc.id=uid();nc.start=c.start+thirds*k;nc.end=nc.start+thirds;nc.speed=sp;nc.ramp=0;
    nc.trans=k===0?c.trans:'punch';
    return nc;
  });
  S.clips.splice.apply(S.clips,[i,1].concat(reps));
  drawTimeline();save();
  log('ramp split: clip #'+(i+1)+' is now slow/fast/slow (3 clips)',true);
}

// ---------- 4. GRADE PACK: five looks on top of the style grade ----------
var GRADES={
  teal:{label:'TEAL & ORANGE',v:' saturate(1.35) contrast(1.18) hue-rotate(-12deg)'},
  noir:{label:'NOIR',v:' grayscale(1) contrast(1.3) brightness(.95)'},
  vhs:{label:'VHS',v:' saturate(1.4) contrast(1.08) brightness(1.06) hue-rotate(6deg)'},
  sunset:{label:'SUNSET',v:' saturate(1.25) sepia(.25) contrast(1.08) brightness(1.05)'},
  cold:{label:'COLD STEEL',v:' saturate(.75) contrast(1.25) hue-rotate(-25deg) brightness(.97)'}
};
function applyGrade(){
  var g=GRADES[$('ctGrade').value];
  if(!g){log('pick a grade first');return}
  if(!S.clips.length){log('timeline is empty');return}
  S.clips.forEach(function(c){c.gradeExtra=g.v});
  drawTimeline();save();
  log('grade applied to all '+S.clips.length+' clips: '+g.label,true);
}
function clearGrade(){
  S.clips.forEach(function(c){c.gradeExtra=''});
  drawTimeline();save();
  log('grade pack cleared',true);
}

// ---------- 5. SRT captions: export + paste import ----------
function srtTime(t){
  t=Math.max(0,t);
  var h=Math.floor(t/3600),m=Math.floor((t%3600)/60),s=Math.floor(t%60),ms=Math.round((t-Math.floor(t))*1000);
  if(ms===1000){ms=0;s++}
  var p=function(n){return (n<10?'0':'')+n};
  return p(h)+':'+p(m)+':'+p(s)+','+p(Math.min(999,ms));
}
function srtExport(){
  if(!S.captions.length){log('no captions to export yet');return}
  var caps=S.captions.slice().sort(function(a,b){return a.t0-b.t0});
  var out='';
  caps.forEach(function(c,i){out+=(i+1)+'\n'+srtTime(c.t0)+' --> '+srtTime(c.t1)+'\n'+String(c.text).trim()+'\n\n'});
  var b=new Blob([out],{type:'text/plain'});
  var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='captions.srt';a.className='dl';a.textContent='DOWNLOAD CAPTIONS.SRT';
  var o=$('ctSrtOut');o.innerHTML='';o.appendChild(a);
  log('srt exported ('+caps.length+' lines)',true);
}
function parseSrtTime(x){
  x=x.trim().replace(',','.');
  var m=/^(?:(\d+):)?(\d+):(\d+(?:\.\d+)?)$/.exec(x);
  if(!m)return null;
  var h=parseInt(m[1]||'0',10),mi=parseInt(m[2],10),s=parseFloat(m[3]);
  return h*3600+mi*60+s;
}
function parseSrt(txt){
  var caps=[];
  txt.replace(/\r/g,'').split(/\n\s*\n/).forEach(function(block){
    var lines=block.split('\n').filter(function(l){return l.trim().length});
    if(lines.length<2)return;
    var ti=-1;
    for(var i=0;i<lines.length;i++){if(lines[i].indexOf('-->')>-1){ti=i;break}}
    if(ti<0)return;
    var parts=lines[ti].split('-->');
    if(parts.length<2)return;
    var t0=parseSrtTime(parts[0]),t1=parseSrtTime(parts[1]);
    if(t0==null||t1==null||t1<=t0)return;
    var text=lines.slice(ti+1).join(' ').trim();
    if(!text)return;
    caps.push({text:text,t0:t0,t1:t1});
  });
  return caps;
}
function srtPasteImport(){
  var v=(($('ctSrtIn')&&$('ctSrtIn').value)||'').trim();
  if(!v){log('paste an .srt into the box first');return}
  var caps=parseSrt(v);
  if(!caps.length){log('could not read any srt cues from that text');return}
  S.captions=S.captions.concat(caps);
  drawTimeline();save();
  $('ctSrtIn').value='';
  log('imported '+caps.length+' caption lines from srt',true);
}

// ---------- 6. KINETIC TEXT: animated overlay layers ----------
var KANIMS=['pop','typewriter','shake','wave','slideup'];
var kinSel=-1;
function kinList(){return (S.overlays||[]).filter(function(o){return o.anim&&o.anim!=='none'})}
function kineticAdd(){
  var txt=(($('ctKinTxt').value)||'').trim();
  if(!txt){log('type the kinetic text first');return}
  var anim=$('ctKinAnim').value;
  var dur=clamp(parseFloat($('ctKinDur').value)||2.5,0.4,20);
  var t0=clamp(parseFloat($('ctKinAt').value)||0,0,Math.max(1,totalDur()-0.3));
  S.overlays=S.overlays||[];
  S.overlays.push({id:uid(),text:txt,t0:t0,t1:t0+dur,x:0.5,y:0.72,size:64,color:'#fff',glow:'rgba(0,229,255,.9)',anim:anim});
  $('ctKinTxt').value='';
  kinSel=S.overlays.length-1;
  renderKinList();
  if(typeof drawTimeline==='function')drawTimeline();
  save();
  log('kinetic layer added ('+anim+'): "'+txt+'"',true);
}
function easeOut(p){return 1-Math.pow(1-clamp(p,0,1),3)}
function kinRow(o){
  var r=document.createElement('div');r.className='mitem';r.style.flexWrap='wrap';
  var nm=document.createElement('div');nm.style.flex='1 1 100%';nm.textContent='['+o.anim+'] '+o.text;
  r.appendChild(nm);
  var s0=document.createElement('input');s0.type='number';s0.step='0.1';s0.min='0';s0.value=o.t0.toFixed(1);s0.className='inp';s0.style.flex='0 0 30%';
  s0.onchange=function(){o.t0=clamp(parseFloat(this.value)||0,0,o.t1-0.2);renderKinList();drawTimeline();save()};
  var s1=document.createElement('input');s1.type='number';s1.step='0.1';s1.min='0';s1.value=o.t1.toFixed(1);s1.className='inp';s1.style.flex='0 0 30%';
  s1.onchange=function(){o.t1=clamp(parseFloat(this.value)||0,o.t0+0.2,Math.max(1,totalDur()));renderKinList();drawTimeline();save()};
  var del=document.createElement('button');del.className='ghost small';del.style.flex='0 0 24%';del.textContent='DEL';
  del.onclick=function(){var ix=S.overlays.indexOf(o);if(ix>-1)S.overlays.splice(ix,1);renderKinList();drawTimeline();save()};
  r.appendChild(s0);r.appendChild(s1);r.appendChild(del);
  return r;
}
function renderKinList(){
  var list=$('ctKinList');if(!list)return;
  list.innerHTML='';
  var ks=kinList();
  if(!ks.length){list.innerHTML='<div class="note">no kinetic layers yet</div>';return}
  ks.forEach(function(o){list.appendChild(kinRow(o))});
}
var prevFrame2=null; // kinetic draws ride the same hook chain below
function drawKinetic(ctx,t,W,H){
  (S.overlays||[]).forEach(function(o){
    if(!o.anim||o.anim==='none')return;
    if(t<o.t0||t>=o.t1)return;
    var age=t-o.t0,life=o.t1-o.t0;
    var a=clamp(Math.min(age/0.2,(o.t1-t)/0.25),0,1)*(o.alpha!=null?o.alpha:1);
    var fs=(o.size||64)*(H/1280);
    ctx.save();
    ctx.globalAlpha=a;
    ctx.translate(o.x*W,o.y*H);
    ctx.font='900 '+fs+'px Arial, sans-serif';
    ctx.textBaseline='middle';
    ctx.lineJoin='round';
    var color=o.color||'#fff';
    if(o.glow){ctx.shadowColor=o.glow;ctx.shadowBlur=fs*0.5}
    var drawChar=function(ch,x,extra){
      ctx.save();
      if(extra){ctx.translate(extra.dx||0,extra.dy||0);if(extra.sc)ctx.scale(extra.sc,extra.sc)}
      ctx.lineWidth=Math.max(2,fs/8);
      ctx.strokeStyle='rgba(0,0,0,.9)';
      ctx.strokeText(ch,x,0);
      ctx.shadowBlur=o.glow?fs*0.5:0;
      ctx.fillStyle=color;
      ctx.fillText(ch,x,0);
      ctx.restore();
    };
    if(o.anim==='pop'){
      var sc=1+0.45*Math.sin(clamp(age/0.4,0,1)*Math.PI)*(1-clamp(age/0.4,0,1));
      ctx.scale(sc,sc);
      ctx.textAlign='center';
      ctx.lineWidth=Math.max(2,fs/8);ctx.strokeStyle='rgba(0,0,0,.9)';
      ctx.strokeText(o.text,0,0);ctx.shadowBlur=0;ctx.fillStyle=color;ctx.fillText(o.text,0,0);
    }else if(o.anim==='typewriter'){
      var n=Math.max(1,Math.floor(age/0.06));
      ctx.textAlign='left';
      var shown=o.text.slice(0,n);
      ctx.lineWidth=Math.max(2,fs/8);ctx.strokeStyle='rgba(0,0,0,.9)';
      ctx.strokeText(shown,0,0);ctx.shadowBlur=0;ctx.fillStyle=color;ctx.fillText(shown,0,0);
      if(n<o.text.length&&Math.floor(t*8)%2===0){
        var w1=ctx.measureText(shown).width;
        ctx.fillStyle=color;ctx.fillRect(w1+4,-fs*0.4,fs*0.09,fs*0.8);
      }
    }else if(o.anim==='shake'){
      ctx.translate((Math.random()-0.5)*fs*0.12,(Math.random()-0.5)*fs*0.12);
      ctx.textAlign='center';
      ctx.lineWidth=Math.max(2,fs/8);ctx.strokeStyle='rgba(0,0,0,.9)';
      ctx.strokeText(o.text,0,0);ctx.shadowBlur=0;ctx.fillStyle=color;ctx.fillText(o.text,0,0);
    }else if(o.anim==='wave'){
      ctx.textAlign='left';
      var ws=ctx.measureText(o.text).width;
      var x=-ws/2;
      for(var i=0;i<o.text.length;i++){
        var ch=o.text[i];
        var dy=Math.sin(t*6+i*0.55)*fs*0.14;
        drawChar(ch,x,{dy:dy});
        x+=ctx.measureText(ch).width;
      }
    }else if(o.anim==='slideup'){
      var p=easeOut(age/0.45);
      ctx.translate(0,(1-p)*H*0.08);
      ctx.textAlign='center';
      ctx.lineWidth=Math.max(2,fs/8);ctx.strokeStyle='rgba(0,0,0,.9)';
      ctx.strokeText(o.text,0,0);ctx.shadowBlur=0;ctx.fillStyle=color;ctx.fillText(o.text,0,0);
    }
    ctx.restore();
  });
}
// wrap the hook chain: animated overlays are pulled OUT of S.overlays while the
// earlier packs draw the static ones, then drawn here. Nothing is replaced.
var prevKinHook=window.fxFrameHook;
window.fxFrameHook=function(ctx,t,W,H){
  var all=S.overlays||[];
  var anims=all.filter(function(o){return o.anim&&o.anim!=='none'});
  if(anims.length){S.overlays=all.filter(function(o){return !(o.anim&&o.anim!=='none')})}
  if(prevKinHook)try{prevKinHook(ctx,t,W,H)}catch(e){}
  S.overlays=all;
  try{drawKinetic(ctx,t,W,H)}catch(e){}
};

// ---------- 7. SOUNDTRACK GENERATOR: real synthesized loops as WAV ----------
function noiseBuf(oc,dur){
  var b=oc.createBuffer(1,Math.max(1,Math.floor(oc.sampleRate*dur)),oc.sampleRate);
  var d=b.getChannelData(0);
  for(var i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  return b;
}
function wavBlob(buf){
  var nch=buf.numberOfChannels,sr=buf.sampleRate,len=buf.length;
  var bytes=44+len*nch*2;
  var ab=new ArrayBuffer(bytes),v=new DataView(ab);
  var wstr=function(off,s){for(var i=0;i<s.length;i++)v.setUint8(off+i,s.charCodeAt(i))};
  wstr(0,'RIFF');v.setUint32(4,bytes-8,true);wstr(8,'WAVE');wstr(12,'fmt ');
  v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,nch,true);
  v.setUint32(24,sr,true);v.setUint32(28,sr*nch*2,true);v.setUint16(32,nch*2,true);v.setUint16(34,16,true);
  wstr(36,'data');v.setUint32(40,len*nch*2,true);
  var off=44;
  var chans=[];for(var c=0;c<nch;c++)chans.push(buf.getChannelData(c));
  for(var i=0;i<len;i++){
    for(var c=0;c<nch;c++){
      var s=Math.max(-1,Math.min(1,chans[c][i]));
      v.setInt16(off,s<0?s*0x8000:s*0x7fff,true);off+=2;
    }
  }
  return new Blob([ab],{type:'audio/wav'});
}
var GENRES={
  phonk:{bpm:141,label:'PHONK'},
  lofi:{bpm:82,label:'LO-FI'},
  trap:{bpm:150,label:'TRAP'},
  cine:{bpm:70,label:'CINEMATIC'}
};
async function genLoop(g){
  var G=GENRES[g];if(!G){log('pick a genre first');return}
  log('synthesizing '+G.label+' loop…',true);
  try{
    var sr=44100,len=8;
    var oc=new OfflineAudioContext(2,sr*len,sr);
    var master=oc.createGain();master.gain.value=0.85;master.connect(oc.destination);
    var comp=oc.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=4;comp.connect(master);
    var bus=comp;
    function kick(t){var o=oc.createOscillator(),gn=oc.createGain();o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(42,t+0.16);gn.gain.setValueAtTime(1,t);gn.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.connect(gn);gn.connect(bus);o.start(t);o.stop(t+0.32)}
    function snare(t,vol){var s=oc.createBufferSource();s.buffer=noiseBuf(oc,0.2);var f=oc.createBiquadFilter();f.type='bandpass';f.frequency.value=1800;var gn=oc.createGain();gn.gain.setValueAtTime(vol||0.6,t);gn.gain.exponentialRampToValueAtTime(0.001,t+0.18);s.connect(f);f.connect(gn);gn.connect(bus);s.start(t)}
    function hat(t,vol){var s=oc.createBufferSource();s.buffer=noiseBuf(oc,0.06);var f=oc.createBiquadFilter();f.type='highpass';f.frequency.value=7500;var gn=oc.createGain();gn.gain.setValueAtTime(vol||0.22,t);gn.gain.exponentialRampToValueAtTime(0.001,t+0.05);s.connect(f);f.connect(gn);gn.connect(bus);s.start(t)}
    function bass(t,f,dur){var o=oc.createOscillator();o.type='sine';o.frequency.setValueAtTime(f,t);var gn=oc.createGain();gn.gain.setValueAtTime(0.42,t);gn.gain.setValueAtTime(0.42,t+dur*0.6);gn.gain.exponentialRampToValueAtTime(0.001,t+dur);o.connect(gn);gn.connect(bus);o.start(t);o.stop(t+dur+0.05)}
    function cowbell(t,f){var o1=oc.createOscillator(),o2=oc.createOscillator();o1.type='square';o2.type='square';o1.frequency.value=f;o2.frequency.value=f*1.48;var fl=oc.createBiquadFilter();fl.type='bandpass';fl.frequency.value=f*1.2;var gn=oc.createGain();gn.gain.setValueAtTime(0.16,t);gn.gain.exponentialRampToValueAtTime(0.001,t+0.12);o1.connect(fl);o2.connect(fl);fl.connect(gn);gn.connect(bus);o1.start(t);o2.start(t);o1.stop(t+0.14);o2.stop(t+0.14)}
    function pad(t,freqs,dur){
      freqs.forEach(function(f,i){
        var o=oc.createOscillator();o.type='triangle';o.frequency.value=f;o.detune.value=(i-1)*7;
        var fl=oc.createBiquadFilter();fl.type='lowpass';fl.frequency.value=900;
        var gn=oc.createGain();gn.gain.setValueAtTime(0.0001,t);gn.gain.linearRampToValueAtTime(0.085,t+dur*0.3);gn.gain.linearRampToValueAtTime(0.0001,t+dur);
        o.connect(fl);fl.connect(gn);gn.connect(bus);o.start(t);o.stop(t+dur+0.1);
      });
    }
    function boom(t){var o=oc.createOscillator(),gn=oc.createGain();o.frequency.setValueAtTime(90,t);o.frequency.exponentialRampToValueAtTime(30,t+0.9);gn.gain.setValueAtTime(0.9,t);gn.gain.exponentialRampToValueAtTime(0.001,t+1.6);o.connect(gn);gn.connect(bus);o.start(t);o.stop(t+1.7)}
    var beat=60/G.bpm,steps=Math.floor(len/beat);
    if(g==='phonk'){
      var notes=[41.2,41.2,46.25,51.9]; // E1 G1 A#1 C#2
      for(var i=0;i<steps;i++){var t=i*beat;kick(t);if(i%4===2||i%4===0&&i>0)snare(t,0.55);hat(t+beat/2,0.2);if(i%2===0)hat(t,0.12);bass(t,notes[i%4],beat*0.9)}
      var mel=[329.6,392,466.2,392,329.6,293.7,392,466.2];
      for(var i=0;i<mel.length;i++)cowbell(beat*(i+0.5),mel[i]);
    }else if(g==='lofi'){
      var chords=[[174.6,220,261.6,349.2],[220,261.6,329.6,392],[146.8,174.6,220,293.7],[164.8,196,246.9,293.7]];
      for(var i=0;i<steps;i++){var t=i*beat;
        if(i%4===0||i%4===2)kick(t,0);
        if(i%4===1||i%4===3)snare(t,0.4);
        if(i%2===1)hat(t+beat*0.5,0.14);
        if(i%4===0)pad(t,chords[(i/4)%4|0],beat*4);
        if(i%4===0)bass(t,chords[(i/4)%4|0][0]/2,beat*3.5);
      }
    }else if(g==='trap'){
      var root=[36.7,36.7,43.65,32.7]; // D1 D1 F1 C1
      for(var i=0;i<steps;i++){var t=i*beat;
        if(i%4===0||i%4===7%8)kick(t);
        if(i%4===2)snare(t,0.5);
        for(var h=0;h<4;h++)hat(t+beat*h/4,h%4===3?0.3:0.16);
        if(i%2===0)hat(t+beat*0.75,0.28);
        if(i%4===0)bass(t,root[(i/4)%4|0],beat*1.8);
      }
    }else{
      pad(0,[55,65.4,82.4,110],len*0.55);
      pad(len*0.5,[49,58.3,73.4,98],len*0.5);
      for(var i=0;i<steps;i++){var t=i*beat;if(i%4===0){boom(t);snare(t+0.02,0.3)}if(i%2===1)hat(t,0.06)}
    }
    var buf=await oc.startRendering();
    var wav=wavBlob(buf);
    wav.name='tk2-'+g+'-loop.wav';
    var m=await addMedia(wav,'audio');
    if(m&&m.id){S.musicId=m.id;save()}
    log(G.label+' loop generated ('+G.bpm+' bpm) and set as music — beats detect in a moment',true);
  }catch(e){log('soundtrack: '+(e&&e.message||e))}
}

// ---------- UI ----------
function build(){
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='Creator Tools';card.appendChild(h);
  card.appendChild(mkRow([mkBtn('BEAT CUT',beatCut,'0 0 48%','ctBeat'),mkBtn('',function(){
    PULSE.on=!PULSE.on;lsSet('tk2bp',PULSE.on);pulseBtn();log('beat pulse '+(PULSE.on?'on — the frame kicks on every beat':'off'),true);
  },'0 0 48%','ctPulse')]));
  pulseBtn();
  card.appendChild(mkRow([mkBtn('RAMP SPLIT (SELECTED)',rampSplit,'0 0 100%','ctRamp')]));
  var gs=mkSel('ctGrade',['pick a grade look','TEAL & ORANGE','NOIR','VHS','SUNSET','COLD STEEL'],['','teal','noir','vhs','sunset','cold']);
  card.appendChild(gs);
  card.appendChild(mkRow([mkBtn('APPLY GRADE',applyGrade,'0 0 48%','ctGrA'),mkBtn('CLEAR GRADE',clearGrade,'0 0 48%','ctGrC')]));
  var st=document.createElement('textarea');st.id='ctSrtIn';st.rows=3;st.className='inp';st.placeholder='paste .srt here to import captions';st.style.width='100%';st.style.marginTop='6px';
  card.appendChild(st);
  card.appendChild(mkRow([mkBtn('IMPORT PASTED SRT',srtPasteImport,'0 0 48%','ctSrtI'),mkBtn('EXPORT SRT',srtExport,'0 0 48%','ctSrtE')]));
  card.appendChild(mkNote('ctSrtOut'));
  var kr=document.createElement('div');kr.className='btnrow';
  var kt=document.createElement('input');kt.id='ctKinTxt';kt.className='inp';kt.placeholder='kinetic text';kt.style.flex='1 1 auto';
  kr.appendChild(kt);
  card.appendChild(kr);
  card.appendChild(mkSel('ctKinAnim',['pop','typewriter','shake','wave','slideup'],KANIMS));
  var krow=document.createElement('div');krow.className='btnrow';
  var kat=document.createElement('input');kat.id='ctKinAt';kat.type='number';kat.step='0.1';kat.min='0';kat.placeholder='start sec';kat.className='inp';kat.style.flex='0 0 30%';
  var kdur=document.createElement('input');kdur.id='ctKinDur';kdur.type='number';kdur.step='0.1';kdur.min='0.4';kdur.placeholder='secs';kdur.className='inp';kdur.style.flex='0 0 24%';
  krow.appendChild(kat);krow.appendChild(kdur);
  krow.appendChild(mkBtn('ADD KINETIC',kineticAdd,'0 0 44%','ctKinA'));
  card.appendChild(krow);
  var kl=document.createElement('div');kl.id='ctKinList';card.appendChild(kl);
  card.appendChild(mkSel('ctGenre',['pick a soundtrack genre','PHONK (141 bpm)','LO-FI (82 bpm)','TRAP (150 bpm)','CINEMATIC (70 bpm)'],['','phonk','lofi','trap','cine']));
  card.appendChild(mkRow([mkBtn('GENERATE LOOP',function(){genLoop($('ctGenre').value)},'0 0 100%','ctGen')]));
  var nn=document.createElement('div');nn.className='note';
  nn.textContent='creator tools: BEAT CUT snaps every cut to the music grid, BEAT PULSE kicks the frame on each beat, RAMP SPLIT turns the selected clip into slow/fast/slow, five grade looks stack on the style grade, captions import/export as .srt, kinetic text layers animate, and the soundtrack generator synthesizes real loops into your library.';
  card.appendChild(nn);
  var card0=null;
  var hs=document.querySelectorAll('.card h2');
  for(var i=0;i<hs.length;i++){if(hs[i].textContent==='Reliability'){card0=hs[i].parentElement;break}}
  if(card0&&card0.parentElement){
    if(card0.nextSibling)card0.parentElement.insertBefore(card,card0.nextSibling);
    else card0.parentElement.appendChild(card);
  }else{
    var ps=$('page-studio');if(ps)ps.appendChild(card);
  }
  renderKinList();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
log('creator tools pack live (up12b)',true);
})();
