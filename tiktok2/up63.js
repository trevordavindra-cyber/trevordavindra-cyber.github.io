'use strict';
(function(){
  if(window.__tk2up63){return;}
  window.__tk2up63=true;
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
  cards.forEach(function(c){if(c.innerText.includes('FRAMING LAB')){target=c;}});
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='LIGHTING LAB';
  newCard.appendChild(h2);
  if(target&&target.parentNode){
    target.parentNode.insertBefore(newCard,target.nextSibling);
  }else{
    document.body.appendChild(newCard);
  }
  var buttonDefs=[
    {id:'f63b1',label:'EXPOSURE PASS',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for EXPOSURE PASS.');return;}
      var out=[];
      for(var i=0;i<clips.length;i++){
        var clip=clips[i];
        var br=(clip.brightness!=null?clip.brightness:0.5);
        var adj=(br<0.35)?'+0.3 stop lift':(br>0.75?'pull -0.2 stop, highlight risk':'balanced, keep');
        out.push('Clip '+(i+1)+': exposure '+(br<0.35?'dark':(br>0.75?'hot':'mid'))+' -> '+adj);
      }
      log(out.join('\n'));
    }},
    {id:'f63b2',label:'SHADOW LIFT',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for SHADOW LIFT.');return;}
      var n=0;
      for(var i=0;i<clips.length;i++){
        var br=(clips[i].brightness!=null?clips[i].brightness:0.5);
        if(br<0.4){n++;}
      }
      log('SHADOW LIFT: lift shadows 12% on '+n+' of '+clips.length+' clips (dark clips first), keep blacks above 8 IRE for TikTok compression.');
    }},
    {id:'f63b3',label:'HIGHLIGHT CLIP',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for HIGHLIGHT CLIP.');return;}
      var hot=0;
      for(var i=0;i<clips.length;i++){
        var br=(clips[i].brightness!=null?clips[i].brightness:0.5);
        if(br>0.75){hot++;}
      }
      log('HIGHLIGHT CLIP: roll off highlights on '+hot+' of '+clips.length+' clips at 90 IRE, +1% softness keeps skin from clipping.');
    }},
    {id:'f63b4',label:'CONTRAST CHECK',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for CONTRAST CHECK.');return;}
      var mid=0;
      for(var i=0;i<clips.length;i++){
        var br=(clips[i].brightness!=null?clips[i].brightness:0.5);
        if(br>=0.4&&br<=0.7){mid++;}
      }
      log('CONTRAST CHECK: '+mid+'/'+clips.length+' clips sit in safe mid exposure. Add +8 contrast on flat shots, pull 5 on high-key ones, re-check after color pass.');
    }},
    {id:'f63b5',label:'WARMTH PLAN',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for WARMTH PLAN.');return;}
      var out=[];
      for(var i=0;i<clips.length;i++){
        var clip=clips[i];
        var warm=(i%3===0)?'+6 warm':((i%3===1)?'neutral':'+4 cool');
        out.push('Clip '+(i+1)+': '+warm+' ('+((i%3===0)?'talking / hook':((i%3===1)?'b-roll':'cutaway'))+')');
      }
      log(out.join('\n'));
    }},
    {id:'f63b6',label:'VIGNETTE PLAN',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for VIGNETTE PLAN.');return;}
      var out=[];
      for(var i=0;i<clips.length;i++){
        var dur=clips[i].duration||5;
        var amt=(i===0)?18:(dur>=5?10:6);
        out.push('Clip '+(i+1)+': vignette '+amt+'%'+(i===0?' (hook clip, strongest)':''));
      }
      log(out.join('\n'));
    }},
    {id:'f63b7',label:'FILM GRAIN',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for FILM GRAIN.');return;}
      var g=clips.length>8?4:2;
      log('FILM GRAIN: '+g+'% grain across '+clips.length+' clips ('+(g===2?'subtle, keeps text legible':'punchy, hides compression banding on a long edit')+'). Skip grain on caption-only clips.');
    }},
    {id:'f63b8',label:'BLOOM PLAN',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for BLOOM PLAN.');return;}
      var out=[];
      for(var i=0;i<clips.length;i++){
        var clip=clips[i];
        var br=(clip.brightness!=null?clip.brightness:0.5);
        out.push('Clip '+(i+1)+': bloom '+(br>0.65?'on (8% radius)':'off')+' - '+(br>0.65?'bright source will glow':'not enough highlights to bloom'));
      }
      log(out.join('\n'));
    }},
    {id:'f63b9',label:'LIGHTING CONTINUITY',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for LIGHTING CONTINUITY.');return;}
      var jumps=0;
      var prev=null;
      for(var i=0;i<clips.length;i++){
        var br=(clips[i].brightness!=null?clips[i].brightness:0.5);
        if(prev!=null&&Math.abs(br-prev)>0.3){jumps++;}
        prev=br;
      }
      log('LIGHTING CONTINUITY: '+jumps+' big exposure jumps across cuts. Match the dark clip to its neighbor by LIFTING IT 0.2, not by darkening the bright one.');
    }},
    {id:'f63b10',label:'LIGHTING SHEET .TXT',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for LIGHTING SHEET .TXT.');return;}
      var lines=['LIGHTING SHEET - '+new Date().toISOString(),''];
      for(var i=0;i<clips.length;i++){
        var clip=clips[i];
        var br=(clip.brightness!=null?clip.brightness:0.5);
        var dur=clip.duration||5;
        lines.push('Clip '+(i+1)+': exposure '+(br<0.35?'dark':(br>0.75?'hot':'mid'))+' ('+(br*100).toFixed(0)+'%), vignette '+((i===0)?18:(dur>=5?10:6))+'%, grain 2%, bloom '+(br>0.65?'on':'off'));
      }
      lines.push('');
      lines.push('generated by LIGHTING LAB');
      dl('lighting-sheet.txt',lines.join('\n'));
      log('LIGHTING SHEET downloaded: lighting-sheet.txt ('+lines.length+' lines).');
    }}
  ];
  for(var i=0;i<buttonDefs.length;i++){
    var def=buttonDefs[i];
    var row=mkRow(newCard,def.label);
    mkBtn(def.id,def.label,newCard);
    (function(d){
      var btn=document.getElementById(d.id);
      if(btn){btn.addEventListener('click',function(){try{d.handler();}catch(e){log('LIGHTING LAB error: '+e.message);}});}
    })(def);
  }
  log('LIGHTING LAB loaded: 10 lighting tools ready.');
})();