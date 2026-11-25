'use strict';
(function(){
  if(window.__tk2up86){return;}
  window.__tk2up86=true;
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
  cards.forEach(function(c){if(c.innerText.includes('RESEARCH LAB')&&!c.querySelector('#f86b1')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='CAPTION LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
  var R=window.__tk2cap=window.__tk2cap||{};
  var tot=function(){var t=0;clips.forEach(function(c){var d=(parseFloat(c.end)-parseFloat(c.start))||0;if(d>0)t+=d/(parseFloat(c.speed)||1);});return t;};
  var wps=function(){var w=0;clips.forEach(function(c){var s=(c.script||'').split(/\s+/).filter(Boolean).length;w+=s;});var t=tot();return t>0?w/t:0;};
  var defs=[
{ id:'f86b1',label:'CAPTION STYLE',handler:function(){var styles=['word-by-word karaoke (one word at a time, biggest reach)','two-word pop (pairs, punchy, cleanest read)','line-by-line (3-5 words per line, easiest to skim)','auto-translate style (robotic, used only as a joke format)'];var pick=styles[clips.length%styles.length];R.style=pick;log('CAPTION LAB: caption style - '+pick+' | word-by-word holds eyes longest, two-word pop is the safe default for mixed content | stick with one style per account so the feed recognizes you');}},
{ id:'f86b2',label:'SAFE ZONES',handler:function(){log('CAPTION LAB: safe zones - captions live in the center band of the screen, never the bottom 20% (UI covers it) or top 15% (username overlays it) | max 3 words per row | check every export on a phone, desktop previews lie about the bottom edge');}},
{ id:'f86b3',label:'HOOK CAPTION',handler:function(){log('CAPTION LAB: hook caption - the first 7 words on screen ARE the hook even before audio starts | put them center, all caps, high contrast | never start with a lowercase filler word ("so", "and") | the first row should read like a headline, not a sentence');}},
{ id:'f86b4',label:'TIMING SYNC',handler:function(){var w=wps().toFixed(1);log('CAPTION LAB: timing sync - '+clips.length+' clips, '+w+' words/sec average | captions should land within 80ms of the spoken word, viewers notice late captions and scroll | fast sections get single-word steps, slow sections get pairs | never let one caption survive a cut');}},
{ id:'f86b5',label:'READ SPEED',handler:function(){log('CAPTION LAB: read speed - 2.5 to 3.3 words per second is the readable band | under 2.5 feels slow and boring, over 3.3 viewers skip reading | count your words per clip: if a clip is 5s it holds 15 words max | cut adjectives before cutting facts');}},
{ id:'f86b6',label:'COLOR CONTRAST',handler:function(){var combos=['white text, black outline (the default that always works)','yellow text, black outline (highest pop for money/success topics)','white text, colored keyword highlight (one keyword per line, brand color)','black text, white box (reads as official/news)'];var pick=combos[clips.length%combos.length];R.color=pick;log('CAPTION LAB: color contrast - '+pick+' | test on both a dark scene and a bright scene, a combo that wins on one can vanish on the other | outline weight 3px minimum, thin outlines die on busy backgrounds');}},
{ id:'f86b7',label:'KEYWORD POP',handler:function(){log('CAPTION LAB: keyword pop - one word per caption line gets the emphasis treatment: bigger, bolder, or colored | pick the word that carries the claim ("illegal", "$0", "banned") | never highlight two words in one line, the emphasis cancels out | this alone lifts watch-through on list formats');}},
{ id:'f86b8',label:'SILENT MODE',handler:function(){log('CAPTION LAB: silent mode - up to 40% of feed scrolls happen muted, so your captions must carry the full story alone | test: play your export muted, if the story breaks anywhere, fix it there | sound-on viewers should get MORE than caption viewers, never less (sfx, music drops stay audio-only)');}},
{ id:'f86b9',label:'FONT CHECK',handler:function(){log('CAPTION LAB: font check - one bold sans font for captions, one display font for the hook, stop there | avoid fonts with thin strokes at small sizes, they disappear on phones | export one frame, view it at thumbnail size, if you cannot read it in 0.5s the font is wrong');}},
{ id:'f86b10',label:'CAPTION SHEET .TXT',handler:function(){var txt='CAPTION LAB PLAN\nclips: '+clips.length+'\nruntime: '+tot().toFixed(0)+'s\nwords/sec: '+wps().toFixed(1)+'\nstyle: '+(R.style||'see log')+'\ncontrast: '+(R.color||'see log')+'\nsteps: caption style, safe zones, hook caption, timing sync, read speed, color contrast, keyword pop, silent mode, font check\nrule: captions carry the story muted\ndownload: caption_sheet.txt';download('caption_sheet.txt',txt);log('CAPTION LAB: downloaded sheet');}}
];;
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
})();