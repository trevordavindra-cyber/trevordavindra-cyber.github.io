'use strict';
(function(){
  if(window.__tk2up77){return;}
  window.__tk2up77=true;
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
  cards.forEach(function(c){if(c.innerText.includes('TEXT LAB')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='EFFECTS LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
  var fmt=function(s){return (Math.round(s*10)/10)+'s';};
  var total=function(){var t=0;clips.forEach(function(c){t+=c.dur||3;});return t;};
  var txtOf=function(c){return ((c&&(c.caption||c.text))||'').toLowerCase();};
  var lenOf=function(c){return ((c&&(c.caption||c.text))||'').length;};
  var defs=[{id:'f77b1',label:'EFFECT AUDIT',handler:function(){if(!clips.length){log('EFFECTS LAB: add a clip first');return;}var res='';for(var i=0;i<clips.length;i++){var c=clips[i];var eff=(c.dur||0)>5?'SIMPLIFY':'REINFORCE';res+=(''+i+' '+c.id+' '+(c.dur||0).toFixed(2)+'s '+eff+'\n');}log('EFFECTS LAB: audit complete\n'+res);}},{id:'f77b2',label:'GLITCH PLAN',handler:function(){if(!clips.length){log('EFFECTS LAB: add a clip first');return;}var txt='GLITCH PLAN:\n';for(var i=0;i<clips.length;i++){txt+='Clip '+clips[i].id+' set to glitch mode at '+(clips[i].dur||0).toFixed(2)+'s\n';}log('EFFECTS LAB: glitch plan generated');download('glitch-plan.txt',txt);}},{id:'f77b3',label:'FLASH CUTS',handler:function(){if(!clips.length){log('EFFECTS LAB: add a clip first');return;}for(var i=0;i<clips.length;i++){var c=clips[i];if((c.dur||0)>2){c.label='FLASH';}else{c.label='NORMAL';}}log('EFFECTS LAB: flash cuts applied');}},{id:'f77b4',label:'SHAKE PASS',handler:function(){if(!clips.length){log('EFFECTS LAB: add a clip first');return;}for(var i=0;i<clips.length;i++){if(i%2<1){clips[i].shake=true;}}log('EFFECTS LAB: shake pass completed');}},{id:'f77b5',label:'VIGNETTE CHECK',handler:function(){if(!clips.length){log('EFFECTS LAB: add a clip first');return;}var txt='VIGNETTE CHECK:\n';for(var i=0;i<clips.length;i++){txt+='Clip '+clips[i].id+' '+((clips[i].dur||0)>4?'apply':'skip')+' vignette\n';}log('EFFECTS LAB: vignette check finished');download('vignette.txt',txt);}},{id:'f77b6',label:'FILM GRAIN PLAN',handler:function(){if(!clips.length){log('EFFECTS LAB: add a clip first');return;}var txt='FILM GRAIN PLAN:\n';for(var i=0;i<clips.length;i++){txt+='Clip '+clips[i].id+' grain level '+((clips[i].dur||0)/10).toFixed(2)+'\n';}download('film-grain.txt',txt);log('EFFECTS LAB: film grain plan done');}},{id:'f77b7',label:'ZOOM PULSE',handler:function(){if(!clips.length){log('EFFECTS LAB: add a clip first');return;}for(var i=0;i<clips.length;i++){clips[i].zoom=true;}log('EFFECTS LAB: zoom pulse activated');}},{id:'f77b8',label:'COLOR FLASH PLAN',handler:function(){if(!clips.length){log('EFFECTS LAB: add a clip first');return;}var txt='COLOR FLASH PLAN:\n';for(var i=0;i<clips.length;i++){txt+='Clip '+clips[i].id+' color flash at '+(clips[i].dur||0).toFixed(2)+'s\n';}download('color-flash.txt',txt);log('EFFECTS LAB: color flash plan ready');}},{id:'f77b9',label:'PACE EFFECTS',handler:function(){if(!clips.length){log('EFFECTS LAB: add a clip first');return;}var txt='PACE EFFECTS:\n';for(var i=0;i<clips.length;i++){if((clips[i].dur||0)>3){txt+='Clip '+clips[i].id+' needs effects\n';}else{txt+='Clip '+clips[i].id+' stays clean\n';}}log(txt);}},
{id:'f77b10',label:'EFFECTS SHEET .TXT',handler:function(){if(!clips.length){log('EFFECTS LAB: add a clip first');return;}var sheet='EFFECTS SHEET:\n';for(var i=0;i<clips.length;i++){sheet+='Clip '+clips[i].id+' dur '+(clips[i].dur||0).toFixed(2)+'s\n';}download('effects-sheet.txt',sheet);log('EFFECTS LAB: EFFECTS SHEET DOWNLOADED');}}];
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
})();
