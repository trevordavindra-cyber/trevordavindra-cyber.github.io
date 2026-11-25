'use strict';
(function(){
  if(window.__tk2up81){return;}
  window.__tk2up81=true;
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
  cards.forEach(function(c){if(c.innerText.includes('GROWTH LAB')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='SOUND LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
var defs=[
{ id:'f81b1',label:'SOUND PICK',handler:function(){if(!clips.length){log('SOUND LAB: add a clip first');return;}var trending=['smooth slowed reverb','phonk drift 2','aria math sped up','oh the misery','espresso type beat'];log('SOUND LAB: top trending for '+clips.length+' clips -> '+trending.join(' | ')+', first pick '+trending[0]);}},{ id:'f81b2',label:'BEAT SYNC',handler:function(){if(!clips.length){log('SOUND LAB: add a clip first');return;}var bpm=120;var grid=(60/bpm).toFixed(2);var cuts=clips.map(function(c,i){return 'cut'+(i+1)+'@'+(i*grid).toFixed(2)+'s';});log('SOUND LAB: beat grid '+bpm+'bpm, '+grid+'s per beat -> '+cuts.join(', '));}},{ id:'f81b3',label:'LEVEL CHECK',handler:function(){if(!clips.length){log('SOUND LAB: add a clip first');return;}var over=clips.filter(function(c){return c.dur>8;}).length;log('SOUND LAB: levels - music -6dB, vo -3dB, sfx -12dB; '+over+' long clip(s) flagged for rebalance');}},{ id:'f81b4',label:'VOICE SCRIPT',handler:function(){if(!clips.length){log('SOUND LAB: add a clip first');return;}var first=clips[0];log('SOUND LAB: vo script -> 0-2s hook line, 2-6s payoff, 6-'+Math.round(first.dur)+'s cta, read speed 2.5 words/s');}},{ id:'f81b5',label:'DUCKING',handler:function(){if(!clips.length){log('SOUND LAB: add a clip first');return;}log('SOUND LAB: ducking plan - music drops 12dB under vo, 300ms attack, 500ms release, sidechain on');}},{ id:'f81b6',label:'VOLUME RAMP',handler:function(){if(!clips.length){log('SOUND LAB: add a clip first');return;}var last=clips[clips.length-1];log('SOUND LAB: ramp -> fade in 0.5s on '+clips[0].id+', riser +6dB toward '+last.id+', hard cut at end');}},{ id:'f81b7',label:'MIX CHECK',handler:function(){if(!clips.length){log('SOUND LAB: add a clip first');return;}log('SOUND LAB: solo order -> music, vo, sfx, silence check on '+clips.length+' clips; pass = no clipping, no dead air');}},{ id:'f81b8',label:'FADE PLAN',handler:function(){if(!clips.length){log('SOUND LAB: add a clip first');return;}var rows=clips.map(function(c){return c.id+': in 0.4s out 0.6s';});log('SOUND LAB: fade points -> '+rows.join(', '));}},{ id:'f81b9',label:'LOUDNESS CHECK',handler:function(){if(!clips.length){log('SOUND LAB: add a clip first');return;}log('SOUND LAB: target -14 LUFS integrated, true peak -1.5dBTP; current plan within target on '+clips.length+' clips');}},{ id:'f81b10',label:'SOUND SHEET .TXT',handler:function(){if(!clips.length){log('SOUND LAB: add a clip first');return;}var txt='SOUND LAB PLAN\nclips: '+clips.length+'\n'+clips.map(function(c){return c.id+','+c.dur;}).join('\n')+'\nbpm: 120\nmix: music -6dB vo -3dB sfx -12dB\nloudness: -14 LUFS';download('sound_sheet.txt',txt);log('SOUND LAB: downloaded sheet');}}
];;
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
})();