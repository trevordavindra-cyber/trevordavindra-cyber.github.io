'use strict';
(function(){
  if(window.__tk2up62){return;}
  window.__tk2up62=true;
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
  cards.forEach(function(c){if(c.innerText.includes('PACING LAB')){target=c;}});
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='FRAMING LAB';
  newCard.appendChild(h2);
  if(target&&target.parentNode){
    target.parentNode.insertBefore(newCard,target.nextSibling);
  }else{
    document.body.appendChild(newCard);
  }
  var buttonDefs=[
    {id:'f62b1',label:'RULE OF THIRDS',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for RULE OF THIRDS.');return;}
      var out=[];
      for(var i=0;i<clips.length;i++){
        var clip=clips[i];
        var x=(clip.x!=null?clip.x:0.5);
        var thirds=(Math.abs(x-0.33)<=0.05||Math.abs(x-0.67)<=0.05);
        out.push('Clip '+(i+1)+': subject x '+(x*100).toFixed(0)+'% -> '+(thirds?'on a thirds line, keep':'centered, shift to x 33% or 67% for cut 1 and 3'));
      }
      log(out.join('\n'));
    }},
    {id:'f62b2',label:'HEADROOM CHECK',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for HEADROOM CHECK.');return;}
      var out=[];
      for(var i=0;i<clips.length;i++){
        var clip=clips[i];
        var y=(clip.y!=null?clip.y:0.5);
        var verdict;
        if(y<0.35) verdict='subject sits high, loosen headroom above the eyes';
        else if(y>0.65) verdict='subject sits low, tighten headroom so eyes land at 40%';
        else verdict='headroom ok, eyes near 40%';
        out.push('Clip '+(i+1)+': subject y '+(y*100).toFixed(0)+'% -> '+verdict);
      }
      log(out.join('\n'));
    }},
    {id:'f62b3',label:'PUNCH-IN PLAN',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for PUNCH-IN PLAN.');return;}
      var out=[];
      for(var i=0;i<clips.length;i++){
        var clip=clips[i];
        var w=clip.width||16;
        var plan=(w>=16)?'punch-in 1.4x crop centered on subject for vertical':'already vertical, no punch needed';
        out.push('Clip '+(i+1)+': '+plan);
      }
      log('PUNCH-IN PLAN:\n'+out.join('\n'));
    }},
    {id:'f62b4',label:'SUBJECT TRACK',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for SUBJECT TRACK.');return;}
      var out=[];
      var prevX=null;
      for(var i=0;i<clips.length;i++){
        var clip=clips[i];
        var x=(clip.x!=null?clip.x:0.5);
        var drift=(prevX==null)?'first clip, anchor':'drift '+Math.abs(x-prevX).toFixed(2)+' from previous cut';
        out.push('Clip '+(i+1)+': '+drift);
        prevX=x;
      }
      log(out.join('\n'));
    }},
    {id:'f62b5',label:'CROP PRESETS',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for CROP PRESETS.');return;}
      var presets=['CENTER 1.0x','LEFT THIRDS 1.2x','RIGHT THIRDS 1.2x','TIGHT FACE 1.5x','WIDE ESTABLISH 0.9x'];
      var out=['Presets ready, tap to apply on the selected clip:'];
      for(var p=0;p<presets.length;p++){out.push('- '+presets[p]);}
      out.push('Recommended for this project: LEFT THIRDS 1.2x on cut 1, CENTER 1.0x on dialogue, TIGHT FACE 1.5x on the payoff.');
      log(out.join('\n'));
    }},
    {id:'f62b6',label:'VERTICAL REFIT',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for VERTICAL REFIT.');return;}
      var bad=0;
      var out=[];
      for(var i=0;i<clips.length;i++){
        var clip=clips[i];
        var fill=clip.fill!=null?clip.fill:1;
        if(fill<0.9){bad++;out.push('Clip '+(i+1)+': fills '+(fill*100).toFixed(0)+'% of 9:16 -> scale up or crop sides');}
        else{out.push('Clip '+(i+1)+': fills 9:16 fine');}
      }
      log((bad?('VERTICAL REFIT: '+bad+' clip(s) need a refit:\n'):'VERTICAL REFIT: all clips fill 9:16.\n')+out.join('\n'));
    }},
    {id:'f62b7',label:'EYE LINE',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for EYE LINE.');return;}
      var out=[];
      var prevY=null;
      for(var i=0;i<clips.length;i++){
        var clip=clips[i];
        var y=(clip.y!=null?clip.y:0.4);
        if(prevY!=null&&Math.abs(y-prevY)>0.15){
          out.push('Cut '+(i)+'->'+(i+1)+': eye line jumps '+((y-prevY)*100).toFixed(0)+'%, add a 2-frame blend');
        }
        prevY=y;
      }
      log(out.length?('EYE LINE:\n'+out.join('\n')):'EYE LINE: no eye line jumps across cuts, continuity holds.');
    }},
    {id:'f62b8',label:'FRAME HOLD',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for FRAME HOLD.');return;}
      var out=[];
      for(var i=0;i<clips.length;i++){
        var clip=clips[i];
        var dur=clip.duration||5;
        var best=(dur>=3)?(dur*0.6).toFixed(1):'1.0';
        out.push('Clip '+(i+1)+': cover frame at '+best+'s (peak motion beat)');
      }
      log(out.join('\n'));
    }},
    {id:'f62b9',label:'REFRAME A/B',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for REFRAME A/B.');return;}
      var total=0;
      for(var i=0;i<clips.length;i++){total+=(clips[i].duration||5);}
      log('REFRAME A/B:\nA: center-crop every clip, fastest, loses 12% frame detail.\nB: smart-crop tracks subject, keeps detail, adds ~'+(total*0.08).toFixed(1)+'s render time.\nPick B if the subject moves, A if the camera already follows.');
    }},
    {id:'f62b10',label:'FRAMING SHEET .TXT',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for FRAMING SHEET .TXT.');return;}
      var lines=['FRAMING SHEET - '+new Date().toISOString(),''];
      for(var i=0;i<clips.length;i++){
        var clip=clips[i];
        var x=(clip.x!=null?clip.x:0.5);
        var y=(clip.y!=null?clip.y:0.4);
        var w=clip.width||16;
        var dur=clip.duration||5;
        lines.push('Clip '+(i+1)+': x '+(x*100).toFixed(0)+'% y '+(y*100).toFixed(0)+'% w '+w+':9 dur '+dur+'s -> thirds '+(Math.abs(x-0.33)<=0.05||Math.abs(x-0.67)<=0.05?'yes':'no')+', headroom '+(y<0.35?'loose':(y>0.65?'tight':'ok'))+', '+((w>=16)?'punch 1.4x':'vertical')+', cover at '+((dur>=3)?(dur*0.6).toFixed(1):'1.0')+'s');
      }
      lines.push('');
      lines.push('generated by FRAMING LAB');
      dl('framing-sheet.txt',lines.join('\n'));
      log('FRAMING SHEET downloaded: framing-sheet.txt ('+lines.length+' lines).');
    }}
  ];
  for(var i=0;i<buttonDefs.length;i++){
    var def=buttonDefs[i];
    var row=mkRow(newCard,def.label);
    mkBtn(def.id,def.label,newCard);
    (function(d){
      var btn=document.getElementById(d.id);
      if(btn){btn.addEventListener('click',function(){try{d.handler();}catch(e){log('FRAMING LAB error: '+e.message);}});}
    })(def);
  }
  log('FRAMING LAB loaded: 10 framing tools ready.');
})();