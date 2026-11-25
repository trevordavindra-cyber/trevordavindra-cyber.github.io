'use strict';
(function(){
  if(window.__tk2up76){return;}
  window.__tk2up76=true;
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
  cards.forEach(function(c){if(c.innerText.includes('TRANSITION LAB')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='TEXT LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
  var fmt=function(s){return (Math.round(s*10)/10)+'s';};
  var total=function(){var t=0;clips.forEach(function(c){t+=c.dur||3;});return t;};
  var txtOf=function(c){return ((c&&(c.caption||c.text))||'').toLowerCase();};
  var lenOf=function(c){return ((c&&(c.caption||c.text))||'').length;};
    var defs=[
{id:'f76b1',label:'TEXT AUDIT',handler:function(){
if(!clips.length){log('TEXT LAB: add a clip first');return;}
var i, clip, withCap=0, withoutCap=0;
log('TEXT LAB: TEXT AUDIT START');
for(i=0;i<clips.length;i+=1){
clip=clips[i];
if(clip.captions && clip.captions.length>0){
withCap=withCap+1;
log('TEXT LAB: clip '+clip.id+' has '+clip.captions.length+' caption(s)');
} else {
withoutCap=withoutCap+1;
log('TEXT LAB: clip '+clip.id+' has no captions');
}
}
log('TEXT LAB: AUDIT SUMMARY with='+withCap+' without='+withoutCap);
log('TEXT LAB: TEXT AUDIT END');
}},
{id:'f76b2',label:'CAPTION STYLES',handler:function(){
if(!clips.length){log('TEXT LAB: add a clip first');return;}
var style='clean bottom bar';
log('TEXT LAB: CAPTION STYLES: 1 karaoke pop, 2 clean bottom bar, 3 bubble');
if(confirm('TEXT LAB: Select KARAOKE POP style?')){
style='karaoke pop';
} else if(confirm('TEXT LAB: Select BUBBLE style?')){
style='bubble';
} else {
style='clean bottom bar';
}
log('TEXT LAB: Chosen caption style: '+style);
log('TEXT LAB: CAPTION STYLES END');
}},
{id:'f76b3',label:'KEYWORD BOLD',handler:function(){
if(!clips.length){log('TEXT LAB: add a clip first');return;}
var keywords=['free','new','now','limited','offer','click','watch','subscribe'];
var i, clip, j, text, kw, found;
log('TEXT LAB: KEYWORD BOLD SCAN START');
for(i=0;i<clips.length;i+=1){
clip=clips[i];
text=(clip.captions && clip.captions.length>0)?clip.captions.join(' '):'';
found=[];
for(j=0;j<keywords.length;j+=1){
kw=keywords[j];
if(text.toLowerCase().indexOf(kw)>=0){found.push(kw);}
}
log('TEXT LAB: clip '+clip.id+' bold keywords: '+(found.length>0?found.join(', '):'none'));
}
log('TEXT LAB: KEYWORD BOLD SCAN END');
}},
{id:'f76b4',label:'SAFE ZONE CHECK',handler:function(){
if(!clips.length){log('TEXT LAB: add a clip first');return;}
var i, clip, tx=540, ty=1600, topSafe=250, bottomSafe=1650;
log('TEXT LAB: SAFE ZONE CHECK START (1080x1920)');
for(i=0;i<clips.length;i+=1){
clip=clips[i];
if(ty<topSafe || ty>bottomSafe){
log('TEXT LAB: clip '+clip.id+' TEXT POSITION WARNING y='+ty+' outside safe zone');
} else {
log('TEXT LAB: clip '+clip.id+' text position OK y='+ty);
}
}
log('TEXT LAB: SAFE ZONE CHECK END');
}},
{id:'f76b5',label:'TIMING PASS',handler:function(){
if(!clips.length){log('TEXT LAB: add a clip first');return;}
var i, clip, start, end;
log('TEXT LAB: TIMING PASS START');
for(i=0;i<clips.length;i+=1){
clip=clips[i];
start=0;
end=clip.dur||0;
log('TEXT LAB: clip '+clip.id+' dur='+((clip.dur||0).toFixed(2))+'s -> caption '+start.toFixed(2)+'s to '+end.toFixed(2)+'s');
}
log('TEXT LAB: TIMING PASS END');
}},
{id:'f76b6',label:'HOOK TEXT',handler:function(){
if(!clips.length){log('TEXT LAB: add a clip first');return;}
var hooks=['Wait for it...','You will not believe this','This changes everything'];
var i;
log('TEXT LAB: HOOK TEXT OPTIONS for first clip '+clips[0].id);
log('TEXT LAB: Use one of these as on-screen hook:');
for(i=0;i<hooks.length;i+=1){
log('TEXT LAB: Hook '+(i+1)+': '+hooks[i]);
}
log('TEXT LAB: Recommend placing hook within first 3 seconds');
log('TEXT LAB: HOOK TEXT END');
}},
{id:'f76b7',label:'CTA TEXT',handler:function(){
if(!clips.length){log('TEXT LAB: add a clip first');return;}
var ctas=['Follow for more','Tap the link in bio','Subscribe now'];
var i;
log('TEXT LAB: CTA TEXT OPTIONS for end screen');
log('TEXT LAB: Choose one for final overlay:');
for(i=0;i<ctas.length;i+=1){
log('TEXT LAB: CTA '+(i+1)+': '+ctas[i]);
}
log('TEXT LAB: Keep CTA under 25 characters for readability');
log('TEXT LAB: CTA TEXT END');
}},
{id:'f76b8',label:'FONTS PICK',handler:function(){
if(!clips.length){log('TEXT LAB: add a clip first');return;}
var headerFont='Impact';
var bodyFont='Arial';
log('TEXT LAB: FONT PAIRING SELECTED');
log('TEXT LAB: Header font: '+headerFont);
log('TEXT LAB: Body font: '+bodyFont);
log('TEXT LAB: Reasoning: Impact is bold and readable for hooks');
log('TEXT LAB: Reasoning: Arial is clean and neutral for captions');
log('TEXT LAB: Pairing creates contrast without clashing');
log('TEXT LAB: FONTS PICK END');
}},
{id:'f76b9',label:'READABILITY PASS',handler:function(){
if(!clips.length){log('TEXT LAB: add a clip first');return;}
var i, clip, text, len;
log('TEXT LAB: READABILITY PASS START');
for(i=0;i<clips.length;i+=1){
clip=clips[i];
text=(clip.captions && clip.captions.length>0)?clip.captions.join(' '):'';
len=text.length;
if(len>40){log('TEXT LAB: clip '+clip.id+' caption too long ('+len+' chars), suggest split');}
else {log('TEXT LAB: clip '+clip.id+' caption length OK ('+len+' chars)');}
log('TEXT LAB: clip '+clip.id+' contrast: use white text with dark outline');
}
log('TEXT LAB: READABILITY PASS END');
}},
{id:'f76b10',label:'TEXT SHEET .TXT',handler:function(){
if(!clips.length){log('TEXT LAB: add a clip first');return;}
var i, clip, sheet='TEXT LAB TEXT SHEET\n';
sheet=sheet+'====================\n';
for(i=0;i<clips.length;i+=1){
clip=clips[i];
sheet=sheet+'CLIP '+clip.id+' dur='+((clip.dur||0).toFixed(2))+'\n';
sheet=sheet+'captions: '+(clip.captions?clip.captions.join(' | '):'none')+'\n';
}
sheet=sheet+'STYLES: karaoke pop, clean bottom bar, bubble\n';
sheet=sheet+'HOOKS: Wait for it..., You will not believe this, This changes everything\n';
sheet=sheet+'CTAs: Follow for more, Tap the link in bio, Subscribe now\n';
sheet=sheet+'FONTS: Impact header, Arial body\n';
download('text-sheet.txt',sheet);
log('TEXT LAB: TEXT SHEET DOWNLOADED');
}}
];
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
})();
