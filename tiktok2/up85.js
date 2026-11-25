'use strict';
(function(){
  if(window.__tk2up85){return;}
  window.__tk2up85=true;
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
  cards.forEach(function(c){if(c.innerText.includes('RETENTION LAB')&&!c.querySelector('#f85b1')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='RESEARCH LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
  var R=window.__tk2res=window.__tk2res||{};
  var tot=function(){var t=0;clips.forEach(function(c){var d=(parseFloat(c.end)-parseFloat(c.start))||0;if(d>0)t+=d/(parseFloat(c.speed)||1);});return t;};
  var defs=[
{ id:'f85b1',label:'NICHE MAP',handler:function(){var n=clips.length;var niches=['mystery/history','money/side hustles','tech/AI news','true crime','space/science','gaming secrets','psychology facts','fitness myths'];var pick=niches[n%niches.length];var sub=['beginner myth-busting','insider list format','story-driven case file','contrarian take','deep-dive explainer'][n%5];log('RESEARCH LAB: niche map - '+pick+' | sub-angle '+sub+' | '+n+' clips, '+tot().toFixed(0)+'s runtime | one niche for 30 days before judging it');}},
{ id:'f85b2',label:'TOPIC GRID',handler:function(){var seeds=['nobody explains','what they hid','the real reason','it was banned','the $0 version','before it was famous','the 1% rule','it almost failed'];var out=seeds.map(function(s,i){return (i+1)+') '+s+' [your topic]';});log('RESEARCH LAB: topic grid - '+out.join(' | '));}},
{ id:'f85b3',label:'COMMENT MINER',handler:function(){log('RESEARCH LAB: comment miner - read the top 20 comments on the 3 biggest videos in your niche | mine: questions nobody answered, arguments in threads, "part 2?" requests | every unanswered question is a video, arguments are engagement bait, part-2 asks are free demand');}},
{ id:'f85b4',label:'SEARCH TERMS',handler:function(){log('RESEARCH LAB: search terms - type your topic in the search bar and screenshot the autocomplete | those are real queries | make one video per autocomplete line, exact phrase in the title and first line');}},
{ id:'f85b5',label:'GAP FINDER',handler:function(){log('RESEARCH LAB: gap finder - sort your niche by most-viewed, ignore the top 10, study positions 50-200 | big views with weak editing = your gap | if position 50 looks better made than yours, pick a narrower sub-angle');}},
{ id:'f85b6',label:'SOURCE VET',handler:function(){log('RESEARCH LAB: source vet - before a fact ships: 1) who first said it, 2) does a primary source agree, 3) when was it said (stale stat = dead video) | if you cannot find a primary source, cut the fact or say "reported"');}},
{ id:'f85b7',label:'STAT CHECK',handler:function(){log('RESEARCH LAB: stat check - numbers viewers screenshot and argue about get the most comments, so verify any number twice | round numbers ("$1 million") read as fake, odd numbers ("$947,000") read as real | always show the year next to a stat');}},
{ id:'f85b8',label:'ANGLE SPIN',handler:function(){var angles=['the money angle (what it costs, who profits)','the timeline angle (how it got here step by step)','the failure angle (what went wrong and why)','the comparison angle (us vs them, old vs new)','the warning angle (what happens if you do this)'];log('RESEARCH LAB: angle spin - '+angles.map(function(a,i){return (i+1)+') '+a;}).join(' | '));}},
{ id:'f85b9',label:'TREND ORIGIN',handler:function(){log('RESEARCH LAB: trend origin - find the FIRST video that started the format you are copying (search the hook line, sort by oldest) | study what it did that the copies dropped | being the 10th copy of a copy is the fastest way to zero views');}},
{ id:'f85b10',label:'RESEARCH SHEET .TXT',handler:function(){var txt='RESEARCH LAB PLAN\nclips: '+clips.length+'\nruntime: '+tot().toFixed(0)+'s\nniche: '+(R.niche||'see log')+'\nsteps: niche map, topic grid, comment miner, search terms, gap finder, source vet, stat check, angle spin, trend origin\nrule: research before edit, one niche 30 days\ndownload: research_sheet.txt';download('research_sheet.txt',txt);log('RESEARCH LAB: downloaded sheet');}}
];;
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
})();