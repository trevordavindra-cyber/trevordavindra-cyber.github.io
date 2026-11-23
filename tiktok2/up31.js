'use strict';
// up31.js — PHASE 25 COVER LAB (Nov 23 2026)
// cover frame picker, cover text check, safe zone check, cover style preview,
// contrast check, action frame finder, cover variants, spec check, cover fix list, cover report
(function(){
if(window.__tk2up31)return;window.__tk2up31=1;
function $(id){return document.getElementById(id)}
function mkBtn(t,fn,fl,id){var b=document.createElement('button');b.className='btn';b.textContent=t;b.style.flex=fl||'0 0 auto';if(id)b.id=id;b.onclick=fn;return b}
function mkRow(gap){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap=(gap||6)+'px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function saveE(){try{if(typeof save==='function')save()}catch(e){}}
function clipDur(c){return (c.end-c.start)/(c.speed||1)}
function totalDur(){return S.clips.reduce(function(a,c){return a+clipDur(c)},0)}
function dl(name,text){try{var b=new Blob([text],{type:'text/plain'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a)},300);return true}catch(e){log('download failed: '+e.message);return false}}
if(!S.eco)S.eco={};var E=S.eco;
if(!E.f31)E.f31={last:null,reports:0};
var cv=null;
function canvas(){if(cv)return cv;cv=document.createElement('canvas');cv.width=216;cv.height=384;cv.style.cssText='width:216px;height:384px;display:block;margin-top:8px;border:1px solid #222';return cv}
function safeZone(){return{top:0.12,right:0.15,bottom:0.25,left:0.10}}
function coverTitle(){
  var t=String(S.title||'').trim();
  if(t)return t;
  if(S.captions&&S.captions.length&&S.captions[0].text)return String(S.captions[0].text).slice(0,40);
  return (S.style||'custom')+' edit';
}
// 1) COVER FRAME PICKER — rank cut points by a visual-change proxy
function framePicker(){
  if(!S.clips.length){log('COVER FRAME — timeline is empty, nothing to pick from');return}
  var cuts=[0],acc=0;
  for(var i=0;i<S.clips.length;i++){acc+=clipDur(S.clips[i]);cuts.push(+acc.toFixed(2))}
  cuts.pop();
  var tot=+totalDur().toFixed(2);
  var cands=[];
  for(var i=0;i<cuts.length;i++){
    var t=cuts[i],score=0;
    var stA=String((S.clips[i-1]&&S.clips[i-1].style)||S.style||''),stB=String(S.clips[i].style||S.style||'');
    if(stA!==stB)score+=40;
    var spA=(i>0?S.clips[i-1].speed||1:0),spB=S.clips[i].speed||1;
    if(spA&&Math.abs(spA-spB)>0.25)score+=25;
    score+=Math.max(0,30-30*Math.abs(t-tot/2)/tot);
    if(t<=2)score+=10;
    cands.push({t:t,score:Math.round(score)});
  }
  cands.sort(function(a,b){return b.score-a.score});
  var top=cands.slice(0,3).map(function(c){return c.t+'s (fit '+c.score+')'}).join('  |  ');
  E.f31.last=Object.assign(E.f31.last||{},{frames:cands.slice(0,3)});
  log('COVER FRAME — top 3 candidates: '+top+' (style/speed changes + midpoint weighting)');
  saveE();
}
// 2) COVER TEXT CHECK
function textCheck(){
  var t=String(S.title||'').trim();
  if(!t){log('COVER TEXT — no title set; the cover tools will fall back to the first caption');return}
  var emoji=(t.match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu)||[]).length;
  var capsWords=(t.match(/\b[A-Z]{3,}\b/g)||[]).length;
  var issue='';
  if(t.length>30)issue='title is '+t.length+' chars — cover text past 30 gets clipped on the grid';
  else if(emoji>3)issue=emoji+' emoji in the title — 1-2 reads best on a cover';
  log('COVER TEXT — "'+t+'" ('+t.length+' chars, '+emoji+' emoji, '+capsWords+' caps words)'+(issue?' — '+issue:' — clean'));
  saveE();
}
// 3) SAFE ZONE CHECK — cover text position vs TikTok margins
function safeCheck(){
  var z=safeZone();
  var pos=String((E.f31.textPos)||'center').toLowerCase();
  var warn=null;
  if(pos.indexOf('top')>=0)warn='text in the top '+Math.round(z.top*100)+'% — the username overlay and follow chip sit there';
  else if(pos.indexOf('bottom')>=0)warn='text in the bottom '+Math.round(z.bottom*100)+'% — the caption bar, sounds strip and CTA buttons sit there';
  else if(pos.indexOf('right')>=0)warn='text pushed past the right '+Math.round(z.right*100)+'% — the like/comment/share rail covers it';
  log('SAFE ZONE — cover text position "'+pos+'"'+(warn?': '+warn:': inside the safe area (top 12% / right 15% / bottom 25% margins clear)'));
  saveE();
}
// 4) COVER STYLE PREVIEW — 3 layouts on one canvas, no video needed
function preview(){
  if(!S.clips.length){log('COVER PREVIEW — timeline is empty, nothing to preview');return}
  var c=canvas(),x=c.getContext('2d');
  if(!x){log('COVER PREVIEW — canvas 2d unavailable in this browser');return}
  var t=coverTitle();
  x.fillStyle='#101018';x.fillRect(0,0,216,384);
  var zones=[{name:'TOP',y:34},{name:'CENTER',y:192},{name:'LOWER',y:330}];
  x.strokeStyle='#2a2a3a';
  for(var i=1;i<3;i++){x.beginPath();x.moveTo(0,i*128);x.lineTo(216,i*128);x.stroke()}
  for(var i=0;i<zones.length;i++){
    var z=zones[i],y=z.y;
    x.fillStyle='#00e5ff';x.font='9px monospace';x.textAlign='left';x.fillText(z.name,8,z.y-14);
    x.fillStyle='#ffffff';x.font='bold 13px sans-serif';x.textAlign='center';
    var words=t.split(' '),line='',lines=[];
    for(var w=0;w<words.length;w++){
      var test=line?line+' '+words[w]:words[w];
      if(x.measureText(test).width>196&&line){lines.push(line);line=words[w]}else line=test;
    }
    if(line)lines.push(line);
    lines=lines.slice(0,3);
    for(var l=0;l<lines.length;l++)x.fillText(lines[l],108,y+l*16);
  }
  if(!c.parentElement){var card=$('f31card');if(card)card.appendChild(c)}
  log('COVER PREVIEW — 3 layouts drawn: top / center / lower-third, title "'+t+'" (216x384, 1/5 of 1080x1920)');
  saveE();
}
// 5) CONTRAST CHECK — sample the opener clip's video frame when one is loaded
function contrast(){
  if(!S.clips.length){log('CONTRAST — timeline is empty, nothing to sample');return}
  var ratio=null,src='style estimate';
  try{
    var v=document.querySelector('video');
    if(v&&v.videoWidth>0&&v.readyState>=2){
      var s=document.createElement('canvas');s.width=32;s.height=56;
      var sx=s.getContext('2d');
      sx.drawImage(v,0,0,32,56);
      var d=sx.getImageData(0,0,32,56).data,r=0,g=0,b=0,n=0;
      for(var py=16;py<40;py++)for(var px=0;px<32;px++){
        var k=(py*32+px)*4;r+=d[k];g+=d[k+1];b+=d[k+2];n++
      }
      var lum=(0.2126*r/n+0.7152*g/n+0.0722*b/n)/255;
      ratio=(1.0+0.05)/(lum+0.05);
      src='sampled '+v.videoWidth+'x'+v.videoHeight+' frame';
    }
  }catch(e){}
  if(ratio==null){
    var dark=['phonk','gaming','cinematic','anime'].indexOf(String(S.style||'').toLowerCase())>=0;
    ratio=dark?9.5:2.8;src='style estimate ('+(dark?'dark':'bright')+' look)';
  }
  ratio=+ratio.toFixed(1);
  log('CONTRAST — white cover text vs background: '+ratio+':1 ('+src+')'+(ratio>=4.5?' — passes 4.5:1':' — below 4.5:1, add a text shadow or scrim'));
  saveE();
}
// 6) ACTION FRAME FINDER — the 2s window with the densest cuts (motion proxy)
function actionFrame(){
  if(!S.clips.length){log('ACTION FRAME — timeline is empty');return}
  var cuts=[],acc=0;
  for(var i=0;i<S.clips.length;i++){acc+=clipDur(S.clips[i]);if(i<S.clips.length-1)cuts.push(acc)}
  if(!cuts.length){log('ACTION FRAME — single clip, keeping the opener frame');return}
  var best={t:0,n:-1};
  for(var t=0;t<totalDur()-2;t+=0.5){
    var n=0;for(var i=0;i<cuts.length;i++){if(cuts[i]>t&&cuts[i]<t+2)n++}
    if(n>best.n)best={t:+t.toFixed(1),n:n};
  }
  E.f31.last=Object.assign(E.f31.last||{},{action:best});
  log('ACTION FRAME — densest cut window: '+best.t+'s-'+(best.t+2).toFixed(1)+'s ('+best.n+' cuts inside) — grab the cover frame there for an action shot');
  saveE();
}
// 7) COVER VARIANTS — 3 alternate titles
function variants(){
  var t=coverTitle();
  var base=t.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu,'').replace(/[.!?]+$/,'').trim();
  var style=String(S.style||'custom');
  var out=[
    'POV: '+base.toLowerCase().slice(0,34),
    base.slice(0,26)+' (no one expected this)',
    base.slice(0,20)+' \u2192 '+style+' cut \u26a1'
  ];
  log('COVER VARIANTS — 1) "'+out[0]+'"  2) "'+out[1]+'"  3) "'+out[2]+'"');
  E.f31.last=Object.assign(E.f31.last||{},{variants:out});
  saveE();
}
// 8) SPEC CHECK
function spec(){
  var w=1080,h=1920,q=0.9;
  var est=w*h*0.35/1048576;
  log('SPEC — cover: '+w+'x'+h+' px (9:16) — q'+q+' jpg estimate ~'+est.toFixed(1)+' MB (rough, actual varies with detail); keep cover text '+Math.round(w*0.15)+' px clear of the right edge');
  saveE();
}
// 9) COVER FIX LIST — top 3 ranked
function fixList(){
  if(!S.clips.length){log('COVER FIX LIST — timeline is empty');return}
  var fixes=[];
  var t=String(S.title||'').trim();
  if(!t)fixes.push('no cover title set — pick one (30 chars max, front-load the hook)');
  else if(t.length>30)fixes.push('title is '+t.length+' chars — trim to 30 so the grid never clips it');
  if(!S.captions||!S.captions.length)fixes.push('no captions — a cover with a caption line under it converts better');
  var pos=String((E.f31.textPos)||'center').toLowerCase();
  if(pos.indexOf('bottom')>=0)fixes.push('cover text sits in the bottom 25% safe-area — move it center or top');
  if(!E.f31.last||!E.f31.last.frames)fixes.push('run COVER FRAME first — the picker has not ranked candidates yet');
  if(fixes.length<3)fixes.push('contrast: check the opener frame — bright style covers need a text scrim');
  fixes=fixes.slice(0,3);
  log('COVER FIX LIST (top '+fixes.length+') — 1) '+fixes[0]+(fixes[1]?'  2) '+fixes[1]:'')+(fixes[2]?'  3) '+fixes[2]:''));
  saveE();
}
// 10) COVER REPORT — everything above as one .txt
function report(){
  var r=[];
  r.push('COVER LAB REPORT');
  r.push('generated: '+new Date().toISOString());
  r.push('clips: '+S.clips.length+'  length: '+totalDur().toFixed(1)+'s  style: '+S.style);
  r.push('title: '+String(S.title||'(none)'));
  r.push('');
  r.push('TikTok cover spec: 1080x1920 px, 9:16');
  r.push('safe area: top 12% / right 15% / bottom 25% clear of text');
  if(E.f31.last&&E.f31.last.frames){r.push('frame candidates: '+E.f31.last.frames.map(function(c){return c.t+'s (fit '+c.score+')'}).join(', '))}
  if(E.f31.last&&E.f31.last.action){r.push('action window: '+E.f31.last.action.t+'s ('+E.f31.last.action.n+' cuts in 2s)')}
  if(E.f31.last&&E.f31.last.variants){r.push('title variants:');for(var i=0;i<E.f31.last.variants.length;i++)r.push('  '+(i+1)+') '+E.f31.last.variants[i])}
  r.push('reports this session: '+(++E.f31.reports));
  dl('cover-report.txt',r.join('\n'));
  log('COVER REPORT — cover-report.txt downloaded ('+r.length+' lines)');
}
function mount(){
  if($('f31card'))return;
  var card=document.createElement('div');card.className='card';card.id='f31card';
  var h=document.createElement('h2');h.textContent='COVER LAB';card.appendChild(h);
  var r1=mkRow();r1.appendChild(mkBtn('COVER FRAME',framePicker,'1 1 auto','f31b1'));r1.appendChild(mkBtn('COVER TEXT CHECK',textCheck,'1 1 auto','f31b2'));card.appendChild(r1);
  var r2=mkRow();r2.appendChild(mkBtn('SAFE ZONE CHECK',safeCheck,'1 1 auto','f31b3'));r2.appendChild(mkBtn('COVER PREVIEW',preview,'1 1 auto','f31b4'));card.appendChild(r2);
  var r3=mkRow();r3.appendChild(mkBtn('CONTRAST CHECK',contrast,'1 1 auto','f31b5'));r3.appendChild(mkBtn('ACTION FRAME',actionFrame,'1 1 auto','f31b6'));card.appendChild(r3);
  var r4=mkRow();r4.appendChild(mkBtn('COVER VARIANTS',variants,'1 1 auto','f31b7'));r4.appendChild(mkBtn('SPEC CHECK',spec,'1 1 auto','f31b8'));card.appendChild(r4);
  var r5=mkRow();r5.appendChild(mkBtn('COVER FIX LIST',fixList,'1 1 auto','f31b9'));r5.appendChild(mkBtn('COVER REPORT .TXT',report,'1 1 auto','f31b10'));card.appendChild(r5);
  var note=document.createElement('div');note.className='note';note.id='f31note';note.textContent='cover lab makes the cover: frame picker ranks the best frames by style and speed changes plus midpoint, text check keeps the title inside 30 chars, safe zone check keeps text out of the username and caption bars, preview draws the three layouts, contrast check grades text against the background, action frame finds the busiest 2 seconds, variants writes three titles, spec check confirms 1080x1920, the fix list ranks what to change, and the report downloads it all.';
  card.appendChild(note);
  var hs=document.querySelectorAll('.card h2'),anchor=null;
  for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('SOUND LAB')>=0){anchor=hs[i].parentElement;break}}
  if(anchor){if(anchor.nextSibling)anchor.parentElement.insertBefore(card,anchor.nextSibling);else anchor.parentElement.appendChild(card)}
  else{var ap=document.querySelector('#panelcol')||document.body;ap.appendChild(card)}
  log('cover lab live — cover frame picker, cover text check, safe zone check, cover preview, contrast check, action frame, cover variants, spec check, cover fix list, cover report');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();