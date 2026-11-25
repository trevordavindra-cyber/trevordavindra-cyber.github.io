'use strict';
/* up26.js - SHORTFORGE FORGE 36 CAPTION LAB (Nov 25 2026) v1 */
(function(){
if(window.__sfup26){return;}
window.__sfup26=1;
function need(){if(!window.SCENES||!SCENES.length){glog('forge a script first (FORGE 36 tools need scenes)',0);return false}return true}
function glog(m,hl){try{step(m,hl)}catch(e){console.log('[forge36]',m)}}
function mkBtn(id,label,fn){var b=document.createElement('button');b.id=id;b.textContent=label;b.style.cssText='background:#0b1418;border:1px solid #2de2ff;color:#eaffff;font:700 10px monospace;padding:6px 10px;margin:3px;cursor:pointer;border-radius:6px';b.addEventListener('click',function(){try{if(need())fn()}catch(e){glog('forge36 error: '+e.message,0)}});return b}
function dlB(txt,name){try{var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));a.download=name;a.style.display='none';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a)},200)}catch(e){glog('download blocked: '+e.message,0)}}
function title(){return String((window.META&&META.title)||'this topic')}
function txtOf(s){return String((s&&(s.text||s.caption||s.line||s.script||s.narration))||imgOf(s)||'')}
function imgOf(s){return String((s&&(s.img||s.image||s.prompt))||'')}
function words(s){return String(s||'').replace(/\s+/g,' ').trim().split(' ').filter(Boolean)}
function allText(){return SCENES.map(txtOf).join(' ')}
var R=window.__sfcap=window.__sfcap||{};
function capScan(){
 var t=words(allText());
 R.base=t.length+' words across '+SCENES.length+' scenes, title "'+title()+'"; TikTok search reads the first 60 chars of the title hardest, so the keyword goes in there';
 glog('CAPTION SCAN: '+t.length+' words, '+SCENES.length+' scenes, title "'+title()+'"',1);
}
function hookLine(){
 R.hook='hook line: lead with the promise, not the topic - "nobody tells you this about '+title()+'" beats "about '+title()+'"; the first line decides most caption reads';
 glog('HOOK LINE: lead with the promise, not the topic; first line decides most reads',1);
}
function questionBait(){
 R.question='question bait: end the caption with one short question ("which one are you guilty of?") - comment velocity in the first hour feeds the distribution';
 glog('QUESTION BAIT: end with one short question to bait comments',1);
}
function emojiFit(){
 var t=allText()+' '+title();
 var m=t.match(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDF00-\uDFFF]|\uD83E[\uDD00-\uDDFF]|[\u2600-\u27BF]/g)||[];
 R.emoji=m.length+' emoji found; 1-3 max on a TikTok caption, one right after the hook line, never a stack at the end';
 glog('EMOJI FIT: '+m.length+' emoji found, 1-3 max, right after the hook',1);
}
function hashtagMix(){
 var k=title().toLowerCase().replace(/[^a-z0-9 ]/g,'').split(' ').filter(Boolean).slice(0,2).map(function(w){return '#'+w.replace(/\s/g,'')});
 R.tags='hashtag mix: 3 broad (#fyp #viral #foryou) + 3 niche (topic words) + 1 branded, 8 total max; your niche picks from the title: '+(k.length?k.join(' '):'#'+title().toLowerCase().replace(/\s+/g,''));
 glog('HASHTAG MIX: 3 broad + 3 niche + 1 branded, 8 max; niche picks: '+(k.join(' ')||'#'+title().toLowerCase().replace(/\s+/g,'')),1);
}
function trendTags(){
 R.trend='trend tags: ride a trend tag only when the topic genuinely fits it - a mismatched trend tag kills watch-through and the algo reads it as bait';
 glog('TREND TAGS: only ride a tag the topic actually fits',1);
}
function ctaLine(){
 R.cta='cta line: one CTA, placed last ("save this before it disappears") - save-weight beats like-weight for reach on new accounts';
 glog('CTA LINE: one CTA last, save-weight beats like-weight',1);
}
function keywords(){
 var w=words(title()).slice(0,3).join(' ');
 R.keys='keywords: repeat the main keyword "'+w+'" 2-3 times naturally across the caption - TikTok search ranks caption text, not just tags';
 glog('KEYWORDS: repeat "'+w+'" 2-3 times naturally across the caption',1);
}
function capScore(){
 var t=allText()+' '+title();var s=100;var notes=[];
 var tags=(t.match(/#/g)||[]).length;
 if(tags<3){s-=10;notes.push('fewer than 3 hashtags -10')}else if(tags>8){s-=10;notes.push('over 8 hashtags -10')}
 if(!/\?/.test(t)){s-=15;notes.push('no question bait -15')}
 if(!/(follow|save|comment|share)/i.test(t)){s-=15;notes.push('no cta line -15')}
 if(title().length>60){s-=10;notes.push('title over 60 chars -10')}
 R.score=s;R.notes=notes.join(', ');
 glog('CAPTION SCORE: '+s+'/100'+(notes.length?' ('+notes+')':' (clean)'),1);
}
function capSheet(){
 var lines=['FORGE 36 CAPTION LAB - '+new Date().toISOString(),'TITLE: '+title(),
  'SCAN: '+(R.base||''),'HOOK: '+(R.hook||''),'QUESTION: '+(R.question||''),'EMOJI: '+(R.emoji||''),
  'TAGS: '+(R.tags||''),'TREND: '+(R.trend||''),'CTA: '+(R.cta||''),'KEYS: '+(R.keys||''),
  'SCORE: '+(R.score!==undefined?R.score+'/100':'run CAPTION SCORE')];
 dlB(lines.join('\n'),'forge36_caption_sheet.txt');
 glog('CAPTION SHEET: saved forge36_caption_sheet.txt',1);
}
function mount(){
 var bp=document.getElementById('buttonpool')||document.querySelector('.buttonpool')||document.getElementById('btns')||document.body;
 if(!bp||document.getElementById('g30row'))return;
 var row=document.createElement('div');row.id='g30row';row.style.cssText='margin:6px 0';
 var h=document.createElement('div');h.textContent='FORGE 36 CAPTION LAB';h.style.cssText='color:#2de2ff;font:700 11px monospace;margin:4px 3px';row.appendChild(h);
 var btns=document.createElement('div');btns.style.cssText='display:flex;flex-wrap:wrap';row.appendChild(btns);
 var anchor=bp.querySelector('.rowbtns');if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(row,anchor);else bp.appendChild(row);
 btns.appendChild(mkBtn('g30b1','CAPTION SCAN',capScan));
 btns.appendChild(mkBtn('g30b2','HOOK LINE',hookLine));
 btns.appendChild(mkBtn('g30b3','QUESTION BAIT',questionBait));
 btns.appendChild(mkBtn('g30b4','EMOJI FIT',emojiFit));
 btns.appendChild(mkBtn('g30b5','HASHTAG MIX',hashtagMix));
 btns.appendChild(mkBtn('g30b6','TREND TAGS',trendTags));
 btns.appendChild(mkBtn('g30b7','CTA LINE',ctaLine));
 btns.appendChild(mkBtn('g30b8','KEYWORDS',keywords));
 btns.appendChild(mkBtn('g30b9','CAPTION SCORE',capScore));
 btns.appendChild(mkBtn('g30b10','CAPTION SHEET',capSheet));
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',mount)}else{mount()}
console.log('[shortforge up26.js v1] caption lab loaded');
})();
