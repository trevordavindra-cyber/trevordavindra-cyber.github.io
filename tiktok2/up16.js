'use strict';
// up16.js — PHASE 10 CREATOR ECOSYSTEM PACK (Nov 23 2026)
// share link (project in a URL), import shared project, brand kit + watermark,
// comment pins with jump, creator review checklist, content calendar (+CSV),
// series planner, platform presets with length check, preset pack
// export/import, clip stash with re-add. Data lives in S.eco (persists with
// the project); nothing from earlier packs is touched or removed.
(function(){
if(window.__tk2up16)return;window.__tk2up16=true;
function $(id){return document.getElementById(id)}
function clamp(v,a,b){return Math.min(b,Math.max(a,v))}
function lsGet(k,d){try{var v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}}
function mkBtn(txt,fn,flex,id){var b=document.createElement('button');b.className='ghost small';b.textContent=txt;b.style.flex=flex||'0 0 30%';if(id)b.id=id;b.onclick=fn;return b}
function mkRow(btns){var r=document.createElement('div');r.className='btnrow';btns.forEach(function(b){r.appendChild(b)});return r}
function mkSel(id,opts,vals){var s=document.createElement('select');s.id=id;s.className='inp';opts.forEach(function(o,i){var el=document.createElement('option');el.value=(vals?vals[i]:o);el.textContent=o;s.appendChild(el)});return s}
function mkInp(id,ph,w){var i=document.createElement('input');i.id=id;i.placeholder=ph||'';i.autocomplete='off';if(w)i.style.flex=w;return i}
function b64e(s){return btoa(unescape(encodeURIComponent(s)))}
function b64d(s){return decodeURIComponent(escape(atob(s)))}
function td(){try{return Math.max(0.1,totalDur())}catch(e){return 1}}
function outDur(c){return Math.max(0.05,(c.end-c.start)/(c.speed||1))}
if(!S.eco)S.eco={};
var E=S.eco;
if(!E.brand)E.brand={logo:'',color:'#00e5ff',on:false};
if(!E.pins)E.pins=[];
if(!E.review)E.review={};
if(!E.cal)E.cal=[];
if(!E.series)E.series=[];
if(!E.stash)E.stash=[];
if(!E.plat)E.plat='';
function saveE(){save();if(E.needRedraw&&typeof drawTimeline==='function'){drawTimeline()}}

// ---------- 1+2. share link ----------
function projObj(){
  var p=null;try{p=JSON.parse(localStorage.getItem('tk2proj'))}catch(e){}
  return {v:1,when:Date.now(),proj:p,drafts:lsGet('tk2drafts',{}),templates:lsGet('tk2templates',{}),custyles:lsGet('tk2custyles',{})};
}
function makeShare(){
  var o=projObj();
  var payload=b64e(JSON.stringify(o));
  var url=location.origin+location.pathname+'?v=1#s='+payload;
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(url).then(function(){log('share link copied ('+Math.round(payload.length/1024)+' KB of project in the URL — open it on any device to load the edit)',true)},function(){fallback(url)});
  }else fallback(url);
  function fallback(u){var ta=document.createElement('textarea');ta.value=u;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');log('share link copied ('+Math.round(payload.length/1024)+' KB — open it on any device)',true)}catch(e){log('copy failed — link kept in the box below');}ta.remove();$('e0shareBox').value=u;}
}
function importShare(){
  var raw=($('e0shareIn').value||'').trim();
  if(!raw){log('paste a share link first');return}
  var m=raw.match(/#s=([A-Za-z0-9+/=]+)/);
  if(!m){log('that link has no project data (#s=...)');return}
  try{
    var o=JSON.parse(b64d(m[1]));
    if(!o||!o.proj)throw new Error('no project inside');
    if(!confirm('Replace the CURRENT project with the shared one? (your current edit is kept in auto-checkpoints)')){log('import cancelled');return}
    localStorage.setItem('tk2proj',JSON.stringify(o.proj));
    if(o.drafts)localStorage.setItem('tk2drafts',JSON.stringify(o.drafts));
    if(o.templates)localStorage.setItem('tk2templates',JSON.stringify(o.templates));
    if(o.custyles)localStorage.setItem('tk2custyles',JSON.stringify(o.custyles));
    log('shared project imported — reloading to load it',true);
    setTimeout(function(){location.reload()},600);
  }catch(e){log('import failed: '+e.message)}
}

// ---------- 3. brand kit + watermark ----------
function drawWm(ctx,W,H){
  var b=E.brand;if(!b||!b.on||!b.logo)return;
  try{
    ctx.save();
    var fs=Math.max(10,Math.round(W*0.028));
    ctx.font='600 '+fs+'px sans-serif';
    var tw=ctx.measureText(b.logo).width;
    ctx.globalAlpha=0.85;ctx.fillStyle=b.color||'#00e5ff';
    ctx.shadowColor='rgba(0,0,0,0.6)';ctx.shadowBlur=4;
    ctx.fillText(b.logo,W-tw-W*0.045,H-fs*1.4);
    ctx.restore();
  }catch(e){}
}
var prevFrame=window.fxFrameHook;
window.fxFrameHook=function(ctx,t,W,H){
  if(prevFrame)try{prevFrame(ctx,t,W,H)}catch(e){}
  try{drawWm(ctx,t,W,H)}catch(e){}
};
function saveBrand(){
  E.brand.logo=($('e0logo').value||'').trim().slice(0,24);
  E.brand.color=$('e0color').value||'#00e5ff';
  saveE();log('brand kit saved'+(E.brand.logo?' — '+(E.brand.on?'watermark ON':'watermark off, tap WATERMARK ON to burn it in'):''),true);
}
function wmToggle(){
  if(!E.brand.logo){log('type your brand text first');return}
  E.brand.on=!E.brand.on;saveE();
  log('watermark '+(E.brand.on?'ON — burns into preview and export':'off'),true);
}

// ---------- 4. comment pins ----------
function addPin(){
  var t=($('e0pinAt').value!==''?parseFloat($('e0pinAt').value):null);
  if(t===null||isNaN(t)){var i=S.clips.findIndex(function(x){return x.id===S.selected});
    if(i<0){log('select a clip or type a time for the pin');return}
    var acc=0;for(var k=0;k<i;k++)acc+=outDur(S.clips[k]);t=acc+0.01;}
  var note=($('e0pinNote').value||'').trim();
  if(!note){log('type the note first');return}
  t=clamp(t,0,Math.max(0,td()));
  E.pins.push({id:uid(),t:t,note:note.slice(0,60),done:false});
  $('e0pinNote').value='';saveE();renderPins();
  log('pin added at '+t.toFixed(1)+'s: "'+note.slice(0,24)+'"',true);
}
function jumpPin(i){
  var t=E.pins[i].t,acc=0;
  for(var k=0;k<S.clips.length;k++){
    var d=outDur(S.clips[k]);
    if(t<acc+d){selectClip(k);log('pin at '+t.toFixed(1)+'s → clip #'+(k+1)+' ('+(M[S.clips[k].src]?M[S.clips[k].src].name.slice(0,14):'?')+')',true);return}
    acc+=d;
  }
  log('pin is past the end ('+acc.toFixed(1)+'s total)');
}
function renderPins(){
  var list=$('e0pinList');if(!list)return;list.innerHTML='';
  if(!E.pins.length){list.innerHTML='<div class="note">no pins yet — select a clip (or type a time) and drop a note</div>';return}
  E.pins.forEach(function(p,i){
    var r=document.createElement('div');r.className='mitem';r.style.cssText='display:flex;gap:4px;align-items:center;margin-bottom:5px;padding:4px;border:1px solid #2a3c63;border-radius:6px;flex-wrap:wrap';
    var nm=document.createElement('div');nm.style.flex='1 1 60%';nm.style.cursor='pointer';
    nm.textContent=(p.done?'✓ ':'')+p.t.toFixed(1)+'s — '+p.note;
    nm.onclick=function(){jumpPin(i)};
    var dn=document.createElement('button');dn.className='ghost small';dn.style.flex='0 0 18%';dn.textContent=p.done?'UNDONE':'DONE';
    dn.onclick=function(){p.done=!p.done;saveE();renderPins()};
    var dl=document.createElement('button');dl.className='ghost small';dl.style.flex='0 0 18%';dl.textContent='DEL';
    dl.onclick=function(){E.pins.splice(i,1);saveE();renderPins()};
    r.appendChild(nm);r.appendChild(dn);r.appendChild(dl);list.appendChild(r);
  });
}

// ---------- 5. review checklist ----------
var CHECKS=['hook in first 2 seconds','cuts on the beat','captions readable on a phone','no dead air over 1s','sound clean (no clipping)','loop feels seamless','safe zones respected','cover frame is strong'];
function toggleCheck(i){
  E.review[CHECKS[i]]=!E.review[CHECKS[i]];saveE();renderChecks();
  var n=CHECKS.filter(function(c){return E.review[c]}).length;
  log('checklist: '+n+' of '+CHECKS.length+' done'+(n===CHECKS.length?' — ready to post 🔥':''),true);
}
function renderChecks(){
  var box=$('e0checks');if(!box)return;box.innerHTML='';
  CHECKS.forEach(function(c,i){
    var r=document.createElement('label');r.style.cssText='display:flex;gap:6px;align-items:center;margin-bottom:4px;font-size:13px;cursor:pointer';
    var cb=document.createElement('input');cb.type='checkbox';cb.checked=!!E.review[c];
    cb.onchange=function(){toggleCheck(i)};
    var s=document.createElement('span');s.textContent=c;
    r.appendChild(cb);r.appendChild(s);box.appendChild(r);
  });
}

// ---------- 6. content calendar ----------
function addCal(){
  var title=($('e0calTitle').value||'').trim();
  if(!title){log('type the post title first');return}
  var d=($('e0calDate').value||'').trim();
  if(!d){log('pick the post date first');return}
  var tm=($('e0calTime').value||'18:00');
  E.cal.push({title:title.slice(0,40),date:d,time:tm,plat:$('e0calPlat').value||'tiktok'});
  E.cal.sort(function(a,b){return (a.date+a.time)<(b.date+b.time)?-1:1});
  $('e0calTitle').value='';saveE();renderCal();
  log('scheduled: "'+title.slice(0,24)+'" '+d+' '+tm+' ('+($('e0calPlat').value||'tiktok')+')',true);
}
function renderCal(){
  var list=$('e0calList');if(!list)return;list.innerHTML='';
  if(!E.cal.length){list.innerHTML='<div class="note">nothing scheduled yet</div>';return}
  E.cal.forEach(function(c,i){
    var r=document.createElement('div');r.className='mitem';r.style.cssText='display:flex;gap:6px;align-items:center;margin-bottom:4px;padding:4px;border:1px solid #2a3c63;border-radius:6px';
    var nm=document.createElement('div');nm.style.flex='1';nm.textContent=c.date+' '+c.time+' ['+c.plat+'] '+c.title;
    var dl=document.createElement('button');dl.className='ghost small';dl.style.flex='0 0 16%';dl.textContent='DEL';
    dl.onclick=function(){E.cal.splice(i,1);saveE();renderCal()};
    r.appendChild(nm);r.appendChild(dl);list.appendChild(r);
  });
}
function calCsv(){
  if(!E.cal.length){log('nothing scheduled to export');return}
  var rows=['title,date,time,platform'];
  E.cal.forEach(function(c){rows.push('"'+c.title+'",'+c.date+','+c.time+','+c.plat)});
  var blob=new Blob([rows.join('\n')],{type:'text/csv'});
  var a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download='tiktok2-content-calendar-'+new Date().toISOString().slice(0,10)+'.csv';
  document.body.appendChild(a);a.click();a.remove();
  log('content calendar exported ('+E.cal.length+' posts)',true);
}

// ---------- 7. series planner ----------
function addSeries(){
  var t=($('e0serTitle').value||'').trim();
  if(!t){log('type the series name first');return}
  var n=parseInt($('e0serParts').value)||3;
  E.series.push({id:uid(),title:t.slice(0,30),parts:clamp(n,1,20),done:0});
  $('e0serTitle').value='';saveE();renderSeries();
  log('series added: "'+t.slice(0,20)+'" — 0/'+n+' parts posted',true);
}
function bumpSeries(i){
  var s=E.series[i];
  if(s.done<s.parts)s.done++;
  if(s.done>=s.parts)log('series complete: "'+s.title+'" — all '+s.parts+' parts posted 🎉',true);
  saveE();renderSeries();
}
function renderSeries(){
  var list=$('e0serList');if(!list)return;list.innerHTML='';
  if(!E.series.length){list.innerHTML='<div class="note">no series tracked yet</div>';return}
  E.series.forEach(function(s,i){
    var r=document.createElement('div');r.className='mitem';r.style.cssText='display:flex;gap:6px;align-items:center;margin-bottom:4px;padding:4px;border:1px solid #2a3c63;border-radius:6px';
    var nm=document.createElement('div');nm.style.flex='1';nm.textContent=s.title+' — '+s.done+'/'+s.parts+' posted'+(s.done>=s.parts?' ✅':'');
    var b=document.createElement('button');b.className='ghost small';b.style.flex='0 0 22%';b.textContent='PART POSTED';
    b.onclick=function(){bumpSeries(i)};
    var dl=document.createElement('button');dl.className='ghost small';dl.style.flex='0 0 16%';dl.textContent='DEL';
    dl.onclick=function(){E.series.splice(i,1);saveE();renderSeries()};
    r.appendChild(nm);r.appendChild(b);r.appendChild(dl);list.appendChild(r);
  });
}

// ---------- 8. platform presets ----------
var PLATS={
  tiktok:{name:'TikTok',ratio:'9:16',sweet:'21–34s',safe:'safe zones: 68px top / 130px bottom (UI overlap)'},
  reels:{name:'Instagram Reels',ratio:'9:16',sweet:'7–15s',safe:'safe zones: bottom 320px (caption + buttons)'},
  shorts:{name:'YouTube Shorts',ratio:'9:16',sweet:'25–40s',safe:'safe zones: bottom 110px (title bar)'}
};
function applyPlat(){
  var k=$('e0platSel').value;E.plat=k;saveE();
  var p=PLATS[k],len=td();
  var over=len>parseSweet(p.sweet);
  log(p.name+' preset on: '+p.ratio+' — sweet spot '+p.sweet+' — '+p.safe+' — your edit is '+len.toFixed(1)+'s ('+(over?'a bit over — consider a trim':'inside the sweet spot')+')',true);
}
function parseSweet(s){var m=s.match(/(\d+)\D+\d+$/);return m?parseInt(m[1])+5:60}

// ---------- 9. preset pack export/import ----------
function packExport(){
  var pack={v:1,when:Date.now(),custyles:lsGet('tk2custyles',{}),templates:lsGet('tk2templates',{}),brand:E.brand,plat:E.plat,pins:E.pins,review:E.review,cal:E.cal,series:E.series};
  var s=JSON.stringify(pack);
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(s).then(function(){log('preset pack copied to clipboard ('+Math.round(s.length/1024)+' KB) — paste it on any device and tap PACK IMPORT',true)},function(){log('copy failed')});
  }else log('clipboard unavailable on this browser');
}
function packImport(){
  var raw=($('e0packIn').value||'').trim();
  if(!raw){log('paste a preset pack first');return}
  try{
    var p=JSON.parse(raw);
    if(!p||!p.v)throw new Error('not a preset pack');
    if(Object.keys(p.custyles||{}).length)localStorage.setItem('tk2custyles',JSON.stringify(p.custyles));
    if(Object.keys(p.templates||{}).length)localStorage.setItem('tk2templates',JSON.stringify(p.templates));
    if(p.brand)E.brand=p.brand;
    if(p.plat)E.plat=p.plat;
    if(p.pins)E.pins=p.pins;
    if(p.review)E.review=p.review;
    if(p.cal)E.cal=p.cal;
    if(p.series)E.series=p.series;
    $('e0packIn').value='';saveE();renderPins();renderChecks();renderCal();renderSeries();
    log('preset pack loaded: styles, templates, brand, calendar and settings restored',true);
  }catch(e){log('pack import failed: '+e.message)}
}

// ---------- 10. clip stash ----------
function stashAdd(){
  var i=S.clips.findIndex(function(x){return x.id===S.selected});
  if(i<0){log('select a clip to stash');return}
  var c=S.clips[i];
  E.stash.push({src:c.src,name:(M[c.src]?M[c.src].name:'clip').slice(0,20),start:c.start,end:c.end,speed:c.speed||1});
  saveE();renderStash();
  log('stashed: '+(M[c.src]?M[c.src].name.slice(0,16):'clip')+' '+c.start.toFixed(1)+'–'+c.end.toFixed(1)+'s @'+(c.speed||1)+'x ('+E.stash.length+' stashed)',true);
}
function stashBack(i){
  var s=E.stash[i];
  if(!M[s.src]){log('that footage file is not on this device — upload it first');return}
  var nc={id:uid(),src:s.src,start:s.start,end:s.end,speed:s.speed};
  S.clips.push(nc);drawTimeline();saveE();
  log('stashed clip re-added to the end of the timeline (#'+S.clips.length+')',true);
}
function renderStash(){
  var list=$('e0stashList');if(!list)return;list.innerHTML='';
  if(!E.stash.length){list.innerHTML='<div class="note">stash is empty — select a clip and STASH it</div>';return}
  E.stash.forEach(function(s,i){
    var r=document.createElement('div');r.className='mitem';r.style.cssText='display:flex;gap:6px;align-items:center;margin-bottom:4px;padding:4px;border:1px solid #2a3c63;border-radius:6px';
    var nm=document.createElement('div');nm.style.flex='1';nm.textContent=s.name+' '+s.start.toFixed(1)+'–'+s.end.toFixed(1)+'s @'+s.speed+'x';
    var b=document.createElement('button');b.className='ghost small';b.style.flex='0 0 24%';b.textContent='RE-ADD';
    b.onclick=function(){stashBack(i)};
    var dl=document.createElement('button');dl.className='ghost small';dl.style.flex='0 0 16%';dl.textContent='DEL';
    dl.onclick=function(){E.stash.splice(i,1);saveE();renderStash()};
    r.appendChild(nm);r.appendChild(b);r.appendChild(dl);list.appendChild(r);
  });
}

// ---------- mount ----------
function mount(){
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='Creator Ecosystem (Phase 10)';card.appendChild(h);

  var srow=document.createElement('div');srow.className='row';
  srow.appendChild(mkBtn('SHARE LINK',makeShare,'0 0 40%','e0share'));
  srow.appendChild(mkInp('e0shareIn','paste a share link here','1 1 auto'));
  srow.appendChild(mkBtn('IMPORT',importShare,'0 0 20%','e0imp'));
  card.appendChild(srow);
  var sbox=document.createElement('input');sbox.id='e0shareBox';sbox.className='inp';sbox.readOnly=true;sbox.placeholder='the generated share link lands here';sbox.style.marginTop='6px';card.appendChild(sbox);

  var brow=document.createElement('div');brow.className='row';brow.style.marginTop='8px';
  brow.appendChild(mkInp('e0logo','brand text for the watermark','1 1 auto'));
  var col=document.createElement('input');col.id='e0color';col.type='color';col.value=E.brand.color||'#00e5ff';col.className='inp';col.style.flex='0 0 12%';brow.appendChild(col);
  brow.appendChild(mkBtn('SAVE KIT',saveBrand,'0 0 24%','e0kit'));
  brow.appendChild(mkBtn('WATERMARK '+(E.brand.on?'ON':'OFF'),wmToggle,'0 0 24%','e0wm'));
  card.appendChild(brow);

  var prow=document.createElement('div');prow.className='row';prow.style.marginTop='8px';
  prow.appendChild(mkInp('e0pinAt','pin time s (blank = selected clip)','0 0 30%'));
  prow.appendChild(mkInp('e0pinNote','pin note e.g. tighten this cut','1 1 auto'));
  prow.appendChild(mkBtn('PIN',addPin,'0 0 16%','e0pin'));
  card.appendChild(prow);
  var plist=document.createElement('div');plist.id='e0pinList';plist.style.marginTop='6px';card.appendChild(plist);

  var cbox=document.createElement('div');cbox.id='e0checks';cbox.style.marginTop='10px';card.appendChild(cbox);

  var crow=document.createElement('div');crow.className='row';crow.style.marginTop='10px';
  crow.appendChild(mkInp('e0calTitle','post title','1 1 auto'));
  var cd=document.createElement('input');cd.id='e0calDate';cd.type='date';cd.className='inp';cd.style.flex='0 0 22%';crow.appendChild(cd);
  var ct=document.createElement('input');ct.id='e0calTime';ct.type='time';ct.value='18:00';ct.className='inp';ct.style.flex='0 0 18%';crow.appendChild(ct);
  card.appendChild(crow);
  var crow2=document.createElement('div');crow2.className='row';crow2.style.marginTop='6px';
  crow2.appendChild(mkSel('e0calPlat',['tiktok','reels','shorts']));
  crow2.appendChild(mkBtn('SCHEDULE',addCal,'0 0 30%','e0calAdd'));
  crow2.appendChild(mkBtn('EXPORT CSV',calCsv,'0 0 26%','e0calCsv'));
  card.appendChild(crow2);
  var clist=document.createElement('div');clist.id='e0calList';clist.style.marginTop='6px';card.appendChild(clist);

  var serow=document.createElement('div');serow.className='row';serow.style.marginTop='10px';
  serow.appendChild(mkInp('e0serTitle','series name e.g. PART 2 saga','1 1 auto'));
  var sn=document.createElement('input');sn.id='e0serParts';sn.type='number';sn.min='1';sn.max='20';sn.value='3';sn.className='inp';sn.style.flex='0 0 14%';serow.appendChild(sn);
  serow.appendChild(mkBtn('ADD SERIES',addSeries,'0 0 28%','e0serAdd'));
  card.appendChild(serow);
  var slist=document.createElement('div');slist.id='e0serList';slist.style.marginTop='6px';card.appendChild(slist);

  var prow2=document.createElement('div');prow2.className='row';prow2.style.marginTop='10px';
  prow2.appendChild(mkSel('e0platSel',['tiktok','reels','shorts']));
  prow2.appendChild(mkBtn('APPLY PLATFORM',applyPlat,'0 0 40%','e0plat'));
  card.appendChild(prow2);

  var pkrow=document.createElement('div');pkrow.className='row';pkrow.style.marginTop='8px';
  pkrow.appendChild(mkBtn('PACK EXPORT',packExport,'0 0 34%','e0pkExp'));
  pkrow.appendChild(mkInp('e0packIn','paste a preset pack (JSON)','1 1 auto'));
  pkrow.appendChild(mkBtn('PACK IMPORT',packImport,'0 0 24%','e0pkImp'));
  card.appendChild(pkrow);

  var strow=document.createElement('div');strow.className='row';strow.style.marginTop='10px';
  strow.appendChild(mkBtn('STASH SELECTED CLIP',stashAdd,'0 0 44%','e0stash'));
  card.appendChild(strow);
  var stlist=document.createElement('div');stlist.id='e0stashList';stlist.style.marginTop='6px';card.appendChild(stlist);

  var note=document.createElement('div');note.className='note';
  note.textContent='ecosystem: share your whole edit plan as one link, brand watermark burns into preview and export, pins + checklist keep quality up, calendar and series track posting, stash keeps favorite cuts for later. everything saves with the project.';
  card.appendChild(note);

  var placed=false;
  var hs=document.querySelectorAll('.card h2');
  for(var i=0;i<hs.length;i++){
    if(/motion lab/i.test(hs[i].textContent||'')){
      var anchor=hs[i].parentElement;
      if(anchor.nextSibling)anchor.parentElement.insertBefore(card,anchor.nextSibling);
      else anchor.parentElement.appendChild(card);
      placed=true;break;
    }
  }
  if(!placed){var ps=document.getElementById('page-studio');if(ps)ps.appendChild(card)}
  renderPins();renderChecks();renderCal();renderSeries();renderStash();
  log('creator ecosystem live',true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);
else mount();
})();
