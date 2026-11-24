'use strict';
// up53.js - PHASE 47 ANALYTICS LAB (Nov 24 2026)
// metrics tracker, benchmark board, retention map, hook analysis, post forensics,
// trend radar, competitor log, growth projection, content score, analytics sheet
(function(){
if(window.__tk2up53){return}window.__tk2up53=1;
function mkBtn(t,fn,id){var b=document.createElement('button');b.className='btn';b.textContent=t;if(id){b.id=id}b.onclick=fn;return b}
function mkRow(){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap='6px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function S(){try{return window.S||window.state||window.APPSTATE||{}}catch(e){return {}}}
function clipDur(c){var st=parseFloat(c.start),en=parseFloat(c.end);if(!isFinite(st)||!isFinite(en)){return 0}return Math.max(0,(en-st))/(c.speed||1)}
function clips(){var s=S();var a=(s&&s.clips)||[];var out=[],t=0;for(var i=0;i<a.length;i++){var d=clipDur(a[i]);if(d>0.05){t+=d;out.push({c:a[i],d:d,t0:t})}}for(var j=0;j<out.length;j++){out[j].t0-=out[j].d}return out}
function runtime(){var cs=clips();if(!cs.length){return 0}return cs[cs.length-1].t0+cs[cs.length-1].d}
function needClips(){if(!clips().length){log('analytics lab: add clips to the timeline first');return false}return true}
function r1(n){return Math.round(n*10)/10}
function genre(){var s=S();var st=(s.style||s.editStyle||'').toString().toLowerCase();var txt=st+' '+JSON.stringify(s.clips||[]).toLowerCase();
 if(txt.indexOf('phonk')>=0){return 'phonk'}if(txt.indexOf('sport')>=0||txt.indexOf('basketball')>=0||txt.indexOf('gym')>=0){return 'sport'}
 if(txt.indexOf('anime')>=0){return 'anime'}if(txt.indexOf('blend')>=0){return 'blend'}return st||'general'}
function dl(name,text){try{var b=new Blob([text],{type:'text/plain'});var u=URL.createObjectURL(b);var a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},800);log('download started - '+name,true)}catch(e){log('download blocked, '+e.message)}}
function lsGet(k){try{return JSON.parse(localStorage.getItem(k)||'[]')}catch(e){return []}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){log('storage full, could not save log')}}
var G;
var PACE={'phonk':{lo:1.8,hi:2.5},'sport':{lo:2.0,hi:2.6},'anime':{lo:1.2,hi:1.8},'blend':{lo:1.0,hi:1.6},'general':{lo:1.0,hi:2.0}};
var SIGN={'phonk':'rewatches are the phonk signal: 20%+ rewatch rate beats a like streak','sport':'shares are the sport signal: share rate above like rate reads as healthy to the algorithm','anime':'saves are the anime signal: clip channels live or die on save rate, 2%+ is strong','blend':'comments are the blend signal: originality sparks replies, answer the first 20 fast','general':'balance the board: no single metric carrying, all five above floor'};

function metrics(){var L=lsGet('tk2metrics');var d=new Date();
 log('METRICS TRACKER - log these 5 numbers within 1 hour of posting: views, likes, comments, saves, shares',true);
 log('METRICS TRACKER - healthy floor for a fresh clip channel: saves >= 1% of views, shares >= 0.5%',true);
 log('METRICS TRACKER - if 1-hour views < your follower count the push window died; fix the post window, not the hashtags',true);
 L.unshift('posted '+d.toISOString().slice(0,10)+' '+(''+d.getHours()).padStart(2,'0')+':00 - fill: views __ likes __ comments __ saves __ shares');
 L=L.slice(0,12);lsSet('tk2metrics',L);
 log('METRICS TRACKER - entry saved ('+L.length+' logged). fill it after the post, BENCHMARK BOARD grades the numbers',true)}

