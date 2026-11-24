'use strict';
// up52.js - PHASE 46 MONETIZATION LAB (Nov 24 2026)
// earnings estimator, fund check, gift strategy, affiliate setup, brand pitch,
// rate card, series pricing, product linker, sponsor tracker, money sheet
(function(){
if(window.__tk2up52){return}window.__tk2up52=1;
function mkBtn(t,fn,id){var b=document.createElement('button');b.className='btn';b.textContent=t;if(id){b.id=id}b.onclick=fn;return b}
function mkRow(){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap='6px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function S(){try{return window.S||window.state||window.APPSTATE||{}}catch(e){return {}}}
function clipDur(c){var st=parseFloat(c.start),en=parseFloat(c.end);if(!isFinite(st)||!isFinite(en)){return 0}return Math.max(0,(en-st))/(c.speed||1)}
function clips(){var s=S();var a=(s&&s.clips)||[];var out=[],t=0;for(var i=0;i<a.length;i++){var d=clipDur(a[i]);if(d>0.05){t+=d;out.push({c:a[i],d:d,t0:t})}}for(var j=0;j<out.length;j++){out[j].t0-=out[j].d}return out}
function runtime(){var cs=clips();if(!cs.length){return 0}return cs[cs.length-1].t0+cs[cs.length-1].d}
function needClips(){if(!clips().length){log('monetization lab: add clips to the timeline first');return false}return true}
function r1(n){return Math.round(n*10)/10}
function genre(){var s=S();var st=(s.style||s.editStyle||'').toString().toLowerCase();var txt=st+' '+JSON.stringify(s.clips||[]).toLowerCase();
 if(txt.indexOf('phonk')>=0){return 'phonk'}if(txt.indexOf('sport')>=0||txt.indexOf('basketball')>=0||txt.indexOf('gym')>=0){return 'sport'}
 if(txt.indexOf('anime')>=0){return 'anime'}if(txt.indexOf('blend')>=0){return 'blend'}return st||'general'}
function dl(name,text){try{var b=new Blob([text],{type:'text/plain'});var u=URL.createObjectURL(b);var a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},800);log('download started - '+name,true)}catch(e){log('download blocked, '+e.message)}}
var G;
var RPM={'phonk':{low:0.03,high:0.09,note:'music-heavy edits ride low RPM, volume is the money'},
'sport':{low:0.04,high:0.12,note:'sports clips get brand adjacency, watch for rights claims'},
'anime':{low:0.03,high:0.08,note:'clip channels monetize off merch + affiliate more than fund'},
'blend':{low:0.05,high:0.14,note:'original-style blends earn the highest RPM, originality reads to the fund reviewers'},
'general':{low:0.03,high:0.10,note:'mixed content, price the middle and upside is bonus'}};
function money(){if(!needClips()){return}var rt=runtime();G=genre();var r=RPM[G]||RPM['general'];var views=[10000,100000,1000000];
 log('EARNINGS ESTIMATOR - '+G+' read, '+r1(rt)+'s runtime. note: '+r.note,true);
 log('EARNINGS ESTIMATOR - fund-only math per 10k / 100k / 1M views at $'+r1(r.low)+'-'+r1(r.high)+' per 1k:',true);
 log('EARNINGS ESTIMATOR - 10k views: $'+r1(10*r.low)+'-'+r1(10*r.high)+' | 100k: $'+r1(100*r.low)+'-'+r1(100*r.high)+' | 1M: $'+r1(1000*r.low)+'-'+r1(1000*r.high),true);
 log('EARNINGS ESTIMATOR - the fund is the floor, not the plan: affiliate + brand deals on the same views pay 5-20x this. treat fund money as coffee money',true)}
function fund(){
 log('FUND CHECK - Creator Rewards Program eligibility, check each box:',true);
 log('FUND CHECK - 1) 10,000+ followers. 2) 100,000+ valid views in the last 30 days. 3) 18+. 4) account 30+ days old',true);
 log('FUND CHECK - video rules: 1+ minute long, original, high quality. a 26s edit does NOT count - build a 60s+ extended cut for monetized posts',true);
 log('FUND CHECK - valid views are watched-5s+ from the For You feed, skips and own-profile views do not count',true);
 log('FUND CHECK - apply in profile > menu > Creator tools > Rewards. denied once? fix the listed reason, reapply in 30 days',true)}
function gifts(){
 log('GIFT STRATEGY - LIVE gifts plan for this channel:',true);
 log('GIFT STRATEGY - go live right after posting an edit that is landing: the For You push imports viewers for ~2h, that is the gifting window',true);
 log('GIFT STRATEGY - live format that earns: edit requests. viewers gift to pick the next clip or transition, the stream IS the work session',true);
 log('GIFT STRATEGY - name the target on screen (goal bar), thank gifts by name, save the top 3 gifters, they return',true);
 log('GIFT STRATEGY - gifts split roughly 50% to you after the platform cut; $200 in gifts is ~$100. worth 2 sessions a week, not a career plan alone',true)}
function affiliate(){
 log('AFFILIATE SETUP - TikTok Shop affiliate, step order matters:',true);
 log('AFFILIATE SETUP - 1) creator account in good standing, 5,000+ followers for open affiliate. 2) profile > Creator tools > TikTok Shop for Creators',true);
 log('AFFILIATE SETUP - 3) pick products that fit the edit genre so links feel native - '+ 'a '+ (G=G||genre()) +' channel links gear the audience already asks about in comments',true);
 log('AFFILIATE SETUP - 4) commission bands: 5-10% is normal, accept nothing under 5%. 5) disclose in-video and in-caption, undisclosed = strike risk',true);
 log('AFFILIATE SETUP - put the link only where the video points at it: description + pinned comment, never a comment dump',true)}
function pitch(){if(!needClips()){return}G=G||genre();var rt=runtime();
 log('BRAND PITCH - one-paragraph pitch template for a '+G+' channel, fill brackets and send:',true);
 log('BRAND PITCH - "I make '+G+' edits, '+r1(rt)+'s average cut, [X]k followers, [Y]% avg watch time. I can build a [Z]-second branded cut in your style by [date]. rate below." - short pitches get replies, decks get archived',true);
 log('BRAND PITCH - attach: 3 best cuts (this project is one), audience screenshot, 2 past collabs or "first brand slot available"',true);
 log('BRAND PITCH - pitch the format, not the follower count: editors get hired for the look, the look is in the reel',true)}
function ratecard(){
 log('RATE CARD - starting rates, per single TikTok video, deliver 2 revisions:',true);
 log('RATE CARD - under 10k followers: $75-150 | 10-50k: $150-400 | 50-250k: $400-1,000 | 250k+: $1,000-2,500+',true);
 log('RATE CARD - add-ons: +50% for usage rights 30 days, +100% for paid ads whitelisting, bundle 3 videos -10%',true);
 log('RATE CARD - rule: never quote live in a DM. "my rate for that scope is $X, sent the card" - the card does the negotiating',true);
 log('RATE CARD - raise rates 20% every 10 booked jobs until replies drop off, then step back one tier',true)}
function series(){if(!needClips()){return}var rt=runtime();
 log('SERIES PRICING - paid series (TikTok Series feature) plan:',true);
 log('SERIES PRICING - package: 3-5 extended cuts, 60-180s each, sold as one series, $5-15 price band. a '+r1(rt)+'s cut is the trailer, not the product',true);
 log('SERIES PRICING - free tier drives it: part 1 free, parts 2-4 paid, cliffhanger cut at the seam',true);
 log('SERIES PRICING - price anchor: 1 series = 2-4 brand deals worth of income, evergreen after launch week',true)}
function linker(){if(!needClips()){return}var cs=clips(),rt=runtime();
 log('PRODUCT LINKER - where a link lives inside a '+r1(rt)+'s edit:',true);
 log('PRODUCT LINKER - timestamp '+r1(Math.min(3,rt*0.15))+'s: product appears in-frame naturally (no insert shot)',true);
 log('PRODUCT LINKER - timestamp '+r1(rt*0.5)+'s: the use moment, product doing the thing the video is about',true);
 log('PRODUCT LINKER - last '+r1(Math.min(2,rt*0.1))+'s: one-line overlay + caption link. overlay text does the selling, link does the click',true);
 log('PRODUCT LINKER - linked clip must stand alone for buyers: post the exact segment as its own 15s cut, bio link to it',true)}
function tracker(){
 log('SPONSOR TRACKER - fields to keep on every deal, one row each:',true);
 log('SPONSOR TRACKER - brand, contact, date pitched, rate asked, rate agreed, deliverables, due date, payment due, payment received, usage terms',true);
 log('SPONSOR TRACKER - cadence: pitch 5 brands a week, follow up once after 5 business days, archive after one no-response follow-up',true);
 log('SPONSOR TRACKER - payment rule: 50% upfront on any deal over $300, deliver on payment not on promise. no contract? your email chain IS the contract, keep it',true);
 log('SPONSOR TRACKER - red flags: pays in exposure, wants 90-day net, asks for free spec work "as a test" - decline and log it',true)}
function sheet(){var L=[];var rt=runtime();G=G||genre();var r=RPM[G]||RPM['general'];
 L.push('MONEY SHEET - '+new Date().toLocaleString());
 L.push('GENRE: '+G+' | runtime: '+r1(rt)+'s');
 L.push('FUND MATH per 1k views: $'+r1(r.low)+'-'+r1(r.high)+' ('+r.note+')');
 L.push('10k views: $'+r1(10*r.low)+'-'+r1(10*r.high)+' | 100k: $'+r1(100*r.low)+'-'+r1(100*r.high)+' | 1M: $'+r1(1000*r.low)+'-'+r1(1000*r.high));
 L.push('RATE CARD: <10k $75-150 | 10-50k $150-400 | 50-250k $400-1k | 250k+ $1k-2.5k (+50% 30d usage, +100% ads whitelisting)');
 L.push('SERIES: 3-5 extended cuts 60-180s, $5-15, part 1 free');
 L.push('GIFTS: live after a landing post, ~50% net, 2 sessions/week');
 L.push('AFFILIATE: min 5% commission, disclose always, link in caption + pinned comment only');
 L.push('SPONSOR RULES: 50% upfront over $300, 1 follow-up after 5 days, no exposure deals');
 L.push('MIX: none. monetization lab is read-only, project untouched');
 dl('money-sheet.txt',L.join('\n'))}
function mount(){
 if(document.getElementById('f52b1')){return}
 var card=document.createElement('div');card.className='card';card.id='f52card';
 var h=document.createElement('h2');h.textContent='MONETIZATION LAB';card.appendChild(h);
 var r1r=mkRow();r1r.appendChild(mkBtn('EARNINGS ESTIMATOR',money,'f52b1'));r1r.appendChild(mkBtn('FUND CHECK',fund,'f52b2'));card.appendChild(r1r);
 var r2=mkRow();r2.appendChild(mkBtn('GIFT STRATEGY',gifts,'f52b3'));r2.appendChild(mkBtn('AFFILIATE SETUP',affiliate,'f52b4'));card.appendChild(r2);
 var r3=mkRow();r3.appendChild(mkBtn('BRAND PITCH',pitch,'f52b5'));r3.appendChild(mkBtn('RATE CARD',ratecard,'f52b6'));card.appendChild(r3);
 var r4=mkRow();r4.appendChild(mkBtn('SERIES PRICING',series,'f52b7'));r4.appendChild(mkBtn('PRODUCT LINKER',linker,'f52b8'));card.appendChild(r4);
 var r5=mkRow();r5.appendChild(mkBtn('SPONSOR TRACKER',tracker,'f52b9'));r5.appendChild(mkBtn('MONEY SHEET .TXT',sheet,'f52b10'));card.appendChild(r5);
 var note=document.createElement('div');note.className='note';note.id='f52note';note.textContent='monetization lab covers the get-paid side: earnings estimator, fund check, gift strategy, affiliate setup, brand pitch, rate card, series pricing, product linker, sponsor tracker and a downloadable money sheet.';
 card.appendChild(note);
 var hs=document.querySelectorAll('.card h2'),anchor=null;
 for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('AUDIENCE LAB')>=0){anchor=hs[i].parentElement;break}}
 if(anchor){if(anchor.nextSibling){anchor.parentElement.insertBefore(card,anchor.nextSibling)}else{anchor.parentElement.appendChild(card)}}
 else{var ap=document.querySelector('#panelcol')||document.body;ap.appendChild(card)}
 log('monetization lab live - earnings estimator, fund check, gift strategy, affiliate setup, brand pitch, rate card, series pricing, product linker, sponsor tracker, money sheet');
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',mount)}else{mount()}
})();
