'use strict';
(function(){
  if(window.__tk2up80){return;}
  window.__tk2up80=true;
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
  cards.forEach(function(c){if(c.innerText.includes('WORKFLOW LAB')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='GROWTH LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
var defs=[
{ id:'f80b1',label:'HASHTAG MIX',handler:function(){if(!clips.length){log('GROWTH LAB: add a clip first');return;}var n=clips.length;var broad=['fyp','foryou','viral'];var niche=['editing','clips'];var topic=['aicontent'];log('GROWTH LAB: mix for '+n+' clips -> 3 broad '+broad.join(' ')+' + 2 niche '+niche.join(' ')+' + 1 topic '+topic[0]);}},{ id:'f80b2',label:'POST TIME',handler:function(){if(!clips.length){log('GROWTH LAB: add a clip first');return;}var slots=['6-8am','12-1pm','7-9pm'];log('GROWTH LAB: best slots '+slots.join(', ')+' ET, first pick 7-9pm');}},{ id:'f80b3',label:'DUET PLAN',handler:function(){if(!clips.length){log('GROWTH LAB: add a clip first');return;}var first=clips[0];log('GROWTH LAB: duet plan -> stitch '+first.id+' first 2s, reaction next, remix audio last');}},{ id:'f80b4',label:'TREND FIT',handler:function(){if(!clips.length){log('GROWTH LAB: add a clip first');return;}var score=60+Math.min(clips.length,8)*5;log('GROWTH LAB: trend fit '+score+'/100 for '+clips.length+' clips');}},{ id:'f80b5',label:'SOUND PICK',handler:function(){if(!clips.length){log('GROWTH LAB: add a clip first');return;}log('GROWTH LAB: sound plan -> trending beat on hook clip '+clips[0].id+', original audio on outro');}},{ id:'f80b6',label:'THUMB TEXT',handler:function(){if(!clips.length){log('GROWTH LAB: add a clip first');return;}var t=['wait for it','you missed this','part 1'];log('GROWTH LAB: thumb text options '+t.join(' | '));}},{ id:'f80b7',label:'BIO LINE',handler:function(){if(!clips.length){log('GROWTH LAB: add a clip first');return;}log('GROWTH LAB: bio line -> daily AI-made edits, new drop every night');}},{ id:'f80b8',label:'PIN PLAN',handler:function(){if(!clips.length){log('GROWTH LAB: add a clip first');return;}var best=clips.reduce((a,c)=>c.dur>a.dur?c:a,clips[0]);log('GROWTH LAB: pin '+best.id+' ('+best.dur+'s, longest clip)');}},{ id:'f80b9',label:'ENGAGE PLAN',handler:function(){if(!clips.length){log('GROWTH LAB: add a clip first');return;}log('GROWTH LAB: engage plan -> reply to comments first 60 min, like top 10, post follow-up within 24h');}},{ id:'f80b10',label:'GROWTH SHEET .TXT',handler:function(){if(!clips.length){log('GROWTH LAB: add a clip first');return;}var txt='GROWTH LAB PLAN\nclips: '+clips.length+'\n'+clips.map(c=>c.id+','+c.dur).join('\n')+'\nslots: 6-8am 12-1pm 7-9pm ET\nmix: fyp foryou viral editing clips aicontent';download('growth_sheet.txt',txt);log('GROWTH LAB: downloaded sheet');}}
];;
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
})();