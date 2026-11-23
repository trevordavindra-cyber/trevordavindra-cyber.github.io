'use strict';
// up21.js — PHASE 15 STUDIO II (Nov 23 2026)
// smart reframe, audio fades, voiceover narration, frame grab, aspect guides,
// grade strength, speed ease, cyberpunk/retro-vhs/pastel styles, silence trim, mirror flip
(function(){
if(window.__tk2up21)return;window.__tk2up21=1;
function $(id){return document.getElementById(id)}
function clipDur(c){return (c.end-c.start)/(c.speed||1)}
function clampC(v,a,b){return Math.max(a,Math.min(b,v))}
function mkBtn(t,fn,fl,id){var b=document.createElement('button');b.className='btn';b.textContent=t;b.style.flex=fl||'0 0 auto';if(id)b.id=id;b.onclick=fn;return b}
function mkInp(id,ph,val){var i=document.createElement('input');i.id=id;i.placeholder=ph||'';if(val!==undefined)i.value=val;return i}
function mkSel(id,opts){var s=document.createElement('select');s.id=id;(opts||[]).forEach(function(o){var op=document.createElement('option');op.textContent=o;s.appendChild(op)});return s}
function mkRow(gap){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap=(gap||6)+'px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function mkList(id){var l=document.createElement('div');l.id=id;l.style.marginTop='6px';return l}
function cur(){return S.clips.find(function(x){return x.id===S.selected})}
function saveE(){try{save()}catch(e){}}

if(!S.eco)S.eco={};var E=S.eco;
if(!E.st15)E.st15={guides:'off'};
if(typeof S.gradeStr!=='number')S.gradeStr=100;

// --- hook chaining (never clobber an earlier pack's hook)
var _pc=window.fxClipHook,_pf=window.fxFrameHook;
window.fxClipHook=function(ctx,c,local,od,W,H){window.__tk2W=W;window.__tk2H=H;if(_pc)try{_pc(ctx,c,local,od,W,H)}catch(e){}};
window.fxFrameHook=function(ctx,t,W,H){if(_pf)try{_pf(ctx,t,W,H)}catch(e){}try{drawGuides(ctx,W,H)}catch(e){}};

// --- 1 smart reframe: motion center-of-mass analysis + pan through the engine's trackPan hook
window.trackPan=function(track,c){
  if(!c||!c.reframe||!window.__tk2W)return{x:0,y:0};
  var W=window.__tk2W,H=window.__tk2H||W*16/9;
  return{x:clampC(c.reframe.x,-1,1)*W*0.18,y:clampC(c.reframe.y,-1,1)*H*0.18};
};
async function reframeAuto(){
  var c=cur();if(!c){log('select a clip first');return}
  var m=M[c.src];if(!m||m.kind!=='video'){log('reframe: clip has no video footage');return}
  log('reframe: scanning '+m.name+' for the subject…',true);
  var el=document.createElement('video');el.src=m.url;el.muted=true;el.playsInline=true;el.preload='auto';
  await new Promise(function(res){el.onloadeddata=res;el.onerror=res;setTimeout(res,4000)});
  var cv=document.createElement('canvas');cv.width=48;cv.height=85;var cx=cv.getContext('2d',{willReadFrequently:true});
  var n=8,sx=0,sy=0,cnt=0;
  for(var i=0;i<n;i++){
    var tt=c.start+(c.end-c.start)*(i+0.5)/n;
    try{el.currentTime=Math.min(Math.max(tt,0),Math.max(0,(m.dur||tt)-0.05))}catch(e){}
    await new Promise(function(res){el.onseeked=res;setTimeout(res,600)});
    try{cx.drawImage(el,0,0,48,85)}catch(e){continue}
    var d=cx.getImageData(0,0,48,85).data;
    var wsum=0,xs=0,ys=0;
    for(var y=0;y<85;y++)for(var x=0;x<48;x++){
      var o=(y*48+x)*4;
      var lum=(d[o]*0.3+d[o+1]*0.6+d[o+2]*0.1)*(d[o+3]/255);
      var ew=Math.min(1,Math.min(x,47-x,y,84-y)/6+0.15);
      var w=lum*ew;wsum+=w;xs+=w*x;ys+=w*y;
    }
    if(wsum>0){sx+=xs/wsum/48-0.5;sy+=ys/wsum/85-0.5;cnt++}
  }
  if(!cnt){log('reframe: could not read frames');return}
  c.reframe={x:sx/cnt,y:sy/cnt};c.lock=true;
  if(!m.track)m.track={};
  saveE();renderRef();
  log('reframe set: subject at '+(sx/cnt>=0?'+':'')+(sx/cnt*100).toFixed(0)+'% x, '+(sy/cnt*100).toFixed(0)+'% y — clip pans to keep it centered',true);
}
function reframeCenter(){var c=cur();if(!c){log('select a clip first');return}delete c.reframe;saveE();renderRef();log('reframe reset to center')}
function renderRef(){var l=$('b1refList');if(!l)return;l.innerHTML='';S.clips.forEach(function(c,i){if(c.reframe){var d=document.createElement('div');d.className='item';d.textContent='clip '+(i+1)+': reframe '+(c.reframe.x>=0?'+':'')+(c.reframe.x*100).toFixed(0)+'% x '+(c.reframe.y*100).toFixed(0)+'% y';l.appendChild(d)}});if(!l.children.length)l.innerHTML='<span class="tempty">no reframes set</span>'}

// --- 2 audio fade in/out on the selected clip (engine gain envelope)
function applyFade(){
  var c=cur();if(!c){log('select a clip first');return}
  var fi=parseFloat($('b1afIn').value)||0,fo=parseFloat($('b1afOut').value)||0;
  if(fi<=0&&fo<=0){log('enter fade seconds (0 = none)');return}
  if(fi>0)c.afIn=fi;else delete c.afIn;
  if(fo>0)c.afOut=fo;else delete c.afOut;
  saveE();log('audio fade: clip fades in '+(c.afIn||0)+'s, out '+(c.afOut||0)+'s',true);
}
function clearFade(){var c=cur();if(!c){log('select a clip first');return}delete c.afIn;delete c.afOut;saveE();log('audio fade cleared')}

// --- 3 voiceover narration: picked audio plays over the music in the export mix
function fillVo(){
  var s=$('b1voSel');if(!s)return;s.innerHTML='';
  var auds=Object.keys(M).map(function(k){return M[k]}).filter(function(m){return m.kind==='audio'});
  if(!auds.length){var op0=document.createElement('option');op0.textContent='no audio files yet';s.appendChild(op0);return}
  auds.forEach(function(m){var op=document.createElement('option');op.value=m.id;op.textContent=m.name.slice(0,22);s.appendChild(op)});
  if(S.voId)try{s.value=S.voId}catch(e){}
}
function setVo(){
  var s=$('b1voSel');var id=s.value;
  if(!id||!M[id]){log('no audio file to use as voiceover — add one in the library');return}
  S.voId=id;S.voGain=(parseFloat($('b1voGain').value)||0);if(!S.voGain)S.voGain=1;
  saveE();log('voiceover set: '+M[id].name+' — plays over the music in the export at '+(S.voGain*100).toFixed(0)+'% volume',true);
}
function recVo(){
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){log('recording needs a mic — this browser blocks it');return}
  navigator.mediaDevices.getUserMedia({audio:true}).then(function(stream){
    var mr=new MediaRecorder(stream);var chunks=[];
    mr.ondataavailable=function(ev){if(ev.data&&ev.data.size)chunks.push(ev.data)};
    mr.onstop=function(){
      stream.getTracks().forEach(function(t){t.stop()});
      var blob=new Blob(chunks,{type:mr.mimeType||'audio/webm'});
      if(!blob.size){log('recording was empty');return}
      addMedia(new File([blob],'voiceover-'+Date.now()+'.webm',{type:blob.type}),'audio',blob).then(function(m){
        S.voId=m.id;S.voGain=1;fillVo();try{$('b1voSel').value=m.id}catch(e){}saveE();
        log('voiceover recorded ('+(blob.size/1024).toFixed(0)+' KB) and set as narration',true);
      });
    };
    mr.start();
    log('recording voiceover… tap STOP REC to finish',true);
    var b=$('b1voRec');b.textContent='STOP REC';b.onclick=function(){b.textContent='REC VOICEOVER';b.onclick=recVo;try{mr.stop()}catch(e){}};
  }).catch(function(){log('mic blocked — allow microphone access to record a voiceover')});
}
function clearVo(){S.voId=null;saveE();log('voiceover cleared')}

// --- 4 frame grab + 5 aspect guides (preview overlay only, never in exports)
function grabFrame(){
  var cv=$('cv');if(!cv){log('no preview canvas');return}
  try{
    var a=document.createElement('a');a.download='frame-'+Date.now()+'.png';a.href=cv.toDataURL('image/png');document.body.appendChild(a);a.click();a.remove();
    log('frame grabbed — PNG saved to downloads',true);
  }catch(e){log('frame grab failed: '+e.message)}
}
function drawGuides(ctx,W,H){
  if(ctx.canvas.id!=='cv')return;
  var g=E.st15.guides;if(!g||g==='off')return;
  ctx.save();ctx.strokeStyle='rgba(0,229,255,.85)';ctx.lineWidth=2;
  if(g==='9:16'){
    var mx=W*0.1,my=H*0.08;
    ctx.setLineDash([6,6]);ctx.strokeRect(mx,my,W-2*mx,H*0.72-my);
    ctx.beginPath();ctx.moveTo(W/2-12,H/2);ctx.lineTo(W/2+12,H/2);ctx.moveTo(W/2,H/2-12);ctx.lineTo(W/2,H/2+12);ctx.stroke();
  }else if(g==='1:1'){
    var side=Math.min(W,H),x0=(W-side)/2,y0=(H-side)/2;
    ctx.fillStyle='rgba(0,0,0,.55)';
    ctx.fillRect(0,0,W,y0);ctx.fillRect(0,y0+side,W,H-y0-side);ctx.fillRect(0,y0,x0,side);ctx.fillRect(x0+side,y0,W-x0-side,side);
    ctx.setLineDash([8,6]);ctx.strokeRect(x0,y0,side,side);
  }
  ctx.restore();
}
function setGuides(){E.st15.guides=$('b1guides').value;saveE();log('aspect guides: '+E.st15.guides+' (preview overlay only)')}

// --- 6 grade strength (applies through the engine's filter line)
window.gradeApply=function(g){
  var s=(typeof S.gradeStr==='number')?S.gradeStr:100;
  if(!g||g==='none'||s>=100)return g;
  if(s<=0)return 'none';
  return String(g).replace(/([a-z-]+)\(([^)]+)\)/g,function(m,fn,v){
    var x=parseFloat(v);if(isNaN(x))return m;
    var unit=v.indexOf('deg')>=0?'deg':'';
    var t;
    if(fn==='hue-rotate'||fn==='sepia'||fn==='grayscale'||fn==='blur')t=x*(s/100);
    else t=1+(x-1)*(s/100);
    return fn+'('+t.toFixed(3)+unit+')';
  });
};
function applyGradeStr(){
  var v=parseFloat($('b1gstr').value);if(isNaN(v)||v<0||v>100){log('enter 0 to 100');return}
  S.gradeStr=v;saveE();
  var st=STYLES[S.style];
  log('grade strength '+v+'% — '+(st?st.label:'style')+' grade now reads: '+(window.gradeApply(st&&st.grade)||'none'),true);
}

// --- 7 speed ease on the selected clip
function applyEase(){
  var c=cur();if(!c){log('select a clip first');return}
  var v=$('b1ease').value;
  if(v==='none')delete c.ease;else c.ease=v;
  saveE();log('speed ease: '+(c.ease||'none')+' on the selected clip',true);
}

// --- 8 three new style presets (registered into the real style engine)
if(!STYLES.cyberpunk)STYLES.cyberpunk={label:'CYBERPUNK',grade:'contrast(1.28) saturate(1.5) hue-rotate(-12deg) brightness(1.02)',vig:.35,grain:.06,pace:1.9,trans:['flash','punch','shake'],clip:[0.5,1.2],zoom:1.35,cap:'karaoke',bars:0,tint:'rgba(0,180,255,.10)'};
if(!STYLES.retrovhs)STYLES.retrovhs={label:'RETRO VHS',grade:'sepia(.25) saturate(.85) contrast(1.08) brightness(1.04)',vig:.25,grain:.18,pace:1.2,trans:['cut','whip','flash'],clip:[0.9,1.8],zoom:1.12,cap:'bold',bars:.08,tint:'rgba(255,120,60,.07)'};
if(!STYLES.pastel)STYLES.pastel={label:'PASTEL DREAM',grade:'saturate(.8) brightness(1.1) contrast(.96)',vig:.15,grain:.02,pace:1.0,trans:['fade','cut'],clip:[1.2,2.4],zoom:1.08,cap:'bar',bars:0,tint:'rgba(255,190,220,.08)'};
['cyberpunk','retrovhs','pastel'].forEach(function(k){if(STYLIST.indexOf(k)<0)STYLIST.push(k)});
try{if(window.syncStyleChips)syncStyleChips()}catch(e){}

// --- 9 silence trim on the selected clip
async function silenceTrim(){
  var c=cur();if(!c){log('select a clip first');return}
  var m=M[c.src];if(!m){log('clip has no media');return}
  log('silence trim: reading audio of '+m.name+'…',true);
  var buf;
  try{
    var actx=new (window.AudioContext||window.webkitAudioContext)();
    buf=m.buf||await actx.decodeAudioData(await m.blob.arrayBuffer());
    m.buf=buf;try{actx.close()}catch(e){}
  }catch(e){log('silence trim: this clip has no readable audio track');return}
  var sr=buf.sampleRate,ch=buf.getChannelData(0),win=Math.round(sr*0.05);
  function rms(at){
    var s=0,n=0;at=Math.max(0,Math.min(at,buf.duration-0.05));
    var a=Math.round(at*sr);
    for(var i=a;i<Math.min(a+win,ch.length);i+=4){var v=ch[i];s+=v*v;n++}
    return n?Math.sqrt(s/n):1;
  }
  var TH=0.015,step=0.05,s=c.start,e=c.end;
  var t=s;while(t<e-0.4&&rms(t)<TH)t+=step;
  var ns=Math.min(t,e-0.4);
  t=e;while(t>ns+0.4&&rms(t-0.05)<TH)t-=step;
  var ne=Math.max(t,ns+0.4);
  if(Math.abs(ns-s)<0.05&&Math.abs(ne-e)<0.05){log('silence trim: no dead air at the edges of this clip');return}
  c.start=ns;c.end=ne;saveE();
  log('silence trim: clip tightened by '+((s-ns)+(e-ne)).toFixed(1)+'s (now '+ns.toFixed(1)+'-'+ne.toFixed(1)+'s of source)',true);
}

// --- 10 mirror flip on the selected clip
function flipH(){
  var c=cur();if(!c){log('select a clip first');return}
  if(c.flipH)delete c.flipH;else c.flipH=true;
  saveE();log('mirror flip '+(c.flipH?'ON — frame mirrored':'OFF')+' on the selected clip',true);
}

function mount(){
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='Studio II (Phase 15)';card.appendChild(h);
  var r1=mkRow();r1.appendChild(mkBtn('REFRAME AUTO',reframeAuto,'1 1 0'));r1.appendChild(mkBtn('REFRAME CENTER',reframeCenter));card.appendChild(r1);
  card.appendChild(mkList('b1refList'));
  var r2=mkRow();r2.appendChild(mkInp('b1afIn','fade-in secs'));r2.appendChild(mkInp('b1afOut','fade-out secs'));r2.appendChild(mkBtn('APPLY FADE',applyFade));r2.appendChild(mkBtn('CLEAR FADE',clearFade));card.appendChild(r2);
  var r3=mkRow();r3.appendChild(mkSel('b1voSel',[]));var g=mkInp('b1voGain','1');g.type='number';g.min=0;g.max=2;g.step=0.1;r3.appendChild(g);r3.appendChild(mkBtn('SET VO',setVo));r3.appendChild(mkBtn('REC VOICEOVER',recVo,'0 0 auto','b1voRec'));r3.appendChild(mkBtn('CLEAR VO',clearVo));card.appendChild(r3);
  var r4=mkRow();r4.appendChild(mkBtn('GRAB FRAME PNG',grabFrame));r4.appendChild(mkSel('b1guides',['off','9:16','1:1']));r4.appendChild(mkBtn('SET GUIDES',setGuides));card.appendChild(r4);
  var r5=mkRow();var gs=mkInp('b1gstr','grade strength 0-100');gs.type='number';gs.min=0;gs.max=100;r5.appendChild(gs);r5.appendChild(mkBtn('APPLY GRADE STRENGTH',applyGradeStr));card.appendChild(r5);
  var r6=mkRow();r6.appendChild(mkSel('b1ease',['none','in','out','inout']));r6.appendChild(mkBtn('APPLY EASE',applyEase));r6.appendChild(mkBtn('SILENCE TRIM',silenceTrim));r6.appendChild(mkBtn('FLIP H',flipH));card.appendChild(r6);
  var note=document.createElement('div');note.className='note';note.textContent='smart reframe pans to your subject, audio fades + a voiceover mix into the export, grade strength scales any style, ease changes how speed ramps feel, silence trim cuts dead air, guides are preview-only.';
  card.appendChild(note);
  var hs=document.querySelectorAll('.card h2');var anchor=null;
  for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('AI Director II')>=0){anchor=hs[i].parentElement;break}}
  if(!anchor){for(var j=0;j<hs.length;j++){if(hs[j].textContent.indexOf('Reliability II')>=0){anchor=hs[j].parentElement;break}}}
  if(anchor){if(anchor.nextSibling)anchor.parentElement.insertBefore(card,anchor.nextSibling);else anchor.parentElement.appendChild(card)}
  fillVo();renderRef();$('b1gstr').value=S.gradeStr;$('b1guides').value=E.st15.guides||'off';
  log('studio ii live — reframe, voiceover, grade strength ready');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();