function bench(){var g=genre()||'general';var p=PACE[g]||PACE['general'];
 log('BENCHMARK BOARD - hook held 3s: 65%+ | completion under 20s edit: 60%+ | avg watch time: 8s+',true);
 log('BENCHMARK BOARD - save rate 1.5%+ and share rate 0.5%+ is push territory',true);
 log('BENCHMARK BOARD - '+g+' note: '+SIGN[g],true);
 log('BENCHMARK BOARD - cuts/s target for '+g+': '+p.lo+'-'+p.hi+' (yours: '+r1(cs())+')',true);
 log('BENCHMARK BOARD - grade each post: any metric under target = the next edit has one job, fix that metric',true)}
function cs(){var cs2=clips();var rt=runtime();if(!cs2.length||!rt){return 0}return cs2.length/rt}

function retmap(){if(!needClips()){return}var cs2=clips();G=genre();var rt=runtime();
 log('RETENTION MAP - zone 1 (0-3s) is the kill zone: highest drop risk, hook must land here',true);
 var dips=[];for(var i=0;i<cs2.length;i++){if(cs2[i].d>2.2){dips.push(r1(cs2[i].t0)+'s')} }
 log('RETENTION MAP - flat zones (clip > 2.2s, no cut to reset attention): '+(dips.length?dips.join(', '):'none detected'),true);
 log('RETENTION MAP - expected dip windows: '+(rt>30?'past 30s viewers bail without a payoff beat at ~50% mark':'under 30s total, one dip window only, mid-point'),true);
 log('RETENTION MAP - the two cheapest fixes: cut 0.5-1s of dead air at the dip, or add a zoom punch + sound tick exactly at the dip',true);
 log('RETENTION MAP - verdict: '+(dips.length?dips.length+' flat zone(s) to tighten':'timeline is tight, retention risk sits in the hook only'),true)}

function hook(){if(!needClips()){return}var cs2=clips();var first=cs2[0];var s=S();var caps=(s.captions||[]);
 log('HOOK ANALYSIS - first clip '+r1(first.d)+'s: '+(first.d<=1.5?'good, inside the 1.5s rule':(first.d<=2.5?'borderline, trim toward 1.5s':'slow start, over the 2.5s cap - viewers swipe')),true);
 var capEarly=caps.some(function(c){var st=parseFloat(c.start!==undefined?c.start:c.t);return isFinite(st)&&st<=2});
 log('HOOK ANALYSIS - caption in first 2s: '+(capEarly?'yes':'NO - late captions are the #1 silent hook killer'));
 var still=first.d>2.5&&!(first.c.fx||first.c.zoom||first.c.effect);
 log('HOOK ANALYSIS - static open (no motion in first 2s): '+(still?'FAILS - add motion or a cut inside the first second':'passes'));
 log('HOOK ANALYSIS - audio check: '+(s.musicId?'music attached, make sure the first beat hits inside 1s':'no music set - a silent open reads as unfinished'));
 log('HOOK ANALYSIS - the 3 failure patterns to recheck on every edit: slow start, late caption, static open',true)}

function forensics(){
 log('POST FORENSICS - symptom: under 200 views in 24h -> usual cause: dead post window or zero saves; fix: repost peak window (7-10pm for '+ (genre()||'general') +'), not more hashtags',true);
 log('POST FORENSICS - symptom: views ok, likes weak -> cause: content consumed but not felt; fix: tighten to one emotional beat per edit',true);
 log('POST FORENSICS - symptom: big drop after 3s -> cause: hook promised something the edit did not deliver; fix: align first cut with the caption promise',true);
 log('POST FORENSICS - symptom: completion high, followers flat -> cause: no identity; fix: same intro framing + series naming so the algorithm learns who to show you to',true);
 log('POST FORENSICS - symptom: one post spiked then nothing -> cause: you posted once off-trend; fix: batch 3 edits in that winning format within 72h',true)}

