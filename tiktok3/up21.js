'use strict';
/* up21.js - SHORTFORGE FORGE 26 CAPTION LAB (Nov 25 2026) v1 */
(function(){
if(window.__sfup21){return;}
window.__sfup21=1;
function need(){if(!window.SCENES||!SCENES.length){glog('forge a script first (FORGE 26 tools need scenes)',0);return false}return true}
function glog(m,hl){try{step(m,hl)}catch(e){console.log('[forge26]',m)}}
function mkBtn(id,label,fn){var b=document.createElement('button');b.id=id;b.textContent=label;b.style.cssText='background:#0b1418;border:1px solid #2de2ff;color:#eaffff;font:700 10px monospace;padding:6px 10px;margin:3px;cursor:pointer;border-radius:6px';b.addEventListener('click',function(){try{if(need())fn()}catch(e){glog('forge26 error: '+e.message,0)}});return b}
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
function mount(){
 var bp=document.getElementById('boardPanel');if(!bp||bp.querySelector('#g25b1'))return;
 var row=document.createElement('div');row.style.cssText='margin-top:12px';
 var h=document.createElement('div');h.textContent='FORGE 26 CAPTION LAB';h.style.cssText='color:#2de2ff;font:700 11px monospace;margin:4px 3px';row.appendChild(h);
 var btns=document.createElement('div');btns.style.cssText='display:flex;flex-wrap:wrap';row.appendChild(btns);
 var anchor=bp.querySelector('.rowbtns');if(anchor)bp.insertBefore(row,anchor);else bp.appendChild(row);
 btns.appendChild(mkBtn('g25b1','CAP PLAN',capPlan));
 btns.appendChild(mkBtn('g25b2','LINE SPLIT',lineSplit));
 btns.appendChild(mkBtn('g25b3','SAFE ZONE',safeZone));
 btns.appendChild(mkBtn('g25b4','POP TIMING',popTiming));
 btns.appendChild(mkBtn('g25b5','FONT PAIR',fontPair));
 btns.appendChild(mkBtn('g25b6','EMOJI CHECK',emojiCheck));
 btns.appendChild(mkBtn('g25b7','HOOK CAPTION',hookCaption));
 btns.appendChild(mkBtn('g25b8','CTA CAPTION',ctaCaption));
 btns.appendChild(mkBtn('g25b9','CAP SCORE',capScore));
 btns.appendChild(mkBtn('g25b10','CAP SHEET',capSheet));
 try{glog('FORGE 26 CAPTION LAB mounted (10 tools)',0)}catch(e){}
}
function capPlan(){
 var rows=[];
 SCENES.forEach(function(s,i){
  var t=txtOf(s).replace(/\s+/g,' ').trim();
  var words=t.split(' ').filter(Boolean).length;
  var read=Math.max(1,Math.round(words/2.6));
  var ok=read<=(SDUR[i]||4)-0.5;
  rows.push('s'+(i+1)+' '+words+'w ~'+read+'s read vs '+(SDUR[i]||4).toFixed(1)+'s '+(ok?'fits':'TOO LONG - trim'));
 });
 glog('CAP PLAN: '+rows.join(' | '),1);
}
function lineSplit(){
 var out=[];
 SCENES.forEach(function(s,i){
  var t=txtOf(s).replace(/\s+/g,' ').trim();
  if(t.length<=32){out.push('s'+(i+1)+' one line: "'+t+'"');return}
  var mid=Math.floor(t.length/2),sp=-1;
  for(var k=0;k<12;k++){if(mid-k>0&&t[mid-k]===' '){sp=mid-k;break}if(mid+k<t.length&&t[mid+k]===' '){sp=mid+k;break}}
  if(sp<0)sp=t.length;
  out.push('s'+(i+1)+' two lines: "'+t.slice(0,sp).trim()+'" / "'+t.slice(sp).trim()+'"');
 });
 glog('LINE SPLIT: '+out.join(' | '),1);
}
function safeZone(){
 var n=SCENES.length;
 glog('SAFE ZONE: keep every caption inside 78-88% screen height (top 15% is the tiktok UI bar, bottom 20% is the action row). center the block, max 2 lines, 34 chars a line - at '+n+' scenes that is '+(n*2)+' caption rows total, all inside the safe band',1);
}
function popTiming(){
 var rows=[];
 SCENES.forEach(function(s,i){
  var st=(cutAt(i)+0.1).toFixed(2),en=(cutAt(i+1)-0.2).toFixed(2);
  rows.push('s'+(i+1)+' in '+st+'s out '+en+'s');
 });
 glog('POP TIMING: '+rows.join(' | ')+' (pop in 3 frames, no fade - fades read as lag on a phone)',1);
}
function fontPair(){
 var k=kindOf(imgOf(SCENES[0])+' '+title());
 var pair=k==='tech'?'headline: bold monospace (JetBrains Mono style), body: condensed sans':k==='fast'?'headline: ultra-black sans (Anton style, all caps), body: same family lighter':k==='nature'?'headline: light serif for contrast against footage, body: clean sans':'headline: heavy sans all caps, body: regular sans';
 glog('FONT PAIR ('+k+' topic): '+pair+'. one pair for the whole edit - switching fonts mid-video reads as an ad',1);
}
function emojiCheck(){
 var withE=0;
 SCENES.forEach(function(s){if(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(txtOf(s)))withE++});
 if(!withE)glog('EMOJI CHECK: 0 of '+SCENES.length+' captions carry an emoji - fine for a clean look, but one emoji on the hook caption lifts tap-through',1);
 else if(withE<=Math.ceil(SCENES.length/2))glog('EMOJI CHECK: '+withE+' of '+SCENES.length+' captions have one - good density, keep them off the payoff lines',1);
 else glog('EMOJI CHECK: '+withE+' of '+SCENES.length+' captions have one - that is heavy, strip them everywhere except scene 1',1);
}
function hookCaption(){
 var t=title();
 glog('HOOK CAPTION (pick one): 1) "'+t+'? nobody talks about this" 2) "wait for scene 3 - '+t.toLowerCase()+'" 3) "this is why '+t.toLowerCase()+' actually matters" - on screen under 2.5s, biggest text in the edit',1);
}
function ctaCaption(){
 var last=txtOf(SCENES[SCENES.length-1]).replace(/\s+/g,' ').trim().slice(0,60);
 glog('CTA CAPTION: end card reads "follow for part 2" under your last line "'+last+'..." - show it the final 1.2s only, earlier kills the loop',1);
}
function capScore(){
 var score=50;
 var longCap=0;
 SCENES.forEach(function(s,i){var t=txtOf(s).replace(/\s+/g,' ').trim();var words=t.split(' ').filter(Boolean).length;if(words/2.6>(SDUR[i]||4)-0.5)longCap++});
 if(!longCap)score+=20;else score-=Math.min(20,longCap*5);
 var two=0;SCENES.forEach(function(s){if(txtOf(s).replace(/\s+/g,' ').trim().length<=64)two++});
 if(two>=SCENES.length*0.7)score+=15;else score-=5;
 if(SCENES.length>=5)score+=10;else score-=5;
 var t=tot();if(t>=20&&t<=45)score+=5;
 if(score>98)score=98;
 glog('CAP SCORE '+score+'/100 '+([score<70?'under 70: captions are fighting the cut length - trim lines before anything else':score<85?'70-84: solid, tighten the two longest lines':'85+: captions are edit-ready, ship it'][score<70?0:score<85?1:2]),1);
}
function capSheet(){
 var lines=['FORGE 26 CAPTION SHEET - '+title(),'generated '+new Date().toISOString(),SCENES.length+' scenes, '+tot().toFixed(1)+'s',''];
 SCENES.forEach(function(s,i){
  var t=txtOf(s).replace(/\s+/g,' ').trim();
  lines.push('s'+(i+1)+' ['+(cutAt(i)+0.1).toFixed(2)+'-'+(cutAt(i+1)-0.2).toFixed(2)+'s] '+t);
 });
 lines.push('');lines.push('rules: 34 chars a line max, 2 lines max, inside 78-88% height, pop in 3 frames, one pair of fonts, cta only the last 1.2s');
 dlB(lines.join('\n'),'forge26_cap_sheet.txt');
 glog('CAP SHEET downloaded (forge26_cap_sheet.txt)',1);
}
function boot(){
 if(document.getElementById('boardPanel')){mount();return}
 var n=0,iv=setInterval(function(){n++;if(document.getElementById('boardPanel')){clearInterval(iv);mount()}else if(n>120){clearInterval(iv)}},250);
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',boot)}else{boot()}
})();
