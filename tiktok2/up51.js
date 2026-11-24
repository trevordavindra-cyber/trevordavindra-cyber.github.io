'use strict';
// up51.js - PHASE 45 AUDIENCE LAB (Nov 24 2026)
// audience profile, content pillars, retention map, audience segments,
// collab radar, poll picker, fan ladder, community rituals, feedback miner, audience sheet
(function(){
if(window.__tk2up51){return}window.__tk2up51=1;
function mkBtn(t,fn,id){var b=document.createElement('button');b.className='btn';b.textContent=t;if(id){b.id=id}b.onclick=fn;return b}
function mkRow(){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap='6px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function S(){try{return window.S||window.state||window.APPSTATE||{}}catch(e){return {}}}
function clipDur(c){var st=parseFloat(c.start),en=parseFloat(c.end);if(!isFinite(st)||!isFinite(en)){return 0}return Math.max(0,(en-st))/(c.speed||1)}
function clips(){var s=S();var a=(s&&s.clips)||[];var out=[],t=0;for(var i=0;i<a.length;i++){var d=clipDur(a[i]);if(d>0.05){t+=d;out.push({c:a[i],d:d,t0:t})}}for(var j=0;j<out.length;j++){out[j].t0-=out[j].d}return out}
function runtime(){var cs=clips();if(!cs.length){return 0}return cs[cs.length-1].t0+cs[cs.length-1].d}
function needClips(){if(!clips().length){log('audience lab: add clips to the timeline first');return false}return true}
function saveE(){try{if(typeof save==='function'){save()}}catch(e){}}
function r1(n){return Math.round(n*10)/10}
function genre(){var s=S();var st=(s.style||s.editStyle||'').toString().toLowerCase();var txt=st+' '+JSON.stringify(s.clips||[]).toLowerCase();
 if(txt.indexOf('phonk')>=0){return 'phonk'}if(txt.indexOf('sport')>=0||txt.indexOf('basketball')>=0||txt.indexOf('gym')>=0){return 'sport'}
 if(txt.indexOf('anime')>=0){return 'anime'}if(txt.indexOf('blend')>=0){return 'blend'}return st||'general'}
function dl(name,text){try{var b=new Blob([text],{type:'text/plain'});var u=URL.createObjectURL(b);var a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},800);log('download started - '+name,true)}catch(e){log('download blocked, '+e.message)}}
var G;
var PERSONA={'phonk':{age:'14-22',when:'late night, headphones in',rewind:'the speed-ramp and the drop frame',skip:'static intros, long buildups'},
'sport':{age:'13-24',when:'between classes and games',rewind:'the skill moment, frame-stepped',skip:'talking-head setups, scoreboard padding'},
'anime':{age:'14-25',when:'evening binge sessions',rewind:'the panel-match cut and theory beat',skip:'unlabeled spoilers and 5s logos'},
'blend':{age:'16-30',when:'scrolling with sound off first',rewind:'the seam where the two styles meet',skip:'anything that explains the joke before showing it'},
'general':{age:'16-34',when:'mixed, mostly mobile daytime',rewind:'whatever the caption teased',skip:'first 2 seconds with no motion'}};
function profile(){if(!needClips()){return}G=genre();var p=PERSONA[G]||PERSONA['general'];var rt=runtime();
 log('AUDIENCE PROFILE - genre read: '+G+', '+r1(rt)+'s cut. persona: '+p.age+', watching '+p.when,true);
 log('AUDIENCE PROFILE - they rewind: '+p.rewind+'. give every video one rewound moment inside the first 40%',true);
 log('AUDIENCE PROFILE - they skip: '+p.skip+'. first '+r1(Math.min(2,rt*0.13))+'s must be motion, no title card',true);
 log('AUDIENCE PROFILE - sound-off pass matters: '+p.age+' scrolls muted first; captions carry the video before audio does',true)}
function pillars(){if(!needClips()){return}G=G||genre();var n=clips().length;
 log('CONTENT PILLARS - four pillars for a '+G+' channel, post mix in brackets:',true);
 log('CONTENT PILLARS - 1) core format ('+G+' edits, 50%) - the series engine, this project is pillar 1',true);
 log('CONTENT PILLARS - 2) process/behind-the-cut (20%) - screen-record the timeline, viewers follow builders',true);
 log('CONTENT PILLARS - 3) community answers (20%) - reply-to-comment edits, polls, duet chains',true);
 log('CONTENT PILLARS - 4) experiments (10%) - new style tests, failures included; test clips belong in pillar 4, not the series',true);
 log('CONTENT PILLARS - '+n+' clips on the timeline now map to pillar 1; log which pillar every post hits and rebalance monthly',true)}
function retention(){if(!needClips()){return}var cs=clips(),n=cs.length,rt=runtime();var cps=n/Math.max(1,rt);var avg=rt/Math.max(1,n);
 log('RETENTION MAP - pacing read: '+r1(cps)+' cuts/s, avg shot '+r1(avg)+'s over '+n+' clips',true);
 log('RETENTION MAP - drop point 1: 0-3s. fix: open on the strongest '+r1(Math.min(1.5,avg/2))+'s of footage, cut in mid-action',true);
 log('RETENTION MAP - drop point 2: 8-10s. fix: place the payoff tease there, not the payoff, so the ending stays unspent',true);
 log('RETENTION MAP - drop point 3: last 20%. fix: end on a loop seam, rewatch reads as extra watch time',true);
 log(cps<1.2?'RETENTION MAP - verdict: too slow for feed pacing, tighten to 1.5-2 cuts/s':'RETENTION MAP - verdict: pacing is in feed range, hold it',true)}
function segments(){if(!needClips()){return}var rt=runtime();G=G||genre();
 log('AUDIENCE SEGMENTS - three segments every '+G+' cut reaches, '+r1(rt)+'s cut:',true);
 log('AUDIENCE SEGMENTS - skimmers (~60%): watch 2s muted. need: motion frame 1 + burned-in hook line',true);
 log('AUDIENCE SEGMENTS - bingers (~25%): watch full, go to profile. need: series naming + pinned part 1 link',true);
 log('AUDIENCE SEGMENTS - sharers (~15%): send to one friend. need: one screenshot-able moment, one-line caption',true);
 log('AUDIENCE SEGMENTS - build for skimmers, reward bingers, arm the sharers: every edit needs all three hooks',true)}
function collab(){if(!needClips()){return}G=G||genre();
 log('COLLAB RADAR - who collabs with a '+G+' editor, in order of fit:',true);
 log('COLLAB RADAR - 1) same-size '+G+' editors: duet/remix trades, both audiences double, ask in comments not DMs first',true);
 log('COLLAB RADAR - 2) source creators: you cut their footage, they post it, you get credit + raw files',true);
 log('COLLAB RADAR - 3) one account one tier up: offer a free edit of their best clip, deliver before asking for anything',true);
 log('COLLAB RADAR - rule: one outreach thread at a time, tracked in the idea bank, answer within 24h or drop it',true)}
function polls(){if(!needClips()){return}G=G||genre();
 log('POLL PICKER - three ready-to-post audience polls for '+G+':',true);
 log('POLL PICKER - 1) "which cut hits harder, A or B?" post the two versions of the same edit, comments decide part 2',true);
 log('POLL PICKER - 2) "what should I edit next?" two options from the idea bank, winner gets built this week',true);
 log('POLL PICKER - 3) "rate this cut 1-10, 8+ means part 2 drops" number comments feed the algorithm twice',true);
 log('POLL PICKER - polls are content: screenshot the result, make it the next video\'s thumbnail',true)}
function ladder(){if(!needClips()){return}
 log('FAN LADDER - stranger to fan, four rungs. current cut: '+r1(runtime())+'s',true);
 log('FAN LADDER - rung 1 stranger: hook + loop, zero asks. rung 2 viewer: ask one binary question in the caption',true);
 log('FAN LADDER - rung 3 commenter: reply to first 20 comments in hour 1, one open question per reply',true);
 log('FAN LADDER - rung 4 fan: name them. shout out commenters by handle inside the next edit, fans recruit fans',true);
 log('FAN LADDER - never jump rungs: no follow-asks, no link-drops before rung 3',true)}
function rituals(){if(!needClips()){return}var rt=runtime();
 log('COMMUNITY RITUALS - build three weekly rituals viewers can set a clock by:',true);
 log('COMMUNITY RITUALS - 1) named drop day: same weekday, same '+r1(Math.min(30,rt*2))+'s format, name it and pin the schedule',true);
 log('COMMUNITY RITUALS - 2) a recurring bit: a signature transition or sound sting only your edits have, never explain it',true);
 log('COMMUNITY RITUALS - 3) a callback: reopen last week\'s top comment inside this week\'s edit, viewers chase continuity',true);
 log('COMMUNITY RITUALS - rituals compound: miss one week and the algorithm notices before the audience does',true)}
function miner(){var k='tk2ideabank';var cur=[];try{cur=JSON.parse(localStorage.getItem(k)||'[]')}catch(e){cur=[]}
 var s=S();var caps=[];var cl=(s&&s.clips)||[];for(var i=0;i<cl.length;i++){if(cl[i].caption){caps.push((cl[i].caption||'').toString())}}
 log('FEEDBACK MINER - reading '+cur.length+' banked idea(s) and '+caps.length+' caption(s) for audience asks:',true);
 var asked=0;for(var j=0;j<cur.length;j++){var t=(cur[j]||'').toString().toLowerCase();
  if(t.indexOf('part')>=0||t.indexOf('series')>=0){log('FEEDBACK MINER - series demand: "'+cur[j]+'". build part N+1 before anything new');asked++}
  else if(t.indexOf('slower')>=0||t.indexOf('longer')>=0){log('FEEDBACK MINER - pacing ask: "'+cur[j]+'". next cut targets 1.2 cuts/s max');asked++}
  else if(t.indexOf('tutorial')>=0||t.indexOf('how')>=0){log('FEEDBACK MINER - teach demand: "'+cur[j]+'". one 30s process clip beats five edits');asked++}}
 if(!asked){log('FEEDBACK MINER - no pattern yet. rule: bank every repeated comment word-for-word; three repeats = the next edit')}
 log('FEEDBACK MINER - the audience tells you what to build next, the bank is the inbox',true)}
function sheet(){if(!needClips()){return}var n=clips().length,rt=runtime();G=G||genre();var p=PERSONA[G]||PERSONA['general'];
 var cs=clips();var cps=n/Math.max(1,rt);
 var L=[];L.push('AUDIENCE SHEET - generated '+new Date().toLocaleString());
 L.push('PROJECT: '+n+' clips, '+r1(rt)+'s, genre read: '+G+', '+r1(cps)+' cuts/s');
 L.push('');L.push('AUDIENCE PROFILE: '+p.age+', '+p.when+'; rewind: '+p.rewind+'; skip: '+p.skip);
 L.push('PILLARS: core 50% / process 20% / community 20% / experiments 10%');
 L.push('RETENTION: drop 0-3s (open mid-action), 8-10s (payoff tease), last 20% (loop seam); pacing '+(cps<1.2?'too slow, target 1.5-2 cuts/s':'in range'));
 L.push('SEGMENTS: skimmers 60% (motion+hook) / bingers 25% (series+part 1) / sharers 15% (screenshot moment)');
 L.push('COLLAB: duet trades same-size, source-creator cuts, one free edit one tier up; one thread at a time');
 L.push('POLLS: A/B cut vote / next-build vote / 1-10 rating; screenshot result as next thumbnail');
 L.push('FAN LADDER: stranger(no ask) - viewer(binary q) - commenter(reply 20 in hour 1) - fan(named shoutout)');
 L.push('RITUALS: named drop day + signature sting + weekly comment callback');
 L.push('MIX: none. audience lab is read-only, project untouched');
 dl('audience-sheet.txt',L.join('\n'))}
function mount(){
 if(document.getElementById('f51b1')){return}
 var card=document.createElement('div');card.className='card';card.id='f51card';
 var h=document.createElement('h2');h.textContent='AUDIENCE LAB';card.appendChild(h);
 var r1r=mkRow();r1r.appendChild(mkBtn('AUDIENCE PROFILE',profile,'f51b1'));r1r.appendChild(mkBtn('CONTENT PILLARS',pillars,'f51b2'));card.appendChild(r1r);
 var r2=mkRow();r2.appendChild(mkBtn('RETENTION MAP',retention,'f51b3'));r2.appendChild(mkBtn('AUDIENCE SEGMENTS',segments,'f51b4'));card.appendChild(r2);
 var r3=mkRow();r3.appendChild(mkBtn('COLLAB RADAR',collab,'f51b5'));r3.appendChild(mkBtn('POLL PICKER',polls,'f51b6'));card.appendChild(r3);
 var r4=mkRow();r4.appendChild(mkBtn('FAN LADDER',ladder,'f51b7'));r4.appendChild(mkBtn('COMMUNITY RITUALS',rituals,'f51b8'));card.appendChild(r4);
 var r5=mkRow();r5.appendChild(mkBtn('FEEDBACK MINER',miner,'f51b9'));r5.appendChild(mkBtn('AUDIENCE SHEET .TXT',sheet,'f51b10'));card.appendChild(r5);
 var note=document.createElement('div');note.className='note';note.id='f51note';note.textContent='audience lab covers the who-watches side: audience profile, content pillars, retention map, segments, collab radar, poll picker, fan ladder, community rituals, feedback miner and a downloadable audience sheet.';
 card.appendChild(note);
 var hs=document.querySelectorAll('.card h2'),anchor=null;
 for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('IDEAS LAB')>=0){anchor=hs[i].parentElement;break}}
 if(anchor){if(anchor.nextSibling){anchor.parentElement.insertBefore(card,anchor.nextSibling)}else{anchor.parentElement.appendChild(card)}}
 else{var ap=document.querySelector('#panelcol')||document.body;ap.appendChild(card)}
 log('audience lab live - audience profile, content pillars, retention map, segments, collab radar, poll picker, fan ladder, community rituals, feedback miner, audience sheet');
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',mount)}else{mount()}
})();
