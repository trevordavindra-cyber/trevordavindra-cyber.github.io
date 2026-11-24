'use strict';
// up46.js - PHASE 40 AUDIO LAB (Nov 24 2026)
// music sync, beat cuts, volume duck, sfx list, vo script,
// audio balance, trend sound, silence trim, loudness check, audio sheet
(function(){
if(window.__tk2up46){return}window.__tk2up46=1;
function mkBtn(t,fn,id){var b=document.createElement('button');b.className='btn';b.textContent=t;if(id){b.id=id}b.onclick=fn;return b}
function mkRow(){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap='6px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function saveE(){try{if(typeof save==='function'){save()}}catch(e){}}
function S(){try{return window.S||window.state||window.APPSTATE||{}}catch(e){return {}}}
function clipDur(c){var st=parseFloat(c.start),en=parseFloat(c.end);if(!isFinite(st)||!isFinite(en)){return 0}return Math.max(0,(en-st))/(c.speed||1)}
function clips(){var s=S();var a=(s&&s.clips)||[];var out=[],t=0;for(var i=0;i<a.length;i++){var d=clipDur(a[i]);if(d>0.05){t+=d;out.push({c:a[i],d:d,t0:t})}}for(var j=0;j<out.length;j++){out[j].t0-=out[j].d}return out}
function runtime(){var cs=clips();if(!cs.length){return 0}return cs[cs.length-1].t0+cs[cs.length-1].d}
function needClips(){if(!clips().length){log('audio lab: add clips to the timeline first');return false}return true}
function dl(name,text){try{var b=new Blob([text],{type:'text/plain'});var u=URL.createObjectURL(b);var a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},800);log('download started - '+name,true)}catch(e){log('download blocked, '+e.message)}}
function r1(n){return Math.round(n*10)/10}
function musicSync(){if(!needClips()){return}
 var tot=runtime();
 log('MUSIC SYNC - '+r1(tot)+'s edit: pick the track first, cut to it, never cut and then hunt for a song that fits',true);
 log('MUSIC SYNC - drop the track on clip 1 hard cut, keep one beat map in your head: most edits live on 0.5-1.5s beats at 90-130 BPM',true);
 log('MUSIC SYNC - mirror the track shape: intro quiet, drop at the hook, everything after the drop gets your fastest cuts',true)}
function beatCuts(){if(!needClips()){return}
 var cs=clips();var bpm=cs.length>8?128:100;var beat=60/bpm;
 log('BEAT CUTS - at '+bpm+' BPM a beat is '+r1(beat*1000)+'ms; land every cut within 50ms of a beat and the edit feels expensive',true);
 log('BEAT CUTS - your '+cs.length+' cut(s): double-time only on the fastest section, never the whole edit, half-time on the outro',true);
 log('BEAT CUTS - sync rule: strongest visual change (angle, speed, zoom) on the downbeat, small trims between',true)}
function volumeDuck(){if(!needClips()){return}
 var cs=clips();var withVoice=0;for(var i=0;i<cs.length;i++){if(cs[i].c&&cs[i].c.audio!==false){withVoice++}}
 log('VOLUME DUCK - music bed -12 to -18dB under dialogue, -6 to -9dB under SFX, full volume only in no-voice sections',true);
 log('VOLUME DUCK - duck with a 50ms attack, 300ms release: instant down, quick recover, never a slow fade under speech',true);
 log('VOLUME DUCK - '+withVoice+' of '+cs.length+' clip(s) read as carrying audio: sidechain or hand-duck those spans, donkey work is 30s',true)}
function sfx(){if(!needClips()){return}
 var cs=clips();
 log('SFX LIST - one whoosh or impact on every hard cut, but only up to 6 per '+r1(runtime())+'s: more reads as noise',true);
 log('SFX LIST - staples: riser into the hook, sub-drop on the biggest cut, camera-shutter on zooms, pop on sticker/text pops',true);
 log('SFX LIST - keep SFX -3 to -6dB under music: they season, they do not headline',true)}
function voScript(){if(!needClips()){return}
 var tot=runtime();
 log('VO SCRIPT - at 2.5 words/sec a '+r1(tot)+'s edit carries about '+Math.floor(tot*2.5)+' words, hook line inside the first 3s',true);
 log('VO SCRIPT - structure: hook (0-3s) / claim (3-8s) / proof or montage (8-20s) / loop-into-hook outro',true);
 log('VO SCRIPT - record dry, add the room in the mix, not in the mic: clean VO under loud music still reads premium',true)}
function balance(){if(!needClips()){return}
 log('AUDIO BALANCE - reference mix for a short: music -8dB, VO -3dB, SFX -10dB, master ceiling -1dB true peak',true);
 log('AUDIO BALANCE - check on a phone speaker before shipping: if the VO disappears, the bed is 3-4dB too hot, not the VO too quiet',true);
 log('AUDIO BALANCE - normalize once at the end, never per clip: per-clip normalization pumps the bed on every cut',true)}
function trendSound(){var tot=runtime();
 log('TREND SOUND - inside the first hour of posting a trend sound beats a paid track: the algorithm groups you with the trend page',true);
 log('TREND SOUND - your '+r1(tot)+'s edit: trend sounds favor 7-15s sync moments, so bank your best beat-cut as the reusable 8s loop',true);
 log('TREND SOUND - license note: commercial sounds mute business accounts, use TikTok commercial library or original audio if the account sells',true)}
function silenceTrim(){if(!needClips()){return}
 var cs=clips();var dead=0;for(var i=0;i<cs.length;i++){if(cs[i].d>3){dead++}}
 log('SILENCE TRIM - '+dead+' clip(s) run over 3s: that is where dead air hides, trim head and tail of each before scoring',true);
 log('SILENCE TRIM - kill every gap over 0.3s: on a short, dead air past a third of a second reads as buffering, not breathing room',true);
 log('SILENCE TRIM - keep one intentional 0.5s beat of silence before the hook payoff, contrast is what makes it land',true)}
function loudness(){if(!needClips()){return}
 log('LOUDNESS CHECK - target -14 LUFS integrated for TikTok/Reels/Shorts, true peak under -1dB, mono-safe check on phone speaker',true);
 log('LOUDNESS CHECK - if the platform normalizes your upload down, your mix ratios stay intact, so mix loud, master at -14, never clip',true);
 log('LOUDNESS CHECK - re-listen at 50% volume: a mix that survives 50% survives every compression pass they throw at it',true)}
function sheet(){if(!needClips()){return}
 var cs=clips();var L=[];
 L.push('AUDIO SHEET - tiktok2 export lab project');
 L.push('clips: '+cs.length+'  runtime: '+r1(runtime())+'s');
 L.push('');
 for(var i=0;i<cs.length;i++){L.push('clip '+(i+1)+': '+r1(cs[i].t0)+'s-'+r1(cs[i].t0+cs[i].d)+'s ('+r1(cs[i].d)+'s)'+(cs[i].d>3?' [dead-air risk: trim head/tail]':''))}
 L.push('');
 L.push('MIX: music -8dB / VO -3dB / SFX -10dB / master ceiling -1dB');
 L.push('LOUDNESS: -14 LUFS integrated, true peak under -1dB, phone-speaker mono check');
 L.push('BEAT MAP: cut within 50ms of beat, '+cs.length+' cuts max 6 SFX');
 L.push('DUCK: 50ms attack / 300ms release under speech');
 dl('audio-sheet.txt',L.join('\n'))}
function mount(){
 if(document.getElementById('f46b1')){return}
 var card=document.createElement('div');card.className='card';card.id='f46card';
 var h=document.createElement('h2');h.textContent='AUDIO LAB';card.appendChild(h);
 var r1r=mkRow();r1r.appendChild(mkBtn('MUSIC SYNC',musicSync,'f46b1'));r1r.appendChild(mkBtn('BEAT CUTS',beatCuts,'f46b2'));card.appendChild(r1r);
 var r2=mkRow();r2.appendChild(mkBtn('VOLUME DUCK',volumeDuck,'f46b3'));r2.appendChild(mkBtn('SFX LIST',sfx,'f46b4'));card.appendChild(r2);
 var r3=mkRow();r3.appendChild(mkBtn('VO SCRIPT',voScript,'f46b5'));r3.appendChild(mkBtn('AUDIO BALANCE',balance,'f46b6'));card.appendChild(r3);
 var r4=mkRow();r4.appendChild(mkBtn('TREND SOUND',trendSound,'f46b7'));r4.appendChild(mkBtn('SILENCE TRIM',silenceTrim,'f46b8'));card.appendChild(r4);
 var r5=mkRow();r5.appendChild(mkBtn('LOUDNESS CHECK',loudness,'f46b9'));r5.appendChild(mkBtn('AUDIO SHEET .TXT',sheet,'f46b10'));card.appendChild(r5);
 var note=document.createElement('div');note.className='note';note.id='f46note';note.textContent='audio lab scores the edit: music sync, beat cuts, volume ducking, an sfx list, a vo script, the mix balance, trend sound strategy, silence trimming, a loudness check and a downloadable audio sheet.';
 card.appendChild(note);
 var hs=document.querySelectorAll('.card h2'),anchor=null;
 for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('EXPORT LAB')>=0){anchor=hs[i].parentElement;break}}
 if(anchor){if(anchor.nextSibling){anchor.parentElement.insertBefore(card,anchor.nextSibling)}else{anchor.parentElement.appendChild(card)}}
 else{var ap=document.querySelector('#panelcol')||document.body;ap.appendChild(card)}
 log('audio lab live - music sync, beat cuts, volume duck, sfx list, vo script, audio balance, trend sound, silence trim, loudness check, audio sheet');
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',mount)}else{mount()}
})();
