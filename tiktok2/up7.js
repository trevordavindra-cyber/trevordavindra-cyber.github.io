'use strict';
// PHASE 1 batch (engine + AI hardening): undo/redo, overlay layers, retention auto-fixer,
// 5 new FX, visual importance detection, automatic storyboarding. Extends app.js hooks only.
(function(){
// ---------- undo / redo engine ----------
var UR={states:[],idx:-1,restoring:false};
function urCapture(){
  return JSON.stringify({clips:S.clips,captions:S.captions,style:S.style,capStyle:S.capStyle,
    musicId:S.musicId,musicGain:S.musicGain,musicOffset:S.musicOffset,overlays:S.overlays||[]});
}
function urRestore(s){
  UR.restoring=true;
  try{
    var d=JSON.parse(s);
    S.clips=d.clips;S.captions=d.captions;S.style=d.style;S.capStyle=d.capStyle;
    S.musicId=d.musicId;S.musicGain=d.musicGain;S.musicOffset=d.musicOffset;S.overlays=d.overlays||[];
    drawTimeline();save();
  }catch(e){}
  UR.restoring=false;
}
function urPush(){
  if(UR.restoring)return;
  var s=urCapture();
  if(UR.idx>=0&&UR.states[UR.idx]===s)return;
  UR.states=UR.states.slice(0,UR.idx+1);
  UR.states.push(s);
  if(UR.states.length>80)UR.states.shift();
  UR.idx=UR.states.length-1;
  urButtons();
}
function urUndo(){
  if(UR.idx<=0){log('nothing to undo');return}
  UR.idx--;urRestore(UR.states[UR.idx]);urButtons();log('undo');
}
function urRedo(){
  if(UR.idx>=UR.states.length-1){log('nothing to redo');return}
  UR.idx++;urRestore(UR.states[UR.idx]);urButtons();log('redo');
}
function urButtons(){
  var u=$('urUndo'),r=$('urRedo');
  if(u)u.disabled=UR.idx<=0;
  if(r)r.disabled=UR.idx>=UR.states.length-1;
}
// wrap drawTimeline: every real state change becomes an undo step, then decorate clips with heat
if(typeof drawTimeline==='function'){
  var dtOrig=drawTimeline;
  window.drawTimeline=function(){
    dtOrig();
    urPush();
    try{decorateHeat()}catch(e){}
    try{renderOverlayTrack()}catch(e){}
  };
}
// ---------- visual importance detection ----------
function clipImportance(c,i){
  var m=M[c.src];
  var motion=0;
  if(m&&m.scenes){
    var hits=m.scenes.filter(function(sc){return sc.start<c.end&&sc.end>c.start});
    var best=0,sum=0,n=0;
    hits.forEach(function(sc){if(sc.score>best)best=sc.score;sum+=sc.score;n++});
    motion=n?(sum/n):0;
    motion=Math.max(motion,best*0.5);
  }
  var mNorm=clamp(motion/40,0,1);
  var pos=clamp(1-i/Math.max(4,S.clips.length),0,1)*0.3;
  var dur=clamp(2.2-Math.abs(clipOutDur(c)-1.6),0,1)*0.15;
  var fxBonus=(c.fx&&c.fx.length?0.1:0)+(c.trans&&c.trans!=='cut'?0.05:0);
  return clamp(mNorm*0.55+pos+dur+fxBonus,0,1);
}
function decorateHeat(){
  var tv=$('trVideo');if(!tv)return;
  var kids=tv.querySelectorAll('.tclip');
  S.clips.forEach(function(c,i){
    var d=kids[i];if(!d)return;
    var v=clipImportance(c,i);
    var a=(0.10+v*0.42).toFixed(2),h=Math.round(8+v*72);
    d.style.background='linear-gradient(to top, rgba(0,229,255,'+a+') '+h+'%, #132038 '+(h+1)+'%)';
    d.title='importance '+Math.round(v*100)+'%';
  });
}
function sortImportance(){
  if(S.clips.length<3){log('need 3+ clips to sort');return}
  var scored=S.clips.map(function(c,i){return {c:c,i:i,v:clipImportance(c,i)}});
  var first=scored.shift(),last=scored.pop();
  scored.sort(function(a,b){return b.v-a.v});
  var nl=[first.c].concat(scored.map(function(x){return x.c})).concat([last.c]);
  var old=urCapture();
  S.clips=nl;
  drawTimeline();save();
  log('sorted middle clips by visual importance (first + last held)',true);
}
// ---------- overlay layers (timeline layer track) ----------
S.overlays=S.overlays||[];
function ovAt(t){return S.overlays.filter(function(o){return t>=o.t0&&t<o.t1})}
window.fxFrameHook=function(ctx,t,W,H){
  S.overlays.forEach(function(o){
    if(t<o.t0||t>=o.t1)return;
    var a=clamp(Math.min((t-o.t0)/0.25,(o.t1-t)/0.25),0,1)*(o.alpha!=null?o.alpha:1);
    var pop=1;
    if(t-o.t0<0.35)pop=1+0.22*(1-(t-o.t0)/0.35);
    ctx.save();
    ctx.globalAlpha=a;
    ctx.translate(o.x*W,o.y*H);
    if(o.rot)ctx.rotate(o.rot*Math.PI/180);
    ctx.scale(pop,pop);
    var fs=(o.size||64)*(H/1280);
    ctx.font='900 '+fs+'px Arial, sans-serif';
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
    ctx.lineWidth=Math.max(2,fs/8);
    if(o.glow){ctx.shadowColor=o.glow;ctx.shadowBlur=fs*0.5}
    ctx.strokeStyle='rgba(0,0,0,.9)';
    ctx.strokeText(o.text,0,0);
    ctx.shadowBlur=0;
    ctx.fillStyle=o.color||'#fff';
    ctx.fillText(o.text,0,0);
    ctx.restore();
  });
};
function renderOverlayTrack(){
  var tr=$('trOver');if(!tr)return;
  tr.innerHTML='';
  var tot=Math.max(0.1,totalDur());
  if(!S.overlays.length){tr.innerHTML='<span class="tempty">no layers — add one below</span>';return}
  S.overlays.forEach(function(o,i){
    var d=document.createElement('div');d.className='tclip cap';
    d.style.flexGrow=String(Math.max(0.2,o.t1-o.t0));
    d.textContent='L'+(i+1)+' '+String(o.text).slice(0,14);
    d.title='layer: '+o.t0.toFixed(1)+'s to '+o.t1.toFixed(1)+'s';
    d.onclick=function(){lyFocus(i)};
    tr.appendChild(d);
  });
}
var lySel=-1;
function lyFocus(i){
  lySel=i;
  var list=$('lyList');if(!list)return;
  list.querySelectorAll('.lyrow').forEach(function(r,j){r.style.borderColor=j===i?'#0ff':''});
}
function renderLyList(){
  var list=$('lyList');if(!list)return;
  list.innerHTML='';
  S.overlays.forEach(function(o,i){
    var row=document.createElement('div');row.className='lyrow';row.style.cssText='display:flex;gap:4px;align-items:center;margin-bottom:5px;padding:4px;border:1px solid #2a3c63;border-radius:6px';
    var txt=document.createElement('input');txt.value=o.text;txt.style.flex='1';txt.style.minWidth='0';
    txt.oninput=function(){o.text=this.value;save()};
    var s0=document.createElement('input');s0.type='number';s0.step='0.1';s0.value=o.t0.toFixed(1);s0.style.width='46px';
    s0.onchange=function(){o.t0=clamp(parseFloat(this.value)||0,0,o.t1-0.2);renderOverlayTrack();save()};
    var s1=document.createElement('input');s1.type='number';s1.step='0.1';s1.value=o.t1.toFixed(1);s1.style.width='46px';
    s1.onchange=function(){o.t1=clamp(parseFloat(this.value)||0,o.t0+0.2,Math.max(1,totalDur()));renderOverlayTrack();save()};
    var sz=document.createElement('input');sz.type='number';sz.value=o.size||64;sz.style.width='46px';sz.title='text size';
    sz.onchange=function(){o.size=clamp(parseFloat(this.value)||64,16,320);save()};
    var del=document.createElement('button');del.className='ghost small';del.textContent='DEL';
    del.onclick=function(){S.overlays.splice(i,1);lySel=-1;renderLyList();renderOverlayTrack();drawTimeline();save()};
    var fit=document.createElement('button');fit.className='ghost small';fit.textContent='FIT';fit.title='time-range to selected clip';
    fit.onclick=function(){
      var ci=S.clips.findIndex(function(x){return x.id===S.selected});
      if(ci<0){log('select a clip first');return}
      var st=0;for(var k=0;k<ci;k++)st+=clipOutDur(S.clips[k]);
      o.t0=st+0.05;o.t1=st+clipOutDur(S.clips[ci])-0.05;
      renderLyList();renderOverlayTrack();save();log('layer fitted to clip #'+(ci+1));
    };
    row.appendChild(txt);row.appendChild(s0);row.appendChild(s1);row.appendChild(sz);row.appendChild(fit);row.appendChild(del);
    list.appendChild(row);
  });
}
function lyAdd(){
  var txt=($('lyText').value||'').trim();
  if(!txt){log('type the layer text first');return}
  var t0=0,t1=3;
  var ci=S.clips.findIndex(function(x){return x.id===S.selected});
  if(ci>=0){var st=0;for(var k=0;k<ci;k++)st+=clipOutDur(S.clips[k]);t0=st+0.05;t1=st+clipOutDur(S.clips[ci])-0.05}
  S.overlays.push({id:uid(),text:txt,t0:t0,t1:Math.min(t1,Math.max(1,totalDur()||3)),x:0.5,y:0.5,size:64,color:'#ffffff',alpha:1,rot:0,glow:'#00e5ff'});
  $('lyText').value='';
  renderLyList();renderOverlayTrack();drawTimeline();save();
  log('layer added — drag-free: set its time range in the row',true);
}
// ---------- retention auto-fixer ----------
function fixRetention(){
  if(!S.clips.length){log('timeline is empty');return}
  var fixes=[];
  var st=STYLES[S.style]||STYLES.cinematic;
  // 1: slow opening — nothing holds a viewer past a 2.5s open
  var c0=S.clips[0],d0=clipOutDur(c0);
  if(d0>2.6){
    c0.speed=clamp(c0.speed*(d0/2.2),0.25,3);fixes.push('opening tightened to '+clipOutDur(c0).toFixed(1)+'s');
  }
  // 2: static long clips — scene motion says nothing happens
  S.clips.forEach(function(c,i){
    var d=clipOutDur(c);
    if(d>3.2){
      var m=M[c.src],motion=99;
      if(m&&m.scenes){
        var hits=m.scenes.filter(function(sc){return sc.start<c.end&&sc.end>c.start});
        if(hits.length)motion=hits.reduce(function(a,s2){return a+s2.score},0)/hits.length;
        else motion=99;
      }
      if(motion<12){c.speed=clamp(c.speed*(d/2.4),0.25,3);fixes.push('clip #'+(i+1)+' was static '+d.toFixed(1)+'s, sped to '+clipOutDur(c).toFixed(1)+'s')}
    }
  });
  // 3: repeated transition runs kill rhythm
  for(var i=0;i<S.clips.length-2;i++){
    var t=S.clips[i].trans;
    if(t&&t!=='cut'&&S.clips[i+1].trans===t&&S.clips[i+2].trans===t){
      var opts=st.trans.filter(function(x){return x!==t});
      var pick=opts[(i)%Math.max(1,opts.length)]||'cut';
      S.clips[i+2].trans=pick;fixes.push('broke a run of 3x '+t+' at clip #'+(i+3)+' with '+pick);
      i+=2;
    }
  }
  // 4: no hook in the first 1.5s
  var hooked=S.captions.some(function(cp){return cp.t0<1.5});
  if(!hooked){
    var src=S.clips[0]&&M[S.clips[0].src]?M[S.clips[0].src].name:'watch this';
    var words=String(src).replace(/\.[a-z0-9]+$/i,'').split(/[\s_-]+/).filter(Boolean).slice(0,4).join(' ')||'watch this';
    S.captions.unshift({id:uid(),t0:0.15,t1:1.8,text:words.toUpperCase()+'?'});
    fixes.push('hook caption added at 0.2s: "'+words.toUpperCase()+'?"');
  }
  // 5: opening variety — same source twice up front reads as a stuck frame
  if(S.clips.length>2&&S.clips[0].src===S.clips[1].src){
    for(var j=2;j<S.clips.length;j++){
      if(S.clips[j].src!==S.clips[0].src){
        var tmp=S.clips[1];S.clips[1]=S.clips[j];S.clips[j]=tmp;
        fixes.push('swapped clip #2 with #'+(j+1)+' for opening variety');break;
      }
    }
  }
  // 6: over length — retention dies past 45s
  var tot=totalDur();
  if(tot>45){
    var need=tot/40,f=clamp(need,1,1.5),done=false;
    S.clips.forEach(function(c){if(clipOutDur(c)>1.8&&!done){c.speed=clamp(c.speed*f,0.25,3);done=true}});
    fixes.push('ran '+tot.toFixed(0)+'s, compressed toward '+totalDur().toFixed(0)+'s');
  }
  drawTimeline();save();
  var out=$('retOut');
  var msg=fixes.length?fixes.length+' fix'+(fixes.length>1?'es':'')+' applied: '+fixes.join('; '):'edit already holds: opening under 2.6s, no static clips, varied transitions, hook in place, under 45s';
  if(out)out.textContent=msg;
  log(msg,fixes.length>0);
}
// ---------- new FX (rendered through the clip hook) ----------
var trailCv=null,trailCtx=null;
window.fxClipHook=function(ctx,c,local,od,W,H){
  var fx=c.fx||[];if(!fx.length)return;
  var p=clamp(local/od,0,1);
  for(var q=0;q<fx.length;q++){var f=fx[q];
    if(f==='filmburn'){
      var flick=0.12+0.09*Math.sin(local*7)+0.04*Math.random();
      var g=ctx.createLinearGradient(0,H*(1-p)-80,0,H*(1-p)+40);
      g.addColorStop(0,'rgba(255,180,60,0)');g.addColorStop(0.6,'rgba(255,110,30,'+(0.45*flick*6).toFixed(2)+')');g.addColorStop(1,'rgba(120,20,0,0)');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      ctx.fillStyle='rgba(255,140,40,'+flick.toFixed(3)+')';ctx.fillRect(0,0,W,H);
    }
    else if(f==='prism'){
      var off=3+p*5;
      try{
        ctx.globalCompositeOperation='screen';ctx.globalAlpha=.4;
        ctx.drawImage(ctx.canvas,off,0);ctx.drawImage(ctx.canvas,-off,off*0.6);
        ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
      }catch(e){}
    }
    else if(f==='datamosh'){
      var seed=Math.floor(local*8)*2654435761%4294967296;
      function rnd(){seed=(seed*1103515245+12345)&0x7fffffff;return seed/0x7fffffff}
      try{
        for(var b=0;b<7;b++){
          var bw=W*(0.06+rnd()*0.16),bh=H*(0.04+rnd()*0.1);
          var bx=rnd()*(W-bw),by=rnd()*(H-bh);
          var dx=(rnd()-0.5)*bw*1.4,dy=(rnd()-0.5)*bh*0.8;
          ctx.drawImage(ctx.canvas,bx,by,bw,bh,bx+dx,by+dy,bw,bh);
        }
      }catch(e){}
    }
    else if(f==='trails'){
      try{
        if(!trailCv){trailCv=document.createElement('canvas');trailCtx=trailCv.getContext('2d')}
        if(trailCv.width!==W||trailCv.height!==H){trailCv.width=W;trailCv.height=H}
        ctx.save();ctx.globalAlpha=.3;ctx.drawImage(trailCv,0,0);ctx.restore();
        trailCtx.clearRect(0,0,W,H);trailCtx.drawImage(ctx.canvas,0,0);
      }catch(e){}
    }
    else if(f==='bloom'){
      try{
        var bw2=Math.max(2,Math.round(W/4)),bh2=Math.max(2,Math.round(H/4));
        var bc=fxTemp(bw2,bh2),bctx=bc.getContext('2d');
        bctx.clearRect(0,0,bw2,bh2);
        bctx.filter='blur(3px) brightness(1.55) saturate(1.2)';
        bctx.drawImage(ctx.canvas,0,0,bw2,bh2);
        bctx.filter='none';
        ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.32;ctx.drawImage(bc,0,0,W,H);ctx.restore();
      }catch(e){}
    }
  }
};
var NEWFX=[['filmburn','FILM BURN'],['prism','PRISM'],['datamosh','DATAMOSH'],['trails','TRAILS'],['bloom','BLOOM']];
function addFxChips(){
  var chips=$('fxChips');if(!chips)return false;
  NEWFX.forEach(function(f){
    if(chips.querySelector('[data-fx="'+f[0]+'"]'))return;
    var d=document.createElement('div');d.className='chip';d.textContent=f[1];d.dataset.fx=f[0];
    d.onclick=function(){var c=cur();if(!c)return;c.fx=c.fx||[];var i2=c.fx.indexOf(f[0]);if(i2>-1)c.fx.splice(i2,1);else c.fx.push(f[0]);d.classList.toggle('on');save();drawTimeline()};
    chips.appendChild(d);
  });
  return true;
}
// ---------- automatic storyboarding ----------
async function storyboard(){
  if(!S.clips.length){log('timeline is empty');return}
  var list=S.clips.slice(0,24);
  var els={};
  list.forEach(function(c){if(!els[c.src]&&M[c.src]){var el=document.createElement('video');el.src=M[c.src].url;el.muted=true;el.playsInline=true;els[c.src]=el}});
  var keys=Object.keys(els);
  await Promise.all(keys.map(function(k){return new Promise(function(r){els[k].onloadeddata=r;setTimeout(r,3500)})}));
  var cols=4,rows=Math.ceil(list.length/cols),cw=270,chh=480;
  var cv=document.createElement('canvas');cv.width=cols*cw;cv.height=rows*(chh+30);
  var ctx=cv.getContext('2d');ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,cv.width,cv.height);
  var st=STYLES[S.style]||STYLES.cinematic;
  var t=0;
  for(var i=0;i<list.length;i++){
    var c=list[i],el=els[c.src],col=i%cols,row=Math.floor(i/cols);
    var x=col*cw,y=row*(chh+30);
    if(el){
      try{await seekTo(el,c.start+(c.end-c.start)/2,4000)}catch(e){}
      ctx.save();ctx.filter=st.grade;
      try{ctx.drawImage(el,x+5,y+5,cw-10,chh-10)}catch(e){ctx.fillStyle='#132038';ctx.fillRect(x+5,y+5,cw-10,chh-10)}
      ctx.restore();
    } else {ctx.fillStyle='#132038';ctx.fillRect(x+5,y+5,cw-10,chh-10)}
    var v=clipImportance(c,i);
    ctx.fillStyle='rgba(0,229,255,'+(0.15+v*0.5).toFixed(2)+')';
    ctx.fillRect(x+5,y+5+(chh-10)-Math.round(v*16),cw-10,Math.round(v*16));
    ctx.fillStyle='#9fb3d9';ctx.font='700 20px Arial';ctx.textAlign='left';
    ctx.fillText('#'+(i+1)+'  '+t.toFixed(1)+'s  '+clipOutDur(c).toFixed(1)+'s  imp '+Math.round(v*100)+'%',x+8,y+chh+22);
    t+=clipOutDur(c);
  }
  var b=await new Promise(function(res){cv.toBlob(res,'image/png')});
  var a=document.createElement('a');a.className='dl';a.href=URL.createObjectURL(b);a.download='storyboard.png';
  a.textContent='STORYBOARD.PNG ('+list.length+' shots) — tap to save';
  var out=$('sbOut');out.innerHTML='';out.appendChild(a);
  log('storyboard built from the real cut plan: '+list.length+' shots, importance bars included',true);
}
// ---------- UI ----------
function engineCard(){
  var first=document.querySelector('.card');
  var host=first?first.parentElement:document.body;
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='Engine: undo · layers · retention';card.appendChild(h);
  var r1=document.createElement('div');r1.className='btnrow';
  var u=document.createElement('button');u.className='ghost small';u.id='urUndo';u.textContent='UNDO';u.onclick=urUndo;
  var rd=document.createElement('button');rd.className='ghost small';rd.id='urRedo';rd.textContent='REDO';rd.onclick=urRedo;
  r1.appendChild(u);r1.appendChild(rd);card.appendChild(r1);
  var n1=document.createElement('div');n1.className='note';n1.textContent='every timeline change is one undo step. ctrl+z / ctrl+y work too. heat bars on clips show visual importance.';card.appendChild(n1);
  var h2=document.createElement('div');h2.className='kv';h2.innerHTML='<span>Layer track (text overlays over the edit)</span>';card.appendChild(h2);
  var r2=document.createElement('div');r2.className='row';
  var li=document.createElement('input');li.id='lyText';li.placeholder='layer text (e.g. PART 2)';
  var ab=document.createElement('button');ab.className='ghost small';ab.style.flex='0 0 34%';ab.textContent='ADD LAYER';ab.onclick=lyAdd;
  r2.appendChild(li);r2.appendChild(ab);card.appendChild(r2);
  var ll=document.createElement('div');ll.id='lyList';card.appendChild(ll);
  var h3=document.createElement('div');h3.className='kv';h3.innerHTML='<span>Retention auto-fixer</span>';card.appendChild(h3);
  var r3=document.createElement('div');r3.className='btnrow';
  var fr=document.createElement('button');fr.className='ghost small';fr.textContent='FIX RETENTION';fr.onclick=fixRetention;
  var si=document.createElement('button');si.className='ghost small';si.textContent='SORT BY IMPORTANCE';si.onclick=sortImportance;
  var sb=document.createElement('button');sb.className='ghost small';sb.textContent='STORYBOARD SHEET';sb.onclick=storyboard;
  r3.appendChild(fr);r3.appendChild(si);r3.appendChild(sb);card.appendChild(r3);
  var ro=document.createElement('div');ro.className='note';ro.id='retOut';ro.textContent='checks: slow open, static clips, repeated transitions, missing hook, opening variety, over 45s';card.appendChild(ro);
  var sb2=document.createElement('div');sb2.className='dl-row';sb2.id='sbOut';card.appendChild(sb2);
  host.insertBefore(card,host.firstChild);
  var capTrack=$('trCaps');
  if(capTrack&&!$('trOver')){
    var trk=capTrack.closest('.track');
    var nt=document.createElement('div');nt.className='track';
    nt.innerHTML='<div class="tlabel">LAYERS</div><div class="trow" id="trOver"><span class="tempty">no layers — add one below</span></div>';
    if(trk&&trk.parentElement)trk.parentElement.insertBefore(nt,trk.nextSibling);
  }
}
function init(){
  var tries=0;
  var iv=setInterval(function(){
    tries++;
    if(addFxChips()||tries>40)clearInterval(iv);
  },250);
  engineCard();
  renderLyList();renderOverlayTrack();
  document.addEventListener('keydown',function(e){
    if((e.ctrlKey||e.metaKey)&&!e.shiftKey&&e.key.toLowerCase()==='z'){e.preventDefault();urUndo()}
    else if(((e.ctrlKey||e.metaKey)&&(e.shiftKey&&e.key.toLowerCase()==='z'))||((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='y')){e.preventDefault();urRedo()}
  });
  urPush();
  log('engine pack live: undo/redo, layer track, retention fixer, 5 new fx, importance, storyboard',true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
else init();
})();
