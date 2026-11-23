'use strict';
// up14.js — PHASE 8 TIMELINE POWER TOOLS PACK (Nov 23 2026)
// reorder, range select + bulk ops, delete/reverse range, color labels,
// lock clip, snap-to-grid, jump to time, markers, timeline zoom, clip stats.
// Extends S.clips/S state; nothing removed. Local helpers only (p8* ids).
(function(){
if(window.__tk2up14)return;window.__tk2up14=true;
function $(id){return document.getElementById(id)}
function lsGet(k,d){try{var v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function mkBtn(txt,fn,flex,id){var b=document.createElement('button');b.className='ghost small';b.textContent=txt;b.style.flex=flex||'0 0 30%';if(id)b.id=id;b.onclick=fn;return b}
function mkRow(btns){var r=document.createElement('div');r.className='btnrow';btns.forEach(function(b){r.appendChild(b)});return r}
function mkSel(id,opts,vals){var s=document.createElement('select');s.id=id;s.className='inp';opts.forEach(function(o,i){var el=document.createElement('option');el.value=vals?vals[i]:o;el.textContent=o;s.appendChild(el)});return s}
function mkInp(id,ph){var i=document.createElement('input');i.id=id;i.placeholder=ph||'';i.autocomplete='off';return i}

var COLORS=['#00e5ff','#ff2d55','#3ee08f','#ffd166','#b388ff','#ff8a3d'];
var RANGE={a:-1,b:-1};
function idx(){return S.clips.findIndex(function(x){return x.id===S.selected})}
function outDur(c){return Math.max(0.05,(c.end-c.start)/(c.speed||1))}
function cur(){return S.clips[idx()]}

// ---------- 1. reorder selected clip ----------
function move(dir){
  var i=idx();if(i<0){log('select a clip first');return}
  var j=i+dir;if(j<0||j>=S.clips.length){log('already at the '+(dir<0?'start':'end'));return}
  var t=S.clips[i];S.clips[i]=S.clips[j];S.clips[j]=t;
  drawTimeline();save();
  log('clip moved '+(dir<0?'earlier':'later')+': now #'+(j+1)+' of '+S.clips.length,true);
}

// ---------- 2. range select + bulk ops ----------
function setA(){var i=idx();if(i<0){log('select a clip first');return}RANGE.a=i;log('range A set at clip #'+(i+1))}
function setB(){var i=idx();if(i<0){log('select a clip first');return}RANGE.b=i;log('range B set at clip #'+(i+1)+' — range: '+(RANGE.a<0?'(A unset)':('#'+(RANGE.a+1)+'-#'+(i+1))))}
function rSpan(){
  if(RANGE.a<0||RANGE.b<RANGE.a){log('set range A then B first');return null}
  return[RANGE.a,Math.min(RANGE.b,S.clips.length-1)];
}
function applyRange(){
  var r=rSpan();if(!r)return;
  var tr=$('p8rTrans')?$('p8rTrans').value:'cut';
  var sp=$('p8rSpeed')?parseFloat($('p8rSpeed').value):0;
  if(!sp||sp<0.25||sp>3){log('speed must be 0.25-3');return}
  var n=0,skip=0;
  for(var i=r[0];i<=r[1];i++){var c=S.clips[i];if(!c)continue;if(c.lock){skip++;continue}c.trans=tr;c.speed=sp;n++}
  drawTimeline();save();
  log('range updated: '+n+' clips → '+tr+(skip? ' ('+skip+' locked skipped)':''),true);
}
function deleteRange(){
  var r=rSpan();if(!r)return;
  var keep=[],n=0,skip=0;
  S.clips.forEach(function(c,i){if(i>=r[0]&&i<=r[1]){if(c.lock){skip++;keep.push(c)}else n++}else keep.push(c)});
  if(!n){log('nothing deletable in range (locked clips stay)');return}
  S.clips=keep;RANGE.a=-1;RANGE.b=-1;S.selected=null;$('clipPanel').style.display='none';
  drawTimeline();save();
  log('range deleted: '+n+' clips removed'+(skip?', '+skip+' locked kept':''),true);
}
function reverseRange(){
  var r=rSpan();if(!r)return;
  if(r[1]-r[0]<1){log('range needs at least 2 clips');return}
  var seg=S.clips.slice(r[0],r[1]+1).reverse();
  for(var i=0;i<seg.length;i++)S.clips[r[0]+i]=seg[i];
  drawTimeline();save();
  log('range reversed: clips #'+(r[0]+1)+'-#'+(r[1]+1),true);
}

// ---------- 3. color labels ----------
function labelNext(){
  var c=cur();if(!c){log('select a clip first');return}
  var at=c.label?COLORS.indexOf(c.label):-1;
  c.label=COLORS[(at+1)%COLORS.length];
  drawTimeline();save();
  log('label set on clip #'+(idx()+1)+' ('+c.label+')',true);
}
function labelsClear(){
  var n=0;S.clips.forEach(function(c){if(c.label){delete c.label;n++}});
  drawTimeline();save();
  log(n?'cleared '+n+' labels':'no labels set');
}

// ---------- 4. lock clip ----------
function lockToggle(){
  var c=cur();if(!c){log('select a clip first');return}
  c.lock=!c.lock;drawTimeline();save();
  log('clip #'+(idx()+1)+(c.lock?' locked — bulk ops will skip it':' unlocked'),true);
}

// ---------- 5. snap to 0.1s grid ----------
function snapGrid(){
  if(!S.clips.length){log('no clips yet');return}
  var n=0;
  S.clips.forEach(function(c){
    var s=Math.round(c.start*10)/10,e=Math.round(c.end*10)/10;
    if(e-s<0.2)e=s+0.2;
    if(s!==c.start||e!==c.end){c.start=s;c.end=e;n++}
  });
  drawTimeline();save();
  log('snapped '+n+' clip boundaries to the 0.1s grid',true);
}

// ---------- 6. jump to time ----------
function jump(){
  var t=parseFloat($('p8jump').value);
  if(isNaN(t)||t<0){log('type a timeline position in seconds');return}
  var acc=0;
  for(var i=0;i<S.clips.length;i++){
    var d=outDur(S.clips[i]);
    if(t<acc+d){log('jump '+t.toFixed(1)+'s → clip #'+(i+1)+' ('+(M[S.clips[i].src]?M[S.clips[i].src].name.slice(0,12):'?')+')',true);selectClip(i);return}
    acc+=d;
  }
  log('jump '+t.toFixed(1)+'s is past the end ('+acc.toFixed(1)+'s total)');
}

// ---------- 7. timeline zoom (wide tiles, persisted) ----------
var wide=lsGet('tk2tlzoom',false);
function zoomStyle(){
  var st=$('p8tlstyle');
  if(!st){st=document.createElement('style');st.id='p8tlstyle';document.head.appendChild(st)}
  st.textContent=wide?'.trow .tclip{min-width:72px!important}':'.trow .tclip{min-width:0}';
}
function zoomToggle(){
  wide=!wide;lsSet('tk2tlzoom',wide);zoomStyle();
  log('timeline '+(wide?'WIDE (72px tiles)':'COMPACT'),true);
}

// ---------- 8. markers ----------
function markers(){return S.tlmk=S.tlmk||[]}
function mkAdd(){
  var t=parseFloat($('p8jump').value);
  if(isNaN(t)||t<0){log('type a time in the jump box, then ADD MARKER');return}
  var m=markers();m.push({t:t,name:'M'+(m.length+1)+' @'+t.toFixed(1)+'s'});
  mkList();
  log('marker added at '+t.toFixed(1)+'s',true);
}
function mkJump(){
  var m=markers();var i=parseInt($('p8mkSel').value);
  if(isNaN(i)||!m[i])return;
  $('p8jump').value=m[i].t;log('marker '+m[i].name+' — tap JUMP TO TIME to go there',true);
}
function mkDel(){
  var m=markers();var i=parseInt($('p8mkSel').value);
  if(isNaN(i)||!m[i])return;
  var gone=m.splice(i,1)[0];mkList();
  log('marker deleted: '+gone.name);
}
function mkList(){
  var s=$('p8mkSel');if(!s)return;
  s.innerHTML='';var m=markers();
  if(!m.length){s.appendChild(new Option('no markers','')) ;return}
  m.forEach(function(mk,i){s.appendChild(new Option(mk.name,String(i)))});
}

// ---------- 9. clip stats ----------
function stats(){
  if(!S.clips.length){log('no clips yet');return}
  var tot=0,min=1e9,max=0,srcs={};
  S.clips.forEach(function(c){var d=outDur(c);tot+=d;if(d<min)min=d;if(d>max)max=d;srcs[c.src]=(srcs[c.src]||0)+1});
  log('stats: '+S.clips.length+' clips · '+tot.toFixed(1)+'s total · avg cut '+
      (tot/S.clips.length).toFixed(2)+'s · shortest '+min.toFixed(2)+'s · longest '+max.toFixed(2)+
      's · '+Object.keys(srcs).length+' source'+(Object.keys(srcs).length===1?'':'s'),true);
}

// ---------- visual hook: labels + locks on tiles ----------
function restyle(){
  var tv=$('trVideo');if(!tv)return;
  var tiles=tv.querySelectorAll('.tclip');
  Array.prototype.forEach.call(tiles,function(d,i){
    var c=S.clips[i];if(!c)return;
    if(c.label){d.style.outline='2px solid '+c.label;d.style.outlineOffset='-2px'}
    if(c.lock){d.style.borderStyle='dashed';d.style.opacity='0.55'}
  });
}
var obsTries=0;
function obsStart(){
  var tv=$('trVideo');
  if(tv){new MutationObserver(function(){restyle()}).observe(tv,{childList:true});restyle()}
  else if(obsTries++<40)setTimeout(obsStart,250);
}

// ---------- mount ----------
function mount(){
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='Timeline Power Tools (Phase 8)';card.appendChild(h);
  card.appendChild(mkRow([mkBtn('MOVE EARLIER',function(){move(-1)},'0 0 30%','p8MvL'),mkBtn('MOVE LATER',function(){move(1)},'0 0 30%','p8MvR'),mkBtn('LOCK / UNLOCK',lockToggle,'0 0 30%','p8Lock')]));
  card.appendChild(mkRow([mkBtn('SET RANGE A',setA,'0 0 30%','p8Ra'),mkBtn('SET RANGE B',setB,'0 0 30%','p8Rb'),mkBtn('CLIP STATS',stats,'0 0 30%','p8Stats')]));
  card.appendChild(mkRow([mkBtn('APPLY TO RANGE',applyRange,'0 0 30%','p8Apply'),mkBtn('DELETE RANGE',deleteRange,'0 0 30%','p8Del'),mkBtn('REVERSE RANGE',reverseRange,'0 0 30%','p8Rev')]));
  var rrow=document.createElement('div');rrow.className='row';rrow.style.marginTop='8px';
  rrow.appendChild(mkSel('p8rTrans',['cut','flash','fade in','zoom punch','whip pan','camera shake'],['cut','flash','fade','punch','whip','shake']));
  var sp=mkInp('p8rSpeed','range speed e.g. 1.5');rrow.appendChild(sp);
  card.appendChild(rrow);
  card.appendChild(mkRow([mkBtn('LABEL NEXT COLOR',labelNext,'0 0 30%','p8Lab'),mkBtn('CLEAR ALL LABELS',labelsClear,'0 0 30%','p8LabC'),mkBtn('SNAP TO 0.1S GRID',snapGrid,'0 0 30%','p8Snap')]));
  var jrow=document.createElement('div');jrow.className='row';jrow.style.marginTop='8px';
  jrow.appendChild(mkInp('p8jump','seconds e.g. 5.0'));
  jrow.appendChild(mkBtn('JUMP TO TIME',jump,'0 0 26%','p8Jump'));
  card.appendChild(jrow);
  var mrow=document.createElement('div');mrow.className='row';mrow.style.marginTop='8px';
  mrow.appendChild(mkBtn('ADD MARKER HERE',mkAdd,'0 0 30%','p8MkAdd'));
  mrow.appendChild(mkSel('p8mkSel',['no markers'],['']));mrow.children[1].id='p8mkSel';
  mrow.appendChild(mkBtn('GO',mkJump,'0 0 12%','p8MkGo'));
  mrow.appendChild(mkBtn('DEL MARKER',mkDel,'0 0 22%','p8MkDel'));
  card.appendChild(mrow);
  card.appendChild(mkRow([mkBtn('TIMELINE '+(wide?'COMPACT':'WIDE'),zoomToggle,'0 0 40%','p8Zoom')]));
  var note=document.createElement('div');note.className='note';
  note.textContent='reorder + range tools work on the selected clip; A/B pick the range ends. locked clips are skipped by range ops. labels and locks show right on the timeline tiles.';
  card.appendChild(note);
  var placed=false;
  var hs=document.querySelectorAll('.card h2');
  for(var i=0;i<hs.length;i++){
    if(/polish lab/i.test(hs[i].textContent||'')){
      var anchor=hs[i].parentElement;
      if(anchor.nextSibling)anchor.parentElement.insertBefore(card,anchor.nextSibling);
      else anchor.parentElement.appendChild(card);
      placed=true;break;
    }
  }
  if(!placed){var ps=$('page-studio');if(ps)ps.appendChild(card)}
  zoomStyle();mkList();obsStart();
  log('timeline power tools live',true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);
else mount();
})();