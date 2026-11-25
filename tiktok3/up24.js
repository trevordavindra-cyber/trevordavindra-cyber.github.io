'use strict';
/* up24.js - SHORTFORGE FORGE 32 OUTRO LAB (Nov 25 2026) v1 */
(function(){
if(window.__sfup24){return;}
window.__sfup24=1;
function need(){if(!window.SCENES||!SCENES.length){glog('forge a script first (FORGE 32 tools need scenes)',0);return false}return true}
function glog(m,hl){try{step(m,hl)}catch(e){console.log('[forge32]',m)}}
function mkBtn(id,label,fn){var b=document.createElement('button');b.id=id;b.textContent=label;b.style.cssText='background:#0b1418;border:1px solid #2de2ff;color:#eaffff;font:700 10px monospace;padding:6px 10px;margin:3px;cursor:pointer;border-radius:6px';b.addEventListener('click',function(){try{if(need())fn()}catch(e){glog('forge32 error: '+e.message,0)}});return b}
function dlB(txt,name){try{var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));a.download=name;a.style.display='none';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a)},200)}catch(e){glog('download blocked: '+e.message,0)}}
function title(){return String((window.META&&META.title)||'this topic')}
function txtOf(s){return String((s&&(s.text||s.caption||s.line||s.script||s.narration))||imgOf(s)||'')}
function imgOf(s){return String((s&&(s.img||s.image||s.prompt))||'')}
function words(s){return String(s||'').replace(/\s+/g,' ').trim().split(' ').filter(Boolean)}
function durOf(s){var d=parseFloat(s&&s.dur);if(!(d>0)){var a=parseFloat(s&&s.start),b=parseFloat(s&&s.end);if(b>a)d=b-a;}if(!(d>0))d=Math.max(words(txtOf(s)).length/2.6,2.5);return d}
function total(){var t=0;SCENES.forEach(function(s){t+=durOf(s)});return t}
function lastLine(){var s=SCENES[SCENES.length-1]||{};return txtOf(s).replace(/^\W+/,'').trim()||('the end of '+title())}
function firstLine(){var s=SCENES[0]||{};return txtOf(s).replace(/^\W+/,'').trim()||('this is about '+title())}
var R=window.__sfoutro=window.__sfoutro||{};
function outroPick(){
 var last=SCENES[SCENES.length-1]||{};
 R.pick='outro lives in the last scene only: close the loop on the opener, one ask max, no recap of the video, no "thanks for watching"';
 glog('OUTRO PICK: last scene runs '+durOf(last).toFixed(1)+'s | "'+lastLine().slice(0,60)+'" | rule: '+R.pick,1);
}
function loopClose(){
 R.loop='loop close: final line answers the first line so the rewatch feels intentional; looping viewers count as 2 views';
 glog('LOOP CLOSE: opener "'+firstLine().slice(0,60)+'" -> closer "'+lastLine().slice(0,60)+'" | '+R.loop,1);
}
function askMenu(){
 R.asks=[
  ['follow','follow, part 2 shows the fix'],
  ['comment','comment A or B, I will settle it'],
  ['save','save this, you will need it later'],
  ['share','send this to the one friend who does this']
 ];
 R.menu='ONE ask per video. follow = new payoff promised, comment = a question with two named sides, save = future utility, share = a named person. never stack two asks.';
 glog('ASK MENU: '+R.asks.map(function(a){return a[0]+' -> "'+a[1]+'"'}).join(' | ')+' | '+R.menu,1);
}
function endCard(){
 R.card='end card: 3 beats max, text under 8 words, hold 1.5s, brand color only, no new information after the ask';
 glog('END CARD: '+R.card,1);
}
function cutWindow(){
 var t=total();var cut=Math.max(t-1.5,0);
 R.cut={t:t,cut:cut};
 glog('CUT WINDOW: runtime '+t.toFixed(1)+'s, hard cut the ask at '+cut.toFixed(1)+'s so the loop lands back on scene 1 with no dead air',1);
}
function silentClose(){
 R.silent='silent close: cut audio 0.3s before the last frame, viewers who rewatch with sound off get a clean loop instead of a clipped word';
 glog('SILENT CLOSE: '+R.silent,1);
}
function seriesHook(){
 var n=SCENES.length;
 R.series='series hook: tease part 2 with a 4-word promise tied to the unsolved bit, "the fix is worse" beats "part 2 coming", post part 2 within 24h while the algo is hot';
 glog('SERIES HOOK ('+n+' scenes): '+R.series,1);
}
function outroAB(){
 var a=(R.asks&&R.asks[0]&&R.asks[0][1])||'follow, part 2 shows the fix';
 var b='save this for later, it works better than you think';
 R.ab=[a,b];
 glog('OUTRO A/B: A "'+a+'" vs B "'+b+'" | A wins on follow-through, B wins on saves; post two cuts 6h apart, keep whichever wins the 24h rate',1);
}
function outroScore(){
 var c=(R.asks&&R.asks[0][1])||'follow for more';
 var s=0;var notes=[];
 if(words(c).length<=7){s+=25}else{notes.push('over 7 words')}
 if(/\bfollow|comment|save|share\b/i.test(c)){s+=25}else{notes.push('no named ask verb')}
 if(/\bpart 2|later|fix|need|settle\b/i.test(c)){s+=25}else{notes.push('no payoff tied')}
 if(!/\bthanks for watching|like and subscribe|smash\b/i.test(c)){s+=15}else{notes.push('legacy youtube phrasing')}
 if(R.loop){s+=10}else{notes.push('run LOOP CLOSE first')}
 if(s>100)s=100;
 R.score={c:c,s:s,notes:notes};
 glog('OUTRO SCORE: '+s+'/100 on "'+c+'"'+(notes.length?' | fix: '+notes.join(', ')+' | rescore clears it':' | ship it'),1);
}
function outroSheet(){
 var asks=R.asks||[['run ASK MENU','']];
 var lines=['FORGE 32 OUTRO LAB','scenes: '+SCENES.length,'runtime: '+total().toFixed(1)+'s','','PICK RULE: '+(R.pick||'run OUTRO PICK'),'LOOP CLOSE: '+(R.loop||'run LOOP CLOSE'),'ASK MENU:'];
 asks.forEach(function(a,i){lines.push('  '+(i+1)+'. '+a[0]+': '+a[1])});
 lines.push('END CARD: '+(R.card||'run END CARD'),'CUT WINDOW: '+(R.cut?('ask at '+R.cut.cut.toFixed(1)+'s of '+R.cut.t.toFixed(1)+'s'):'run CUT WINDOW'),'SILENT CLOSE: '+(R.silent||'run SILENT CLOSE'),'SERIES HOOK: '+(R.series||'run SERIES HOOK'),'SCORE: '+(R.score?R.score.s+'/100 on "'+R.score.c+'"':'run OUTRO SCORE'),'','rules: one ask per video, last scene only, close the loop on the opener, no recap');
 dlB(lines.join('\n'),'forge32_outro_sheet.txt');
 glog('OUTRO SHEET downloaded (forge32_outro_sheet.txt)',1);
}
function mount(){
 var bp=document.getElementById('boardPanel');if(!bp||bp.querySelector('#g28b1'))return;
 var row=document.createElement('div');row.style.cssText='margin:8px 0';
 var h=document.createElement('div');h.textContent='FORGE 32 OUTRO LAB';h.style.cssText='color:#2de2ff;font:700 11px monospace;margin:4px 3px';row.appendChild(h);
 var btns=document.createElement('div');btns.style.cssText='display:flex;flex-wrap:wrap';row.appendChild(btns);
 var anchor=bp.querySelector('.rowbtns');if(anchor)bp.insertBefore(row,anchor);else bp.appendChild(row);
 btns.appendChild(mkBtn('g28b1','OUTRO PICK',outroPick));
 btns.appendChild(mkBtn('g28b2','LOOP CLOSE',loopClose));
 btns.appendChild(mkBtn('g28b3','ASK MENU',askMenu));
 btns.appendChild(mkBtn('g28b4','END CARD',endCard));
 btns.appendChild(mkBtn('g28b5','CUT WINDOW',cutWindow));
 btns.appendChild(mkBtn('g28b6','SILENT CLOSE',silentClose));
 btns.appendChild(mkBtn('g28b7','SERIES HOOK',seriesHook));
 btns.appendChild(mkBtn('g28b8','OUTRO A/B',outroAB));
 btns.appendChild(mkBtn('g28b9','OUTRO SCORE',outroScore));
 btns.appendChild(mkBtn('g28b10','OUTRO SHEET',outroSheet));
}
function boot(){
 if(document.getElementById('boardPanel')){mount();return}
 var n=0,iv=setInterval(function(){n++;if(document.getElementById('boardPanel')){clearInterval(iv);mount()}else if(n>120){clearInterval(iv)}},250);
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',boot)}else{boot()}
})();