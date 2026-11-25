'use strict';
(function(){
  if(window.__tk2up83){return;}
  window.__tk2up83=true;
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
  cards.forEach(function(c){if(c.innerText.includes('COLOR LAB')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='PACING LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
  var PAC=window.__tk2pace=window.__tk2pace||{};
  var gd=function(c){var d=parseFloat(c.duration);if(!isFinite(d)||d<=0){d=parseFloat(c.dur);}if(!isFinite(d)||d<=0){d=(parseFloat(c.out)-parseFloat(c.in));}if(!isFinite(d)||d<0){d=0;}return d;};
  var defs=[
{ id:'f83b1',label:'PACE AUDIT',handler:function(){if(!clips.length){log('PACING LAB: add a clip first');return;}var nums=clips.map(function(c){return {id:c.id,dur:gd(c)};});var total=0;nums.forEach(function(n){total+=n.dur;});PAC.avg=clips.length?(total/clips.length):0;var fastest=nums.reduce(function(a,b){return (a.dur<=b.dur?a:b);});var slowest=nums.reduce(function(a,b){return (a.dur>=b.dur?a:b);});log('PACING LAB: audit - '+clips.length+' clips, total '+total.toFixed(1)+'s, avg '+PAC.avg.toFixed(2)+'s, fastest '+fastest.id+' '+fastest.dur.toFixed(1)+'s, slowest '+slowest.id+' '+slowest.dur.toFixed(1)+'s');}},{ id:'f83b2',label:'BEAT CUT',handler:function(){if(!clips.length){log('PACING LAB: add a clip first');return;}PAC.beat=PAC.beat||120;var step=60/PAC.beat;var cuts=clips.map(function(c,i){return c.id+' cut at '+(i*step).toFixed(2)+'s';});log('PACING LAB: beat cut - grid '+PAC.beat+'bpm ('+step.toFixed(2)+'s), '+cuts.join(', '));}},{ id:'f83b3',label:'SPEED RAMP',handler:function(){if(!clips.length){log('PACING LAB: add a clip first');return;}var ramp=clips.map(function(c,i){var key=i%3;PAC[c.id]=key===0?'1x':(key===1?'0.5x':'2x');return c.id+' '+PAC[c.id];});log('PACING LAB: speed ramp - '+ramp.join(', '));}},{ id:'f83b4',label:'SLOW-MO PICK',handler:function(){if(!clips.length){log('PACING LAB: add a clip first');return;}var long=clips.filter(function(c){return gd(c)>=3;});var pick=long.length?long:clips;var best=pick.reduce(function(a,b){return (gd(a)>=gd(b)?a:b);});log('PACING LAB: slow-mo - '+best.id+' ('+gd(best).toFixed(1)+'s) to 0.5x, new dur '+(gd(best)*2).toFixed(1)+'s');}},{ id:'f83b5',label:'FREEZE FRAME',handler:function(){if(!clips.length){log('PACING LAB: add a clip first');return;}var mid=clips[Math.floor(clips.length/2)];var md=gd(mid);PAC[mid.id]=(PAC[mid.id]||'1x')+' freeze@'+(md/2).toFixed(1)+'s';log('PACING LAB: freeze frame - '+mid.id+' held '+(md/2).toFixed(1)+'s for 0.5s');}},{ id:'f83b6',label:'JUMP CUT ALL',handler:function(){if(!clips.length){log('PACING LAB: add a clip first');return;}var cuts=clips.map(function(c){var cut=gd(c)*0.7;PAC[c.id]='jumpcut@'+cut.toFixed(1)+'s';return c.id+' -'+(gd(c)-cut).toFixed(1)+'s';});log('PACING LAB: jump cut - '+cuts.join(', '));}},{ id:'f83b7',label:'PACE CURVE',handler:function(){if(!clips.length){log('PACING LAB: add a clip first');return;}var curve=clips.map(function(c,i){var seg=i%4;var s=['calm','build','peak','drop'][seg];PAC.curve=PAC.curve||[];PAC.curve[i]=s;return c.id+' '+s;});log('PACING LAB: pace curve - '+curve.join(', '));}},{ id:'f83b8',label:'HOOK PACING',handler:function(){if(!clips.length){log('PACING LAB: add a clip first');return;}var hook=clips[0];PAC[hook.id]='1.5x';var rest=clips.length-1;log('PACING LAB: hook pacing - '+hook.id+' sped to 1.5x for the first 2s, '+rest+' clips keep 1x');}},{ id:'f83b9',label:'RESET PACING',handler:function(){if(!clips.length){log('PACING LAB: add a clip first');return;}clips.forEach(function(c){delete PAC[c.id];});PAC.curve=[];log('PACING LAB: reset - pacing cleared on '+clips.length+' clips, all 1x');}},{ id:'f83b10',label:'PACING SHEET .TXT',handler:function(){if(!clips.length){log('PACING LAB: add a clip first');return;}var txt='PACING LAB PLAN\nclips: '+clips.length+'\n'+clips.map(function(c){return c.id+','+gd(c).toFixed(1)+','+(PAC[c.id]||'1x');}).join('\n')+'\nbeats: '+PAC.beat+'bpm, avg '+ (PAC.avg||0).toFixed(2)+'s\ncurve: '+(PAC.curve||[]).join('>');download('pacing_sheet.txt',txt);log('PACING LAB: downloaded sheet');}}
];;
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
})();
