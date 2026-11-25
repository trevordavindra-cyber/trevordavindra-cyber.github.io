'use strict';
(function(){
  if(window.__tk2up92){return;}
  window.__tk2up92=true;
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
  cards.forEach(function(c){if(c.innerText.includes('COLOR LAB')&&!c.querySelector('#f92b1')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='RETENTION LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
  var R=window.__tk2ret=window.__tk2ret||{};
  var dur=function(c){var d=(parseFloat(c.end)-parseFloat(c.start))||0;if(d>0)d=d/(parseFloat(c.speed)||1);return d;};
  var tot=function(){var t=0;clips.forEach(function(c){t+=dur(c);});return t;};
  var defs=[
{ id:'f92b1',label:'RET MAP',handler:function(){var map=clips.map(function(c,i){return 'scene '+(i+1)+': '+dur(c).toFixed(1)+'s';}).join(' | ');log('RETENTION LAB: ret map - retention is decided in three windows: the first 3 seconds, the middle lull, and the last 2 seconds before the loop point | your '+clips.length+' scenes: '+map+' (runtime '+tot().toFixed(0)+'s) | map where each window falls in your cut before touching anything, because a fix in the wrong window wastes the pass | the graph you want is flat-high, not a cliff at second 3 and a crawl at the end');}},
{ id:'f92b2',label:'FIRST 3 SEC',handler:function(){R.first3='no-intro';log('RETENTION LAB: first 3 sec - the first three seconds answer one question: why should i keep watching, and every intro answers it with nothing | no logo, no greeting, no setup: open on the most surprising frame or the boldest claim you own, then earn the context in the next lines | say the payoff category in frame one without giving the payoff itself (this ocean fact is illegal, wait for the ending) | read your first 3 seconds as a stranger with a thumb: if nothing is still unresolved by second 3, the swipe already happened');}},
{ id:'f92b3',label:'LOOP PLAN',handler:function(){R.loop='seamless';log('RETENTION LAB: loop plan - a seamless loop turns one view into two and doubles average watch time for free | build it by matching the last frame visually to the first: same composition, same motion direction, so the restart feels continuous | audio must not announce the seam: end the track where it would naturally continue | the deepest loops hide the payoff in the middle so rewatchers catch new details, that is where rewatch rate comes from');}},
{ id:'f92b4',label:'DROP SCAN',handler:function(){R.dropscan='done';log('RETENTION LAB: drop scan - walk your cut scene by scene and name the reason a viewer stays through each one, out loud | any scene where you cannot name the reason is a drop candidate: cut it, shorten it, or move its best moment to the front | the middle of a short loses the most viewers because novelty fades right when the payoff is still far away | your runtime is '+tot().toFixed(0)+'s, so every second past the midpoint must be paying rent');}},
{ id:'f92b5',label:'PACING PLAN',handler:function(){R.pacing='front-loaded';log('RETENTION LAB: pacing plan - front-load change: your fastest cuts and loudest moments belong in the first half, while the back half slows down just enough to make the payoff land | a flat pace feels slower than it is, so vary scene length on purpose: quick quick slow reads as intentional, monotonous reads as long | save one visual gear-shift (speed ramp, silence, freeze) for the 60 to 70 percent mark, it resets attention exactly where drops peak');}},
{ id:'f92b6',label:'OPEN LOOP',handler:function(){R.openloop='one-question';log('RETENTION LAB: open loop - open one question early and close it late: plant it in the first quarter (but the strangest part is at the end), reference it once mid-short so viewers remember it is unpaid, and pay it off in the final seconds | one loop per short, two reads as clutter | the loop is the reason people watch a mediocre middle: they are not watching the middle, they are waiting for the end');}},
{ id:'f92b7',label:'PAYOFF SPOT',handler:function(){R.payoff='late-but-earned';log('RETENTION LAB: payoff spot - place the payoff late enough that the loop holds, early enough that nobody feels baited: the last 15 percent of the runtime is the pocket | pay it off bigger than the setup promised, then add one extra beat after it (the twist on the twist) so the ending is not just the answer | a payoff that arrives with dead air after it bleeds rewatch, so end within a breath of the reveal');}},
{ id:'f92b8',label:'REWATCH HOOK',handler:function(){R.rewatch='detail-bomb';log('RETENTION LAB: rewatch hook - give rewatchers a reason: hide one small detail early (background text, a number, a face) that only makes sense after the payoff | caption it or let commenters find it, because comment sections that argue about your hidden detail are free distribution | a short people rewatch also gets shared more, so this tool compounds | never hide the detail so deep it needs a third watch, one rewatch is the win condition');}},
{ id:'f92b9',label:'RET SCORE',handler:function(){var have=[R.first3,R.loop,R.dropscan,R.pacing,R.openloop,R.payoff,R.rewatch].filter(Boolean).length;var score=Math.min(100,40+have*10+(clips.length>0?10:0));R.score=score;log('RETENTION LAB: ret score '+score+'/100'+(score>=85?' - ship it':' - run the missing tools above then rescore')+' | checklist: no intro (FIRST 3 SEC), seamless loop (LOOP PLAN), drop scan done (DROP SCAN), front-loaded pace (PACING PLAN), one open loop (OPEN LOOP), late payoff (PAYOFF SPOT), rewatch detail (REWATCH HOOK) | retention is the metric the algorithm actually pays for');}},
{ id:'f92b10',label:'RET SHEET .TXT',handler:function(){var txt='RETENTION LAB PLAN\nclips: '+clips.length+'\nruntime: '+tot().toFixed(0)+'s\nfirst 3 sec: '+(R.first3||'run FIRST 3 SEC')+'\nloop: '+(R.loop||'run LOOP PLAN')+'\ndrop scan: '+(R.dropscan||'run DROP SCAN')+'\npacing: '+(R.pacing||'run PACING PLAN')+'\nopen loop: '+(R.openloop||'run OPEN LOOP')+'\npayoff spot: '+(R.payoff||'run PAYOFF SPOT')+'\nrewatch hook: '+(R.rewatch||'run REWATCH HOOK')+'\nscore: '+(R.score||'run RET SCORE')+'/100\nrules: no intro, seamless loop, front-loaded pace, one open loop, payoff in the last 15 percent, one hidden rewatch detail\ndownload: forge25_ret_sheet.txt';download('forge25_ret_sheet.txt',txt);log('RETENTION LAB: downloaded sheet');}}
];;
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
})();