/* music */
var actx=null,mgain=null,sdest=null,mtimer=null,stepn=0;
function startMusic(){
try{if(!actx){actx=new (window.AudioContext||window.webkitAudioContext)();mgain=actx.createGain();mgain.gain.value=.16;sdest=actx.createMediaStreamDestination();mgain.connect(actx.destination);mgain.connect(sdest)}
if(actx.state==='suspended')actx.resume();
stepn=0;mtimer=setInterval(beat,236)}catch(e){}
}
function beat(){
if(!actx)return;var t=actx.currentTime;var b=stepn%8;
if(b===0||b===4){var o=actx.createOscillator(),g=actx.createGain();o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(48,t+.12);g.gain.setValueAtTime(.9,t);g.gain.exponentialRampToValueAtTime(.001,t+.18);o.connect(g);g.connect(mgain);o.start(t);o.stop(t+.2)}
if(b%2===1){var b2=actx.createBuffer(1,2205,44100),d=b2.getChannelData(0);for(var i=0;i<2205;i++)d[i]=(Math.random()*2-1)*(1-i/2205);var hs=actx.createBufferSource();hs.buffer=b2;var hg=actx.createGain();hg.gain.value=.25;hs.connect(hg);hg.connect(mgain);hs.start(t)}
var notes=[110,110,131,98];var o2=actx.createOscillator(),g2=actx.createGain();o2.type='triangle';o2.frequency.value=notes[Math.floor(stepn/8)%4];g2.gain.setValueAtTime(.22,t);g2.gain.exponentialRampToValueAtTime(.001,t+.22);o2.connect(g2);g2.connect(mgain);o2.start(t);o2.stop(t+.24);
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
var mime='video/webm;codecs=vp9';try{rec=new MediaRecorder(stream,{mimeType:mime})}catch(e){rec=new MediaRecorder(stream)}
chunks=[];rec.ondataavailable=function(e){if(e.data.size)chunks.push(e.data)};
rec.onstop=function(){stopMusic();try{speechSynthesis.cancel()}catch(e){};var b=new Blob(chunks,{type:'video/webm'});var a=document.getElementById('dl');a.href=URL.createObjectURL(b);a.style.display='';step('export done — tap SAVE VIDEO',1)};
this.disabled=true;
si=0;st=Date.now();playing=true;startMusic();speakScene();cancelAnimationFrame(raf);draw();
var total=SDUR.reduce(function(a,b){return a+b},0)*1000;
setTimeout(function(){if(playing){playing=false;rec.stop()}this.disabled=false}.bind(this),total+400);
});