function trend(){var g=genre()||'general';
 log('TREND RADAR - save a sound the moment you see under 5k uses; that is the entry window',true);
 log('TREND RADAR - ride a takeoff within 48h; after day 3 you are competing with the flood',true);
 log('TREND RADAR - '+g+' posting window: 7-10pm local, worst window is 2-5am; cadence 1 post/day minimum, 2 on the weekend',true);
 log('TREND RADAR - never join a sound trend without a genre twist: the trend carries reach, the twist carries follows',true);
 log('TREND RADAR - weekly check: if 3 straight posts miss benchmarks, the sound bank is stale, refresh it',true)}

function comp(){var L=lsGet('tk2complog');
 var h=(typeof prompt==='function')?prompt('competitor handle (@name) + one note, comma separated',''):null;
 if(h&&h.trim()){L.unshift(h.trim());L=L.slice(0,10);lsSet('tk2complog',L)}
 if(!L.length){log('COMPETITOR LOG - add 5 competitors in your exact genre. track for each: followers, top 3 videos, posting cadence',true);return}
 log('COMPETITOR LOG - '+L.length+' tracked:',true);
 for(var i=0;i<Math.min(5,L.length);i++){log('COMPETITOR LOG - '+L[i])}
 log('COMPETITOR LOG - per competitor, update weekly: their top video this week, post count, any format they repeated twice',true)}

function growth(){var L=lsGet('tk2metrics');var base=1000;var g=genre()||'general';
 log('GROWTH PROJECTION - baseline 1,000 followers, 3 posts/week (you have '+L.length+' posts logged):',true);
 var w=function(rate){var v=base*Math.pow(1+rate,4),v2=base*Math.pow(1+rate,8),v3=base*Math.pow(1+rate,12);return Math.round(v)+' / '+Math.round(v2)+' / '+Math.round(v3)};
 log('GROWTH PROJECTION - at 5%/week (floor pace): 4/8/12wk: '+w(0.05),true);
 log('GROWTH PROJECTION - at 10%/week (benchmarks hit): 4/8/12wk: '+w(0.10),true);
 log('GROWTH PROJECTION - at 20%/week (a format catches): 4/8/12wk: '+w(0.20),true);
 log('GROWTH PROJECTION - '+g+' reality check: clip channels stall at floor pace until a format repeats; projection only moves when cadence holds 3+/week',true)}

function score(){if(!needClips()){return}var cs2=clips();var rt=runtime();G=genre();var p=PACE[G]||PACE['general'];
 var pts=0;var br=[];
 var f=cs2[0].d;var hp=f<=1.5?25:(f<=2.5?15:5);pts+=hp;br.push('hook '+hp+'/25 (first clip '+r1(f)+'s)');
 var c=cs();var cp=(c>=p.lo&&c<=p.hi)?20:(c>=p.lo*0.7&&c<=p.hi*1.3?12:5);pts+=cp;br.push('pacing '+cp+'/20 ('+r1(c)+' cuts/s vs '+p.lo+'-'+p.hi+')');
 var s=S();var caps=(s.captions||[]);var capEarly=caps.some(function(x){var st=parseFloat(x.start!==undefined?x.start:x.t);return isFinite(st)&&st<=3});pts+=capEarly?15:5;br.push('caption '+(capEarly?15:5)+'/15');
 var lp=(rt>=8&&rt<=21)?20:(rt<8?10:12);pts+=lp;br.push('length '+lp+'/20 ('+r1(rt)+'s, sweet spot 8-21s)');
 var fxN=0;for(var i=0;i<cs2.length;i++){if(cs2[i].c&&(cs2[i].c.fx||cs2[i].c.zoom||cs2[i].c.effect)){fxN++}}
 var md=fxN/cs2.length>=0.5?10:5;pts+=md;br.push('motion '+md+'/10');
 var au=s.musicId?10:3;pts+=au;br.push('audio '+au+'/10');
 var verdict=pts<70?'re-edit before posting':(pts<85?'polish pass then post':'post it, this edit is ready');
 log('CONTENT SCORE - '+pts+'/100: '+verdict,true);
 for(var j=0;j<br.length;j++){log('CONTENT SCORE - '+br[j])}}

