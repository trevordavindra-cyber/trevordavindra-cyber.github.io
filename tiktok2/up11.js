// up11.js — PHASE 5 RELIABILITY PACK (Nov 23 2026)
// relay guard (timeouts + rate-limit retry), crash guard, error watchdog,
// auto checkpoints + restore, stability report, full backup .json export/import
(function(){
function $(id){return document.getElementById(id)}
function lsGet(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function wait(ms){return new Promise(function(r){setTimeout(r,ms)})}
function timeStr(t){try{return new Date(t).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})}catch(e){return ''}}
function mkBtn(txt,fn,flex,id){var b=document.createElement('button');b.className='ghost small';b.textContent=txt;b.style.flex=flex||'0 0 30%';if(id)b.id=id;b.onclick=fn;return b}
function mkRow(btns){var r=document.createElement('div');r.className='btnrow';btns.forEach(function(b){r.appendChild(b)});return r}
function mkSel(id){var s=document.createElement('select');s.id=id;s.className='inp';s.style.marginTop='6px';return s}
// ---------- R1 relay guard: timeouts + one 45s retry on rate limits ----------
if(!window.__tk2relay){
  window.__tk2relay=true;
  var of=window.fetch.bind(window);
  window.fetch=function(input,opts){
    var url=(typeof input==='string')?input:((input&&input.url)||'');
    var host=null;
    if(url.indexOf('text.pollinations.ai')>-1)host='text';
    else if(url.indexOf('image.pollinations.ai')>-1)host='image';
    else if(url.indexOf('api.streamelements.com')>-1)host='tts';
    if(!host)return of(input,opts);
    var ms=host==='text'?25000:(host==='image'?30000:20000);
    var retried=false;
    function attempt(){
      var loser=wait(ms).then(function(){return{__timeout:true}});
      return Promise.race([of(input,opts),loser]).then(function(r){
        if(r&&r.__timeout)throw new Error('relay timeout after '+Math.round(ms/1000)+'s');
        if((r.status===402||r.status===429)&&!retried){
          retried=true;log('relay rate limited — waiting 45s and retrying once',true);
          return wait(45000).then(attempt);
        }
        return r;
      });
    }
    return attempt();
  };
}
// ---------- R2 crash guard ----------
var T0=Date.now();
var lastend='first session';
(function(){
  var seen=lsGet('tk2seen',false);
  var clean=false;
  try{clean=localStorage.getItem('tk2clean')==='1'}catch(e){}
  if(seen)lastend=clean?'clean':'possible crash';
  if(seen&&!clean)log('heads up: the last session may have crashed — your project was restored from the last autosave',true);
  lsSet('tk2seen',true);
  try{localStorage.removeItem('tk2clean')}catch(e){}
  function bye(){try{localStorage.setItem('tk2clean','1')}catch(e){}}
  window.addEventListener('pagehide',bye);
  window.addEventListener('beforeunload',bye);
})();
// ---------- R3 error watchdog ----------
(function(){
  var errs=lsGet('tk2errs',[]);var n=lsGet('tk2errn',0);
  function grab(msg){
    n++;errs.unshift({m:String(msg).slice(0,200),at:Date.now()});errs=errs.slice(0,10);
    lsSet('tk2errs',errs);lsSet('tk2errn',n);
  }
  window.addEventListener('error',function(e){grab((e&&e.message)||'unknown error')});
  window.addEventListener('unhandledrejection',function(e){grab((e&&e.reason&&(e.reason.message||e.reason))||'unhandled promise rejection')});
})();
// ---------- R4 checkpoints (auto every 5 min, 6 kept) ----------
function ckpts(){return lsGet('tk2ckpt',[])}
function fillCk(){
  var s=$('rlCkSel');if(!s)return;
  var a=ckpts();s.innerHTML='';
  if(!a.length){var o=document.createElement('option');o.textContent='no checkpoints yet';o.value='';s.appendChild(o);return}
  a.forEach(function(c){
    var o=document.createElement('option');o.value=String(c.at);
    o.textContent=timeStr(c.at)+' · '+(c.n||'?')+' clips';s.appendChild(o);
  });
}
function snapData(){
  var meta={};Object.values(M).forEach(function(m){meta[m.id]={id:m.id,name:m.name,kind:m.kind,dur:m.dur}});
  var d=Object.assign({},S,{media:meta,variations:[]});d.selected=null;return d;
}
function ckpt(quiet){
  if(!S||!S.clips||!S.clips.length){if(!quiet)log('nothing to checkpoint — the timeline is empty');return}
  try{
    var a=ckpts();a.unshift({d:snapData(),at:Date.now(),n:S.clips.length});a=a.slice(0,6);
    lsSet('tk2ckpt',a);fillCk();
    log((quiet?'auto checkpoint':'checkpoint')+' saved: '+S.clips.length+' clips ('+timeStr(Date.now())+')',!quiet);
  }catch(e){log('checkpoint failed: '+e.message)}
}
function restoreCk(){
  var s=$('rlCkSel');var k=s?s.value:'';
  if(!k){log('no checkpoint selected');return}
  var c=ckpts().filter(function(x){return String(x.at)===k})[0];
  if(!c){log('checkpoint not found');return}
  try{localStorage.setItem('tk2proj',JSON.stringify(c.d));restore();log('checkpoint restored ('+timeStr(c.at)+') — check the timeline',true)}
  catch(e){log('restore failed: '+e.message)}
}
setInterval(function(){try{ckpt(true)}catch(e){}},300000);
// ---------- R5 stability report ----------
function report(){
  var up=Math.floor((Date.now()-T0)/1000);
  log('stability report — uptime '+Math.floor(up/60)+'m '+(up%60)+'s · online: '+(navigator.onLine?'yes':'no'),true);
  var errs=lsGet('tk2errs',[]);var n=lsGet('tk2errn',0);
  log('errors caught: '+n+(errs.length?' · last: '+errs[0].m:' · none'));
  log('last shutdown: '+lastend+' · checkpoints: '+ckpts().length+' of 6');
  var bytes=0;
  try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf('tk2')===0)bytes+=(localStorage.getItem(k)||'').length}}catch(e){}
  log('project settings: '+(Math.round(bytes/1024*10)/10)+' KB stored locally');
  if(navigator.storage&&navigator.storage.estimate){navigator.storage.estimate().then(function(e){
    if(e&&e.quota)log('device storage: '+(Math.round(e.usage/1048576*10)/10)+' MB used of '+(Math.round(e.quota/1073741824*10)/10)+' GB quota');
  }).catch(function(){})}
}
// ---------- R6 backup .json (export/import) ----------
function backupDl(){
  try{
    var p=null;try{p=JSON.parse(localStorage.getItem('tk2proj'))}catch(e){}
    var out={v:1,when:Date.now(),proj:p,checkpoints:ckpts(),drafts:lsGet('tk2drafts',{}),templates:lsGet('tk2templates',{}),media:Object.keys(M).map(function(k){return {id:k,name:M[k].name,kind:M[k].kind,dur:M[k].dur}})};
    var blob=new Blob([JSON.stringify(out)],{type:'application/json'});
    var a=document.createElement('a');a.href=URL.createObjectURL(blob);
    a.download='tiktok2-backup-'+new Date().toISOString().slice(0,10)+'.json';
    document.body.appendChild(a);a.click();a.remove();
    log('backup downloaded (project, checkpoints, drafts, templates — footage files stay on this device)',true);
  }catch(e){log('backup failed: '+e.message)}
}
function backupRestore(file){
  var fr=new FileReader();
  fr.onload=function(){
    try{
      var d=JSON.parse(fr.result);
      if(!d||(!d.proj&&!d.checkpoints))throw new Error('not a tiktok2 backup file');
      if(d.proj)localStorage.setItem('tk2proj',JSON.stringify(d.proj));
      if(d.drafts)lsSet('tk2drafts',d.drafts);
      if(d.templates)lsSet('tk2templates',d.templates);
      restore();
      log('backup loaded: project'+(d.drafts?' + drafts':'')+(d.templates?' + templates':'')+' restored',true);
    }catch(e){log('backup load failed: '+e.message)}
  };
  fr.readAsText(file);
}
// ---------- UI ----------
function build(){
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='Reliability';card.appendChild(h);
  card.appendChild(mkRow([mkBtn('CHECKPOINT NOW',function(){ckpt(false)},'0 0 48%','rlCkN'),mkBtn('STABILITY REPORT',report,'0 0 48%','rlRep')]));
  card.appendChild(mkSel('rlCkSel'));
  card.appendChild(mkRow([mkBtn('RESTORE CHECKPOINT',restoreCk,'0 0 48%','rlCkR'),mkBtn('DELETE CHECKPOINT',function(){
    var s=$('rlCkSel');var k=s?s.value:'';if(!k){log('no checkpoint selected');return}
    var a=ckpts().filter(function(x){return String(x.at)!==k});lsSet('tk2ckpt',a);fillCk();log('checkpoint deleted');
  },'0 0 48%','rlCkD')]));
  var fi=document.createElement('input');fi.type='file';fi.id='rlBkU';fi.accept='.json,application/json';fi.style.display='none';
  fi.onchange=function(){if(this.files&&this.files[0])backupRestore(this.files[0])};
  card.appendChild(fi);
  card.appendChild(mkRow([mkBtn('BACKUP .JSON',backupDl,'0 0 48%','rlBkD'),mkBtn('RESTORE BACKUP',function(){fi.click()},'0 0 48%','rlBkR')]));
  var note=document.createElement('div');note.className='note';note.textContent='auto-checkpoints every 5 minutes (6 kept). backup keeps your edit plan, drafts and templates; footage files stay on the device they were uploaded to.';
  card.appendChild(note);
  var card0=null;
  var hs=document.querySelectorAll('.card h2');
  for(var i=0;i<hs.length;i++){if(hs[i].textContent==='Ecosystem'){card0=hs[i].parentElement;break}}
  if(card0&&card0.parentElement){
    if(card0.nextSibling)card0.parentElement.insertBefore(card,card0.nextSibling);
    else card0.parentElement.appendChild(card);
  }else{
    var ps=$('page-studio');if(ps)ps.appendChild(card);
  }
  fillCk();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
log('reliability pack live',true);
})();
