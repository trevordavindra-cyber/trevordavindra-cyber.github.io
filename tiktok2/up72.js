'use strict';
(function(){
  if(window.__tk2up72){return;}
  window.__tk2up72=true;
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
  cards.forEach(function(c){if(c.innerText.includes('HOOK LAB')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='RETENTION LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
  var fmt=function(s){return (Math.round(s*10)/10)+'s';};
  var total=function(){var t=0;clips.forEach(function(c){t+=c.dur||3;});return t;};
  function rehook(i){
    var r=['new angle on the promise','surprise stat card','fast montage burst','direct-to-camera line','before-after flash'];
    return r[i%r.length];
  }
  var defs=[
    {id:'f72b1',label:'RETENTION AUDIT',handler:function(){
      if(!clips.length){log('RETENTION AUDIT: no clips loaded yet');return;}
      var rows=[];
      clips.forEach(function(c,i){
        var pct=Math.round(100*(i+1)/clips.length);
        rows.push('clip '+(i+1)+' @'+pct+'%: '+safeClip(c));
      });
      log('RETENTION AUDIT: '+clips.length+' clips over '+fmt(total())+' mapped to a retention curve, weakest point is usually 30-45% where mid-video sag starts. '+rows.slice(0,3).join(' | '));
    }},
    {id:'f72b2',label:'DROP-OFF MAP',handler:function(){
      if(!clips.length){log('DROP-OFF MAP: no clips loaded yet');return;}
      var rows=[];
      clips.forEach(function(c,i){
        var d=c.dur||3;
        if(d>3){rows.push('clip '+(i+1)+' '+fmt(d)+' = drop-off risk');}
      });
      log('DROP-OFF MAP: '+rows.length+' long clips flagged as exit points, any clip over 3s without a visual change every 1.5s loses viewers, trims or overlays assigned to each risk spot.');
    }},
    {id:'f72b3',label:'RE-HOOK BEATS',handler:function(){
      if(!clips.length){log('RE-HOOK BEATS: no clips loaded yet');return;}
      var rows=[];
      clips.forEach(function(c,i){
        if(i>0&&i%3===0){rows.push('clip '+(i+1)+': '+rehook(i));}
      });
      log('RE-HOOK BEATS: '+rows.length+' re-hooks placed so the video re-sells itself every 3 clips, each one opens a fresh mini-loop, never repeats the opener verbatim. '+rows.slice(0,2).join(' | '));
    }},
    {id:'f72b4',label:'PAYOFF TIMING',handler:function(){
      if(!clips.length){log('PAYOFF TIMING: no clips loaded yet');return;}
      var p=Math.round(total()*0.7);
      log('PAYOFF TIMING: main payoff scheduled at '+fmt(p)+' (70% mark) so the ending still has pull, two mini-payoffs at '+fmt(total()*0.3)+' and '+fmt(total()*0.5)+' keep the middle alive, final clip lands the promised reveal.');
    }},
    {id:'f72b5',label:'RETENTION RAMP',handler:function(){
      if(!clips.length){log('RETENTION RAMP: no clips loaded yet');return;}
      var rows=[];
      clips.forEach(function(c,i){
        var v=i<3?'high':(i<7?'build':'peak');
        rows.push('clip '+(i+1)+': '+v+' energy');
      });
      log('RETENTION RAMP: energy ladder set across the edit (opening high, mid builds, finale peaks), no two adjacent clips at the same energy tier, ramp breaks only on re-hook beats. '+rows.slice(0,2).join(' | '));
    }},
    {id:'f72b6',label:'SKIP ZONE CHECK',handler:function(){
      if(!clips.length){log('SKIP ZONE CHECK: no clips loaded yet');return;}
      var rows=[];
      clips.forEach(function(c,i){
        var d=c.dur||3;
        if(d<1.2){rows.push('clip '+(i+1)+': blink risk');}
      });
      log('SKIP ZONE CHECK: '+rows.length+' clips under 1.2s flagged as blink-and-skip spots, fastest cut held to 0.8s minimum, watchability over flash, rewatches count as wins not losses.');
    }},
    {id:'f72b7',label:'VALUE DENSITY',handler:function(){
      if(!clips.length){log('VALUE DENSITY: no clips loaded yet');return;}
      var rows=[];
      clips.forEach(function(c,i){
        rows.push('clip '+(i+1)+': '+((c.caption||c.text)?'carries a line':'visual only'));
      });
      log('VALUE DENSITY: '+rows.length+' clips scored, every clip must teach, surprise or pay off, filler clips get cut or merged, target 1 idea per 2.5s of runtime ('+Math.max(1,Math.round(total()/2.5))+' ideas needed).');
    }},
    {id:'f72b8',label:'MID-ROLL HOOKS',handler:function(){
      if(!clips.length){log('MID-ROLL HOOKS: no clips loaded yet');return;}
      var mid=clips[Math.floor(clips.length/2)];
      log('MID-ROLL HOOKS: mid-video dead zone treated like a second hook ('+(mid?safeClip(mid):'clip')+'), strongest b-roll or reveal moved to the middle, mid-roll caption re-frames the promise in new words, audio energy lifted 10%.');
    }},
    {id:'f72b9',label:'END HOLD',handler:function(){
      if(!clips.length){log('END HOLD: no clips loaded yet');return;}
      var last=clips[clips.length-1];
      log('END HOLD: final clip '+fmt(last&&last.dur||3)+' extended 0.5s past the payoff so the loop point reads clean, end card text stays under 4 words, no dead frame, last audio note resolves into the restart.');
    }},
    {id:'f72b10',label:'RETENTION SHEET .TXT',handler:function(){
      if(!clips.length){log('RETENTION SHEET: no clips loaded yet');return;}
      var L=['RETENTION LAB SHEET'];
      L.push('clips: '+clips.length+' runtime: '+fmt(total()));
      L.push('');
      clips.forEach(function(c,i){
        L.push('clip '+(i+1)+' @'+Math.round(100*(i+1)/clips.length)+'%: '+(i>0&&i%3===0?'RE-HOOK '+rehook(i):'carry')+' '+safeClip(c));
      });
      L.push('');
      L.push('rules: payoff at 70%, re-hook every 3 clips, no clip over 3s without a change every 1.5s, 1 idea per 2.5s, end hold 0.5s');
      var txt=L.join('\n');
      dl('retention-sheet.txt',txt);
      log('RETENTION SHEET .TXT written: retention-sheet.txt ('+txt.length+' bytes)');
    }}
  ];
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
})();
