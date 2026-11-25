'use strict';
/* up14.js - SHORTFORGE v14 PACING LAB (Nov 25 2026) */
(function(){
if(window.__sfup14){return;}
window.__sfup14=1;
function need(){if(!window.SCENES||!SCENES.length){glog('forge a script first (FORGE 14 tools need scenes)',0);return false}return true}
function glog(m,hl){try{step(m,hl)}catch(e){console.log('[forge14]',m)}}
function words(s){return String(s||'').trim().split(/\s+/).filter(Boolean)}
function mkBtn(id,label,fn){var b=document.createElement('button');b.id=id;b.textContent=label;b.style.cssText='background:#0b1418;border:1px solid #2de2ff;color:#eaffff;font:700 10px monospace;padding:6px 10px;margin:3px;cursor:pointer;border-radius:6px';b.addEventListener('click',function(){try{if(need())fn()}catch(e){glog('forge14 error: '+e.message,0)}});return b}
function dlB(txt,name){try{var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));a.download=name;a.style.display='none';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a)},200)}catch(e){glog('download blocked: '+e.message,0)}}
function title(){return String((window.META&&META.title)||'this topic')}
function tot(){var t=0;SDUR.forEach(function(d){t+=d});return t}
function textOf(s){return String((s&&(s.t||s.cap||s.text||s.vo||s.narration||s.line))||'')}
function mount(){
 var bp=document.getElementById('boardPanel');if(!bp||bp.querySelector('#g14b1'))return;
 var row=document.createElement('div');row.style.cssText='margin-top:12px';
 var h=document.createElement('div');h.textContent='FORGE 14 PACING LAB';h.style.cssText='color:#2de2ff;font:700 11px monospace;margin:4px 3px';row.appendChild(h);
 var btns=document.createElement('div');btns.style.cssText='display:flex;flex-wrap:wrap';row.appendChild(btns);
 var anchor=bp.querySelector('.rowbtns');if(anchor)bp.insertBefore(row,anchor);else bp.appendChild(row);
 btns.appendChild(mkBtn('g14b1','PACING MAP',paceMap));
 btns.appendChild(mkBtn('g14b2','SCENE BALANCE',sceneBalance));
 btns.appendChild(mkBtn('g14b3','DURATION SWEEP',durSweep));
 btns.appendChild(mkBtn('g14b4','ENERGY CURVE',energyCurve));
 btns.appendChild(mkBtn('g14b5','CUT RHYTHM',cutRhythm));
 btns.appendChild(mkBtn('g14b6','WORD BUDGET',wordBudget));
 btns.appendChild(mkBtn('g14b7','SILENCE CHECK',silenceCheck));
 btns.appendChild(mkBtn('g14b8','SPEEDUP SPOT',speedupSpot));
 btns.appendChild(mkBtn('g14b9','PACING SCORE',paceScore));
 btns.appendChild(mkBtn('g14b10','PACING SHEET',paceSheet));
 glog('FORGE 14 PACING LAB ready: 10 tools',1);
}
function paceMap(){
 var out=[];var longest=-1,li=0;
 SCENES.forEach(function(s,i){var w=words(textOf(s)).length;var d=SDUR[i]||4;var p=w/d;if(p>longest){longest=p;li=i}out.push('s'+(i+1)+' '+d.toFixed(1)+'s/'+w+'w '+(p<2?'slow':p<3.2?'ok':'rushed'))});
 glog('PACING MAP ['+title()+']: '+out.join(' | ')+' | slowest-feeling scene is s'+(li+1)+', trim its words or tighten its hold',1);
}
function sceneBalance(){
 var ds=SDUR.slice();var avg=0;ds.forEach(function(d){avg+=d});avg=avg/ds.length;
 var off=[];ds.forEach(function(d,i){if(Math.abs(d-avg)>avg*0.6)off.push('s'+(i+1)+' '+d.toFixed(1)+'s')});
 glog('SCENE BALANCE: avg '+avg.toFixed(1)+'s across '+ds.length+' scenes'+(off.length?' | outliers: '+off.join(', ')+' - outliers are fine only if they carry the story beat':' | clean spread, every scene sits near the average'),1);
}
function durSweep(){
 var t=tot();
 var v=t<=30?'tight: exactly scroll-stopping length, protect every second':t<=45?'in the pocket: most-algorithm sweet zone':t<=60?'long but workable: you are paying for it in retention, cut the weakest scene':'over: '+Math.round(t)+'s is a skip risk, move the last scene idea into a part 2';
 glog('DURATION SWEEP: total '+t.toFixed(1)+'s | '+v,1);
}
function energyCurve(){
 var parts=[];var n=SCENES.length;
 for(var k=0;k<n;k++){var p=Math.round((k/(Math.max(1,n-1)))*10);parts.push(p)}
 glog('ENERGY CURVE: '+parts.join('-')+' (0 calm .. 10 peak) | ideal shape builds to a 9-10 peak at the final third, if yours flattens mid-video add the stat or twist there',1);
}
function cutRhythm(){
 var gaps=[];for(var i=1;i<SDUR.length;i++)gaps.push((SDUR[i-1]+SDUR[i])/2);
 var same=0;for(var j=1;j<gaps.length;j++)if(Math.abs(gaps[j]-gaps[j-1])<0.4)same++;
 glog('CUT RHYTHM: '+SCENES.length+' scenes, avg cut every '+(tot()/SCENES.length).toFixed(1)+'s'+(same>gaps.length/2?' | too metronome-flat: vary cut lengths, one long hold then two quick cuts reads alive':' | varied rhythm, good'),1);
}
function wordBudget(){
 var budget=Math.round(tot()*2.4);
 var have=0;SCENES.forEach(function(s){have+=words(textOf(s)).length});
 glog('WORD BUDGET: '+tot().toFixed(1)+'s fits about '+budget+' spoken words, script carries '+have+(have>budget*1.15?' | over: reading it fast will still not fit, cut '+Math.max(1,Math.round((have-budget)*0.8))+' words':have<budget*0.7?' | under: room for one more beat or a stronger close':' | on budget'),1);
}
function silenceCheck(){
 var dead=0;SCENES.forEach(function(s,i){var w=words(textOf(s)).length;var d=SDUR[i]||4;if(w/d<1.2&&i>0&&i<SCENES.length-1)dead++});
 glog('SILENCE CHECK: '+(dead===0?'no dead middle scenes':dead+' mid scene(s) run near-silent, dead air in the middle is where retention dies - fill with a caption stat or b-roll beat'),1);
}
function speedupSpot(){
 var best=0,bi=0;SCENES.forEach(function(s,i){var d=SDUR[i]||4;if(d>best){best=d;bi=i}});
 glog('SPEEDUP SPOT: s'+(bi+1)+' at '+(SDUR[bi]||0).toFixed(1)+'s is your longest hold | move 30% of its words into the next scene and trim it to '+(best*0.7).toFixed(1)+'s, the edit gains urgency without losing info',1);
}
function paceScore(){
 var s=100;var t=tot();
 if(t>60)s-=25;else if(t>45)s-=10;
 var slow=0;for(var i=0;i<SDUR.length;i++){var d=SDUR[i]||4;var w=words(textOf(SCENES[i])).length;if(d>0&&w/d<1.2)slow++}
 s-=slow*8;
 if(s>0&&SCENES.length<4)s-=10;
 s=Math.max(10,Math.min(99,s));
 glog('PACING SCORE '+s+'/100 | '+(s>=80?'ship it':s>=60?'tighten the flagged scenes and it clears 80':'rework pacing before filming, this script drags'),1);
}
function paceSheet(){
 var L=['SHORTFORGE FORGE 14 PACING SHEET','topic: '+title(),'date: '+new Date().toISOString().slice(0,10),'','total: '+tot().toFixed(1)+'s across '+SCENES.length+' scenes',''];
 SCENES.forEach(function(s,i){L.push('scene '+(i+1)+': '+(SDUR[i]||0).toFixed(1)+'s, '+words(textOf(s)).length+'w, '+(words(textOf(s)).length/(SDUR[i]||4)).toFixed(1)+' w/s | '+textOf(s).slice(0,80))});
 L.push('','word budget: ~'+Math.round(tot()*2.4)+' spoken words for this length');
 dlB(L.join('\n'),'pacing_sheet.txt');
 glog('PACING SHEET: pacing_sheet.txt downloaded',1);
}
function boot(){var n=0;(function go(){if(window.SCENES&&document.getElementById('boardPanel')){mount();return}if(n++<200)setTimeout(go,150)})()}
if(document.readyState==='complete'||document.readyState==='interactive')boot();else document.addEventListener('DOMContentLoaded',boot);
})();
