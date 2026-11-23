'use strict';
// PHASE 5-8 part 3: cover variants, version control + compare, profiles, presets, templates, share, assets, 5 versions
function hist(){try{return JSON.parse(localStorage.getItem('tk2hist')||'[]')}catch(e){return []}}
// ---------- cover variants ----------
async function coverVariants(){
  if(!S.clips.length){log('timeline is empty');return}
  var c=S.clips[0],m=M[c.src];if(!m)return;
  var el=document.createElement('video');el.src=m.url;el.muted=true;el.playsInline=true;
  await new Promise(function(r){el.onloadeddata=r;setTimeout(r,3000)});
  var st=STYLES[S.style],title=$('covTitle').value.trim();
  var out=$('covVar');out.innerHTML='';
  var fr=[0.08,0.5,0.92];
  for(var i=0;i<3;i++){
    await seekTo(el,c.start+(c.end-c.start)*fr[i],4000);
    var cv=document.createElement('canvas');cv.width=720;cv.height=1280;
    var ctx=cv.getContext('2d');
    ctx.filter=st.grade;drawCover(ctx,el,720,1280,1.06,0,0);ctx.filter='none';
    var vg=ctx.createRadialGradient(360,640,300,360,640,980);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.55)');ctx.fillStyle=vg;ctx.fillRect(0,0,720,1280);
    if(i===1&&title){ctx.font='900 84px Arial, sans-serif';ctx.textAlign='center';ctx.lineJoin='round';ctx.lineWidth=14;ctx.strokeStyle='#000';ctx.strokeText(title.toUpperCase(),360,640);ctx.fillStyle='#fff';ctx.fillText(title.toUpperCase(),360,640)}
    var b=await new Promise(function(res){cv.toBlob(res,'image/png')});
    var a=document.createElement('a');a.className='dl';a.href=URL.createObjectURL(b);a.download='cover-'+(i+1)+'.png';
    a.textContent='COVER '+(i+1)+(i===1&&title?' (titled)':' (clean)');
    out.appendChild(a);
  }
  log('3 cover variants ready',true);
}
// ---------- version control + compare ----------
var CMP=null;
function applySide(){
  if(!CMP)return;
  var useB=CMP.side==='b';
  S.clips=JSON.parse(JSON.stringify(useB?CMP.b:CMP.a));
  S.captions=JSON.parse(JSON.stringify(useB?CMP.capB:CMP.capA));
  drawTimeline();save();
  $('cmpState').textContent='showing '+(useB?'version B':'your current edit')+' — tap switch to flip';
}
function cmpStart(idx){
  var h=hist();
  if(!h[idx]||!(h[idx].clips||[]).length){log('that version has no clips');return}
  CMP={a:JSON.parse(JSON.stringify(S.clips)),b:JSON.parse(JSON.stringify(h[idx].clips)),capA:JSON.parse(JSON.stringify(S.captions||[])),capB:JSON.parse(JSON.stringify(h[idx].captions||[])),side:'b'};
  log('compare mode: version B loaded — flip with the switch button',true);
  applySide();
}
function versionInit(){
  var old=$('histList');
  if(old&&old.parentElement){var oc=old.closest('.card');if(oc)oc.remove()}
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='Version control + compare';card.appendChild(h);
  var row=document.createElement('div');row.className='row';
  var inp=document.createElement('input');inp.id='verName';inp.placeholder='version name (optional)';
  var sb=document.createElement('button');sb.className='ghost small';sb.style.flex='0 0 34%';sb.textContent='SAVE VERSION';
  sb.onclick=function(){
    if(!S.clips.length){log('nothing to save');return}
    var nm=$('verName').value.trim()||('version '+(hist().length+1));
    pushHistory(nm);$('verName').value='';log('version saved: '+nm,true);
  };
  row.appendChild(inp);row.appendChild(sb);card.appendChild(row);
  var list=document.createElement('div');list.id='verList';card.appendChild(list);
  var cnote=document.createElement('div');cnote.className='kv';cnote.innerHTML='<span id="cmpState">compare: pick a version below to A/B it against your current edit</span>';card.appendChild(cnote);
  var crow=document.createElement('div');crow.className='btnrow';
  var sw=document.createElement('button');sw.className='ghost small';sw.textContent='SWITCH A/B';
  sw.onclick=function(){if(!CMP){log('start a compare by tapping COMPARE on a version');return}CMP.side=CMP.side==='a'?'b':'a';applySide()};
  var keep=document.createElement('button');keep.className='ghost small';keep.textContent='KEEP THIS SIDE';
  keep.onclick=function(){if(!CMP){log('nothing to keep');return}CMP=null;$('cmpState').textContent='kept — compare off';log('kept the shown side as your edit',true)};
  crow.appendChild(sw);crow.appendChild(keep);card.appendChild(crow);
  $('page-export').appendChild(card);
  renderVersions();
}
function renderVersions(){
  var el=$('verList');if(!el)return;
  var h=hist();
  if(!h.length){el.innerHTML='<div class="note">no versions yet — save one</div>';return}
  el.innerHTML='';
  h.forEach(function(x,i){
    var d=document.createElement('div');d.className='mitem';
    var dt=new Date(x.t);
    d.innerHTML='<span class="nm">'+esc(x.label)+'</span><span class="meta">'+((x.clips||[]).length)+' clips · '+dt.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})+'</span>';
    var b1=document.createElement('button');b1.className='ghost small';b1.textContent='RESTORE';
    b1.onclick=function(){
      S.clips=JSON.parse(JSON.stringify(x.clips||[]));
      S.captions=JSON.parse(JSON.stringify(x.captions||[]));
      S.musicId=x.musicId;S.style=x.style;S.capStyle=x.capStyle||'bold';
      drawTimeline();syncStyleChips();save();log('restored: '+x.label,true);
    };
    var b2=document.createElement('button');b2.className='ghost small';b2.textContent='A/B';
    b2.onclick=function(){cmpStart(i)};
    d.appendChild(b1);d.appendChild(b2);el.appendChild(d);
  });
}
// ---------- creator profiles ----------
function profiles(){try{return JSON.parse(localStorage.getItem('tk2profiles')||'{}')}catch(e){return{}}}
function profileInit(){
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='Creator profiles';card.appendChild(h);
  var row=document.createElement('div');row.className='row';
  var sel=document.createElement('select');sel.id='profSel';
  var inp=document.createElement('input');inp.id='profName';inp.placeholder='new profile name';
  var sv=document.createElement('button');sv.className='ghost small';sv.style.flex='0 0 30%';sv.textContent='SAVE';
  sv.onclick=function(){
    var nm=$('profName').value.trim();if(!nm){log('name the profile');return}
    var p=profiles();
    p[nm]={style:S.style,capStyle:S.capStyle,pace:PREFS.pace||1,sd:SD,styleCounts:PREFS.styleCounts||{}};
    localStorage.setItem('tk2profiles',JSON.stringify(p));$('profName').value='';fillProf();log('profile saved: '+nm,true);
  };
  row.appendChild(sel);row.appendChild(inp);row.appendChild(sv);card.appendChild(row);
  var row2=document.createElement('div');row2.className='btnrow';
  var ap=document.createElement('button');ap.className='ghost small';ap.textContent='LOAD PROFILE';
  ap.onclick=function(){
    var nm=$('profSel').value;var p=profiles();
    if(!p[nm]){log('save it first');return}
    S.style=p[nm].style;S.capStyle=p[nm].capStyle||'bold';
    PREFS.pace=p[nm].pace||1;PREFS.styleCounts=p[nm].styleCounts||{};savePrefs();
    Object.assign(SD,p[nm].sd||{});sdSave();
    syncStyleChips();save();log('profile loaded: '+nm,true);
  };
  var del=document.createElement('button');del.className='ghost small';del.textContent='DELETE PROFILE';
  del.onclick=function(){var nm=$('profSel').value;var p=profiles();delete p[nm];localStorage.setItem('tk2profiles',JSON.stringify(p));fillProf();log('profile deleted')};
  row2.appendChild(ap);row2.appendChild(del);card.appendChild(row2);
  $('page-export').appendChild(card);
  fillProf();
}
function fillProf(){
  var sel=$('profSel');if(!sel)return;
  var p=profiles();sel.innerHTML='';
  Object.keys(p).forEach(function(k){var o=document.createElement('option');o.value=k;o.textContent=k;sel.appendChild(o)});
  if(!Object.keys(p).length)sel.innerHTML='<option>no profiles yet</option>';
}
// ---------- preset studio ----------
function presets(){try{return JSON.parse(localStorage.getItem('tk2presets')||'{}')}catch(e){return{}}}
function presetInit(){
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='Custom preset studio';card.appendChild(h);
  var row=document.createElement('div');row.className='row';
  var inp=document.createElement('input');inp.id='presName';inp.placeholder='preset name';
  var sv=document.createElement('button');sv.className='ghost small';sv.style.flex='0 0 30%';sv.textContent='SAVE PRESET';
  sv.onclick=function(){
    var nm=$('presName').value.trim();if(!nm){log('name the preset');return}
    var p=presets();
    p[nm]={style:S.style,capStyle:S.capStyle,trans:[],sd:Object.assign({},SD),pace:PREFS.pace||1};
    localStorage.setItem('tk2presets',JSON.stringify(p));$('presName').value='';fillPres();log('preset saved: '+nm,true);
  };
  row.appendChild(inp);row.appendChild(sv);card.appendChild(row);
  var row2=document.createElement('div');row2.className='btnrow';
  var ap=document.createElement('button');ap.className='ghost small';ap.textContent='APPLY PRESET';
  ap.onclick=function(){
    var p=presets(),ps=p[$('presSel').value];
    if(!ps){log('save a preset first');return}
    S.style=ps.style;S.capStyle=ps.capStyle||'bold';PREFS.pace=ps.pace||1;Object.assign(SD,ps.sd||{});sdSave();
    syncStyleChips();save();log('preset applied: '+$('presSel').value,true);
  };
  var del=document.createElement('button');del.className='ghost small';del.textContent='DELETE';
  del.onclick=function(){var p=presets();delete p[$('presSel').value];localStorage.setItem('tk2presets',JSON.stringify(p));fillPres();log('preset deleted')};
  row2.appendChild(ap);row2.appendChild(del);card.appendChild(row2);
  $('page-export').appendChild(card);
  fillPres();
}
function fillPres(){
  var sel=$('presSel');if(!sel)return;
  var p=presets();sel.innerHTML='';
  Object.keys(p).forEach(function(k){var o=document.createElement('option');o.value=k;o.textContent=k;sel.appendChild(o)});
  if(!Object.keys(p).length)sel.innerHTML='<option>no presets yet</option>';
}
// ---------- template gallery ----------
var TEMPLATES=[
 {name:'HOOK DROP',desc:'fastest cuts on the drop, hook scene first',fn:function(){S.style='football';var p=buildPlan(1.7,'HOOK DROP');if(p.clips.length){p.clips[0].fadeIn=1}applyPlan(p)}},
 {name:'PHONK RAMP',desc:'velocity ramps on every third cut',fn:function(){S.style='velocity';var p=buildPlan(1.2,'PHONK RAMP');p.clips.forEach(function(c,i){if(i%3===0)c.ramp=1});applyPlan(p)}},
 {name:'CINEMATIC REEL',desc:'longer shots, fades, letterbox bars',fn:function(){S.style='cinematic';applyPlan(buildPlan(0.6,'CINEMATIC REEL'));S.clips.forEach(function(c){c.trans='fade'})}},
 {name:'STORYTIME',desc:'chronological order, caption-heavy',fn:function(){S.style='documentary';applyPlan(buildPlan(0.8,'STORYTIME'));S.clips.sort(function(a,b){return a.start-b.start});drawTimeline()}},
 {name:'MEME CUT',desc:'chaotic fast cuts, punch + shake',fn:function(){S.style='gaming';var p=buildPlan(2.1,'MEME CUT');p.clips.forEach(function(c,i){c.trans=i%2?'punch':'shake'});applyPlan(p)}}
];
function templateInit(){
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='Template gallery';card.appendChild(h);
  var chips=document.createElement('div');chips.className='chips';
  TEMPLATES.forEach(function(t){
    var d=document.createElement('div');d.className='chip';d.textContent=t.name;d.title=t.desc;
    d.onclick=function(){try{t.fn();$('playhint').style.display='none';save();log('template applied: '+t.name+' — '+t.desc,true)}catch(e){log('template: '+e.message)}};
    chips.appendChild(d);
  });
  card.appendChild(chips);
  var note=document.createElement('div');note.className='note';note.textContent='built-in edit formats — tap one and it rebuilds the timeline in that shape';
  card.appendChild(note);
  $('page-studio').appendChild(card);
}
// ---------- share (project file) ----------
function shareInit(){
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='Share project (file)';card.appendChild(h);
  var row=document.createElement('div');row.className='btnrow';
  var ex=document.createElement('button');ex.className='ghost small';ex.textContent='EXPORT PROJECT FILE';
  ex.onclick=function(){
    var data={v:2,name:S.name,style:S.style,capStyle:S.capStyle,musicId:S.musicId,clips:S.clips,captions:S.captions};
    var b=new Blob([JSON.stringify(data)],{type:'application/json'});
    var a=document.createElement('a');a.className='dl';a.href=URL.createObjectURL(b);a.download='tiktok-project.json';a.textContent='DOWNLOAD PROJECT FILE';
    $('shareOut').innerHTML='';$('shareOut').appendChild(a);
    log('project file exported — send it to a collaborator',true);
  };
  var im=document.createElement('input');im.type='file';im.accept='.json,application/json';im.style.marginTop='8px';
  im.onchange=async function(){
    if(!this.files[0])return;
    try{
      var d=JSON.parse(await this.files[0].text());
      if(!d.clips)throw new Error('not a project file');
      S.clips=d.clips;S.captions=d.captions||[];S.style=d.style||S.style;S.capStyle=d.capStyle||'bold';
      if(d.musicId&&M[d.musicId])S.musicId=d.musicId;
      drawTimeline();syncStyleChips();save();
      log('project file imported — the plan is in; media files stay on each device',true);
    }catch(e){log('import failed: '+e.message)}
    this.value='';
  };
  row.appendChild(ex);card.appendChild(row);card.appendChild(im);
  var out=document.createElement('div');out.id='shareOut';card.appendChild(out);
  var note=document.createElement('div');note.className='note';note.textContent='shares the edit plan, styles and captions. uploaded footage stays on the device it was uploaded to (privacy), so a collaborator adds their own copies of the same files.';
  card.appendChild(note);
  $('page-export').appendChild(card);
}
// ---------- asset manager ----------
function assetInit(){
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='Asset manager';card.appendChild(h);
  var inp=document.createElement('input');inp.id='assetQ';inp.placeholder='search media by name';
  inp.oninput=renderMediaList;
  card.appendChild(inp);
  var row=document.createElement('div');row.className='btnrow';
  var b1=document.createElement('button');b1.className='ghost small';b1.textContent='DELETE UNUSED MEDIA';
  b1.onclick=async function(){
    var used={};S.clips.forEach(function(c){used[c.src]=1});
    if(S.musicId)used[S.musicId]=1;
    var kill=Object.values(M).filter(function(m){return !used[m.id]});
    if(!kill.length){log('every asset is in use');return}
    for(var i=0;i<kill.length;i++){delete M[kill[i].id];await idbDel(kill[i].id)}
    renderMediaList();drawTimeline();save();log('deleted '+kill.length+' unused asset(s)',true);
  };
  var b2=document.createElement('button');b2.className='ghost small';b2.id='btnStore';b2.textContent='STORAGE USED';
  b2.onclick=async function(){
    try{var e=await navigator.storage.estimate();log('storage: '+(e.usage/1048576).toFixed(1)+' MB used of '+Math.round(e.quota/1048576)+' MB',true)}
    catch(e){log('storage estimate not available here')}
  };
  row.appendChild(b1);row.appendChild(b2);card.appendChild(row);
  $('page-library').appendChild(card);
}
// ---------- 5 versions ----------
function fiveVersions(){
  try{
    S.variations=[buildPlan(1.35,'FAST'),buildPlan(1,'STOCK'),buildPlan(0.65,'CINEMATIC'),buildPlan(0.8,'SLOWMO'),buildPlan(1.8,'PUNCHY')];
    applyPlan(S.variations[1]);
    log('5 versions built — batch render handles them all',true);
  }catch(e){log('versions: '+e.message)}
}
function fiveInit(){
  var row=document.createElement('div');row.className='btnrow';
  var b=document.createElement('button');b.className='ghost small';b.textContent='5 VERSIONS';b.onclick=fiveVersions;
  var c=document.createElement('button');c.className='ghost small';c.textContent='3 COVER VARIANTS';c.onclick=coverVariants;
  row.appendChild(b);row.appendChild(c);
  $('page-studio').appendChild(row);
  var out=document.createElement('div');out.id='covVar';out.style.marginTop='8px';
  $('page-studio').appendChild(out);
}
versionInit();profileInit();presetInit();templateInit();shareInit();assetInit();fiveInit();
renderVersions();
