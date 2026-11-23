'use strict';
// up22.js — PHASE 16 FINISHING LAB (Nov 23 2026)
// color lab (brightness/contrast/saturation/warmth/soft focus), monotone look,
// per-clip tint, vignette extra, grain extra, caption position, fps picker,
// export quality, watermark corner + opacity, cover sheet 4-up
(function(){
if(window.__tk2up22)return;window.__tk2up22=1;
function $(id){return document.getElementById(id)}
function clipDur(c){return (c.end-c.start)/(c.speed||1)}
function clampC(v,a,b){return Math.max(a,Math.min(b,v))}
function mkBtn(t,fn,fl,id){var b=document.createElement('button');b.className='btn';b.textContent=t;b.style.flex=fl||'0 0 auto';if(id)b.id=id;b.onclick=fn;return b}
function mkInp(id,ph,val){var i=document.createElement('input');i.id=id;i.placeholder=ph||'';if(val!==undefined)i.value=val;return i}
function mkSel(id,opts){var s=document.createElement('select');s.id=id;(opts||[]).forEach(function(o){var op=document.createElement('option');op.textContent=o;s.appendChild(op)});return s}
function mkRow(gap){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap=(gap||6)+'px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function cur(){return S.clips.find(function(x){return x.id===S.selected})}
function saveE(){try{save()}catch(e){}}

if(!S.eco)S.eco={};var E=S.eco;
if(!E.f22)E.f22={col:null,mono:null,vig:0,grain:0};
if(typeof S.capPos!=='string')S.capPos='bottom';

// --- hook chaining (never clobber an earlier pack's hook)
var _pc=window.fxClipHook,_pf=window.fxFrameHook;

// caption position wrapper: drawCaption is global; redraw with a positioned baseline when S.capPos is set
var _dc=window.drawCaption;
window.drawCaption=function(ctx,cap,t,W,H,mode){
  if(!cap||!S.capPos||S.capPos==='bottom')return _dc?_dc(ctx,cap,t,W,H,mode):undefined;
  if(!_dc)return;
  var fs,box=false;
  if(mode==='bar'){fs=44;box=true}else{fs=58}
  ctx.font='900 '+fs+'px Arial, sans-serif';
  while(ctx.measureText(cap.text).width>W-70&&fs>26){fs-=3;ctx.font='900 '+fs+'px Arial, sans-serif'}
  var y=S.capPos==='top'?H*0.12+fs*0.9:H*0.5;
  if(box){ctx.fillStyle='rgba(0,0,0,.55)';var w2=ctx.measureText(cap.text).width+30;ctx.fillRect(W/2-w2/2,y-fs*0.75,w2,fs*1.5)}
  var sc=1;var dt=t-cap.t0;
  if(mode==='karaoke'&&dt<0.14)sc=1.35-2.5*dt;
  ctx.save();ctx.translate(W/2,y);ctx.scale(sc,sc);ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
  ctx.lineWidth=fs*0.18;ctx.strokeStyle='#000';ctx.strokeText(cap.text,0,0);
  ctx.fillStyle='#fff';ctx.fillText(cap.text,0,0);ctx.restore();
};
// export bitrate shim: the engine sends its fixed defaults; swap in the chosen quality
(function(){
  if(!window.MediaRecorder)return;
  var _MR=window.MediaRecorder;
  function MR2(stream,opts){opts=opts||{};try{if(window.__tk2q&&typeof opts.videoBitsPerSecond==='number'&&(opts.videoBitsPerSecond===8000000||opts.videoBitsPerSecond===5000000))opts.videoBitsPerSecond=window.__tk2q}catch(e){}
    return new _MR(stream,opts)}
  MR2.prototype=_MR.prototype;MR2.isTypeSupported=function(t){return _MR.isTypeSupported(t)};
  window.MediaRecorder=MR2;
})();

// --- 1+2 color lab + monotone: compose extra filters on top of the style grade
var _pg=window.gradeApply;
window.gradeApply=function(g){
  var base=_pg?_pg(g):(g||'none');
  var x='',col=E.f22.col;
  if(col){
    if(col.bri)x+=' brightness('+((100+col.bri)/100).toFixed(2)+')';
    if(col.con)x+=' contrast('+((100+col.con)/100).toFixed(2)+')';
    if(col.sat)x+=' saturate('+((100+col.sat)/100).toFixed(2)+')';
    if(col.warm)x+=' sepia('+(col.warm/100).toFixed(2)+')';
    if(col.blur)x+=' blur('+(col.blur/10).toFixed(1)+'px)';
  }
  var mn=E.f22.mono;
  if(mn)x+=' grayscale(1) sepia('+(mn.str/100).toFixed(2)+') hue-rotate('+Math.round(mn.hue)+'deg) saturate('+(1+mn.str/50).toFixed(2)+')';
  return x?base+x:base;
};
function applyColor(){
  var r=function(id){var v=parseFloat($(id).value);return isNaN(v)?0:clampC(v,-100,150)};
  var col={bri:r('f22bri'),con:r('f22con'),sat:r('f22sat'),warm:clampC(r('f22warm'),0,100),blur:clampC(r('f22blur'),0,100)};
  E.f22.col=col.bri||col.con||col.sat||col.warm||col.blur?col:null;
  saveE();logLook('color lab applied');
}
function applyMono(){
  var h=parseFloat($('f22hue').value),s=parseFloat($('f22str').value);
  if(isNaN(h))h=180;if(isNaN(s))s=60;
  E.f22.mono={hue:clampC(h,0,360),str:clampC(s,0,100)};saveE();logLook('monotone on');
}
function clearLook(){E.f22.col=null;E.f22.mono=null;saveE();logLook('color look cleared — style grade only')}
function logLook(tag){
  var st=window.STYLES&&STYLES[S.style];
  log(tag+' — export + preview filter now reads: '+(window.gradeApply(st&&st.grade)||'none'),true);
}

// --- 3 per-clip tint + 4 vignette extra + 5 grain extra via frame hooks
window.fxClipHook=function(ctx,c,local,od,W,H){
  if(_pc)try{_pc(ctx,c,local,od,W,H)}catch(e){}
  try{if(c&&c.tint){ctx.save();ctx.fillStyle=c.tint;ctx.globalAlpha=0.22;ctx.fillRect(0,0,W,H);ctx.restore()}}catch(e){}
};
var grainCv=null;
function frameExtras(ctx,W,H){
  if(E.f22.vig>0){
    var g=ctx.createRadialGradient(W/2,H/2,H*0.3,W/2,H/2,H*0.8);
    g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,'+(E.f22.vig/100).toFixed(2)+')');
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  }
  if(E.f22.grain>0){
    if(!grainCv){grainCv=document.createElement('canvas');grainCv.width=160;grainCv.height=160;
      var gc=grainCv.getContext('2d'),img=gc.createImageData(160,160);
      for(var i=0;i<img.data.length;i+=4){var v=Math.random()*255;img.data[i]=img.data[i+1]=img.data[i+2]=v;img.data[i+3]=255}
      gc.putImageData(img,0,0)}
    ctx.save();ctx.globalAlpha=(E.f22.grain/100)*0.35;
    ctx.drawImage(grainCv,Math.random()*-40,Math.random()*-40,W+80,H+80);ctx.restore();
  }
}
window.fxFrameHook=function(ctx,t,W,H){if(_pf)try{_pf(ctx,t,W,H)}catch(e){}try{frameExtras(ctx,W,H)}catch(e){}};
function applyOverlays(){
  var v=parseFloat($('f22vig').value),gr=parseFloat($('f22grain').value);
  E.f22.vig=isNaN(v)?0:clampC(v,0,70);E.f22.grain=isNaN(gr)?0:clampC(gr,0,60);
  saveE();log('overlays applied — vignette '+E.f22.vig+'%, extra grain '+E.f22.grain+'% (live in preview + export)',true);
}
function applyTint(){
  var c=cur();if(!c){log('select a clip first');return}
  var v=$('f22tint').value;c.tint=v;saveE();
  log('tint set on clip '+(S.clips.indexOf(c)+1)+': '+v+' (clear with CLEAR TINT)',true);
}
function clearTint(){
  var n=0;S.clips.forEach(function(c){if(c.tint){delete c.tint;n++}});
  saveE();log(n?('tint cleared from '+n+' clip(s)'):'no tinted clips',true);
}

// --- 6 caption position + 7 fps + 8 export quality + 9 watermark look
function applyCapPos(){S.capPos=$('f22cap').value;saveE();log('caption position: '+S.capPos,true)}
function applyFps(){S.fps=parseInt($('f22fps').value,10);saveE();log('export frame rate: '+S.fps+' fps',true)}
function applyQ(){var m=parseInt($('f22q').value,10);window.__tk2q=m*1000000;E.f22.q=m;saveE();log('export bitrate: '+m+' Mbps ('+window.__tk2q+')',true)}
function applyWm(){
  if(!E.brand)E.brand={};
  E.brand.pos=$('f22wmpos').value;
  var o=parseFloat($('f22wmop').value);if(!isNaN(o))E.brand.op=clampC(o,10,100)/100;
  saveE();log('watermark corner: '+E.brand.pos+', opacity '+Math.round((E.brand.op||0.85)*100)+'% (shows once the brand watermark is on)',true);
}

// --- 10 cover sheet 4-up: 2x2 PNG of frames at 12/38/62/88% of the timeline
async function coverSheet(){
  if(!S.clips.length){log('nothing on the timeline');return}
  var total=0;S.clips.forEach(function(c){total+=clipDur(c)});
  var cv=document.createElement('canvas');cv.width=1440;cv.height=2560;var ctx=cv.getContext('2d');
  var els={};
  var pts=[0.12,0.38,0.62,0.88];
  for(var i=0;i<4;i++){
    var tt=total*pts[i],acc=0,cl=null,local=0;
    for(var j=0;j<S.clips.length;j++){var d=clipDur(S.clips[j]);if(tt<=acc+d){cl=S.clips[j];local=tt-acc;break}acc+=d}
    if(!cl){cl=S.clips[S.clips.length-1];local=0}
    var m=M[cl.src];if(!m)continue;
    if(!els[m.id]){var v=document.createElement('video');v.src=m.url;v.muted=true;v.playsInline=true;v.preload='auto';v.crossOrigin='anonymous';els[m.id]=v;
      await new Promise(function(res){v.onloadeddata=function(){res()};v.onerror=function(){res()};setTimeout(res,3000)})}
    var v=els[m.id];
    try{v.currentTime=Math.max(0,Math.min((m.dur||999)-0.05,cl.start+local*(cl.speed||1)))}catch(e){}
    await new Promise(function(res){var d=false;v.onseeked=function(){if(!d){d=true;res()}};setTimeout(res,2500)});
    var x=(i%2)*720,y=Math.floor(i/2)*1280;
    ctx.save();ctx.beginPath();ctx.rect(x,y,720,1280);ctx.clip();
    try{drawCover(ctx,v,720,1280,1+(cl.zoom||1)*0.1,{x:0,y:0},null)}catch(e){ctx.fillStyle='#111';ctx.fillRect(x,y,720,1280)}
    ctx.restore();
    ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(x,y+1280-70,720,70);
    ctx.fillStyle='#fff';ctx.font='600 34px sans-serif';ctx.textAlign='left';
    ctx.fillText('opt '+(i+1)+' at '+tt.toFixed(1)+'s',x+20,y+1280-22);
  }
  try{var a=document.createElement('a');a.download='cover-sheet-'+Date.now()+'.png';a.href=cv.toDataURL('image/png');document.body.appendChild(a);a.click();a.remove();
    log('cover sheet saved — 4 frames at 12/38/62/88% of the timeline, pick the strongest opener',true);
  }catch(e){log('cover sheet failed: '+e.message)}
}

function mount(){
  if($('f22bri'))return;
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='Finishing Lab (Phase 16)';card.appendChild(h);
  var r1=mkRow();['f22bri','brightness -100..100','f22con','contrast -100..100','f22sat','saturation -100..100','f22warm','warmth 0..100','f22blur','soft focus 0..100'].forEach(function(id,idx){if(idx%2===0)r1.appendChild(mkInp(id,null));else{var i=r1.lastChild;i.placeholder=id}});
  r1.appendChild(mkBtn('APPLY COLOR',applyColor));r1.appendChild(mkBtn('CLEAR LOOK',clearLook));card.appendChild(r1);
  var r2=mkRow();var hu=mkInp('f22hue','mono hue 0-360');hu.type='number';var st=mkInp('f22str','strength 0-100');st.type='number';
  r2.appendChild(hu);r2.appendChild(st);r2.appendChild(mkBtn('MONOTONE ON',applyMono));card.appendChild(r2);
  var r3=mkRow();var tp=mkInp('f22tint');tp.type='color';tp.value='#7a00ff';r3.appendChild(tp);
  r3.appendChild(mkBtn('TINT CLIP',applyTint));r3.appendChild(mkBtn('CLEAR TINT',clearTint));card.appendChild(r3);
  var r4=mkRow();var vg=mkInp('f22vig','vignette 0-70');vg.type='number';var gr=mkInp('f22grain','grain 0-60');gr.type='number';
  r4.appendChild(vg);r4.appendChild(gr);r4.appendChild(mkBtn('APPLY OVERLAYS',applyOverlays));card.appendChild(r4);
  var r5=mkRow();r5.appendChild(mkSel('f22cap',['bottom','middle','top']));r5.appendChild(mkBtn('APPLY CAP POS',applyCapPos));
  r5.appendChild(mkSel('f22fps',['24','30','60']));r5.appendChild(mkBtn('SET FPS',applyFps));
  r5.appendChild(mkSel('f22q',['5','8','12','16']));r5.appendChild(mkBtn('SET EXPORT QUALITY',applyQ));card.appendChild(r5);
  var r6=mkRow();r6.appendChild(mkSel('f22wmpos',['br','bl','tr','tl']));var wo=mkInp('f22wmop','wm opacity 10-100');wo.type='number';
  r6.appendChild(wo);r6.appendChild(mkBtn('APPLY WM LOOK',applyWm));r6.appendChild(mkBtn('COVER SHEET 4-UP',coverSheet,'1 1 auto'));card.appendChild(r6);
  var note=document.createElement('div');note.className='note';note.textContent='color lab + monotone restyle every clip (preview + export), tint is per-clip, vignette/grain layer on top, caption position + fps + export bitrate + watermark corner all save with the project, cover sheet exports 4 candidate openers as one PNG.';
  card.appendChild(note);
  var hs=document.querySelectorAll('.card h2');var anchor=null;
  for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('Studio II')>=0){anchor=hs[i].parentElement;break}}
  if(!anchor){for(var j=0;j<hs.length;j++){if(hs[j].textContent.indexOf('AI Director II')>=0){anchor=hs[j].parentElement;break}}}
  if(anchor){if(anchor.nextSibling)anchor.parentElement.insertBefore(card,anchor.nextSibling);else anchor.parentElement.appendChild(card)}
  $('f22cap').value=S.capPos;$('f22fps').value=String(S.fps||30);if(E.f22.q)$('f22q').value=String(E.f22.q);
  if(window.__tk2q===undefined&&E.f22.q)window.__tk2q=E.f22.q*1000000;
  log('finishing lab live — color lab, monotone, tint, overlays ready');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
