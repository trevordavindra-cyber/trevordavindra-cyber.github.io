// up10.js — PHASE 4 ECOSYSTEM PACK (Nov 23 2026)
// share link, draft library, project templates, creator tag, brand kit,
// series planner, edit notes, content calendar, 1440p + bitrate, creator goals
(function(){
function $(id){return document.getElementById(id)}
function lsGet(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function b64u(s){return btoa(unescape(encodeURIComponent(s))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function unb64u(s){s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';return decodeURIComponent(escape(atob(s)))}
function projData(){return {v:2,name:S.name,style:S.style,capStyle:S.capStyle,musicId:S.musicId,clips:S.clips,captions:S.captions}}
function applyProj(d){S.clips=d.clips;S.captions=d.captions||[];S.style=d.style||S.style;S.capStyle=d.capStyle||'bold';if(d.musicId&&M[d.musicId])S.musicId=d.musicId;drawTimeline();syncStyleChips();save()}
function mkBtn(txt,fn,flex,id){var b=document.createElement('button');b.className='ghost small';b.textContent=txt;b.style.flex=flex||'0 0 30%';if(id)b.id=id;b.onclick=fn;return b}
function mkRow(btns){var r=document.createElement('div');r.className='btnrow';btns.forEach(function(b){r.appendChild(b)});return r}
function mkNote(id){var n=document.createElement('div');n.className='note';if(id)n.id=id;return n}
function mkInp(id,ph,type){var i=document.createElement('input');i.id=id;i.className='inp';i.placeholder=ph;i.style.marginTop='6px';if(type)i.type=type;return i}
// ---------- share link ----------
function buildLink(){
  if(!S.clips.length){log('nothing to share — the timeline is empty');return}
  try{
    var u=location.origin+location.pathname+'#p='+b64u(JSON.stringify(projData()));
    $('ecShare').value=u;
    log('share link built ('+u.length+' chars) — copy it to a friend',true)
  }catch(e){log('share link failed: '+e.message)}
}
function copyLink(){
  var v=$('ecShare').value;
  if(!v){log('build the link first');return}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(v).then(function(){log('link copied',true)},function(){log('copy blocked — select the text and copy manually')})}
  else log('copy blocked — select the text and copy manually')
}
function loadFromLink(){
  var h=location.hash||'';
  var i=h.indexOf('#p=');
  if(i<0){log('no shared project in this page link');return}
  try{
    var d=JSON.parse(unb64u(h.slice(i+3)));
    if(!d||!d.clips)throw new Error('not a project link');
    S.name=d.name||S.name;
    applyProj(d);
    log('shared project loaded: '+(d.name||'unnamed')+', '+(d.clips.length||0)+' clips (footage stays on the uploader device — re-add your own copies of the files)',true)
  }catch(e){log('load failed: '+e.message)}
}
// ---------- draft library ----------
function drafts(){return lsGet('tk2drafts',{})}
function saveDraft(){
  var nm=($('ecDraftName').value||'').trim();
  if(!nm){log('name the draft first');return}
  if(!S.clips.length){log('nothing to save — the timeline is empty');return}
  var d=drafts();d[nm]={d:projData(),at:Date.now()};lsSet('tk2drafts',d);fillDrafts();
  $('ecDraftName').value='';
  log('draft saved: '+nm,true)
}
function fillDrafts(){
  var sel=$('ecDraftSel');if(!sel)return;
  sel.innerHTML='';
  var d=drafts();
  Object.keys(d).sort().forEach(function(k){var o=document.createElement('option');o.value=k;o.textContent=k+' ('+d[k].d.clips.length+' clips)';sel.appendChild(o)})
}
function loadDraft(){
  var k=$('ecDraftSel').value;var d=drafts();
  if(!k||!d[k]){log('pick a draft to load');return}
  S.name=d[k].d.name||k;applyProj(d[k].d);
  log('draft loaded: '+k,true)
}
function delDraft(){
  var k=$('ecDraftSel').value;var d=drafts();
  if(!k||!d[k]){log('pick a draft to delete');return}
  delete d[k];lsSet('tk2drafts',d);fillDrafts();log('draft deleted: '+k)
}
// ---------- project templates ----------
function tpls(){return lsGet('tk2templates',{})}
function saveTpl(){
  var nm=($('ecTplName').value||'').trim();
  if(!nm){log('name the template first');return}
  if(!S.clips.length){log('nothing to save — the timeline is empty');return}
  var t=tpls();
  t[nm]={style:S.style,capStyle:S.capStyle,capData:S.captions.slice(),musicGain:S.musicGain,
    slots:S.clips.map(function(c){return {dur:Math.max(0.1,c.end-c.start),speed:c.speed||1,zoom:(c.zoom==null?1:c.zoom),trans:c.transition||'',fx:(c.fx||[]).slice(0)}})};
  lsSet('tk2templates',t);fillTpls();$('ecTplName').value='';
  log('template saved: '+nm+' ('+t[nm].slots.length+' slots)',true)
}
function fillTpls(){
  var sel=$('ecTplSel');if(!sel)return;
  sel.innerHTML='';
  var t=tpls();
  Object.keys(t).sort().forEach(function(k){var o=document.createElement('option');o.value=k;o.textContent=k+' ('+t[k].slots.length+' slots)';sel.appendChild(o)})
}
function applyTpl(){
  var k=$('ecTplSel').value;var t=tpls();
  if(!k||!t[k]){log('pick a template to apply');return}
  if(!S.clips.length){log('put clips on the timeline first');return}
  var tp=t[k];
  S.clips.forEach(function(c,i){
    var sl=tp.slots[i%tp.slots.length];
    c.end=c.start+sl.dur;c.speed=sl.speed;c.zoom=sl.zoom;c.transition=sl.trans;c.fx=sl.fx.slice(0)
  });
  S.style=tp.style||S.style;S.capStyle=tp.capStyle||S.capStyle;
  if(tp.capData&&tp.capData.length)S.captions=JSON.parse(JSON.stringify(tp.capData));
  drawTimeline();syncStyleChips();save();
  log('template applied: '+k+' — structure rebuilt on '+S.clips.length+' clips (re-fit captions if lengths changed)',true)
}
function delTpl(){
  var k=$('ecTplSel').value;var t=tpls();
  if(!k||!t[k]){log('no template selected to delete');return}
  delete t[k];lsSet('tk2templates',t);fillTpls();
  log('template deleted: '+k,true)
}
// ---------- creator tag ----------
var TAGG=lsGet('tk2tag',{on:false,text:''});
function saveTag(){
  var t=($('ecTag').value||'').trim();
  TAGG.text=t;lsSet('tk2tag',TAGG);
  log(t?('creator tag saved: '+t+(TAGG.on?' — drawing on every export frame':' — press TAG ON to use it')):'creator tag cleared')
}
function tagToggle(){
  if(!TAGG.text){log('type your handle first');return}
  TAGG.on=!TAGG.on;lsSet('tk2tag',TAGG);
  log('creator tag '+(TAGG.on?'ON — small watermark bottom-right on export and preview':'OFF'),true)
}
function tagOnCover(){
  var cv=$('coverCv');
  if(!cv){log('no cover canvas found');return}
  if(!TAGG.text){log('type your handle first');return}
  var ctx=cv.getContext('2d');var fs=Math.max(24,cv.width*0.05);
  ctx.save();
  ctx.font='800 '+fs+'px '+(window.tk2BrandFont||'Arial, sans-serif');
  ctx.globalAlpha=0.75;ctx.textAlign='right';ctx.textBaseline='bottom';
  ctx.shadowColor='rgba(0,0,0,.85)';ctx.shadowBlur=8;
  ctx.fillStyle=window.tk2BrandCap||'#fff';
  ctx.fillText(TAGG.text,cv.width-cv.width*0.05,cv.height-cv.height*0.03);
  ctx.restore();
  log('tag drawn on the cover bottom-right',true)
}
// ---------- brand kit ----------
function brand(){return lsGet('tk2brand',{c:'',f:''})}
function applyBrand(){
  var c=$('ecBrandColor').value||'';
  var f=$('ecBrandFont').value||'';
  var b=brand();b.c=c;b.f=f;lsSet('tk2brand',b);
  window.tk2BrandCap=c||null;window.tk2BrandFont=f||null;
  if(c)document.documentElement.style.setProperty('--cyan',c);
  else document.documentElement.style.removeProperty('--cyan');
  log(c?('brand applied — captions in '+c+', '+f+' font, page accent recolored'):('brand applied — '+f+' font, caption color default, accent restored'),true)
}
function brandOff(){
  var b=brand();b.c='';lsSet('tk2brand',b);
  window.tk2BrandCap=null;document.documentElement.style.removeProperty('--cyan');
  log('brand color off — captions and accent back to default')
}
// ---------- series planner ----------
function series(){return lsGet('tk2series',null)}
function serLine(){
  var s=series();var o=$('ecSeriesOut');if(!o)return;
  if(!s||!s.topics.length){o.textContent='no series yet — type a topic in the generator and press ADD TO SERIES';return}
  var n=s.done.filter(function(x){return x}).length;
  o.textContent=(s.name||'series')+': '+n+' of '+s.topics.length+' topics used'
}
function serAdd(){
  var s=series()||{name:'',topics:[],done:[]};
  var t=(($('genTopic')&&$('genTopic').value)||'').trim();
  if(!t){log('type a topic in the generator first');return}
  if(!s.name)s.name=($('ecSeriesName').value||'').trim()||('series '+new Date().toISOString().slice(0,10));
  s.topics.push(t);s.done.push(false);lsSet('tk2series',s);serLine();
  log('added to series: '+t,true)
}
function serNext(){
  var s=series();
  if(!s||!s.topics.length){log('no series yet — add topics first');return}
  for(var i=0;i<s.topics.length;i++){
    if(!s.done[i]){
      if($('genTopic'))$('genTopic').value=s.topics[i];
      s.done[i]=true;lsSet('tk2series',s);serLine();
      log('next in series: '+s.topics[i],true);return
    }
  }
  log('series complete — every topic is done')
}
function serReset(){
  var s=series();if(!s)return;
  s.done=s.topics.map(function(){return false});lsSet('tk2series',s);serLine();
  log('series progress reset')
}
// ---------- edit notes ----------
function notes(){return lsGet('tk2notes',[])}
function addNote(){
  var txt=($('ecNoteTxt').value||'').trim();
  var tv=parseFloat($('ecNoteT').value);
  if(!txt){log('type the note first');return}
  if(isNaN(tv)||tv<0)tv=0;
  var n=notes();n.push({t:tv,txt:txt,forName:S.name,at:Date.now()});
  lsSet('tk2notes',n);$('ecNoteTxt').value='';renderNotes();
  log('note added at '+tv.toFixed(1)+'s',true)
}
function renderNotes(){
  var box=$('ecNoteList');if(!box)return;
  box.innerHTML='';
  var n=notes();
  if(!n.length){box.textContent='no notes yet — timestamp what to fix or explain';return}
  n.forEach(function(x,i){
    var r=document.createElement('div');r.className='note';r.style.display='flex';r.style.alignItems='center';
    r.textContent=x.t.toFixed(1)+'s — '+x.txt;
    var d=document.createElement('button');d.className='ghost small';d.textContent='DEL';d.style.marginLeft='8px';d.style.flex='0 0 auto';
    d.onclick=function(){var a=notes();a.splice(i,1);lsSet('tk2notes',a);renderNotes()};
    r.appendChild(d);box.appendChild(r)
  })
}
function exportNotes(){
  var n=notes();
  if(!n.length){log('no notes to export');return}
  var lines=['edit notes for '+(S.name||'untitled'),''];
  n.forEach(function(x){lines.push(x.t.toFixed(2)+'s: '+x.txt)});
  var b=new Blob([lines.join('\n')],{type:'text/plain'});
  var a=document.createElement('a');a.className='dl';a.href=URL.createObjectURL(b);a.download='edit-notes.txt';a.textContent='DOWNLOAD NOTES (.TXT)';
  var o=$('ecNoteOut');o.innerHTML='';o.appendChild(a);
  log('notes ready to download',true)
}
// ---------- content calendar ----------
function cal(){return lsGet('tk2cal',[])}
function addPlan(){
  var dv=$('ecCalDate').value;
  if(!dv){log('pick a date first');return}
  var c=cal();c.push({name:S.name||'untitled',date:dv,done:false,at:Date.now()});
  lsSet('tk2cal',c);renderCal();goalLine();
  log('planned: '+(S.name||'untitled')+' for '+dv,true)
}
function renderCal(){
  var box=$('ecCalList');if(!box)return;
  box.innerHTML='';
  var c=cal().slice().sort(function(a,b){return a.date<b.date?-1:1});
  if(!c.length){box.textContent='no planned posts yet — schedule a project below';return}
  var today=new Date().toISOString().slice(0,10);
  c.forEach(function(x){
    var r=document.createElement('div');r.className='note';r.style.display='flex';r.style.alignItems='center';r.style.flexWrap='wrap';
    var late=(!x.done&&x.date<today);
    r.textContent=(x.done?'done — ':'')+x.date+' — '+x.name+(late?' (late)':'');
    var b1=document.createElement('button');b1.className='ghost small';b1.textContent=x.done?'UNDONE':'DONE';b1.style.marginLeft='8px';b1.style.flex='0 0 auto';
    b1.onclick=function(){var a=cal();a.forEach(function(y){if(y.at===x.at){y.done=!y.done;y.doneAt=y.done?Date.now():0}});lsSet('tk2cal',a);renderCal();goalLine()};
    var b2=document.createElement('button');b2.className='ghost small';b2.textContent='DEL';b2.style.marginLeft='4px';b2.style.flex='0 0 auto';
    b2.onclick=function(){var a=cal().filter(function(y){return y.at!==x.at});lsSet('tk2cal',a);renderCal();goalLine()};
    r.appendChild(b1);r.appendChild(b2);box.appendChild(r)
  })
}
// ---------- creator goals ----------
function goal(){return lsGet('tk2goal',{week:5})}
function setGoal(){
  var v=parseInt($('ecGoalWeek').value);
  if(isNaN(v)||v<1)v=5;
  var g=goal();g.week=v;lsSet('tk2goal',g);goalLine();
  log('weekly goal set: '+v+' posts',true)
}
function goalLine(){
  var g=goal();var o=$('ecGoalOut');if(!o)return;
  var c=cal();var now=Date.now();
  var wk=c.filter(function(x){return x.done&&((x.doneAt||x.at||0)>0)&&(now-(x.doneAt||x.at))<7*86400000}).length;
  var s=0;
  for(var w=0;w<8;w++){
    var end=now-w*7*86400000,start=end-7*86400000;
    var n=c.filter(function(x){return x.done&&(x.doneAt||x.at||0)>=start&&(x.doneAt||x.at||0)<end}).length;
    if(n>=g.week)s++;else break
  }
  o.textContent='this week: '+wk+' of '+g.week+' posts done · streak: '+s+' week'+(s===1?'':'s')+' at goal'
}
// ---------- 1440p + bitrate ----------
function resUp(){
  var sel=$('exRes');
  if(sel){
    var has=false;
    for(var i=0;i<sel.options.length;i++)if(sel.options[i].value==='1440')has=true;
    if(!has){var o=document.createElement('option');o.value='1440';o.textContent='1440p';sel.appendChild(o)}
  }
  var bp=$('ecBps');
  if(bp){
    bp.value=String(S.bps||(S.res>=1080?8:5));
    bp.onchange=function(){
      var v=parseInt(this.value);
      if(v&&(v===5||v===8||v===12||v===16)){S.bps=v;save();log('export bitrate: '+v+' Mbps',true)}
    }
  }
}

// ---------- engine overrides (app.js stays untouched) ----------
// brand-aware captions: same layout as the engine's drawCaption, brand font + color
window.drawCaption=function(ctx,cap,t,W,H,mode){
  if(!cap)return;
  var fs,box=false;
  if(mode==='bar'){fs=44;box=true}else{fs=58}
  ctx.font='900 '+fs+'px '+(window.tk2BrandFont||'Arial, sans-serif');
  while(ctx.measureText(cap.text).width>W-70&&fs>26){fs-=3;ctx.font='900 '+fs+'px '+(window.tk2BrandFont||'Arial, sans-serif')}
  var y=mode==='bar'?H-190:H-250;
  if(box){ctx.fillStyle='rgba(0,0,0,.55)';var w=ctx.measureText(cap.text).width+30;ctx.fillRect(W/2-w/2,y-fs*0.75,w,fs*1.5)}
  var sc=1;
  var dt=t-cap.t0;
  if(mode==='karaoke'&&dt<0.14)sc=1.35-2.5*dt;
  ctx.save();ctx.translate(W/2,y);ctx.scale(sc,sc);
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
  ctx.lineWidth=fs*0.18;ctx.strokeStyle='#000';ctx.strokeText(cap.text,0,0);
  ctx.fillStyle=window.tk2BrandCap||'#fff';ctx.fillText(cap.text,0,0);ctx.restore();
};
// selectable export bitrate: MediaRecorder wrapper honors S.bps when the engine records
// creator tag watermark: draws bottom-right on preview + export when the tag is on
var oldFH=window.fxFrameHook;
window.fxFrameHook=function(ctx,t,W,H){
  if(oldFH)try{oldFH(ctx,t,W,H)}catch(e){}
  if(!TAGG.on||!TAGG.text)return;
  var fs=Math.max(14,W*0.045);
  ctx.save();
  ctx.font='800 '+fs+'px '+(window.tk2BrandFont||'Arial, sans-serif');
  ctx.globalAlpha=.75;ctx.textAlign='right';ctx.textBaseline='bottom';
  ctx.shadowColor='rgba(0,0,0,.85)';ctx.shadowBlur=6;
  ctx.fillStyle=window.tk2BrandCap||'#fff';
  ctx.fillText(TAGG.text,W-W*0.03,H-H*0.02);
  ctx.restore();
};
var OrigRec=window.MediaRecorder;
if(OrigRec&&OrigRec.isTypeSupported){
  var BRRec=function(stream,opts){
    opts=opts||{};
    if(S.bps&&opts.videoBitsPerSecond)opts.videoBitsPerSecond=S.bps*1000000;
    return new OrigRec(stream,opts);
  };
  BRRec.prototype=OrigRec.prototype;
  BRRec.isTypeSupported=function(t){return OrigRec.isTypeSupported(t)};
  window.MediaRecorder=BRRec;
}
// ---------- card ----------
function ecoCard(){
  var anchor=document.getElementById('tk9Kit');
  if(!anchor)return false;
  var card0=anchor;while(card0&&!(card0.classList&&card0.classList.contains('card')))card0=card0.parentElement;
  if(!card0)return false;
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='Ecosystem';card.appendChild(h);
  // drafts
  card.appendChild(mkInp('ecDraftName','draft name'));
  var selD=document.createElement('select');selD.id='ecDraftSel';selD.className='inp';selD.style.marginTop='6px';card.appendChild(selD);
  card.appendChild(mkRow([mkBtn('SAVE DRAFT',saveDraft,'0 0 32%','ecSvD'),mkBtn('LOAD DRAFT',loadDraft,'0 0 32%','ecLdD'),mkBtn('DELETE DRAFT',delDraft,'0 0 30%','ecDlD')]));
  // templates
  card.appendChild(mkInp('ecTplName','template name'));
  var selT=document.createElement('select');selT.id='ecTplSel';selT.className='inp';selT.style.marginTop='6px';card.appendChild(selT);
  card.appendChild(mkRow([mkBtn('SAVE TEMPLATE',saveTpl,'0 0 31%','ecSvT'),mkBtn('APPLY TEMPLATE',applyTpl,'0 0 31%','ecApT'),mkBtn('DELETE TEMPLATE',delTpl,'0 0 31%','ecDlT')]));
  card.appendChild(mkNote('ecTplOut'));
  // creator tag
  card.appendChild(mkInp('ecTag','@yourhandle (watermark)'));
  card.appendChild(mkRow([mkBtn('SAVE TAG',saveTag,'0 0 32%','ecSvTag'),mkBtn('TAG ON/OFF',tagToggle,'0 0 32%','ecTagTg'),mkBtn('TAG ON COVER',tagOnCover,'0 0 30%','ecTagCv')]));
  // brand kit
  var brow=document.createElement('div');brow.className='btnrow';
  var ci=document.createElement('input');ci.id='ecBrandColor';ci.type='color';ci.className='inp';ci.style.flex='0 0 22%';ci.style.height='34px';
  var fs=document.createElement('select');fs.id='ecBrandFont';fs.className='inp';fs.style.flex='0 0 38%';
  ['','Arial, sans-serif','Georgia, serif','Impact, fantasy','Verdana, sans-serif','Courier New, monospace','Trebuchet MS, sans-serif'].forEach(function(f){var o=document.createElement('option');o.value=f;o.textContent=f||'default font';fs.appendChild(o)});
  brow.appendChild(ci);brow.appendChild(fs);
  brow.appendChild(mkBtn('APPLY BRAND',applyBrand,'0 0 22%','ecBrAp'));
  brow.appendChild(mkBtn('BRAND OFF',brandOff,'0 0 16%','ecBrOff'));
  card.appendChild(brow);
  // series
  card.appendChild(mkInp('ecSeriesName','series name (once)'));
  card.appendChild(mkRow([mkBtn('ADD TO SERIES',serAdd,'0 0 32%','ecSerA'),mkBtn('NEXT IN SERIES',serNext,'0 0 32%','ecSerN'),mkBtn('RESET PROGRESS',serReset,'0 0 30%','ecSerR')]));
  card.appendChild(mkNote('ecSeriesOut'));
  // notes
  var nrow=document.createElement('div');nrow.className='btnrow';
  var nt=document.createElement('input');nt.id='ecNoteT';nt.type='number';nt.min='0';nt.step='0.1';nt.placeholder='sec';nt.className='inp';nt.style.flex='0 0 18%';
  var nx=document.createElement('input');nx.id='ecNoteTxt';nx.placeholder='note (what to fix, why)';nx.className='inp';nx.style.flex='1 1 auto';
  nrow.appendChild(nt);nrow.appendChild(nx);
  card.appendChild(nrow);
  card.appendChild(mkRow([mkBtn('ADD NOTE',addNote,'0 0 32%','ecNoA'),mkBtn('EXPORT NOTES',exportNotes,'0 0 32%','ecNoE')]));
  card.appendChild(mkNote('ecNoteList'));
  card.appendChild(mkNote('ecNoteOut'));
  // calendar
  var crow=document.createElement('div');crow.className='btnrow';
  var cd=document.createElement('input');cd.id='ecCalDate';cd.type='date';cd.className='inp';cd.style.flex='0 0 46%';
  crow.appendChild(cd);crow.appendChild(mkBtn('ADD PLAN',addPlan,'0 0 30%','ecCalA'));
  card.appendChild(crow);
  card.appendChild(mkNote('ecCalList'));
  // goals + bitrate
  var grow=document.createElement('div');grow.className='btnrow';
  var bs=document.createElement('select');bs.id='ecBps';bs.className='inp';bs.style.flex='0 0 26%';
  [5,8,12,16].forEach(function(v){var o=document.createElement('option');o.value=String(v);o.textContent=v+' Mbps';bs.appendChild(o)});
  var gi=document.createElement('input');gi.id='ecGoalWeek';gi.type='number';gi.min='1';gi.value='5';gi.className='inp';gi.style.flex='0 0 20%';gi.placeholder='goal';
  grow.appendChild(bs);grow.appendChild(gi);
  grow.appendChild(mkBtn('SET GOAL',setGoal,'0 0 26%','ecGoS'));
  card.appendChild(grow);
  card.appendChild(mkNote('ecGoalOut'));
  // share link
  card.appendChild(mkRow([mkBtn('BUILD SHARE LINK',buildLink,'0 0 32%','ecShB'),mkBtn('COPY LINK',copyLink,'0 0 30%','ecShC'),mkBtn('LOAD FROM LINK',loadFromLink,'0 0 32%','ecShL')]));
  var ta=document.createElement('textarea');ta.id='ecShare';ta.rows=2;ta.className='inp';ta.placeholder='share link appears here';ta.style.width='100%';ta.style.marginTop='6px';card.appendChild(ta);
  card.appendChild(mkNote('ecShareOut'));
  var nn=document.createElement('div');nn.className='note';
  nn.textContent='ecosystem pack: drafts, templates, creator tag + brand kit, series planner, edit notes, post calendar, weekly goal, 1440p export (pick it in the export tab), bitrate, and share links that carry the whole edit plan in the URL.';
  card.appendChild(nn);
  if(card0.nextSibling)card0.parentElement.insertBefore(card,card0.nextSibling);
  else card0.parentElement.appendChild(card);
  return true;
}
function init(){
  var tries=0;
  var iv=setInterval(function(){
    tries++;
    if(ecoCard()){
      clearInterval(iv);
      fillDrafts();fillTpls();renderNotes();renderCal();serLine();goalLine();resUp();
      var b=brand();
      if(b.c||b.f){window.tk2BrandCap=b.c||null;window.tk2BrandFont=b.f||null;if(b.c)document.documentElement.style.setProperty('--cyan',b.c)}
      if(TAGG.on)log('creator tag is on: '+TAGG.text);
      if(location.hash&&location.hash.indexOf('#p=')>=0)log('shared project detected in the link — press LOAD FROM LINK in the ecosystem card',true);
      log('ecosystem pack live',true)
    }else if(tries>40)clearInterval(iv)
  },250);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
else init();
})();
