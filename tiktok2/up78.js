'use strict';
(function(){
  if(window.__tk2up78){return;}
  window.__tk2up78=true;
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
  cards.forEach(function(c){if(c.innerText.includes('EFFECTS LAB')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='TEMPLATE LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
var defs=[
{ id:'f78b1',label:'PRESET AUDIT',handler:function(){if(!clips.length){log('TEMPLATE LAB: add a clip first');return;}var out='Preset audit: '+clips.length+' clips, total duration '+clips.reduce((a,c)=>a+(c.dur||0),0)+'s';log('TEMPLATE LAB: '+out);}},
{ id:'f78b2',label:'SAVE PRESET',handler:function(){if(!clips.length){log('TEMPLATE LAB: add a clip first');return;}var preset=JSON.stringify(clips,null,2);download('preset-'+Date.now()+'.txt',preset);log('TEMPLATE LAB: preset saved');}},
{ id:'f78b3',label:'LOAD PRESET',handler:function(){if(!clips.length){log('TEMPLATE LAB: add a clip first');return;}log('TEMPLATE LAB: saved preset file has '+clips.length+' clips; paste it back on any project to restore');}},
{ id:'f78b4',label:'PRESET LIST',handler:function(){if(!clips.length){log('TEMPLATE LAB: add a clip first');return;}var list=clips.map((c,i)=>i+1+'. '+c.id+' ('+(c.dur||0)+'s)').join('\n');log('TEMPLATE LAB: '+list);}},
{ id:'f78b5',label:'DELETE PRESET',handler:function(){if(!clips.length){log('TEMPLATE LAB: add a clip first');return;}clips.forEach(function(c){c.label='';});log('TEMPLATE LAB: preset labels cleared');}},
{ id:'f78b6',label:'EXPORT PRESET .TXT',handler:function(){if(!clips.length){log('TEMPLATE LAB: add a clip first');return;}var txt=JSON.stringify(clips,null,2);download('template-preset-'+Date.now()+'.txt',txt);log('TEMPLATE LAB: preset exported');}},
{ id:'f78b7',label:'APPLY TO CLIPS',handler:function(){if(!clips.length){log('TEMPLATE LAB: add a clip first');return;}var avg=clips.reduce((a,c)=>a+(c.dur||0),0)/clips.length;clips.forEach(function(c){c.dur=avg;});log('TEMPLATE LAB: durations set to average '+(Math.round(avg*100)/100).toFixed(2)+'s');}},
{ id:'f78b8',label:'CLONE PROJECT',handler:function(){if(!clips.length){log('TEMPLATE LAB: add a clip first');return;}var clone=JSON.parse(JSON.stringify(clips));log('TEMPLATE LAB: cloned '+clone.length+' clips');}},
{ id:'f78b9',label:'RESET PLAN',handler:function(){if(!clips.length){log('TEMPLATE LAB: add a clip first');return;}clips.forEach(function(c){c.dur=0;});log('TEMPLATE LAB: reset all durations to 0');}},
{ id:'f78b10',label:'TEMPLATE SHEET .TXT',handler:function(){if(!clips.length){log('TEMPLATE LAB: add a clip first');return;}var sheet='# Template Sheet\n\nClips:\n';clips.forEach(function(c){sheet+='• '+c.id+' (dur:'+(c.dur||0)+'s)\n';});download('template-sheet-'+Date.now()+'.txt',sheet);log('TEMPLATE LAB: template sheet exported');}}
];
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
})();
