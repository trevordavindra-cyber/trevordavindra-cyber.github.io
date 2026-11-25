'use strict';
(function(){
  if(window.__tk2up89){return;}
  window.__tk2up89=true;
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
  cards.forEach(function(c){if(c.innerText.includes('ANALYTICS LAB')&&!c.querySelector('#f89b1')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='TEMPLATE LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
  var R=window.__tk2template=window.__tk2template||{};
  var dur=function(c){var d=(parseFloat(c.end)-parseFloat(c.start))||0;if(d>0)d=d/(parseFloat(c.speed)||1);return d;};
  var tot=function(){var t=0;clips.forEach(function(c){t+=dur(c);});return t;};
  var txtOf=function(c){return (c.caption||c.text||c.title||'').toString();};
  var defs=[
{ id:'f89b1',label:'TEMPLATE MAP',handler:function(){log('TEMPLATE LAB: template map - ten proven structures: listicle, story arc, tutorial, myth bust, ranking, pov, q&a, before/after, challenge, thumbnail-first | pick by content type: facts get listicle or myth bust, journeys get story arc, skills get tutorial, opinions get ranking or pov | every template still starts with the same 3-second job: stop the scroll | rotate two or three templates, never one, or the feed gets bored before your audience does');}},
{ id:'f89b2',label:'LISTICLE',handler:function(){R.template='listicle';log('TEMPLATE LAB: listicle - rebuild as "5 things nobody tells you about your topic": one number on screen per beat, caption starts with the number | count down from 5 so the best item lands last, viewers stay for the payoff | each item gets one scene, 2-4s max, cut mid-motion into the next | your '+clips.length+' scenes map cleanly to a 5-item list, merge leftovers into the bonus item');}},
{ id:'f89b3',label:'STORY ARC',handler:function(){var order=clips.map(function(c,i){return {i:i,d:dur(c)};}).sort(function(a,b){return b.d-a.d;});R.arc='hook: scene '+(order[0]?order[0].i+1:'1');log('TEMPLATE LAB: story arc - open on your longest scene, it is the one with the most to show ('+R.arc+') | structure: hook (3s), setup (5s), rising tension, twist at 60% mark, payoff last | the twist is the moment you tell them what they believed is wrong | end on the payoff, never on a summary, summaries kill replays');}},
{ id:'f89b4',label:'TUTORIAL',handler:function(){R.template='tutorial';log('TEMPLATE LAB: tutorial - show the finished result in the first 2s, then the steps, then the result again at the end | every step gets its own scene with the action happening on screen, not described on screen | add a numbered overlay per step so mute viewers follow | total runtime sweet spot for tutorial shorts is 20-35s, yours is '+tot().toFixed(0)+'s');}},
{ id:'f89b5',label:'MYTH BUST',handler:function(){R.template='mythbust';log('TEMPLATE LAB: myth bust - scene 1 states the myth as a fact ("you should always...") and scene 2 kills it ("actually, no") | the pattern is promise a belief, then break it, that gap is the retention spike | prove the bust with one visual, not three sentences | close with the corrected rule so the save-worthy takeaway is one line');}},
{ id:'f89b6',label:'RANKING',handler:function(){var order=clips.map(function(c,i){return {i:i,d:dur(c),t:txtOf(c)};}).sort(function(a,b){return b.d-a.d;});var seq=order.map(function(o,n){return (n+1)+':'+(o.i+1);}).join(' ');R.ranking=seq;log('TEMPLATE LAB: ranking - rank scenes longest-first so the strongest footage holds rank 1 | order now: '+seq+' | narrate the ranking out loud ("number 3 is overrated, number 1 changed everything") | controversial order drives comments: the ranking people argue about is the ranking that gets shared');}},
{ id:'f89b7',label:'POV REWRITE',handler:function(){R.template='pov';var first=clips.map(function(c,i){return 's'+(i+1)+': '+(txtOf(c)?'"'+txtOf(c)+'" -> first person, present tense':'scene '+(i+1)+' -> first person, present tense');}).join(' | ');log('TEMPLATE LAB: pov rewrite - captions move to first person present tense so the viewer IS the subject: '+first+' | "I tested" beats "people tested", "here is what I found" beats "here is what was found" | pov formats hold attention because the viewer cannot look away from a story they are inside');}},
{ id:'f89b8',label:'Q&A SPLIT',handler:function(){R.template='qna';log('TEMPLATE LAB: q&a split - half the video reads the question on screen, half answers it fast | put the question in the caption of scene 1 and the answer starts at the 40% mark, the wait is the hook | answer in under 10s, then add one bonus fact nobody asked for, that extra is what earns the follow | screen-record the question as a comment screenshot for extra comment-section energy');}},
{ id:'f89b9',label:'THUMB STOP',handler:function(){var t=tot();R.thumb=t.toFixed(0);log('TEMPLATE LAB: thumb stop - the thumbnail and the first frame must promise the same thing the video pays off | best thumb frames: your longest scene ('+t.toFixed(0)+'s runtime suggests it carries the video) | text on thumb: 3 words max, one number beats three adjectives | a face mid-reaction outperforms a clean product shot for stop-rate, and the same frame should be scene 1 so the click is never a bait');}},
{ id:'f89b10',label:'TEMPLATE SHEET .TXT',handler:function(){var txt='TEMPLATE LAB PLAN\nclips: '+clips.length+'\nruntime: '+tot().toFixed(0)+'s\napplied template: '+(R.template||'pick from map')+'\nranked order: '+(R.ranking||'run RANKING')+'\narc hook: '+(R.arc||'run STORY ARC')+'\ntemplates: listicle, story arc, tutorial, myth bust, ranking, pov, q&a, before/after, challenge, thumbnail-first\nrules: hook in 3s, one idea per scene, payoff last, rotate two or three templates\ndownload: forge19_template_sheet.txt';download('forge19_template_sheet.txt',txt);log('TEMPLATE LAB: downloaded sheet');}}
];;
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
})();
