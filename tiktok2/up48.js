'use strict';
// up48.js - PHASE 42 ENGAGEMENT LAB (Nov 24 2026)
// cta timeline, comment bait, pinned comment, hashtag sets,
// post window, reply templates, duet plan, series name,
// share bait, engagement sheet
(function(){
if(window.__tk2up48){return}window.__tk2up48=1;
function mkBtn(t,fn,id){var b=document.createElement('button');b.className='btn';b.textContent=t;if(id){b.id=id}b.onclick=fn;return b}
function mkRow(){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap='6px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function S(){try{return window.S||window.state||window.APPSTATE||{}}catch(e){return {}}}
function clipDur(c){var st=parseFloat(c.start),en=parseFloat(c.end);if(!isFinite(st)||!isFinite(en)){return 0}return Math.max(0,(en-st))/(c.speed||1)}
function clips(){var s=S();var a=(s&&s.clips)||[];var out=[],t=0;for(var i=0;i<a.length;i++){var d=clipDur(a[i]);if(d>0.05){t+=d;out.push({c:a[i],d:d,t0:t})}}for(var j=0;j<out.length;j++){out[j].t0-=out[j].d}return out}
function runtime(){var cs=clips();if(!cs.length){return 0}return cs[cs.length-1].t0+cs[cs.length-1].d}
function needClips(){if(!clips().length){log('engagement lab: add clips to the timeline first');return false}return true}
function saveE(){try{if(typeof save==='function'){save()}}catch(e){}}
function r1(n){return Math.round(n*10)/10}
function dl(name,text){try{var b=new Blob([text],{type:'text/plain'});var u=URL.createObjectURL(b);var a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},800);log('download started - '+name,true)}catch(e){log('download blocked, '+e.message)}}
function cta(){if(!needClips()){return}
 var n=clips().length,rt=runtime();
 var k=Math.max(1,Math.round(rt/6));
 log('CTA TIMELINE - '+k+' CTA beat(s) on this '+r1(rt)+'s edit: one every 6s, spoken or voiceover, never burned text',true);
 log('CTA TIMELINE - first CTA never before 40% of runtime ('+r1(rt*0.4)+'s): asking before you gave value cuts retention',true);
 log('CTA TIMELINE - the last CTA sits in the final 2s over the payoff frame, not after it: post-payoff CTAs get skipped',true)}
function bait(){if(!needClips()){return}
 var n=clips().length;
 var nb=Math.max(1,Math.round(n/4));
 log('COMMENT BAIT - seed '+nb+' comment prompt(s): one open question every 4 clips across your '+n+' clip timeline',true);
 log('COMMENT BAIT - strongest prompt inside the first 3s: a either-or split choice pulls 2-3x more comments than an open question',true);
 log('COMMENT BAIT - reply to every top comment within 60min of posting: replies count as engagement and can double comment volume',true)}
function pin(){if(!needClips()){return}
 log('PINNED COMMENT - pin a question, not a thank-you: drop your score 1-10 style pins outperform thanks-for-watching pins',true);
 log('PINNED COMMENT - keep it 12-20 words, one question, no link: links in pinned comments suppress the whole thread',true);
 log('PINNED COMMENT - pin it before the first reply lands so every reply branches under yours, not next to it',true)}
function tags(){if(!needClips()){return}
 log('HASHTAG SETS - build 3 sets of 10: broad 3, niche 5, exact 2; rotate one set per post, never all 10 at once',true);
 log('HASHTAG SETS - broad 3 are #fyp class, niche 5 are mid-size lane tags, exact 2 literally name the subject of this edit',true);
 log('HASHTAG SETS - swap one niche tag per post and log reach in the sheet: tags left unchanged 2+ weeks rot',true)}
function post(){if(!needClips()){return}
 var rt=runtime();
 var tier=rt>=30?'long':'short';
 log('POST WINDOW - this '+r1(rt)+'s cut is a '+tier+' watch: schedule 6-9pm Tue-Thu, second-best 9-11am Sat',true);
 log('POST WINDOW - post 15min before the lane peak so the first 30min of velocity lands inside it',true);
 log('POST WINDOW - never post twice within 4h: the second upload cannibalizes the first push',true)}
function reply(){if(!needClips()){return}
 var n=clips().length;
 var per=Math.max(2,Math.round(n/6));
 log('REPLY TEMPLATES - 3 ready replies: thanks+question, correction-thanks, part 2 if this hits X saves',true);
 log('REPLY TEMPLATES - answer the pinned thread first: replies there lift the read rate of the whole comment section',true);
 log('REPLY TEMPLATES - pace '+per+' replies per hour for the first 3h, spaced: reply bursts read as spam',true)}
function duet(){if(!needClips()){return}
 var n=clips().length,rt=runtime();
 var k=Math.min(3,Math.max(1,Math.round(n/4)));
 log('DUET PLAN - duet the top '+k+' post(s) in your niche this week: react within 48h of their peak',true);
 log('DUET PLAN - side-by-side for reactions, stitch for continuations; keep your half under '+r1(Math.min(15,rt/2))+'s',true);
 log('DUET PLAN - credit the original with an @handle in text, not a hashtag: handles pull their audience over directly',true)}
function series(){if(!needClips()){return}
 var n=clips().length,rt=runtime();
 var ep=Math.max(2,Math.round(rt/10));
 log('SERIES NAME - name it <subject> part '+ep+': part numbers lift return views double digits when they sit in caption AND on-screen',true);
 log('SERIES NAME - this project reads as episode '+ep+' ('+n+' clips, '+r1(rt)+'s): end on an open loop that names part '+(ep+1),true);
 log('SERIES NAME - keep one keyword constant across every part so search stacks the whole series on one page',true)}
function share(){if(!needClips()){return}
 var rt=runtime();
 var sb=Math.max(2,Math.round(rt/10));
 log('SHARE BAIT - build '+sb+' share moment(s): one look-at-this frame every ~'+r1(rt/sb)+'s',true);
 log('SHARE BAIT - strongest trigger is a number people argue about: state it, then defend it in the pinned comment',true);
 log('SHARE BAIT - make it DM-able: 9:16 full-screen, no watermark, text readable at a glance',true)}
function sheet(){if(!needClips()){return}
 var n=clips().length,rt=runtime();
 var L=[];
 L.push('ENGAGEMENT SHEET - generated '+new Date().toLocaleString());
 L.push('project: '+n+' clips, '+r1(rt)+'s runtime');
 L.push('');
 L.push('CTA TIMELINE: '+Math.max(1,Math.round(rt/6))+' beats every 6s, first after '+r1(rt*0.4)+'s, last in final 2s');
 L.push('COMMENT BAIT: '+Math.max(1,Math.round(n/4))+' prompt(s), strongest in first 3s');
 L.push('PINNED COMMENT: 12-20 words, one question, pin before first reply');
 L.push('HASHTAG SETS: 3 sets x 10 (broad 3 / niche 5 / exact 2), rotate per post');
 L.push('POST WINDOW: 6-9pm Tue-Thu primary, 9-11am Sat secondary, 15min pre-peak');
 L.push('REPLY TEMPLATES: 3 templates, '+Math.max(2,Math.round(n/6))+'/hour first 3h');
 L.push('DUET PLAN: top '+Math.min(3,Math.max(1,Math.round(n/4)))+' posts within 48h of peak, your half under '+r1(Math.min(15,rt/2))+'s');
 L.push('SERIES NAME: part '+Math.max(2,Math.round(rt/10))+', keyword constant, name part '+(Math.max(2,Math.round(rt/10))+1)+' at the end');
 L.push('SHARE BAIT: '+Math.max(2,Math.round(rt/10))+' moments every ~'+r1(rt/Math.max(2,Math.round(rt/10)))+'s');
 L.push('MIX: none. This is an engagement pass, audio untouched');
 dl('engagement-sheet.txt',L.join('\n'))}
function mount(){
 if(document.getElementById('f48b1')){return}
 var card=document.createElement('div');card.className='card';card.id='f48card';
 var h=document.createElement('h2');h.textContent='ENGAGEMENT LAB';card.appendChild(h);
 var r1r=mkRow();r1r.appendChild(mkBtn('CTA TIMELINE',cta,'f48b1'));r1r.appendChild(mkBtn('COMMENT BAIT',bait,'f48b2'));card.appendChild(r1r);
 var r2=mkRow();r2.appendChild(mkBtn('PINNED COMMENT',pin,'f48b3'));r2.appendChild(mkBtn('HASHTAG SETS',tags,'f48b4'));card.appendChild(r2);
 var r3=mkRow();r3.appendChild(mkBtn('POST WINDOW',post,'f48b5'));r3.appendChild(mkBtn('REPLY TEMPLATES',reply,'f48b6'));card.appendChild(r3);
 var r4=mkRow();r4.appendChild(mkBtn('DUET PLAN',duet,'f48b7'));r4.appendChild(mkBtn('SERIES NAME',series,'f48b8'));card.appendChild(r4);
 var r5=mkRow();r5.appendChild(mkBtn('SHARE BAIT',share,'f48b9'));r5.appendChild(mkBtn('ENGAGEMENT SHEET .TXT',sheet,'f48b10'));card.appendChild(r5);
 var note=document.createElement('div');note.className='note';note.id='f48note';note.textContent='engagement lab plans the community side: cta beats, comment bait, pinned comment, hashtag sets, post window, reply templates, duet plan, series name, share bait and a downloadable engagement sheet.';
 card.appendChild(note);
 var hs=document.querySelectorAll('.card h2'),anchor=null;
 for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('TRANSITION LAB')>=0){anchor=hs[i].parentElement;break}}
 if(anchor){if(anchor.nextSibling){anchor.parentElement.insertBefore(card,anchor.nextSibling)}else{anchor.parentElement.appendChild(card)}}
 else{var ap=document.querySelector('#panelcol')||document.body;ap.appendChild(card)}
 log('engagement lab live - cta timeline, comment bait, pinned comment, hashtag sets, post window, reply templates, duet plan, series name, share bait, engagement sheet');
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',mount)}else{mount()}
})();