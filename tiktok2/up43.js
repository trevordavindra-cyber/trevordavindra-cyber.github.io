'use strict';
// up43.js - PHASE 37 FX LAB (Nov 23 2026)
// shake beat map, glitch cut planner, zoom punch finder, rgb split scheduler,
// flash cut counter, film burn breaks, light leak spots, speed ramp guide,
// echo trail planner, fx sheet
(function(){
if(window.__tk2up43){return}window.__tk2up43=1;
function mkBtn(t,fn,id){var b=document.createElement('button');b.className='btn';b.textContent=t;if(id){b.id=id}b.onclick=fn;return b}
function mkRow(){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap='6px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function saveE(){try{if(typeof save==='function'){save()}}catch(e){}}
function S(){try{return window.S||window.state||window.APPSTATE||{}}catch(e){return {}}}
function clipDur(c){var st=parseFloat(c.start),en=parseFloat(c.end);if(!isFinite(st)||!isFinite(en)){return 0}return Math.max(0,(en-st))/(c.speed||1)}
function clips(){var s=S();var a=(s&&s.clips)||[];var out=[],t=0;for(var i=0;i<a.length;i++){var d=clipDur(a[i]);if(d>0.05){t+=d;out.push({c:a[i],d:d})}}return out}
function genre(){var s=S();var cs=clips();var g=((s.genre||s.style||(cs[0]?cs[0].c.style:'')||'')+'').toUpperCase()||'EDIT';return g}
function needClips(){if(!clips().length){log('fx lab: add clips to the timeline first');return false}return true}
function dl(name,text){try{var b=new Blob([text],{type:'text/plain'});var u=URL.createObjectURL(b);var a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},800);log('download started - '+name,true)}catch(e){log('download blocked, '+e.message)}}
function heat(){var g=genre();if(g.indexOf('PHONK')>=0){return 3}if(g.indexOf('SPORT')>=0||g.indexOf('FOOTBALL')>=0){return 2}if(g.indexOf('ANIME')>=0){return 2}return 1}
function shakeMap(){if(!needClips()){return}
 var cs=clips();var h=heat();var t=0;var hits=[];
 for(var i=0;i<cs.length;i++){var prev=t;t+=cs[i].d;if(i>0&&(cs[i].d<0.9||cs[i].d<cs[i-1].d*0.6)){hits.push({at:Math.round(prev*10)/10,p:Math.round((cs[i].d<0.6?h*22:h*14)/1)})}
  if(hits.length>=6){break}}
 for(var j=0;j<hits.length;j++){log('SHAKE BEAT MAP - burst at '+hits[j].at+'s, intensity '+hits[j].p+'%, 3 frames on the cut then settle',true)}
 log('SHAKE BEAT MAP - '+genre().toLowerCase()+' heat '+h+'/3: shake only on cuts, never mid-clip, and dial the last one down so the loop lands clean',true)}
function glitchPlan(){if(!needClips()){return}
 var cs=clips();var h=heat();var short=[];
 for(var i=0;i<cs.length;i++){if(cs[i].d<0.8){short.push(i+1)}}
 if(short.length){log('GLITCH CUT PLANNER - glitch hits on clips '+short.join(', ')+' (each under 0.8s), rgb channel offset 2-4px, one hit per clip',true)}
 else{log('GLITCH CUT PLANNER - no clip under 0.8s yet: trims of 0.4-0.6s between the two loudest beats give you glitch slots',true)}
 log('GLITCH CUT PLANNER - '+genre().toLowerCase()+' wants about '+(h===3?'a hit every 1.5s':(h===2?'a hit every 2.5s':'one or two hits total'))+', never two in a row',true)}
function zoomPunch(){if(!needClips()){return}
 var cs=clips();var t=0;var punches=[];
 for(var i=1;i<cs.length;i++){var drop=cs[i-1].d-cs[i].d;if(drop>0.4){t=0;for(var k=0;k<i;k++){t+=cs[k].d}punches.push({at:Math.round(t*10)/10,scale:Math.min(1.3,1.08+drop*0.2)})}}
 if(!punches.length){log('ZOOM PUNCH FINDER - no big duration drop to punch on: put one manual punch on the beat right before the payoff clip',true)}
 for(var j=0;j<punches.length;j++){log('ZOOM PUNCH FINDER - punch-in '+Math.round(punches[j].scale*100)/100+'x at '+punches[j].at+'s, 4 frames, ease out',true)}
 log('ZOOM PUNCH FINDER - rule: punch on the cut itself, not inside the clip, and never punch twice inside one second',true)}
function rgbSplit(){if(!needClips()){return}
 var cs=clips();var t=0;var fast=[];
 for(var i=0;i<cs.length;i++){if(cs[i].d<1){t=0;for(var k=0;k<i;k++){t+=cs[k].d}fast.push({at:Math.round(t*10)/10,px:Math.round(3+(1-cs[i].d)*6)})}}
 if(!fast.length){log('RGB SPLIT SCHEDULER - timeline has no sub-1s cuts: split works on the fastest 2 cuts anyway, 2px, only on the first frame',true)}
 for(var j=0;j<fast.length&&j<5;j++){log('RGB SPLIT SCHEDULER - split '+fast[j].px+'px at '+fast[j].at+'s, red left blue right, hold 3 frames',true)}
 log('RGB SPLIT SCHEDULER - keep the offset under 8px so text stays readable through the burst',true)}
function flashCount(){if(!needClips()){return}
 var cs=clips();var n=0;var gap=0;var last=-9;
 for(var i=0;i<cs.length;i++){if(cs[i].d<0.5){n++;if(last>=0&&(i-last)<2){gap++}last=i}}
 log('FLASH CUT COUNTER - '+n+' flash-cut candidate'+(n===1?'':'s')+' (clips under 0.5s)'+(n?'':' - none yet, a 0.3s white clip after the hook buys one'),true);
 if(gap){log('FLASH CUT COUNTER - '+gap+' flash'+(gap===1?'':'es')+' land too close: keep at least 1.5s between flashes or the retina wash kills the beat',true)}
 log('FLASH CUT COUNTER - flash before the drop, not on it, so the drop itself stays clean',true)}
function filmBurn(){if(!needClips()){return}
 var cs=clips();var t=0;var burns=[];
 for(var i=1;i<cs.length;i++){if(cs[i-1].d>2&&cs[i].d>2){t=0;for(var k=0;k<i;k++){t+=cs[k].d}burns.push(Math.round(t*10)/10)}}
 if(!burns.length){log('FILM BURN BREAKS - no two back-to-back clips over 2s: burns belong between chapters, this edit is one chapter',true)}
 for(var j=0;j<burns.length&&j<3;j++){log('FILM BURN BREAKS - film burn at '+burns[j]+'s, 0.4s in 0.6s out, drops the energy so the next chapter hits',true)}
 log('FILM BURN BREAKS - '+genre().toLowerCase()+' mood: warm burnt-orange burn for story edits, cold blue-white flash burn for phonk',true)}
function lightLeak(){if(!needClips()){return}
 var cs=clips();var t=0;var leaks=[];
 for(var i=1;i<cs.length;i++){var jump=Math.abs(cs[i].d-cs[i-1].d);if(jump>0.6){t=0;for(var k=0;k<i;k++){t+=cs[k].d}leaks.push({at:Math.round(t*10)/10,soft:jump>1.2?'heavy 60%':'light 30%'})}}
 if(!leaks.length){log('LIGHT LEAK SPOTS - cut lengths are even, so scene changes are soft: one leak at the 40% mark covers the middle',true)}
 for(var j=0;j<leaks.length&&j<3;j++){log('LIGHT LEAK SPOTS - leak at '+leaks[j].at+'s, '+leaks[j].soft+' opacity, sweep left to right across the cut',true)}
 log('LIGHT LEAK SPOTS - leaks sit on the cut, overlap 0.2s each side, never on the hook or the payoff',true)}
function speedRamp(){if(!needClips()){return}
 var cs=clips();var big=0;for(var i=1;i<cs.length;i++){if(cs[i].d>cs[big].d){big=i}}
 var t=0;for(var k=0;k<big;k++){t+=cs[k].d}
 var rampIn=Math.min(0.4,cs[big].d*0.2);var rampOut=Math.min(0.3,cs[big].d*0.15);
 log('SPEED RAMP GUIDE - clip '+(big+1)+' ('+Math.round(cs[big].d*10)/10+'s) at '+Math.round(t*10)/10+'s: 0.5x for the first '+Math.round(rampIn*10)/10+'s, hold 1x, snap 2x out over '+Math.round(rampOut*10)/10+'s',true);
 log('SPEED RAMP GUIDE - '+genre().toLowerCase()+' pace: ramp the longest clip only, the rest stay native speed, and match ramp length to the beat gap',true)}
function echoTrail(){if(!needClips()){return}
 var cs=clips();var seen={};var first=-1;
 for(var i=0;i<cs.length;i++){var key=(cs[i].c.label||cs[i].c.name||('clip'+(i+1)))+'';if(seen[key]!==undefined&&first<0){first=i}else{seen[key]=1}}
 if(first<0){log('ECHO TRAIL PLANNER - no clip repeats: duplicate the best 0.6s beat once at the payoff and trail it 3 frames back',true)}
 else{var t=0;for(var k=0;k<first;k++){t+=cs[k].d}
  log('ECHO TRAIL PLANNER - first repeat at clip '+(first+1)+' ('+Math.round(t*10)/10+'s): echo it 2 frames back at 60% opacity, then 2 more at 30%',true)}
 log('ECHO TRAIL PLANNER - trails read best on motion, never on a still frame, and never on the opening cut',true)}
function fxSheet(){if(!needClips()){return}
 var cs=clips();var tot=0;for(var i=0;i<cs.length;i++){tot+=cs[i].d}
 var L=[];L.push('FX LAB REPORT');L.push('generated '+new Date().toISOString());L.push('runtime '+Math.round(tot*10)/10+'s, cuts '+cs.length+', genre '+genre().toLowerCase()+', heat '+heat()+'/3');L.push('');
 L.push('SHAKE');var h=heat();L.push('bursts on cuts only, intensity '+(h*14)+'-'+(h*22)+'%, last one dialed down');L.push('');
 L.push('GLITCH');var s=[];for(var i=0;i<cs.length;i++){if(cs[i].d<0.8){s.push(i+1)}}L.push(s.length?('clips '+s.join(', ')+', 2-4px channel offset'):'no sub-0.8s clip yet');L.push('');
 L.push('FLASH CUTS');var n=0;for(var i=0;i<cs.length;i++){if(cs[i].d<0.5){n++}}L.push(n+' candidates, 1.5s minimum spacing');L.push('');
 L.push('RULES');L.push('fx on cuts, never mid-clip; one hero fx per beat; hook and payoff stay clean');L.push('');
 L.push('NEXT');L.push('shake map and glitch plan first, then zoom punch on the biggest duration drop, sheet any change');dl('fx-sheet.txt',L.join('\n'))}
function mount(){
 if(document.getElementById('f43b1')){return}
 var card=document.createElement('div');card.className='card';card.id='f43card';
 var h=document.createElement('h2');h.textContent='FX LAB';card.appendChild(h);
 var r1=mkRow();r1.appendChild(mkBtn('SHAKE BEAT MAP',shakeMap,'f43b1'));r1.appendChild(mkBtn('GLITCH CUT PLANNER',glitchPlan,'f43b2'));card.appendChild(r1);
 var r2=mkRow();r2.appendChild(mkBtn('ZOOM PUNCH FINDER',zoomPunch,'f43b3'));r2.appendChild(mkBtn('RGB SPLIT SCHEDULER',rgbSplit,'f43b4'));card.appendChild(r2);
 var r3=mkRow();r3.appendChild(mkBtn('FLASH CUT COUNTER',flashCount,'f43b5'));r3.appendChild(mkBtn('FILM BURN BREAKS',filmBurn,'f43b6'));card.appendChild(r3);
 var r4=mkRow();r4.appendChild(mkBtn('LIGHT LEAK SPOTS',lightLeak,'f43b7'));r4.appendChild(mkBtn('SPEED RAMP GUIDE',speedRamp,'f43b8'));card.appendChild(r4);
 var r5=mkRow();r5.appendChild(mkBtn('ECHO TRAIL PLANNER',echoTrail,'f43b9'));r5.appendChild(mkBtn('FX SHEET .TXT',fxSheet,'f43b10'));card.appendChild(r5);
 var note=document.createElement('div');note.className='note';note.id='f43note';note.textContent='fx lab plans the visual effects: a shake beat map, a glitch cut planner, zoom punch targets, an rgb split scheduler, a flash cut counter with spacing rules, film burn breaks, light leak spots, a speed ramp guide, an echo trail planner and a downloadable fx sheet.';
 card.appendChild(note);
 var hs=document.querySelectorAll('.card h2'),anchor=null;
 for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('HOOK LAB')>=0){anchor=hs[i].parentElement;break}}
 if(anchor){if(anchor.nextSibling){anchor.parentElement.insertBefore(card,anchor.nextSibling)}else{anchor.parentElement.appendChild(card)}}
 else{var ap=document.querySelector('#panelcol')||document.body;ap.appendChild(card)}
 log('fx lab live - shake beat map, glitch cut planner, zoom punch finder, rgb split scheduler, flash cut counter, film burn breaks, light leak spots, speed ramp guide, echo trail planner, fx sheet');
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',mount)}else{mount()}
})();