/* ===== VIDEO EDIT mode v4 ===== */
var STYLES={flashy:{filter:'saturate(1.35) contrast(1.12)',hz:0.22,sh:9,gh:0.35,fl:0.7,sl:true},clean:{filter:'none',hz:0.1,sh:0,gh:0,fl:0,sl:false},hard:{filter:'contrast(1.25) saturate(1.5)',hz:0.3,sh:14,gh:0.55,fl:0.95,sl:true}};
var GRADE='saturate(0.72) contrast(1.08) brightness(0.92)';
var FRAM=[{s:1,ox:0,oy:0},{s:1.3,ox:0,oy:-0.07},{s:1.16,ox:-0.05,oy:0.02}];
var SPKCOL=['#8dff6a','#ffd23f','#ff5f5f','#66d9ff'];
var vcv=document.getElementById('vcv'),vctx=vcv.getContext('2d');
var cw=720,ch=1280;
var videoEl=null,vbuf=null,songBuf=null,beats=[],peaks=[],events=[],editLen=0,veBusy=false,veSrc=null,veG=null,veGdst=false,mdest=null,vrec=null,vchunks=[],vraf=0,veT0=0,vsongSrc=null,vsongGain=null,PWR=1;
var effStyle='full',segments=[],cuts=[],montageHits=[],pool=[],mIdx=0,montageT0=0,noiseCv=null,noisePat=null,SPKNAMES=[];
function vstep(m,hl){var s=document.getElementById('vsteps');var d=document.createElement('div');if(hl)d.innerHTML='<b>'+m+'</b>';else d.textContent=m;s.appendChild(d);s.scrollTop=s.scrollHeight}
function ensureA(){if(!actx){actx=new (window.AudioContext||window.webkitAudioContext)();mgain=actx.createGain();mgain.gain.value=.16;sdest=actx.createMediaStreamDestination();mgain.connect(actx.destination);mgain.connect(sdest)}}
function makeNoise(){if(noiseCv)return;noiseCv=document.createElement('canvas');noiseCv.width=96;noiseCv.height=96;var x=noiseCv.getContext('2d');var id=x.createImageData(96,96);for(var i=0;i<id.data.length;i+=4){var v=Math.floor(Math.random()*255);id.data[i]=v;id.data[i+1]=v;id.data[i+2]=v;id.data[i+3]=255}x.putImageData(id,0,0);noisePat=vctx.createPattern(noiseCv,'repeat')}
document.getElementById('vfile').addEventListener('change',function(){
var f=this.files[0];if(!f)return;
if(vURL)URL.revokeObjectURL(vURL);
vURL=URL.createObjectURL(f);vbuf=null;
veSrc=null;veG=null;veGdst=false;
videoEl=document.createElement('video');videoEl.muted=true;videoEl.preload='auto';videoEl.src=vURL;
vstep('loading clip…');
videoEl.onloadedmetadata=function(){
var vw=videoEl.videoWidth,vh=videoEl.videoHeight;var sc=720/Math.max(vw,vh);
cw=Math.round(vw*sc/2)*2;ch=Math.round(vh*sc/2)*2;vcv.width=cw;vcv.height=ch;vcv.style.display='';
vstep('clip loaded: '+vw+'x'+vh+', '+videoEl.duration.toFixed(1)+'s — now hit ANALYZE',1);
f.arrayBuffer().then(function(b){vbuf=b});
};
});
document.getElementById('afile').addEventListener('change',function(){
var f=this.files[0];if(!f)return;ensureA();
f.arrayBuffer().then(function(b){actx.decodeAudioData(b).then(function(ab){songBuf=ab;document.getElementById('songName').textContent='♪ '+f.name;vstep('song loaded: '+ab.duration.toFixed(1)+'s — beats will come from it',1)}).catch(function(){vstep('could not read that audio file, try mp3')})});
});
document.getElementById('vanalyze').addEventListener('click',function(){analyzeV()});
async function analyzeV(){
if(!videoEl||!videoEl.duration){vstep('load a clip first');return}
if(veBusy)return;
ensureA();
PWR=0.3+parseInt(document.getElementById('vint').value,10)/100*1.2;
var src=songBuf;
if(!src&&vbuf){vstep('reading the clip audio…');try{src=await actx.decodeAudioData(vbuf.slice(0))}catch(e){}}
if(src){beats=detectBeats(src);vstep(beats.length+' beats found in '+(songBuf?'your song':'the clip audio'),1)}else{beats=[];vstep('no usable audio found — add a song for beat sync')}
vstep('scanning the clip for action moments…');
motionPass(function(ps){
peaks=ps;
buildEvents();
editLen=songBuf?Math.min(songBuf.duration,videoEl.duration):videoEl.duration;editLen=Math.min(editLen,90);
buildTimeline();
var hits=events.filter(function(e){return e.k==='hit'}).length;
var st=effStyle==='action'?'ACTION':(effStyle==='dialog'?'DIALOGUE':'FULL');
vstep('ready — style '+st+': '+events.length+' cuts, '+hits+' action hits, '+segments.length+' dialogue lines, montage '+(effStyle==='full'?Math.round(editLen-montageT0):0)+'s · edit runs '+editLen.toFixed(1)+'s',1);
});
}
function detectBeats(buf){
var sr=buf.sampleRate,n=buf.length,nc=buf.numberOfChannels,hop=1024,win=2048;
var frames=Math.floor((n-win)/hop);if(frames<10)return[];
var e=new Float32Array(frames);
for(var f=0;f<frames;f++){var s=0,off=f*hop;for(var c=0;c<nc;c++){var d=buf.getChannelData(c);for(var i=0;i<win;i+=4)s+=Math.abs(d[off+i])}e[f]=s}
var fl=new Float32Array(frames);for(var f=1;f<frames;f++)fl[f]=Math.max(0,e[f]-e[f-1]);
var out=[],last=-1;
for(var f=2;f<frames-2;f++){
var m=0;for(var k=-20;k<=20;k++){var ii=f+k;if(ii>=0&&ii<frames)m+=fl[ii]}m/=41;
if(fl[f]>m*1.35+1e-7&&fl[f]>=fl[f-1]&&fl[f]>=fl[f+1]){
var t=(f*hop+win/2)/sr;
if(last<0||t-last>0.25){out.push({t:t,v:fl[f]/(m+1e-9)});last=t}
}}
if(out.length>350){out.sort(function(a,b){return b.v-a.v});out=out.slice(0,350);out.sort(function(a,b){return a.t-b.t})}
return out;
}
function motionPass(done){
var mc=document.createElement('canvas');mc.width=48;mc.height=84;
var mx=mc.getContext('2d',{willReadFrequently:true});
var prev=null,mots=[];
videoEl.currentTime=0;videoEl.muted=true;videoEl.playbackRate=4;
function sample(){
if(videoEl.ended||videoEl.currentTime>=videoEl.duration-0.05){videoEl.pause();videoEl.playbackRate=1;videoEl.muted=true;done(smoothM(mots));return}
try{mx.drawImage(videoEl,0,0,48,84);var d=mx.getImageData(0,0,48,84).data;var s=0;
if(prev){for(var i=0;i<d.length;i+=16)s+=Math.abs(d[i]-prev[i])+Math.abs(d[i+1]-prev[i+1])}
mots.push({t:videoEl.currentTime,m:s});
prev=new Uint8ClampedArray(d);}catch(e){}
requestAnimationFrame(sample);
}
videoEl.play().then(function(){requestAnimationFrame(sample)}).catch(function(){done([])});
}
function smoothM(a){
if(a.length<5)return[];
var o=[];for(var i=0;i<a.length;i++){var s=0,c=0;for(var k=-2;k<=2;k++){var j=i+k;if(j>=0&&j<a.length){s+=a[j].m;c++}}o.push({t:a[i].t,m:s/c})}
var mean=0;o.forEach(function(x){mean+=x.m});mean/=o.length;
var ps=[],last=-9;
for(var i=2;i<o.length-2;i++){var v=o[i].m;
if(v>mean*1.4+1e-6&&v>=o[i-1].m&&v>=o[i+1].m&&v>=o[i-2].m&&v>=o[i+2].m){var t=o[i].t;if(t-last>0.45){ps.push({t:t,v:v/mean});last=t}}}
ps.sort(function(a,b){return b.v-a.v});ps=ps.slice(0,60);ps.sort(function(a,b){return a.t-b.t});
return ps;
}
function buildEvents(){
events=[];var used={};
beats.forEach(function(b){
var hit=null,best=0.22;
peaks.forEach(function(p,pi){if(used[pi])return;var d=Math.abs(p.t-b.t);if(d<best){best=d;hit=pi}});
if(hit!=null){used[hit]=1;events.push({t:b.t,k:'hit'})}else events.push({t:b.t,k:'tap'})
});
peaks.forEach(function(p,pi){if(!used[pi]&&p.v>2.2)events.push({t:p.t,k:'hit'})});
events.sort(function(a,b){return a.t-b.t});
}
function parseLines(){
var ta=document.getElementById('vlines').value.split('\n');var out=[];
ta.forEach(function(l){l=l.trim();if(!l)return;var m=l.match(/^([^:]{1,12}):\s*(.+)$/);if(m)out.push({spk:m[1],text:m[2]});else out.push({spk:'',text:l})});
return out;
}
function buildTimeline(){
segments=[];cuts=[];montageHits=[];pool=[];mIdx=0;SPKNAMES=[];
var style=document.getElementById('estyle').value;
var mont=parseInt(document.getElementById('vmont').value,10)||12;
effStyle=style;
if(effStyle==='dialog'&&songBuf)effStyle='full';
if(effStyle!=='action'&&!parseLines().length){effStyle='action'}
montageT0=effStyle==='full'?Math.max(4,editLen-mont):editLen;
if(effStyle==='full'&&montageT0>editLen-4)montageT0=Math.max(4,editLen*0.6);
var lines=parseLines();
if(lines.length&&effStyle!=='action'){
var span=montageT0;
var ws=lines.map(function(l){return l.text.length+18});
var tot=ws.reduce(function(a,b){return a+b},0);
var t=0;
lines.forEach(function(l,i){var d=span*ws[i]/tot;d=Math.max(1.4,d);segments.push({t0:t,t1:t+d,spk:l.spk,text:l.text,zi:i%3});t+=d});
var k=span/t;segments.forEach(function(s){s.t0*=k;s.t1*=k});
segments.forEach(function(s){cuts.push(s.t0)});cuts.push(span);
SPKNAMES=[];segments.forEach(function(s){if(s.spk&&SPKNAMES.indexOf(s.spk)<0)SPKNAMES.push(s.spk)});
}
if(effStyle==='full'){
montageHits=events.filter(function(e){return e.t>=montageT0});
if(montageHits.length<4){montageHits=[];for(var tt=montageT0;tt<editLen-0.3;tt+=0.55)montageHits.push({t:tt,k:'hit'})}
var n=montageHits.length+4,tries=0;
while(pool.length<n&&tries<800){var r=Math.random()*(montageT0-0.4);tries++;if(pool.every(function(p){return Math.abs(p-r)>0.8}))pool.push(r)}
pool.sort(function(a,b){return a-b});
}
}
document.getElementById('vplay').addEventListener('click',function(){startEdit(false)});
document.getElementById('vrender').addEventListener('click',function(){startEdit(true)});
document.getElementById('vstop').addEventListener('click',finishEdit);
function startEdit(record){
if(!videoEl||!events.length){vstep('load a clip and ANALYZE first');return}
if(veBusy)return;veBusy=true;ensureA();
if(actx.state==='suspended')actx.resume();
makeNoise();
videoEl.muted=false;
try{if(!veSrc){veSrc=actx.createMediaElementSource(videoEl);veG=actx.createGain();veSrc.connect(veG);veG.connect(actx.destination)}}catch(e){}
if(record){if(!mdest)mdest=actx.createMediaStreamDestination();if(veG&&!veGdst){veG.connect(mdest);veGdst=true}}
vsongSrc=null;vsongGain=null;
if(songBuf){
vsongSrc=actx.createBufferSource();vsongSrc.buffer=songBuf;
vsongGain=actx.createGain();vsongGain.gain.value=0.9;
vsongSrc.connect(vsongGain);vsongGain.connect(actx.destination);
if(record)vsongGain.connect(mdest);
if(effStyle==='full'){
var delay=Math.max(0,montageT0);
vsongSrc.start(actx.currentTime+delay);
if(veG){veG.gain.cancelScheduledValues(actx.currentTime);veG.gain.setValueAtTime(1,actx.currentTime);veG.gain.setValueAtTime(1,actx.currentTime+Math.max(0,delay-0.3));veG.gain.linearRampToValueAtTime(0.25,actx.currentTime+delay+0.5)}
}else{videoEl.muted=true;vsongSrc.start()}
}else{if(veG)veG.gain.value=1}
vrec=null;
if(record){
var stream=vcv.captureStream(30);
if(mdest)mdest.stream.getAudioTracks().forEach(function(t){stream.addTrack(t)});
try{vrec=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp9,opus'})}catch(e){vrec=new MediaRecorder(stream)}
vchunks=[];vrec.ondataavailable=function(e){if(e.data.size)vchunks.push(e.data)};
vrec.onstop=function(){var b=new Blob(vchunks,{type:'video/webm'});var a=document.getElementById('vdl');a.href=URL.createObjectURL(b);a.style.display='';vstep('edit rendered — tap SAVE EDIT',1)};
vrec.start();
}
videoEl.currentTime=0;videoEl.playbackRate=1;videoEl.muted=(effStyle!=='full'&&!!songBuf);
mIdx=0;veT0=performance.now();
var p=videoEl.play();if(p)p.catch(function(){});
loopEdit();
}
function loopEdit(){
var t=(performance.now()-veT0)/1000;
if(t>=editLen||videoEl.ended){finishEdit();return}
if(effStyle==='full'&&t>=montageT0){
while(mIdx<montageHits.length&&t>=montageHits[mIdx].t){var np=pool.length?pool[mIdx%pool.length]:0;try{videoEl.currentTime=np}catch(e){}mIdx++}
}
drawEdit(t);
vraf=requestAnimationFrame(loopEdit);
}
function wrapC(txt,font,maxw){
vctx.font=font;var words=txt.split(' ');var lines=[],lc='';
words.forEach(function(w){var t2=lc?lc+' '+w:w;if(vctx.measureText(t2).width>maxw){lines.push(lc);lc=w}else lc=t2});
if(lc)lines.push(lc);return lines;
}
function drawEdit(t){
var S=STYLES[document.getElementById('vstyle').value];
var dialog=effStyle!=='action';
var vw=videoEl.videoWidth||720,vh=videoEl.videoHeight||1280;
var zoom=1.03+0.015*Math.sin(t*0.9);
var sx=0,sy=0,gh=0,fl=0,sl=0;
var seg=null;
for(var q=0;q<segments.length;q++){if(t>=segments[q].t0&&t<segments[q].t1){seg=segments[q];break}}
if(seg){var F=FRAM[seg.zi];zoom*=F.s;sx+=F.ox*cw;sy+=F.oy*ch}
for(var c=0;c<cuts.length;c++){var dtc=t-cuts[c];if(dtc>=0&&dtc<0.18)zoom+=0.06*(1-dtc/0.18)}
if(!dialog||t>=montageT0){
for(var j=0;j<events.length;j++){
var ev=events[j];if(ev.t<t-0.32)continue;if(ev.t>t)break;
if(dialog&&ev.t<montageT0)continue;
var dur=ev.k==='hit'?0.28:0.16;
var k=1-Math.abs(t-ev.t)/dur;
if(k>0){
if(ev.k==='hit'){zoom+=S.hz*PWR*k;sx+=(Math.random()*2-1)*S.sh*PWR*k;sy+=(Math.random()*2-1)*S.sh*0.6*PWR*k;gh=Math.max(gh,S.gh*k);fl=Math.max(fl,S.fl*k);if(S.sl)sl=Math.max(sl,k)}
else zoom+=0.07*PWR*k;
}}
}
vctx.fillStyle='#000';vctx.fillRect(0,0,cw,ch);
var s=Math.max(cw/vw,ch/vh)*zoom;var w=vw*s,h=vh*s;var x=(cw-w)/2+sx,y=(ch-h)/2+sy;
vctx.filter=dialog?GRADE:S.filter;vctx.drawImage(videoEl,x,y,w,h);vctx.filter='none';
if(gh>0.02){vctx.globalCompositeOperation='lighter';vctx.globalAlpha=gh*0.35;vctx.drawImage(videoEl,x+gh*16,y,w,h);vctx.globalAlpha=gh*0.2;vctx.drawImage(videoEl,x-gh*12,y,w,h);vctx.globalAlpha=1;vctx.globalCompositeOperation='source-over'}
if(sl>0.05){for(var g2=0;g2<3;g2++){var yy=Math.random()*ch,hh=ch*(0.05+Math.random()*0.06),dx=(Math.random()*2-1)*44*sl;vctx.drawImage(vcv,0,yy,cw,hh,dx,yy,cw,hh)}}
if(fl>0.01){vctx.fillStyle='rgba(255,255,255,'+(0.6*fl).toFixed(3)+')';vctx.fillRect(0,0,cw,ch)}
var vg=vctx.createLinearGradient(0,ch*0.62,0,ch);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,'+(dialog?0.8:0.7)+')');vctx.fillStyle=vg;vctx.fillRect(0,ch*0.62,cw,ch*0.38);
if(dialog&&noisePat){vctx.globalAlpha=0.06;vctx.fillStyle=noisePat;vctx.fillRect(0,0,cw,ch);vctx.globalAlpha=1}
if(seg&&seg.text){
vctx.textAlign='center';vctx.shadowColor='rgba(0,0,0,.9)';vctx.shadowBlur=ch/60;
var maxw=cw*0.82;
var lfs=Math.round(ch/34);
var lines=wrapC(seg.text,'700 '+lfs+'px monospace',maxw);
var lh=lfs*1.25;
var y0=ch*0.60-(lines.length-1)*lh;
if(seg.spk){
var ci=SPKNAMES.indexOf(seg.spk);if(ci<0)ci=0;
vctx.font='700 '+Math.round(ch/44)+'px monospace';
vctx.fillStyle=SPKCOL[ci%4];
vctx.fillText(seg.spk.toUpperCase()+':',cw/2,y0-lh*1.05);
}
vctx.font='700 '+lfs+'px monospace';vctx.fillStyle='#fff';
lines.forEach(function(l,i3){vctx.fillText(l,cw/2,y0+i3*lh)});
vctx.shadowBlur=0;vctx.textAlign='left';
}
if(dialog&&t<montageT0){
vctx.fillStyle='rgba(0,0,0,.85)';vctx.fillRect(0,0,cw,ch*0.075);vctx.fillRect(0,ch*0.925,cw,ch*0.075);
}
vctx.fillStyle='#00e5ff';vctx.font='600 18px monospace';vctx.fillText('SHORTFORGE EDIT · '+t.toFixed(1)+'s',24,ch-24);
}
function finishEdit(){
cancelAnimationFrame(vraf);veBusy=false;
try{videoEl.pause()}catch(e){}
try{if(vsongSrc)vsongSrc.stop()}catch(e){}
if(vrec&&vrec.state!=='inactive')setTimeout(function(){vrec.stop()},120);
}

/* drop zone */
var vd=document.getElementById('vdrop');
['dragover','dragenter'].forEach(function(ev){vd.addEventListener(ev,function(e){e.preventDefault();vd.classList.add('on')})});
['dragleave','drop'].forEach(function(ev){vd.addEventListener(ev,function(e){e.preventDefault();vd.classList.remove('on')})});
vd.addEventListener('drop',function(e){var f=e.dataTransfer.files&&e.dataTransfer.files[0];if(f){var inp=document.getElementById('vfile');try{var dt=new DataTransfer();dt.items.add(f);inp.files=dt.files}catch(x){}inp.dispatchEvent(new Event('change'))}});
