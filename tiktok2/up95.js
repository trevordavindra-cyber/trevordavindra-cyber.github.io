'use strict';
/* up95.js - FORGE 31 CTA LAB (Nov 25 2026) v1
   10 call-to-action tools for ULTIMATE AI TIKTOK EDIT MAKER.
   Buttons f95b1-f95b10, guarded by window.__tk2up95. */
(function(){
  if(window.__tk2up95){return;}
  window.__tk2up95=true;
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
  cards.forEach(function(c){if(c.innerText.includes('TITLE LAB')&&!c.querySelector('#f95b1')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='CTA LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
  var R=window.__tk2cta=window.__tk2cta||{};
  var dur=function(c){var d=(parseFloat(c.end)-parseFloat(c.start))||0;if(d>0)d=d/(parseFloat(c.speed)||1);return d;};
  var tot=function(){var t=0;clips.forEach(function(c){t+=dur(c);});return t;};
  var lastClip=function(){return clips.length?clips[clips.length-1]:null;};
  var defs=[
{ id:'f95b1',label:'CTA PICK',handler:function(){
  var last=lastClip();
  var end=last?('last scene: '+((last.label||'clip').trim())+' at '+(parseFloat(last.start)||0).toFixed(1)+'s, '+(dur(last)).toFixed(1)+'s long'):'no clips yet';
  R.pick='cta lands in the last 2 seconds only: say the action ONCE, name the platform verb (follow, comment, save), never re-explain the video';
  log('CTA LAB: cta pick - '+end+' | rule: '+R.pick);
}},
{ id:'f95b2',label:'CTA SPLIT',handler:function(){
  R.split='split CTA: first half at the 40% mark is a soft save prompt ("save this for later"), last 2 seconds carry the real ask (follow) | never stack two asks in one line, viewers do neither';
  log('CTA LAB: cta split - '+R.split);
}},
{ id:'f95b3',label:'COMMENT BAIT',handler:function(){
  var topic=(clips[0]&&(clips[0].label||'').trim())||'your topic';
  R.comment=[
    'which one are you: team A or team B?',
    'what did I get wrong? comment it',
    'say "same" if this happened to you',
    'drop your '+topic+' story, I read every one'
  ];
  log('CTA LAB: 4 comment baits -> '+R.comment.join(' | '));
}},
{ id:'f95b4',label:'FOLLOW CLOSE',handler:function(){
  R.follow='follow close formula: reason + next payoff, "follow because part 2 shows the fix" beats "follow for more" every time | 6 words max, spoken not captioned';
  log('CTA LAB: follow close - '+R.follow);
}},
{ id:'f95b5',label:'LOOP BACK',handler:function(){
  var c1=clips[0];
  var open=c1?((c1.label||'clip 1').trim()):'your opener';
  R.loop='loop close: end on a line that answers the opener so the rewatch feels intentional, viewers who loop to 2x watch count as 2 views to the algorithm | opener was: "'+open+'"';
  log('CTA LAB: loop back - '+R.loop);
}},
{ id:'f95b6',label:'CTA TIMING',handler:function(){
  var t=tot();
  var at=Math.max(t-2,0);
  R.timing={total:t,at:at};
  log('CTA LAB: cta timing - runtime '+t.toFixed(1)+'s, ask goes at '+at.toFixed(1)+'s (last 2s), soft save prompt lands at '+(t*0.4).toFixed(1)+'s (40% mark)');
}},
{ id:'f95b7',label:'SOFT CTA',handler:function(){
  R.soft=[
    'save this, you will need it',
    'wait for the last part',
    'rewatch the middle bit',
    'keep this one'
  ];
  log('CTA LAB: 4 soft ctas -> '+R.soft.join(' | ')+' | soft asks drive shares+replays, they never ask for a follow');
}},
{ id:'f95b8',label:'HARD CTA',handler:function(){
  R.hard=[
    'follow, part 2 is the fix',
    'comment A or B and I will settle it',
    'check the pinned comment',
    'link in bio, one tap'
  ];
  log('CTA LAB: 4 hard ctas -> '+R.hard.join(' | ')+' | one hard ask per video, pick ONE');
}},
{ id:'f95b9',label:'CTA SCORE',handler:function(){
  var pick=(R.hard&&R.hard[0])||'follow for more';
  var s=0;var notes=[];
  if(pick.split(' ').length<=8){s+=25;}else{notes.push('over 8 words');}
  if(/follow|comment|save|share|link|part 2|pinned/i.test(pick)){s+=25;}else{notes.push('no named action verb');}
  if(/because|part 2|and I|i will|if/i.test(pick)){s+=25;}else{notes.push('no reason attached');}
  if(!/guys|smash|like and subscribe|don.t forget/i.test(pick)){s+=15;}else{notes.push('legacy youtube phrasing');}
  if((R.pick&&R.pick.indexOf('last 2 seconds')>-1)){s+=10;}else{notes.push('run CTA PICK first');}
  if(s<0)s=0;
  if(s>100)s=100;
  R.score={cta:pick,s:s,notes:notes};
  log('CTA LAB: cta score '+s+'/100 on "'+pick+'"'+(notes.length?' | fix: '+notes.join(', ')+' | rescore clears it':' | ship it'));
}},
{ id:'f95b10',label:'CTA SHEET',handler:function(){
  var c=R.comment||['run COMMENT BAIT'];
  var so=R.soft||['run SOFT CTA'];
  var ha=R.hard||['run HARD CTA'];
  var txt='FORGE 31 CTA LAB\nclips: '+clips.length+'\nruntime: '+tot().toFixed(0)+'s\npick rule: '+(R.pick||'run CTA PICK')+'\nsplit: '+(R.split||'run CTA SPLIT')+'\ncomment baits:\n'+c.map(function(x,i){return '  '+(i+1)+'. '+x;}).join('\n')+'\nfollow close: '+(R.follow||'run FOLLOW CLOSE')+'\nloop back: '+(R.loop||'run LOOP BACK')+'\ntiming: '+(R.timing?('ask at '+R.timing.at.toFixed(1)+'s of '+R.timing.total.toFixed(1)+'s, soft at 40%'):'run CTA TIMING')+'\nsoft:\n'+so.map(function(x,i){return '  '+(i+1)+'. '+x;}).join('\n')+'\nhard:\n'+ha.map(function(x,i){return '  '+(i+1)+'. '+x;}).join('\n')+'\nscore: '+(R.score?R.score.s+'/100 on "'+R.score.cta+'"':'run CTA SCORE')+'\nrules: one ask per video, last 2 seconds, reason beats volume\nsheet: forge31_cta_sheet.txt';
  download('forge31_cta_sheet.txt',txt);log('CTA LAB: downloaded sheet');}}
];
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
})();
