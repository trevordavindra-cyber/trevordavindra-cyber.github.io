'use strict'; /* up27.js - SHORTFORGE FORGE 38 VOICE LAB (Nov 25 2026) v1 */
(function(){
if(window.__sfup27){return;}
window.__sfup27=1;
function need(){if(!window.SCENES||!SCENES.length){glog('forge a script first (FORGE 38 tools need scenes)',0);return false}return true}
function glog(m,hl){try{step(m,hl)}catch(e){console.log('[forge38]',m)}}
function mkBtn(id,label,fn){var b=document.createElement('button');b.id=id;b.textContent=label;b.style.cssText='background:#0b1418;border:1px solid #2de2ff;color:#eaffff;font:700 10px monospace;padding:6px 10px;margin:3px;cursor:pointer;border-radius:6px';b.addEventListener('click',function(){try{if(need())fn()}catch(e){glog('forge38 error: '+e.message,0)}});return b}
function dlB(txt,name){try{var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));a.download=name;a.style.display='none';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a)},200)}catch(e){glog('download blocked: '+e.message,0)}}
function title(){return String((window.META&&META.title)||'this topic')}
function txtOf(s){return String((s&&(s.text||s.caption||s.line||s.script||s.narration))||imgOf(s)||'')}
function imgOf(s){return String((s&&(s.img||s.image||s.prompt))||'')}
function words(s){return String(s||'').replace(/\s+/g,' ').trim().split(' ').filter(Boolean)}
function allText(){return SCENES.map(txtOf).join(' ')}
var R=window.__sfvoice=window.__sfvoice||{};
function voiceScan(){
 var per=SCENES.map(function(s){return words(txtOf(s)).length});
 var tot=per.reduce(function(a,b){return a+b},0);
 var dur=SCENES.reduce(function(a,s){var d=(parseFloat(s.end)-parseFloat(s.start))||0;return a+d},0);
 var wpm=dur>0?Math.round(tot/(dur/60)):0;
 R.scan=tot+' narration words across '+SCENES.length+' scenes, '+Math.round(dur)+'s runtime, pace '+wpm+' wpm';
 glog('VOICE SCAN: '+tot+' words / '+SCENES.length+' scenes, '+wpm+' wpm',1);
}
function paceMap(){
 R.pace='pace map: conversational TikTok narration sits at 150-165 wpm - under 140 reads sleepy, over 190 reads rushed; match the scene cut, never the stopwatch';
 glog('PACE MAP: 150-165 wpm target; under 140 sleepy, over 190 rushed',1);
}
function tonePick(){
 var t=title().toLowerCase();
 var tone=/scam|danger|warning|stop|never/.test(t)?'urgent: short punchy sentences, tighter pace 165-175':
  /how|guide|build|make/.test(t)?'teacher: warm and steady, 150-160 wpm, land the numbers':
  'curious: conversational 150-160 wpm, lift the hook line slightly louder than the rest';
 R.tone=tone;
 glog('TONE PICK: '+tone,1);
}
function pausePlan(){
 R.pause='pause plan: 0.4s dead air after the hook line and 0.5s before the final CTA - the two pauses that lift retention the most, everywhere else keep it rolling';
 glog('PAUSE PLAN: 0.4s after hook, 0.5s before CTA',1);
}
function emphasis(){
 var w=words(allText()).filter(function(x){return x.length>6});
 var pick=w.slice(0,3).map(function(x){return x.replace(/[^\w]/g,'')}).filter(Boolean);
 R.emph='emphasis: stress 2-3 power words total, never a whole sentence - your longest words: '+(pick.join(', ')||'(short script)')+'; louder is not emphasis, slower plus a half-beat before is';
 glog('EMPHASIS: stress 2-3 power words: '+(pick.join(', ')||'none'),1);
}
function micFix(){
 R.mic='mic fix: phone mic 6-8 inches off-axis at the mouth, peaks under -12dB, then normalize the whole track to about -14 LUFS so TikTok compression never crushes the voice';
 glog('MIC FIX: 6-8 inches, peaks under -12dB, normalize -14 LUFS',1);
}
function voiceSync(){
 R.sync='voice sync: start narration 0.5s AFTER the first scene cut so the visual pops first, and never let a new line start inside a fast transition - audio masking kills scene reads';
 glog('VOICE SYNC: narration starts 0.5s after the first cut',1);
}
function voiceTest(){
 var t=allText().split(/[.!?]/).filter(function(s){return s.trim()}).map(function(s){return s.trim().length});
 var hard=t.filter(function(n){return n>120}).length;
 R.test='voice test: read the script aloud once at full pace before export - '+t.length+' sentences, '+hard+' of them over 2 breaths long; any line you stumble on twice, rewrite it, never re-record around it';
 glog('VOICE TEST: '+t.length+' sentences read-aloud, '+hard+' long ones flagged',1);
}
function voiceScore(){
 var s=100;var notes=[];
 var per=SCENES.map(function(x){return words(txtOf(x)).length});
 var tot=per.reduce(function(a,b){return a+b},0);
 var dur=SCENES.reduce(function(a,x){var d=(parseFloat(x.end)-parseFloat(x.start))||0;return a+d},0);
 var wpm=dur>0?Math.round(tot/(dur/60)):0;
 if(!wpm){s-=30;notes.push('no runtime on scenes -30')}else if(wpm<140){s-=15;notes.push('under 140 wpm -15')}else if(wpm>190){s-=15;notes.push('over 190 wpm -15')}
 var sent=allText().split(/[.!?]/).filter(function(x){return x.trim()}).length;
 if(sent&&tot/sent>22){s-=15;notes.push('sentences over ~22 words avg -15')}
 if(!/[?]/.test(allText())){s-=10;notes.push('no question rhythm in the read -10')}
 R.score=s;R.notes=notes.join(', ');
 glog('VOICE SCORE: '+s+'/100'+(notes.length?' ('+notes+')':' (clean)'),1);
}
function voiceSheet(){
 var lines=['FORGE 38 VOICE LAB - '+new Date().toISOString(),'TITLE: '+title(),
  'SCAN: '+(R.scan||''),'PACE: '+(R.pace||''),'TONE: '+(R.tone||''),'PAUSE: '+(R.pause||''),
  'EMPHASIS: '+(R.emph||''),'MIC: '+(R.mic||''),'SYNC: '+(R.sync||''),'TEST: '+(R.test||''),
  'SCORE: '+(R.score!==undefined?R.score+'/100':'run VOICE SCORE')];
 dlB(lines.join('\n'),'forge38_voice_sheet.txt');
 glog('VOICE SHEET: saved forge38_voice_sheet.txt',1);
}
function mount(){
 var bp=document.getElementById('buttonpool')||document.querySelector('.buttonpool')||document.getElementById('btns')||document.body;
 if(!bp||document.getElementById('g31row'))return;
 var row=document.createElement('div');row.id='g31row';row.style.cssText='margin:6px 0';
 var h=document.createElement('div');h.textContent='FORGE 38 VOICE LAB';h.style.cssText='color:#2de2ff;font:700 11px monospace;margin:4px 3px';row.appendChild(h);
 var btns=document.createElement('div');btns.style.cssText='display:flex;flex-wrap:wrap';row.appendChild(btns);
 var anchor=bp.querySelector('.rowbtns');if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(row,anchor);else bp.appendChild(row);
 btns.appendChild(mkBtn('g31b1','VOICE SCAN',voiceScan));
 btns.appendChild(mkBtn('g31b2','PACE MAP',paceMap));
 btns.appendChild(mkBtn('g31b3','TONE PICK',tonePick));
 btns.appendChild(mkBtn('g31b4','PAUSE PLAN',pausePlan));
 btns.appendChild(mkBtn('g31b5','EMPHASIS',emphasis));
 btns.appendChild(mkBtn('g31b6','MIC FIX',micFix));
 btns.appendChild(mkBtn('g31b7','VOICE SYNC',voiceSync));
 btns.appendChild(mkBtn('g31b8','VOICE TEST',voiceTest));
 btns.appendChild(mkBtn('g31b9','VOICE SCORE',voiceScore));
 btns.appendChild(mkBtn('g31b10','VOICE SHEET',voiceSheet));
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',mount)}else{mount()}
console.log('[shortforge up27.js v1] voice lab loaded');
})();