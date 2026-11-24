'use strict';
// up38.js - PHASE 32 IDEA LAB (Nov 23 2026)
// hook ideas, title spin, angle spin, comment bait, series ideas,
// trend bridge, 30-day calendar, script skeleton, seed bank, idea sheet
(function(){
if(window.__tk2up38){return}window.__tk2up38=1;
function $(id){return document.getElementById(id)}
function mkBtn(t,fn,id){var b=document.createElement('button');b.className='btn';b.textContent=t;if(id){b.id=id}b.onclick=fn;return b}
function mkRow(){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap='6px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function saveE(){try{if(typeof save==='function'){save()}}catch(e){}}
function S(){try{return window.S||window.state||window.APPSTATE||{}}catch(e){return {}}}
function clipDur(c){var st=parseFloat(c.start),en=parseFloat(c.end);if(!isFinite(st)||!isFinite(en)){return 0}return Math.max(0,(en-st))/(c.speed||1)}
function clips(){var s=S();var a=(s&&s.clips)||[];var out=[],t=0;for(var i=0;i<a.length;i++){var d=clipDur(a[i]);if(d>0.05){t+=d;out.push({c:a[i],d:d})}}return out}
function needClips(){var a=clips();if(!a.length){log('idea lab: add clips to the timeline first');return null}return a}
function base(){var cs=clips();if(!cs.length){return null}var t=0;for(var i=0;i<cs.length;i++){t+=cs[i].d}
 var st=S();var genre=((st.genre||st.style||(cs[0].c?cs[0].c.style:'')||'')+'').toUpperCase()||'EDIT';
 return {cs:cs,t:t,genre:genre}}
function pick3(arr){var a=arr.slice();var out=[];while(out.length<3&&a.length){out.push(a.splice(Math.floor(Math.random()*a.length),1)[0])}return out}
var SEEDKEY='tk2seeds';
function readSeeds(){try{return JSON.parse(localStorage.getItem(SEEDKEY)||'[]')}catch(e){return[]}}
function writeSeeds(a){try{localStorage.setItem(SEEDKEY,JSON.stringify(a))}catch(e){}}
function hookIdeas(){var b=base();if(!b){return}
 var g=b.genre.toLowerCase();
 var pool=['nobody talks about this '+g+' trick','watch till the end or you miss the cut','i tested 100 '+g+' edits - this one won','the first 2 seconds decide everything: watch','they said this '+g+' edit could not loop','the '+g+' transition at :07 is illegal','stop scrolling - this beat drop needs you','what 90% of '+g+' editors get wrong'];
 var p=pick3(pool);
 log('HOOK IDEAS (3) - '+p.join(' | '),true);saveE()}
function titleSpin(){var b=base();if(!b){return}
 var g=b.genre.toLowerCase();var s=Math.round(b.t*10)/10;
 var t=['the '+g+' edit that broke my algorithm',g+' edit, '+s+'s, no filler',POV(g),g+' but every cut is on the beat','ranking my '+g+' cuts: this is #1'];
 function POV(x){return 'pov: you finally found a clean '+x+' edit'}
 log('TITLE SPIN (5) - '+t.join(' | '),true);saveE()}
function angleSpin(){var b=base();if(!b){return}
 var a=['before/after: raw footage vs the edit','same footage, 3 genres, 1 vote in the comments','countdown format: top 5 cuts in this edit','pov rewatch: notice the hidden transition','speedrun format: fastest cut chain','tutorial flip: how this edit was made in 60s'];
 var p=pick3(a);
 log('ANGLE SPIN (3) - '+p.join(' | '),true);saveE()}
function commentBait(){var b=base();if(!b){return}
 var q=['which cut was the hardest - 1, 2 or 3?','rate this transition out of 10','what song should part 2 use?','would you loop this? yes or no','find the hidden cut and comment the time'];
 log('COMMENT BAIT - pin one of these as the question: '+q.join(' | '),true);saveE()}
function seriesIdeas(){var b=base();if(!b){return}
 var g=b.genre.toLowerCase();
 var s=['PART 2: same '+g+' style, new footage, same 7pm slot','PART 3: viewer-picked clip order (poll first)','PART 4: speedrun cut - same recipe, 2x pace','PART 5: behind the edit - show the timeline','PART 6: the loop cut - make it perfectly seamless'];
 log('SERIES IDEAS (5) - '+s.join(' | '),true);saveE()}
function trendBridge(){var b=base();if(!b){return}
 var g=b.genre.toLowerCase();
 var m={PHONK:'drift phonk -> retro vhs mashups',ANIME:'anime edit -> manga panel format',FOOTBALL:'football hype -> slow-mo replay breakdowns',GAMING:'gaming montages -> clutch reaction cuts',MARVEL:'marvel edits -> scene dialogue captions',CINEMATIC:'cinematic reels -> one-take storytelling'};
 var v=m[g]||'your '+g+' style -> borrow the pacing of a faster genre for one edit';
 log('TREND BRIDGE - '+g+' sits next to: '+v,true);saveE()}
function calendar30(){var b=base();if(!b){return}
 var d=new Date();var names=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];var out=[];
 var angles=['main cut','variation A','variation B','remix angle','viewer pick','loop cut','best-of week'];
 for(var i=1;i<=7;i++){var dd=new Date(d.getTime()+i*86400000);out.push(names[dd.getDay()]+' '+(dd.getMonth()+1)+'/'+dd.getDate()+': '+angles[(i-1)%angles.length])}
 log('30-DAY CALENDAR (first 7) - '+out.join(' | '),true);saveE()}
function scriptSkeleton(){var b=base();if(!b){return}
 var g=b.genre.toLowerCase();
 var sk=['0-2s hook: hardest cut + biggest text','2-8s build: '+g+' pacing, no captions','8-15s payoff: beat drop + flash chain','15-'+Math.round(b.t)+'s outro: loop seam + "part 2?" text'];
 log('SCRIPT SKELETON - '+sk.join(' | '),true);saveE()}
function seedBank(){var b=base();if(!b){return}
 var d=new Date();var seed=d.getMonth()+'/'+d.getDate()+' '+b.genre.toLowerCase()+' '+Math.round(b.t)+'s - idea: ';
 var seeds=readSeeds();seeds.push(seed+'unwritten');while(seeds.length>40){seeds.shift()}
 writeSeeds(seeds);
 log('SEED BANK - saved ('+seeds.length+' total). latest: '+seed+'unwritten - IDEA SHEET exports them all',true);saveE()}
function ideaSheet(){var b=base();if(!b){return}
 var seeds=readSeeds();
 var L=['IDEA SHEET','generated '+new Date().toString(),'','style '+b.genre+' | length '+Math.round(b.t*10)/10+'s','','HOOK POOL: nobody talks about this '+b.genre.toLowerCase()+' trick; watch till the end or you miss the cut; what 90% of '+b.genre.toLowerCase()+' editors get wrong','','COMMENT BAIT: which cut was the hardest? rate this transition out of 10; what should part 2 use?','CADENCE: every other day at 7pm','SEED BANK ('+seeds.length+'):'];
 for(var i=0;i<seeds.length;i++){L.push('- '+seeds[i])}
 L.push('');
 try{var blob=new Blob([L.join('\n')],{type:'text/plain'});var el=document.createElement('a');el.href=URL.createObjectURL(blob);el.download='idea_sheet.txt';document.body.appendChild(el);el.click();setTimeout(function(){document.body.removeChild(el)},300)}catch(e){log('download failed: '+e.message);return}
 log('idea sheet .txt downloaded ('+seeds.length+' seeds)',true);saveE()}
function mount(){
  if($('f38card')){return}
  var card=document.createElement('div');card.className='card';card.id='f38card';
  var h=document.createElement('h2');h.textContent='IDEA LAB';card.appendChild(h);
  var r1=mkRow();r1.appendChild(mkBtn('HOOK IDEAS',hookIdeas,'f38b1'));r1.appendChild(mkBtn('TITLE SPIN',titleSpin,'f38b2'));card.appendChild(r1);
  var r2=mkRow();r2.appendChild(mkBtn('ANGLE SPIN',angleSpin,'f38b3'));r2.appendChild(mkBtn('COMMENT BAIT',commentBait,'f38b4'));card.appendChild(r2);
  var r3=mkRow();r3.appendChild(mkBtn('SERIES IDEAS',seriesIdeas,'f38b5'));r3.appendChild(mkBtn('TREND BRIDGE',trendBridge,'f38b6'));card.appendChild(r3);
  var r4=mkRow();r4.appendChild(mkBtn('30-DAY CALENDAR',calendar30,'f38b7'));r4.appendChild(mkBtn('SCRIPT SKELETON',scriptSkeleton,'f38b8'));card.appendChild(r4);
  var r5=mkRow();r5.appendChild(mkBtn('SEED BANK',seedBank,'f38b9'));r5.appendChild(mkBtn('IDEA SHEET .TXT',ideaSheet,'f38b10'));card.appendChild(r5);
  var note=document.createElement('div');note.className='note';note.id='f38note';note.textContent='idea lab feeds the pipeline: hook lines and title variants from the current genre, remix angles, comment-bait questions, part 2-6 series ideas, the adjacent trend to borrow from, a 30-day posting calendar, a script skeleton, a seed bank saved on this device and a downloadable idea sheet.';
  card.appendChild(note);
  var hs=document.querySelectorAll('.card h2'),anchor=null;
  for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('PIPELINE LAB')>=0){anchor=hs[i].parentElement;break}}
  if(anchor){if(anchor.nextSibling){anchor.parentElement.insertBefore(card,anchor.nextSibling)}else{anchor.parentElement.appendChild(card)}}
  else{var ap=document.querySelector('#panelcol')||document.body;ap.appendChild(card)}
  log('idea lab live - hook ideas, title spin, angle spin, comment bait, series ideas, trend bridge, 30-day calendar, script skeleton, seed bank, idea sheet');
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',mount)}else{mount()}
})();