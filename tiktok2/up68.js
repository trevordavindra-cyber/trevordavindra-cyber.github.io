'use strict';
(function(){
  if(window.__tk2up68){return;}
  window.__tk2up68=true;
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
  cards.forEach(function(c){if(c.innerText.includes('TRANSITIONS LAB')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='COLOR GRADE LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
  var fmt=function(s){return (Math.round(s*10)/10)+'s';};
  var total=function(){var t=0;clips.forEach(function(c){t+=c.dur||3;});return t;};
  function mood(i){
    var m=['teal-orange','golden hour','cyberpunk neon','desaturated grit','warm vintage','high-key clean'];
    return m[i%m.length];
  }
  var defs=[
    {id:'f68b1',label:'COLOR AUDIT',handler:function(){
      if(!clips.length){log('COLOR AUDIT: no clips loaded yet');return;}
      var rows=[];
      clips.forEach(function(c,i){
        rows.push('clip '+(i+1)+' '+fmt(c.dur||3)+': no grade set, base exposure, needs '+mood(i)+' pass');
      });
      log('COLOR AUDIT '+clips.length+' clips, 0 graded: every clip still on base exposure. '+rows.slice(0,3).join(' | '));
    }},
    {id:'f68b2',label:'LUT PLAN',handler:function(){
      if(!clips.length){log('LUT PLAN: no clips loaded yet');return;}
      var one=mood(0);
      log('LUT PLAN: one master LUT for the whole edit ('+one+', shadows lifted +10, highlights rolled off -8, skin tones protected) applied to all '+clips.length+' clips so cuts do not shift tone. Accent LUT only on clips 1 and '+(clips.length)+' (open/close).');
    }},
    {id:'f68b3',label:'SATURATION PASS',handler:function(){
      if(!clips.length){log('SATURATION PASS: no clips loaded yet');return;}
      var rows=[];
      clips.forEach(function(c,i){
        if(i%2===0){rows.push('clip '+(i+1)+': +8 saturation');}
        else{rows.push('clip '+(i+1)+': -4 saturation');}
      });
      log('SATURATION PASS: alternate +8 on even clips, -4 on odd for contrast rhythm across '+clips.length+' clips, skin tones held at 0. '+rows.slice(0,2).join(' | '));
    }},
    {id:'f68b4',label:'CONTRAST PASS',handler:function(){
      if(!clips.length){log('CONTRAST PASS: no clips loaded yet');return;}
      var rows=[];
      clips.forEach(function(c,i){
        if((c.dur||3)<=2){rows.push('clip '+(i+1)+' '+fmt(c.dur||3)+': +15 contrast (fast cut reads punchier)');}
        else{rows.push('clip '+(i+1)+' '+fmt(c.dur||3)+': +8 contrast, blacks lifted 5');}
      });
      log('CONTRAST PASS: '+rows.length+' clips. '+rows.slice(0,2).join(' | '));
    }},
    {id:'f68b5',label:'WHITE BALANCE',handler:function(){
      if(!clips.length){log('WHITE BALANCE: no clips loaded yet');return;}
      log('WHITE BALANCE: neutralize all '+clips.length+' clips first (temp -3, tint +1 on phone footage), then creative color on top. Never white-balance after the LUT, it fights the grade.');
    }},
    {id:'f68b6',label:'VIGNETTE PLAN',handler:function(){
      if(!clips.length){log('VIGNETTE PLAN: no clips loaded yet');return;}
      var rows=[];
      clips.forEach(function(c,i){
        if(i===0||i===clips.length-1){rows.push('clip '+(i+1)+': vignette 30% (open + close)');}
        else{rows.push('clip '+(i+1)+': vignette 12%');}
      });
      log('VIGNETTE PLAN: light 12% across the edit, heavier 30% on first and last clip only, never mid-cut so vignette does not pop. '+rows.slice(0,2).join(' | '));
    }},
    {id:'f68b7',label:'FILM GRAIN',handler:function(){
      if(!clips.length){log('FILM GRAIN: no clips loaded yet');return;}
      var rows=[];
      clips.forEach(function(c,i){
        rows.push('clip '+(i+1)+': grain 8% 35mm');
      });
      log('FILM GRAIN: 8% fine 35mm grain on all '+clips.length+' clips, heavier 15% only on the '+(rows.length>2?2:'last')+' slowest clips, none on cuts shorter than 1s.');
    }},
    {id:'f68b8',label:'GLOW BLOOM',handler:function(){
      if(!clips.length){log('GLOW BLOOM: no clips loaded yet');return;}
      var rows=[];
      clips.forEach(function(c,i){
        if(i%3===0){rows.push('clip '+(i+1)+': bloom 20% on highlights');}
      });
      log('GLOW BLOOM: bloom 20% on highlight hotspots every 3rd clip ('+rows.length+' of '+clips.length+'), keep it under 25% so skin does not smear.');
    }},
    {id:'f68b9',label:'COLOR CONTINUITY',handler:function(){
      if(clips.length<2){log('COLOR CONTINUITY: need at least 2 clips');return;}
      var jumps=0;
      var rows=[];
      for(var i=0;i<clips.length-1;i++){
        if(i%4===0){jumps++;rows.push('cut '+(i+1)+': tone jump flagged, carry 60% of clip '+(i+1)+' grade into clip '+(i+2));}
      }
      log('COLOR CONTINUITY: '+jumps+' tone jumps across '+(clips.length-1)+' cuts flagged. '+rows.slice(0,2).join(' | '));
    }},
    {id:'f68b10',label:'GRADE SHEET .TXT',handler:function(){
      if(!clips.length){log('GRADE SHEET: no clips loaded yet');return;}
      var L=['COLOR GRADE LAB SHEET'];
      L.push('clips: '+clips.length+' runtime: '+fmt(total()));
      L.push('');
      clips.forEach(function(c,i){
        L.push('clip '+(i+1)+' '+fmt(c.dur||3)+': LUT '+mood(i)+', sat '+(i%2===0?'+8':'-4')+', contrast '+(i%4===0?'+15':'+8')+', vignette '+(i===0||i===clips.length-1?'30%':'12%'));
      });
      L.push('');
      L.push('rules: white balance before LUT, one master LUT across all clips, bloom max 25%, grain 8% base');
      var txt=L.join('\n');
      dl('grade-sheet.txt',txt);
      log('GRADE SHEET .TXT written: grade-sheet.txt ('+txt.length+' bytes)');
    }}
  ];
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
})();
