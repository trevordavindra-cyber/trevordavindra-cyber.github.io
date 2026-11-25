'use strict';
(function(){
  if(window.__tk2up79){return;}
  window.__tk2up79=true;
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
  cards.forEach(function(c){if(c.innerText.includes('TEMPLATE LAB')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='WORKFLOW LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
var defs=[
{ id:'f79b1',label:'WORKFLOW AUDIT',handler:function(){if(!clips.length){log('WORKFLOW LAB: add a clip first');return;}var cnt=clips.length,tot=clips.reduce((s,c)=>s+c.dur,0);log('WORKFLOW LAB: '+cnt+' clips, total duration '+tot);}},{ id:'f79b2',label:'DUPLICATE LAST',handler:function(){if(!clips.length){log('WORKFLOW LAB: add a clip first');return;}var last=clips[clips.length-1];clips.push({id:last.id+'-copy',dur:last.dur});log('WORKFLOW LAB: duplicate '+last.id);}},{ id:'f79b3',label:'MOVE UP',handler:function(){if(!clips.length){log('WORKFLOW LAB: add a clip first');return;}if(clips.length<2){log('WORKFLOW LAB: need at least 2 clips');return;}var t=clips[clips.length-2];clips[clips.length-2]=clips[clips.length-1];clips[clips.length-1]=t;log('WORKFLOW LAB: swapped last two clips');}},{ id:'f79b4',label:'MOVE DOWN',handler:function(){if(!clips.length){log('WORKFLOW LAB: add a clip first');return;}if(clips.length<2){log('WORKFLOW LAB: need at least 2 clips');return;}var t=clips[0];clips[0]=clips[1];clips[1]=t;log('WORKFLOW LAB: swapped first two clips');}},{ id:'f79b5',label:'REVERSE ORDER',handler:function(){if(!clips.length){log('WORKFLOW LAB: add a clip first');return;}clips.reverse();log('WORKFLOW LAB: reversed clip order');}},{ id:'f79b6',label:'SORT BY LENGTH',handler:function(){if(!clips.length){log('WORKFLOW LAB: add a clip first');return;}clips.sort((a,b)=>a.dur-b.dur);log('WORKFLOW LAB: sorted by duration');}},{ id:'f79b7',label:'MERGE DURS',handler:function(){if(!clips.length){log('WORKFLOW LAB: add a clip first');return;}var sum=clips.reduce((s,c)=>s+c.dur,0);clips[0].dur=sum;for(var i=1;i<clips.length;i++)clips[i].dur=0;log('WORKFLOW LAB: merged durations into '+clips[0].id);}},{ id:'f79b8',label:'GAP CHECK',handler:function(){if(!clips.length){log('WORKFLOW LAB: add a clip first');return;}var gaps=clips.filter(c=>c.dur===0).length;log('WORKFLOW LAB: '+gaps+' clips have zero duration');}},{ id:'f79b9',label:'WORKFLOW SHEET .TXT',handler:function(){if(!clips.length){log('WORKFLOW LAB: add a clip first');return;}var txt=clips.map(c=>c.id+','+c.dur).join('\n');download('workflow_sheet.txt',txt);log('WORKFLOW LAB: downloaded sheet');}},{ id:'f79b10',label:'WORKFLOW STATS',handler:function(){if(!clips.length){log('WORKFLOW LAB: add a clip first');return;}var durs=clips.map(c=>c.dur),min=Math.min(...durs),max=Math.max(...durs),avg=durs.reduce((s,c)=>s+c,0)/durs.length;log('WORKFLOW LAB: min '+min+' max '+max+' avg '+avg.toFixed(2));}}
];;
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
})();