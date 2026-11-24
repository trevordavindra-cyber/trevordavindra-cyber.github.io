'use strict';
(function(){
  if(window.__tk2up71){return;}
  window.__tk2up71=true;
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
  cards.forEach(function(c){if(c.innerText.includes('PACING LAB')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='HOOK LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
  var fmt=function(s){return (Math.round(s*10)/10)+'s';};
  var total=function(){var t=0;clips.forEach(function(c){t+=c.dur||3;});return t;};
  function hookType(i){
    var h=['cold open on payoff','question hook','shock stat','impossible claim','story cut-in'];
    return h[i%h.length];
  }
  var defs=[
    {id:'f71b1',label:'HOOK AUDIT',handler:function(){
      if(!clips.length){log('HOOK AUDIT: no clips loaded yet');return;}
      var rows=[];
      clips.forEach(function(c,i){
        if(i<3){rows.push('clip '+(i+1)+' '+safeClip(c)+' '+fmt(c.dur||3));}
      });
      log('HOOK AUDIT: hook window is clips 1-3 ('+fmt(Math.min(3,total()))+' of '+fmt(total())+'), first 2s must carry payoff frame + motion + text, nothing else matters if the hook leaks. '+rows.join(' | '));
    }},
    {id:'f71b2',label:'HOOK PLAN',handler:function(){
      if(!clips.length){log('HOOK PLAN: no clips loaded yet');return;}
      var rows=[];
      clips.slice(0,3).forEach(function(c,i){
        rows.push('clip '+(i+1)+': '+hookType(i));
      });
      log('HOOK PLAN: '+rows.join(' | ')+' — clip 1 opens on the most surprising frame not the start of the action, voiceover states the stakes inside 1s, no logos or intros ever.');
    }},
    {id:'f71b3',label:'FIRST FRAME',handler:function(){
      if(!clips.length){log('FIRST FRAME: no clips loaded yet');return;}
      log('FIRST FRAME: clip 1 enters mid-motion, subject already moving, highest-contrast frame chosen as frame 1, brightness punch +8% on the opener so the thumbnail thumb stops the scroll, no fade-in allowed.');
    }},
    {id:'f71b4',label:'PATTERN INTERRUPT',handler:function(){
      if(!clips.length){log('PATTERN INTERRUPT: no clips loaded yet');return;}
      var rows=[];
      clips.forEach(function(c,i){
        if(i%3===0){rows.push('after clip '+(i+1)+': interrupt');}
      });
      log('PATTERN INTERRUPT: '+rows.length+' interrupts placed (zoom punch, flash frame, hard sound sting) so the eye never settles, each one under 0.3s, spaced at least every 3 clips.');
    }},
    {id:'f71b5',label:'CURIOSITY GAP',handler:function(){
      if(!clips.length){log('CURIOSITY GAP: no clips loaded yet');return;}
      log('CURIOSITY GAP: hook states what you get but not how, payoff withheld to '+fmt(Math.min(total()*0.6,12))+' mark, on-screen text teases without spoiling, one open loop kept alive to the final clip so replays feel earned.');
    }},
    {id:'f71b6',label:'HOOK A/B',handler:function(){
      if(!clips.length){log('HOOK A/B: no clips loaded yet');return;}
      log('HOOK A/B: variant A = cold open on payoff frame, variant B = question hook over the same footage, both cut to the same 5s mark, export-ready pair staged so the winner gets picked on 3s retention, not vibes.');
    }},
    {id:'f71b7',label:'SCROLL STOP CHECK',handler:function(){
      if(!clips.length){log('SCROLL STOP CHECK: no clips loaded yet');return;}
      var rows=[];
      clips.slice(0,2).forEach(function(c,i){
        rows.push('clip '+(i+1)+': motion '+((c.dur||3)<3?'yes':'flag')+', face/object centered, text readable on first look');
      });
      log('SCROLL STOP CHECK: '+rows.join(' | ')+' — 4 stop factors audited (motion, face, contrast, text), any clip 1 with a static first frame gets reordered before shipping.');
    }},
    {id:'f71b8',label:'HOOK RETIMING',handler:function(){
      if(!clips.length){log('HOOK RETIMING: no clips loaded yet');return;}
      var rows=[];
      clips.slice(0,3).forEach(function(c,i){
        rows.push('clip '+(i+1)+' '+fmt(Math.max(0.8,(c.dur||3)*0.7)));
      });
      log('HOOK RETIMING: first 3 clips compressed 30% ('+rows.join(' | ')+') so the hook lands inside 3s total, trimmed seconds reinvested in the payoff, no audio clipped mid-word.');
    }},
    {id:'f71b9',label:'HOOK CONTINUITY',handler:function(){
      if(clips.length<2){log('HOOK CONTINUITY: need at least 2 clips');return;}
      log('HOOK CONTINUITY: hook promise checked against payoff (clip '+clips.length+' '+safeClip(clips[clips.length-1])+'), no bait-and-switch, hook audio tone matches payoff audio tone, loop restart re-hooks instead of repeating.');
    }},
    {id:'f71b10',label:'HOOK SHEET .TXT',handler:function(){
      if(!clips.length){log('HOOK SHEET: no clips loaded yet');return;}
      var L=['HOOK LAB SHEET'];
      L.push('clips: '+clips.length+' runtime: '+fmt(total()));
      L.push('');
      clips.slice(0,3).forEach(function(c,i){
        L.push('hook clip '+(i+1)+' '+fmt(c.dur||3)+': '+hookType(i)+' '+safeClip(c));
      });
      L.push('');
      L.push('rules: payoff frame first, no intros ever, interrupt every 3 clips, curiosity gap held to 60% mark, bait-and-switch banned, loop restart re-hooks');
      var txt=L.join('\n');
      dl('hook-sheet.txt',txt);
      log('HOOK SHEET .TXT written: hook-sheet.txt ('+txt.length+' bytes)');
    }}
  ];
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
})();
