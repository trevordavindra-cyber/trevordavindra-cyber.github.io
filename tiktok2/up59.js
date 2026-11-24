'use strict';
(function(){
  if(window.__tk2up59){return;}
  window.__tk2up59=true;
  var S=window.S||{clips:[]};
  var r1=window.r1||function(sel){return document.querySelector(sel);};
  var log=window.log||console.log.bind(console);
  var mkBtn=window.mkBtn||function(id,label,card){
    var btn=document.createElement('button');
    btn.id=id;
    btn.textContent=label;
    btn.style.margin='4px';
    if(card) card.appendChild(btn);
    return btn;
  };
  var mkRow=window.mkRow||function(card,title){
    var row=document.createElement('div');
    row.className='row';
    var h3=document.createElement('h3');
    h3.textContent=title;
    row.appendChild(h3);
    if(card) card.appendChild(row);
    return row;
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
  function getClips(){return (S.clips&&S.clips.length>0)?S.clips:null;}
  var cards=document.querySelectorAll('.card');
  var target=null;
  cards.forEach(function(c){if(c.innerText.includes('COLOR LAB')){target=c;}});
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='HOOKS LAB';
  newCard.appendChild(h2);
  if(target&&target.parentNode){
    target.parentNode.insertBefore(newCard,target.nextSibling);
  }else{
    document.body.appendChild(newCard);
  }
  var buttonDefs=[
    {id:'f59b1',label:'HOOK STRENGTH',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for HOOK STRENGTH.');return;}
      var out=[]; for(var i=0;i<clips.length;i++){
        var clip=clips[i]; var duration=clip.duration||5;
        var base=5+i; var score=base+Math.floor(duration/5); if(i===0)score+=3;
        if(score>10)score=10; if(score<1)score=1;
        var first3='weak'; if(duration>=3)first3='strong'; else if(duration>=2)first3='ok';
        out.push('Clip '+(i+1)+': hook score '+score+'/10 (first 3s: '+first3+')');
      } log(out.join('\n'));
    }},
    {id:'f59b2',label:'HOOK VARIANTS',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for HOOK VARIANTS.');return;}
      var out=[]; for(var i=0;i<clips.length;i++){
        var clip=clips[i];
        var name=clip.name||'Clip '+(i+1);
        out.push('Clip '+(i+1)+': 1) What if '+name+'? 2) The best of '+name+'! 3) Ever wondered why '+name+'?');
      } log(out.join('\n'));
    }},
    {id:'f59b3',label:'FIRST FRAME',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for FIRST FRAME.');return;}
      var out=[]; for(var i=0;i<clips.length;i++){
        var nm=(clips[i].name||'Clip '+(i+1)).split(' ').slice(0,5).join(' ').toUpperCase();
        out.push('Clip '+(i+1)+': freeze 0.0s, overlay "'+nm+'", zoom 1.15x');
      } log(out.join('\n'));
    }},
    {id:'f59b4',label:'RETENTION CURVE',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for RETENTION CURVE.');return;}
      var out=[]; for(var i=0;i<clips.length;i++){
        var base=100,p3=80,p10=60,end=40;
        if(i!==0){base=90;p3=70;p10=50;end=30;}
        out.push('Clip '+(i+1)+': '+base+'% -> '+p3+'% -> '+p10+'% -> '+end+'% (drop offs marked)');
      } log(out.join('\n'));
    }},
    {id:'f59b5',label:'PATTERN INTERRUPT',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for PATTERN INTERRUPT.');return;}
      var patterns=['zoom punch','whip pan','sound spike','freeze frame','text flash'];
      var out=[]; for(var i=0;i<clips.length;i++){
        var clip=clips[i]; var duration=clip.duration||5;
        var mid=duration/2; var pattern=patterns[i%5];
        out.push('Clip '+(i+1)+': '+pattern+' at '+mid.toFixed(1)+'s, second mark at '+(mid+1).toFixed(1)+'s');
      } log(out.join('\n'));
    }},
    {id:'f59b6',label:'HOOK TEXT OVERLAY',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for HOOK TEXT OVERLAY.');return;}
      var out=[]; for(var i=0;i<clips.length;i++){
        var nm=((clips[i].name||'CLIP '+(i+1)).toUpperCase().split(' ').slice(0,3).join(' '));
        out.push('Clip '+(i+1)+': 0-2s "'+nm+' STARTS", 2-4s "WAIT FOR IT"');
      } log(out.join('\n'));
    }},
    {id:'f59b7',label:'HOOK COMPARISON',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for HOOK COMPARISON.');return;}
      if(clips.length<2){log('Need at least 2 clips for HOOK COMPARISON.');return;}
      var scores=[]; for(var i=0;i<clips.length;i++){
        var clip=clips[i]; var duration=clip.duration||5;
        var base=5+i; var score=base+Math.floor(duration/5); if(i===0)score+=3;
        if(score>10)score=10; if(score<1)score=1; scores.push(score);
      } var best=0,weak=0; for(var i=1;i<scores.length;i++){
        if(scores[i]>scores[best])best=i;
        if(scores[i]<scores[weak])weak=i;
      } var out=[]; out.push('Best hook: Clip '+(best+1)+' ('+scores[best]+'/10) ... Weakest: Clip '+(weak+1)+' ('+scores[weak]+'/10) - rehook suggested');
      log(out.join('\n'));
    }},
    {id:'f59b8',label:'HOOK REWRITE',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for HOOK REWRITE.');return;}
      var templates=['POV: ...','Nobody tells you ...','Wait for it ...'];
      var out=[]; for(var i=0;i<clips.length;i++){
        var tmpl=templates[i%3].replace('...',clips[i].name||'Clip '+(i+1));
        out.push('Clip '+(i+1)+': '+tmpl);
      } log(out.join('\n'));
    }},
    {id:'f59b9',label:'HOOK TIMELINE',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for HOOK TIMELINE.');return;}
      var out=[]; for(var i=0;i<clips.length;i++){
        out.push('Clip '+(i+1)+': 0.0s hook frame, 0.8s text overlay, 1.6s motion punch, 2.4s second beat, 3.0s release');
      } log(out.join('\n'));
    }},
    {id:'f59b10',label:'HOOK SHEET .TXT',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for HOOK SHEET .TXT.');return;}
      var lines=[]; for(var i=0;i<clips.length;i++){
        var clip=clips[i]; var duration=clip.duration||5;
        var base=5+i; var score=base+Math.floor(duration/5); if(i===0)score+=3;
        if(score>10)score=10; if(score<1)score=1;
        var patterns=['zoom punch','whip pan','sound spike','freeze frame','text flash']; var pattern=patterns[i%5];
        var mid=duration/2; var interrupt=pattern+' at '+mid.toFixed(1)+'s';
        var nm=((clip.name||'CLIP '+(i+1)).toUpperCase().split(' ').slice(0,3).join(' '));
        var overlay1=nm+' STARTS'; var overlay2='WAIT FOR IT';
        var templates=['POV: ...','Nobody tells you ...','Wait for it ...']; var rewrite=templates[i%3].replace('...',clip.name||'Clip '+(i+1));
        var timeline='0.0s hook frame, 0.8s text overlay, 1.6s motion punch, 2.4s second beat, 3.0s release';
        lines.push('Clip '+(i+1)+' Report:');
        lines.push('Duration: '+duration+'s');
        lines.push('Hook score: '+score+'/10');
        lines.push('Interrupt: '+interrupt);
        lines.push('Overlays: 0-2s '+overlay1+', 2-4s '+overlay2);
        lines.push('Rewrite: '+rewrite);
        lines.push('Timeline: '+timeline);
        lines.push('');
      } var txt=lines.join('\n'); dl('hooks-sheet.txt',txt); log('hooks-sheet.txt downloaded');
    }}
  ];
  buttonDefs.forEach(function(def){
    var row=mkRow(newCard,def.label);
    var btn=mkBtn(def.id,def.label,row);
    btn.addEventListener('click',def.handler);
  });
})();