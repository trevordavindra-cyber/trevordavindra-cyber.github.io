/* music */
var actx=null,mgain=null,sdest=null,mtimer=null,stepn=0,mcfg=null;
var BEATS={phonk:{iv:236,kg:.9,k0:150,k1:48,kd:.18,hg:.25,ng:.22,notes:[110,110,131,98],type:'triangle'},
hard:{iv:196,kg:1.0,k0:190,k1:55,kd:.14,hg:.34,ng:.26,notes:[98,98,116,87],type:'sawtooth'},
lofi:{iv:300,kg:.55,k0:120,k1:44,kd:.22,hg:.14,ng:.16,notes:[82,82,98,73],type:'sine'}};
function beatCfg(){try{var v=document.getElementById('beatstyle').value;return BEATS[v]||BEATS.phonk}catch(e){return BEATS.phonk}}
function startMusic(){
try{if(!actx){actx=new (window.AudioContext||window.webkitAudioContext)();mgain=actx.createGain();mgain.gain.value=.16;sdest=actx.createMediaStreamDestination();mgain.connect(actx.destination);mgain.connect(sdest)}
if(actx.state==='suspended')actx.resume();
mcfg=beatCfg();stepn=0;if(mtimer)clearInterval(mtimer);mtimer=setInterval(beat,mcfg.iv)}catch(e){}
}
function beat(){
if(!actx)return;var t=actx.currentTime,b=stepn%8,c=mcfg||BEATS.phonk;
if(b===0||b===4){var o=actx.createOscillator(),g=actx.createGain();o.frequency.setValueAtTime(c.k0,t);o.frequency.exponentialRampToValueAtTime(c.k1,t+.12);g.gain.setValueAtTime(c.kg,t);g.gain.exponentialRampToValueAtTime(.001,t+c.kd);o.connect(g);g.connect(mgain);o.start(t);o.stop(t+c.kd+.05);window.__sfBeat=performance.now()}
if(b%2===1){var b2=actx.createBuffer(1,2205,44100),d=b2.getChannelData(0);for(var i=0;i<2205;i++)d[i]=(Math.random()*2-1)*(1-i/2205);var hs=actx.createBufferSource();hs.buffer=b2;var hg=actx.createGain();hg.gain.value=c.hg;hs.connect(hg);hg.connect(mgain);hs.start(t)}
var o2=actx.createOscillator(),g2=actx.createGain();o2.type=c.type;o2.frequency.value=c.notes[Math.floor(stepn/8)%4];g2.gain.setValueAtTime(c.ng,t);g2.gain.exponentialRampToValueAtTime(.001,t+.22);o2.connect(g2);g2.connect(mgain);o2.start(t);o2.stop(t+.24);
stepn++;
}
function stopMusic(){if(mtimer){clearInterval(mtimer);mtimer=null}}

/* exports */
function dl(blob,name){var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click()}
document.getElementById('srt').addEventListener('click',function(){
if(!SCENES.length)return;function f(t){var s=Math.floor(t),ms=Math.round((t-s)*1000),h=Math.floor(s/3600),m=Math.floor(s%3600/60),sec=s%60;return('0'+h).slice(-2)+':'+('0'+m).slice(-2)+':'+('0'+sec).slice(-2)+','+('00'+ms).slice(-3)}
var out='',t0=0;
SCENES.forEach(function(s,i){var t1=t0+SDUR[i];out+=(i+1)+'\n'+f(t0)+' --> '+f(t1)+'\n'+s.cap+'\n\n';t0=t1});
dl(new Blob([out],{type:'text/plain'}),'shortforge.srt');step('subtitles downloaded',1);
});
document.getElementById('thumb').addEventListener('click',function(){
if(!SCENES.length)return;
si=0;st=Date.now()-SDUR[0]*600;var keep=playing;playing=false;cancelAnimationFrame(raf);draw();
setTimeout(function(){try{cv.toBlob(function(b){if(b){dl(b,'shortforge-thumb.png');step('thumbnail saved',1)}},'image/png')}catch(e){step('thumbnail blocked: images still loading, try again',0)}if(keep){playing=true}},700);
});
var rec=null,chunks=[];
document.getElementById('rec').addEventListener('click',function(){
if(!SCENES.length||playing)return;
var stream=cv.captureStream(30);
try{startMusic();if(sdest)sdest.stream.getAudioTracks().forEach(function(t){stream.addTrack(t)})}catch(e){}
var mimes=['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/webm;codecs=vp9','video/webm'];var mi=0;rec=null;while(mi<mimes.length){try{rec=new MediaRecorder(stream,{mimeType:mimes[mi]});break}catch(e){mi++}}if(!rec)rec=new MediaRecorder(stream);
chunks=[];rec.ondataavailable=function(e){if(e.data.size)chunks.push(e.data)};
rec.onstop=function(){stopMusic();try{speechSynthesis.cancel()}catch(e){};var mp4=rec.mimeType&&rec.mimeType.indexOf('mp4')>=0;var b=new Blob(chunks,{type:rec.mimeType||'video/webm'});var a=document.getElementById('dl');a.href=URL.createObjectURL(b);a.download=mp4?'shortforge.mp4':'shortforge.webm';a.textContent=mp4?'⬇ SAVE VIDEO (MP4)':'⬇ SAVE VIDEO';a.style.display='';step('export done ('+(mp4?'mp4':'webm')+') — tap SAVE VIDEO',1)};
this.disabled=true;
si=0;st=Date.now();playing=true;startMusic();speakScene();cancelAnimationFrame(raf);draw();
var total=SDUR.reduce(function(a,b){return a+b},0)*1000;
setTimeout(function(){if(playing){playing=false;rec.stop()}this.disabled=false}.bind(this),total+400);
});
