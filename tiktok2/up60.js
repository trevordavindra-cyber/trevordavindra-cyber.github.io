'use strict';
(function(){
  if(window.__tk2up60){return;}
  window.__tk2up60=true;
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
  cards.forEach(function(c){if(c.innerText.includes('HOOKS LAB')){target=c;}});
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='SCRIPT LAB';
  newCard.appendChild(h2);
  if(target&&target.parentNode){
    target.parentNode.insertBefore(newCard,target.nextSibling);
  }else{
    document.body.appendChild(newCard);
  }
  var buttonDefs=[
    {id:'f60b1',label:'SCRIPT OUTLINE',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for SCRIPT OUTLINE.');return;}
      var beats=['setup','turn','raise','climax','payoff'];
      var out=[];
      for(var i=0;i<clips.length;i++){
        var clip=clips[i]; var name=clip.name||'Clip '+(i+1);
        var b1=beats[i%5]; var b2=beats[(i+2)%5];
        out.push('Clip '+(i+1)+' ('+name+'): opens as '+b1+', pivots on '+b2+', ends with a question hook');
      } log(out.join('\n'));
    }},
    {id:'f60b2',label:'HOOK LINE',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for HOOK LINE.');return;}
      var opens=['You will not believe','Here is the part nobody shows','Stop scrolling for','This took 3 tries:'];
      var out=[];
      for(var i=0;i<clips.length;i++){
        var name=(clips[i].name||'Clip '+(i+1));
        out.push('Clip '+(i+1)+': "'+opens[i%4]+' '+name+'."');
      } log(out.join('\n'));
    }},
    {id:'f60b3',label:'VO SCRIPT',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for VO SCRIPT.');return;}
      var out=[]; var total=0;
      for(var i=0;i<clips.length;i++){
        var clip=clips[i]; var dur=clip.duration||5;
        var words=Math.round(dur*2.5);
        total+=words;
        var line=clip.caption?String(clip.caption).slice(0,60):'Talk over '+(clip.name||'Clip '+(i+1));
        out.push('Clip '+(i+1)+': ~'+words+' words / '+dur+'s - "'+line+'..."');
      }
      out.push('Total script: ~'+total+' words, read time '+Math.round(total/150*60)+'s at 150 wpm');
      log(out.join('\n'));
    }},
    {id:'f60b4',label:'BEAT SHEET',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for BEAT SHEET.');return;}
      var out=[];
      for(var i=0;i<clips.length;i++){
        var dur=clips[i].duration||5; var step=dur/5;
        var pts=[]; for(var b=0;b<5;b++){pts.push((b*step).toFixed(1)+'s '+['open','spark','turn','press','release'][b]);}
        out.push('Clip '+(i+1)+': '+pts.join(', '));
      } log(out.join('\n'));
    }},
    {id:'f60b5',label:'DIALOGUE POLISH',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for DIALOGUE POLISH.');return;}
      var out=[];
      for(var i=0;i<clips.length;i++){
        var cap=clips[i].caption?String(clips[i].caption):('say something about '+(clips[i].name||'Clip '+(i+1)));
        var words=cap.split(/\s+/);
        var cut=words.filter(function(w){return !/^(um|uh|like|so|basically|actually|really|just|very)$/i.test(w);});
        var trimmed=cut.slice(0,10).join(' ');
        out.push('Clip '+(i+1)+': "'+trimmed+'"');
      } log(out.join('\n'));
    }},
    {id:'f60b6',label:'FILLER CUT',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for FILLER CUT.');return;}
      var fillers=['um','uh','like','so','basically','actually','really','just','very','literally'];
      var out=[]; var total=0;
      for(var i=0;i<clips.length;i++){
        var cap=(clips[i].caption?String(clips[i].caption):'').toLowerCase();
        var hits=fillers.filter(function(f){return cap.indexOf(f)>-1;});
        total+=hits.length;
        var clean=(clips[i].caption?String(clips[i].caption):'').replace(/\b(um|uh|like|so|basically|actually|really|just|very|literally)\b\s*/gi,'');
        out.push('Clip '+(i+1)+': '+(hits.length?hits.length+' filler ('+hits.join(', ')+')':'clean')+' -> "'+clean.trim().slice(0,60)+'"');
      }
      out.push('Project total: '+total+' filler words found');
      log(out.join('\n'));
    }},
    {id:'f60b7',label:'TONE CHECK',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for TONE CHECK.');return;}
      var tones=['curious','urgent','playful','bold','warm'];
      var out=[];
      for(var i=0;i<clips.length;i++){
        var dur=clips[i].duration||5;
        var tone=tones[i%5];
        var fix=dur>6?'trim it, the tone stretches past 6s':'pacing holds, keep the energy';
        out.push('Clip '+(i+1)+': tone '+tone+' - '+fix);
      } log(out.join('\n'));
    }},
    {id:'f60b8',label:'A/B VARIANTS',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for A/B VARIANTS.');return;}
      var out=[];
      for(var i=0;i<clips.length;i++){
        var name=clips[i].name||'Clip '+(i+1);
        out.push('Clip '+(i+1)+' A: "Watch ' + name + ' change everything."');
        out.push('Clip '+(i+1)+' B: "3 reasons ' + name + ' works."');
      } log(out.join('\n'));
    }},
    {id:'f60b9',label:'STORY ARC',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for STORY ARC.');return;}
      if(clips.length<3){log('Need at least 3 clips for STORY ARC.');return;}
      var setup=clips.slice(0,Math.ceil(clips.length/3)).length;
      var tension=clips.slice(Math.ceil(clips.length/3),clips.length-Math.ceil(clips.length/3)).length;
      var payoff=Math.ceil(clips.length/3);
      var out=[];
      out.push('Arc map: setup clips 1-'+setup+', tension clips '+(setup+1)+'-'+(setup+tension)+', payoff clips '+(setup+tension+1)+'-'+clips.length);
      var flags=[];
      if(clips[0].duration<2)flags.push('setup too short, hold the open 2s');
      if(!clips[clips.length-1].caption)flags.push('payoff has no caption, add the closing line');
      if(clips.length<5)flags.push('arc is tight, add 1-2 beats if the cut allows');
      if(!flags.length)flags.push('arc complete, no gaps flagged');
      out.push('Flags: '+flags.join(' | '));
      log(out.join('\n'));
    }},
    {id:'f60b10',label:'SCRIPT SHEET .TXT',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for SCRIPT SHEET .TXT.');return;}
      var lines=[];
      lines.push('SCRIPT LAB SHEET');
      lines.push('Clips: '+clips.length);
      lines.push('');
      for(var i=0;i<clips.length;i++){
        var clip=clips[i]; var dur=clip.duration||5;
        var beats=['setup','turn','raise','climax','payoff'];
        var opens=['You will not believe','Here is the part nobody shows','Stop scrolling for','This took 3 tries:'];
        var words=Math.round(dur*2.5);
        var tone=['curious','urgent','playful','bold','warm'][i%5];
        lines.push('Clip '+(i+1)+' - '+(clip.name||'untitled'));
        lines.push('Duration: '+dur+'s | VO words ~'+words+' | tone: '+tone);
        lines.push('Outline: opens as '+beats[i%5]+', pivots on '+beats[(i+2)%5]);
        lines.push('Hook line: "'+opens[i%4]+' '+(clip.name||'Clip '+(i+1))+'."');
        lines.push('A/B: A "Watch '+(clip.name||'this')+' change everything." / B "3 reasons '+(clip.name||'this')+' works."');
        lines.push('');
      }
      var txt=lines.join('\n');
      dl('script-sheet.txt',txt); log('script-sheet.txt downloaded');
    }}
  ];
  buttonDefs.forEach(function(def){
    var row=mkRow(newCard,def.label);
    var btn=mkBtn(def.id,def.label,row);
    btn.addEventListener('click',def.handler);
  });
})();
