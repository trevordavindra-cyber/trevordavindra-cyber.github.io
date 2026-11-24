'use strict';
// up49.js - PHASE 43 PUBLISH LAB (Nov 24 2026)
// safe zones, upload checklist, post calendar, title templates,
// description kit, cover guide, platform variants, batch planner,
// watermark check, publish sheet
(function(){
if(window.__tk2up49){return}window.__tk2up49=1;
function mkBtn(t,fn,id){var b=document.createElement('button');b.className='btn';b.textContent=t;if(id){b.id=id}b.onclick=fn;return b}
function mkRow(){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap='6px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function S(){try{return window.S||window.state||window.APPSTATE||{}}catch(e){return {}}}
function clipDur(c){var st=parseFloat(c.start),en=parseFloat(c.end);if(!isFinite(st)||!isFinite(en)){return 0}return Math.max(0,(en-st))/(c.speed||1)}
function clips(){var s=S();var a=(s&&s.clips)||[];var out=[],t=0;for(var i=0;i<a.length;i++){var d=clipDur(a[i]);if(d>0.05){t+=d;out.push({c:a[i],d:d,t0:t})}}for(var j=0;j<out.length;j++){out[j].t0-=out[j].d}return out}
function runtime(){var cs=clips();if(!cs.length){return 0}return cs[cs.length-1].t0+cs[cs.length-1].d}
function needClips(){if(!clips().length){log('publish lab: add clips to the timeline first');return false}return true}
function saveE(){try{if(typeof save==='function'){save()}}catch(e){}}
function r1(n){return Math.round(n*10)/10}
function dl(name,text){try{var b=new Blob([text],{type:'text/plain'});var u=URL.createObjectURL(b);var a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},800);log('download started - '+name,true)}catch(e){log('download blocked, '+e.message)}}
function zones(){if(!needClips()){return}
 log('SAFE ZONES - this '+r1(runtime())+'s edit ships 9:16 (1080x1920): keep faces and captions inside the center 1080x1420 band',true);
 log('SAFE ZONES - right rail eats ~130px (share/like/comment icons), bottom ~420px is caption zone, top ~180px is search/status: test every text layer against all three',true);
 log('SAFE ZONES - your aspect='+r1((S().w||1080)/(S().h||1920))+' target 0.5625; crop, never letterbox, black bars kill the fullscreen rate',true)}
function check(){if(!needClips()){return}
 var n=clips().length,rt=runtime();
 log('UPLOAD CHECKLIST - '+n+' clips '+r1(rt)+'s: watch it once end-to-end on the phone before upload, the edit looks different at 6.1 inches',true);
 log('UPLOAD CHECKLIST - loudness within 3dB of reference, first frame readable as a still, no frame 0 black',true);
 log('UPLOAD CHECKLIST - save a draft, watch the draft, then post: drafts render with the final encode, the preview does not',true)}
function cal(){if(!needClips()){return}
 log('POST CALENDAR - cadence 1-2 posts a day beats 5 in one burst: spaced posts keep each one in its own push window',true);
 log('POST CALENDAR - lock 3 slots a week and batch-build: Tue 6-9pm, Thu 6-9pm, Sat 9-11am',true);
 log('POST CALENDAR - plan the NEXT 7 posts today with their captions written; upload-day decisions are where consistency dies',true)}
function title(){if(!needClips()){return}
 log('TITLE TEMPLATES - tiktok caption: hook line + 1 context line + 2-3 tags, under 90 visible characters',true);
 log('TITLE TEMPLATES - shorts: title carries the search keyword in the first 40 characters, that is what ranks',true);
 log('TITLE TEMPLATES - reels: keep the hook in the on-screen text, not the caption; reels captions are secondary',true)}
function desc(){if(!needClips()){return}
 log('DESCRIPTION KIT - 3 lines max: what it is, why it is different, the question that pulls comments',true);
 log('DESCRIPTION KIT - put the searchable keyword in line 1 word-for-word: the algorithm indexes the first line',true);
 log('DESCRIPTION KIT - one link rule: link in bio only; links inside the description suppress distribution',true)}
function cover(){if(!needClips()){return}
 log('COVER GUIDE - pick the cover from the 40-60% mark of the edit, not the first frame: mid beats read as payoff frames',true);
 log('COVER GUIDE - add 3-5 word on-cover text, top-left quadrant, high contrast: profile-grid visitors decide from cover text alone',true);
 log('COVER GUIDE - keep covers visually consistent across a series: same crop, same text position, the grid reads as one show',true)}
function variants(){if(!needClips()){return}
 var rt=runtime();
 log('PLATFORM VARIANTS - ship 3 cuts of this '+r1(rt)+'s edit: tiktok as-is, reels cropped to center-safe, shorts trimmed to 58s or under',true);
 log('PLATFORM VARIANTS - never cross-post with the tiktok watermark on: both reels and shorts suppress watermarked uploads',true);
 log('PLATFORM VARIANTS - export each platform separately at its own bitrate: one shared encode looks soft on at least one platform',true)}
function batch(){if(!needClips()){return}
 log('BATCH PLANNER - split the week: one build day (cut 3-5 edits), one post day (schedule all), zero same-day deciding',true);
 log('BATCH PLANNER - reuse one hook template and one outro across the batch, vary only the middle: consistency reads as a brand',true);
 log('BATCH PLANNER - keep a content bank of 10 ideas minimum; refill it during the post-day downtime, never mid-build',true)}
function wm(){if(!needClips()){return}
 log('WATERMARK CHECK - scan every frame edge: leftover capcut/watermark strips in corners tank the push on reels and shorts',true);
 log('WATERMARK CHECK - your own mark goes top-right inside the safe band, small and still: motion marks read as someone elses watermark',true);
 log('WATERMARK CHECK - zoom 200% on frame 1 and the last frame before upload: watermarks hide in the first and final 2s',true)}
function sheet(){if(!needClips()){return}
 var n=clips().length,rt=runtime();
 var L=[];
 L.push('PUBLISH SHEET - generated '+new Date().toLocaleString());
 L.push('project: '+n+' clips, '+r1(rt)+'s runtime');
 L.push('');
 L.push('SAFE ZONES: 9:16 1080x1920, text inside center 1080x1420, right rail ~130px, bottom ~420px, top ~180px');
 L.push('UPLOAD CHECKLIST: phone watch-through, loudness -3dB window, draft test, then post');
 L.push('POST CALENDAR: 1-2/day, slots Tue 6-9pm, Thu 6-9pm, Sat 9-11am, captions pre-written');
 L.push('TITLES: tiktok hook+context+2-3 tags <90 chars, shorts keyword first 40, reels hook on-screen');
 L.push('DESCRIPTION: 3 lines, keyword line 1, link in bio only');
 L.push('COVER: frame from 40-60% mark, 3-5 word top-left text, consistent across series');
 L.push('PLATFORM VARIANTS: tiktok as-is, reels center-crop, shorts <=58s, no watermarks ever');
 L.push('BATCH: 1 build day + 1 post day, 10-idea content bank minimum');
 L.push('WATERMARK: check frame 1 and last frame at 200% zoom');
 L.push('MIX: none. This is a publish pass, audio untouched');
 dl('publish-sheet.txt',L.join('\n'))}
function mount(){
 if(document.getElementById('f49b1')){return}
 var card=document.createElement('div');card.className='card';card.id='f49card';
 var h=document.createElement('h2');h.textContent='PUBLISH LAB';card.appendChild(h);
 var r1r=mkRow();r1r.appendChild(mkBtn('SAFE ZONES',zones,'f49b1'));r1r.appendChild(mkBtn('UPLOAD CHECKLIST',check,'f49b2'));card.appendChild(r1r);
 var r2=mkRow();r2.appendChild(mkBtn('POST CALENDAR',cal,'f49b3'));r2.appendChild(mkBtn('TITLE TEMPLATES',title,'f49b4'));card.appendChild(r2);
 var r3=mkRow();r3.appendChild(mkBtn('DESCRIPTION KIT',desc,'f49b5'));r3.appendChild(mkBtn('COVER GUIDE',cover,'f49b6'));card.appendChild(r3);
 var r4=mkRow();r4.appendChild(mkBtn('PLATFORM VARIANTS',variants,'f49b7'));r4.appendChild(mkBtn('BATCH PLANNER',batch,'f49b8'));card.appendChild(r4);
 var r5=mkRow();r5.appendChild(mkBtn('WATERMARK CHECK',wm,'f49b9'));r5.appendChild(mkBtn('PUBLISH SHEET .TXT',sheet,'f49b10'));card.appendChild(r5);
 var note=document.createElement('div');note.className='note';note.id='f49note';note.textContent='publish lab covers the shipping side: safe zones, upload checklist, post calendar, title templates, description kit, cover guide, platform variants, batch planner, watermark check and a downloadable publish sheet.';
 card.appendChild(note);
 var hs=document.querySelectorAll('.card h2'),anchor=null;
 for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('ENGAGEMENT LAB')>=0){anchor=hs[i].parentElement;break}}
 if(anchor){if(anchor.nextSibling){anchor.parentElement.insertBefore(card,anchor.nextSibling)}else{anchor.parentElement.appendChild(card)}}
 else{var ap=document.querySelector('#panelcol')||document.body;ap.appendChild(card)}
 log('publish lab live - safe zones, upload checklist, post calendar, title templates, description kit, cover guide, platform variants, batch planner, watermark check, publish sheet');
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',mount)}else{mount()}
})();
