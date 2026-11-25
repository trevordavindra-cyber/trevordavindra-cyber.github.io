'use strict';
/* up25.js - SHORTFORGE FORGE 34 BEAT LAB (Nov 25 2026) v1.1 */
(function(){
if(window.__sfup25){return;}
window.__sfup25=1;
function need(){if(!window.SCENES||!SCENES.length){glog('forge a script first (FORGE 34 tools need scenes)',0);return false}return true}
function glog(m,hl){try{step(m,hl)}catch(e){console.log('[forge34]',m)}}
function mkBtn(id,label,fn){var b=document.createElement('button');b.id=id;b.textContent=label;b.style.cssText='background:#0b1418;border:1px solid #2de2ff;color:#eaffff;font:700 10px monospace;padding:6px 10px;margin:3px;cursor:pointer;border-radius:6px';b.addEventListener('click',function(){try{if(need())fn()}catch(e){glog('forge34 error: '+e.message,0)}});return b}
function dlB(txt,name){try{var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));a.download=name;a.style.display='none';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a)},200)}catch(e){glog('download blocked: '+e.message,0)}}
function title(){return String((window.META&&META.title)||'this topic')}
function txtOf(s){return String((s&&(s.text||s.caption||s.line||s.script||s.narration))||imgOf(s)||'')}
function imgOf(s){return String((s&&(s.img||s.image||s.prompt))||'')}
function words(s){return String(s||'').replace(/\s+/g,' ').trim().split(' ').filter(Boolean)}
function durOf(s){var d=parseFloat(s&&s.dur);if(!(d>0)){var a=parseFloat(s&&s.start),b=parseFloat(s&&s.end);if(b>a)d=b-a;}if(!(d>0))d=Math.max(words(txtOf(s)).length/2.6,2.5);return d}
function total(){var t=0;SCENES.forEach(function(s){t+=durOf(s)});return t}
var R=window.__sfbeat=window.__sfbeat||{};
function bpmPick(){
 var t=total();
 var bpm=[95,110,128,140,160,174].reduce(function(b,c){return Math.abs(60*8/c-t)<Math.abs(60*8/b-t)?c:b});
 R.bpm=bpm;R.fit='runtime '+t.toFixed(1)+'s sits closest to '+bpm+' BPM at 8 bars ('+(60*8/bpm).toFixed(1)+'s), so cut on that grid';
 glog('BPM PICK: '+R.fit,1);
}
function beatGrid(){
 var bpm=R.bpm||bpmPick(),R2=R;R2.grid=[];
 var beat=60/bpm,bar=beat*4,n=Math.ceil(total()/bar);
 for(var i=0;i<n;i++){var at=i*bar;var sc=null,acc=0;for(var j=0;j<SCENES.length;j++){acc+=durOf(SCENES[j]);if(acc>at){sc=j;break}}
  R2.grid.push('bar '+(i+1)+' @'+at.toFixed(2)+'s scene '+(sc===null?SCENES.length:sc+1));}
 glog('BEAT GRID: '+n+' bars on the '+bpm+' grid. '+R2.grid.slice(0,4).join(' | ')+(n>4?' ...':'')+' (full grid in BEAT SHEET)',1);
}
function dropMark(){
 var t=total(),at=Math.min(t*0.35,t-2.5);R.drop='drop at '+at.toFixed(1)+'s: hardest cut + text punch right on it; scene before the drop carries the tension';
 glog('DROP MARK: '+R.drop,1);
}
function cutBeat(){
 var bpm=R.bpm||128;R.cut='cut on beat: every scene boundary snaps to the nearest bar line ('+bpm+' BPM, '+((60/bpm)*4).toFixed(2)+'s bars); drift under 0.15s or it reads as sloppy';
 glog('CUT ON BEAT: '+R.cut,1);
}
function pulseSync(){
 R.pulse='pulse sync: scale punch or zoom on every beat 1 of each bar, never every beat, or it strobes; text pops only on downbeats';
 glog('PULSE SYNC: '+R.pulse,1);
}
function bassHit(){
 var s=SCENES[0]||{};R.bass='bass hit on scene 1 at 0.5s: one sub drop under the hook line, duck the music -6dB for 0.4s so the line lands';
 glog('BASS HIT: '+R.bass,1);
}
function soundStack(){
 R.stack='sound stack, max 3 layers: 1 music bed, 1 riser/impact set, 1 foley (whoosh/keyboard). a 4th layer muddies phone speakers; mix on a phone, not monitors';
 glog('SOUND STACK: '+R.stack,1);
}
function trendBeat(){
 R.trend='trend beat: trending sounds live or die by the first 1.5s; start the sound BEFORE the visual hook so the audio pattern-match fires at 0.0s';
 glog('TREND BEAT: '+R.trend,1);
}
function beatScore(){
 var t=total(),s=100,notes=[];
 if(!(R.bpm)){s-=15;notes.push('run BPM PICK (-15)')}
 if(!(R.drop)){s-=15;notes.push('no drop marked (-15)')}
 if(!(R.cut)){s-=10;notes.push('cuts not beat-aligned (-10)')}
 if(!(R.pulse)){s-=10;notes.push('no pulse rule (-10)')}
 if(!(R.stack)){s-=10;notes.push('no sound stack rule (-10)')}
 if(!(R.bass)){s-=10;notes.push('no bass hit (-10)')}
 if(!(R.trend)){s-=10;notes.push('no trend-beat rule (-10)')}
 if(t<7||t>45){s-=10;notes.push('runtime off the 7-45s band (-10)')}
 R.score=s;
 glog('BEAT SCORE '+s+'/100'+(notes.length?' | fix: '+notes.join(', '):' | clean'),1);
}
function beatSheet(){
 var lines=['FORGE 34 BEAT LAB','topic: '+title(),'scenes: '+SCENES.length,'runtime: '+total().toFixed(1)+'s','',
  'BPM: '+(R.bpm||'run BPM PICK'),'FIT: '+(R.fit||''),'GRID:',' '+(R.grid||['run BEAT GRID']).join('\n '),
  'DROP: '+(R.drop||''),'CUTS: '+(R.cut||''),'PULSE: '+(R.pulse||''),'BASS: '+(R.bass||''),
  'STACK: '+(R.stack||''),'TREND: '+(R.trend||''),'SCORE: '+(R.score!==undefined?R.score+'/100':'run BEAT SCORE')];
 dlB(lines.join('\n'),'forge34_beat_sheet.txt');
 glog('BEAT SHEET: saved forge34_beat_sheet.txt',1);
}
function mount(){
 var bp=document.getElementById('buttonpool')||document.querySelector('.buttonpool')||document.getElementById('btns')||document.body;
 if(!bp||document.getElementById('g29row'))return;
 var row=document.createElement('div');row.id='g29row';row.style.cssText='margin:6px 0';
 var h=document.createElement('div');h.textContent='FORGE 34 BEAT LAB';h.style.cssText='color:#2de2ff;font:700 11px monospace;margin:4px 3px';row.appendChild(h);
 var btns=document.createElement('div');btns.style.cssText='display:flex;flex-wrap:wrap';row.appendChild(btns);
 var anchor=bp.querySelector('.rowbtns');if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(row,anchor);else bp.appendChild(row);
 btns.appendChild(mkBtn('g29b1','BPM PICK',bpmPick));
 btns.appendChild(mkBtn('g29b2','BEAT GRID',beatGrid));
 btns.appendChild(mkBtn('g29b3','DROP MARK',dropMark));
 btns.appendChild(mkBtn('g29b4','CUT ON BEAT',cutBeat));
 btns.appendChild(mkBtn('g29b5','PULSE SYNC',pulseSync));
 btns.appendChild(mkBtn('g29b6','BASS HIT',bassHit));
 btns.appendChild(mkBtn('g29b7','SOUND STACK',soundStack));
 btns.appendChild(mkBtn('g29b8','TREND BEAT',trendBeat));
 btns.appendChild(mkBtn('g29b9','BEAT SCORE',beatScore));
 btns.appendChild(mkBtn('g29b10','BEAT SHEET',beatSheet));
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',mount)}else{mount()}
console.log('[shortforge up25.js v1.1] beat lab loaded');
})();
