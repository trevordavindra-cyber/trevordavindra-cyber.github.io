'use strict';
/* up93.js - FORGE 27 SOUND LAB (Nov 25 2026) v1
   10 sound/beat-sync tools for ULTIMATE AI TIKTOK EDIT MAKER.
   Buttons f93b1-f93b10, guarded by window.__tk2up93. */
(function(){
  if(window.__tk2up93){return;}
  window.__tk2up93=true;
  var S=window.S||{clips:[]};
  var log=window.log||console.log.bind(console);
  var mkBtn=window.mkBtn||function(id,label,card){
    var btn=document.createElement('button');
    btn.id=id;
    btn.textContent=label;
    btn.style.margin='4px';
    if(card) card.appendChild(btn);
    return btn;
  };
  var dl=window.dl||function(fname,txt){
    var a=document.createElement('a');
    a.href='data:text/plain;charset=utf-8,'+encodeURIComponent(txt);
    a.download=fname;
    a.style.display='none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  var download=window.download||dl;
  var clips=S.clips||[];
  var cards=document.querySelectorAll('div');
  var target=null;
  cards.forEach(function(c){if(c.innerText.includes('RETENTION LAB')&&!c.querySelector('#f93b1')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='SOUND LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
  var R=window.__tk2snd=window.__tk2snd||{};
  var dur=function(c){var d=(parseFloat(c.end)-parseFloat(c.start))||0;if(d>0)d=d/(parseFloat(c.speed)||1);return d;};
  var tot=function(){var t=0;clips.forEach(function(c){t+=dur(c);});return t;};
  var defs=[
{ id:'f93b1',label:'BPM PICK',handler:function(){
  var runtime=tot();
  var bpm=runtime>0?Math.round(clips.length/Math.max(runtime,1)*60*2):120;
  if(bpm<70)bpm=70; if(bpm>180)bpm=180;
  R.bpm=bpm;
  log('SOUND LAB: bpm pick - match the cut rhythm to the track, not the other way around | your '+clips.length+' scenes over '+runtime.toFixed(0)+'s suggest '+bpm+' bpm (2 cuts per beat range) | picks: 70-90 chill voiceover, 90-120 storytelling, 120-150 trending pop, 150-180 hype edits | lock it with BEAT GRID');}
},
{ id:'f93b2',label:'BEAT GRID',handler:function(){
  var bpm=R.bpm||120;
  var step=60/bpm;
  var grid=[];
  for(var t=step;t<=Math.max(tot(),step*8);t+=step){grid.push(t.toFixed(2));}
  R.grid=grid.slice(0,16).join(', ');
  log('SOUND LAB: beat grid - '+bpm+' bpm puts a beat every '+step.toFixed(2)+'s | first beats: '+R.grid+' | drop your hardest transition on beat 1, scene change on beats 2 and 4, avoid cuts between beats');}
},
{ id:'f93b3',label:'CUT ON BEAT',handler:function(){
  var bpm=R.bpm||120;
  var step=60/bpm;
  var plan=clips.map(function(c,i){var s=dur(c);var on=Math.round(s/step);return 'scene '+(i+1)+': '+(on>0?'cut on beat '+on+' ('+(s/step).toFixed(1)+' beats)':'TOO SHORT - pad to at least half a beat');}).join(' | ');
  R.cutbeat=plan;
  log('SOUND LAB: cut on beat - '+plan+' | rule: every cut lands within 0.05s of a beat, the viewer feels sync even if they never notice why');}
},
{ id:'f93b4',label:'MUSIC DUCK',handler:function(){
  R.duck='duck music -12dB under voice, release 0.3s, pre-open 0.2s before the line starts';
  log('SOUND LAB: music duck - '+R.duck+' | ducking profile: talk louder by side-chaining the bed down, never crank the voice into clipping | if you have no voice track, duck nothing and let the music carry');}
},
{ id:'f93b5',label:'SFX QUEUE',handler:function(){
  var queue=[];
  clips.forEach(function(c,i){if(dur(c)<1.2)queue.push('scene '+(i+1)+': whoosh on the cut in');});
  if(!queue.length&&clips.length)queue.push('scene 1: riser into the first beat drop');
  if(!queue.length)queue.push('load clips first, then the queue lists one sfx per hard cut');
  R.sfx=queue.join(' | ');
  log('SOUND LAB: sfx queue - '+R.sfx+' | cap it at one sfx per cut, two stacked sounds read as noise and kill the mix');}
},
{ id:'f93b6',label:'VOICE PACE',handler:function(){
  var words=Math.round(tot()*2.6);
  R.voice=tot()>0?words+' words fits '+tot().toFixed(0)+'s at a natural 155 wpm pace':'load clips to size the script';
  log('SOUND LAB: voice pace - '+R.voice+' | front-load the hook line in the first 3 seconds, one idea per breath, and leave 0.3s of air after the payoff so the loop point lands clean');}
},
{ id:'f93b7',label:'MIX CHECK',handler:function(){
  R.mix='music -18LUFS bed, voice -6LUFS peak, sfx -10LUFS, master -14LUFS, true peak -1dB';
  log('SOUND LAB: mix check - '+R.mix+' | tiktok normalizes loud, so a quiet master gets boosted with more noise: master loud and clean instead | most common fail: sfx louder than the voice');}
},
{ id:'f93b8',label:'TREND AUDIO',handler:function(){
  R.trend='pick the audio before the edit: sounds under 7 days old spike reach, sounds over 30 days old read as reposts';
  log('SOUND LAB: trend audio - '+R.trend+' | workflow: scroll the sound page, save 3 candidates, check use count growth over 48h, then cut to the fastest grower | original audio wins only when the voice IS the content');}
},
{ id:'f93b9',label:'AUDIO SCORE',handler:function(){
  var s=0;var notes=[];
  if(R.bpm){s+=15;}else{notes.push('no bpm picked');}
  if(R.grid){s+=15;}else{notes.push('no beat grid');}
  if(R.cutbeat){s+=20;}else{notes.push('cuts not beat-mapped');}
  if(R.duck){s+=10;}else{notes.push('no duck plan');}
  if(R.sfx){s+=10;}else{notes.push('no sfx queue');}
  if(R.voice){s+=10;}else{notes.push('voice pace unset');}
  if(R.mix){s+=10;}else{notes.push('mix unchecked');}
  if(R.trend){s+=10;}else{notes.push('trend audio not picked');}
  R.score=s;
  log('SOUND LAB: audio score '+s+'/100'+(notes.length?' | missing: '+notes.join(', ')+' | run the missing tools above, rescore clears to 100':' | full stack locked'));},
},
{ id:'f93b10',label:'SOUND SHEET',handler:function(){
  var txt='FORGE 27 SOUND LAB\nclips: '+clips.length+'\nruntime: '+tot().toFixed(0)+'s\nbpm: '+(R.bpm||'run BPM PICK')+'\nbeat grid: '+(R.grid||'run BEAT GRID')+'\ncut on beat: '+(R.cutbeat||'run CUT ON BEAT')+'\nduck: '+(R.duck||'run MUSIC DUCK')+'\nsfx queue: '+(R.sfx||'run SFX QUEUE')+'\nvoice pace: '+(R.voice||'run VOICE PACE')+'\nmix: '+(R.mix||'run MIX CHECK')+'\ntrend audio: '+(R.trend||'run TREND AUDIO')+'\nscore: '+(R.score||'run AUDIO SCORE')+'/100\nrules: pick audio before editing, cut on beats, duck under voice, one sfx per cut, master loud and clean, sound under 7 days old\nsheet: forge27_sound_sheet.txt';
  download('forge27_sound_sheet.txt',txt);log('SOUND LAB: downloaded sheet');}}
];
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
})();