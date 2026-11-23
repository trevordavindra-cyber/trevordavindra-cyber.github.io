'use strict';
// up26.js — PHASE 20 PROJECT LAB (Nov 23 2026)
// project stats, style report, length budget, auto-name clips, swap clips,
// pace strip, project variations, mark + jump back, edit-time timer, focus mode
(function(){
if(window.__tk2up26)return;window.__tk2up26=1;
function $(id){return document.getElementById(id)}
function mkBtn(t,fn,fl,id){var b=document.createElement('button');b.className='btn';b.textContent=t;b.style.flex=fl||'0 0 auto';if(id)b.id=id;b.onclick=fn;return b}
function mkRow(gap){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap=(gap||6)+'px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function saveE(){try{if(typeof save==='function')save()}catch(e){}}
function clipDur(c){return (c.end-c.start)/(c.speed||1)}
function totalDur(){return S.clips.reduce(function(a,c){return a+clipDur(c)},0)}
function redraw(){try{if(window.drawTimeline)window.drawTimeline()}catch(e){}}

if(!S.eco)S.eco={};var E=S.eco;
if(!E.f26)E.f26={vars:[],mark:null,day:null,mins:0,focus:false,hiddenCards:[]};

var SNAPKEYS=['clips','captions','style','capStyle','res','fps','musicId','musicGain','musicOffset'];
function snap(){var o={};SNAPKEYS.forEach(function(k){o[k]=JSON.parse(JSON.stringify(S[k]===undefined?null:S[k]))});return o}
function applySnap(o){SNAPKEYS.forEach(function(k){if(o[k]!==null&&o[k]!==undefined)S[k]=o[k]})}
function mediaList(){var m=S.media||S.assets||S.library; if(Array.isArray(m))return m; if(m&&typeof m==='object')return Object.keys(m); return []}

// 1) project stats
function stats(){
  var t=totalDur(),styles={};
  S.clips.forEach(function(c){var s=(c.style||S.style||'?');styles[s]=(styles[s]||0)+1});
  var ks=Object.keys(styles).sort(function(a,b){return styles[b]-styles[a]});
  log('project stats: '+S.clips.length+' clips, '+t.toFixed(1)+'s total, avg cut '+(t/Math.max(1,S.clips.length)).toFixed(1)+'s, '+S.captions.length+' captions, '+mediaList().length+' media items, top style '+(ks[0]||'none'),true);
}
// 2) style report
function styleReport(){
  var m={};S.clips.forEach(function(c){var s=(c.style||S.style||'?');if(!m[s])m[s]=0;m[s]++});
  var ks=Object.keys(m);
  if(!ks.length){log('no clips yet');return}
  ks.sort(function(a,b){return m[b]-m[a]});
  ks.forEach(function(k){log('style report: '+k+' x'+m[k]+' ('+Math.round(100*m[k]/S.clips.length)+'%)')});
  log('dominant style: '+ks[0],true);
}
// 3) length budget
function budget(){
  var v=parseFloat($('f26bud').value);
  if(!v||v<=0){log('type a target length in seconds first');return}
  var t=totalDur(),d=v-t,n=S.clips.length;
  log('length budget: now '+t.toFixed(1)+'s, target '+v+'s, gap '+(d>=0?'+':'')+d.toFixed(1)+'s',true);
  if(!n)return;
  var per=d/n,r=t/v;
  log('that is '+(per>=0?'+':'')+per.toFixed(1)+'s per clip — '+(d>=0?'add footage, or drop every speed to about '+r.toFixed(2)+'x':'trim, or raise every speed to about '+r.toFixed(2)+'x'));
  log('FIT TO LENGTH in Timeline Power Tools II applies that rescale in one click');
}
// 4) auto name
function autoname(){
  var pre=$('f26pre').value.trim(),n=0;
  S.clips.forEach(function(c,i){if(!c.label){c.label=(pre?pre+'-':'')+String(i+1).padStart(2,'0');n++}});
  saveE();redraw();log('named '+n+' empty label(s)'+(pre?' with prefix '+pre:''),true);
}
// 5) swap
function swap(){
  var a=parseInt($('f26a').value,10),b=parseInt($('f26b').value,10),n=S.clips.length;
  if(!a||!b||a<1||b<1||a>n||b>n||a===b){log('swap needs two different clip numbers 1-'+n);return}
  var t=S.clips[a-1];S.clips[a-1]=S.clips[b-1];S.clips[b-1]=t;
  saveE();redraw();log('swapped clip '+a+' with clip '+b,true);
}
// 6) pace strip
var stripEl=null;
function ensureStrip(){
  if(!stripEl){stripEl=document.createElement('canvas');stripEl.id='f26strip';
    stripEl.style.cssText='width:100%;height:26px;display:block;margin-top:6px;border-radius:6px;border:1px solid rgba(120,150,200,.25)'}
  return stripEl;
}
function paceStrip(){
  var el=ensureStrip(),ctx=el.getContext('2d');
  var W=el.width=el.clientWidth||600,H=el.height=26;
  ctx.clearRect(0,0,W,H);
  var t=totalDur(),PAL=['#2de2e6','#ff2d55','#ffc933','#00dc78','#a050ff','#7d8aa2'],x=0;
  S.clips.forEach(function(c,i){
    var w=t?W*clipDur(c)/t:0;
    ctx.globalAlpha=.85;ctx.fillStyle=PAL[i%PAL.length];ctx.fillRect(x,2,Math.max(2,w-2),H-4);ctx.globalAlpha=1;
    if(w>36){ctx.fillStyle='#0a0e1a';ctx.font='9px ui-monospace,monospace';ctx.fillText(clipDur(c).toFixed(1)+'s',x+4,H-9)}
    x+=w;
  });
  log('pace strip drawn: '+S.clips.length+' blocks, '+t.toFixed(1)+'s total',true);
}
// 7) variations
function varSave(){
  var name=$('f26vn').value.trim()||('var '+new Date().toLocaleTimeString());
  E.f26.vars.push({name:name,when:Date.now(),data:snap()});
  if(E.f26.vars.length>5)E.f26.vars.shift();
  saveE();refreshVarList();log('variation saved: '+name+' ('+E.f26.vars.length+' of 5 stored)',true);
}
function varLoad(){
  var i=parseInt($('f26vl').value,10);
  if(isNaN(i)||!E.f26.vars[i]){log('save a variation first, then pick one');return}
  var v=E.f26.vars[i];applySnap(v.data);saveE();redraw();
  log('variation loaded: '+v.name+' — '+S.clips.length+' clip(s) back; undo can step back if needed',true);
}
function refreshVarList(){var s=$('f26vl');if(!s)return;s.innerHTML='';E.f26.vars.forEach(function(v,i){var o=document.createElement('option');o.value=String(i);o.textContent=v.name;s.appendChild(o)})}
// 8) mark + jump back
function markSet(){E.f26.mark={when:Date.now(),data:snap()};saveE();log('mark saved at '+new Date().toLocaleTimeString(),true)}
function markGo(){if(!E.f26.mark){log('no mark yet — hit MARK first');return}applySnap(E.f26.mark.data);saveE();redraw();log('jumped back to the mark from '+new Date(E.f26.mark.when).toLocaleTimeString(),true)}
// 9) session timer
setInterval(function(){try{if(document.hidden)return;var d=new Date(),k=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();if(E.f26.day!==k){E.f26.day=k;E.f26.mins=0}E.f26.mins++}catch(e){}},60000);
function showTimer(){
  var d=new Date(),k=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
  if(E.f26.day!==k){E.f26.day=k;E.f26.mins=0}
  log('editing time today: '+E.f26.mins+' min (this browser)',true);
}
// 10) focus mode
function focusMode(){
  var cards=Array.prototype.slice.call(document.querySelectorAll('.card'));
  if(!E.f26.focus){
    var name=$('f26fo').value.trim()||'Project Lab',target=null;
    cards.forEach(function(c){var hh=c.querySelector('h2');if(hh&&hh.textContent.toLowerCase().indexOf(name.toLowerCase())>=0)target=c});
    if(!target){log('no card matching "'+name+'"');return}
    E.f26.hiddenCards=cards.filter(function(c){return c!==target});
    E.f26.hiddenCards.forEach(function(c){c.style.display='none'});
    E.f26.focus=true;log('focus mode on: only "'+name+'" showing ('+E.f26.hiddenCards.length+' cards hidden) — hit FOCUS MODE again to bring everything back',true);
  }else{
    (E.f26.hiddenCards||[]).forEach(function(c){c.style.display=''});
    E.f26.focus=false;log('focus mode off: all cards back',true);
  }
}

function mount(){
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='Project Lab (Phase 20)';card.appendChild(h);
  var r1=mkRow();r1.appendChild(mkBtn('PROJECT STATS',stats,'1 1 auto','f26b1'));r1.appendChild(mkBtn('STYLE REPORT',styleReport,'1 1 auto','f26b2'));card.appendChild(r1);
  var r2=mkRow();var bi=document.createElement('input');bi.id='f26bud';bi.placeholder='target length e.g. 30';bi.type='number';bi.step=1;r2.appendChild(bi);r2.appendChild(mkBtn('LENGTH BUDGET',budget,'1 1 auto','f26b3'));card.appendChild(r2);
  var r3=mkRow();var pi=document.createElement('input');pi.id='f26pre';pi.placeholder='name prefix (optional)';r3.appendChild(pi);r3.appendChild(mkBtn('AUTO NAME CLIPS',autoname,'1 1 auto','f26b4'));card.appendChild(r3);
  var r4=mkRow();var ai=document.createElement('input');ai.id='f26a';ai.placeholder='#';ai.type='number';ai.style.width='52px';r4.appendChild(ai);var bi2=document.createElement('input');bi2.id='f26b';bi2.placeholder='#';bi2.type='number';bi2.style.width='52px';r4.appendChild(bi2);r4.appendChild(mkBtn('SWAP CLIPS',swap,'1 1 auto','f26b5'));card.appendChild(r4);
  var r5=mkRow();r5.appendChild(mkBtn('PACE STRIP',paceStrip,'1 1 auto','f26b6'));card.appendChild(r5);
  card.appendChild(ensureStrip());
  var r6=mkRow();var vi=document.createElement('input');vi.id='f26vn';vi.placeholder='variation name';r6.appendChild(vi);r6.appendChild(mkBtn('SAVE VARIATION',varSave,'0 0 auto','f26b7'));
  var vl=document.createElement('select');vl.id='f26vl';r6.appendChild(vl);r6.appendChild(mkBtn('LOAD VARIATION',varLoad,'0 0 auto','f26b8'));card.appendChild(r6);
  var r7=mkRow();r7.appendChild(mkBtn('MARK',markSet,'1 1 auto','f26b9'));r7.appendChild(mkBtn('JUMP BACK TO MARK',markGo,'1 1 auto','f26b10'));card.appendChild(r7);
  var r8=mkRow();r8.appendChild(mkBtn('EDIT TIME TODAY',showTimer,'1 1 auto','f26b11'));card.appendChild(r8);
  var r9=mkRow();var fi=document.createElement('input');fi.id='f26fo';fi.placeholder='only show card e.g. Project Lab';r9.appendChild(fi);r9.appendChild(mkBtn('FOCUS MODE',focusMode,'1 1 auto','f26b12'));card.appendChild(r9);
  var note=document.createElement('div');note.className='note';note.textContent='stats and style report read the whole project in one log, budget compares your length to a target, auto-name fills empty labels, swap trades two clips by number, the pace strip maps every clip as a block, variations keep up to 5 whole-project snapshots you can reload, mark and jump back is a one-slot snapshot, edit time counts active minutes today, and focus mode hides every other card.';
  card.appendChild(note);
  var hs=document.querySelectorAll('.card h2'),anchor=null;
  for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('Timeline Power Tools II')>=0){anchor=hs[i].parentElement;break}}
  if(anchor){if(anchor.nextSibling)anchor.parentElement.insertBefore(card,anchor.nextSibling);else anchor.parentElement.appendChild(card)}
  else{var ap=document.querySelector('#panelcol')||document.body;ap.appendChild(card)}
  refreshVarList();
  log('project lab live — stats, style report, budget, auto-name, swap, pace strip, variations, mark, edit timer, focus mode');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();