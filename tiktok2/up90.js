'use strict';
(function(){
  if(window.__tk2up90){return;}
  window.__tk2up90=true;
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
  cards.forEach(function(c){if(c.innerText.includes('TEMPLATE LAB')&&!c.querySelector('#f90b1')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='SOUND LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
  var R=window.__tk2sound=window.__tk2sound||{};
  var dur=function(c){var d=(parseFloat(c.end)-parseFloat(c.start))||0;if(d>0)d=d/(parseFloat(c.speed)||1);return d;};
  var tot=function(){var t=0;clips.forEach(function(c){t+=dur(c);});return t;};
  var defs=[
{ id:'f90b1',label:'SOUND MAP',handler:function(){log('SOUND LAB: sound map - every short carries three audio layers: voice, music, sfx, and they must never fight for the same second | rule of layers: when the voice speaks, music ducks down 30-40 percent, sfx only fire on visual moments | your '+clips.length+' scenes get one sound identity each: open scene owns the hook sound, payoff scene owns the emotional one | silence is also a layer, one deliberate dead-air beat before the payoff makes the payoff twice as loud');}},
{ id:'f90b2',label:'BEAT SYNC',handler:function(){var order=clips.map(function(c,i){return {i:i,d:dur(c)};});var cuts='';order.forEach(function(o){cuts+=o.d.toFixed(1)+'s ';});R.beats=cuts;log('SOUND LAB: beat sync - your scene cuts run '+cuts+'| pick a track around 120 bpm, one beat every 0.5s, and land each cut on a beat, not near it | cuts on beat read as intentional, cuts off beat read as amateur even when nobody can say why | if a scene must run long, hide a mini-cut inside it so the beat train never stops');}},
{ id:'f90b3',label:'VOICE TONE',handler:function(){R.tone='conversational-fast';log('SOUND LAB: voice tone - narration should sound like you are telling one friend a secret, not reading a script | pace: 160-180 words per minute for shorts, slower on the hook line, fastest in the middle | drop your pitch on the payoff line, a falling tone signals this is the conclusion | record loud, edit quiet: leave headroom so the mix has room for music and sfx');}},
{ id:'f90b4',label:'SFX PLACEMENT',handler:function(){R.sfx='on-motion';log('SOUND LAB: sfx placement - one sfx per visual event, never stacked: whoosh on transitions, impact on the reveal, tick on text popping in | the biggest sfx goes on the single most surprising frame of the video, everything else stays small | budget: 4-8 sfx for a 30s short, more becomes noise and viewers mute | sfx volume sits 6-10db under voice so it textures rather than competes');}},
{ id:'f90b5',label:'MUSIC DUCK',handler:function(){R.duck='12-15db';log('SOUND LAB: music duck - music drops 12-15db under every voice line and swells back in the gaps between sentences | sidechain ducking or manual keyframes both work, manual reads more human | never let music and voice peak in the same half second, that smear is the number one amateur tell | your runtime is '+tot().toFixed(0)+'s, so plan roughly one duck per sentence');}},
{ id:'f90b6',label:'VOLUME RAMP',handler:function(){R.ramp='arc';log('SOUND LAB: volume ramp - build a loudness arc: quietest at second 0-2, building through the middle, loudest at the payoff | a rising mix creates physical tension, viewers feel the video heading somewhere | after the payoff drop everything down 6db for the outro so the ending feels like a landing, not a cliff');}},
{ id:'f90b7',label:'TREND SOUNDS',handler:function(){R.trend='use-for-reach';log('SOUND LAB: trend sounds - trending audio is a distribution cheat: the algorithm groups your video with everyone riding that sound | use trending audio at low volume under your voice so you inherit the reach without losing your message | swap in the trend sound in the first hour of posting while it is still climbing, not after it peaks | original sound beats trend sound for brand, trend beats original for views, pick by the goal of that post');}},
{ id:'f90b8',label:'SOUND PAUSE',handler:function(){R.pause='pre-payoff';log('SOUND LAB: sound pause - cut every layer to total silence for 0.5-1s right before the payoff line | the sudden quiet is a pattern interrupt on the ear: viewers who were half gone snap back to see what the silence is hiding | use it once per video, twice reads as a glitch | pair it with a visual freeze so the whole feed holds its breath together');}},
{ id:'f90b9',label:'EAR HOOK',handler:function(){R.earhook='0-3s';log('SOUND LAB: ear hook - the first 3 seconds need an audio hook as strong as the visual one: a bold first line, an unexpected sound, or a question spoken out loud | start mid-word or mid-action, never with a greeting or an intro, that is the sound of a skip | test it muted-blind: if the first 3s carry nothing without picture, rebuild them | loop the last sound into the first sound so replays feel seamless');}},
{ id:'f90b10',label:'SOUND SHEET .TXT',handler:function(){var txt='SOUND LAB PLAN\nclips: '+clips.length+'\nruntime: '+tot().toFixed(0)+'s\nbeat cuts: '+(R.beats||'run BEAT SYNC')+'\nvoice tone: '+(R.tone||'run VOICE TONE')+'\nsfx rule: '+(R.sfx||'run SFX PLACEMENT')+'\nducking: '+(R.duck||'run MUSIC DUCK')+'\nvolume arc: '+(R.ramp||'run VOLUME RAMP')+'\ntrend audio: '+(R.trend||'run TREND SOUNDS')+'\nsilence beat: '+(R.pause||'run SOUND PAUSE')+'\near hook: '+(R.earhook||'run EAR HOOK')+'\nrules: one layer per second, sfx under voice, loudest at payoff, silence once before payoff\ndownload: forge21_sound_sheet.txt';download('forge21_sound_sheet.txt',txt);log('SOUND LAB: downloaded sheet');}}
];;
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
})();