function sheet(){var L=['ANALYTICS SHEET - '+new Date().toLocaleString()];
 L.push('GENRE: '+(genre()||'general')+' | runtime: '+r1(runtime())+'s | cuts/s: '+r1(cs()));
 L.push('CONTENT SCORE last run: (run CONTENT SCORE for live numbers)');
 L.push('BENCHMARKS: hook 3s 65%+ | completion 60%+ | avg watch 8s+ | saves 1.5%+ | shares 0.5%+');
 var m=lsGet('tk2metrics');L.push('METRICS LOG ('+m.length+'):');for(var i=0;i<Math.min(5,m.length);i++){L.push('  '+m[i])}
 var cp=lsGet('tk2complog');L.push('COMPETITORS ('+cp.length+'):');for(var j=0;j<Math.min(5,cp.length);j++){L.push('  '+cp[j])}
 L.push('POST WINDOW: 7-10pm local, 1 post/day min | RIDE TREND SOUNDS within 48h of takeoff');
 L.push('PROJECTION (from 1k): 5%/wk 4wk '+Math.round(1000*1.2155)+' | 10%/wk 4wk '+Math.round(1000*1.4641)+' | 20%/wk 4wk '+Math.round(1000*2.0736));
 L.push('MIX: none. analytics lab is read-only, project untouched');
 dl('analytics-sheet.txt',L.join('\n'))}

function mount(){
 if(document.getElementById('f53b1')){return}
 var card=document.createElement('div');card.className='card';card.id='f53card';
 var h=document.createElement('h2');h.textContent='ANALYTICS LAB';card.appendChild(h);
 var r1r=mkRow();r1r.appendChild(mkBtn('METRICS TRACKER',metrics,'f53b1'));r1r.appendChild(mkBtn('BENCHMARK BOARD',bench,'f53b2'));card.appendChild(r1r);
 var r2=mkRow();r2.appendChild(mkBtn('RETENTION MAP',retmap,'f53b3'));r2.appendChild(mkBtn('HOOK ANALYSIS',hook,'f53b4'));card.appendChild(r2);
 var r3=mkRow();r3.appendChild(mkBtn('POST FORENSICS',forensics,'f53b5'));r3.appendChild(mkBtn('TREND RADAR',trend,'f53b6'));card.appendChild(r3);
 var r4=mkRow();r4.appendChild(mkBtn('COMPETITOR LOG',comp,'f53b7'));r4.appendChild(mkBtn('GROWTH PROJECTION',growth,'f53b8'));card.appendChild(r4);
 var r5=mkRow();r5.appendChild(mkBtn('CONTENT SCORE',score,'f53b9'));r5.appendChild(mkBtn('ANALYTICS SHEET .TXT',sheet,'f53b10'));card.appendChild(r5);
 var note=document.createElement('div');note.className='note';note.id='f53note';note.textContent='analytics lab is the measure side: metrics tracker, benchmark board, retention map, hook analysis, post forensics, trend radar, competitor log, growth projection, content score and a downloadable analytics sheet.';
 card.appendChild(note);
 var hs=document.querySelectorAll('.card h2'),anchor=null;
 for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('MONETIZATION LAB')>=0){anchor=hs[i].parentElement;break}}
 if(anchor){if(anchor.nextSibling){anchor.parentElement.insertBefore(card,anchor.nextSibling)}else{anchor.parentElement.appendChild(card)}}
 else{var ap=document.querySelector('#panelcol')||document.body;ap.appendChild(card)}
 log('analytics lab live - metrics tracker, benchmark board, retention map, hook analysis, post forensics, trend radar, competitor log, growth projection, content score, analytics sheet');
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',mount)}else{mount()}
})();
