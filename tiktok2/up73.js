'use strict';
(function(){
  if(window.__tk2up73){return;}
  window.__tk2up73=true;
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
  function safeClip(c){return ((c&&(c.caption||c.text))||'clip').slice(0,24);}
  var clips=S.clips||[];
  var cards=document.querySelectorAll('div');
  var target=null;
  cards.forEach(function(c){if(c.innerText.includes('RETENTION LAB')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='SOUND LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
  var fmt=function(s){return (Math.round(s*10)/10)+'s';};
  var total=function(){var t=0;clips.forEach(function(c){t+=c.dur||3;});return t;};
  var txtOf=function(c){return ((c&&(c.caption||c.text))||'').toLowerCase();};
  var defs=[
    {id:'f73b1',label:'AUDIO AUDIT',handler:function(){
      if(!clips.length){log('AUDIO AUDIT: no clips loaded yet');return;}
      log('AUDIO AUDIT: '+clips.length+' clips '+fmt(total())+' total, mix set music 60% / voice 40% on the master bus, normalize every clip to -14 LUFS before mixing, flag '+clips.filter(function(c){return txtOf(c).indexOf('voice')>-1||txtOf(c).indexOf('talk')>-1;}).length+' clips as voice-led.');
    }},
    {id:'f73b2',label:'BEAT SYNC MAP',handler:function(){
      if(!clips.length){log('BEAT SYNC MAP: no clips loaded yet');return;}
      var avg=total()/clips.length;
      var bpm=Math.round(60/Math.max(avg,0.3));
      log('BEAT SYNC MAP: avg clip '+fmt(avg)+' puts the cut grid near '+bpm+' BPM, nudge every off-beat cut to the next downbeat (max 1 beat, 1000ms, late), cuts on the 1 and 3 land hard, cuts on the 2 and 4 get a 60ms micro-shift for swing.');
    }},
    {id:'f73b3',label:'VOLUME DUCKING',handler:function(){
      if(!clips.length){log('VOLUME DUCKING: no clips loaded yet');return;}
      var duck=[];
      clips.forEach(function(c,i){if(txtOf(c).indexOf('voice')>-1||txtOf(c).indexOf('talk')>-1||txtOf(c).indexOf('says')>-1){duck.push(i+1);}});
      if(!duck.length){duck=[1,2,3];}
      log('VOLUME DUCKING: duck music 8dB under the voice lines in clips '+duck.join(', ')+', sidechain attack 10ms release 300ms so the vocal sits on top without pumping.');
    }},
    {id:'f73b4',label:'SFX PLACEMENT',handler:function(){
      if(!clips.length){log('SFX PLACEMENT: no clips loaded yet');return;}
      log('SFX PLACEMENT: whoosh on every hard cut (odd clips), impact on beat drops (every 4th clip), pop on caption pops, riser into the final 2s, SFX at -18 LUFS so they ride under the music, no more than 3 SFX per 5s.');
    }},
    {id:'f73b5',label:'CAPTION TIMING',handler:function(){
      if(!clips.length){log('CAPTION TIMING: no clips loaded yet');return;}
      log('CAPTION TIMING: snap every caption to the spoken/sung syllable onset with 120ms pre-roll and 60ms tail, max 2 lines on screen, min hold 0.7s, key-word captions flash on the downbeat they land on.');
    }},
    {id:'f73b6',label:'BPM DETECT',handler:function(){
      if(!clips.length){log('BPM DETECT: no clips loaded yet');return;}
      var avg=total()/clips.length;
      var bpm=Math.round(60/Math.max(avg,0.3));
      log('BPM DETECT: cut grid implies '+bpm+' BPM ('+fmt(60/bpm)+' per beat); if the track is slower, half-time the cuts to '+Math.round(bpm/2)+' BPM and let every 2nd beat carry the transition.');
    }},
    {id:'f73b7',label:'LOUDNESS CHECK',handler:function(){
      if(!clips.length){log('LOUDNESS CHECK: no clips loaded yet');return;}
      log('LOUDNESS CHECK: normalize the whole edit to -14 LUFS (TikTok target), anything hotter than -9 LUFS rides down 3dB, anything under -20 LUFS comes up 4dB, keep 1dB headroom at the loudest drop, true-peak under -1dBTP.');
    }},
    {id:'f73b8',label:'AUDIO CONTINUITY',handler:function(){
      if(!clips.length){log('AUDIO CONTINUITY: no clips loaded yet');return;}
      log('AUDIO CONTINUITY: ambience must not change mid-phrase, lay a 200ms equal-power crossfade over every clip boundary that swaps room tone, keep music continuous across all cuts, and carry the last 150ms of each clip audio into the next.');
    }},
    {id:'f73b9',label:'SOUND TREND CHECK',handler:function(){
      if(!clips.length){log('SOUND TREND CHECK: no clips loaded yet');return;}
      var n=clips.length;
      var a=1,b=2,c=3;
      if(n>3){a=1;b=Math.floor(n/2);c=n;}
      log('SOUND TREND CHECK: route clips '+a+', '+b+', '+c+' to one trending archetype (slowed+reverb hook on the opener, clean vocal loop mid-video, beat-swap for the last third), keep ONE archetype per section, never stack two on the same clip.');
    }},
    {id:'f73b10',label:'SOUND SHEET .TXT',handler:function(){
      if(!clips.length){log('SOUND SHEET: no clips loaded yet');return;}
      var L=['SOUND LAB SHEET'];
      L.push('clips: '+clips.length+' runtime: '+fmt(total()));
      L.push('');
      clips.forEach(function(c,i){
        var voice=txtOf(c).indexOf('voice')>-1||txtOf(c).indexOf('talk')>-1||txtOf(c).indexOf('says')>-1;
        L.push('clip '+(i+1)+': '+(voice?'duck8dB':'music-lead')+' / sfx-'+(i%2===0?'whoosh':'impact')+' / caption-snap '+(voice?'ON':'off')+' '+safeClip(c));
      });
      L.push('');
      L.push('rules: -14 LUFS master, duck 8dB under voice, captions 120ms pre/60ms tail, crossfade 200ms on room-tone swaps, max 3 sfx per 5s, keep 1dB headroom at the drop');
      var txt=L.join('\n');
      dl('sound-sheet.txt',txt);
      log('SOUND SHEET .TXT written: sound-sheet.txt ('+txt.length+' bytes)');
    }}
  ];
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
})();
