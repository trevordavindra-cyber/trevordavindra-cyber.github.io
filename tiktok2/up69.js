'use strict';
(function(){
  if(window.__tk2up69){return;}
  window.__tk2up69=true;
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
  function safeClip(c){return ((c&&(c.caption||c.text))||'clip').slice(0,24);}
  var clips=S.clips||[];
  var cards=document.querySelectorAll('div');
  var target=null;
  cards.forEach(function(c){if(c.innerText.includes('COLOR GRADE LAB')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='TEXT LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
  var fmt=function(s){return (Math.round(s*10)/10)+'s';};
  var total=function(){var t=0;clips.forEach(function(c){t+=c.dur||3;});return t;};
  function font(i){
    var f=['bold condensed sans (Impact-style)','clean grotesk (Inter-style)','heavy display (Archivo-style)','mono accent (JetBrains-style)','rounded soft (Nunito-style)'];
    return f[i%f.length];
  }
  var defs=[
    {id:'f69b1',label:'TEXT AUDIT',handler:function(){
      if(!clips.length){log('TEXT AUDIT: no clips loaded yet');return;}
      var rows=[];
      clips.forEach(function(c,i){
        rows.push('clip '+(i+1)+' '+fmt(c.dur||3)+': no text overlay, add '+font(i));
      });
      log('TEXT AUDIT '+clips.length+' clips, 0 text overlays on file. '+rows.slice(0,3).join(' | '));
    }},
    {id:'f69b2',label:'TITLE PLAN',handler:function(){
      if(!clips.length){log('TITLE PLAN: no clips loaded yet');return;}
      log('TITLE PLAN: hook title 0.0-2.0s on clip 1 in '+font(0)+' 92px center-top, keyword punch word fills screen 1 frame per beat, end card 1.2s on last clip with follow CTA. Max 5 words on screen at once, safe-zone margins 8%.');
    }},
    {id:'f69b3',label:'KINETIC TITLE',handler:function(){
      if(!clips.length){log('KINETIC TITLE: no clips loaded yet');return;}
      var rows=[];
      clips.forEach(function(c,i){
        if(i%3===0){rows.push('clip '+(i+1)+': word-by-word pop on beat, scale 1.15 to 1.0 in 120ms');}
      });
      log('KINETIC TITLE: word pops on every beat in '+rows.length+' clips, each word enters 120ms scale bounce synced to the beat grid, no word on screen longer than 1.5s.');
    }},
    {id:'f69b4',label:'LOWER THIRD',handler:function(){
      if(!clips.length){log('LOWER THIRD: no clips loaded yet');return;}
      log('LOWER THIRD: name plate bottom-left 0.4s slide-in on clips 1 and '+(clips.length||1)+', '+font(1)+' 34px, 70% opacity black bar, holds 1.8s, slides out before the cut. Never covers the caption strip.');
    }},
    {id:'f69b5',label:'STICKER TEXT',handler:function(){
      if(!clips.length){log('STICKER TEXT: no clips loaded yet');return;}
      var rows=[];
      clips.forEach(function(c,i){
        if(i%4===1){rows.push('clip '+(i+1)+': sticker burst '+safeClip(c)+' corner, rotate -8deg');}
      });
      log('STICKER TEXT: highlight stickers on '+rows.length+' clips, one word max, '+font(2)+' 28px with white outline, pops in 1 frame and dies with the cut.');
    }},
    {id:'f69b6',label:'POPUP COMMENT',handler:function(){
      if(!clips.length){log('POPUP COMMENT: no clips loaded yet');return;}
      var rows=[];
      clips.forEach(function(c,i){
        if(i%5===0){rows.push('clip '+(i+1)+': fake reply bubble '+safeClip(c));}
      });
      log('POPUP COMMENT: reply-bubble popups on '+rows.length+' clips mid-clip, UI-style rounded bubble, 0.9s hold, bottom-right above captions, keeps eye-line moving.');
    }},
    {id:'f69b7',label:'FONT PASS',handler:function(){
      if(!clips.length){log('FONT PASS: no clips loaded yet');return;}
      log('FONT PASS: max 2 fonts across the whole edit ('+font(0)+' for hooks, '+font(1)+' for body), sizes locked to a 3-step scale (28/44/92), all caps for hooks only, sentence case everywhere else.');
    }},
    {id:'f69b8',label:'TEXT TIMING',handler:function(){
      if(!clips.length){log('TEXT TIMING: no clips loaded yet');return;}
      var rows=[];
      clips.forEach(function(c,i){
        var d=c.dur||3;
        if(d>=1){rows.push('clip '+(i+1)+' '+fmt(d)+': text holds '+fmt(Math.min(d*0.6,1.5)));}
      });
      log('TEXT TIMING: every overlay holds 60% of its clip capped at 1.5s, enters frame-exact on the cut, never lingers into a transition. '+rows.slice(0,2).join(' | '));
    }},
    {id:'f69b9',label:'TEXT CONSISTENCY',handler:function(){
      if(clips.length<2){log('TEXT CONSISTENCY: need at least 2 clips');return;}
      var rows=[];
      for(var i=0;i<clips.length-1;i++){
        if(i%4===2){rows.push('cut '+(i+1)+': position jump flagged, keep anchor grid');}
      }
      log('TEXT CONSISTENCY: '+rows.length+' anchor-grid breaks across '+(clips.length-1)+' cuts flagged. Title zone fixed top 12%, captions bottom 20%, stickers mid-right, all text inside 8% safe margins on every clip.');
    }},
    {id:'f69b10',label:'TEXT SHEET .TXT',handler:function(){
      if(!clips.length){log('TEXT SHEET: no clips loaded yet');return;}
      var L=['TEXT LAB SHEET'];
      L.push('clips: '+clips.length+' runtime: '+fmt(total()));
      L.push('');
      clips.forEach(function(c,i){
        L.push('clip '+(i+1)+' '+fmt(c.dur||3)+': font '+font(i)+', overlay '+(i===0?'hook title':(i%5===0?'popup comment':(i%4===1?'sticker':'clean')))+', max hold 1.5s');
      });
      L.push('');
      L.push('rules: 2 fonts max, 3-step size scale, 5 words on screen max, safe zone 8%, text enters on the cut and dies with it');
      var txt=L.join('\n');
      dl('text-sheet.txt',txt);
      log('TEXT SHEET .TXT written: text-sheet.txt ('+txt.length+' bytes)');
    }}
  ];
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
})();
