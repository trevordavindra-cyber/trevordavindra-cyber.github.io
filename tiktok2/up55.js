'use strict';
// up55.js - PHASE 49 TRENDS LAB (Nov 24 2026)
// trend spotlight, sound strategy, hashtag stack, post time plan, duet ideas,
// series builder, niche map, viral checklist, competitor watch, trends sheet
(function(){
if(window.__tk2up55){return}window.__tk2up55=1;
function mkBtn(t,fn,id){var b=document.createElement('button');b.className='btn';b.textContent=t;if(id){b.id=id}b.onclick=fn;return b}
function mkRow(){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap='6px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function S(){try{return window.S||window.state||window.APPSTATE||{}}catch(e){return {}}}
function r1(n){return Math.round(n*10)/10}
function genre(){var s=S();var st=(s.style||s.editStyle||'').toString().toLowerCase();var txt=st+' '+JSON.stringify(s.clips||[]).toLowerCase();
 if(txt.indexOf('phonk')>=0){return 'phonk'}if(txt.indexOf('sport')>=0||txt.indexOf('basketball')>=0||txt.indexOf('gym')>=0){return 'sport'}
 if(txt.indexOf('anime')>=0){return 'anime'}if(txt.indexOf('blend')>=0){return 'blend'}return st||'general'}
function dl(name,text){try{var b=new Blob([text],{type:'text/plain'});var u=URL.createObjectURL(b);var a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},800);log('download started - '+name,true)}catch(e){log('download blocked, '+e.message)}}

// ---- 1 TREND SPOTLIGHT ----
function trspot(){
 var g=genre();
 log('TREND SPOTLIGHT - genre read: '+g,true);
 log('the format that wins is the one you can rebuild in under 30 min; speed to ride a trend beats polish',true);
 log(g==='phonk'?'phonk: 3 hard cuts into the drop, 0.3-0.5s flashes, VHS grain + chroma shift, 7-10s total'
  :g==='sport'?'sport: slow-mo build 1.5s, drop lands on the contact frame, camera shake on impact, 9-13s'
  :g==='anime'?'anime: manga panel flash cuts on the hi-hat, glow + shake on the power-up frame, 8-12s loop'
  :g==='blend'?'blend: 2-3 layer mask wipes landing on the snare, one anchor subject visible every cut'
  :'general: hook in frame 1, one transition style repeated 5+ times, total under 12s',true);
 log('structure to steal: hook 0-0.5s, escalation every 1.5-2s, payoff frame at 80%, loop seam at 100%');
 log('scan your feed for 10 min daily and save 3 references; react, do not doomscroll');
 log('ride a trend inside 48h of seeing it twice - third sighting means it is already peaking',true);
}

// ---- 2 SOUND STRATEGY ----
function tsound(){
 var g=genre();
 log('SOUND STRATEGY - genre: '+g,true);
 log('pick rising sounds under 10k uses: room to own the tag, and the sound page still sends viewers',true);
 log('revival tactic: pair a 2020-2022 nostalgia track with a fresh visual style - search feels new, feed feels familiar');
 log('own-audio plan: voice 1 line over the trend sound, then post clean own-audio versions once the format is proven');
 log('cut to the beat: place your hardest cut 2-3 frames BEFORE the drop, not on it, so the hit feels earned');
 log('keep the first 1.5s loud: tiktok weighs early audio retention in ranking');
 log('save the sound id of anything you use so a working combo is repeatable across posts',true);
}

// ---- 3 HASHTAG STACK ----
function thash(){
 var g=genre();
 log('HASHTAG STACK - genre: '+g,true);
 if(g==='phonk'){log('niche: #phonk #phonkedit #phonkdrift')}
 else if(g==='sport'){log('niche: #sportedit #basketballedits #gymmotivation')}
 else if(g==='anime'){log('niche: #animeedit #animemoments #mangaedit')}
 else if(g==='blend'){log('niche: #blendedit #transitionedit #editutorial')}
 else{log('niche: 3 tags that describe the exact clip, not the app you used')}
 log('broad: #fyp #edit - 2 max, they add reach but no targeting');
 log('branded: 1 tag you own and repeat on every post, e.g. your handle tag',true);
 log('total 6 tags: 3 niche + 2 broad + 1 branded, never more');
 log('avoid: #fyp #foryou #viral together - that reads as spam and dilutes the niche signal',true);
}

// ---- 4 POST TIME PLAN ----
function ttime(){
 var g=genre(),d=new Date();
 log('POST TIME PLAN - genre: '+g+' - your tz America/New_York, now '+d.toLocaleTimeString(),true);
 log('baseline for ET audiences: 7-9am commute, 12-1pm lunch, 7-10pm prime; prime wins for edits',true);
 log('sport + phonk skew late: 9-11pm posts hold; anime skews after school 3-5pm');
 log('cadence beats timing: 1 post/day at a consistent time trains the algorithm and the audience');
 log('post your best attempt 30-60 min BEFORE the peak window so it can warm up into it',true);
 log('never post twice inside 3h - the second post eats the first one reach');
 log('weekend shift: saturday mornings 9-11am overperform for edit content');
}

// ---- 5 DUET RIP IDEAS ----
function tduet(){
 var g=genre();
 log('DUET/RIP IDEAS - genre: '+g,true);
 log('duet split-screen: your reaction or rebuild on the right, original on the left, cut together on the beat',true);
 log('stitch 1s of the original then continue with your version - steals its momentum in the first frame');
 log('green-screen rip: play the original small over your rebuild, annotate what makes it work');
 log('remake chain: post your version, pin a comment asking which original to remake next - built-in series fuel',true);
 log('credit rule: tag the original creator every time; it converts to collabs, not strikes',true);
 log('per genre: phonk = car build duets, sport = skill challenge stitches, anime = power-up remakes, blend = transition battles');
}

// ---- 6 SERIES BUILDER ----
function tseries(){
 var g=genre();
 log('SERIES BUILDER - genre: '+g,true);
 log('naming: part 1 must promise the series - "ranked: every ... pt.1" style titles farm follows, not views',true);
 log('structure: 5-8 parts, each 8-15s, one escalating rule per part, never re-explain part 1');
 log('cliffhanger: end every part mid-action on the beat drop, never on a conclusion');
 log('schedule: same time daily while the series runs; gaps kill momentum faster than weak parts',true);
 log('compile move: after the finale, post a compilation of the best moments - it recycles the series for new viewers');
 log('playlists: put the series in a playlist and mention part N in the caption so binge depth stacks');
}

// ---- 7 NICHE MAP ----
function tniche(){
 var g=genre();
 log('NICHE MAP - genre read: '+g,true);
 log('positioning formula: [genre] edits for [specific audience], e.g. gym phonk edits for lifters who train at 5am',true);
 log('sub-niche beats broad: car phonk > phonk > edits; pick the smallest niche you can post daily for 30 days');
 log('audit: if a stranger can say what you make from 3 posts, the positioning works; if not, tighten it');
 log('content ratio: 70% your core niche, 20% adjacent experiments, 10% personality/community posts',true);
 log('bio line must repeat the niche in under 10 words - profile visits convert from it');
 log('do not chase two niches on one account; a second account is cheaper than a confused algorithm',true);
}

// ---- 8 VIRAL CHECKLIST ----
function tcheck(){
 var s=S(),cs=s.clips||[],g=genre(),miss=[];
 log('VIRAL CHECKLIST - pre-post pass on the live project ('+cs.length+' clips)',true);
 if(!cs.length){miss.push('timeline: no clips yet')}
 if(!s.music&&!s.track&&!s.song){miss.push('music: no track loaded')}
 if(!(s.captions||s.caps||s.captionLines||[]).length){miss.push('captions: none written')}
 if(!s.cover&&!s.coverCv){miss.push('cover: not made')}
 var L=['VIRAL CHECKLIST - '+new Date().toLocaleString(),'GENRE: '+g,''];
 L.push('10 points: 1 hook lands in frame 1  2 hard cut by 1.5s  3 cut on beat  4 caption on every key beat  5 loop seam clean  6 safe zones respected  7 sound under 10k uses or own audio  8 6-tag stack ready  9 cover readable at thumbnail size  10 post window scheduled');
 L.push('');
 if(miss.length){L.push('MISSING NOW:');for(var i=0;i<miss.length;i++){L.push('- '+miss[i])}}else{L.push('project state: all trackable items present - clear to post')}
 L.push('');
 L.push('manual pass (eyes only): watch at 1x, if you do not rewatch the loop twice, fix the seam before posting');
 log('checklist: '+(miss.length?miss.join(' | '):'all trackable items present - clear to post'),true);
 log('full sheet downloaded - trends-sheet.txt includes the 10-point pass');
}

// ---- 9 COMPETITOR WATCH ----
function twatch(){
 var g=genre();
 log('COMPETITOR WATCH - genre: '+g,true);
 log('pick 5 accounts your size (0.5-2x your followers) in the exact niche; ignore mega accounts, their math does not transfer',true);
 log('4 metrics to copy: hook style of their top 3, caption length, posting time, sound choice on breakouts');
 log('log it weekly: for each competitor note their best post, its structure, and what you can do one better',true);
 log('steal structure, never footage: same cut rhythm with your own clips is fair game');
 log('comment sections: the questions in their comments are your next video topics, pre-validated');
 log('do not watch-passively: 20 focused minutes per week on this beats hours of scrolling');
}

// ---- 10 TRENDS SHEET .TXT ----
function tsheet(){
 var g=genre(),d=new Date(),s=S(),cs=s.clips||[];
 var L=[];
 L.push('TRENDS SHEET - '+d.toLocaleString());
 L.push('GENRE: '+g);
 L.push('');
 L.push('FORMAT TO RIDE NOW: hook 0-0.5s, escalation every 1.5-2s, payoff at 80%, clean loop at 100%');
 L.push('SOUND: rising track under 10k uses, cut 2-3 frames before the drop, loud first 1.5s');
 L.push('HASHTAGS: 3 niche + 2 broad + 1 branded = 6 total');
 L.push('POST TIME (ET): 7-9am / 12-1pm / 7-10pm, best attempt 30-60 min before peak, 1 post/day');
 L.push('SERIES: 5-8 parts, cliffhanger on the drop, compile the best moments after the finale');
 L.push('');
 L.push('THIS WEEK PLAN:');
 L.push('mon: ride one fresh trend with your proven structure');
 L.push('tue: stitch or duet a competitor top post, credit them');
 L.push('wed: series part N, same time as monday');
 L.push('thu: experiment post (adjacent niche, 20% slot)');
 L.push('fri: best-of week compilation or community reply video');
 L.push('sat: morning post 9-11am test');
 L.push('sun: plan + competitor log + rest');
 L.push('');
 if(cs.length){L.push('PROJECT: '+cs.length+' clips, ready to cut into the winning format');}
 else{L.push('PROJECT: timeline empty - load clips, then work this plan against them');}
 L.push('');
 L.push('NEXT BREAKOUT TO REMAKE: ____________________');
 L.push('MY OWNED HASHTAG: ____________________');
 dl('trends-sheet.txt',L.join('\n'));
}

function mount(){
 if(document.getElementById('f55b1')){return}
 var card=document.createElement('div');card.className='card';card.id='f55card';
 var h=document.createElement('h2');h.textContent='TRENDS LAB';card.appendChild(h);
 var r1r=mkRow();r1r.appendChild(mkBtn('TREND SPOTLIGHT',trspot,'f55b1'));r1r.appendChild(mkBtn('SOUND STRATEGY',tsound,'f55b2'));card.appendChild(r1r);
 var r2=mkRow();r2.appendChild(mkBtn('HASHTAG STACK',thash,'f55b3'));r2.appendChild(mkBtn('POST TIME PLAN',ttime,'f55b4'));card.appendChild(r2);
 var r3=mkRow();r3.appendChild(mkBtn('DUET RIP IDEAS',tduet,'f55b5'));r3.appendChild(mkBtn('SERIES BUILDER',tseries,'f55b6'));card.appendChild(r3);
 var r4=mkRow();r4.appendChild(mkBtn('NICHE MAP',tniche,'f55b7'));r4.appendChild(mkBtn('VIRAL CHECKLIST',tcheck,'f55b8'));card.appendChild(r4);
 var r5=mkRow();r5.appendChild(mkBtn('COMPETITOR WATCH',twatch,'f55b9'));r5.appendChild(mkBtn('TRENDS SHEET .TXT',tsheet,'f55b10'));card.appendChild(r5);
 var note=document.createElement('div');note.className='note';note.id='f55note';note.textContent='trends lab is the growth side: trend spotlight, sound strategy, hashtag stack, post time plan, duet rip ideas, series builder, niche map, viral checklist, competitor watch and a downloadable trends sheet.';
 card.appendChild(note);
 var hs=document.querySelectorAll('.card h2'),anchor=null;
 for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('CAPTION LAB')>=0){anchor=hs[i].parentElement;break}}
 if(anchor){if(anchor.nextSibling){anchor.parentElement.insertBefore(card,anchor.nextSibling)}else{anchor.parentElement.appendChild(card)}}
 else{var ap=document.querySelector('#panelcol')||document.body;ap.appendChild(card)}
 log('trends lab live - trend spotlight, sound strategy, hashtag stack, post time plan, duet rip ideas, series builder, niche map, viral checklist, competitor watch, trends sheet');
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',mount)}else{mount()}
})();
