'use strict';
/* up16.js - SHORTFORGE v17 COVER LAB (Nov 25 2026) */
(function(){
if(window.__sfup16){return;}
window.__sfup16=1;
function need(){if(!window.SCENES||!SCENES.length){glog('forge a script first (FORGE 17 tools need scenes)',0);return false}return true}
function glog(m,hl){try{step(m,hl)}catch(e){console.log('[forge17]',m)}}
function words(s){return String(s||'').trim().split(/\s+/).filter(Boolean)}
function mkBtn(id,label,fn){var b=document.createElement('button');b.id=id;b.textContent=label;b.style.cssText='background:#0b1418;border:1px solid #2de2ff;color:#eaffff;font:700 10px monospace;padding:6px 10px;margin:3px;cursor:pointer;border-radius:6px';b.addEventListener('click',function(){try{if(need())fn()}catch(e){glog('forge17 error: '+e.message,0)}});return b}
function dlB(txt,name){try{var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));a.download=name;a.style.display='none';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a)},200)}catch(e){glog('download blocked: '+e.message,0)}}
function title(){return String((window.META&&META.title)||'this topic')}
function tot(){var t=0;SDUR.forEach(function(d){t+=d});return t}
function textOf(s){return String((s&&(s.t||s.cap||s.text||s.vo||s.narration||s.line))||'')}
function wc(s){return words(textOf(s)).length}
function roleOf(i,n){
 if(i===0)return 'hook';
 if(i===n-1)return 'outro';
 if(i===Math.floor(n/2))return 'midpoint';
 return 'body';
}
function mood(s){
 var t=textOf(s).toLowerCase();
 if(/reveal|secret|nobody|hidden|truth/.test(t))return 'reveal';
 if(/money|cash|rich|pay|dollar|price/.test(t))return 'money';
 if(/fast|now|quick|instant|hack/.test(t))return 'action';
 if(/story|remember|back then|years ago/.test(t))return 'story';
 if(/finally|last|bottom line|anyway/.test(t))return 'close';
 return 'info';
}
function coverPlan(){
 var best=0,bi=0;
 SCENES.forEach(function(s,i){
  var m=mood(s),v=(m==='reveal'||m==='money'||m==='action')?3:(m==='story'?2:1);
  if(wc(s)<8)v+=1;
  if(SDUR[i]&&SDUR[i]>4.5)v+=1;
  if(v>best){best=v;bi=i}
 });
 return bi;
}
function coverWords(){
 var i=coverPlan(),t=textOf(SCENES[i]);
 var w=words(t.replace(/[^\w\s'!?]/g,' ')).filter(function(x){return x.length>2});
 return w.slice(0,4).join(' ').toUpperCase();
}
function mount(){
 var bp=document.getElementById('boardPanel');if(!bp||bp.querySelector('#g17b1'))return;
 var row=document.createElement('div');row.style.cssText='margin-top:12px';
 var h=document.createElement('div');h.textContent='FORGE 17 COVER LAB';h.style.cssText='color:#2de2ff;font:700 11px monospace;margin:4px 3px';row.appendChild(h);
 var btns=document.createElement('div');btns.style.cssText='display:flex;flex-wrap:wrap';row.appendChild(btns);
 var anchor=bp.querySelector('.rowbtns');if(anchor)bp.insertBefore(row,anchor);else bp.appendChild(row);
 btns.appendChild(mkBtn('g17b1','COVER PICK',coverPick));
 btns.appendChild(mkBtn('g17b2','TEXT RULE',textRule));
 btns.appendChild(mkBtn('g17b3','FACE FRAME',faceFrame));
 btns.appendChild(mkBtn('g17b4','CONTRAST CHECK',contrastCheck));
 btns.appendChild(mkBtn('g17b5','COLOR POP',colorPop));
 btns.appendChild(mkBtn('g17b6','THUMB VARIANTS',thumbVariants));
 btns.appendChild(mkBtn('g17b7','CROP SAFE',cropSafe));
 btns.appendChild(mkBtn('g17b8','TITLE SYNC',titleSync));
 btns.appendChild(mkBtn('g17b9','COVER SCORE',coverScore));
 btns.appendChild(mkBtn('g17b10','COVER SHEET',coverSheet));
 glog('FORGE 17 COVER LAB ready: 10 tools',1);
}
function coverPick(){
 var i=coverPlan();
 glog('COVER PICK: s'+(i+1)+' is your cover frame ('+mood(SCENES[i])+' '+roleOf(i,SCENES.length)+', '+wc(SCENES[i])+'w, '+(SDUR[i]||4).toFixed(1)+'s) | the cover is picked for the scroll, not the story: highest-curiosity frame wins, not the climax',1);
}
function textRule(){
 var t=coverWords();
 glog('TEXT RULE: "'+t+'" max 4 words, 2 lines max, top third of frame | covers with 6+ words read as thumbnails nobody squints at',1);
}
function faceFrame(){
 glog('FACE FRAME: put the subject on the left third line, eyes on the upper third, and leave the right third for text | dead-center subject + text = overlap that reads as an ad',1);
}
function contrastCheck(){
 glog('CONTRAST CHECK: dark scrim gradient from bottom 60% under any light text, or 2px dark outline + drop shadow on text | pastel bg + white text with no scrim is the most common low-CTR cover mistake',1);
}
function colorPop(){
 glog('COLOR POP: one accent color for the key word only (pick the opposite of your bg hue), rest of the text stays white | a cover with 3 accent colors looks like a flyer, not a hook',1);
}
function thumbVariants(){
 var t=coverWords();
 glog('THUMB VARIANTS: (1) "'+t+'" full-bleed scene still, (2) same text zoomed crop on subject face, (3) text-only dark bg with one accent word - post variant 2 first, it wins most CTR tests',1);
}
function cropSafe(){
 glog('CROP SAFE: keep all text inside the middle 80% width and above the bottom 25% (caption/username zone) and right 12% (engagement rail) | safe zones first, art second',1);
}
function titleSync(){
 var t=coverWords();
 glog('TITLE SYNC: cover says "'+t+'", so the caption hook must NOT repeat it - tease the next beat ("the part nobody mentions...") | cover + caption saying the same thing wastes the second impression',1);
}
function coverScore(){
 var i=coverPlan(),t=coverWords(),w=words(t).length;
 var sc=Math.max(40,95-(w>4?10:0)-(mood(SCENES[i])==='info'?15:0)-(i===0?0:5));
 glog('COVER SCORE: '+sc+'/100 - '+(sc>=85?'ready: strong frame, short text, clear contrast path':sc>=70?'close: tighten text to 4 words max and add the scrim':'rework: pick a reveal/action frame and cut text to 4 words'),1);
}
function coverSheet(){
 var i=coverPlan(),t=coverWords();
 var lines=['SHORTFORGE COVER SHEET - '+title(),'generated by FORGE 17 COVER LAB (Nov 25 2026) - '+SCENES.length+' scenes, '+tot().toFixed(1)+'s total','',
 'cover frame: s'+(i+1)+' ('+mood(SCENES[i])+' '+roleOf(i,SCENES.length)+', '+wc(SCENES[i])+'w, '+(SDUR[i]||4).toFixed(1)+'s)',
 'cover text: '+t+' (max 4 words, 2 lines, top third)','',
 'variants: (1) full-bleed scene + text (2) zoomed subject crop + text (3) dark bg text-only, one accent word',
 'subject placement: left third line, eyes upper third, right third reserved for text',
 'contrast: bottom-60% dark scrim under text, or 2px outline + shadow',
 'safe zones: middle 80% width, nothing in bottom 25% or right 12%',
 'caption rule: caption teases the next beat, never repeats the cover text'];
 var txt=lines.join('\n');
 try{window.__sf_cover_sheet=txt}catch(e){}
 glog('COVER SHEET: '+txt.length+' chars built, downloading cover_sheet.txt',1);
 dlB(txt,'cover_sheet.txt');
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){setTimeout(mount,80)})}else{setTimeout(mount,80)}
})();
