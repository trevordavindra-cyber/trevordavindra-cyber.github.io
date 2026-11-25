'use strict';
/* up99.js - FORGE 39 COLOR LAB (Nov 25 2026) v1
   10 color grading tools for ULTIMATE AI TIKTOK EDIT MAKER.
   Buttons r99b1-r99b10, guarded by window.__tk2up99. */
(function(){
  if(window.__tk2up99){return;}
  window.__tk2up99=true;
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
  cards.forEach(function(c){if(c.innerText.includes('TEXT LAB')&&!c.querySelector('#r99b1')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='COLOR LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
  var T=window.__tk2col=window.__tk2col||{};
  var dur=function(c){var d=(parseFloat(c.end)-parseFloat(c.start))||0;if(d>0)d=d/(parseFloat(c.speed)||1);return d;};
  var tot=function(){var t=0;clips.forEach(function(c){t+=dur(c);});return t;};
  var defs=[
{ id:'r99b1',label:'COLOR SCAN',handler:function(){
  var graded=clips.filter(function(c){return c.tint||c.filter||c.grade;}).length;
  T.scan={clips:clips.length,graded:graded};
  log('COLOR LAB: scan '+clips.length+' clips across '+tot().toFixed(0)+'s | '+graded+' carry a grade or tint already'+(graded===0?' - none graded yet, that is the pass this lab fixes':''));
}},
{ id:'r99b2',label:'PALETTE PICK',handler:function(){
  T.palette='palette pick: pull 3 colors off one reference frame, then hold the 60/30/10 split - 60% base, 30% support, 10% accent for the hook moment only';
  log('COLOR LAB: '+T.palette);
}},
{ id:'r99b3',label:'GRADE STYLE',handler:function(){
  T.grade='grade style: match the grade to the mood - cool for drama, warm for cozy, high contrast for energy - and pick ONE style for the whole video, never per-clip looks';
  log('COLOR LAB: '+T.grade);
}},
{ id:'r99b4',label:'SKIN TONE',handler:function(){
  T.skin='skin tone: fix skin in the midtones, not the highlights - keep skin just a touch warm, never oversaturated, because the eye forgives a dark clip but never an orange face';
  log('COLOR LAB: '+T.skin);
}},
{ id:'r99b5',label:'CONTRAST CURVE',handler:function(){
  T.curve='contrast curve: one gentle S-curve does more than 10 sliders - lift shadows a little, roll the highlights off, never crush the blacks to zero or detail dies';
  log('COLOR LAB: '+T.curve);
}},
{ id:'r99b6',label:'VINTAGE LOOK',handler:function(){
  T.vintage='vintage look: drop saturation about 20%, add a light sepia wash, ease the contrast down and lift the blacks a hair - that is the aged film vibe without mud';
  log('COLOR LAB: '+T.vintage);
}},
{ id:'r99b7',label:'NIGHT MODE',handler:function(){
  T.night='night mode: lift the shadows instead of crushing them, pull highlights down, and keep a little blue in the dark - pure black clips band and posterize on phone screens';
  log('COLOR LAB: '+T.night);
}},
{ id:'r99b8',label:'COLOR SYNC',handler:function(){
  T.sync='color sync: grade every clip from the SAME base - one white balance or one LUT across the whole timeline, matched at the cut, so no clip pops when the scene changes';
  log('COLOR LAB: '+T.sync);
}},
{ id:'r99b9',label:'COLOR SCORE',handler:function(){
  var s=100;
  if(!T.palette){s-=10;}
  if(!T.grade){s-=10;}
  if(!T.skin){s-=10;}
  if(!T.curve){s-=10;}
  if(!T.vintage){s-=5;}
  if(!T.night){s-=5;}
  if(!T.sync){s-=15;}
  if(clips.length>0&&T.scan&&T.scan.graded===0){s-=20;}
  s=Math.max(0,Math.min(100,s));
  T.score={s:s,fix:s<100?'run the missing COLOR LAB tools to close the gaps':''};
  log('COLOR LAB: COLOR SCORE '+s+'/100'+(T.score.fix?' ('+T.score.fix+')':''));
}},
{ id:'r99b10',label:'COLOR SHEET',handler:function(){
  var txt='FORGE 39 COLOR LAB\nclips: '+clips.length+'\nruntime: '+tot().toFixed(0)+'s\nscan: '+(T.scan?(T.scan.graded+' of '+T.scan.clips+' clips carry a grade or tint'):'run COLOR SCAN')+'\npalette pick: '+(T.palette||'run PALETTE PICK')+'\ngrade style: '+(T.grade||'run GRADE STYLE')+'\nskin tone: '+(T.skin||'run SKIN TONE')+'\ncontrast curve: '+(T.curve||'run CONTRAST CURVE')+'\nvintage look: '+(T.vintage||'run VINTAGE LOOK')+'\nnight mode: '+(T.night||'run NIGHT MODE')+'\ncolor sync: '+(T.sync||'run COLOR SYNC')+'\nscore: '+(T.score?T.score.s+'/100':'run COLOR SCORE')+'\nrules: one grade style for the whole video, skin fixed in the midtones, never crush blacks to zero\nsheet: forge39_color_sheet.txt';
  log('COLOR LAB: sheet ready');
  download('forge39_color_sheet.txt',txt);
}}
  ];
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
  log('[tiktok2 up99.js v1] color lab loaded');
})();
