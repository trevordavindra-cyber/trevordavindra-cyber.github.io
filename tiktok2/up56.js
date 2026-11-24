// up56.js - PHASE 50 RETENTION LAB (Nov 24 2026)
// hook variants, loop design, pacing ramp, drop-off fixes, rewatch triggers,
// first 3 seconds, retention map, sound sync, retention fixes, retention sheet
'use strict';
(function(){
if(window.__tk2up56){return}window.__tk2up56=1;

function mkBtn(t,fn,id){var b=document.createElement('button');b.className='btn';b.textContent=t;if(id){b.id=id}b.onclick=fn;return b}
function mkRow(){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap='6px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function S(){try{return window.S||window.state||window.APPSTATE||{}}catch(e){return {}}}
function r1(n){return Math.round(n*10)/10}
function genre(){var s=S();var st=(s.style||s.editStyle||'').toString().toLowerCase();var txt=st+' '+JSON.stringify(s.clips||[]).toLowerCase(); if(txt.indexOf('phonk')>=0){return 'phonk'}if(txt.indexOf('sport')>=0||txt.indexOf('basketball')>=0||txt.indexOf('gym')>=0){return 'sport'} if(txt.indexOf('anime')>=0){return 'anime'}if(txt.indexOf('blend')>=0){return 'blend'}return st||'general'}
function clipDur(c){var st=parseFloat(c.start),en=parseFloat(c.end);if(!isFinite(st)||!isFinite(en)){return 0}return Math.max(0,(en-st))/(c.speed||1)}
function clips(){var s=S();var a=(s&&s.clips)||[];var out=[],t=0;for(var i=0;i<a.length;i++){var d=clipDur(a[i]);if(d>0.05){t+=d;out.push({c:a[i],d:d,t0:t})}}for(var j=0;j<out.length;j++){out[j].t0-=out[j].d}return out}
function runtime(){var cs=clips();if(!cs.length){return 0}return cs[cs.length-1].t0+cs[cs.length-1].d}
function needClips(){if(!clips().length){log('retention lab: add clips to the timeline first');return false}return true}

// ---- 1 HOOK VARIANTS ----
function rhooks(){
 if(!needClips()){return}
 var g=genre(),r=runtime();
 log('HOOK VARIANTS - '+clips().length+' clips, '+r1(r)+'s, genre '+g,true);
 log('variant A (motion hook): open on the single fastest-moving frame in clip 1, no lead-in');
 log('variant B (text hook): first frame carries a 3-word promise, numbers beat adjectives');
 log('variant C (sound hook): start mid-drop with 0.3s of the loudest beat, then rewind structure');
 log('pick ONE variant per post and A/B it against your last upload; keep the winner for 5 posts',true);
}

// ---- 2 LOOP DESIGN ----
function rloop(){
 if(!needClips()){return}
 var c=clips(),last=c[c.length-1];
 log('LOOP DESIGN - last clip ends at '+r1(last.t0+last.d)+'s',true);
 log('rule: the last 0.5s must visually flow into frame 1 - same speed, same direction, no hard stop');
 log('cut the final clip so motion is mid-swing at the end; a landing pose reads as an ending and kills the loop');
 log('never leave a black frame or fade at the seam - it tells the viewer the video ended');
 log('audio seam matters as much as video: end and start on the same beat, not mid-note');
 log('test: watch the loop point 3 times; if you notice the seam, the viewer will too',true);
}

// ---- 3 PACING RAMP ----
function rpacing(){
 if(!needClips()){return}
 var c=clips();
 log('PACING RAMP - '+c.length+' clips, '+r1(runtime())+'s total',true);
 for(var i=0;i<c.length;i++){
  var sug=i===0?'1.0 (establish, do not rush the opener)':(i===c.length-1?'0.9 (slow the landing so the loop seam reads)':(1.1+0.1*(i%3)).toFixed(1)+' (ramp up through the middle)');
  log('clip '+(i+1)+' ('+r1(c[i].d)+'s @ '+r1(c[i].c.speed||1)+'x now) -> suggest '+sug);
 }
 log('rule: speed changes must land on beats; a ramp mid-phrase feels like an error',true);
}

// ---- 4 DROP-OFF FIXES ----
function rdrop(){
 if(!needClips()){return}
 var r=runtime();
 log('DROP-OFF FIXES - project is '+r1(r)+'s',true);
 log('0-1s drop: static or dark first frame -> open on peak motion, brightest frame first');
 log('1-2s drop: slow setup -> cut the establishing shots, start mid-action');
 log('3-5s drop: same rhythm too long -> insert a transition or speed change by 4s');
 log('mid drop (60-70% mark): predictable middle -> add one escalation: zoom punch, caption, or angle swap');
 log('end drop: readable ending -> cliffhang into the loop seam instead',true);
}

// ---- 5 REWATCH TRIGGERS ----
function rrewatch(){
    if(!needClips()){return}
    var w1='a hidden detail in the last clip';
    var w2='text that only makes sense on second watch';
    var w3='a sound echo at the end';
    var w4='a motion seam with no visible cut';
    log('REWATCH TRIGGERS: '+w1+' | '+w2+' | '+w3+' | '+w4,true);
}

// ---- 6 FIRST 3 SECONDS ----
function r3sec(){
 if(!needClips()){return}
 var c=clips(),g=genre();
 log('FIRST 3 SECONDS - genre '+g+', clip 1 is '+r1(c[0].d)+'s',true);
 log('0.0-0.5s: peak-motion frame + the hook element (text or sound spike) both present');
 log('0.5-1.2s: first cut lands on the beat - one cut minimum inside the first second');
 log('1.2-2.0s: promise made: the viewer knows what the payoff will be');
 log('2.0-3.0s: escalation #1 - speed, zoom, or transition change, never a repeat of 0-2s rhythm',true);
 log('check: screenshot your 0.5s and 2s frames; both must be readable standalone in the feed grid');
}

// ---- 7 RETENTION MAP ----
function rmap(){
    if(!needClips()){return}
    var c=clips(),t='Clip\tStart\tDur\tHold %\n';
    for(var i=0;i<c.length;i++){
        t+=(i+1)+'\t'+r1(c[i].t0)+'\t'+r1(c[i].d)+'\t'+r1(100*(1-(c[i].t0/runtime())))+'\n';
    }
    log(t);
}

// ---- 8 SOUND SYNC ----
function rsync(){
    if(!needClips()){return}
    var s1='Align beats with clip changes.';
    var s2='Ramp volume up in the first 2 seconds.';
    var s3='Duck music under voiceovers.';
    log('retention lab: sound sync: '+s1+' '+s2+' '+s3);
}

// ---- 9 RETENTION FIXES ----
function rfix(){
 var s=S(),cs=clips(),g=genre(),fixes=[];
 if(!cs.length){log('retention fixes: add clips to the timeline first');return}
 if(r1(runtime())>15){fixes.push('runtime '+r1(runtime())+'s is long for an edit - cut to 9-13s, the loop rewatch is the multiplier')}
 if(!(s.captions||s.caps||s.captionLines||[]).length){fixes.push('no captions: add text on the first beat, captioned clips hold measurably longer')}
 if(!s.music&&!s.track&&!s.song){fixes.push('no music: load a track, cuts need beats to land on')}
 if(cs.length&&cs[0].d>2.5){fixes.push('clip 1 is '+r1(cs[0].d)+'s - openers over 2.5s bleed the first drop-off')}
 if(!fixes.length){fixes.push('structure is clean - focus this pass on the loop seam and the 3s opening')}
 log('RETENTION FIXES - top 3 for this project:',true);
 for(var i=0;i<Math.min(3,fixes.length);i++){log((i+1)+'. '+fixes[i],true)}
}

// ---- 10 RETENTION SHEET .TXT ----
function rsheet(){
 var g=genre(),d=new Date(),c=clips(),L=[];
 L.push('RETENTION SHEET - '+d.toLocaleString());
 L.push('GENRE: '+g+'   RUNTIME: '+(c.length?r1(runtime())+'s':'no clips yet'));
 L.push('');
 L.push('CLIP MAP (predicted hold):');
 for(var i=0;i<c.length;i++){
  L.push('clip '+(i+1)+'  start '+r1(c[i].t0)+'s  dur '+r1(c[i].d)+'s  hold ~'+r1(Math.max(20,100-8*i))+'%');
 }
 if(!c.length){L.push('(timeline empty - load clips and run this again)')}
 L.push('');
 L.push('OPENING PLAN: 0-0.5s peak motion + hook | cut by 1s | promise by 2s | escalation by 3s');
 L.push('LOOP SEAM: last 0.5s flows into frame 1, no black frame, audio ends on the beat it starts on');
 L.push('FIX LIST: runtime 9-13s | caption on first beat | every speed change on a beat | escalation at 60-70%');
 L.push('');
 L.push('A/B LOG: last post hook ______ vs this post hook ______ | winner: ______');
 dl('retention-sheet.txt',L.join('\n'));
}

function mount(){
    if(document.getElementById('f56b1')){return}
    var card=document.createElement('div');
    card.className='card';card.id='f56card';
    var h2=document.createElement('h2');
    h2.textContent='RETENTION LAB';
    card.appendChild(h2);
    var r1=mkRow();
    r1.appendChild(mkBtn('HOOK VARIANTS',rhooks,'f56b1'));
    r1.appendChild(mkBtn('LOOP DESIGN',rloop,'f56b2'));
    card.appendChild(r1);
    var r2=mkRow();
    r2.appendChild(mkBtn('PACING RAMP',rpacing,'f56b3'));
    r2.appendChild(mkBtn('DROP-OFF FIXES',rdrop,'f56b4'));
    card.appendChild(r2);
    var r3=mkRow();
    r3.appendChild(mkBtn('REWATCH TRIGGERS',rrewatch,'f56b5'));
    r3.appendChild(mkBtn('FIRST 3 SECONDS',r3sec,'f56b6'));
    card.appendChild(r3);
    var r4=mkRow();
    r4.appendChild(mkBtn('RETENTION MAP',rmap,'f56b7'));
    r4.appendChild(mkBtn('SOUND SYNC',rsync,'f56b8'));
    card.appendChild(r4);
    var r5=mkRow();
    r5.appendChild(mkBtn('RETENTION FIXES',rfix,'f56b9'));
    r5.appendChild(mkBtn('RETENTION SHEET .TXT',rsheet,'f56b10'));
    card.appendChild(r5);
    var note=document.createElement('div');
    note.className='note';note.id='f56note';note.textContent='retention lab is the watch-time side: hook variants, loop design, pacing ramp, drop-off fixes, rewatch triggers, first 3 seconds, retention map, sound sync, retention fixes and a downloadable retention sheet.';
    card.appendChild(note);
    var hs=document.querySelectorAll('.card h2'),anchor=null;
    for(var i=0;i<hs.length;i++){
        if(hs[i].textContent.indexOf('TRENDS LAB')>=0){
            anchor=hs[i].parentElement;
            break;
        }
    }
    if(anchor){
        if(anchor.nextSibling){
            anchor.parentElement.insertBefore(card,anchor.nextSibling);
        }else{
            anchor.parentElement.appendChild(card);
        }
    }else{
        var ap=document.querySelector('#panelcol')||document.body;
        ap.appendChild(card);
    }
 log('retention lab live - hook variants, loop design, pacing ramp, drop-off fixes, rewatch triggers, first 3 seconds, retention map, sound sync, retention fixes, retention sheet');
}

if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',mount);
}else{
    mount();
}
})();