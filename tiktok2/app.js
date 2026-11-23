'use strict';
var $=function(id){return document.getElementById(id)};
var logEl=$('log');
function log(s,hl){if(!logEl)return;var d=document.createElement('div');if(hl)d.innerHTML='<b>'+s+'</b>';else d.textContent=s;logEl.appendChild(d);logEl.scrollTop=logEl.scrollHeight}
function sleep(ms){return new Promise(function(r){setTimeout(r,ms)})}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')}
function uid(){return 'x'+Math.random().toString(36).slice(2,9)}
function clamp(v,a,b){return Math.min(b,Math.max(a,v))}
var M={}; // media: id -> {id,name,kind,blob,url,dur,scenes,beats,stats,buf,el}
var S={name:'Untitled',clips:[],captions:[],musicId:null,musicGain:.8,musicOffset:0,style:'cinematic',capStyle:'bold',res:720,fps:30,variations:[],selected:null,refId:null};
var STYLES={
anime:{label:'ANIME',grade:'saturate(1.5) contrast(1.12)',vig:.25,grain:0,pace:1.6,trans:['punch','flash','cut'],clip:[0.8,1.6],zoom:1.25,cap:'karaoke',bars:0,tint:null},
football:{label:'FOOTBALL',grade:'contrast(1.22) saturate(1.3)',vig:.3,grain:.05,pace:2.0,trans:['flash','punch','shake'],clip:[0.5,1.0],zoom:1.3,cap:'bold',bars:0,tint:null},
gaming:{label:'GAMING',grade:'saturate(1.3) contrast(1.15) hue-rotate(-6deg)',vig:.28,grain:.04,pace:1.8,trans:['cut','punch','flash'],clip:[0.6,1.2],zoom:1.35,cap:'karaoke',bars:0,tint:null},
marvel:{label:'MARVEL',grade:'contrast(1.18) saturate(1.1)',vig:.32,grain:.03,pace:1.3,trans:['punch','fade','whip'],clip:[1.0,2.0],zoom:1.2,cap:'bold',bars:.055,tint:null},
movies:{label:'MOVIES',grade:'contrast(1.12) saturate(.95) sepia(.08)',vig:.35,grain:.06,pace:1.1,trans:['fade','cut'],clip:[1.2,2.6],zoom:1.15,cap:'bar',bars:.12,tint:null},
cinematic:{label:'CINEMATIC',grade:'saturate(1.15) contrast(1.12) hue-rotate(-8deg)',vig:.33,grain:.05,pace:.9,trans:['fade','cut','punch'],clip:[1.4,3.0],zoom:1.12,cap:'bold',bars:.12,tint:null},
dark:{label:'DARK AESTHETIC',grade:'brightness(.85) contrast(1.25) saturate(.85)',vig:.4,grain:.08,pace:1.2,trans:['fade','cut','flash'],clip:[0.9,1.8],zoom:1.18,cap:'bold',bars:0,tint:'rgba(10,0,25,.16)'},
velocity:{label:'VELOCITY',grade:'saturate(1.35) contrast(1.2)',vig:.25,grain:.05,pace:2.2,trans:['punch','whip','shake'],clip:[0.45,0.9],zoom:1.4,cap:'karaoke',bars:0,tint:null,ramp:true},
phonk:{label:'PHONK',grade:'contrast(1.3) saturate(.9) brightness(.9)',vig:.4,grain:.12,pace:2.0,trans:['punch','shake','flash'],clip:[0.5,1.0],zoom:1.35,cap:'bold',bars:0,tint:'rgba(80,0,120,.14)'},
luxury:{label:'LUXURY',grade:'sepia(.22) saturate(1.15) contrast(1.08) brightness(1.02)',vig:.3,grain:.03,pace:1.0,trans:['fade','cut'],clip:[1.2,2.4],zoom:1.1,cap:'bold',bars:.08,tint:null},
documentary:{label:'DOCUMENTARY',grade:'saturate(.95) contrast(1.05)',vig:.2,grain:.05,pace:.65,trans:['cut','fade'],clip:[2.0,4.0],zoom:1.08,cap:'bar',bars:0,tint:null},
emotional:{label:'EMOTIONAL',grade:'saturate(.9) brightness(.98) contrast(1.05)',vig:.3,grain:.04,pace:.8,trans:['fade','cut'],clip:[1.5,3.0],zoom:1.1,cap:'bold',bars:0,tint:'rgba(255,150,80,.05)'}};
var STYLIST=['anime','football','gaming','marvel','movies','cinematic','dark','velocity','phonk','luxury','documentary','emotional'];
// ---------- storage ----------
var idb=null;
function idbOpen(){return new Promise(function(res){var r=indexedDB.open('tk2',1);r.onupgradeneeded=function(){r.result.createObjectStore('m')};r.onsuccess=function(){idb=r.result;res()};r.onerror=function(){res()}})}
function idbPut(k,blob){return new Promise(function(res){if(!idb)return res();var t=idb.transaction('m','readwrite');t.objectStore('m').put(blob,k);t.oncomplete=res;t.onerror=res})}
function idbGet(k){return new Promise(function(res){if(!idb)return res(null);var r=idb.transaction('m').objectStore('m').get(k);r.onsuccess=function(){res(r.result||null)};r.onerror=function(){res(null)}})}
function idbDel(k){return new Promise(function(res){if(!idb)return res();var t=idb.transaction('m','readwrite');t.objectStore('m').delete(k);t.oncomplete=res;t.onerror=res})}
function idbKeys(){return new Promise(function(res){if(!idb)return res([]);var r=idb.transaction('m').objectStore('m').getAllKeys();r.onsuccess=function(){res(r.result||[])};r.onerror=function(){res([])}})}
// ---------- media ----------
function durOf(kind,url){return new Promise(function(res){var el=document.createElement(kind==='audio'?'audio':'video');el.preload='metadata';el.onloadedmetadata=function(){res({dur:el.duration,el:el})};el.onerror=function(){res({dur:0,el:null})};el.src=url})}
async function addMedia(file,kind,extra){
  var id=uid();
  var blob=extra||file; var url=URL.createObjectURL(blob);
  var p=await durOf(kind,url);
  var m={id:id,name:file.name||('clip '+id),kind:kind,blob:blob,url:url,dur:p.dur};
  M[id]=m;
  await idbPut(id,blob);
  log('added '+m.name+' ('+p.dur.toFixed(1)+'s)',true);
  renderMediaList();save();
  if(kind==='video'){analyzeScenes(m).catch(function(e){log('scene analysis: '+e.message)})}
  if(kind==='audio'){detectBeats(m).catch(function(e){log('beat detection: '+e.message)})}
  return m;
}
async function analyzeScenes(m){
  if(!m||!m.dur)return;
  log('analyzing scenes: '+m.name);
  var n=clamp(Math.ceil(m.dur*2),12,90);
  var cv=document.createElement('canvas');cv.width=96;cv.height=170;
  var cx=cv.getContext('2d',{willReadFrequently:true});
  var el=document.createElement('video');el.src=m.url;el.muted=true;el.playsInline=true;el.preload='auto';
  await new Promise(function(res){el.onloadeddata=res;el.onerror=res;setTimeout(res,4000)});
  var frames=[],times=[],sat=0,brt=0;
  for(var i=0;i<n;i++){
    var t=m.dur*(i+0.5)/n;
    try{await seekTo(el,t,3000)}catch(e){continue}
    try{cx.drawImage(el,0,0,96,170)}catch(e){continue}
    var d=cx.getImageData(0,0,96,170).data;
    var lum=new Float32Array(96*170),s=0,b=0;
    for(var j=0;j<96*170;j++){var r=d[j*4],g=d[j*4+1],b2=d[j*4+2];var mx=Math.max(r,g,b2),mn=Math.min(r,g,b2);lum[j]=0.299*r+0.587*g+0.114*b2;s+=(mx-mn)/255;b+=(r+g+b2)/765}
    frames.push(lum);times.push(t);sat+=s/(96*170);brt+=b/(96*170);
  }
  var diffs=[];
  for(var i=1;i<frames.length;i++){var dsum=0;for(var j=0;j<frames[i].length;j+=2){dsum+=Math.abs(frames[i][j]-frames[i-1][j])}diffs.push(dsum/(frames[i].length/2))}
  var mean=diffs.reduce(function(a,b){return a+b},0)/Math.max(1,diffs.length);
  var thr=Math.max(14,mean*2.1);
  var scenes=[],sStart=times[0]||0,sDiffs=[0];
  for(var i=0;i<diffs.length;i++){
    if(diffs[i]>thr){scenes.push({start:sStart,end:times[i+1],score:sDiffs.reduce(function(a,b){return a+b},0)/Math.max(1,sDiffs.length)});sStart=times[i+1];sDiffs=[]}
    else sDiffs.push(diffs[i]);
  }
  scenes.push({start:sStart,end:m.dur,score:sDiffs.reduce(function(a,b){return a+b},0)/Math.max(1,sDiffs.length)});
  scenes.forEach(function(sc){sc.mid=(sc.start+sc.end)/2;sc.dur=sc.end-sc.start});
  m.scenes=scenes.filter(function(s){return s.dur>0.35});
  m.stats={cutsPerMin:m.scenes.length/Math.max(0.1,m.dur)*60,sat:sat/Math.max(1,frames.length),bright:brt/Math.max(1,frames.length)};
  log(m.name+': '+m.scenes.length+' scenes, '+m.stats.cutsPerMin.toFixed(0)+' cuts/min',true);
  save();
}
function seekTo(el,t,timeout){return new Promise(function(res,rej){
  var done=false;
  var ok=function(){if(done)return;done=true;el.removeEventListener('seeked',ok);res()};
  el.addEventListener('seeked',ok);
  try{el.currentTime=clamp(t,0,(el.duration||1e9)-0.05)}catch(e){ok()}
  setTimeout(function(){if(!done){done=true;el.removeEventListener('seeked',ok);res()}},timeout||3000);
})}
async function detectBeats(m){
  var actx=new (window.AudioContext||window.webkitAudioContext)();
  var buf=await actx.decodeAudioData(await m.blob.arrayBuffer());
  m.buf=buf;
  var ch=buf.getChannelData(0),sr=buf.sampleRate,hop=512;
  var env=[];
  for(var i=0;i+hop<ch.length;i+=hop){var s=0;for(var j=0;j<hop;j+=4){s+=ch[i+j]*ch[i+j]}env.push(Math.sqrt(s/(hop/4)))}
  var W=43,beats=[],last=-9;
  for(var i=W;i<env.length-W;i++){
    var loc=0;for(var j=-W;j<=W;j+=3)loc+=env[i+j];loc/=(2*W/3+1);
    if(env[i]>loc*1.4&&env[i]>0.012&&(i/sr)-last>0.22){beats.push(i/sr);last=i/sr}
  }
  // bpm: median gap
  var gaps=[];for(var i=1;i<beats.length;i++)gaps.push(beats[i]-beats[i-1]);
  gaps.sort(function(a,b){return a-b});
  var bpm=gaps.length?Math.round(60/gaps[Math.floor(gaps.length/2)]):0;
  if(bpm>180)bpm/=2; if(bpm&&bpm<60)bpm*=2;
  m.beats=beats;m.bpm=bpm;
  actx.close();
  log(m.name+': '+beats.length+' beats'+(bpm?' · ~'+bpm+' bpm':''),true);
  save();renderMediaList();
}
function videoMedias(){return Object.values(M).filter(function(m){return m.kind==='video'})}
// ---------- cut plan ----------
function clipOutDur(c){
  var base=(c.end-c.start)/c.speed;
  if(!c.ramp)return base;
  var dur=0,steps=24,r0=c.speed*0.55,r1=c.speed*1.45;
  for(var i=0;i<steps;i++){var r=r0+(r1-r0)*i/steps;dur+=((c.end-c.start)/steps)/r}
  return dur;
}
function totalDur(){return S.clips.reduce(function(a,c){return a+clipOutDur(c)},0)}
function pickSeg(m,want,used){
  var scs=(m.scenes&&m.scenes.length?m.scenes.slice():[{start:0,end:Math.max(0.5,m.dur||1),score:1}]);
  scs.sort(function(a,b){return b.score-a.score});
  for(var i=0;i<scs.length;i++){var sc=scs[i];
    var room=sc.end-sc.start;
    var s=sc.start+Math.random()*Math.max(0,room-want)*0.4;
    var e=Math.min(sc.end,s+want);
    if(e-s<0.3)e=Math.min(m.dur,s+0.3);
    return{src:m.id,start:s,end:e};
  }
  return{src:m.id,start:0,end:Math.min(want,m.dur)};
}
function buildPlan(paceMult,label){
  var st=STYLES[S.style];
  var vids=videoMedias();
  if(!vids.length)throw new Error('no footage in the library yet');
  var beats=(S.musicId&&M[S.musicId]&&M[S.musicId].beats)||[];
  var clips=[];
  var target=Math.min(32,Math.max(12,vids.reduce(function(a,m){return a+(m.dur||0)},0)*0.5));
  var iv=1/(st.pace*paceMult);
  var starts=[];
  if(beats.length>6){
    var off=S.musicOffset,k=1;
    while(k<beats.length&&beats[k]-beats[k-1]<iv*0.7)k++;
    var t=off;var bi=0;
    while(bi<beats.length&&beats[bi]<off)bi++;
    while(t<target+off&&bi<beats.length){
      var next=beats[bi];
      if(next-t>=iv*0.7){starts.push({t:t,d:next-t});t=next}
      bi++;
      if(starts.length>60)break;
    }
    if(!starts.length)starts.push({t:off,d:iv});
  } else {
    var t=0;while(t<target){starts.push({t:t,d:iv});t+=iv;if(starts.length>60)break}
  }
  var vi=0,used={};
  starts.forEach(function(sl,idx){
    var m=vids[vi%vids.length];vi++;
    var want=Math.min(sl.d,Math.max(0.35,st.clip[0]+Math.random()*(st.clip[1]-st.clip[0])));
    var seg=pickSeg(m,want);
    clips.push({id:uid(),src:seg.src,start:seg.start,end:seg.end,speed:1,
      ramp:st.ramp&&idx%3===0?1:0,zoom:(idx%2?-1:1)*(0.9+Math.random()*0.35),
      trans:st.trans[idx%st.trans.length],keep:0});
  });
  return{label:label,clips:clips};
}
function applyPlan(plan){
  S.clips=plan.clips.map(function(c){return Object.assign({},c)});
  drawTimeline();save();
  log('plan "'+plan.label+'": '+S.clips.length+' clips, '+totalDur().toFixed(1)+'s',true);
}
async function makeVariations(){
  try{
    S.variations=[buildPlan(1.35,'FAST'),buildPlan(1,'STOCK'),buildPlan(0.65,'CINEMATIC')];
    applyPlan(S.variations[1]);
    log('3 variations ready — export tab renders them all',true);
  }catch(e){log('variations: '+e.message)}
}
async function autoEdit(){
  try{
    var p=buildPlan(1,'AUTO');applyPlan(p);$('playhint').style.display='none';
  }catch(e){log('auto edit: '+e.message)}
}
// ---------- render engine ----------
var grainCv=null;
function getGrain(){
  if(grainCv)return grainCv;
  grainCv=document.createElement('canvas');grainCv.width=180;grainCv.height=320;
  var g=grainCv.getContext('2d'),d=g.createImageData(180,320);
  for(var i=0;i<d.data.length;i+=4){var v=Math.random()*255;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}
  g.putImageData(d,0,0);return grainCv;
}
var fxT1=null,mmCv=null,mmCtx=null,mmPrev=null,prevCv=null,prevCtx=null;
function fxTemp(w,h){if(!fxT1)fxT1=document.createElement('canvas');if(fxT1.width!==w||fxT1.height!==h){fxT1.width=w;fxT1.height=h}return fxT1}
function drawCover(ctx,im,W,H,zoom,panX,panY,key){
  var s0=Math.max(W/im.width,H/im.height)*zoom;
  var dw=im.width*s0,dh=im.height*s0;
  if(key&&key.color){
    var tc=fxTemp(im.width,im.height);
    var tcx=tc.getContext('2d',{willReadFrequently:true});
    tcx.drawImage(im,0,0);
    var dd=tcx.getImageData(0,0,tc.width,tc.height).data;
    var kc=key.color,tol=(key.tol||0.22)*3;
    for(var i=0;i<dd.length;i+=4){
      var dist=Math.abs(dd[i]/255-kc[0])+Math.abs(dd[i+1]/255-kc[1])+Math.abs(dd[i+2]/255-kc[2]);
      if(dist<tol)dd[i+3]=0;else if(dist<tol*1.5)dd[i+3]=Math.round(255*(dist-tol)/(tol*0.5));
    }
    tcx.putImageData(new ImageData(dd,tc.width,tc.height),0,0);
    if(key.bg&&key.bg.width){var s1=Math.max(W/key.bg.width,H/key.bg.height);ctx.drawImage(key.bg,(W-key.bg.width*s1)/2,(H-key.bg.height*s1)/2,key.bg.width*s1,key.bg.height*s1)}
    else{ctx.fillStyle='#111826';ctx.fillRect(0,0,W,H)}
    ctx.drawImage(tc,(W-dw)/2+(panX||0),(H-dh)/2+(panY||0),dw,dh);
    return;
  }
  ctx.drawImage(im,(W-dw)/2+(panX||0),(H-dh)/2+(panY||0),dw,dh);
}
function drawCaption(ctx,cap,t,W,H,mode){
  if(!cap)return;
  var fs,box=false;
  if(mode==='bar'){fs=44;box=true}else{fs=58}
  ctx.font='900 '+fs+'px Arial, sans-serif';
  while(ctx.measureText(cap.text).width>W-70&&fs>26){fs-=3;ctx.font='900 '+fs+'px Arial, sans-serif'}
  var y=mode==='bar'?H-190:H-250;
  if(box){ctx.fillStyle='rgba(0,0,0,.55)';var w=ctx.measureText(cap.text).width+30;ctx.fillRect(W/2-w/2,y-fs*0.75,w,fs*1.5)}
  var sc=1;
  var dt=t-cap.t0;
  if(mode==='karaoke'&&dt<0.14)sc=1.35-2.5*dt;
  ctx.save();ctx.translate(W/2,y);ctx.scale(sc,sc);
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
  ctx.lineWidth=fs*0.18;ctx.strokeStyle='#000';ctx.strokeText(cap.text,0,0);
  ctx.fillStyle='#fff';ctx.fillText(cap.text,0,0);ctx.restore();
}
function clipFX(ctx,c,local,od,W,H){
  var fx=c.fx||[];
  if(!fx.length)return;
  var p=clamp(local/od,0,1);
  for(var q=0;q<fx.length;q++){var f=fx[q];
    if(f==='glitch'){
      if(Math.random()<0.35){var sl=3+Math.floor(Math.random()*4);
        for(var s2=0;s2<sl;s2++){var y=Math.random()*H,h2=6+Math.random()*22,dx=(Math.random()-0.5)*44;
          try{ctx.drawImage(ctx.canvas,0,y,W,h2,dx,y,W,h2)}catch(e){}}
        ctx.fillStyle='rgba(0,229,255,.14)';ctx.fillRect(0,Math.random()*H,W,2)}}
    else if(f==='rgbsplit'){
      try{ctx.globalCompositeOperation='screen';ctx.globalAlpha=.45;ctx.drawImage(ctx.canvas,3,0);ctx.drawImage(ctx.canvas,-3,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}catch(e){}}
    else if(f==='lightleak'){
      var g2=ctx.createLinearGradient(0,0,W,H);g2.addColorStop(0,'rgba(255,120,40,'+(0.2+0.1*Math.sin(local*3))+')');g2.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g2;ctx.fillRect(0,0,W,H)}
    else if(f==='scanlines'){
      ctx.fillStyle='rgba(0,0,0,.16)';for(var y2=0;y2<H;y2+=6)ctx.fillRect(0,y2,W,2)}
    else if(f==='mirror'){
      try{ctx.save();ctx.translate(W,0);ctx.scale(-1,1);ctx.globalAlpha=.35;ctx.drawImage(ctx.canvas,0,0,W/2,H,0,0,W/2,H);ctx.restore();ctx.globalAlpha=1}catch(e){}}
    else if(f==='glowpulse'){
      ctx.fillStyle='rgba(255,255,255,'+(0.1+0.08*Math.sin(local*6))+')';ctx.fillRect(0,0,W,H)}
    else if(f==='depth2d'){
      try{ctx.save();ctx.globalAlpha=.22;ctx.drawImage(ctx.canvas,(p-0.5)*10,(p-0.5)*18);ctx.restore();ctx.globalAlpha=1}catch(e){}}
    else if(f==='frameblend'){
      try{
        if(!prevCv){prevCv=document.createElement('canvas');prevCv.width=W;prevCv.height=H;prevCtx=prevCv.getContext('2d')}
        ctx.save();ctx.globalAlpha=.3;ctx.drawImage(prevCv,0,0);ctx.restore();ctx.globalAlpha=1;
      }catch(e){}}
    else if(f==='motionmask'){
      try{
        if(!mmCv){mmCv=document.createElement('canvas');mmCv.width=Math.max(2,Math.round(W/10));mmCv.height=Math.max(2,Math.round(H/10));mmCtx=mmCv.getContext('2d',{willReadFrequently:true})}
        mmCtx.drawImage(ctx.canvas,0,0,mmCv.width,mmCv.height);
        var md=mmCtx.getImageData(0,0,mmCv.width,mmCv.height).data;
        if(mmPrev&&mmPrev.length===md.length){
          for(var i2=0;i2<md.length;i2+=4){
            var mv=Math.abs(md[i2]-mmPrev[i2])+Math.abs(md[i2+1]-mmPrev[i2+1])+Math.abs(md[i2+2]-mmPrev[i2+2]);
            if(mv>70){ctx.fillStyle='rgba(0,229,255,.45)';ctx.fillRect((i2/4%mmCv.width)*10,Math.floor(i2/4/mmCv.width)*10,10,10)}
          }
        }
        mmPrev=new Uint8ClampedArray(md);
      }catch(e){}}
    else if(f==='patch'&&c.patch){
      try{
        var px=c.patch.x*W,py=c.patch.y*H,pw=c.patch.w*W,ph=c.patch.h*H;
        var tmp=fxTemp(24,24);var tctx=tmp.getContext('2d');
        tctx.drawImage(ctx.canvas,px,py,pw,ph,0,0,24,24);
        ctx.save();ctx.filter='blur(10px)';ctx.drawImage(tmp,0,0,24,24,px,py,pw,ph);ctx.restore();ctx.filter='none';
      }catch(e){}}
  }
  if(fx.indexOf('frameblend')>-1&&prevCtx){try{prevCtx.drawImage(ctx.canvas,0,0)}catch(e){}}
}
async function renderProject(opts){
  opts=opts||{};
  var cv=opts.canvas||$('cv');
  var W=S.res,H=Math.round(S.res*16/9);
  cv.width=W;cv.height=H;
  var ctx=cv.getContext('2d');
  if(!S.clips.length)throw new Error('nothing on the timeline');
  var st=STYLES[S.style]||STYLES.cinematic;
  // video elements
  var els={};
  var srcs=[...new Set(S.clips.map(function(c){return c.src}))];
  for(var i=0;i<srcs.length;i++){
    var m=M[srcs[i]];if(!m)throw new Error('missing footage');
    var el=document.createElement('video');el.src=m.url;el.muted=false;el.playsInline=true;el.preload='auto';el.crossOrigin='anonymous';
    els[m.id]=el;
  }
  var actx=new (window.AudioContext||window.webkitAudioContext)();
  await actx.resume();
  var dest=actx.createMediaStreamDestination();
  var master=actx.createGain();master.gain.value=1;master.connect(dest);
  var elGains={};
  srcs.forEach(function(s){var g=actx.createGain();g.gain.value=0;g.connect(master);elGains[s]=g});
  // music
  var musSrc=null;
  if(S.musicId&&M[S.musicId]){
    var mm=M[S.musicId];
    if(!mm.buf)mm.buf=await actx.decodeAudioData(await mm.blob.arrayBuffer());
    musSrc=actx.createBufferSource();musSrc.buffer=mm.buf;
    var mg=actx.createGain();mg.gain.value=S.musicGain;
    musSrc.connect(mg);mg.connect(master);
  }
  var voSrc=null;
  if(S.voId&&M[S.voId]){
    var vm=M[S.voId];
    if(!vm.buf)vm.buf=await actx.decodeAudioData(await vm.blob.arrayBuffer());
    voSrc=actx.createBufferSource();voSrc.buffer=vm.buf;
    var vg2=actx.createGain();vg2.gain.value=(typeof S.voGain==='number'?S.voGain:1);
    voSrc.connect(vg2);vg2.connect(master);
  }
  if(window.fxAudioHook)window.fxAudioHook(actx,master,musSrc?mg:null);
  var elMES={};
  // recorder
  var mime='';var o=['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4','video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'];
  for(var i=0;i<o.length;i++){if(window.MediaRecorder&&MediaRecorder.isTypeSupported(o[i])){mime=o[i];break}}
  var stream=null,rec=null,chunks=[],done=null;
  if(opts.record){
    stream=cv.captureStream(S.fps);
    dest.stream.getAudioTracks().forEach(function(tr){stream.addTrack(tr)});
    rec=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:S.res>=1080?8000000:5000000,audioBitsPerSecond:128000});
    rec.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data)};
    done=new Promise(function(res){rec.onstop=function(){res(new Blob(chunks,{type:mime||'video/webm'}))}});
  }
  // preseek first frames
  var firstBySrc={};
  S.clips.forEach(function(c){if(!firstBySrc[c.src])firstBySrc[c.src]=c});
  for(var s in firstBySrc){try{await seekTo(els[s],firstBySrc[s].start,4000)}catch(e){}}
  if(window.fxPreload)await window.fxPreload(S);
  var starts=[],t=0;
  S.clips.forEach(function(c){starts.push(t);t+=clipOutDur(c)});
  var total=t+0.12;
  var t0=actx.currentTime+0.4;
  if(musSrc)musSrc.start(t0+S.musicOffset%(mm?mm.buf.duration:1e9));
  if(voSrc)voSrc.start(t0);
  if(window.fxTimelineHook)window.fxTimelineHook(actx,master,t0,starts,total);
  S.clips.forEach(function(c){try{var el=els[c.src];if(!elMES[c.src]){elMES[c.src]=actx.createMediaElementSource(el);elMES[c.src].connect(elGains[c.src])}}catch(e){}});
  if(rec)rec.start(500);
  var lastIdx=-1,curEl=null;
  var grain=getGrain();
  var stopped=false;
  function cleanup(){stopped=true;try{curEl&&curEl.pause()}catch(e){};Object.values(els).forEach(function(e){try{e.pause()}catch(x){}});try{musSrc&&musSrc.stop()}catch(x){};setTimeout(function(){actx.close()},400)}
  return new Promise(function(resolve,reject){
    function frame(){
      if(stopped)return;
      if(STOPFLAG){STOPFLAG=false;cleanup();if(rec){try{rec.stop()}catch(x){}}resolve(opts.record?done:{ok:true});return}
      var t=actx.currentTime-t0;
      if(t>=total){
        cleanup();
        if(rec){try{rec.stop()}catch(x){}}
        resolve(opts.record?done:{ok:true});
        return;
      }
      if(t<0){requestAnimationFrame(frame);return}
      // find clip
      var idx=0;while(idx<S.clips.length-1&&t>=starts[idx+1])idx++;
      var c=S.clips[idx],local=t-starts[idx],od=clipOutDur(c),p=clamp(local/od,0,1);
      if((c.afIn||c.afOut)&&elGains[c.src]){var g0=(c.keep?1:0)*(c.again||1);if(c.afIn&&local<c.afIn)g0*=local/c.afIn;if(c.afOut&&(od-local)<c.afOut)g0*=(od-local)/c.afOut;elGains[c.src].gain.value=g0}
      if(idx!==lastIdx){
        if(curEl&&curEl!==els[c.src]){try{curEl.pause()}catch(x){}}
        var el=els[c.src];curEl=el;
        var cont=lastIdx>=0&&S.clips[lastIdx].src===c.src&&Math.abs(S.clips[lastIdx].end-c.start)<0.2;
        if(!cont){try{el.currentTime=c.start}catch(x){}}
        try{el.play()}catch(x){}
        elGains[c.src].gain.value=(c.keep?1:0)*(c.again||1);
        lastIdx=idx;
      }
      // overrun guard
      try{
        if(curEl.currentTime>c.end+0.4||curEl.currentTime<c.start-1.2){try{curEl.currentTime=c.start+local*(c.speed)}catch(x){}}
      }catch(x){}
      // rate
      var rate=c.speed;
      if(c.ramp)rate=c.speed*(0.55+0.9*p);
      if(c.ease==='in')rate=c.speed*(0.55+0.9*p*p);
      else if(c.ease==='out')rate=c.speed*(0.55+0.9*Math.sqrt(p));
      else if(c.ease==='inout')rate=c.speed*(0.55+0.9*(0.5-0.5*Math.cos(Math.PI*p)));
      try{curEl.playbackRate=clamp(rate,0.07,4)}catch(x){}
      // draw
      var zoom=1+ (c.zoom||1)*0.12*p*st.zoom*0.35 + 0.06*st.zoom;
      if(c.trans==='punch'){var trDur2=0.28;var local2=local;if(local2<trDur2)zoom+=(1-local2/trDur2)*0.3*st.zoom*0.5}
      ctx.save();
      var trDur=0.28;
      if(c.trans==='whip'&&local<trDur){ctx.translate((1-local/trDur)*W*0.9,0)}
      if(c.trans==='shake'&&local<0.35){ctx.translate((Math.random()-0.5)*14,(Math.random()-0.5)*14)}
      ctx.filter=(window.gradeApply?window.gradeApply(st.grade):(st.grade||'none'))+(c.gradeExtra||'');
      var pn=(c.lock&&window.trackPan&&M[c.src]&&M[c.src].track)?window.trackPan(M[c.src].track,c):{x:0,y:0};
      if(c.flipH){ctx.save();ctx.translate(W,0);ctx.scale(-1,1)}
      try{drawCover(ctx,curEl,W,H,zoom,pn.x,pn.y,(c.key&&c.key.ready)?c.key:null)}catch(x){ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,W,H)}
      if(c.flipH){ctx.restore()}
      ctx.filter='none';
      if(st.tint){ctx.fillStyle=st.tint;ctx.fillRect(0,0,W,H)}
      if(st.grain){ctx.globalAlpha=st.grain;ctx.drawImage(grain,Math.random()*-60,Math.random()*-60,W+120,H+120);ctx.globalAlpha=1}
      if(st.vig){var vg=ctx.createRadialGradient(W/2,H/2,H*0.25,W/2,H/2,H*0.78);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,'+st.vig+')');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H)}
      if(st.bars){ctx.fillStyle='#000';ctx.fillRect(0,0,W,H*st.bars);ctx.fillRect(0,H*(1-st.bars),W,H*st.bars)}
      clipFX(ctx,c,local,od,W,H);
      if(window.fxClipHook)try{fxClipHook(ctx,c,local,od,W,H)}catch(e){}
      if(c.trans==='flash'&&local<trDur){ctx.fillStyle='rgba(255,255,255,'+(0.85*(1-local/trDur))+')';ctx.fillRect(0,0,W,H)}
      if(c.trans==='fade'&&local<trDur){ctx.fillStyle='rgba(0,0,0,'+(0.85*(1-local/trDur))+')';ctx.fillRect(0,0,W,H)}
      if(c.fadeIn&&local<0.3){ctx.fillStyle='rgba(0,0,0,'+(1-local/0.3)+')';ctx.fillRect(0,0,W,H)}
      if(c.fadeOut&&od-local<0.3){ctx.fillStyle='rgba(0,0,0,'+(1-(od-local)/0.3)+')';ctx.fillRect(0,0,W,H)}
      // captions
      var cap=null;
      for(var k=0;k<S.captions.length;k++){if(t>=S.captions[k].t0&&t<S.captions[k].t1){cap=S.captions[k];break}}
      if(cap)drawCaption(ctx,cap,t,W,H,S.capStyle);
      if(window.fxFrameHook)try{fxFrameHook(ctx,t,W,H)}catch(e){}
      ctx.restore();
      if(opts.onprogress)opts.onprogress(t/total);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
}
var playing=false,STOPFLAG=false;
async function preview(){
  if(playing){log('already playing');return}
  if(!S.clips.length){log('timeline is empty — tap auto edit first');return}
  playing=true;$('playhint').style.display='none';
  log('preview…',true);
  try{await renderProject({canvas:$('cv'),onprogress:function(p){pbar(p)}})}catch(e){log('preview: '+e.message)}
  playing=false;
}
function pbar(p){$('pbar').style.width=Math.round(clamp(p,0,1)*100)+'%'}
