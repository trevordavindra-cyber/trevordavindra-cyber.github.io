'use strict';
(function(){
  if(window.__tk2up87){return;}
  window.__tk2up87=true;
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
  cards.forEach(function(c){if(c.innerText.includes('CAPTION LAB')&&!c.querySelector('#f87b1')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='TREND LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
  var R=window.__tk2trend=window.__tk2trend||{};
  var tot=function(){var t=0;clips.forEach(function(c){var d=(parseFloat(c.end)-parseFloat(c.start))||0;if(d>0)t+=d/(parseFloat(c.speed)||1);});return t;};
  var stage=function(){var n=clips.length;return n<4?'early ride (trend under a week old, fastest growth)':'mature ride (trend mid-cycle, needs your own spin)';};
  var defs=[
{ id:'f87b1',label:'TREND CLOCK',handler:function(){var s=stage();R.stage=s;log('TREND LAB: trend clock - '+clips.length+' clips says ride the '+s+' | a trend has 3 windows: first 3 days (biggest reach, biggest risk), days 4-10 (sweet spot, format proven, not saturated), after day 10 (only ride with a hard twist) | never chase a trend older than 2 weeks without a reason');}},
{ id:'f87b2',label:'SOUND TREND',handler:function(){log('TREND LAB: sound trend - trending audio carries discovery: the sound page is its own feed | pick a sound 3-7 days old with rising uses, not one already at millions | keep your voice track loud under it, sound-first videos that mute the VO die in retention | save 3 candidate sounds per script before editing');}},
{ id:'f87b3',label:'FORMAT TREND',handler:function(){var formats=['list format (3-7 items, watch-through machine)','im definitely doing X so I can stop Y confession format','green screen react to one screenshot','tutorial but with the reveal at the end (result-first)'];var pick=formats[clips.length%formats.length];R.format=pick;log('TREND LAB: format trend - '+pick+' | formats live longer than topics, a format can ride for months | match the format to your niche or it reads as forced | one format per video, mixing two kills both');}},
{ id:'f87b4',label:'NICHE MIX',handler:function(){log('TREND LAB: niche mix - 70/30 rule: 70% evergreen niche content your account exists for, 30% trend rides | all-trend accounts confuse the algorithm about who to show you to | a trend ride still has to connect to your niche in the first 2 seconds or the followers it brings never convert | plan trend rides in batches so the account stays coherent');}},
{ id:'f87b5',label:'TIMING WINDOW',handler:function(){log('TREND LAB: timing window - post when your audience is scrolling, not when you finish editing | for US audiences the two big windows are 7-9am and 6-10pm local | a video that posts at 3am buries itself before anyone sees it | schedule, do not sit on finished edits, a trend ride loses value every hour it waits');}},
{ id:'f87b6',label:'HOOK TREND',handler:function(){log('TREND LAB: hook trend - this months strongest hooks: the paused-frame cold open (action mid-motion, no intro), the number-countdown title card, and the wait for it flip | hooks trend faster than sounds, refresh yours weekly | test 2 hooks per script on friends before posting, the one that gets them to ask what happens wins');}},
{ id:'f87b7',label:'SPIN RULE',handler:function(){log('TREND LAB: spin rule - never copy a trend frame for frame, the feed punishes clones and so do viewers | the spin: take the structure, swap the niche, flip the ending | if the trend is a recipe reveal, make it a money reveal, same beats new skin | your spin is what makes the ride yours, unspun trends are rented reach');}},
{ id:'f87b8',label:'DEAD TREND',handler:function(){log('TREND LAB: dead trend - kill signals: the sound has more uses than views (spam flood), comment sections are full of dont do this trend, big brands have posted their version | once a brand rides it, the audience is done | a dead trend still teaches you the format, bank the structure and move on');}},
{ id:'f87b9',label:'TREND SCORE',handler:function(){var s=stage().indexOf('early')>-1?8:6;var sc=Math.min(10,3+Math.round((tot()>0?tot():20)/20)+s/4);R.score=sc.toFixed(1);log('TREND LAB: trend score - this script rides at '+sc.toFixed(1)+'/10 | the score weighs trend freshness against script fit: a fresh trend with a weak-fitting script still underperforms a mature trend with a perfect fit | anything under 6 gets rewritten into evergreen instead');}},
{ id:'f87b10',label:'TREND SHEET .TXT',handler:function(){var txt='TREND LAB PLAN\nclips: '+clips.length+'\nruntime: '+tot().toFixed(0)+'s\nstage: '+(R.stage||stage())+'\nformat: '+(R.format||'see log')+'\ntrend score: '+(R.score||'see log')+'\nsteps: trend clock, sound trend, format trend, niche mix, timing window, hook trend, spin rule, dead trend, trend score\nrule: 70/30 niche mix, spin every trend before you ride it\ndownload: trend_sheet.txt';download('trend_sheet.txt',txt);log('TREND LAB: downloaded sheet');}}
];;
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
})();
