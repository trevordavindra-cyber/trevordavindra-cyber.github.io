'use strict';
(function(){
  if(window.__tk2up74){return;}
  window.__tk2up74=true;
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
  cards.forEach(function(c){if(c.innerText.includes('SOUND LAB')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='COLOR LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
  var fmt=function(s){return (Math.round(s*10)/10)+'s';};
  var total=function(){var t=0;clips.forEach(function(c){t+=c.dur||3;});return t;};
  var txtOf=function(c){return ((c&&(c.caption||c.text))||'').toLowerCase();};
  var lenOf=function(c){return ((c&&(c.caption||c.text))||'').length;};
  var defs=[
    {id:'f74b1',label:'COLOR AUDIT',handler:function(){
      if(!clips.length){log('COLOR AUDIT: no clips loaded yet');return;}
      var avg=total()/clips.length;
      log('COLOR AUDIT: '+clips.length+' clips, avg '+fmt(avg)+' per clip, total '+fmt(total())+' runtime, base palette audit on: pick one hero hue for the hook, hold it through the body, save the contrast shift for the final third.');
    }},
    {id:'f74b2',label:'GRADE MATCH',handler:function(){
      if(!clips.length){log('GRADE MATCH: no clips loaded yet');return;}
      var base=clips[0].dur||3;
      var matched=0;
      clips.forEach(function(c){if(Math.abs((c.dur||3)-base)<=0.5){matched++;}});
      log('GRADE MATCH: '+matched+' of '+clips.length+' clips sit within 0.5s of the anchor clip ('+fmt(base)+'), set those on the same grade node and pull the outliers to it so no clip pops out of the sequence.');
    }},
    {id:'f74b3',label:'CONTRAST CHECK',handler:function(){
      if(!clips.length){log('CONTRAST CHECK: no clips loaded yet');return;}
      var sum=0;
      clips.forEach(function(c){sum+=lenOf(c);});
      var avgc=sum/clips.length;
      log('CONTRAST CHECK: avg text density '+avgc.toFixed(1)+' chars per clip, target 15-20 for legible overlays; lift shadows 10% and drop highlights 5% so captions never fight a blown-out background.');
    }},
    {id:'f74b4',label:'SKIN TONE GUARD',handler:function(){
      if(!clips.length){log('SKIN TONE GUARD: no clips loaded yet');return;}
      var skin=0;
      clips.forEach(function(c){if(txtOf(c).indexOf('skin')>-1){skin++;}});
      log('SKIN TONE GUARD: '+skin+' clip'+(skin===1?'':'s')+' flagged as skin-led, keep those on a neutral LUT with saturation under 110% and skip any teal-heavy grade so faces stay natural against the stylized b-roll.');
    }},
    {id:'f74b5',label:'FILTER PICK',handler:function(){
      if(!clips.length){log('FILTER PICK: no clips loaded yet');return;}
      var F=['clean','warm film','cold neon','high sat','mono pop'];
      var lines=[];
      clips.forEach(function(c,i){if(i%3===0){lines.push('clip '+(i+1)+' '+(F[(i/3|0)%F.length]));}});
      log('FILTER PICK: section map '+lines.join(', ')+' - one filter per 3-clip block, never switch mid-block, reset to clean on the final clip so the loop point reads as a fresh start.');
    }},
    {id:'f74b6',label:'LUT PLAN',handler:function(){
      if(!clips.length){log('LUT PLAN: no clips loaded yet');return;}
      var idx=clips.length%3;
      var lut=['warm 35mm','cool cyber','neutral clean'][idx];
      log('LUT PLAN: '+clips.length+' clips puts the base LUT on '+lut+', stack a 20% opacity version so the grade stays reversible, bake a second copy at 40% only if the feed gets compressed hard.');
    }},
    {id:'f74b7',label:'GLOW + VIGNETTE',handler:function(){
      if(!clips.length){log('GLOW + VIGNETTE: no clips loaded yet');return;}
      var glow=[],vign=[];
      clips.forEach(function(c,i){if(i%4===0){glow.push(i+1);}else if(i%4===2){vign.push(i+1);}});
      log('GLOW + VIGNETTE: bloom pass on clips '+glow.join(', ')+', soft vignette on clips '+vign.join(', ')+', glow at 0.8 strength vignette at 0.7, never both on the same clip or the frame goes muddy.');
    }},
    {id:'f74b8',label:'SATURATION RAMP',handler:function(){
      if(!clips.length){log('SATURATION RAMP: no clips loaded yet');return;}
      var step=Math.max(2,Math.min(8,Math.round(24/clips.length)));
      log('SATURATION RAMP: step '+step+'% per clip across '+clips.length+' clips, start at 90% on clip 1 and crest near '+(90+step*(clips.length-1))+'% on the last one, cap the peak at 130% so nothing smears.');
    }},
    {id:'f74b9',label:'COLOR CONTINUITY',handler:function(){
      if(!clips.length){log('COLOR CONTINUITY: no clips loaded yet');return;}
      var shifts=0;
      for(var i=1;i<clips.length;i++){if((i%4)===0){shifts++;}}
      log('COLOR CONTINUITY: '+shifts+' planned grade shifts across '+clips.length+' clips, budget under '+Math.max(2,Math.ceil(clips.length/6))+', bridge each shift with a 150ms crossfade so the eye reads it as one move, not a jump.');
    }},
    {id:'f74b10',label:'COLOR SHEET .TXT',handler:function(){
      if(!clips.length){log('COLOR SHEET: no clips loaded yet');return;}
      var L=['COLOR LAB SHEET'];
      L.push('clips: '+clips.length+' runtime: '+fmt(total()));
      L.push('');
      clips.forEach(function(c,i){
        var skin=txtOf(c).indexOf('skin')>-1;
        L.push('clip '+(i+1)+': lut-'+(i%2===0?'warm':'cool')+' / '+(skin?'skin-safe':'full-grade')+' / glow '+(i%4===0?'on':'off')+' '+txtOf(c).slice(0,24));
      });
      L.push('');
      L.push('rules: one hero hue per section, skin tones under 110% saturation, glow and vignette never stacked, cap saturation 130%, crossfade every grade shift 150ms');
      var txt=L.join('\n');
      dl('color-sheet.txt',txt);
      log('COLOR SHEET .TXT written: color-sheet.txt ('+txt.length+' bytes)');
    }}
  ];
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
})();
