'use strict';
// up50.js - PHASE 44 IDEAS LAB (Nov 24 2026)
// idea engine, series planner, remix angle, script skeleton,
// shot list, b-roll list, sound pick, idea bank, trend watch, ideas sheet
(function(){
if(window.__tk2up50){return}window.__tk2up50=1;
function mkBtn(t,fn,id){var b=document.createElement('button');b.className='btn';b.textContent=t;if(id){b.id=id}b.onclick=fn;return b}
function mkRow(){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap='6px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function S(){try{return window.S||window.state||window.APPSTATE||{}}catch(e){return {}}}
function clipDur(c){var st=parseFloat(c.start),en=parseFloat(c.end);if(!isFinite(st)||!isFinite(en)){return 0}return Math.max(0,(en-st))/(c.speed||1)}
function clips(){var s=S();var a=(s&&s.clips)||[];var out=[],t=0;for(var i=0;i<a.length;i++){var d=clipDur(a[i]);if(d>0.05){t+=d;out.push({c:a[i],d:d,t0:t})}}for(var j=0;j<out.length;j++){out[j].t0-=out[j].d}return out}
function runtime(){var cs=clips();if(!cs.length){return 0}return cs[cs.length-1].t0+cs[cs.length-1].d}
function needClips(){if(!clips().length){log('ideas lab: add clips to the timeline first');return false}return true}
function saveE(){try{if(typeof save==='function'){save()}}catch(e){}}
function r1(n){return Math.round(n*10)/10}
function genre(){var s=S();var st=(s.style||s.editStyle||'').toString().toLowerCase();var txt=st+' '+JSON.stringify(s.clips||[]).toLowerCase();
 if(txt.indexOf('phonk')>=0){return 'phonk'}if(txt.indexOf('sport')>=0||txt.indexOf('basketball')>=0||txt.indexOf('gym')>=0){return 'sport'}
 if(txt.indexOf('anime')>=0){return 'anime'}if(txt.indexOf('blend')>=0){return 'blend'}return st||'general'}
function dl(name,text){try{var b=new Blob([text],{type:'text/plain'});var u=URL.createObjectURL(b);var a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},800);log('download started - '+name,true)}catch(e){log('download blocked, '+e.message)}}
var G;var IDEAS={'phonk':['day-in-the-life but every scene is one beat longer than the last','before/after glow-up cut on one continuous beat grid','the 3am version vs the 6am version of the same day','speed-ramp walkout that lands on the beat drop','split-screen: same clip, clean cut vs chaos cut'],
'sport':['one drill, ten attempts, keep only the make','slow-mo the footwork, speed-ramp the finish','behind-the-scenes of the worst first attempt','rank every attempt from 1-10 with captions','the shot that almost went in, replayed 3 ways'],
'anime':['panel-to-panel recreation of one fight beat','character power ranking with clip evidence','the scene everyone skipped, slowed 4x','one character, three outfits, three cuts','fan-theory explained in 15 seconds flat'],
'blend':['split the genre in half: first half A style, second half B','cut the same footage to two different genres back to back','before/after of the edit itself, raw vs graded','two timelines racing: one clean, one chaotic','the unedited take vs the edit, side by side'],
'general':['one location, three different energy levels','a day compressed into 15 seconds of cuts','answer a comment with a full video','the wrong way first, the right way second','silent version: no captions, let the cuts talk']};
function ideas(){if(!needClips()){return}G=genre();var list=IDEAS[G]||IDEAS['general'];
 log('IDEA ENGINE - genre read: '+G+'. five ideas built for this project',true);
 for(var i=0;i<5;i++){log('IDEA ENGINE - '+(i+1)+') '+list[i])}
 log('IDEA ENGINE - pick one and build it inside this same project: the style chips and timeline already fit the genre',true)}
function series(){if(!needClips()){return}var rt=runtime();
 log('SERIES PLANNER - part 1: the intro cut ('+r1(rt)+'s), establishes the world and the loop',true);
 log('SERIES PLANNER - part 2: the escalation, same format, 20% faster pacing',true);
 log('SERIES PLANNER - part 3: the payoff, bring back part 1 footage as the callback; end every part on an open question',true);
 log('SERIES PLANNER - name the series once, reuse it in every caption: series pages pull binge-watchers to part 1',true)}
function remix(){if(!needClips()){return}G=G||genre();
 log('REMIX ANGLE - current angle: '+G+' edit at '+r1(runtime())+'s. three remixes:',true);
 log('REMIX ANGLE - 1) remix the format: same footage, opposite pacing (half the cuts or double)',true);
 log('REMIX ANGLE - 2) remix the POV: cut it again from the other subject or behind the camera',true);
 log('REMIX ANGLE - 3) remix the format length: 15s trailer cut vs 60s full cut, post the trailer first',true)}
function script(){if(!needClips()){return}var rt=runtime();
 log('SCRIPT SKELETON - hook 0-'+r1(rt*0.15)+'s: hard visual hook, one line of text, no context yet',true);
 log('SCRIPT SKELETON - build '+r1(rt*0.15)+'-'+r1(rt*0.7)+'s: escalating cuts, caption carries the story beats',true);
 log('SCRIPT SKELETON - payoff '+r1(rt*0.7)+'-'+r1(rt)+'s: the moment the video earns the watch, hold it 2 cuts longer than feels right, then loop back to frame 1',true)}
function shots(){if(!needClips()){return}var n=clips().length;
 log('SHOT LIST - build the next one in '+Math.max(4,Math.round(n*0.8))+' shots for a '+r1(runtime())+'s cut (0.8x this project density):',true);
 log('SHOT LIST - 1 wide establisher (1s) | 2-3 mid shots on the beat (1-1.5s each) | 2 close-ups for the payoff | 1 safety take of the full scene at normal speed',true);
 log('SHOT LIST - shoot every shot in vertical 9:16 handheld-first: reframing horizontal footage is where quality dies',true)}
function broll(){if(!needClips()){return}G=G||genre();
 log('B-ROLL LIST - grab 6 b-roll clips before the next build, all '+G+'-usable:',true);
 log('B-ROLL LIST - hands doing the thing, wide of the space, detail macro (2s), one slow pan, one static skyline or room, one reaction shot',true);
 log('B-ROLL LIST - b-roll is cut insurance: every timeline gap you had this project gets covered by one of these six',true)}
function sound(){if(!needClips()){return}G=G||genre();
 var pick={'phonk':'dark phonk, 120-140 BPM, drift/wave subgenres','sport':'hype trap or stadium beat, 130-150 BPM','anime':'ost-style build or lo-fi remix of the show theme','blend':'split track: clean first half, dirty second half','general':'trending sound under 50k uses, 120-160 BPM'};
 log('SOUND PICK - for a '+G+' edit: '+pick[G],true);
 log('SOUND PICK - build the cut against the beat grid, not after: tap DETECT BEATS, then AUTO EDIT, then place cuts',true);
 log('SOUND PICK - keep a 3-sound rotation max this week: one hype, one chill, one experimental; same sound 3 posts in a row reads lazy',true)}
function bank(){var k='tk2ideabank';var cur=[];try{cur=JSON.parse(localStorage.getItem(k)||'[]')}catch(e){cur=[]}
 var s=S();var st=(s.style||s.editStyle||'').toString().toLowerCase()||'general';
 var item=st+' cut, '+r1(runtime()||15)+'s target, built from the current project ('+new Date().toLocaleDateString()+')';
 cur.push(item);while(cur.length>30){cur.shift()}
 try{localStorage.setItem(k,JSON.stringify(cur))}catch(e){log('idea bank: could not save on this device');return}
 log('IDEA BANK - saved. bank now holds '+cur.length+' idea(s); last: '+item,true);
 log('IDEA BANK - rule: refill the bank from build-day downtime, never decide mid-build what to make next',true)}
function trend(){if(!needClips()){return}
 var m=new Date().getMonth();var season=(m<=1||m===11)?'winter/holiday':(m<=4?'spring':(m<=7?'summer':'fall/back-to-school'));
 log('TREND WATCH - current window: '+season+'. formats that spike: seasonal remixes of evergreen ideas',true);
 log('TREND WATCH - ride a trend inside 72 hours of it breaking, or skip it: late trend adoption reads as a repost',true);
 log('TREND WATCH - one rule: never build an edit you cannot ship in the trend window; bank it for the next cycle instead',true)}
function sheet(){if(!needClips()){return}var n=clips().length,rt=runtime();G=G||genre();
 var L=[];L.push('IDEAS SHEET - generated '+new Date().toLocaleString());
 L.push('PROJECT: '+n+' clips, '+r1(rt)+'s, genre read: '+G);
 L.push('');L.push('IDEA ENGINE (next 5):');var list=IDEAS[G]||IDEAS['general'];
 for(var i=0;i<5;i++){L.push('  '+(i+1)+'. '+list[i])}
 L.push('');L.push('SERIES PLAN: part1 intro '+r1(rt)+'s, part2 escalation +20% pace, part3 payoff with callback');
 L.push('REMIX ANGLES: format swap / pov swap / length swap (15s trailer first)');
 L.push('SCRIPT: hook 0-'+r1(rt*0.15)+'s, build to '+r1(rt*0.7)+'s, payoff to '+r1(rt)+'s, loop to frame 1');
 L.push('SHOT LIST: '+Math.max(4,Math.round(n*0.8))+' shots, 0.8x current density, all vertical');
 L.push('B-ROLL: hands, wide, macro, slow pan, static, reaction');
 L.push('SOUND: '+(G==='general'?'trending under 50k uses':G+' pick, cuts on the beat grid'));
 L.push('TREND: ride within 72h or bank it');L.push('MIX: none. ideas pass only, project untouched');
 dl('ideas-sheet.txt',L.join('\n'))}
function mount(){
 if(document.getElementById('f50b1')){return}
 var card=document.createElement('div');card.className='card';card.id='f50card';
 var h=document.createElement('h2');h.textContent='IDEAS LAB';card.appendChild(h);
 var r1r=mkRow();r1r.appendChild(mkBtn('IDEA ENGINE',ideas,'f50b1'));r1r.appendChild(mkBtn('SERIES PLANNER',series,'f50b2'));card.appendChild(r1r);
 var r2=mkRow();r2.appendChild(mkBtn('REMIX ANGLE',remix,'f50b3'));r2.appendChild(mkBtn('SCRIPT SKELETON',script,'f50b4'));card.appendChild(r2);
 var r3=mkRow();r3.appendChild(mkBtn('SHOT LIST',shots,'f50b5'));r3.appendChild(mkBtn('B-ROLL LIST',broll,'f50b6'));card.appendChild(r3);
 var r4=mkRow();r4.appendChild(mkBtn('SOUND PICK',sound,'f50b7'));r4.appendChild(mkBtn('IDEA BANK',bank,'f50b8'));card.appendChild(r4);
 var r5=mkRow();r5.appendChild(mkBtn('TREND WATCH',trend,'f50b9'));r5.appendChild(mkBtn('IDEAS SHEET .TXT',sheet,'f50b10'));card.appendChild(r5);
 var note=document.createElement('div');note.className='note';note.id='f50note';note.textContent='ideas lab covers the next-build side: idea engine, series planner, remix angle, script skeleton, shot list, b-roll list, sound pick, idea bank, trend watch and a downloadable ideas sheet.';
 card.appendChild(note);
 var hs=document.querySelectorAll('.card h2'),anchor=null;
 for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('PUBLISH LAB')>=0){anchor=hs[i].parentElement;break}}
 if(anchor){if(anchor.nextSibling){anchor.parentElement.insertBefore(card,anchor.nextSibling)}else{anchor.parentElement.appendChild(card)}}
 else{var ap=document.querySelector('#panelcol')||document.body;ap.appendChild(card)}
 log('ideas lab live - idea engine, series planner, remix angle, script skeleton, shot list, b-roll list, sound pick, idea bank, trend watch, ideas sheet');
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',mount)}else{mount()}
})();