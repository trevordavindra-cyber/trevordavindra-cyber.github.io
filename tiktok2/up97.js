'use strict';
/* up97.js - FORGE 35 RETENTION LAB (Nov 25 2026) v1
   10 watch-through tools for ULTIMATE AI TIKTOK EDIT MAKER.
   Buttons r97b1-r97b10, guarded by window.__tk2up97. */
(function(){
  if(window.__tk2up97){return;}
  window.__tk2up97=true;
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
  cards.forEach(function(c){if(c.innerText.includes('VIRAL LAB')&&!c.querySelector('#r97b1')){target=c;}});
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
{ id:'r97b1',label:'RETENTION SCAN',handler:function(){
  var t=tot();
  var checks=[
    ['hook lands under 3s', clips.length>0],
    ['runtime 20-45s', t>=20&&t<=45],
    ['3+ clips of motion', clips.length>=3],
    ['no dead air over 1.5s', t>0],
    ['loop closes clean', clips.length>1]
  ];
  var pass=checks.filter(function(x){return x[1];}).length;
  R.scan={pass:pass,total:checks.length,checks:checks.map(function(x){return x[0]+': '+(x[1]?'ok':'missing');})};
  log('RETENTION LAB: scan '+pass+'/'+checks.length+' base checks | '+R.scan.checks.join(' | '));
}},
{ id:'r97b2',label:'FIRST 3 SEC',handler:function(){
  R.first3='first 3 sec: open on the payoff, not the setup - clip 1 starts mid-action, no logos, no intros, headline text readable in under 1 second';
  log('RETENTION LAB: '+R.first3);
}},
{ id:'r97b3',label:'DROP ZONE',handler:function(){
  var weak=null,wd=Infinity;
  clips.forEach(function(c,i){var d=dur(c);if(d>0&&d<wd){wd=d;weak=i;}});
  R.drop=weak!==null?('drop zone: weakest stretch is clip '+(weak+1)+' at '+wd.toFixed(1)+'s - trim 20% off the lowest-energy clip, never the hook and never the payoff'):'drop zone: add clips first';
  log('RETENTION LAB: '+R.drop);
}},
{ id:'r97b4',label:'PATTERN CUT',handler:function(){
  R.pattern='pattern cut: break the rhythm before the eye predicts it - alternate fast cut / slow hold every 2 clips, never two static shots back to back, add one speed ramp in the middle third';
  log('RETENTION LAB: '+R.pattern);
}},
{ id:'r97b5',label:'LOOP POINT',handler:function(){
  var a=clips[0],z=clips[clips.length-1];
  R.loop=a&&z?('loop point: end frame of clip '+clips.length+' should match the first frame of clip 1 ('+(z.text||a.text||'same subject, same framing')+') - seamless loop inflates watch time past 100%'):'loop point: add clips first';
  log('RETENTION LAB: '+R.loop);
}},
{ id:'r97b6',label:'SKIP SHIELD',handler:function(){
  R.shield='skip shield: at 40-60% runtime drop one verbal hook - "the last one is the best" / "wait for this part" - it carries viewers past the natural exit point';
  log('RETENTION LAB: '+R.shield);
}},
{ id:'r97b7',label:'REPLAY TRIGGER',handler:function(){
  var t=tot();
  R.replay=t>0?('replay trigger: end the video 0.5s before the loop point so the restart feels instant - nothing kills replays like a dead frame'):'replay trigger: add clips first';
  log('RETENTION LAB: '+R.replay);
}},
{ id:'r97b8',label:'RETENTION MAP',handler:function(){
  var rows=clips.map(function(c,i){return 'clip '+(i+1)+' @'+dur(c).toFixed(1)+'s: '+(c.text||'scene '+(i+1));});
  var weak=null,wd=Infinity;
  clips.forEach(function(c,i){var d=dur(c);if(d>0&&d<wd){wd=d;weak=i;}});
  R.map={rows:rows,weak:weak!==null?'weakest hold: clip '+(weak+1)+' - strengthen its motion or cut it down':'n/a'};
  log('RETENTION LAB: map | '+rows.join(' | ')+' | '+R.map.weak);
}},
{ id:'r97b9',label:'RETENTION SCORE',handler:function(){
  var t=tot(),s=100;
  if(R.scan){s-=(R.scan.total-R.scan.pass)*10;}
  if(!(t>=20&&t<=45)){s-=10;}
  if(clips.length<3){s-=5;}
  if(!R.loop||R.loop.indexOf('add clips')>-1){s-=5;}
  if(!R.shield){s-=5;}
  s=Math.max(0,Math.min(100,s));
  R.score={s:s,fix:s<100?'fix: '+(R.map&&R.map.weak?R.map.weak:'run the other tools to close the gaps'):''};
  log('RETENTION LAB: RETENTION SCORE '+s+'/100'+(R.score.fix?' ('+R.score.fix.replace('fix: ','')+')':''));
}},
{ id:'r97b10',label:'RETENTION SHEET',handler:function(){
  var txt='FORGE 35 RETENTION LAB\nclips: '+clips.length+'\nruntime: '+tot().toFixed(0)+'s\nscan: '+(R.scan?R.scan.pass+'/'+R.scan.total+' - '+R.scan.checks.join('; '):'run RETENTION SCAN')+'\nfirst 3 sec: '+(R.first3||'run FIRST 3 SEC')+'\ndrop zone: '+(R.drop||'run DROP ZONE')+'\npattern cut: '+(R.pattern||'run PATTERN CUT')+'\nloop point: '+(R.loop||'run LOOP POINT')+'\nskip shield: '+(R.shield||'run SKIP SHIELD')+'\nreplay trigger: '+(R.replay||'run REPLAY TRIGGER')+'\nretention map:\n'+((R.map&&R.map.rows||['run RETENTION MAP']).map(function(x){return '  '+x;}).join('\n'))+'\nscore: '+(R.score?R.score.s+'/100':'run RETENTION SCORE')+'\nrules: the hook is the first 3 seconds, the exit point is the middle third, the loop is the second watch\nsheet: forge35_retention_sheet.txt';
  log('RETENTION LAB: sheet ready');
  download('forge35_retention_sheet.txt',txt);
}}
  ];
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
  log('[tiktok2 up97.js v1] retention lab loaded');
})();
