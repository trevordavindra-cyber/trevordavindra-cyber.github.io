'use strict';
/* up20.js - SHORTFORGE FORGE 24 TRANSITION LAB (Nov 25 2026) v1 */
(function(){
if(window.__sfup20){return;}
window.__sfup20=1;
function need(){if(!window.SCENES||!SCENES.length){glog('forge a script first (FORGE 24 tools need scenes)',0);return false}return true}
function glog(m,hl){try{step(m,hl)}catch(e){console.log('[forge24]',m)}}
function mkBtn(id,label,fn){var b=document.createElement('button');b.id=id;b.textContent=label;b.style.cssText='background:#0b1418;border:1px solid #2de2ff;color:#eaffff;font:700 10px monospace;padding:6px 10px;margin:3px;cursor:pointer;border-radius:6px';b.addEventListener('click',function(){try{if(need())fn()}catch(e){glog('forge24 error: '+e.message,0)}});return b}
function dlB(txt,name){try{var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));a.download=name;a.style.display='none';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a)},200)}catch(e){glog('download blocked: '+e.message,0)}}
function title(){return String((window.META&&META.title)||'this topic')}
function tot(){var t=0;SDUR.forEach(function(d){t+=d});return t}
function imgOf(s){return String((s&&(s.img||s.image||s.prompt))||'')}
function cutAt(i){var t=0;for(var k=0;k<i;k++){t+=(SDUR[k]||4)}return t}
function isFast(p){return /running|chase|car|speed|race|fight|explos|jump|fall|storm|action/i.test(p)}
function isTech(p){return /tech|robot|cyber|neon|city|code|computer|screen|data|glitch|machine/i.test(p)}
function isNature(p){return /forest|ocean|sky|mountain|desert|water|sun|moon|stars|field|animal/i.test(p)}
function isPeople(p){return /person|man|woman|face|crowd|child|people|hands|eyes|portrait/i.test(p)}
function kindOf(p){return isTech(p)?'tech':isNature(p)?'nature':isPeople(p)?'people':isFast(p)?'fast':'scene'}
function mount(){
 var bp=document.getElementById('boardPanel');if(!bp||bp.querySelector('#g24b1'))return;
 var row=document.createElement('div');row.style.cssText='margin-top:12px';
 var h=document.createElement('div');h.textContent='FORGE 24 TRANSITION LAB';h.style.cssText='color:#2de2ff;font:700 11px monospace;margin:4px 3px';row.appendChild(h);
 var btns=document.createElement('div');btns.style.cssText='display:flex;flex-wrap:wrap';row.appendChild(btns);
 var anchor=bp.querySelector('.rowbtns');if(anchor)bp.insertBefore(row,anchor);else bp.appendChild(row);
 btns.appendChild(mkBtn('g24b1','TRANS MAP',transMap));
 btns.appendChild(mkBtn('g24b2','CUT STYLE',cutStyle));
 btns.appendChild(mkBtn('g24b3','MOTION MATCH',motionMatch));
 btns.appendChild(mkBtn('g24b4','WHIP PAN PLAN',whipPlan));
 btns.appendChild(mkBtn('g24b5','GLITCH PLAN',glitchPlan));
 btns.appendChild(mkBtn('g24b6','FLASH PLAN',flashPlan));
 btns.appendChild(mkBtn('g24b7','WIPE PLAN',wipePlan));
 btns.appendChild(mkBtn('g24b8','BEAT CUTS',beatCuts));
 btns.appendChild(mkBtn('g24b9','TRANS SCORE',transScore));
 btns.appendChild(mkBtn('g24b10','TRANS SHEET',transSheet));
 try{glog('FORGE 24 TRANSITION LAB mounted (10 tools)',0)}catch(e){}
}
function transMap(){
 var n=SCENES.length;
 if(n<2){glog('TRANS MAP: need at least 2 scenes for a transition map',1);return}
 var rows=[];
 for(var i=0;i<n-1;i++){
  var a=kindOf(imgOf(SCENES[i])),b=kindOf(imgOf(SCENES[i+1]));
  var t=(a===b)?'morph-friendly (crossfade 12 frames)':((a==='fast'||b==='fast')?'hard cut':'scene change (wipe or flash 4 frames)');
  rows.push('cut '+(i+1)+' at '+cutAt(i+1).toFixed(1)+'s: '+a+' -> '+b+' = '+t);
 }
 glog('TRANS MAP ('+(n-1)+' cuts): '+rows.join(' | '),1);
}
function cutStyle(){
 var hard=0,soft=0;
 for(var i=0;i<SCENES.length-1;i++){
  var a=imgOf(SCENES[i]).toLowerCase(),b=imgOf(SCENES[i+1]).toLowerCase();
  var shared=a.split(/\s+/).filter(function(w){return w.length>4&&b.indexOf(w)>-1});
  if(shared.length>=2){soft++;glog('CUT STYLE: cut '+(i+1)+' is a MATCH CUT ("'+shared.slice(0,2).join('", "')+'" appears both sides) - keep it, match cuts read as intent',0)}
  else hard++;
 }
 glog('CUT STYLE: '+hard+' hard cuts, '+soft+' match cuts. '+(hard>soft?'mostly hard cuts - good for tiktok pace, they never drag':'a match-cut heavy edit - strong for storytelling, just make sure s1 still opens on a hard cut so the hook lands'),1);
}
function motionMatch(){
 var bad=[];
 for(var i=0;i<SCENES.length-1;i++){
  var a=imgOf(SCENES[i]).toLowerCase(),b=imgOf(SCENES[i+1]).toLowerCase();
  var am=/walk|run|turn|fly|fall|drive|spin|reach|look/i.test(a),bm=/walk|run|turn|fly|fall|drive|spin|reach|look/i.test(b);
  if(am!==bm)bad.push('cut '+(i+1)+' flips motion '+(am?'on':'off')+'->'+(bm?'on':'off')+' - land the move before you cut or it reads as a jump');
 }
 glog('MOTION MATCH: '+(bad.length?bad.length+' motion mismatches - '+bad.slice(0,3).join('; '):'motion carries across every cut cleanly'),1);
}
function whipPlan(){
 var spots=[];
 for(var i=0;i<SCENES.length-1;i++){if(isFast(imgOf(SCENES[i]))&&isFast(imgOf(SCENES[i+1])))spots.push('cut '+(i+1)+' at '+cutAt(i+1).toFixed(1)+'s')}
 glog('WHIP PAN PLAN: '+(spots.length?spots.join(', ')+' - whip pan these (blur 6 frames each side) - two fast scenes read as one continuous take when you whip between them':'no back-to-back fast scenes - a whip pan would sell motion you do not have; keep cuts clean instead'),1);
}
function glitchPlan(){
 var spots=[];
 SCENES.forEach(function(s,i){if(isTech(imgOf(s)))spots.push('s'+(i+1)+' at '+cutAt(i).toFixed(1)+'s')});
 glog('GLITCH PLAN: '+(spots.length?spots.join(', ')+' - drop a 3-frame rgb-split glitch on entry to each tech scene; the fx checkbox already ships the base, this times it':'no tech scenes - skip glitches, they only read when the subject is digital'),1);
}
function flashPlan(){
 var hook='cut 1 at '+cutAt(1).toFixed(1)+'s',payoff='cut '+(SCENES.length-1)+' at '+cutAt(SCENES.length-1).toFixed(1)+'s';
 glog('FLASH PLAN: white flash (4 frames) on '+hook+' right after the hook line, and on '+payoff+' as the payoff lands - two flashes per short max, more reads as flicker',1);
}
function wipePlan(){
 var spots=[];
 for(var i=0;i<SCENES.length-1;i++){
  var a=kindOf(imgOf(SCENES[i])),b=kindOf(imgOf(SCENES[i+1]));
  if(a!==b&&(a==='nature'||b==='nature')&&a!=='fast'&&b!=='fast')spots.push('cut '+(i+1)+' at '+cutAt(i+1).toFixed(1)+'s ('+a+' -> '+b+')');
 }
 glog('WIPE PLAN: '+(spots.length?spots.slice(0,3).join(', ')+' - a 10-frame directional wipe sells a location change better than a hard cut here':'no clean location changes - wipes would slow the pace without earning it, stay on hard cuts'),1);
}
function beatCuts(){
 var times=[];for(var i=1;i<SCENES.length;i++){times.push(cutAt(i).toFixed(2))}
 glog('BEAT CUTS: paste these cut timestamps into your editor: '+times.join(', ')+(times.length?' (rounded to 2 decimals; nudge each +-0.1s to sit on the beat grid)':''),1);
}
function transScore(){
 var score=50;
 if(SCENES.length>=5)score+=10;else score-=5;
 var fast=SCENES.filter(function(s){return isFast(imgOf(s))}).length;
 if(fast>=1&&fast<=SCENES.length/2)score+=10;
 var kinds={},same=0;
 SCENES.forEach(function(s){var k=kindOf(imgOf(s));kinds[k]=(kinds[k]||0)+1});
 Object.keys(kinds).forEach(function(k){same=Math.max(same,kinds[k])});
 if(same<=SCENES.length*0.6)score+=15;else score-=10;
 var t=tot(),cpm=SCENES.length/t*10;
 if(cpm>=1.2&&cpm<=3)score+=15;else score-=5;
 if(score>98)score=98;
 glog('TRANS SCORE '+score+'/100 '+([score<70?'under 70: your transitions fight the content - simplify to hard cuts everywhere first':score<85?'70-84: solid cut logic, add one styled transition where it earns it':'85+: transitions are edit-ready, ship it'][score<70?0:score<85?1:2]),1);
}
function transSheet(){
 var lines=['FORGE 24 TRANSITION SHEET - '+title(),'generated '+new Date().toISOString(),SCENES.length+' scenes, '+tot().toFixed(1)+'s, '+(SCENES.length-1)+' cuts',''];
 lines.push('CUTS:');
 for(var i=0;i<SCENES.length-1;i++){lines.push('  cut '+(i+1)+' at '+cutAt(i+1).toFixed(2)+'s: '+kindOf(imgOf(SCENES[i]))+' -> '+kindOf(imgOf(SCENES[i+1])))}
 lines.push('');lines.push('styles: match cut where prompts share 2+ words, whip pan between fast pairs, flash on hook + payoff, wipe on location changes');
 dlB(lines.join('\n'),'forge24_trans_sheet.txt');
 glog('TRANS SHEET downloaded (forge24_trans_sheet.txt)',1);
}
function boot(){
 if(document.getElementById('boardPanel')){mount();return}
 var n=0,iv=setInterval(function(){n++;if(document.getElementById('boardPanel')){clearInterval(iv);mount()}else if(n>120){clearInterval(iv)}},250);
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',boot)}else{boot()}
})();