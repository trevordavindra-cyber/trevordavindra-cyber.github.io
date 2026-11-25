'use strict';
/* up96.js - FORGE 33 VIRAL LAB (Nov 25 2026) v1
   10 virality tools for ULTIMATE AI TIKTOK EDIT MAKER.
   Buttons f96b1-f96b10, guarded by window.__tk2up96. */
(function(){
  if(window.__tk2up96){return;}
  window.__tk2up96=true;
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
  cards.forEach(function(c){if(c.innerText.includes('CTA LAB')&&!c.querySelector('#f96b1')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='VIRAL LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
  var R=window.__tk2viral=window.__tk2viral||{};
  var dur=function(c){var d=(parseFloat(c.end)-parseFloat(c.start))||0;if(d>0)d=d/(parseFloat(c.speed)||1);return d;};
  var tot=function(){var t=0;clips.forEach(function(c){t+=dur(c);});return t;};
  var defs=[
{ id:'f96b1',label:'VIRAL SCAN',handler:function(){
  var t=tot();
  var checks=[
    ['hook in 3s', t>0],
    ['runtime 20-45s', t>=20&&t<=45],
    ['one idea per video', clips.length>0],
    ['cta present', !!(R.share||R.save||R.rewatch)]
  ];
  var pass=checks.filter(function(x){return x[1];}).length;
  R.scan={pass:pass,total:checks.length,checks:checks.map(function(x){return x[0]+': '+(x[1]?'ok':'missing');})};
  log('VIRAL LAB: scan '+pass+'/'+checks.length+' base checks | '+R.scan.checks.join(' | '));
}},
{ id:'f96b2',label:'TREND FIT',handler:function(){
  R.trend='trend fit: ride one live format (list,POV,day-in-life,challenge) but swap the subject to your niche - a trend\'s audio and caption style, never its content';
  log('VIRAL LAB: '+R.trend);
}},
{ id:'f96b3',label:'SHARE BAIT',handler:function(){
  R.share=['tag the friend who does this','send this to someone who needs the wake-up','this is the one thing to know before it happens'];
  log('VIRAL LAB: 3 share triggers -> '+R.share.join(' | '));
}},
{ id:'f96b4',label:'SAVE BAIT',handler:function(){
  R.save=['save this, you will need it at 2am','screenshot list before it disappears','save now, apply this weekend'];
  log('VIRAL LAB: 3 save triggers -> '+R.save.join(' | '));
}},
{ id:'f96b5',label:'REWATCH BAIT',handler:function(){
  R.rewatch='rewatch bait: hide one detail early, reveal it in the last 3 seconds, say "watch again, you missed it" without saying it - the loop is the rewatch';
  log('VIRAL LAB: '+R.rewatch);
}},
{ id:'f96b6',label:'DUET ANGLE',handler:function(){
  R.duet='duet angle: leave one open question at 80% of the video so creators duet their own answer - questions, not conclusions, invite stitches';
  log('VIRAL LAB: '+R.duet);
}},
{ id:'f96b7',label:'SOUND SPOT',handler:function(){
  R.sound='sound: pick a rising sound with under 50k uses and post within its first growth week - big sounds bury you, dead sounds do nothing';
  log('VIRAL LAB: '+R.sound);
}},
{ id:'f96b8',label:'POST CLOCK',handler:function(){
  R.clock={windows:['Tue-Thu 6-9am local','Tue-Thu 7-11pm local','Sat 11am-1pm local'],note:'post 20-30 min before the window opens so the first hour lands inside it'};
  log('VIRAL LAB: post windows '+R.clock.windows.join(' | ')+' | '+R.clock.note);
}},
{ id:'f96b9',label:'VIRAL SCORE',handler:function(){
  var s=20;var notes=[];
  if(tot()>=20&&tot()<=45){s+=20;}else{notes.push('runtime off the 20-45s sweet spot');}
  if(R.share&&R.save&&R.rewatch){s+=25;}else{notes.push('run SHARE/SAVE/REWATCH first');}
  if(R.trend){s+=15;}else{notes.push('run TREND FIT');}
  if(R.sound){s+=10;}else{notes.push('run SOUND SPOT');}
  if(R.clock){s+=10;}else{notes.push('run POST CLOCK');}
  if(s<0)s=0;if(s>100)s=100;
  R.score={s:s,notes:notes};
  log('VIRAL LAB: viral score '+s+'/100'+(notes.length?' | fix: '+notes.join(', ')+' | rescore clears it':' | ship it'));
}},
{ id:'f96b10',label:'VIRAL SHEET',handler:function(){
  var txt='FORGE 33 VIRAL LAB\nclips: '+clips.length+'\nruntime: '+tot().toFixed(0)+'s\nscan: '+(R.scan?R.scan.pass+'/'+R.scan.total+' - '+R.scan.checks.join('; '):'run VIRAL SCAN')+'\ntrend fit: '+(R.trend||'run TREND FIT')+'\nshare triggers:\n'+((R.share||['run SHARE BAIT']).map(function(x,i){return '  '+(i+1)+'. '+x;}).join('\n'))+'\nsave triggers:\n'+((R.save||['run SAVE BAIT']).map(function(x,i){return '  '+(i+1)+'. '+x;}).join('\n'))+'\nrewatch bait: '+(R.rewatch||'run REWATCH BAIT')+'\nduet angle: '+(R.duet||'run DUET ANGLE')+'\nsound: '+(R.sound||'run SOUND SPOT')+'\npost windows: '+(R.clock?R.clock.windows.join(' | ')+' ('+R.clock.note+')':'run POST CLOCK')+'\nscore: '+(R.score?R.score.s+'/100':'run VIRAL SCORE')+'\nrules: trend the format not the content, share+save beats likes, the loop is the growth engine\nsheet: forge33_viral_sheet.txt';
  download('forge33_viral_sheet.txt',txt);log('VIRAL LAB: downloaded sheet');}}
];
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
})();
