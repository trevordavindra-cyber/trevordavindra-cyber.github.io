'use strict';
(function(){
  if(window.__tk2up66){return;}
  window.__tk2up66=true;
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
  var clips=S.clips||[];
  var cards=document.querySelectorAll('div');
  var target=null;
  cards.forEach(function(c){if(c.innerText.includes('SOUND LAB')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='CAPTIONS LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
  var FONT=['Montserrat','Poppins','Bebas Neue','Anton','Impact'];
  var fmt=function(s){return (Math.round(s*10)/10)+'s';};
  var safe=function(txt,n){return (txt||'').slice(0,n||28);};
  var defs=[
    {id:'f66b1',label:'CAPTION AUDIT',handler:function(){
      if(!clips.length){log('CAPTION AUDIT: no clips loaded yet');return;}
      var withCap=0,tooLong=0,rows=[];
      clips.forEach(function(c,i){
        var cap=safe(c.caption||c.text||'');
        var n=cap.length;
        if(n>0){withCap++;}
        if(n>64){tooLong++;}
        rows.push('clip '+(i+1)+' ('+fmt(c.dur||3)+') '+n+' chars: '+(cap?cap:'(none)'));
      });
      log('CAPTION AUDIT '+clips.length+' clips: '+withCap+' with captions, '+tooLong+' over 64 chars (hard to read on screen).');
      rows.forEach(function(r){log('  '+r);});
    }},
    {id:'f66b2',label:'HOOK LINE',handler:function(){
      if(!clips.length){log('HOOK LINE: no clips loaded yet');return;}
      var c=clips[0];
      var cur=safe(c.caption||c.text||'',40);
      var hook=cur&&cur.length>0?cur.toUpperCase():'WAIT FOR IT';
      log('HOOK LINE: first 1.5s of clip 1 shows 1 short hook line in caps: "'+hook+'" (max 5 words, cut anything longer). Hook caption on screen 0.0-1.5s, then swap to clip caption at 1.5s.');
    }},
    {id:'f66b3',label:'KARAOKE SPLIT',handler:function(){
      if(!clips.length){log('KARAOKE SPLIT: no clips loaded yet');return;}
      var total=0,wordRows=[];
      clips.forEach(function(c){
        var cap=safe(c.caption||c.text||'');
        var words=cap.split(/\s+/).filter(Boolean);
        var per=words.length?((c.dur||3)/words.length):0;
        words.forEach(function(w){
          total+=per;
          wordRows.push(fmt(total)+' '+w);
        });
      });
      log('KARAOKE SPLIT: word-by-word timing across '+clips.length+' clips, '+wordRows.length+' words, each word lit for '+fmt(wordRows.length?(total/wordRows.length):0)+'. First beats: '+wordRows.slice(0,3).join(' | '));
    }},
    {id:'f66b4',label:'SAFETY ZONES',handler:function(){
      if(!clips.length){log('SAFETY ZONES: no clips loaded yet');return;}
      var low=0;
      clips.forEach(function(c){var cap=safe(c.caption||c.text||'');if(cap.length>34){low++;}});
      log('SAFETY ZONES: keep captions out of top 15% (username/search) and bottom 20% (caption/CTA strip) of the 9:16 frame. '+low+' of '+clips.length+' clips carry lines long enough to wrap low; keep those one line max or center them.');
    }},
    {id:'f66b5',label:'FONT STACK',handler:function(){
      log('FONT STACK: headline '+FONT[2]+' caps for hook + captions, '+FONT[0]+' for body text, '+FONT[1]+' for CTA/end card. Consistent per project, one style change max per edit. Suggest 64px captions with 4px black stroke, drop shadow 40%.');
    }},
    {id:'f66b6',label:'EMPHASIS PASS',handler:function(){
      if(!clips.length){log('EMPHASIS PASS: no clips loaded yet');return;}
      var n=0,rows=[];
      clips.forEach(function(c,i){
        var cap=safe(c.caption||c.text||'');
        var words=cap.split(/\s+/).filter(Boolean);
        if(words.length){
          var pick=words[words.length-1].replace(/[^\w$%]/g,'');
          if(pick){n++;rows.push('clip '+(i+1)+' highlight "'+pick+'"');}
        }
      });
      log('EMPHASIS PASS: '+n+' highlight words picked (last noun/number of each line, color #FFD400 or pulse scale 1.15x). '+rows.slice(0,4).join('; '));
    }},
    {id:'f66b7',label:'READ SPEED',handler:function(){
      if(!clips.length){log('READ SPEED: no clips loaded yet');return;}
      var ok=0,tooFast=0,rows=[];
      clips.forEach(function(c,i){
        var cap=safe(c.caption||c.text||'');
        var dur=c.dur||3;
        var cps=dur>0?cap.length/dur:0;
        if(!cap.length){ok++;}
        else if(cps<=17){ok++;}else{tooFast++;}
        rows.push('clip '+(i+1)+' '+Math.round(cps)+' cps');
      });
      log('READ SPEED: '+ok+' clips at readable pace (target under 17 chars/sec), '+tooFast+' too fast. '+rows.slice(0,5).join(', '));
    }},
    {id:'f66b8',label:'CAPTION RHYTHM',handler:function(){
      if(!clips.length){log('CAPTION RHYTHM: no clips loaded yet');return;}
      var swaps=0;
      clips.forEach(function(c){
        var cap=safe(c.caption||c.text||'');
        var words=cap.split(/\s+/).filter(Boolean);
        swaps+=Math.max(1,Math.ceil(words.length/3));
      });
      log('CAPTION RHYTHM: break lines at 3-4 words max, one line on screen at a time: about '+swaps+' caption swaps across the edit (max 2 on screen per beat). Swap captions on cuts, never mid-shot.');
    }},
    {id:'f66b9',label:'EMOJI POLICY',handler:function(){
      if(!clips.length){log('EMOJI POLICY: no clips loaded yet');return;}
      log('EMOJI POLICY: max 1 emoji per caption line, never in the hook, never inside a word. Use emoji as a period-level punch on the final word of a line only ('+clips.length+' clips: suggest 2-3 emoji total across the edit).');
    }},
    {id:'f66b10',label:'CAPTION SHEET .TXT',handler:function(){
      if(!clips.length){log('CAPTION SHEET: no clips loaded yet');return;}
      var L=['CAPTIONS LAB SHEET'];
      L.push('clips: '+clips.length);
      L.push('');
      clips.forEach(function(c,i){
        var cap=safe(c.caption||c.text||'');
        var dur=c.dur||3;
        L.push('clip '+(i+1)+' '+fmt(dur)+': '+cap);
        L.push('  chars '+cap.length+' cps '+(dur>0?Math.round(cap.length/dur):0)+' words '+(cap.split(/\s+/).filter(Boolean)).length);
      });
      L.push('');
      L.push('zones: keep out of top 15% and bottom 20%');
      L.push('font: '+FONT[2]+' caps hook / '+FONT[0]+' body / '+FONT[1]+' CTA');
      L.push('read speed target: under 17 chars/sec');
      var txt=L.join('\n');
      dl('captions-sheet.txt',txt);
      log('CAPTION SHEET .TXT written: captions-sheet.txt ('+txt.length+' bytes)');
    }}
  ];
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
})();
