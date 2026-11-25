'use strict';
/* up23.js - SHORTFORGE FORGE 30 HOOK LAB (Nov 25 2026) v1 */
(function(){
if(window.__sfup23){return;}
window.__sfup23=1;
function need(){if(!window.SCENES||!SCENES.length){glog('forge a script first (FORGE 30 tools need scenes)',0);return false}return true}
function glog(m,hl){try{step(m,hl)}catch(e){console.log('[forge30]',m)}}
function mkBtn(id,label,fn){var b=document.createElement('button');b.id=id;b.textContent=label;b.style.cssText='background:#0b1418;border:1px solid #2de2ff;color:#eaffff;font:700 10px monospace;padding:6px 10px;margin:3px;cursor:pointer;border-radius:6px';b.addEventListener('click',function(){try{if(need())fn()}catch(e){glog('forge30 error: '+e.message,0)}});return b}
function dlB(txt,name){try{var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));a.download=name;a.style.display='none';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a)},200)}catch(e){glog('download blocked: '+e.message,0)}}
function title(){return String((window.META&&META.title)||'this topic')}
function txtOf(s){return String((s&&(s.text||s.caption||s.line||s.script||s.narration))||imgOf(s)||'')}
function imgOf(s){return String((s&&(s.img||s.image||s.prompt))||'')}
function words(s){return String(s||'').replace(/\s+/g,' ').trim().split(' ').filter(Boolean)}
function firstLine(){var s=SCENES[0]||{};var t=txtOf(s).replace(/^\W+/,'').trim();return t||('this is about '+title())}
function isQ(t){return /\?/.test(t)}
function isNum(t){return /^\d|\b\d+ (things|ways|signs|rules|mistakes|reasons)\b/i.test(t)}
function isYou(t){return /\byou(r)?\b/i.test(t)}
function isNeg(t){return /\b(stop|never|don't|dont|stop doing|nobody|wrong|worst|mistake)\b/i.test(t)}
function hookVariants(){
 var t=title();var f=words(firstLine()).slice(0,8).join(' ');
 return [
  ['question hook',t+'? nobody tells you the real answer'],
  ['number hook','3 things about '+t+' that sound fake but are true'],
  ['negative hook','stop doing '+t+' like this (it costs you the payoff)'],
  ['cold open hook','nobody talks about this part of '+t],
  ['you hook','if you ever tried '+t+', you know the first mistake']
 ];
}
function hookScoreCalc(){
 var f=firstLine();var s=0;var notes=[];
 var w=words(f).length;
 if(w>0&&w<=12){s+=20}else{notes.push('first line is '+(w||'empty')+' words, keep it under 12');}
 if(isQ(f)||isNum(f)){s+=20}else{notes.push('no question or number in the open');}
 if(isYou(f)){s+=15}else{notes.push('open does not address the viewer (you)');}
 if(isNeg(f)){s+=15}else{notes.push('no tension or warning word');}
 if(!/\b(hi|hello|welcome|guys|hey|subscribe)\b/i.test(f)){s+=15}else{notes.push('opens with a greeting, cut it');}
 var cut=firstCut();
 if(cut<=2.5){s+=15}else{notes.push('first cut at '+cut.toFixed(1)+'s, move it under 2.5s');}
 if(s>100)s=100;if(s<0)s=0;
 return {s:s,notes:notes,first:f};
}
function firstCut(){
 var d=SDUR&&SDUR[0]!==undefined?SDUR[0]:4;
 return Math.max(0.6,Math.min(3.5,d*0.6));
}
function hookPick(){
 var f=firstLine();
 glog('HOOK PICK: open on the strongest claim, not the intro. first line now: "'+f.slice(0,60)+'" - if it does not ask, shock or promise in 3 seconds, swap it with a variant (HOOK A/B)',1);
}
function hookFirst(){
 var v=hookVariants()[2];
 glog('FIRST LINE v2: "'+v[1]+'" - 6 words, negative frame, no greeting',1);
}
function hook3sec(){
 var r=hookScoreCalc();
 var hold=(SCENES[0]&&(SDUR[0]||4))||4;
 var ok=hold<=3?'scene 1 is '+hold.toFixed(1)+'s, holds the thumb-stop': 'scene 1 runs '+hold.toFixed(1)+'s, cut it to 2.8s max for the swipe window';
 glog('3-SEC TEST: '+ok+' | open line scores '+r.s+'/100 on the first 3 seconds',1);
}
function hookTypes(){
 var t=title();
 var list=['QUESTION - "'+t+'?" then answer late','NUMBER - "3 things nobody counts"','CONTRAST - "everyone does X, pros do Y"','STAKES - "this mistake costs you the whole edit"','MID-ACTION - start mid-scene, explain after'];
 glog('HOOK TYPES: '+list.join(' | '),1);
}
function patternCut(){
 var n=SCENES.length;
 var plan='cut plan: s1 at 0.6s, then cuts at 1.9s, 3.4s, then every 1.5-2s for '+(n-1)+' more scenes; change angle or text at every cut';
 glog('PATTERN CUT: '+plan,1);
}
function coldOpen(){
 var v=hookVariants()[3];
 glog('COLD OPEN: drop straight into scene 2 with "'+v[1]+'" and show the payoff before the setup',1);
}
function hookAB(){
 var v=hookVariants();
 glog('HOOK A/B: A "'+v[1][1]+'" vs B "'+v[2][1]+'" - post A first, swap to B at 48h if the 3s view rate lags',1);
}
function bait(){
 var t=title();
 glog('RETENTION BAIT: at 60% runtime say "the last one is the one everyone gets wrong" so the payoff for '+t+' stays unwatched until the end',1);
}
function hookScore(){
 var r=hookScoreCalc();
 var v=r.s<70?'under 70: fix '+(r.notes.join(', ')||'the open items'):r.s<85?'70-84: solid, tighten '+(r.notes[0]||'the weakest item'):'85+: hook is ship-ready';
 glog('HOOK SCORE '+r.s+'/100 '+v,1);
}
function hookSheet(){
 var r=hookScoreCalc();var v=hookVariants();
 var lines=['FORGE 30 HOOK SHEET - '+title(),'generated '+new Date().toISOString(),SCENES.length+' scenes','','CURRENT OPEN: '+r.first,'SCORE: '+r.s+'/100'+(r.notes.length?' - fix: '+r.notes.join(', '):' - ship-ready'),''];
 lines.push('VARIANTS:');
 v.forEach(function(p){lines.push('  '+p[0]+': '+p[1])});
 lines.push('','FIRST CUT: '+firstCut().toFixed(1)+'s (under 2.5s rule)','PATTERN: cuts every 1.5-2s, angle or text change each cut','BAIT: tease the payoff, reveal at 85-95% runtime');
 lines.push('','rules: first line under 12 words, question or number in the open, address the viewer, no greeting, first cut under 2.5s');
 dlB(lines.join('\n'),'forge30_hook_sheet.txt');
 glog('HOOK SHEET downloaded (forge30_hook_sheet.txt)',1);
}
function mount(){
 var bp=document.getElementById('boardPanel');if(!bp||bp.querySelector('#g27b1'))return;
 var row=document.createElement('div');row.style.cssText='margin:8px 0';
 var h=document.createElement('div');h.textContent='FORGE 30 HOOK LAB';h.style.cssText='color:#2de2ff;font:700 11px monospace;margin:4px 3px';row.appendChild(h);
 var btns=document.createElement('div');btns.style.cssText='display:flex;flex-wrap:wrap';row.appendChild(btns);
 var anchor=bp.querySelector('.rowbtns');if(anchor)bp.insertBefore(row,anchor);else bp.appendChild(row);
 btns.appendChild(mkBtn('g27b1','HOOK PICK',hookPick));
 btns.appendChild(mkBtn('g27b2','FIRST LINE',hookFirst));
 btns.appendChild(mkBtn('g27b3','3-SEC TEST',hook3sec));
 btns.appendChild(mkBtn('g27b4','HOOK TYPES',hookTypes));
 btns.appendChild(mkBtn('g27b5','PATTERN CUT',patternCut));
 btns.appendChild(mkBtn('g27b6','COLD OPEN',coldOpen));
 btns.appendChild(mkBtn('g27b7','HOOK A/B',hookAB));
 btns.appendChild(mkBtn('g27b8','RETENTION BAIT',bait));
 btns.appendChild(mkBtn('g27b9','HOOK SCORE',hookScore));
 btns.appendChild(mkBtn('g27b10','HOOK SHEET',hookSheet));
}
function boot(){
 if(document.getElementById('boardPanel')){mount();return}
 var n=0,iv=setInterval(function(){n++;if(document.getElementById('boardPanel')){clearInterval(iv);mount()}else if(n>120){clearInterval(iv)}},250);
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',boot)}else{boot()}
})();
