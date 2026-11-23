'use strict';
// up12.js — PHASE 6 STYLE ENGINE PACK (Nov 23 2026)
// style previews, best-fit auto style, full makeover, bpm retime, randomizer,
// style blend, custom style builder, style history + revert, compare grid, recipe copy.
(function(){
if(window.__tk2up12)return;window.__tk2up12=true;
function buildCustoms(){
  try{
    var cs=JSON.parse(localStorage.getItem('tk2custyles')||'{}');
    Object.keys(cs).forEach(function(k){
      if(!STYLES[k]){STYLES[k]=cs[k];if(STYLIST.indexOf(k)<0)STYLIST.push(k)}
    });
  }catch(e){}
}
function saveCustoms(){
  try{
    var cs=JSON.parse(localStorage.getItem('tk2custyles')||'{}');
    ['custom','blend'].forEach(function(k){if(STYLES[k])cs[k]=STYLES[k]});
    localStorage.setItem('tk2custyles',JSON.stringify(cs));
  }catch(e){}
}
// ---------- style history + revert ----------
var seHist=[],seLast=null;
setInterval(function(){
  if(!S||!S.style)return;
  if(seLast!==S.style){
    seLast=S.style;
    if(!seHist.length||seHist[seHist.length-1].k!==S.style){
      seHist.push({k:S.style,at:Date.now()});
      if(seHist.length>6)seHist.shift();
      var el=document.getElementById('seHistLine');
      if(el)el.textContent='recent: '+seHist.map(function(h){return (STYLES[h.k]||{}).label||h.k}).join(' > ');
    }
  }
},2500);
function seRevert(){
  if(seHist.length<2){log('no earlier style to revert to');return}
  seHist.pop();
  var prev=seHist[seHist.length-1].k;
  S.style=prev;syncStyleChips();save();
  log('style reverted to '+((STYLES[prev]||{}).label||prev));
}
// ---------- best fit from mood engine ----------
function seBestFit(){
  if(typeof moodRead!=='function'){log('mood engine not loaded yet');return}
  var mr=moodRead();
  var pick=null;
  (mr.styles||[]).some(function(name){
    return Object.keys(STYLES).some(function(k){if(k===name){pick=k;return true}return false});
  });
  if(!pick)pick='cinematic';
  S.style=pick;syncStyleChips();save();
  log('best fit: mood '+mr.mood+' -> style '+(STYLES[pick]||{}).label+' (motion '+mr.motion.toFixed(1)+', sat '+mr.sat.toFixed(2)+')',true);
}
// ---------- style preview strip ----------
async function sePreviews(){
  if(!S.clips.length){log('no clips yet');return}
  var host=document.getElementById('sePrevRow');if(!host)return;
  var tmp=document.createElement('canvas');tmp.width=216;tmp.height=384;
  try{await renderProject({canvas:tmp})}catch(e){log('preview render: '+e.message);return}
  host.innerHTML='';
  STYLIST.forEach(function(k){
    var st=STYLES[k];if(!st)return;
    var d=document.createElement('div');d.className='chip';d.textContent=st.label;
    var c2=document.createElement('canvas');c2.width=96;c2.height=170;c2.style.display='block';c2.style.width='96px';
    var x=c2.getContext('2d');
    try{
      x.filter=st.grade||'none';
      x.drawImage(tmp,0,0,96,170);
      x.filter='none';
      if(st.tint){x.fillStyle=st.tint;x.fillRect(0,0,96,170)}
      if(st.vig){var g=x.createRadialGradient(48,85,20,48,85,110);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,'+st.vig+')');x.fillStyle=g;x.fillRect(0,0,96,170)}
      if(st.bars){x.fillStyle='#000';x.fillRect(0,0,96,170*st.bars);x.fillRect(0,170*(1-st.bars),96,170*st.bars)}
      if(st.grain){for(var i2=0;i2<160;i2++){x.fillStyle='rgba(255,255,255,'+(Math.random()*st.grain*.5)+')';x.fillRect(Math.random()*96,Math.random()*170,1,1)}}
    }catch(e){}
    d.insertBefore(c2,d.firstChild);
    d.onclick=function(){S.style=k;syncStyleChips();save();log('style -> '+st.label,true)};
    host.appendChild(d);
  });
  log('style previews rendered: '+STYLIST.length+' — tap one to apply',true);
}
// ---------- full makeover ----------
function seMakeover(){
  if(!S.clips.length){log('no clips yet');return}
  var st=STYLES[S.style];if(!st){log('no style');return}
  var n=0,changed=0;
  S.clips.forEach(function(c,i){
    var m=M[c.src];if(!m||!m.dur)return;
    var target=Math.min(st.clip[1],Math.max(st.clip[0],1/st.pace));
    var ne=Math.min(m.dur,c.start+target);
    if(ne>c.start+0.3){c.end=ne;changed++}
    c.trans=st.trans[i%st.trans.length];
    if(st.pace>=1.5)c.zoom=(i%2===0)?st.zoom:1;else c.zoom=1;
    c.ramp=st.ramp?1:0;
    n++;
  });
  if(st.cap){S.capStyle=st.cap;var sel=$('capStyle');if(sel)sel.value=st.cap}
  drawTimeline();save();
  log('full makeover: '+st.label+' — '+n+' clips retimed (avg '+(1/st.pace).toFixed(1)+'s cuts), transitions '+st.trans.join('/')+', captions '+st.cap, true);
}
// ---------- bpm retime ----------
function seBpm(){
  if(!S.clips.length){log('no clips yet');return}
  var m=S.musicId&&M[S.musicId];
  if(!m){log('load music first');return}
  var bpm=m.bpm||0;
  if(!bpm&&m.beats&&m.beats.length>3){var d=[];for(var i=1;i<Math.min(20,m.beats.length);i++)d.push(m.beats[i]-m.beats[i-1]);d.sort(function(a,b){return a-b});bpm=60/d[Math.floor(d.length/2)]||0}
  if(!bpm){log('music has no bpm yet');return}
  var beat=60/bpm,n=0;
  S.clips.forEach(function(c){
    var src=M[c.src];if(!src||!src.dur)return;
    var dur=c.end-c.start;
    var bn=Math.max(1,Math.round(dur/beat));
    var ne=Math.min(src.dur,c.start+bn*beat);
    if(ne>c.start+0.2){c.end=ne;n++}
  });
  drawTimeline();save();
  log('cuts snapped to music: '+bpm.toFixed(0)+' bpm, '+n+' clips on the beat grid',true);
}
// ---------- randomizer ----------
function seRandom(){
  if(!S.clips.length){log('no clips yet');return}
  var keys=Object.keys(STYLES);
  var k=keys[Math.floor(Math.random()*keys.length)];
  S.style=k;syncStyleChips();
  var caps=['bold','karaoke','bar'].concat(Array.prototype.slice.call(($('capStyle')||{options:[]}).options||[]).map(function(o){return o.value}));
  caps=caps.filter(function(v,i2){return v&&caps.indexOf(v)===i2});
  var cap=caps[Math.floor(Math.random()*caps.length)];
  S.capStyle=cap;var sel=$('capStyle');if(sel)sel.value=cap;
  var chipKeys=[];var chipsEl=$('fxChips');
  if(chipsEl)chipsEl.querySelectorAll('[data-fx]').forEach(function(d){chipKeys.push(d.dataset.fx)});
  var picks=[];
  if(chipKeys.length){
    while(picks.length<Math.min(2,chipKeys.length)){var f=chipKeys[Math.floor(Math.random()*chipKeys.length)];if(picks.indexOf(f)<0)picks.push(f)}
    S.clips.forEach(function(c){c.fx=picks.slice()});
  }
  drawTimeline();save();
  log('surprise: '+(STYLES[k]||{}).label+' + captions '+cap+(picks.length?' + fx '+picks.join(' + '):''),true);
}
// ---------- blend ----------
function seBlend(){
  var a=$('seBlendA'),b=$('seBlendB');
  var ka=a&&a.value,kb=b&&b.value;
  if(!ka||!kb||!STYLES[ka]||!STYLES[kb]){log('pick two styles');return}
  var A=STYLES[ka],B=STYLES[kb];
  STYLES.blend={label:'BLEND '+A.label+'/'+B.label,grade:A.grade,vig:A.vig,grain:A.grain,pace:B.pace,trans:B.trans,clip:B.clip,zoom:B.zoom,cap:A.cap,bars:A.bars,tint:B.tint||A.tint,ramp:B.ramp};
  if(STYLIST.indexOf('blend')<0)STYLIST.push('blend');
  S.style='blend';syncStyleChips();saveCustoms();save();
  log('blend built: '+A.label+' grade + '+B.label+' pace ('+B.pace.toFixed(1)+' cuts/s)',true);
}
// ---------- custom builder ----------
function seCustom(){
  var pace=parseFloat(($('sePace')||{}).value||'1.2');
  var zoom=parseFloat(($('seZoom')||{}).value||'1.15');
  var vig=parseFloat(($('seVig')||{}).value||'0.3');
  var grain=parseFloat(($('seGrain')||{}).value||'0.05');
  var tint=($('seTint')||{}).value||'';
  var cap=($('seCap')||{}).value||'bold';
  pace=Math.min(2.6,Math.max(0.3,pace));zoom=Math.min(1.8,Math.max(1,zoom));
  vig=Math.min(0.5,Math.max(0,vig));grain=Math.min(0.25,Math.max(0,grain));
  STYLES.custom={label:'CUSTOM',grade:'saturate(1.1) contrast(1.1)',vig:vig,grain:grain,pace:pace,trans:['cut','fade','punch'],clip:[Math.max(0.4,0.8/pace),Math.min(4,2.4/pace)],zoom:zoom,cap:cap,bars:0,tint:tint?tint:null};
  if(STYLIST.indexOf('custom')<0)STYLIST.push('custom');
  S.style='custom';syncStyleChips();saveCustoms();save();
  log('custom style built: pace '+pace.toFixed(1)+' cuts/s, zoom '+zoom.toFixed(2)+', captions '+cap,true);
}
// ---------- compare grid ----------
async function seCompare(){
  if(!S.clips.length){log('no clips yet');return}
  var host=$('seCmpCv');if(!host)return;
  var picks=[S.style];
  for(var i=seHist.length-1;i>=0&&picks.length<4;i--){if(picks.indexOf(seHist[i].k)<0)picks.push(seHist[i].k)}
  var keys=Object.keys(STYLES);
  while(picks.length<4){var k=keys[Math.floor(Math.random()*keys.length)];if(picks.indexOf(k)<0)picks.push(k)}
  var tmp=document.createElement('canvas');tmp.width=216;tmp.height=384;
  try{await renderProject({canvas:tmp})}catch(e){log('compare render: '+e.message);return}
  var cw=180,ch=320;host.width=cw*2+12;host.height=ch*2+12;
  var x=host.getContext('2d');x.fillStyle='#0a0e1a';x.fillRect(0,0,host.width,host.height);
  for(var j=0;j<4;j++){
    var st=STYLES[picks[j]];if(!st)continue;
    var ox=(j%2)*(cw+12),oy=Math.floor(j/2)*(ch+12);
    x.save();x.filter=st.grade||'none';x.drawImage(tmp,ox,oy,cw,ch);x.restore();
    if(st.tint){x.fillStyle=st.tint;x.fillRect(ox,oy,cw,ch)}
    if(st.bars){x.fillStyle='#000';x.fillRect(ox,oy,cw,ch*st.bars);x.fillRect(ox,oy+ch*(1-st.bars),cw,ch*st.bars)}
    x.fillStyle='#7fe7ff';x.font='bold 11px system-ui';x.fillText((st.label||picks[j]).slice(0,18),ox+6,oy+16);
  }
  log('compare grid: '+picks.map(function(k){return (STYLES[k]||{}).label||k}).join(' vs '),true);
}
// ---------- recipe copy ----------
function seRecipe(){
  var st=STYLES[S.style];if(!st){log('no style');return}
  var fxc={};S.clips.forEach(function(c){(c.fx||[]).forEach(function(f){fxc[f]=(fxc[f]||0)+1})});
  var r='STYLE RECIPE\nname: '+st.label+'\ngrade: '+st.grade+'\npace: '+st.pace.toFixed(1)+' cuts/s\nclip range: '+st.clip[0]+'-'+st.clip[1]+'s\ntransitions: '+st.trans.join('/')+'\nzoom: '+st.zoom+'\nvignette: '+st.vig+' grain: '+st.grain+(st.tint?('\ntint: '+st.tint):'')+(st.bars?('\nbars: '+st.bars):'')+'\ncaptions: '+S.capStyle+'\nclips: '+S.clips.length+(Object.keys(fxc).length?('\nfx: '+Object.keys(fxc).map(function(k){return k+' x'+fxc[k]}).join(', ')):'');
  try{navigator.clipboard.writeText(r);log('style recipe copied to clipboard',true)}catch(e){log(r)}
}
// ---------- ui ----------
function seCard(){
  var page=$('page-studio');if(!page)return false;
  var anchor=null;
  page.querySelectorAll(':scope > .card, :scope > div').forEach(function(d){
    var h=d.querySelector(':scope > h2');
    if(h&&h.textContent==='Reliability')anchor=d;
  });
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='Style engine';card.appendChild(h);
  var kv=document.createElement('div');kv.className='kv';kv.innerHTML='<span id="seHistLine">recent: —</span>';card.appendChild(kv);
  function row(){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap='8px';r.style.margin='6px 0';card.appendChild(r);return r}
  var r1=row();
  var b1=document.createElement('button');b1.className='ghost small';b1.id='sePrevBtn';b1.textContent='BUILD PREVIEWS';b1.onclick=function(){sePreviews()};r1.appendChild(b1);
  var b2=document.createElement('button');b2.className='ghost small';b2.id='seFit';b2.textContent='BEST FIT (MOOD)';b2.onclick=seBestFit;r1.appendChild(b2);
  var r2=row();
  var b3=document.createElement('button');b3.className='ghost small';b3.id='seMake';b3.textContent='FULL MAKEOVER';b3.onclick=seMakeover;r2.appendChild(b3);
  var b4=document.createElement('button');b4.className='ghost small';b4.id='seBpm';b4.textContent='MATCH MUSIC BPM';b4.onclick=seBpm;r2.appendChild(b4);
  var r3=row();
  var b5=document.createElement('button');b5.className='ghost small';b5.id='seRand';b5.textContent='SURPRISE ME';b5.onclick=seRandom;r3.appendChild(b5);
  var b6=document.createElement('button');b6.className='ghost small';b6.id='seRec';b6.textContent='COPY RECIPE';b6.onclick=seRecipe;r3.appendChild(b6);
  var r4=row();
  var sA=document.createElement('select');sA.id='seBlendA';sA.className='ghost small';STYLIST.forEach(function(k){var o=document.createElement('option');o.value=k;o.textContent=(STYLES[k]||{}).label||k;sA.appendChild(o)});r4.appendChild(sA);
  var sB=sA.cloneNode(true);sB.id='seBlendB';sB.selectedIndex=(sA.selectedIndex+1)%sA.options.length;r4.appendChild(sB);
  var b7=document.createElement('button');b7.className='ghost small';b7.id='seBlend';b7.textContent='BLEND';b7.onclick=seBlend;r4.appendChild(b7);
  var r5=row();
  ['sePace','seZoom','seVig','seGrain'].forEach(function(id,ix){
    var i3=document.createElement('input');i3.id=id;i3.type='number';i3.step='0.05';
    i3.value=['1.2','1.15','0.3','0.05'][ix];i3.placeholder=['pace','zoom','vig','grain'][ix];
    i3.style.width='64px';i3.className='ghost small';r5.appendChild(i3);
  });
  var r6=row();
  var t=document.createElement('input');t.id='seTint';t.type='color';t.value='#50146e';t.style.width='40px';r6.appendChild(t);
  var capSel=document.createElement('select');capSel.id='seCap';capSel.className='ghost small';
  var capSrc=$('capStyle');
  if(capSrc)Array.prototype.slice.call(capSrc.options).forEach(function(o){var n=document.createElement('option');n.value=o.value;n.textContent=o.textContent;capSel.appendChild(n)});
  else['bold','karaoke','bar'].forEach(function(v){var n=document.createElement('option');n.value=v;n.textContent=v.toUpperCase();capSel.appendChild(n)});
  r6.appendChild(capSel);
  var b8=document.createElement('button');b8.className='ghost small';b8.id='seCust';b8.textContent='BUILD CUSTOM STYLE';b8.onclick=seCustom;r6.appendChild(b8);
  var r7=row();
  var b9=document.createElement('button');b9.className='ghost small';b9.id='seRev';b9.textContent='REVERT STYLE';b9.onclick=seRevert;r7.appendChild(b9);
  var b10=document.createElement('button');b10.className='ghost small';b10.id='seCmp';b10.textContent='COMPARE GRID';b10.onclick=seCompare;r7.appendChild(b10);
  var prevRow=document.createElement('div');prevRow.id='sePrevRow';prevRow.style.display='flex';prevRow.style.flexWrap='wrap';prevRow.style.gap='6px';prevRow.style.margin='8px 0';card.appendChild(prevRow);
  var cmp=document.createElement('canvas');cmp.id='seCmpCv';cmp.style.width='100%';cmp.style.display='none';card.appendChild(cmp);
  var note=document.createElement('div');note.className='note';note.textContent="previews render every style's grade on your current frame — tap to apply. full makeover retimes the whole timeline to the style's cut rhythm. custom + blend styles survive reloads.";card.appendChild(note);
  if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(card,anchor.nextSibling);
  else page.appendChild(card);
  return true;
}
buildCustoms();
var tries=0;
var iv=setInterval(function(){
  tries++;
  if(seCard()){clearInterval(iv);try{log('style engine live')}catch(e){}}
  else if(tries>40)clearInterval(iv);
},250);
})();