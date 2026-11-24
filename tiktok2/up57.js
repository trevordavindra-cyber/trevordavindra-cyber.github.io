// up57.js - PHASE 51 SOUND LAB (Nov 24 2026)
// beat map, bpm detect, cut-to-beat, sound design, transition audio,
// ducking plan, trend sounds, mix check, loop audio, sound sheet
'use strict';
(function(){
if(window.__tk2up57){return}window.__tk2up57=1;

function mkBtn(t,fn,id){var b=document.createElement('button');b.className='btn';b.textContent=t;if(id){b.id=id}b.onclick=fn;return b}
function mkRow(){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap='6px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function S(){try{return window.S||window.state||window.APPSTATE||{}}catch(e){return {}}}
function r1(n){return Math.round(n*10)/10}
function dl(name,text){try{var b=new Blob([text],{type:'text/plain'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;a.style.display='none';document.body.appendChild(a);a.click();setTimeout(function(){if(a.parentNode){a.parentNode.removeChild(a)}URL.revokeObjectURL(a.href)},800);log(name+' downloading');}catch(e){log('sheet download failed: '+e.message)}}
function genre(){var s=S();var st=(s.style||s.editStyle||s.genre||'').toString().toLowerCase();var txt=st+' '+JSON.stringify(s.clips||[]).toLowerCase();if(txt.indexOf('phonk')>=0){return 'phonk'}if(txt.indexOf('sport')>=0||txt.indexOf('gym')>=0){return 'sport'}if(txt.indexOf('anime')>=0){return 'anime'}if(txt.indexOf('blend')>=0){return 'blend'}return st||'general'}
function clipDur(c){var st=parseFloat(c.start),en=parseFloat(c.end);if(!isFinite(st)||!isFinite(en)){return 0}return Math.max(0,(en-st))/(c.speed||1)}
function clips(){var s=S();var a=(s&&s.clips)||[];var out=[],t=0;for(var i=0;i<a.length;i++){var d=clipDur(a[i]);if(d>0.05){t+=d;out.push({c:a[i],d:d,t0:t})}}for(var j=0;j<out.length;j++){out[j].t0-=out[j].d}return out}
function musicState(){var s=S();return !!(s.music||s.track||s.song||s.audio)}
function needClips(){if(!clips().length){log('sound lab: add clips to the timeline first');return false}return true}
function bpmTarget(g){return g==='phonk'?'140':g==='sport'?'130':g==='anime'?'120':'125'}

// ---- 1 BEAT MAP ----
function bmap(){
 if(!musicState()){log('beat map: load a track in the library first');return}
 log('BEAT MAP - 4/4 grid mapped to cut points',true);
 log('rule 1: cut on beats, hard cuts land on downbeats');
 log('rule 2: the drop owns the biggest transition - save your punch or flash for it');
 log('rule 3: every 4th beat is a phrase boundary, a good place to change pace');
 log('rule 4: off-beat cuts build tension - use sparingly, never twice in a row',true);
}

// ---- 2 BPM DETECT ----
function bbpm(){
 var g=genre();
 log('BPM DETECT - genre '+g,true);
 log('no tools needed: count 10 beats, multiply by 6 = bpm');
 log('typical edit tempos: phonk 130-160, sports 120-140, amapiano 110-115, pop 100-120');
 log('suggested target for this project: '+bpmTarget(g)+' bpm',true);
 log('if the track wavers, cut to the drums not the melody - drums hold the grid');
}

// ---- 3 CUT-TO-BEAT ----
function bcut(){
 if(!needClips()){return}
 var c=clips(),g=genre();
 log('CUT-TO-BEAT - '+c.length+' clips, target '+bpmTarget(g)+' bpm',true);
 for(var i=0;i<c.length;i++){
  log('clip '+(i+1)+' ('+r1(c[i].d)+'s) -> land its cut on beat '+(i*4+1)+' of the phrase');
 }
 log('tip: sync each clip end to a downbeat, the seam disappears when the beat carries it',true);
}

// ---- 4 SOUND DESIGN ----
function bdesign(){
 log('SOUND DESIGN RECIPE - 5 layers, in this order:',true);
 log('1. whoosh on every fast cut - keeps motion audible');
 log('2. riser into the drop - tension climbing before the hit');
 log('3. impact on the beat hit - the drop should feel physical');
 log('4. low-end rumble bed under the whole edit - glue');
 log('5. one silent beat before the payoff - contrast sells the moment',true);
}

// ---- 5 TRANSITION AUDIO ----
function btrans(){
 log('TRANSITION AUDIO PAIRS',true);
 log('cut -> beat hit, no extra sound needed');
 log('flash -> shutter or camera snap');
 log('fade -> riser tail');
 log('punch -> impact + boom');
 log('whip -> whoosh panned across the stereo field');
 log('shake -> rumble, keep it under the music not over it',true);
}

// ---- 6 DUCKING PLAN ----
function bduck(){
 log('DUCKING PLAN',true);
 log('music sits -6dB under any voiceover');
 log('sidechain the music on the drop so it breathes with the edit');
 log('duck only when voiceover overlaps music - caption-only edits get no ducking');
 log('release the duck 200ms before the next phrase so the music never stutters',true);
}

// ---- 7 TREND SOUNDS ----
function btrend(){
 log('TREND SOUNDS - how to pick one',true);
 log('scroll the trending feed, check the uses count under the sound name');
 log('pick a sound that is rising, not peaked - if the count exploded last week it is late');
 log('save 3 candidates before you commit');
 log('business accounts: verify the sound allows commercial use before posting',true);
}

// ---- 8 MIX CHECK ----
function bmix(){
 log('MIX CHECK - target levels',true);
 log('music bed: -14 to -12 LUFS');
 log('voiceover: sits 6dB above the music');
 log('master ceiling: -1 dBTP, no clipped peaks anywhere');
 log('use a loudness meter, not a peak meter');
 log('re-check the mix after any speed change - pitched audio moves the level',true);
}

// ---- 9 LOOP AUDIO ----
function bloop(){
 log('LOOP AUDIO - seamless loop recipe',true);
 log('end the track mid-phrase and cut back to the start on the same beat');
 log('no reverb tails past the seam - they smudge the loop point');
 log('crossfade 50ms at the seam, match RMS level on both sides');
 log('test by looping 3 times; if the seam is audible, shift the cut to the next downbeat',true);
}

// ---- 10 SOUND SHEET .TXT ----
function bsheet(){
 var g=genre(),d=new Date(),c=clips(),L=[];
 L.push('SOUND LAB SHEET - '+d.toLocaleString());
 L.push('GENRE: '+g+'   BPM TARGET: '+bpmTarget(g));
 L.push('');
 L.push('CLIP CUT LIST:');
 if(!c.length){L.push('no clips yet - load clips and run this again')}
 else{for(var i=0;i<c.length;i++){L.push('clip '+(i+1)+': '+r1(c[i].d)+'s -> cut on beat '+(i*4+1))}}
 L.push('');
 L.push('SOUND DESIGN LAYERS: whoosh on fast cuts | riser into drop | impact on beat hit | low-end rumble bed | silence before payoff');
 L.push('TRANSITION-SOUND PAIRS: cut=beat hit | flash=shutter | fade=riser tail | punch=impact+boom | whip=whoosh | shake=rumble');
 L.push('MIX TARGETS: music -14 to -12 LUFS | VO 6dB above music | master -1 dBTP | no clipping');
 L.push('LOOP: end mid-phrase, return on the same beat, 50ms crossfade, no reverb tails');
 dl('sound-sheet.txt',L.join('\n'));
}

function mount(){
 if(document.getElementById('f57b1')){return}
 var card=document.createElement('div');
 card.className='card';card.id='f57card';
 var h2=document.createElement('h2');
 h2.textContent='SOUND LAB';
 card.appendChild(h2);
 var r1=mkRow();
 r1.appendChild(mkBtn('BEAT MAP',bmap,'f57b1'));
 r1.appendChild(mkBtn('BPM DETECT',bbpm,'f57b2'));
 card.appendChild(r1);
 var r2=mkRow();
 r2.appendChild(mkBtn('CUT-TO-BEAT',bcut,'f57b3'));
 r2.appendChild(mkBtn('SOUND DESIGN',bdesign,'f57b4'));
 card.appendChild(r2);
 var r3=mkRow();
 r3.appendChild(mkBtn('TRANSITION AUDIO',btrans,'f57b5'));
 r3.appendChild(mkBtn('DUCKING PLAN',bduck,'f57b6'));
 card.appendChild(r3);
 var r4=mkRow();
 r4.appendChild(mkBtn('TREND SOUNDS',btrend,'f57b7'));
 r4.appendChild(mkBtn('MIX CHECK',bmix,'f57b8'));
 card.appendChild(r4);
 var r5=mkRow();
 r5.appendChild(mkBtn('LOOP AUDIO',bloop,'f57b9'));
 r5.appendChild(mkBtn('SOUND SHEET .TXT',bsheet,'f57b10'));
 card.appendChild(r5);
 var note=document.createElement('div');
 note.className='note';note.id='f57note';note.textContent='sound lab is the audio side: beat map, bpm detect, cut-to-beat, sound design, transition audio, ducking plan, trend sounds, mix check, loop audio and a downloadable sound sheet.';
 card.appendChild(note);
 var hs=document.querySelectorAll('.card h2'),anchor=null;
 for(var i=0;i<hs.length;i++){
  if(hs[i].textContent.indexOf('RETENTION LAB')>=0){
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
 log('sound lab live - beat map, bpm detect, cut-to-beat, sound design, transition audio, ducking plan, trend sounds, mix check, loop audio, sound sheet');
}

if(document.readyState==='loading'){
 document.addEventListener('DOMContentLoaded',mount);
}else{
 mount();
}
})();