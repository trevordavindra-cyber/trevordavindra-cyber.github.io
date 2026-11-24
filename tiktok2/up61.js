'use strict';
(function(){
  if(window.__tk2up61){return;}
  window.__tk2up61=true;
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
  cards.forEach(function(c){if(c.innerText.includes('SCRIPT LAB')){target=c;}});
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='PACING LAB';
  newCard.appendChild(h2);
  if(target&&target.parentNode){
    target.parentNode.insertBefore(newCard,target.nextSibling);
  }else{
    document.body.appendChild(newCard);
  }
  var buttonDefs=[
    {id:'f61b1',label:'PACING SCORE',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for PACING SCORE.');return;}
      var out=[];
      for(var i=0;i<clips.length;i++){
        var clip=clips[i]; var dur=clip.duration||5;
        var score=10; if(dur>8)score=6; else if(dur>6)score=7; else if(dur>4)score=8; else if(dur>3)score=9;
        var note=score>=9?'punchy, hold it':(score>=8?'tight, good':'long, tighten this one');
        out.push('Clip '+(i+1)+': '+dur+'s -> pace score '+score+'/10 ('+note+')');
      }
      log(out.join('\n'));
    }},
    {id:'f61b2',label:'CUT CADENCE',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for CUT CADENCE.');return;}
      var total=0;
      for(var i=0;i<clips.length;i++){total+=(clips[i].duration||5);}
      var avg=total/clips.length;
      var cuts10=Math.round(10/avg*10)/10;
      var verdict=avg<=2.5?'fast-cut style, strong for feeds':(avg<=4?'mid cadence, safe and readable':'slow cadence, tighten for a feed');
      log('Total '+Math.round(total*10)/10+'s across '+clips.length+' clips, avg clip '+Math.round(avg*10)/10+'s, ~'+cuts10+' cuts per 10s. '+verdict+'.');
    }},
    {id:'f61b3',label:'SPEED RAMP PLAN',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for SPEED RAMP PLAN.');return;}
      var out=[];
      for(var i=0;i<clips.length;i++){
        var dur=clips[i].duration||5;
        var at=Math.round(dur*0.6*10)/10;
        out.push('Clip '+(i+1)+': 1.0x for '+at+'s, ramp to 1.5x for last '+Math.round((dur-at)*10)/10+'s, snap back to 1.0x on cut');
      }
      log(out.join('\n'));
    }},
    {id:'f61b4',label:'FREEZE FRAME',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for FREEZE FRAME.');return;}
      var best=0,bestScore=-1;
      for(var i=0;i<clips.length;i++){
        var dur=clips[i].duration||5;
        if(dur>bestScore){bestScore=dur;best=i;}
      }
      var dur=clips[best].duration||5;
      var at=Math.round(dur*0.5*10)/10;
      log('Freeze the longest clip: Clip '+(best+1)+' ('+(clips[best].name||'untitled')+') at '+at+'s, hold 1.0s, add zoom-in text overlay during the hold.');
    }},
    {id:'f61b5',label:'TIME REMAP',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for TIME REMAP.');return;}
      var out=[];
      for(var i=0;i<clips.length;i++){
        var dur=clips[i].duration||5;
        var speed=dur>5?1.25:(dur<3?1.0:1.1);
        out.push('Clip '+(i+1)+': play at '+speed+'x (new on-screen '+Math.round(dur/speed*10)/10+'s)');
      }
      log(out.join('\n'));
    }},
    {id:'f61b6',label:'SLOW-MO PICKS',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for SLOW-MO PICKS.');return;}
      var picks=[];
      for(var i=0;i<clips.length;i++){
        var dur=clips[i].duration||5;
        if(dur>=4){picks.push('Clip '+(i+1)+' ('+dur+'s): 0.5x for the middle 1.5s, back to 1.0x on the cut');}
      }
      log(picks.length>0?picks.join('\n'):'No clip is 4s or longer, so no slow-mo picks this cut.');
    }},
    {id:'f61b7',label:'JUMP CUT PLAN',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for JUMP CUT PLAN.');return;}
      var out=[]; var any=false;
      for(var i=0;i<clips.length;i++){
        var dur=clips[i].duration||5;
        if(dur>6){
          any=true;
          var n=Math.floor(dur/6);
          out.push('Clip '+(i+1)+': '+dur+'s -> '+n+' jump cut'+(n>1?'s':'')+' at '+Math.round(dur/(n+1)*10)/10+'s intervals, trim 0.3s each');
        }
      }
      log(any?out.join('\n'):'No clip over 6s, nothing needs a jump cut.');
    }},
    {id:'f61b8',label:'BEAT SPACING',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for BEAT SPACING.');return;}
      var bpm=120; var beat=60/bpm;
      var drift=0;
      var out=[];
      for(var i=0;i<clips.length;i++){
        var dur=clips[i].duration||5;
        var beats=Math.round(dur/beat);
        var ideal=beats*beat;
        drift+=(dur-ideal);
        out.push('Clip '+(i+1)+': '+dur+'s = '+beats+' beats at 120bpm, snap to '+Math.round(ideal*100)/100+'s (drift '+Math.round((dur-ideal)*100)/100+'s)');
      }
      out.push('Total drift vs beat grid: '+Math.round(drift*100)/100+'s');
      log(out.join('\n'));
    }},
    {id:'f61b9',label:'PACING A/B',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for PACING A/B.');return;}
      var total=0;
      for(var i=0;i<clips.length;i++){total+=(clips[i].duration||5);}
      log('Variant A (fast): trim every clip 20%, total '+Math.round(total*0.8*10)/10+'s, one cut per beat, best for feeds.\nVariant B (breath): keep lengths, add 0.3s pause between cuts, total '+Math.round((total+clips.length*0.3)*10)/10+'s, best for story-led edits.\nTest A on the next post, B on the one after, keep the winner.');
    }},
    {id:'f61b10',label:'PACING SHEET .TXT',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for PACING SHEET .TXT.');return;}
      var lines=[];
      lines.push('PACING LAB SHEET');
      lines.push('Clips: '+clips.length);
      lines.push('');
      for(var i=0;i<clips.length;i++){
        var clip=clips[i]; var dur=clip.duration||5;
        var beats=Math.round(dur/(60/120));
        lines.push('Clip '+(i+1)+' - '+(clip.name||'untitled'));
        lines.push('Duration: '+dur+'s | '+beats+' beats @120bpm | speed '+((dur>5)?'1.25x':(dur<3?'1.0x':'1.1x')));
        lines.push('Ramp: 1.0x for '+Math.round(dur*0.6*10)/10+'s then 1.5x');
        lines.push('');
      }
      var txt=lines.join('\n');
      dl('pacing-sheet.txt',txt); log('pacing-sheet.txt downloaded');
    }}
  ];
  buttonDefs.forEach(function(def){
    var row=mkRow(newCard,def.label);
    var btn=mkBtn(def.id,def.label,row);
    btn.addEventListener('click',def.handler);
  });
})();