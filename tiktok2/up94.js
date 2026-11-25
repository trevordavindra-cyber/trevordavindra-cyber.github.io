'use strict';
/* up94.js - FORGE 29 TITLE LAB (Nov 25 2026) v1
   10 title/naming tools for ULTIMATE AI TIKTOK EDIT MAKER.
   Buttons f94b1-f94b10, guarded by window.__tk2up94. */
(function(){
  if(window.__tk2up94){return;}
  window.__tk2up94=true;
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
  cards.forEach(function(c){if(c.innerText.includes('SOUND LAB')&&!c.querySelector('#f93b1')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='TITLE LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
  var R=window.__tk2title=window.__tk2title||{};
  var dur=function(c){var d=(parseFloat(c.end)-parseFloat(c.start))||0;if(d>0)d=d/(parseFloat(c.speed)||1);return d;};
  var tot=function(){var t=0;clips.forEach(function(c){t+=dur(c);});return t;};
  var firstTopic=function(){
    var words=[];
    clips.slice(0,3).forEach(function(c){
      var t=(c.label||'').trim();
      if(t&&t!=='clip'&&words.length<4) words.push(t.replace(/[^\w\s'-]/g,''));
    });
    return words.join(' ').trim()||'your topic';
  };
  var defs=[
{ id:'f94b1',label:'TITLE SPARK',handler:function(){
  var topic=firstTopic();
  R.spark=[
    topic+' but nobody tells you this part',
    'the '+topic+' rule that changed everything',
    'why '+topic+' works (and when it fails)',
    topic+': 3 things pros do differently',
    'i tested '+topic+' so you don\u2019t have to'
  ];
  log('TITLE LAB: 5 title sparks for "'+topic+'" -> '+R.spark.join(' | '));
}},
{ id:'f94b2',label:'TITLE A/B',handler:function(){
  var topic=firstTopic();
  var a=topic+' but nobody tells you this part';
  var b='the '+topic+' rule that changed everything';
  R.ab={a:a,b:b};
  var win=a.length<=b.length?a:b;
  log('TITLE LAB: A/B -> A "'+a+'" ('+a.length+'ch) vs B "'+b+'" ('+b.length+'ch) | winner: "'+win+'" (shorter wins when both front-load the keyword) | post A first, swap to B after 48h if ctr lags');
}},
{ id:'f94b3',label:'HOOK TITLE',handler:function(){
  var c1=clips[0];
  var hookLine=c1?('scene 1: '+((c1.label||'clip 1').trim())+' ('+dur(c1).toFixed(1)+'s)'):'no clips yet';
  R.hook='title must promise what scene 1 delivers: open on the payoff, title says the payoff, nothing in between';
  log('TITLE LAB: hook title - '+hookLine+' | rule: '+R.hook);
}},
{ id:'f94b4',label:'LENGTH CHECK',handler:function(){
  var topic=firstTopic();
  var t=R.spark?R.spark[0]:topic+' explained';
  R.length={chars:t.length,ok:t.length<=60};
  log('TITLE LAB: length check "'+t+'" = '+t.length+' chars, '+(t.length<=60?'safe':'too long, cut to 60')+' | rules: first ~40 chars show in feed, front-load the keyword inside the first 30, cut filler words (that/very/really) before cutting the hook');
}},
{ id:'f94b5',label:'TITLE EMOJI',handler:function(){
  R.emoji='max 2 emoji, one max at the very start, none inside the promise | emoji that work: eyes, fire, skull, chart | emoji that kill: sparkles spam, full emoji sentences, brand logos';
  log('TITLE LAB: emoji rules - '+R.emoji);
}},
{ id:'f94b6',label:'TITLE SEO',handler:function(){
  var topic=firstTopic();
  R.seo='front-load "'+topic+'" in the first 3 words, keep it a natural phrase (search reads phrases not keywords), add ONE related term (how/why/best), never repeat the keyword twice';
  log('TITLE LAB: seo pass - '+R.seo);
}},
{ id:'f94b7',label:'TITLE VARIANTS',handler:function(){
  var topic=firstTopic();
  R.variants={
    listicle:'5 '+topic+' mistakes costing you views',
    howto:'how to master '+topic+' in 30 seconds',
    question:'is '+topic+' actually worth it?',
    negative:'stop doing '+topic+' like this'
  };
  log('TITLE LAB: 4 variants -> listicle "'+R.variants.listicle+'" | howto "'+R.variants.howto+'" | question "'+R.variants.question+'" | negative "'+R.variants.negative+'"');
}},
{ id:'f94b8',label:'TITLE TEST',handler:function(){
  var t=(R.spark&&R.spark[0])||firstTopic()+' explained';
  var s=0;var notes=[];
  if(t.length<=60){s+=25;}else{notes.push('over 60 chars');}
  if(t.split(' ').length<=12){s+=15;}else{notes.push('over 12 words');}
  if(/\?|but|why|stop|nobody|secret|mistake/i.test(t)){s+=25;}else{notes.push('no curiosity gap');}
  if(!/\b(free|guaranteed|shocking|insane)\b/i.test(t)||/so you don/i.test(t)){s+=15;}else{notes.push('clickbait words');}
  if(/^[A-Z0-9 !?,.']+$/.test(t)){s-=10;}else{s+=10;}
  if(s<0)s=0;
  if(s>100)s=100;
  R.test={t:t,s:s,notes:notes};
  log('TITLE LAB: title test '+s+'/100 on "'+t+'"'+(notes.length?' | fix: '+notes.join(', ')+' | rescore clears to 100':' | ship it'));
}},
{ id:'f94b9',label:'TITLE PAIR',handler:function(){
  var topic=firstTopic();
  R.pair={title:(R.spark&&R.spark[0])||topic+' but nobody tells you this part',thumb:(topic.split(' ').slice(0,3).join(' ')+'??').toUpperCase()};
  log('TITLE LAB: pair -> title "'+R.pair.title+'" + thumb text "'+R.pair.thumb+'" (thumb says 3 words max, title carries the detail, they must not repeat each other)');
}},
{ id:'f94b10',label:'TITLE SHEET',handler:function(){
  var sp=R.spark||['run TITLE SPARK'];
  var v=R.variants||{listicle:'run TITLE VARIANTS'};
  var txt='FORGE 29 TITLE LAB\nclips: '+clips.length+'\nruntime: '+tot().toFixed(0)+'s\nsparks:\n'+sp.map(function(x,i){return '  '+(i+1)+'. '+x;}).join('\n')+'\na/b: '+(R.ab?('A "'+R.ab.a+'" vs B "'+R.ab.b+'"'):'run TITLE A/B')+'\nhook rule: '+(R.hook||'run HOOK TITLE')+'\nlength: '+(R.length?R.length.chars+' chars '+(R.length.ok?'safe':'too long'):'run LENGTH CHECK')+'\nemoji: '+(R.emoji||'run TITLE EMOJI')+'\nseo: '+(R.seo||'run TITLE SEO')+'\nvariants: '+(v.listicle?v.listicle:'run TITLE VARIANTS')+'\ntest: '+(R.test?R.test.s+'/100 on "'+R.test.t+'"':'run TITLE TEST')+'\npair: '+(R.pair?('title "'+R.pair.title+'" + thumb "'+R.pair.thumb+'"'):'run TITLE PAIR')+'\nrules: 60 chars max, keyword in first 3 words, title and thumb never repeat, emoji max 2\nsheet: forge29_title_sheet.txt';
  download('forge29_title_sheet.txt',txt);log('TITLE LAB: downloaded sheet');}}
];
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
})();
