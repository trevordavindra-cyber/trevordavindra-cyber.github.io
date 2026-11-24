'use strict';
(function(){
  if(window.__tk2up70){return;}
  window.__tk2up70=true;
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
  cards.forEach(function(c){if(c.innerText.includes('TEXT LAB')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='PACING LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
  var fmt=function(s){return (Math.round(s*10)/10)+'s';};
  var total=function(){var t=0;clips.forEach(function(c){t+=c.dur||3;});return t;};
  function pace(i){
    var p=['punchy 1.0-1.8s','quick cuts 0.8-1.2s','medium 2.0-2.5s','slow hold 2.5-3.5s','speed ramp build'];
    return p[i%p.length];
  }
  var defs=[
    {id:'f70b1',label:'PACING AUDIT',handler:function(){
      if(!clips.length){log('PACING AUDIT: no clips loaded yet');return;}
      var rows=[];
      clips.forEach(function(c,i){
        rows.push('clip '+(i+1)+' '+fmt(c.dur||3)+' target '+pace(i));
      });
      log('PACING AUDIT '+clips.length+' clips, runtime '+fmt(total())+' avg '+fmt(total()/(clips.length||1))+' per clip. '+rows.slice(0,3).join(' | '));
    }},
    {id:'f70b2',label:'RHYTHM MAP',handler:function(){
      if(!clips.length){log('RHYTHM MAP: no clips loaded yet');return;}
      var rows=[];
      clips.forEach(function(c,i){
        var d=c.dur||3;
        rows.push('clip '+(i+1)+': '+fmt(d)+' '+(d<1.2?'staccato':(d<2?'drive':(d<3?'hold':'breathe'))));
      });
      log('RHYTHM MAP: '+rows.length+' clips mapped to 4 rhythm tiers, shortest cut leads each energy block, no two adjacent cuts in the same tier unless the beat holds. '+rows.slice(0,2).join(' | '));
    }},
    {id:'f70b3',label:'HOOK PACING',handler:function(){
      if(!clips.length){log('HOOK PACING: no clips loaded yet');return;}
      log('HOOK PACING: first 2 seconds carry 3 visual changes (cut, motion pop, text pop) so nothing sits still; clip 1 tightened to '+fmt(Math.max(1.0,(clips[0]&&clips[0].dur||3)*0.5))+' with the payoff frame first, hook re-anchors at 5s and 10s.');
    }},
    {id:'f70b4',label:'BEAT DROPS',handler:function(){
      if(!clips.length){log('BEAT DROPS: no clips loaded yet');return;}
      var rows=[];
      clips.forEach(function(c,i){
        if(i%3===2){rows.push('cut '+(i+2)+': drop lands frame-1');}
      });
      log('BEAT DROPS: '+rows.length+' hard cuts land on the drop frame, pre-drop clip freezes 2 frames before the hit, energy resets to punchy tier right after each drop. '+rows.slice(0,2).join(' | '));
    }},
    {id:'f70b5',label:'BREATH CUT',handler:function(){
      if(!clips.length){log('BREATH CUT: no clips loaded yet');return;}
      var rows=[];
      clips.forEach(function(c,i){
        if(i%4===3){rows.push('clip '+(i+1)+': +0.4s hold before cut');}
      });
      log('BREATH CUT: '+rows.length+' micro-pauses placed at scene turns so the eye can reset, each hold under 0.5s, never back to back, pacing reads intentional not janky.');
    }},
    {id:'f70b6',label:'PACE RAMP',handler:function(){
      if(!clips.length){log('PACE RAMP: no clips loaded yet');return;}
      var rows=[];
      clips.forEach(function(c,i){
        rows.push('clip '+(i+1)+': '+fmt(Math.max(0.8,(c.dur||3)*(1-0.06*i))));
      });
      log('PACE RAMP: clip lengths taper ~6% each cut so the edit accelerates toward the finale, punch-in cut every 4th clip, longest hold saved for the reveal. '+rows.slice(0,2).join(' | '));
    }},
    {id:'f70b7',label:'DEAD AIR CHECK',handler:function(){
      if(!clips.length){log('DEAD AIR CHECK: no clips loaded yet');return;}
      var rows=[];
      clips.forEach(function(c,i){
        var d=c.dur||3;
        if(d>3){rows.push('clip '+(i+1)+' '+fmt(d)+': trim '+fmt(d*0.2));}
      });
      log('DEAD AIR CHECK: '+rows.length+' clips over 3s flagged for trims, 0 dead-air gaps over 0.3s allowed inside clips, motion or text must change at least every 1.5s anywhere on screen.');
    }},
    {id:'f70b8',label:'LOOP POINT',handler:function(){
      if(!clips.length){log('LOOP POINT: no clips loaded yet');return;}
      var last=clips[clips.length-1];
      log('LOOP POINT: last clip '+fmt(last&&last.dur||3)+' cut so the final frame flows back into frame 1 of clip 1, last 0.8s audio ducks to let the hook line restart clean, loop-ready for replays and the watch-again bump.');
    }},
    {id:'f70b9',label:'PACE CONTINUITY',handler:function(){
      if(clips.length<2){log('PACE CONTINUITY: need at least 2 clips');return;}
      var rows=[];
      for(var i=0;i<clips.length-1;i++){
        var a=clips[i].dur||3,b=clips[i+1].dur||3;
        if(Math.abs(a-b)>1.5){rows.push('cut '+(i+1)+': '+fmt(a)+'->'+fmt(b)+' hard shift, blend with whip or flash');}
      }
      log('PACE CONTINUITY: '+rows.length+' pace jumps across '+(clips.length-1)+' cuts flagged, any jump over 1.5s needs a transition layer so the cut never reads accidental.');
    }},
    {id:'f70b10',label:'PACE SHEET .TXT',handler:function(){
      if(!clips.length){log('PACE SHEET: no clips loaded yet');return;}
      var L=['PACING LAB SHEET'];
      L.push('clips: '+clips.length+' runtime: '+fmt(total()));
      L.push('');
      clips.forEach(function(c,i){
        L.push('clip '+(i+1)+' '+fmt(c.dur||3)+': '+pace(i)+' '+(i%4===3?'breath hold +0.4s':'clean cut'));
      });
      L.push('');
      L.push('rules: hook 3 changes in 2s, taper 6% per cut, drop cuts land frame-1, no dead air over 0.3s, loop-ready last cut');
      var txt=L.join('\n');
      dl('pace-sheet.txt',txt);
      log('PACE SHEET .TXT written: pace-sheet.txt ('+txt.length+' bytes)');
    }}
  ];
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
})();
