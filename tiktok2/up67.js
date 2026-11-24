'use strict';
(function(){
  if(window.__tk2up67){return;}
  window.__tk2up67=true;
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
  cards.forEach(function(c){if(c.innerText.includes('CAPTIONS LAB')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='TRANSITIONS LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
  var fmt=function(s){return (Math.round(s*10)/10)+'s';};
  var pairs=function(){var out=[];for(var i=0;i<clips.length-1;i++){out.push([i,clips[i],clips[i+1]]);}return out;};
  function safeClip(c){return ((c&&(c.caption||c.text))||'clip').slice(0,12);}
  var defs=[
    {id:'f67b1',label:'TRANSITION MAP',handler:function(){
      if(clips.length<2){log('TRANSITION MAP: need at least 2 clips, have '+clips.length);return;}
      var kinds={hard:0,whip:0,zoom:0,flash:0,glitch:0};
      var rows=[];
      pairs().forEach(function(p,i){
        var a=p[1],b=p[2];
        var ad=a.dur||3,bd=b.dur||3;
        var kind;
        if(ad<=2||bd<=2){kind='flash';}
        else if(i%3===0){kind='whip';}
        else if(i%3===1){kind='zoom';}
        else{kind='glitch';}
        kinds[kind]++;
        rows.push('cut '+(i+1)+' clip '+(i+1)+'->'+(i+2)+' '+fmt(ad)+'->'+fmt(bd)+': '+kind);
      });
      log('TRANSITION MAP '+clips.length+' clips, '+(clips.length-1)+' cuts: '+kinds.whip+' whip, '+kinds.zoom+' zoom, '+kinds.glitch+' glitch, '+kinds.flash+' flash, rest hard cuts on beat.');
      rows.forEach(function(r){log('  '+r);});
    }},
    {id:'f67b2',label:'WHIP PAN',handler:function(){
      if(clips.length<2){log('WHIP PAN: need at least 2 clips');return;}
      var rows=[];
      pairs().forEach(function(p,i){
        if(i%3===0){rows.push('cut '+(i+1)+' clip '+(i+1)+'->'+(i+2)+': whip pan left, 6 frames, motion blur carries across the cut');}
      });
      log('WHIP PAN PLAN: '+rows.length+' whip cuts of '+(clips.length-1)+' total (every 3rd cut). '+rows.slice(0,2).join(' | '));
    }},
    {id:'f67b3',label:'ZOOM BLUR',handler:function(){
      if(clips.length<2){log('ZOOM BLUR: need at least 2 clips');return;}
      var rows=[];
      pairs().forEach(function(p,i){
        if(i%3===1){var b=p[2];rows.push('cut '+(i+1)+' into clip '+(i+2)+' ('+fmt(b.dur||3)+'): zoom blur punch 1.0->1.3x over 4 frames');}
      });
      log('ZOOM BLUR PLAN: '+rows.length+' zoom-blur cuts. '+rows.slice(0,2).join(' | '));
    }},
    {id:'f67b4',label:'GLITCH CUT',handler:function(){
      if(clips.length<2){log('GLITCH CUT: need at least 2 clips');return;}
      var rows=[];
      pairs().forEach(function(p,i){
        if(i%3===2){rows.push('cut '+(i+1)+': RGB-split glitch 3 frames + 1 black frame, land on beat');}
      });
      log('GLITCH CUT PLAN: '+rows.length+' glitch cuts (every 3rd cut, never twice in a row). '+rows.slice(0,2).join(' | '));
    }},
    {id:'f67b5',label:'FLASH CUT',handler:function(){
      if(!clips.length){log('FLASH CUT: no clips loaded yet');return;}
      var shorts=0;
      clips.forEach(function(c){if((c.dur||3)<=2){shorts++;}});
      log('FLASH CUT: white flash 2 frames only on cuts INTO a fast clip ('+shorts+' clips at 2s or shorter get flash-ins). Never on the first cut, never twice in a row, keep the flash under 80ms.');
    }},
    {id:'f67b6',label:'MATCH CUT',handler:function(){
      if(clips.length<2){log('MATCH CUT: need at least 2 clips');return;}
      var rows=[];
      pairs().forEach(function(p,i){
        var a=safeClip(p[1]),b=safeClip(p[2]);
        if(i%2===0){rows.push('cut '+(i+1)+': match on motion, end clip '+(i+1)+' moving right, start clip '+(i+2)+' moving right ('+a+' -> '+b+')');}
      });
      log('MATCH CUT PLAN: '+rows.length+' motion-match candidates. '+rows.slice(0,2).join(' | '));
    }},
    {id:'f67b7',label:'J-CUT AUDIO',handler:function(){
      if(clips.length<2){log('J-CUT AUDIO: need at least 2 clips');return;}
      var rows=[];
      pairs().forEach(function(p,i){
        if(i%4===0){rows.push('cut '+(i+1)+': audio from clip '+(i+2)+' leads 0.3s before the picture cut');}
      });
      log('J-CUT AUDIO PLAN: '+rows.length+' J-cuts (every 4th cut), 0.3s audio lead-in, rest of cuts stay hard. '+rows.slice(0,2).join(' | '));
    }},
    {id:'f67b8',label:'SPEED TRANSITION',handler:function(){
      if(clips.length<2){log('SPEED TRANSITION: need at least 2 clips');return;}
      var rows=[];
      pairs().forEach(function(p,i){
        var ad=p[1].dur||3;
        if(ad>2.5){rows.push('cut '+(i+1)+': ramp clip '+(i+1)+' 1.0x->1.5x in its last 0.4s, land on the cut');}
      });
      log('SPEED TRANSITION PLAN: '+rows.length+' ramp-out cuts on clips over 2.5s. '+rows.slice(0,2).join(' | '));
    }},
    {id:'f67b9',label:'TRANSITION A/B',handler:function(){
      if(clips.length<2){log('TRANSITION A/B: need at least 2 clips');return;}
      var cuts=clips.length-1;
      log('TRANSITION A/B: A = all hard cuts (fastest, rawest, zero render cost) vs B = styled pack above ('+Math.max(1,Math.floor(cuts/3))+' whips + '+Math.max(1,Math.floor((cuts-1)/3))+' zooms + '+Math.max(1,Math.floor((cuts-2)/3))+' glitches, adds about '+(cuts*2)+'s render time). Verdict: B for phonk edits, A for talking or story edits.');
    }},
    {id:'f67b10',label:'TRANSITION SHEET .TXT',handler:function(){
      if(clips.length<2){log('TRANSITION SHEET: need at least 2 clips');return;}
      var L=['TRANSITIONS LAB SHEET'];
      L.push('clips: '+clips.length+' cuts: '+(clips.length-1));
      L.push('');
      pairs().forEach(function(p,i){
        var a=p[1],b=p[2];
        var kind;
        if((a.dur||3)<=2||(b.dur||3)<=2){kind='flash-in';}
        else if(i%3===0){kind='whip pan L';}
        else if(i%3===1){kind='zoom blur 1.3x';}
        else{kind='glitch 3f';}
        L.push('cut '+(i+1)+' clip '+(i+1)+'->'+(i+2)+' '+fmt(a.dur||3)+'->'+fmt(b.dur||3)+': '+kind);
      });
      L.push('');
      L.push('rules: max 1 styled transition every 2 cuts, never 2 styles back to back, all cuts on beat');
      var txt=L.join('\n');
      dl('transitions-sheet.txt',txt);
      log('TRANSITION SHEET .TXT written: transitions-sheet.txt ('+txt.length+' bytes)');
    }}
  ];
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
})();
