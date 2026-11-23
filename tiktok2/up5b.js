'use strict';
// PHASE 5-8 part 2: fx studio + chroma key + object patch + subject lock, story engine, transition recs, continuity, b-roll
var FXLIST=[['glitch','GLITCH'],['rgbsplit','RGB SPLIT'],['lightleak','LIGHT LEAK'],['scanlines','SCANLINES'],['mirror','MIRROR'],['glowpulse','GLOW PULSE'],['depth2d','DEPTH 2.5D'],['motionmask','MOTION GLOW'],['frameblend','FRAME BLEND']];
function clipMotion(c){var m=M[c.src];if(!m||!m.scenes)return 5;var s=m.scenes.filter(function(x){return x.start<=c.start+0.01&&x.end>=c.end-0.01})[0];return s?s.score:5}
function setKey(rgb){
  var c=cur();if(!c)return;
  c.key={color:rgb,tol:(c.key&&c.key.tol)?c.key.tol:0.22,ready:true};
  if(c.key.bgSrc)delete c.key.bgSrc;
  save();log('chroma key set — background fills behind the keyed area',true);
}
function fxSync(){
  var c=cur();var panel=$('fxPanel');if(!panel)return;
  panel.style.display=c?'block':'none';
  if(!c)return;
  panel.querySelectorAll('#fxChips .chip').forEach(function(d){d.classList.toggle('on',!!(c.fx&&c.fx.indexOf(d.dataset.fx)>-1))});
  $('fxLock').textContent=c.lock?'ON':'OFF';
  var tl=c.key&&c.key.tol?c.key.tol:0.22;
  $('fxTol').value=tl;$('fxTolV').textContent=tl.toFixed(2);
}
function fxInit(){
  var panel=document.createElement('div');panel.className='panel';panel.id='fxPanel';panel.style.display='none';
  var h=document.createElement('div');h.className='kv';h.innerHTML='<span>Visual FX on this clip</span>';panel.appendChild(h);
  var chips=document.createElement('div');chips.className='chips';chips.id='fxChips';panel.appendChild(chips);
  FXLIST.forEach(function(f){
    var d=document.createElement('div');d.className='chip';d.textContent=f[1];d.dataset.fx=f[0];
    d.onclick=function(){var c=cur();if(!c)return;c.fx=c.fx||[];var i2=c.fx.indexOf(f[0]);if(i2>-1)c.fx.splice(i2,1);else c.fx.push(f[0]);d.classList.toggle('on');save();drawTimeline()};
    chips.appendChild(d);
  });
  var kv=document.createElement('div');kv.className='kv';kv.style.marginTop='8px';kv.innerHTML='<span>Chroma key (green/blue screen)</span>';panel.appendChild(kv);
  var row=document.createElement('div');row.className='btnrow';
  var bg=document.createElement('button');bg.className='ghost small';bg.textContent='GREEN';bg.onclick=function(){setKey([0,0.69,0.25])};
  var bb=document.createElement('button');bb.className='ghost small';bb.textContent='BLUE';bb.onclick=function(){setKey([0,0.28,0.73])};
  var bp=document.createElement('button');bp.className='ghost small';bp.textContent='PICK COLOR';
  bp.onclick=function(){try{var cv=$('cv');var d=cv.getContext('2d').getImageData(Math.floor(cv.width/2),Math.floor(cv.height/2),1,1).data;setKey([d[0]/255,d[1]/255,d[2]/255]);log('key color sampled from the preview frame',true)}catch(e){log('run a preview first so there is a frame to sample')}};
  var bc=document.createElement('button');bc.className='ghost small';bc.textContent='CLEAR KEY';bc.onclick=function(){var c=cur();if(!c)return;delete c.key;save();log('chroma key off')};
  row.appendChild(bg);row.appendChild(bb);row.appendChild(bp);row.appendChild(bc);panel.appendChild(row);
  var brow=document.createElement('div');brow.className='btnrow';
  var bab=document.createElement('button');bab.className='ghost small';bab.textContent='AI BACKDROP';
  bab.onclick=async function(){
    var c=cur();if(!c)return;
    var p=prompt('describe the backdrop scene:');if(!p)return;
    bab.disabled=true;
    try{
      var b=await genImage(p+' seamless backdrop, vertical 9:16',88);
      if(b){c.key=c.key||{color:[0,0.69,0.25],tol:0.22};c.key.bgSrc=URL.createObjectURL(b);c.key.ready=false;save();log('backdrop generated — composites on next preview/export',true)}
    }catch(e){log('backdrop: '+e.message)}
    bab.disabled=false;
  };
  brow.appendChild(bab);panel.appendChild(brow);
  var tol=document.createElement('div');tol.className='slider';tol.innerHTML='key tolerance <input type="range" id="fxTol" min="0.05" max="0.5" step="0.01" value="0.22"><output id="fxTolV">0.22</output>';
  panel.appendChild(tol);
  $('fxTol').oninput=function(){var c=cur();if(!c)return;if(!c.key)c.key={color:[0,0.69,0.25],ready:true};c.key.tol=parseFloat(this.value);$('fxTolV').textContent=c.key.tol.toFixed(2);save()};
  var lock=document.createElement('div');lock.className='kv';lock.innerHTML='<span>Subject lock (needs tracking)</span>';
  var lb=document.createElement('button');lb.className='ghost small';lb.style.width='74px';lb.id='fxLock';lb.textContent='OFF';
  lb.onclick=function(){var c=cur();if(!c)return;c.lock=c.lock?0:1;lb.textContent=c.lock?'ON':'OFF';save()};
  lock.appendChild(lb);panel.appendChild(lock);
  var pk=document.createElement('div');pk.className='kv';pk.innerHTML='<span>Object removal (blur patch)</span>';panel.appendChild(pk);
  ['x','y','w','h'].forEach(function(ax){
    var sl=document.createElement('div');sl.className='slider';
    sl.innerHTML=ax+' <input type="range" data-ax="'+ax+'" min="0" max="'+(ax==='w'||ax==='h'?'0.9':'1')+'" step="0.02" value="0.5"><output>0.50</output>';
    var inp=sl.querySelector('input');
    inp.oninput=function(){var c=cur();if(!c)return;c.patch=c.patch||{x:0.3,y:0.3,w:0.3,h:0.2};c.patch[ax]=parseFloat(this.value);sl.querySelector('output').textContent=this.value;save()};
    panel.appendChild(sl);
  });
  var pen=document.createElement('div');pen.className='btnrow';
  var pe=document.createElement('button');pe.className='ghost small';pe.textContent='APPLY PATCH TO CLIP';
  pe.onclick=function(){var c=cur();if(!c)return;c.fx=c.fx||[];if(c.fx.indexOf('patch')<0)c.fx.push('patch');fxSync();save();log('blur patch armed — toggle the PATCH chip off to remove it')};
  pen.appendChild(pe);panel.appendChild(pen);
  var ex=document.createElement('div');ex.className='btnrow';
  var exb=document.createElement('button');exb.className='ghost small';exb.textContent='EXTEND SCENE (+SLOW HOLD)';
  exb.onclick=function(){
    var i=0;for(var k=0;k<S.clips.length;k++)if(S.clips[k].id===S.selected)i=k;
    if(!S.clips.length)return;
    var c=S.clips[i];
    var nc=Object.assign({},c,{id:uid(),start:Math.max(c.start,c.end-0.8),speed:0.45,ramp:0,trans:'fade',fx:['frameblend']});
    S.clips.splice(i+1,0,nc);drawTimeline();save();
    log('scene extended with a slow-motion hold',true);
  };
  ex.appendChild(exb);panel.appendChild(ex);
  $('clipPanel').appendChild(panel);
}
var _selectClip=window.selectClip;
window.selectClip=function(i){_selectClip(i);fxSync()};
// ---------- story engine ----------
async function storyOrder(){
  if(!S.clips.length){log('no clips to order');return}
  var scored=S.clips.map(function(c,i){return{c:c,i:i,sc:clipMotion(c)}});
  var byScore=scored.slice().sort(function(a,b){return b.sc-a.sc});
  var hook=byScore[0],finale=byScore[1]||byScore[0];
  var rest=scored.filter(function(x){return x!==hook&&x!==finale});
  S.clips=[hook.c].concat(rest.map(function(x){return x.c})).concat([finale.c]);
  if(S.clips[0])S.clips[0].fadeIn=1;
  var last=S.clips[S.clips.length-1];if(last)last.fadeOut=1;
  drawTimeline();save();
  log('story order set: strongest scene opens, second strongest closes',true);
  try{
    var beat=await genScript('3-beat tiktok story captions (hook, build, payoff) for an edit about '+(S.name||'this footage'));
    if(beat&&beat.scenes&&beat.scenes.length>=3){
      var lines=beat.scenes.slice(0,3).map(function(x){return x.text});
      var tot=totalDur(),seg=tot/3;
      S.captions=lines.map(function(l,n){return{id:uid(),t0:n*seg,t1:(n+1)*seg,text:String(l).toUpperCase()}});
      drawTimeline();save();
      log('story captions set: hook / build / payoff',true);
    }
  }catch(e){log('story captions: relay busy — your caption lines are untouched')}
}
// ---------- continuity engine ----------
function harmonize(){
  if(!S.clips.length){log('no clips');return}
  var bs=S.clips.map(function(c){var m=M[c.src];return m&&m.stats?m.stats.bright:0.5});
  var sorted=bs.slice().sort(function(a,b){return a-b});
  var med=sorted[Math.floor(sorted.length/2)]||0.5;
  var n=0;
  S.clips.forEach(function(c,i){
    var fix=clamp(1-(bs[i]-med)*0.9,0.75,1.3);
    if(Math.abs(fix-1)>0.03){c.gradeExtra=' brightness('+fix.toFixed(2)+')';n++}
    else if(c.gradeExtra)delete c.gradeExtra;
  });
  save();
  log('continuity: '+n+' clips re-balanced toward the edit median brightness',true);
}
// ---------- transition recommendations ----------
function transInit(){
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='Transition recommendations';card.appendChild(h);
  var d=document.createElement('div');d.id='transRecs';d.className='note';d.textContent='analyzes your cut rhythm from real motion deltas';card.appendChild(d);
  var row=document.createElement('div');row.className='btnrow';
  var b1=document.createElement('button');b1.className='ghost small';b1.textContent='ANALYZE CUTS';
  b1.onclick=function(){
    if(S.clips.length<2){$('transRecs').textContent='need 2+ clips on the timeline';return}
    var recs={},rows=[];
    for(var i=1;i<S.clips.length;i++){
      var dd=Math.abs(clipMotion(S.clips[i])-clipMotion(S.clips[i-1]));
      var rec=dd>18?'punch':dd>9?'flash':(STYLES[S.style].ramp?'whip':'fade');
      recs[rec]=(recs[rec]||0)+1;rows.push({i:i,rec:rec});
    }
    var top=Object.keys(recs).sort(function(x,y){return recs[y]-recs[x]}).slice(0,3);
    $('transRecs').innerHTML='for your '+S.clips.length+'-clip cut: '+top.map(function(t){return '<b>'+t+'</b> ×'+recs[t]}).join(' · ');
    window.__transRows=rows;$('btnTransApply').style.display='block';
  };
  var b2=document.createElement('button');b2.className='ghost small';b2.id='btnTransApply';b2.style.display='none';b2.textContent='APPLY ALL';
  b2.onclick=function(){
    var rows=window.__transRows||[];
    rows.forEach(function(r){S.clips[r.i].trans=r.rec});
    drawTimeline();save();log('recommended transitions applied to '+rows.length+' cuts',true);
  };
  row.appendChild(b1);row.appendChild(b2);card.appendChild(row);
  $('page-studio').appendChild(card);
}
// ---------- b-roll generator ----------
async function brollGen(){
  var btn=$('btnBroll');btn.disabled=true;
  try{
    var topic=prompt('b-roll topic (blank = auto from your footage):');
    if(topic===null){btn.disabled=false;return}
    topic=topic.trim()||(S.clips[0]&&M[S.clips[0].src]?M[S.clips[0].src].name.replace(/\.[a-z0-9]+$/i,''):'cinematic b-roll');
    log('generating b-roll: '+topic,true);
    var data=await genScript(topic+' — atmospheric b-roll montage, 3 shots');
    var scenes=data.scenes.slice(0,3);
    var actx=new (window.AudioContext||window.webkitAudioContext)();
    var imgs=[],clips=[];
    for(var i=0;i<scenes.length;i++){
      var b=await genImage(scenes[i].img,i+50);
      imgs.push(b?await blobToImg(b):null);
      clips.push({buf:await getVoice(scenes[i].text,'Matthew',actx)});
    }
    var blob=await renderGen(actx,imgs,clips,scenes);
    var m=await addMedia(new File([blob],('BROLL: '+topic).slice(0,40)+'.webm',{type:blob.type}),'video');
    log('b-roll ready in library: '+m.name,true);
  }catch(e){log('b-roll: '+e.message)}
  btn.disabled=false;
}
function brollInit(){
  var row=document.createElement('div');row.className='btnrow';
  var b=document.createElement('button');b.className='ghost small';b.id='btnBroll';b.textContent='GENERATE AI B-ROLL';
  b.onclick=brollGen;row.appendChild(b);
  $('page-library').appendChild(row);
}
fxInit();transInit();brollInit();
var _storyRow=document.createElement('div');_storyRow.className='btnrow';
var _sb=document.createElement('button');_sb.className='ghost small';_sb.textContent='STORY ORDER + BEATS';_sb.onclick=storyOrder;
var _hb=document.createElement('button');_hb.className='ghost small';_hb.textContent='HARMONIZE GRADE';_hb.onclick=harmonize;
_storyRow.appendChild(_sb);_storyRow.appendChild(_hb);
$('agentCard').appendChild(_storyRow);
