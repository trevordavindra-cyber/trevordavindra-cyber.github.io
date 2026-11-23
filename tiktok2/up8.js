'use strict';
// PHASE 2 quality pack: 2D camera moves, timeline polish, 6 caption styles,
// 5 more FX, autopilot tuning (QC sweep, mix cuts, pacing). Extends existing hooks only.
(function(){
function tmpCv(w,h){var c=document.createElement('canvas');c.width=w;c.height=h;return c}

// ---------- track the current clip so the camera wrapper knows what is on screen ----------
var camCur=null;
var prevFrameHook=window.fxFrameHook;
window.fxFrameHook=function(ctx,t,W,H){
  try{
    var acc=0;camCur=null;
    for(var i=0;i<S.clips.length;i++){var c=S.clips[i];var d=clipOutDur(c);
      if(t>=acc&&t<acc+d){camCur={c:c,p:clamp((t-acc)/Math.max(.05,d),0,1),t:t};break}acc+=d}
  }catch(e){}
  if(prevFrameHook)try{prevFrameHook(ctx,t,W,H)}catch(e){}
};

// ---------- 2D camera moves (wrap drawCover) ----------
var origCover=window.drawCover;
window.drawCover=function(ctx,im,W,H,zoom,px,py,key){
  var z=zoom,x=px,y=py;
  if(camCur&&camCur.c&&camCur.c.cam&&camCur.c.cam!=='none'){
    var p=camCur.p,tt=camCur.t;
    switch(camCur.c.cam){
      case 'kenin': z*=1+0.10*p; x+=(p-0.5)*W*0.02; break;
      case 'kenout': z*=1.10-0.10*p; break;
      case 'orbit': z*=1.07; x+=Math.sin(p*Math.PI*2)*W*0.035; break;
      case 'push': z*=1+0.22*p*p; break;
      case 'crash': var q=clamp(p/0.22,0,1); z*=1.42-0.35*(1-Math.pow(1-q,3)); break;
      case 'handheld': z*=1.05; x+=Math.sin(tt*6.3)*W*0.004+Math.sin(tt*9.1)*W*0.002; y+=Math.cos(tt*5.7)*H*0.004; break;
      case 'dolly': z*=1.08; y+=(p-0.5)*H*0.06; break;
    }
  }
  return origCover(ctx,im,W,H,z,x,y,key);
};
var CAMNAMES={none:'NONE',kenin:'KEN BURNS IN',kenout:'KEN BURNS OUT',orbit:'ORBIT',push:'PUSH IN',crash:'CRASH ZOOM',handheld:'HANDHELD',dolly:'DOLLY'};
function camPass(){
  if(!S.clips.length){log('no clips to move the camera on');return}
  var pool=['kenin','orbit','push','kenout','dolly','handheld','crash'];
  var last=null,last2=null,n=0;
  S.clips.forEach(function(c){
    var pick=pool[Math.floor(Math.random()*pool.length)];
    if(pick===last&&pick===last2)pick=pool[(pool.indexOf(pick)+1)%pool.length];
    if(pick!=='none')n++;
    c.cam=pick;last2=last;last=pick;
  });
  drawTimeline();save();log('camera pass: '+n+' clips got varied moves (no 3 same in a row)',true);
}
function camApply(){
  var sel=$('tk8cam');var v=sel?sel.value:'none';
  var c=cur();
  if(c){c.cam=v;drawTimeline();save();log('camera → '+CAMNAMES[v]+' on selected clip')}
  else if(S.clips.length){S.clips.forEach(function(x){x.cam=v});drawTimeline();save();log('no clip selected — camera → '+CAMNAMES[v]+' on all clips',v!=='none')}
  else log('no clips yet — auto edit or add clips first');
}

// ---------- timeline polish ----------
function splitAt(){
  var c=cur();if(!c){log('select a clip in the timeline first');return}
  var at=parseFloat($('tk8split')?$('tk8split').value:'');
  if(isNaN(at)||at<=c.start+0.05||at>=c.end-0.05){log('split point must be inside the clip: '+c.start.toFixed(2)+'–'+c.end.toFixed(2)+'s (source time)');return}
  var b=Object.assign({},c,{id:uid()});b.start=at;c.end=at;
  S.clips.splice(S.clips.indexOf(c)+1,0,b);
  drawTimeline();save();log('clip split at '+at.toFixed(2)+'s source time',true);
}
function dupSel(){
  var c=cur();if(!c){log('select a clip in the timeline first');return}
  S.clips.splice(S.clips.indexOf(c)+1,0,Object.assign({},c,{id:uid()}));
  drawTimeline();save();log('clip duplicated');
}
function mergePrev(){
  var c=cur();if(!c){log('select a clip in the timeline first');return}
  var i=S.clips.indexOf(c);if(i<1){log('nothing before this clip to merge into');return}
  var p=S.clips[i-1];
  if(p.src!==c.src){log('merge needs the same source video on both clips');return}
  p.end=c.end;p.trans=c.trans||p.trans;S.clips.splice(i,1);S.selected=p.id;
  drawTimeline();save();log('merged with previous clip',true);
}

// ---------- 6 new caption styles (wrap drawCaption) ----------
var NEWCAPS=['neon','typewriter','box','outline','gradient','pop'];
var origCap=window.drawCaption;
window.drawCaption=function(ctx,cap,t,W,H,mode){
  if(NEWCAPS.indexOf(mode)<0||!cap){if(origCap)try{origCap(ctx,cap,t,W,H,mode)}catch(e){}return}
  var fs=mode==='box'?46:58;
  ctx.font='900 '+fs+'px Arial, sans-serif';
  while(ctx.measureText(cap.text).width>W-70&&fs>26){fs-=3;ctx.font='900 '+fs+'px Arial, sans-serif'}
  var y=H-250,dt=t-cap.t0,txt=cap.text,sc=1;
  if(mode==='pop'&&dt<0.35)sc=1+0.45*Math.sin((dt/0.35)*Math.PI);
  if(mode==='typewriter'){var n=clamp(Math.floor(dt/0.55*txt.length+1),0,txt.length);txt=txt.slice(0,n);if(!txt)return}
  ctx.save();ctx.translate(W/2,y);ctx.scale(sc,sc);
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
  if(mode==='neon'){
    ctx.shadowColor='#00eaff';ctx.shadowBlur=22;
    ctx.lineWidth=fs*0.16;ctx.strokeStyle='#001318';ctx.strokeText(txt,0,0);
    ctx.fillStyle='#e9feff';ctx.fillText(txt,0,0);
    ctx.shadowBlur=10;ctx.fillText(txt,0,0);
  }else if(mode==='typewriter'){
    ctx.lineWidth=fs*0.18;ctx.strokeStyle='#000';ctx.strokeText(txt,0,0);
    ctx.fillStyle='#fff';ctx.fillText(txt,0,0);
  }else if(mode==='box'){
    var w2=ctx.measureText(txt).width+36,hh2=fs*1.45;
    ctx.fillStyle='rgba(10,14,26,.72)';ctx.fillRect(-w2/2,-hh2/2,w2,hh2);
    ctx.fillStyle='#fff';ctx.fillText(txt,0,0);
  }else if(mode==='outline'){
    ctx.lineWidth=fs*0.22;ctx.strokeStyle='#fff';ctx.strokeText(txt,0,0);
    ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillText(txt,0,0);
  }else if(mode==='gradient'){
    var g=ctx.createLinearGradient(0,-fs*0.6,0,fs*0.6);g.addColorStop(0,'#ffffff');g.addColorStop(1,'#00eaff');
    ctx.lineWidth=fs*0.18;ctx.strokeStyle='#000';ctx.strokeText(txt,0,0);
    ctx.fillStyle=g;ctx.fillText(txt,0,0);
  }else{ // pop
    ctx.lineWidth=fs*0.18;ctx.strokeStyle='#000';ctx.strokeText(txt,0,0);
    ctx.fillStyle='#fff';ctx.fillText(txt,0,0);
  }
  ctx.restore();
};
function capStyles(){
  var sel=$('capStyle');if(!sel)return false;
  NEWCAPS.forEach(function(m){
    if(!sel.querySelector('option[value="'+m+'"]')){var o=document.createElement('option');o.value=m;o.textContent=m.toUpperCase();sel.appendChild(o)}
  });
  sel.value=S.capStyle||'bold';
  return true;
}

// ---------- 5 more FX (chain after the phase-1 hook) ----------
var prevClip=window.fxClipHook;
window.fxClipHook=function(ctx,c,local,od,W,H){
  if(prevClip)try{prevClip(ctx,c,local,od,W,H)}catch(e){}
  var fx=c.fx||[];if(!fx.length)return;
  var p=clamp(local/od,0,1);
  for(var q=0;q<fx.length;q++){var f=fx[q];
    if(f==='rgbsplit'){
      try{ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=.45;
        ctx.filter='sepia(1) saturate(4) hue-rotate(-45deg)';ctx.drawImage(ctx.canvas,-(5+p*4),0);
        ctx.filter='sepia(1) saturate(4) hue-rotate(140deg)';ctx.drawImage(ctx.canvas,5+p*4,2);
        ctx.restore()}catch(e){}
    }else if(f==='vhs'){
      try{for(var s=0;s<6;s++){var sy=Math.random()*H,sH=6+Math.random()*22;
        ctx.drawImage(ctx.canvas,0,sy,W,sH,(Math.random()-0.5)*10,sy,W,sH)}
        ctx.fillStyle='rgba(255,0,120,.05)';ctx.fillRect(0,0,W,H)}catch(e){}
    }else if(f==='glitchbars'){
      try{ctx.save();ctx.globalCompositeOperation='difference';
        var cols=['#0ff','#f0f','#ff0','#fff'];
        for(var b=0;b<4;b++){ctx.fillStyle=cols[b%4];ctx.globalAlpha=.12+Math.random()*.12;
          ctx.fillRect(0,Math.random()*H,W,2+Math.random()*10)}
        ctx.restore()}catch(e){}
    }else if(f==='mirror'){
      try{ctx.save();ctx.translate(W,0);ctx.scale(-1,1);ctx.globalAlpha=.9;
        ctx.drawImage(ctx.canvas,0,0,W/2,H,0,0,W/2,H);ctx.restore()}catch(e){}
    }else if(f==='scanlines'){
      ctx.fillStyle='rgba(0,0,0,.16)';
      for(var yy=0;yy<H;yy+=4)ctx.fillRect(0,yy,W,2);
      var band=(p*H*3)%H;
      ctx.fillStyle='rgba(255,255,255,.05)';ctx.fillRect(0,band,W,26);
    }
  }
};
var NEWFX8=[['rgbsplit','RGB SPLIT'],['vhs','VHS'],['glitchbars','GLITCH BARS'],['mirror','MIRROR'],['scanlines','SCANLINES']];
function addFx8(){
  var chips=$('fxChips');if(!chips)return false;
  NEWFX8.forEach(function(f){
    if(chips.querySelector('[data-fx="'+f[0]+'"]'))return;
    var d=document.createElement('div');d.className='chip';d.textContent=f[1];d.dataset.fx=f[0];
    d.onclick=function(){var c=cur();if(!c)return;c.fx=c.fx||[];
      var i2=c.fx.indexOf(f[0]);if(i2>-1)c.fx.splice(i2,1);else c.fx.push(f[0]);
      d.classList.toggle('on');save();drawTimeline()};
    chips.appendChild(d);
  });
  return true;
}

// ---------- autopilot tuning ----------
function qcSweep(){
  if(typeof runQC!=='function'){log('quality control agent not loaded yet');return}
  var q=runQC('manual sweep');drawTimeline();save();
  var msg='QC score '+Math.round((q&&q.score)||0)+'%'+(q&&q.dur!=null?' · '+q.dur.toFixed(1)+'s':'')+(q&&q.beatsPct!=null?' · '+q.beatsPct+'% on beat':'');
  if(q&&q.issues&&q.issues.length){msg+=' — fixed '+q.fixed+': '+q.issues.slice(0,3).join('; ')}
  else msg+=' — no issues found';
  var out=$('ap8Out');if(out)out.textContent=msg;
  log(msg,!!(q&&q.issues&&q.issues.length));
}
function mixCuts(){
  if(!S.clips.length){log('no clips to mix');return}
  var pool=(STYLES[S.style]&&STYLES[S.style].trans)||['cut','flash','punch','fade'];
  var fixed=0;
  for(var i=2;i<S.clips.length;i++){
    if(S.clips[i].trans===S.clips[i-1].trans&&S.clips[i].trans===S.clips[i-2].trans){
      var alt=pool.filter(function(tn){return tn!==S.clips[i].trans});
      if(alt.length){S.clips[i].trans=alt[Math.floor(Math.random()*alt.length)];fixed++}
    }
  }
  drawTimeline();save();
  log(fixed?('broke up '+fixed+' repeated-transition runs'):('cut rhythm already varied — no runs of 3'),fixed>0);
}
function pacing(m,label){
  try{S.variations=[buildPlan(m,label)];applyPlan(S.variations[0]);drawTimeline();save();log('pacing → '+label+' (x'+m+')',true)}
  catch(e){log('pacing failed: '+e.message)}
}

// ---------- card UI ----------
function qualityCard(){
  if($('tk8cam'))return;
  var eng=$('urUndo');
  var first=eng?eng.closest('.card'):null;
  var host=first&&first.parentElement?first.parentElement:null;
  if(!host){var any=document.querySelector('.card');host=any?any.parentElement:null}
  if(!host)return;
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='Quality + autopilot';card.appendChild(h);
  var kv1=document.createElement('div');kv1.className='kv';kv1.innerHTML='<span>2D camera moves</span>';card.appendChild(kv1);
  var r1=document.createElement('div');r1.className='row';
  var sel=document.createElement('select');sel.id='tk8cam';
  Object.keys(CAMNAMES).forEach(function(k){var o=document.createElement('option');o.value=k;o.textContent=CAMNAMES[k];sel.appendChild(o)});
  var b1=document.createElement('button');b1.className='ghost small';b1.textContent='APPLY';b1.onclick=camApply;
  var b2=document.createElement('button');b2.className='ghost small';b2.textContent='CAMERA PASS';b2.onclick=camPass;
  r1.appendChild(sel);r1.appendChild(b1);r1.appendChild(b2);card.appendChild(r1);
  var n1=document.createElement('div');n1.className='note';n1.textContent='apply to the selected clip (or all if none selected). camera pass gives every clip a varied move: ken burns, orbit, push, crash, handheld, dolly.';card.appendChild(n1);
  var kv2=document.createElement('div');kv2.className='kv';kv2.innerHTML='<span>Timeline polish</span>';card.appendChild(kv2);
  var r2=document.createElement('div');r2.className='row';
  var sp=document.createElement('input');sp.id='tk8split';sp.placeholder='split at source sec (e.g. 3.5)';
  var b3=document.createElement('button');b3.className='ghost small';b3.textContent='SPLIT AT';b3.onclick=splitAt;
  var b4=document.createElement('button');b4.className='ghost small';b4.textContent='DUPLICATE SEL';b4.onclick=dupSel;
  var b5=document.createElement('button');b5.className='ghost small';b5.textContent='MERGE PREV';b5.onclick=mergePrev;
  r2.appendChild(sp);r2.appendChild(b3);r2.appendChild(b4);r2.appendChild(b5);card.appendChild(r2);
  var kv3=document.createElement('div');kv3.className='kv';kv3.innerHTML='<span>Autopilot</span>';card.appendChild(kv3);
  var r3=document.createElement('div');r3.className='btnrow';
  var b6=document.createElement('button');b6.className='ghost small';b6.textContent='QC SWEEP';b6.onclick=qcSweep;
  var b7=document.createElement('button');b7.className='ghost small';b7.textContent='MIX CUTS';b7.onclick=mixCuts;
  r3.appendChild(b6);r3.appendChild(b7);card.appendChild(r3);
  var r4=document.createElement('div');r4.className='btnrow';
  var b8=document.createElement('button');b8.className='ghost small';b8.textContent='PACING SLOW';b8.onclick=function(){pacing(0.75,'SLOW')};
  var b9=document.createElement('button');b9.className='ghost small';b9.textContent='NORMAL';b9.onclick=function(){pacing(1,'NORMAL')};
  var b10=document.createElement('button');b10.className='ghost small';b10.textContent='HYPE';b10.onclick=function(){pacing(1.25,'HYPE')};
  r4.appendChild(b8);r4.appendChild(b9);r4.appendChild(b10);card.appendChild(r4);
  var out=document.createElement('div');out.className='note';out.id='ap8Out';out.textContent='QC sweep scores the edit: beat alignment, length, variety, captions. mix cuts kills runs of 3 same transitions.';card.appendChild(out);
  var n2=document.createElement('div');n2.className='note';n2.textContent='new caption styles live in the captions dropdown: NEON, TYPEWRITER, BOX, OUTLINE, GRADIENT, POP. new fx chips: RGB SPLIT, VHS, GLITCH BARS, MIRROR, SCANLINES.';card.appendChild(n2);
  host.insertBefore(card,first?first.nextSibling:host.firstChild);
}

function init(){
  var tries=0;
  var iv=setInterval(function(){tries++;if((addFx8()&&capStyles())||tries>40)clearInterval(iv)},250);
  qualityCard();
  log('quality pack live: camera moves, split/duplicate/merge, 6 caption styles, 5 new fx, autopilot (QC, mix cuts, pacing)',true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
else init();
})();
