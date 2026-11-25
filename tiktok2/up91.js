'use strict';
(function(){
  if(window.__tk2up91){return;}
  window.__tk2up91=true;
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
  cards.forEach(function(c){if(c.innerText.includes('SOUND LAB')&&!c.querySelector('#f91b1')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='COLOR LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
  var R=window.__tk2color=window.__tk2color||{};
  var dur=function(c){var d=(parseFloat(c.end)-parseFloat(c.start))||0;if(d>0)d=d/(parseFloat(c.speed)||1);return d;};
  var tot=function(){var t=0;clips.forEach(function(c){t+=dur(c);});return t;};
  var defs=[
{ id:'f91b1',label:'COLOR MAP',handler:function(){log('COLOR LAB: color map - every short gets one palette: one dominant color, one supporting color, one accent used only on the payoff | your '+clips.length+' scenes live inside it, outliers only when a scene is meant to shock | pick the dominant from your subject itself, not from what looks nice in isolation | write the three hexes down before editing so every scene is graded toward them, not around them');}},
{ id:'f91b2',label:'PALETTE PICK',handler:function(){R.palette='dominant-support-accent';log('COLOR LAB: palette pick - warm palettes (orange, red, gold) read as energy and urgency, cool palettes (teal, blue, violet) read as calm and mystery, and mixing warm subject on cool background is the fastest separation trick in editing | two free palette rules: never exceed three colors with real weight, and let the accent color appear on text so captions tie into the frame | steal palettes from film stills, not from other shorts, so yours never looks like the feed around it');}},
{ id:'f91b3',label:'CONTRAST',handler:function(){R.contrast='punch-mids';log('COLOR LAB: contrast - phone screens are small and bright, so subtle grades die: push contrast until the darks are truly dark and the brightest highlights almost clip, then pull back one step | the middle is where detail lives, so lift mids instead of crushing everything | check the frame at 10 percent brightness, that is how a third of your viewers will watch it, and if it turns to mud it needs another pass');}},
{ id:'f91b4',label:'GRADE LUT',handler:function(){R.lut='one-per-short';log('COLOR LAB: grade lut - one grade across the whole short reads as intentional, a different look per scene reads as a compilation | build or pick one lut and ride it start to finish, then grade each scene only for exposure matching, not character | strength rule: any lut above 70 percent strength starts eating skin tones, park it at 40-60 | render one frame from your first scene and one from your last and compare, they should feel like the same world');}},
{ id:'f91b5',label:'SKIN TONE',handler:function(){R.skin='protect';log('COLOR LAB: skin tone - skin is the one color viewers are experts on, they see it every day, so any grade that makes faces orange, green or gray reads as broken even when everything else looks great | protect skin: after your grade, check faces against the original and pull skin back toward neutral | on ai-generated frames skin drifts scene to scene, so a light skin-tone lock layer across scenes keeps the cast consistent');}},
{ id:'f91b6',label:'SATURATION',handler:function(){R.sat='restrained';log('COLOR LAB: saturation - oversaturated reads as fake within two seconds, undersaturated reads as depressing, so the move is selective: full saturation on your dominant and accent colors, pulled back everywhere else | the mute-everything-then-boost-one-color trick makes any subject pop without looking like a filter | your runtime is '+tot().toFixed(0)+'s, viewers never adapt mid-scroll, so the grade has to land in frame one');}},
{ id:'f91b7',label:'B&W POP',handler:function(){R.bw='one-beat';log('COLOR LAB: b and w pop - one deliberate black and white beat inside a color short is a pattern interrupt that costs nothing: use it for the quiet line before the payoff or a flashback beat | a half second is enough, a full scene only if the whole story earns it | snap back to color exactly on the payoff frame so the color itself becomes part of the reveal | never use it twice, the trick dies on repeat');}},
{ id:'f91b8',label:'COLOR STORY',handler:function(){R.story='shift-on-turn';log('COLOR LAB: color story - let color move with the story: start cooler or flatter in the setup, warm or saturate toward the payoff, so the grade itself tells viewers something changed | the shift should be small, ten to twenty percent, felt not seen | one direction only, a grade that wanders back and forth reads as broken export settings | end on the strongest version of your palette, the last frame is what the replay starts on');}},
{ id:'f91b9',label:'COLOR SCORE',handler:function(){var have=[R.palette,R.contrast,R.lut,R.skin,R.sat,R.bw,R.story].filter(Boolean).length;var score=Math.min(100,40+have*10+(clips.length>0?10:0));R.score=score;log('COLOR LAB: color score '+score+'/100'+(score>=85?' - ship it':' - run the missing tools above then rescore')+' | checklist: one palette (run PALETTE PICK), punchy contrast (CONTRAST), single lut (GRADE LUT), protected skin (SKIN TONE), selective saturation (SATURATION), one bw beat (B&W POP), story shift (COLOR STORY) | a short that passes color gets watched longer even when nobody can name why');}},
{ id:'f91b10',label:'COLOR SHEET .TXT',handler:function(){var txt='COLOR LAB PLAN\nclips: '+clips.length+'\nruntime: '+tot().toFixed(0)+'s\npalette: '+(R.palette||'run PALETTE PICK')+'\ncontrast: '+(R.contrast||'run CONTRAST')+'\nlut: '+(R.lut||'run GRADE LUT')+'\nskin: '+(R.skin||'run SKIN TONE')+'\nsaturation: '+(R.sat||'run SATURATION')+'\nbw beat: '+(R.bw||'run B&W POP')+'\ncolor story: '+(R.story||'run COLOR STORY')+'\nscore: '+(R.score||'run COLOR SCORE')+'/100\nrules: one palette, three colors max, one lut, protect skin, one bw beat, color shifts with the story\ndownload: forge23_color_sheet.txt';download('forge23_color_sheet.txt',txt);log('COLOR LAB: downloaded sheet');}}
];;
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
})();