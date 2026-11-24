'use strict';
(function(){
  if(window.__tk2up65){return;}
  window.__tk2up65=true;
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
  function dur(c){return (c&&c.duration!=null)?c.duration:2.5;}
  var cards=document.querySelectorAll('.card');
  var target=null;
  cards.forEach(function(c){if(c.innerText.includes('MOTION LAB')){target=c;}});
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='SOUND LAB';
  newCard.appendChild(h2);
  if(target&&target.parentNode){
    target.parentNode.insertBefore(newCard,target.nextSibling);
  }else{
    document.body.appendChild(newCard);
  }
  var buttonDefs=[
    {id:'f65b1',label:'DUCK MAP',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for DUCK MAP.');return;}
      var out=[];
      for(var i=0;i<clips.length;i++){
        var d=dur(clips[i]);
        out.push('Clip '+(i+1)+' ('+d.toFixed(1)+'s): music -8dB under voice, release +0.4s');
      }
      log('DUCK MAP:\n'+out.join('\n'));
    }},
    {id:'f65b2',label:'EQ PASS',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for EQ PASS.');return;}
      log('EQ PASS: voice highpass 80Hz, presence boost +3dB at 3kHz, de-ess 6-8kHz on '+clips.length+' clips. Music: lowpass 12kHz, dip 2dB at 2-4kHz so voice cuts through.');
    }},
    {id:'f65b3',label:'BEAT SYNC',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for BEAT SYNC.');return;}
      var t=0,snaps=[],n=0;
      for(var i=0;i<clips.length;i++){t+=dur(clips[i]);}
      var beats=t/(60/120);
      for(var j=0;j<clips.length-1;j++){n++;}
      snaps.push('Total '+t.toFixed(1)+'s = '+beats.toFixed(1)+' beats at 120 BPM ('+(t/0.5).toFixed(0)+' half-beats).');
      snaps.push(n+' internal cuts: snap each cut to the nearest half-beat, drift under 120ms reads as on-beat.');
      log('BEAT SYNC:\n'+snaps.join('\n'));
    }},
    {id:'f65b4',label:'SFX PLAN',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for SFX PLAN.');return;}
      var kinds=['whoosh','riser','impact','swipe'];
      var out=[];
      for(var i=1;i<clips.length;i++){
        out.push('Cut '+i+': '+kinds[(i-1)%kinds.length]+' 0.3s, duck music -3dB under it');
      }
      log('SFX PLAN: '+out.length+' cut effects on '+clips.length+' clips.\n'+(out.join('\n')||'no cuts yet'));
    }},
    {id:'f65b5',label:'VO PLAN',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for VO PLAN.');return;}
      var out=[],words=0;
      for(var i=0;i<clips.length;i++){
        var d=dur(clips[i]);
        var w=Math.round(d*2.6);
        words+=w;
        out.push('Clip '+(i+1)+': '+w+' words max at 156 wpm');
      }
      log('VO PLAN: ~'+words+' words total, hook in first 1.5s, no VO over the end card.\n'+out.join('\n'));
    }},
    {id:'f65b6',label:'LEVEL PASS',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for LEVEL PASS.');return;}
      log('LEVEL PASS: target -14 LUFS for TikTok on '+clips.length+' clips. Voice -3dBFS peaks, music -18 LUFS under voice, -12 when solo. True peak under -1.0dBTP, no limiter pumping.');
    }},
    {id:'f65b7',label:'MUSIC BED',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for MUSIC BED.');return;}
      var moods=['phonk drift','hyperpop blip','ambient pad','trap 808'];
      var out=[];
      for(var i=0;i<clips.length;i++){
        out.push('Clip '+(i+1)+': '+moods[i%moods.length]);
      }
      log('MUSIC BED (one bed, mood shifts on cuts):\n'+out.join('\n')+'\nKeep one key: minor works for every mood here.');
    }},
    {id:'f65b8',label:'FADES',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for FADES.');return;}
      var first=dur(clips[0]),last=dur(clips[clips.length-1]);
      log('FADES: music fade in '+Math.min(0.5,first*0.2).toFixed(1)+'s on clip 1, fade out '+Math.min(0.8,last*0.3).toFixed(1)+'s on clip '+clips.length+', voice never faded. End on the beat, not into silence.');
    }},
    {id:'f65b9',label:'AUDIO CONTINUITY',handler:function(){
      var clips=getClips(); if(!clips){log('Add clips first for AUDIO CONTINUITY.');return;}
      var jumps=0;
      for(var i=1;i<clips.length;i++){
        var d1=dur(clips[i-1]),d2=dur(clips[i]);
        if(Math.abs(d1-d2)>2.0){jumps++;}
      }
      log('AUDIO CONTINUITY: '+jumps+' level jumps across '+(clips.length-1)+' cuts. Smooth long-to-short with a 0.15s music swell, short-to-long with a 0.3s duck.');
    }},
    {id:'f65b10',label:'SOUND SHEET .TXT',handler:function(){
      var clips=getClips();
      if(!clips){log('Add clips first for SOUND SHEET.');return;}
      var txt='SOUND SHEET\n================\nClips: '+clips.length+'\nTarget: -14 LUFS / 120 BPM grid\n';
      for(var i=0;i<clips.length;i++){
        var d=dur(clips[i]);
        txt+='Clip '+(i+1)+' | '+d.toFixed(1)+'s | duck -8dB | VO '+Math.round(d*2.6)+' words | sfx '+(i===0?'none':'whoosh cycle')+'\n';
      }
      txt+='Generated by SOUND LAB (up65)\n';
      dl('sound-sheet.txt',txt);
      log('SOUND SHEET saved as sound-sheet.txt');
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
  log('SOUND LAB loaded: 10 sound tools ready.');
})();