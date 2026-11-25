'use strict';
/* up22.js - SHORTFORGE FORGE 28 THUMB LAB (Nov 25 2026) v1 */
(function(){
if(window.__sfup22){return;}
window.__sfup22=1;
function need(){if(!window.SCENES||!SCENES.length){glog('forge a script first (FORGE 28 tools need scenes)',0);return false}return true}
function glog(m,hl){try{step(m,hl)}catch(e){console.log('[forge28]',m)}}
function mkBtn(id,label,fn){var b=document.createElement('button');b.id=id;b.textContent=label;b.style.cssText='background:#0b1418;border:1px solid #2de2ff;color:#eaffff;font:700 10px monospace;padding:6px 10px;margin:3px;cursor:pointer;border-radius:6px';b.addEventListener('click',function(){try{if(need())fn()}catch(e){glog('forge28 error: '+e.message,0)}});return b}
function dlB(txt,name){try{var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));a.download=name;a.style.display='none';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a)},200)}catch(e){glog('download blocked: '+e.message,0)}}
function title(){return String((window.META&&META.title)||'this topic')}
function tot(){var t=0;SDUR.forEach(function(d){t+=d});return t}
function txtOf(s){return String((s&&(s.text||s.caption||s.line||s.script||s.narration))||imgOf(s)||'')}
function imgOf(s){return String((s&&(s.img||s.image||s.prompt))||'')}
function cutAt(i){var t=0;for(var k=0;k<i;k++){t+=(SDUR[k]||4)}return t}
function isTech(p){return /tech|robot|cyber|neon|city|code|computer|screen|data|glitch|machine/i.test(p)}
function isNature(p){return /forest|ocean|sky|mountain|desert|water|sun|moon|stars|field|animal/i.test(p)}
function isFast(p){return /running|chase|car|speed|race|fight|explos|jump|fall|storm|action/i.test(p)}
function kindOf(p){return isFast(p)?'fast':isTech(p)?'tech':isNature(p)?'nature':'scene'}
function hasFace(p){return /you|face|person|man|woman|girl|guy|hand|people|eyes/i.test(p)}
function bestScene(){
 var best=0,bs=-1;
 SCENES.forEach(function(s,i){
  var p=imgOf(s)+' '+txtOf(s);var score=0;
  if(isFast(p))score+=3;if(isTech(p))score+=2;if(isNature(p))score+=1;
  if(hasFace(p))score+=2;
  var words=txtOf(s).split(' ').filter(Boolean).length;score+=Math.min(2,words/6);
  if(score>bs){bs=score;best=i}
 });
 return best;
}
function accentOf(p){
 p=String(p||imgOf(SCENES[bestScene()])).toLowerCase();
 if(/tech|robot|cyber|neon|code|screen|data|glitch/i.test(p))return['#00e5ff cyan','#0b0b14'];
 if(/fire|lava|desert|storm|action|fight/i.test(p))return['#ff9f1c orange','#1a0e06'];
 if(/forest|ocean|water|sky|field|mountain/i.test(p))return['#7cff6b green','#06121a'];
 return['#ff2d55 magenta','#12060c'];
}
function thumbTextStr(){
 var words=String(title()).replace(/\s+/g,' ').trim().split(' ').filter(Boolean);
 var pick=words.slice(0,4).join(' ');
 if(pick.length>22){pick=words.slice(0,3).join(' ')}
 if(pick.length>22){pick=words.slice(0,2).join(' ')}
 return pick.toUpperCase();
}
function abStr(){
 var t=String(title()).replace(/\s+/g,' ').trim().split(' ').filter(Boolean);
 var a=(t.slice(0,3).join(' ')||'the big idea').toUpperCase();
 var b=('NOBODY '+(t[0]||'knows')).toUpperCase();
 return 'A) "'+a+'" clean text over the cover | B) "'+b+'" curiosity style - run both, keep the winner after 24h';
}
function thumbScoreCalc(){
 var s=0,notes=[];
 var cover=SCENES[bestScene()];
 if(txtOf(cover).trim().length>0)s+=25;else notes.push('no text on the cover scene');
 var p=imgOf(cover);
 if(isFast(p))s+=25;else if(isTech(p))s+=20;else if(isNature(p))s+=15;else notes.push('weak visual energy');
 if(hasFace(p))s+=20;else notes.push('no subject or face in frame');
 if(String(title()).length<=60)s+=15;else notes.push('title too long for overlay');
 if(/move|run|spin|fly|drop|burst|change|turn|shock|secret|truth/i.test(txtOf(cover)))s+=15;else notes.push('no motion or curiosity words');
 if(s>98)s=98;
 return{s:s,notes:notes};
}
function mount(){
 var bp=document.getElementById('boardPanel');if(!bp||bp.querySelector('#g26b1'))return;
 var row=document.createElement('div');row.style.cssText='margin-top:12px';
 var h=document.createElement('div');h.textContent='FORGE 28 THUMB LAB';h.style.cssText='color:#2de2ff;font:700 11px monospace;margin:4px 3px';row.appendChild(h);
 var btns=document.createElement('div');btns.style.cssText='display:flex;flex-wrap:wrap';row.appendChild(btns);
 var anchor=bp.querySelector('.rowbtns');if(anchor)bp.insertBefore(row,anchor);else bp.appendChild(row);
 btns.appendChild(mkBtn('g26b1','COVER PICK',coverPick));
 btns.appendChild(mkBtn('g26b2','THUMB TEXT',thumbText));
 btns.appendChild(mkBtn('g26b3','CONTRAST FIX',contrastFix));
 btns.appendChild(mkBtn('g26b4','FIRST FRAME',firstFrame));
 btns.appendChild(mkBtn('g26b5','COLOR POP',colorPop));
 btns.appendChild(mkBtn('g26b6','FACE CHECK',faceCheck));
 btns.appendChild(mkBtn('g26b7','A/B PAIR',abPair));
 btns.appendChild(mkBtn('g26b8','SERIES LOOK',seriesLook));
 btns.appendChild(mkBtn('g26b9','THUMB SCORE',thumbScore));
 btns.appendChild(mkBtn('g26b10','THUMB SHEET',thumbSheet));
 try{glog('FORGE 28 THUMB LAB mounted (10 tools)',0)}catch(e){}
}
function coverPick(){
 var b=bestScene();
 glog('COVER PICK: use scene s'+(b+1)+' as the cover (strongest visual energy: '+kindOf(imgOf(SCENES[b]))+(hasFace(imgOf(SCENES[b]))?', subject in frame':'')+')',1);
}
function thumbText(){
 glog('THUMB TEXT: "'+thumbTextStr()+'" (3-4 words max, huge font, top-left or center, never full sentences)',1);
}
function contrastFix(){
 var bright=0;SCENES.forEach(function(s){if(isNature(imgOf(s)))bright++});
 glog('CONTRAST FIX: white text + 2px black outline + 40% dark scrim behind it'+(bright?' - '+bright+' bright/nature scenes need the strongest scrim':' - keep text off busy midtones'),1);
}
function firstFrame(){
 var t=txtOf(SCENES[0]).slice(0,60);
 glog('FIRST FRAME: s1 shows "'+(t||'scene 1')+'" - if it has no motion or subject in the first second, swap s1 with the COVER PICK scene (s'+(bestScene()+1)+')',1);
}
function colorPop(){
 var a=accentOf();
 glog('COLOR POP: one accent color per cover - '+a[0]+' on '+a[1]+' - two colors max total',1);
}
function faceCheck(){
 var p=imgOf(SCENES[bestScene()]);
 glog('FACE CHECK: '+(hasFace(p)?'subject detected on the cover - keep eyes on the top third, off-center left or right':'no subject in the cover frame - a face or hand lifts clicks ~2x, consider adding one'),1);
}
function abPair(){
 glog('A/B PAIR: '+abStr(),1);
}
function seriesLook(){
 var a=accentOf();
 glog('SERIES LOOK: lock one accent ('+a[0]+'), same font and same corner badge on every cover so your grid reads as one series',1);
}
function thumbScore(){
 var r=thumbScoreCalc();
 glog('THUMB SCORE '+r.s+'/100 '+[r.s<70?'under 70: fix '+r.notes.join(', ')+' before shipping':r.s<85?'70-84: solid, tighten '+(r.notes[0]||'the weakest item'):'85+: cover is click-ready, ship it'][r.s<70?0:r.s<85?1:2],1);
}
function thumbSheet(){
 var b=bestScene(),r=thumbScoreCalc();
 var lines=['FORGE 28 THUMB SHEET - '+title(),'generated '+new Date().toISOString(),SCENES.length+' scenes, '+tot().toFixed(1)+'s',''];
 SCENES.forEach(function(s,i){
  lines.push('s'+(i+1)+' ['+(cutAt(i)+0.1).toFixed(2)+'-'+(cutAt(i+1)-0.2).toFixed(2)+'s] '+(imgOf(s)||'(no image)').slice(0,80));
 });
 lines.push('','COVER: s'+(b+1)+' ('+kindOf(imgOf(SCENES[b]))+(hasFace(imgOf(SCENES[b]))?', subject in frame':'')+')');
 lines.push('THUMB TEXT: '+thumbTextStr());
 lines.push('A/B PAIR: '+abStr());
 lines.push('ACCENT: '+accentOf()[0]+' on '+accentOf()[1]);
 lines.push('SCORE: '+r.s+'/100'+(r.notes.length?' - fix: '+r.notes.join(', '):' - click-ready'));
 lines.push('','rules: 3-4 words max on the cover, huge font, top-left or center, one accent color, face or hand in frame, first frame = cover scene, same look across the series');
 dlB(lines.join('\n'),'forge28_thumb_sheet.txt');
 glog('THUMB SHEET downloaded (forge28_thumb_sheet.txt)',1);
}
function boot(){
 if(document.getElementById('boardPanel')){mount();return}
 var n=0,iv=setInterval(function(){n++;if(document.getElementById('boardPanel')){clearInterval(iv);mount()}else if(n>120){clearInterval(iv)}},250);
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',boot)}else{boot()}
})();