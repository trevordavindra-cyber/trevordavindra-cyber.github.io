'use strict';
(function(){
  if(window.__tk2up88){return;}
  window.__tk2up88=true;
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
  cards.forEach(function(c){if(c.innerText.includes('TREND LAB')&&!c.querySelector('#f88b1')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='ANALYTICS LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
  var R=window.__tk2analytics=window.__tk2analytics||{};
  var tot=function(){var t=0;clips.forEach(function(c){var d=(parseFloat(c.end)-parseFloat(c.start))||0;if(d>0)t+=d/(parseFloat(c.speed)||1);});return t;};
  var defs=[
{ id:'f88b1',label:'METRICS MAP',handler:function(){log('ANALYTICS LAB: metrics map - in the first 48 hours only three numbers matter: watch-through rate, saves, and shares | likes are the weakest signal, the feed mostly ignores them | open analytics once at 24h and once at 48h, not every hour, one hour of data means nothing | write all three down per video or the pattern never shows');}},
{ id:'f88b2',label:'WATCH THROUGH',handler:function(){var t=tot();R.runtime=t.toFixed(0);log('ANALYTICS LAB: watch-through - your '+t.toFixed(0)+'s runtime needs a '+Math.max(40,Math.min(80,Math.round(110-t/2)))+'% completion to hit the for-you page hard | under 40% the cut is too long or the hook too slow | check the retention graph, the exact second viewers bail is the scene to cut or reorder | a 15s video lives or dies on one drop, a 60s video on five');}},
{ id:'f88b3',label:'SAVE SIGNAL',handler:function(){log('ANALYTICS LAB: save signal - saves are the strongest ranking signal on the platform, a save is a promise to come back | content that gets saved: checklists, recipes, tutorials, facts people want later | end every video with a reason to save it (pause here, save this list) and saves jump | 1 save is worth more than 10 likes for reach');}},
{ id:'f88b4',label:'SHARE LIFT',handler:function(){log('ANALYTICS LAB: share lift - a share is the loudest signal you can earn: someone risked their own feed on you | shares spike on surprise endings, strong opinions, and things that make the sender look smart | compare shares-to-likes per video, a ratio above 1 share per 50 likes is a format worth repeating | ask for the share only when the content earned it, begging kills it');}},
{ id:'f88b5',label:'RETENTION REPLAY',handler:function(){log('ANALYTICS LAB: retention replay - lay the live retention graph next to your retention map from the edit: every drop you predicted that showed up is a rule you keep, every drop you missed is a new rule | the first drop usually moves to the same timestamp each time you reuse the same hook style | cut that pattern before it becomes a habit, then re-test on the next upload | one honest replay teaches more than ten new tips');}},
{ id:'f88b6',label:'FIRST HOUR',handler:function(){log('ANALYTICS LAB: first hour - the first 60 minutes are a preview, not the verdict: steady feed pushes in hour one mean the test pool likes it | flat hour one with a spike at hour six means the algorithm is still hunting an audience, do not delete it | never delete a slow video inside 24h, later resurfaces happen constantly | one anomaly is noise, three videos in a row telling you the same thing is a trend');}},
{ id:'f88b7',label:'FAN CHECK',handler:function(){log('ANALYTICS LAB: fan check - split follower views from for-you views: over 70% for-you means the account is growing past its base, under 40% means the base is carrying it and new viewers never see it | a follower-heavy video that flops with strangers is nostalgia, not growth | watch what NEW viewers finish versus what your followers finish, the difference is your next content plan | follower comments flatter, stranger comments teach');}},
{ id:'f88b8',label:'DOUBLE DOWN',handler:function(){log('ANALYTICS LAB: double down - when a video outperforms, its topic, format, and hook are three separate winners you can borrow independently | remake the winner with a fresh angle within a week while the audience pool is warm | series work: part 2 rides the original for-you traffic and pulls viewers back to part 1 | never chase the lucky video, chase the repeatable parts of it');}},
{ id:'f88b9',label:'KILL LIST',handler:function(){log('ANALYTICS LAB: kill list - three videos in a row on one idea that all underperform means the idea is dead for your account, retire it for 60 days | formats that never crack 40% completion get cut from rotation | log every retired idea in the sheet so you never burn a week re-testing a corpse | killing fast is how small accounts grow, big accounts can afford experiments, you cannot yet');}},
{ id:'f88b10',label:'ANALYTICS SHEET .TXT',handler:function(){var txt='ANALYTICS LAB PLAN\nclips: '+clips.length+'\nruntime: '+tot().toFixed(0)+'s\ncompletion target: '+(R.runtime?'see log (runtime '+R.runtime+'s)':'see log')+'\nwatch for: watch-through, saves, shares (48h window)\nrepeat rules: save-worthy ending, share-earned ending, double down inside a week\nsteps: metrics map, watch through, save signal, share lift, retention replay, first hour, fan check, double down, kill list\nrule: three videos telling you the same thing is a trend, one is noise\ndownload: analytics_sheet.txt';download('analytics_sheet.txt',txt);log('ANALYTICS LAB: downloaded sheet');}}
];;
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
})();
