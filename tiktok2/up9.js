(function(){
'use strict';
// PHASE 3 (retention + publishing): hook check, retention forecast, dead-weight cut,
// best-first, loop ending, publish checklist, best post times, hashtag packs,
// caption variants, post kit export, cover frame pick. Extends app/app2/up7/up8 state only.
function $(id){return document.getElementById(id)}
function stLabel(){var st=STYLES[S.style];return (st&&st.label)||S.style||'edit'}
// ---------- importance (same metric family as up7, local copy since up7 is scoped) ----------
function impOf(c,i){
  var m=M[c.src];var motion=0;
  if(m&&m.scenes){
    var hits=m.scenes.filter(function(sc){return sc.start<c.end&&sc.end>c.start});
    var best=0,sum=0,n=0;
    hits.forEach(function(sc){if(sc.score>best)best=sc.score;sum+=sc.score;n++});
    motion=n?(sum/n):0;motion=Math.max(motion,best*0.5);
  }
  var mNorm=clamp(motion/40,0,1);
  var pos=clamp(1-i/Math.max(4,S.clips.length),0,1)*0.3;
  var dur=clamp(2.2-Math.abs(clipOutDur(c)-1.6),0,1)*0.15;
  return clamp(mNorm*0.4+pos+dur+(c.fx&&c.fx.length?0.08:0)+(c.cam&&c.cam!=='none'?0.07:0),0.05,1);
}
// ---------- hook check ----------
function hookReport(){
  if(!S.clips.length)return null;
  var c=S.clips[0];var d=clipOutDur(c);var fixes=[];var score=100;
  var imp=impOf(c,0);score-=Math.round((1-imp)*30);
  if(d>3.5){score-=25;fixes.push('first clip is '+d.toFixed(1)+'s, cut it under 2.2s')}
  else if(d>2.5){score-=12;fixes.push('first clip is '+d.toFixed(1)+'s, a tighter open scores better')}
  if(!c.cam||c.cam==='none'){score-=10;fixes.push('no camera move on the opener, apply ken burns or push in')}
  if(!S.captions.some(function(x){return (x.t0||0)<3})){score-=15;fixes.push('no caption inside the first 3s')}
  if(!S.musicId){score-=20;fixes.push('no music, cut to a beat in the library')}
  return {score:Math.max(5,score),fixes:fixes,dur:d};
}
function hookCheck(){
  var r=hookReport();
  if(!r){log('timeline is empty');return}
  var out=$('tk9HookOut');
  out.textContent='hook score '+r.score+'/100 · opener '+r.dur.toFixed(1)+'s'+(r.fixes.length?' — '+r.fixes[0]:' — clean open');
  log('hook check: '+r.score+'/100'+(r.fixes.length?' · '+r.fixes.length+' fix'+(r.fixes.length>1?'es':'')+' suggested':' · no fixes needed'),r.score<70);
}
// ---------- retention forecast curve ----------
function curve(){
  if(!S.clips.length){log('timeline is empty');return}
  var host=$('tk9CurveOut');host.innerHTML='';
  var cv=document.createElement('canvas');cv.width=592;cv.height=150;cv.style.width='100%';host.appendChild(cv);
  var ctx=cv.getContext('2d');
  var vals=S.clips.slice(0,30).map(function(c,i){var v=impOf(c,i);if(clipOutDur(c)>3.2)v*=0.72;return v});
  var drop=-1,dd=0;
  for(var i=1;i<vals.length;i++){var dv=vals[i-1]-vals[i];if(dv>dd){dd=dv;drop=i}}
  ctx.fillStyle='#0b0f14';ctx.fillRect(0,0,592,150);
  var bw=592/Math.max(1,vals.length);
  vals.forEach(function(v,i){
    var h=Math.max(3,v*118);
    ctx.globalAlpha=0.25+0.75*v;
    ctx.fillStyle=i===0?'#ff5a7a':'#18e0c8';
    ctx.fillRect(i*bw+2,140-h,Math.max(2,bw-4),h);
  });
  ctx.globalAlpha=1;
  if(drop>0){ctx.fillStyle='#ffd166';ctx.globalAlpha=0.25;ctx.fillRect(drop*bw,0,bw,140);ctx.globalAlpha=1}
  ctx.fillStyle='#9fb0c0';ctx.font='10px monospace';
  ctx.fillText('retention forecast (clip by clip)',8,12);
  if(drop>0)ctx.fillText('biggest predicted drop after clip '+drop,240,12);
  log('retention curve drawn from real clip importance'+(drop>0?' — biggest drop after clip '+drop:''),true);
}
// ---------- dead weight ----------
function cutDead(){
  if(!S.clips.length){log('timeline is empty');return}
  if(totalDur()<20){log('timeline is '+totalDur().toFixed(0)+'s — dead-weight cut only runs on 20s+ edits');return}
  var cand=S.clips.map(function(c,i){return {i:i,v:impOf(c,i)}}).filter(function(x){return x.v<0.32});
  if(!cand.length){log('no dead weight: every clip clears the importance bar');return}
  cand.sort(function(a,b){return a.v-b.v});
  var maxCut=Math.max(1,Math.ceil(S.clips.length*0.3));
  var drop=cand.slice(0,maxCut).map(function(x){return x.i}).sort(function(a,b){return b-a});
  var saved=0;
  drop.forEach(function(i){saved+=clipOutDur(S.clips[i]);S.clips.splice(i,1)});
  drawTimeline();save();
  log('cut dead weight: removed '+drop.length+' low-retention clip'+(drop.length>1?'s':'')+' (saved '+saved.toFixed(1)+'s)',true);
}
// ---------- best first ----------
function bestFirst(){
  if(S.clips.length<2){log('need at least 2 clips');return}
  var bi=0,bv=impOf(S.clips[0],0);
  for(var i=1;i<S.clips.length;i++){var v=impOf(S.clips[i],i);if(v>bv){bv=v;bi=i}}
  if(bi===0){log('your strongest clip already opens the edit');return}
  var c=S.clips.splice(bi,1)[0];S.clips.unshift(c);
  drawTimeline();save();
  log('best clip moved to the opening slot (importance '+Math.round(bv*100)+'%)',true);
}
// ---------- loop ending ----------
function loopEnd(){
  if(!S.clips.length){log('timeline is empty');return}
  var f=S.clips[0],last=S.clips[S.clips.length-1];
  if(last.src===f.src&&clipOutDur(last)<=0.8){log('loop ending already in place');return}
  var nl=Object.assign({},f,{id:uid()});
  nl.in=f.in;nl.out=Math.min(f.in+0.7,f.out);nl.trans='fade';nl.fx=[];
  S.clips.push(nl);drawTimeline();save();
  log('loop ending added: the last 0.7s replay the opening shot',true);
}
// ---------- publish checklist ----------
function checklist(){
  var out=$('tk9ChkOut');
  if(!S.clips.length){out.textContent='timeline is empty';log('publish checklist needs clips first');return}
  var rows=[],pass=0;
  function chk(name,ok,note){if(ok)pass++;rows.push((ok?'PASS':'FAIL')+' · '+name+(note?' — '+note:''))}
  chk('vertical format',(S.res===720||S.res===1080),'9:16 export');
  chk('frame rate ok',S.fps<=60,S.fps+' fps');
  chk('music track',!!S.musicId,'sound-on posts retain better');
  chk('captions added',S.captions.length>=1,S.captions.length+' on the timeline');
  var d0=clipOutDur(S.clips[0]);
  chk('hook under 2.5s',d0<=2.5,'opener is '+d0.toFixed(1)+'s');
  chk('under 60s',totalDur()<=60,totalDur().toFixed(1)+'s total');
  var lastc=S.clips[S.clips.length-1];
  chk('loops cleanly',(lastc.trans==='fade'||lastc.src===S.clips[0].src),'');
  chk('camera moves',S.clips.every(function(c){return c.cam&&c.cam!=='none'}),'');
  out.innerHTML=rows.join('<br>');
  log('publish checklist: '+pass+'/8 pass',pass<8);
}
// ---------- best post times ----------
function nextTimes(n){
  var WIN={0:[8,16,22],1:[6,10],2:[9,15],3:[11,13],4:[12,19],5:[13,17],6:[9,11]};
  var now=new Date(),list=[];
  for(var k=0;k<7;k++){
    var d=new Date(now.getTime()+k*86400000);
    (WIN[d.getDay()]||[]).forEach(function(h){
      var t=new Date(d.getFullYear(),d.getMonth(),d.getDate(),h,0);
      if(t.getTime()>now.getTime())list.push(t);
    });
  }
  list.sort(function(a,b){return a.getTime()-b.getTime()});
  return list.slice(0,n).map(function(t){
    return t.toLocaleDateString(undefined,{weekday:'short'})+' '+t.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});
  });
}
function postTimes(){
  var t=nextTimes(3);
  if(!t.length){log('no post windows found');return}
  $('tk9TimesOut').textContent='next windows: '+t.join(' · ');
  log('best post times: '+t[0]+' is the next high-traffic window',true);
}
// ---------- hashtag packs ----------
var BASE=['#fyp','#foryou','#tiktokedit','#edits','#viral'];
function packFor(label){
  var l=(label||'').toLowerCase(),b=BASE;
  if(l.indexOf('anime')>-1)return b.concat(['#anime','#animeedit','#amv','#animeedits','#otaku']);
  if(l.indexOf('football')>-1||l.indexOf('soccer')>-1)return b.concat(['#football','#soccer','#footballedit','#footballtiktok']);
  if(l.indexOf('gaming')>-1)return b.concat(['#gaming','#gameplay','#gamingtok','#clips']);
  if(l.indexOf('marvel')>-1)return b.concat(['#marvel','#mcu','#superhero','#marveledit']);
  if(l.indexOf('movie')>-1||l.indexOf('cinem')>-1)return b.concat(['#cinematic','#filmtok','#moviescenes','#colorgrading']);
  if(l.indexOf('dark')>-1||l.indexOf('aesthetic')>-1)return b.concat(['#darkaesthetic','#aesthetic','#moody','#grunge']);
  if(l.indexOf('velocity')>-1)return b.concat(['#velocity','#velocityedit','#smoothedit','#aftereffects']);
  if(l.indexOf('phonk')>-1)return b.concat(['#phonk','#phonkedit','#driftphonk','#brazilianphonk']);
  if(l.indexOf('luxury')>-1)return b.concat(['#luxury','#luxurylifestyle','#motivation','#success']);
  if(l.indexOf('documentary')>-1)return b.concat(['#documentary','#storytime','#vlog','#dailylife']);
  if(l.indexOf('emotional')>-1)return b.concat(['#emotional','#feels','#sadedit','#deep']);
  return b.concat(['#edit','#creator','#contentcreator']);
}
function renderTags(){
  var box=$('tk9TagsChips');box.innerHTML='';
  Object.keys(STYLES).forEach(function(k){
    var d=document.createElement('div');d.className='chip';d.textContent=STYLES[k].label;
    d.onclick=function(){$('tk9Tags').value=packFor(STYLES[k].label).join(' ');log(STYLES[k].label.toLowerCase()+' hashtag pack loaded ('+packFor(STYLES[k].label).length+' tags)')};
    box.appendChild(d);
  });
}
function copyTags(){
  var t=$('tk9Tags').value.trim();
  if(!t){log('pick a hashtag pack first');return}
  navigator.clipboard.writeText(t);
  var b=$('tk9Copy');b.textContent='COPIED';setTimeout(function(){b.textContent='COPY TAGS'},1200);
  log('hashtag pack copied: '+t.split(' ').length+' tags');
}
// ---------- caption variants ----------
function copyTxt(t,btn){
  navigator.clipboard.writeText(t);
  btn.textContent='COPIED';setTimeout(function(){btn.textContent='COPY'},1200);
}
function capVariants(){
  if(!S.clips.length){log('timeline is empty');return}
  var topic=($('covTitle')&&$('covTitle').value.trim())||(S.captions[0]&&S.captions[0].text)||('my '+stLabel().toLowerCase()+' edit');
  var n=S.clips.length,d=Math.round(totalDur()),sl=stLabel().toLowerCase();
  var vs=[
    'which clip hit hardest? watch to the end 👀 '+topic,
    n+' cuts · '+d+'s · '+sl+' grade. no filler, all flow',
    'started with just an idea for '+topic+' — this is where it landed',
    'this edit took '+n+' cuts to get right. worth every one',
    'sound on 🔊 run it back at least twice — '+topic
  ];
  var box=$('tk9CapsOut');box.innerHTML='';
  vs.forEach(function(v){
    var row=document.createElement('div');row.style.display='flex';row.style.gap='6px';row.style.alignItems='center';row.style.marginBottom='4px';
    var tx=document.createElement('span');tx.textContent=v;tx.style.flex='1';tx.style.fontSize='11px';tx.style.color='#9fb0c0';
    var b=document.createElement('button');b.className='ghost small';b.textContent='COPY';b.style.flex='0 0 64px';
    b.onclick=function(){copyTxt(v,b)};
    row.appendChild(tx);row.appendChild(b);box.appendChild(row);
  });
  log('5 caption variants generated from your project',true);
}
// ---------- post kit ----------
function kit(){
  if(!S.clips.length){log('timeline is empty');return}
  var pack=packFor(stLabel());
  var topic=($('covTitle')&&$('covTitle').value.trim())||(S.captions[0]&&S.captions[0].text)||('my '+stLabel().toLowerCase()+' edit');
  var r=hookReport()||{score:0,fixes:[]};
  var lines=[
    'POST KIT — '+S.name,
    '',
    'caption: which clip hit hardest? watch to the end 👀 '+topic,
    '',
    'hashtags: '+pack.join(' '),
    '',
    'best post times: '+nextTimes(3).join(' · '),
    '',
    'project: '+S.clips.length+' clips · '+Math.round(totalDur())+'s · '+stLabel().toLowerCase()+' · '+S.res+'p '+S.fps+'fps',
    'hook score: '+r.score+'/100'+(r.fixes.length?' (top fix: '+r.fixes[0]+')':''),
  ];
  var blob=new Blob([lines.join('\n')],{type:'text/plain'});
  var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='postkit.txt';document.body.appendChild(a);a.click();a.remove();
  $('tk9KitOut').textContent=lines.join('\n');
  log('post kit downloaded: postkit.txt (caption, tags, post times, hook score)',true);
}
// ---------- cover pick ----------
function coverPick(){
  if(!S.clips.length){log('timeline is empty');return}
  var c=S.clips[0],m=M[c.src],best=null;
  if(m&&m.scenes){
    m.scenes.forEach(function(sc){if(sc.start>=c.start&&sc.end<=c.end&&(!best||sc.score>best.score))best=sc});
  }
  if(!best){log('no scene analysis on the opener yet — run ANALYZE FOOTAGE first');return}
  var mid=(best.start+best.end)/2;
  var pct=clamp(Math.round((mid-c.start)/(c.end-c.start)*100),0,100);
  var sl=$('covFrame');sl.value=pct;
  try{sl.dispatchEvent(new Event('input'))}catch(e){}
  log('cover frame set to '+pct+'% — highest motion at '+mid.toFixed(1)+'s in the opener',true);
}
// ---------- card UI ----------
function mkBtn(label,fn,w){
  var b=document.createElement('button');b.className='ghost small';b.textContent=label;
  b.style.flex=w||'0 0 30%';b.onclick=fn;return b;
}
function mkNote(id){
  var d=document.createElement('div');d.id=id;d.className='note';d.style.marginTop='6px';d.style.fontSize='11px';d.style.color='#9fb0c0';
  return d;
}
function mkSpan(t){var s=document.createElement('span');s.style.display='block';s.style.margin='12px 0 6px';s.style.fontSize='12px';s.style.color='#7fd8e8';s.textContent=t;return s}
function retCard(){
  if($('tk9HookOut'))return true;
  var anchor=$('tk8Hype')||$('tk8Qc');
  var card0=anchor?anchor.closest('.card'):(document.querySelector('.card'));
  if(!card0)return false;
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='Retention + publishing';card.appendChild(h);
  var r1=document.createElement('div');r1.className='btnrow';
  r1.appendChild(mkBtn('HOOK CHECK',hookCheck,'0 0 24%'));
  r1.appendChild(mkBtn('PUT BEST FIRST',bestFirst,'0 0 24%'));
  r1.appendChild(mkBtn('CUT DEAD WEIGHT',cutDead,'0 0 26%'));
  r1.appendChild(mkBtn('LOOP ENDING',loopEnd,'0 0 24%'));
  card.appendChild(r1);card.appendChild(mkNote('tk9HookOut'));
  var r2=document.createElement('div');r2.className='btnrow';
  r2.appendChild(mkBtn('RETENTION CURVE',curve,'0 0 30%'));
  card.appendChild(r2);card.appendChild(mkNote('tk9CurveOut'));
  var r3=document.createElement('div');r3.className='btnrow';
  r3.appendChild(mkBtn('PUBLISH CHECKLIST',checklist,'0 0 30%'));
  card.appendChild(r3);card.appendChild(mkNote('tk9ChkOut'));
  var r4=document.createElement('div');r4.className='btnrow';
  r4.appendChild(mkBtn('BEST POST TIMES',postTimes,'0 0 30%'));
  card.appendChild(r4);card.appendChild(mkNote('tk9TimesOut'));
  card.appendChild(mkSpan('Hashtag packs (tap a style, then copy)'));
  var chips=document.createElement('div');chips.id='tk9TagsChips';chips.className='chips';chips.style.display='flex';chips.style.flexWrap='wrap';chips.style.gap='6px';card.appendChild(chips);
  var ta=document.createElement('textarea');ta.id='tk9Tags';ta.rows=2;ta.className='inp';ta.placeholder='hashtag pack appears here';ta.style.width='100%';ta.style.marginTop='6px';card.appendChild(ta);
  var r5=document.createElement('div');r5.className='btnrow';
  var cb=document.createElement('button');cb.className='ghost small';cb.id='tk9Copy';cb.textContent='COPY TAGS';cb.style.flex='0 0 30%';cb.onclick=copyTags;r5.appendChild(cb);
  card.appendChild(r5);
  var r6=document.createElement('div');r6.className='btnrow';
  r6.appendChild(mkBtn('5 CAPTION VARIANTS',capVariants,'0 0 30%'));
  card.appendChild(r6);card.appendChild(mkNote('tk9CapsOut'));
  var r7=document.createElement('div');r7.className='btnrow';
  r7.appendChild(mkBtn('POST KIT (.TXT)',kit,'0 0 30%'));
  r7.appendChild(mkBtn('COVER FRAME PICK',coverPick,'0 0 30%'));
  card.appendChild(r7);card.appendChild(mkNote('tk9KitOut'));
  if(card0.nextSibling)card0.parentElement.insertBefore(card,card0.nextSibling);
  else card0.parentElement.appendChild(card);
  renderTags();
  return true;
}
function init(){
  var tries=0;
  var iv=setInterval(function(){
    tries++;
    if(retCard()||tries>40)clearInterval(iv);
  },250);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
else init();
})();
