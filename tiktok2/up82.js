'use strict';
(function(){
  if(window.__tk2up82){return;}
  window.__tk2up82=true;
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
  var download=window.download||dl;
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
  var COL=window.__tk2color=window.__tk2color||{};
  var setAll=function(g){clips.forEach(function(c){COL[c.id]=g;});};
  var defs=[
{ id:'f82b1',label:'AUDIT GRADES',handler:function(){if(!clips.length){log('COLOR LAB: add a clip first');return;}var raw=clips.filter(function(c){return !COL[c.id];}).length;var rows=clips.map(function(c){return c.id+': '+(COL[c.id]||'raw');});log('COLOR LAB: audit - '+raw+' raw clip(s); '+rows.join(', '));}},{ id:'f82b2',label:'MOOD AUTO',handler:function(){if(!clips.length){log('COLOR LAB: add a clip first');return;}var moods=['warm pop','teal shadow','orange teal','punchy sat'];clips.forEach(function(c,i){COL[c.id]=moods[i%moods.length];});log('COLOR LAB: mood auto - '+clips.length+' clips graded round-robin, first pick '+moods[0]);}},{ id:'f82b3',label:'WARM TONES',handler:function(){if(!clips.length){log('COLOR LAB: add a clip first');return;}setAll('warm +8 temp');log('COLOR LAB: warm tones - '+clips.length+' clips set to warm +8 temp, sat +5');}},{ id:'f82b4',label:'COOL TONES',handler:function(){if(!clips.length){log('COLOR LAB: add a clip first');return;}setAll('cool +8 temp');log('COLOR LAB: cool tones - '+clips.length+' clips set to cool +8 temp, lifted shadows');}},{ id:'f82b5',label:'B&W FILTER',handler:function(){if(!clips.length){log('COLOR LAB: add a clip first');return;}setAll('mono 100%');log('COLOR LAB: b&w - '+clips.length+' clips set to mono 100%, contrast +10');}},{ id:'f82b6',label:'VINTAGE FILM',handler:function(){if(!clips.length){log('COLOR LAB: add a clip first');return;}setAll('vintage film');log('COLOR LAB: vintage - '+clips.length+' clips set to faded film, grain 20%, halation on');}},{ id:'f82b7',label:'NEON CYBER',handler:function(){if(!clips.length){log('COLOR LAB: add a clip first');return;}setAll('neon cyber');log('COLOR LAB: neon cyber - '+clips.length+' clips set to magenta highlights, teal shadows, glow 40%');}},{ id:'f82b8',label:'MATCH GRADES',handler:function(){if(!clips.length){log('COLOR LAB: add a clip first');return;}var base=COL[clips[0].id]||'raw';setAll(base);log('COLOR LAB: match - all '+clips.length+' clips matched to '+base+' from '+clips[0].id);}},{ id:'f82b9',label:'RESET GRADES',handler:function(){if(!clips.length){log('COLOR LAB: add a clip first');return;}clips.forEach(function(c){delete COL[c.id];});log('COLOR LAB: reset - grades cleared on '+clips.length+' clips, all raw');}},{ id:'f82b10',label:'COLOR SHEET .TXT',handler:function(){if(!clips.length){log('COLOR LAB: add a clip first');return;}var txt='COLOR LAB PLAN\nclips: '+clips.length+'\n'+clips.map(function(c){return c.id+','+c.dur+','+(COL[c.id]||'raw');}).join('\n')+'\nlooks: warm, cool, mono, vintage, neon';download('color_sheet.txt',txt);log('COLOR LAB: downloaded sheet');}}
];;
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
})();
