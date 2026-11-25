'use strict';
/* up98.js - FORGE 37 TEXT LAB (Nov 25 2026) v1
   10 on-screen text tools for ULTIMATE AI TIKTOK EDIT MAKER.
   Buttons r98b1-r98b10, guarded by window.__tk2up98. */
(function(){
  if(window.__tk2up98){return;}
  window.__tk2up98=true;
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
  cards.forEach(function(c){if(c.innerText.includes('RETENTION LAB')&&!c.querySelector('#r98b1')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='TEXT LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
  var T=window.__tk2txt=window.__tk2txt||{};
  var dur=function(c){var d=(parseFloat(c.end)-parseFloat(c.start))||0;if(d>0)d=d/(parseFloat(c.speed)||1);return d;};
  var tot=function(){var t=0;clips.forEach(function(c){t+=dur(c);});return t;};
  var defs=[
{ id:'r98b1',label:'TEXT SCAN',handler:function(){
  var words=clips.reduce(function(n,c){return n+((c.text||'').trim().split(/\s+/).filter(Boolean).length);},0);
  var chars=clips.reduce(function(n,c){return n+((c.text||'').length);},0);
  var longest=null,lc=0;
  clips.forEach(function(c,i){var L=(c.text||'').length;if(L>lc){lc=L;longest=i;}});
  T.scan={words:words,chars:chars,longest:longest!==null?('clip '+(longest+1)+' at '+lc+' chars'):''};
  log('TEXT LAB: scan '+words+' words across '+clips.length+' clips ('+chars+' chars) | longest text '+(T.scan.longest||'none'));
}},
{ id:'r98b2',label:'HOOK TEXT',handler:function(){
  T.hook='hook text: clip 1 gets ONE line, max 6 words, readable in under 1 second - state the payoff, never the topic ("this saves you $400/mo", not "lets talk savings")';
  log('TEXT LAB: '+T.hook);
}},
{ id:'r98b3',label:'KINETIC STYLE',handler:function(){
  T.kinetic='kinetic style: punch words in on the beat, one word at a time for the hook line, full line for explanations - scale from 100% to 110% on entry, never fade, motion holds the eye';
  log('TEXT LAB: '+T.kinetic);
}},
{ id:'r98b4',label:'FONT MIX',handler:function(){
  T.font='font mix: max 2 fonts per video - one heavy display font for hooks and payoffs, one clean sans for body lines - swap mid-video only at a scene break';
  log('TEXT LAB: '+T.font);
}},
{ id:'r98b5',label:'SAFE ZONE',handler:function(){
  T.safe='safe zone: keep all text inside the middle 80% width and below the top 12% - the username, caption and right rail eat the edges on every device';
  log('TEXT LAB: '+T.safe);
}},
{ id:'r98b6',label:'TEXT TIMING',handler:function(){
  var rows=clips.map(function(c,i){var d=dur(c);var w=(c.text||'').trim().split(/\s+/).filter(Boolean).length;var need=w*0.35;return 'clip '+(i+1)+': '+d.toFixed(1)+'s vs '+w+' words ('+(d>=need?'fits':'needs '+(need-d).toFixed(1)+'s more')+')';});
  T.timing={rows:rows,rule:'text timing: 0.35s per word minimum, cut words before you cut hold time'};
  log('TEXT LAB: timing | '+rows.join(' | ')+' | rule: 0.35s per word minimum');
}},
{ id:'r98b7',label:'CAPTION BURN',handler:function(){
  T.burn='caption burn: burned-in captions stay on every clip - 3 to 5 words per line, center-bottom inside the safe zone, drop punctuation, uppercase reads louder at small sizes';
  log('TEXT LAB: '+T.burn);
}},
{ id:'r98b8',label:'TEXT CONTRAST',handler:function(){
  T.contrast='text contrast: white text with a 2px black stroke or a 40% dark scrim behind it - plain white on bright footage disappears on phones in daylight';
  log('TEXT LAB: '+T.contrast);
}},
{ id:'r98b9',label:'TEXT SCORE',handler:function(){
  var s=100;
  var words=clips.reduce(function(n,c){return n+((c.text||'').trim().split(/\s+/).filter(Boolean).length);},0);
  if(!T.hook){s-=15;}
  if(!T.kinetic){s-=10;}
  if(!T.font){s-=10;}
  if(!T.safe){s-=10;}
  if(!T.timing){s-=15;}
  if(!T.burn){s-=10;}
  if(!T.contrast){s-=10;}
  if(clips.length>0&&words===0){s-=20;}
  s=Math.max(0,Math.min(100,s));
  T.score={s:s,fix:s<100?'run the missing TEXT LAB tools to close the gaps':''};
  log('TEXT LAB: TEXT SCORE '+s+'/100'+(T.score.fix?' ('+T.score.fix+')':''));
}},
{ id:'r98b10',label:'TEXT SHEET',handler:function(){
  var timing=(T.timing&&T.timing.rows)?T.timing.rows.join('\n'):'run TEXT TIMING';
  var txt='FORGE 37 TEXT LAB\nclips: '+clips.length+'\nruntime: '+tot().toFixed(0)+'s\nscan: '+(T.scan?T.scan.words+' words, '+T.scan.chars+' chars, longest '+(T.scan.longest||'none'):'run TEXT SCAN')+'\nhook text: '+(T.hook||'run HOOK TEXT')+'\nkinetic style: '+(T.kinetic||'run KINETIC STYLE')+'\nfont mix: '+(T.font||'run FONT MIX')+'\nsafe zone: '+(T.safe||'run SAFE ZONE')+'\ntext timing:\n  '+timing.replace(/\n/g,'\n  ')+'\ncaption burn: '+(T.burn||'run CAPTION BURN')+'\ntext contrast: '+(T.contrast||'run TEXT CONTRAST')+'\nscore: '+(T.score?T.score.s+'/100':'run TEXT SCORE')+'\nrules: the hook line sells the payoff in 6 words, 0.35s per word is the floor, the safe zone is the middle 80%\nsheet: forge37_text_sheet.txt';
  log('TEXT LAB: sheet ready');
  download('forge37_text_sheet.txt',txt);
}}
  ];
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
  log('[tiktok2 up98.js v1] text lab loaded');
})();
