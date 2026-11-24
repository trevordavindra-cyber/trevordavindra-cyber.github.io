'use strict';
(function(){
  if(window.__tk2up75){return;}
  window.__tk2up75=true;
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
  var clips=S.clips||[];
  var cards=document.querySelectorAll('div');
  var target=null;
  cards.forEach(function(c){if(c.innerText.includes('COLOR LAB')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='TRANSITION LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
  var fmt=function(s){return (Math.round(s*10)/10)+'s';};
  var total=function(){var t=0;clips.forEach(function(c){t+=c.dur||3;});return t;};
  var txtOf=function(c){return ((c&&(c.caption||c.text))||'').toLowerCase();};
  var lenOf=function(c){return ((c&&(c.caption||c.text))||'').length;};
  var defs=[
    {id:'f75b1',label:'TRANSITION AUDIT',handler:function(){
      if(!clips.length){log('TRANSITION AUDIT: no clips loaded yet');return;}
      var badCuts=0,totalCuts=clips.length-1;
      for(var i=0;i<totalCuts;i++){
        var dur=clips[i].dur||3;
        if(dur<0.8){badCuts++;}
      }
      log('TRANSITION AUDIT: '+badCuts+' of '+totalCuts+' cuts too fast (<0.8s)');
    }},
    {id:'f75b2',label:'CUT TYPES',handler:function(){
      if(!clips.length){log('CUT TYPES: no clips loaded yet');return;}
      var hard=0,jCut=0,lCut=0,match=0;
      for(var i=0;i<clips.length-1;i++){
        var capA=lenOf(clips[i]),capB=lenOf(clips[i+1]);
        if(capA>capB){hard++;}
        else if(capA<capB){jCut++;}
        else{match++;}
      }
      log('CUT TYPES: hard='+hard+', J-cut='+jCut+', match-candidates='+match);
    }},
    {id:'f75b3',label:'WHIP PAN PLAN',handler:function(){
      if(!clips.length){log('WHIP PAN PLAN: no clips loaded yet');return;}
      var plan=[],dir='left',speed='fast';
      for(var i=0;i<clips.length;i++){
        if(i%2===0){dir=dir==='left'?'right':'left';}
        if((clips[i].dur||3)>2){speed='med';}else{speed='fast';}
        plan.push('Clip '+i+': '+dir+' '+speed+' whip');
      }
      log('WHIP PAN PLAN: '+plan.join(', '));
    }},
    {id:'f75b4',label:'ZOOM PUNCH',handler:function(){
      if(!clips.length){log('ZOOM PUNCH: no clips loaded yet');return;}
      var punches=[];
      for(var i=0;i<3&&i<clips.length;i++){
        var mid=(clips[i].dur||3)/2;
        punches.push('Clip '+i+': '+fmt(mid)+' in, '+fmt(mid+0.2)+' out');
      }
      log('ZOOM PUNCH: '+punches.join(' | '));
    }},
    {id:'f75b5',label:'GLITCH CUTS',handler:function(){
      if(!clips.length){log('GLITCH CUTS: no clips loaded yet');return;}
      var glitchClips=[];
      for(var i=0;i<clips.length;i++){
        if(i%3===0){glitchClips.push(i);}
      }
      log('GLITCH CUTS: mark clips '+glitchClips.join(', ')+' for 2-frame glitch');
    }},
    {id:'f75b6',label:'MATCH CUTS',handler:function(){
      if(!clips.length){log('MATCH CUTS: no clips loaded yet');return;}
      var candidates=[];
      for(var i=0;i<clips.length-1;i++){
        var txtA=txtOf(clips[i]),txtB=txtOf(clips[i+1]);
        if(txtA.length===txtB.length){candidates.push(i+'-'+(i+1));}
      }
      log('MATCH CUTS: candidates '+candidates.join(', '));
    }},
    {id:'f75b7',label:'SPEED RAMP',handler:function(){
      if(!clips.length){log('SPEED RAMP: no clips loaded yet');return;}
      var longest=[],rampPlan=[];
      for(var i=0;i<3&&i<clips.length;i++){
        longest.push({i:i,dur:clips[i].dur||3});
      }
      longest.sort(function(a,b){return b.dur-a.dur;});
      for(var j=0;j<longest.length;j++){
        var percent=Math.round(longest[j].dur*100);
        rampPlan.push('Clip '+longest[j].i+': '+percent+'% ramp');
      }
      log('SPEED RAMP: '+rampPlan.join(' | '));
    }},
    {id:'f75b8',label:'WIPE PLAN',handler:function(){
      if(!clips.length){log('WIPE PLAN: no clips loaded yet');return;}
      var wipes=[],dirs=['left','right','up','down'];
      for(var i=0;i<clips.length;i++){
        if(i%3===0){wipes.push('clip '+i+' wipe '+dirs[i%4]);}
      }
      log('WIPE PLAN: '+wipes.join(', '));
    }},
    {id:'f75b9',label:'TRANSITION TIMING',handler:function(){
      if(!clips.length){log('TRANSITION TIMING: no clips loaded yet');return;}
      var avgDur=Math.round(total()/clips.length*1000),offsets=[];
      for(var i=0;i<clips.length-1;i++){
        offsets.push(Math.round(avgDur)+'ms');
      }
      log('TRANSITION TIMING: '+offsets.join(', '));
    }},
    {id:'f75b10',label:'TRANSITION SHEET .TXT',handler:function(){
      if(!clips.length){log('TRANSITION SHEET: no clips loaded yet');return;}
      var L=['TRANSITION LAB SHEET'];
      L.push('clips: '+clips.length+' runtime: '+fmt(total()));
      L.push('');
      clips.forEach(function(c,i){
        L.push('clip '+(i+1)+': cut '+(i%3===0?'glitch':(i%2===0?'whip-'+(i%2===0?'right':'left'):'hard'))+' / zoom '+(i<3?'punch':'none')+' / wipe '+(i%3===0?['left','right','up','down'][i%4]:'none')+' '+txtOf(c).slice(0,24));
      });
      L.push('');
      L.push('rules: cuts under 0.8s flagged too fast, whip pans alternate left/right, punch-ins at clip midpoints, 2-frame glitch every 3rd clip, match cuts on equal caption length, wipes every 3rd clip cycling left/right/up/down');
      var txt=L.join('\n');
      dl('transition-sheet.txt',txt);
      log('TRANSITION SHEET .TXT written: transition-sheet.txt ('+txt.length+' bytes)');
    }}
  ];
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
})();
