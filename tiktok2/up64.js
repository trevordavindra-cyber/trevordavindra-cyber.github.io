'use strict';
(function(){
  if(window.__tk2up64){return;}
  window.__tk2up64=true;
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
  cards.forEach(function(c){if(c.innerText.includes('LIGHTING LAB')){target=c;}});
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='MOTION LAB';
  newCard.appendChild(h2);
  if(target&&target.parentNode){
    target.parentNode.insertBefore(newCard,target.nextSibling);
  }else{
    document.body.appendChild(newCard);
  }
  var buttonDefs=[
    {id:'f64b1',label:'MOTION MAP',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for MOTION MAP.');return;}
      var out=[];
      var kinds=['slow push in','static hold','pan right','zoom out','handheld drift','static hold'];
      for(var i=0;i<clips.length;i++){
        var d=(clips[i].duration!=null?clips[i].duration:2.5);
        var k=(d<1.5)?'cut fast, no motion needed':kinds[i%kinds.length];
        out.push('Clip '+(i+1)+' ('+d.toFixed(1)+'s): '+k);
      }
      log('MOTION MAP:\n'+out.join('\n'));
    }},
    {id:'f64b2',label:'ZOOM PUNCHES',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for ZOOM PUNCHES.');return;}
      var n=0,marks=[];
      for(var i=0;i<clips.length;i++){
        var d=(clips[i].duration!=null?clips[i].duration:2.5);
        if(d>=2.0){n++;marks.push('Clip '+(i+1)+' punch 1.25x at '+(d*0.55).toFixed(1)+'s');}
      }
      log('ZOOM PUNCHES: '+n+' punch points on '+clips.length+' clips.\n'+marks.join('\n'));
    }},
    {id:'f64b3',label:'PAN PLAN',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for PAN PLAN.');return;}
      var out=[];
      for(var i=0;i<clips.length;i++){
        var dir=(i%2===0)?'pan right 8%':'pan left 8%';
        out.push('Clip '+(i+1)+': '+dir+' over full clip, ease in-out');
      }
      log('PAN PLAN (alternating, keeps cuts alive):\n'+out.join('\n'));
    }},
    {id:'f64b4',label:'SPEED RAMP',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for SPEED RAMP.');return;}
      var ramp=0;
      for(var i=1;i<clips.length;i++){ramp++;}
      log('SPEED RAMP: ramp 1.0x -> 1.5x into each of '+ramp+' cuts, snap back to 1.0x on the new clip. Best on transition moments, never mid-face shot.');
    }},
    {id:'f64b5',label:'SHAKE PLAN',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for SHAKE PLAN.');return;}
      var heavy=0;
      for(var i=0;i<clips.length;i++){
        var d=(clips[i].duration!=null?clips[i].duration:2.5);
        if(d>3.0){heavy++;}
      }
      log('SHAKE PLAN: add subtle 2px handheld shake on '+heavy+' long clips, none on short cuts. Shake reads as energy only under 3px.');
    }},
    {id:'f64b6',label:'KEN BURNS',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for KEN BURNS.');return;}
      var stills=0;
      for(var i=0;i<clips.length;i++){
        var d=(clips[i].duration!=null?clips[i].duration:2.5);
        if(d>=3.0){stills++;}
      }
      log('KEN BURNS: slow 105% -> 115% zoom over '+stills+' still/long clips, origin alternates center / lower third so no two drift the same way.');
    }},
    {id:'f64b7',label:'PARALLAX PLAN',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for PARALLAX PLAN.');return;}
      log('PARALLAX PLAN: on '+clips.length+' clips, move foreground 1.3x and background 0.7x in the same direction for 0.8s after each cut. Depth reads even on flat footage.');
    }},
    {id:'f64b8',label:'MOTION CONTINUITY',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for MOTION CONTINUITY.');return;}
      var jumps=0;
      for(var i=1;i<clips.length;i++){
        var d1=(clips[i-1].duration!=null?clips[i-1].duration:2.5);
        var d2=(clips[i].duration!=null?clips[i].duration:2.5);
        if(Math.abs(d1-d2)>2.0){jumps++;}
      }
      log('MOTION CONTINUITY: '+jumps+' pace jumps across '+(clips.length-1)+' cuts. Fix long-to-short jumps with a 0.2s whip, short-to-long with a 6-frame hold.');
    }},
    {id:'f64b9',label:'MOTION ENERGY',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for MOTION ENERGY.');return;}
      var total=0,energy=[];
      for(var i=0;i<clips.length;i++){
        var d=(clips[i].duration!=null?clips[i].duration:2.5);
        total+=d;
        var e=(d<1.5?'HIGH':(d<3.0?'MID':'LOW'));
        energy.push(e);
      }
      var avg=(total/clips.length);
      log('MOTION ENERGY: avg clip '+avg.toFixed(1)+'s. Curve: '+energy.join(' -> ')+'\nRule: every 4th clip should break the pattern or the edit flatlines.');
    }},
    {id:'f64b10',label:'MOTION SHEET .TXT',handler:function(){
      var clips=getClips();
      if(!clips){log('Add clips first for MOTION SHEET.');return;}
      var txt='MOTION SHEET\n================\nClips: '+clips.length+'\n';
      for(var i=0;i<clips.length;i++){
        var d=(clips[i].duration!=null?clips[i].duration:2.5);
        txt+='Clip '+(i+1)+' | '+d.toFixed(1)+'s | motion: '+(d<1.5?'cut fast':(d<3.0?'pan + punch':'ken burns + shake'))+'\n';
      }
      txt+='Generated by MOTION LAB (up64)\n';
      dl('motion-sheet.txt',txt);
      log('MOTION SHEET saved as motion-sheet.txt');
    }}
  ];
  for(var b=0;b<buttonDefs.length;b++){
    var def=buttonDefs[b];
    var btn=mkBtn(def.id,def.label,null);
    (function(d,btnEl){
      btnEl.addEventListener('click',function(){d.handler();});
    })(def,btn);
    mkRow(newCard,def.label).appendChild(btn);
  }
  log('MOTION LAB loaded: 10 motion tools ready.');
})();