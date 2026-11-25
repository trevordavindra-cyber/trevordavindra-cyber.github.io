'use strict';
(function(){
  if(window.__tk2up84){return;}
  window.__tk2up84=true;
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
  cards.forEach(function(c){if(c.innerText.includes('PACING LAB')){target=c;}});
  if(!target){return;}
  var newCard=document.createElement('div');
  newCard.className='card';
  var h2=document.createElement('h2');
  h2.textContent='RETENTION LAB';
  newCard.appendChild(h2);
  target.parentNode.insertBefore(newCard,target.nextSibling);
  var RET=window.__tk2ret=window.__tk2ret||{};
  var gd=function(c){var d=parseFloat(c.end)-parseFloat(c.start);if(!isFinite(d)||d<=0){d=c.buf&&c.buf.duration?parseFloat(c.buf.duration):0;}if(!isFinite(d)||d<=0){d=parseFloat(c.duration)||parseFloat(c.dur)||0;}if(!isFinite(d)||d<0){d=0;}return d/(parseFloat(c.speed)||1);};
  var curve=function(){var pts=[];var r=100;var t=0;clips.forEach(function(c){var d=gd(c);var risk=0.9+Math.min(d,6)*0.035;t=Math.max(r-risk*0.9,8);pts.push({id:c.id,t0:t0||0,dur:d,start:r,end:t});r=t;t0=t0+d;});return pts;};
  var t0=0;
  var defs=[
{ id:'f84b1',label:'RETENTION MAP',handler:function(){if(!clips.length){log('RETENTION LAB: add a clip first');return;}t0=0;var pts=curve();var out=pts.map(function(p){return p.id+' '+p.start.toFixed(0)+'%->'+p.end.toFixed(0)+'%';});RET.map=pts;var avg=pts.reduce(function(a,p){return a+(p.start+p.end)/2;},0)/pts.length;log('RETENTION LAB: map - '+out.join(', ')+' | avg hold '+avg.toFixed(0)+'%');}},{ id:'f84b2',label:'DROP ZONES',handler:function(){if(!clips.length){log('RETENTION LAB: add a clip first');return;}t0=0;var pts=curve();var drops=pts.map(function(p){return {id:p.id,fall:p.start-p.end};}).sort(function(a,b){return b.fall-a.fall;}).slice(0,3);log('RETENTION LAB: drop zones - '+drops.map(function(d){return d.id+' -'+d.fall.toFixed(0)+'% (tighten or cut)';}).join(', '));}},{ id:'f84b3',label:'REWATCH PICKS',handler:function(){if(!clips.length){log('RETENTION LAB: add a clip first');return;}var sorted=clips.slice().sort(function(a,b){return gd(a)-gd(b);});var picks=sorted.slice(0,2).map(function(c){return c.id+' ('+gd(c).toFixed(1)+'s)';});log('RETENTION LAB: rewatch picks - '+picks.join(', ')+' loop these, short punchy scenes get rewatched most');}},{ id:'f84b4',label:'HOOK SCORE',handler:function(){if(!clips.length){log('RETENTION LAB: add a clip first');return;}var h=clips[0];var d=gd(h);var score=Math.max(5,Math.min(100,Math.round(100-Math.abs(d-2.2)*22)));RET.hook=score;var verdict=score>=80?'strong hook':(score>=55?'ok hook, sharpen the first line':'weak hook, re-cut the open');log('RETENTION LAB: hook score '+score+'/100 ('+d.toFixed(1)+'s open) - '+verdict);}},{ id:'f84b5',label:'SCROLL RISK',handler:function(){if(!clips.length){log('RETENTION LAB: add a clip first');return;}var risks=clips.map(function(c,i){var d=gd(c);var s=Math.min(100,Math.round(20+d*11+(i===0?0:6)));return {id:c.id,s:s};}).sort(function(a,b){return b.s-a.s;});RET.risks=risks;var top=risks.slice(0,3).map(function(r){return r.id+' '+r.s+'%';});log('RETENTION LAB: scroll risk - top 3 '+top.join(', ')+' (long scenes scroll first)');}},{ id:'f84b6',label:'FIX RANK',handler:function(){if(!clips.length){log('RETENTION LAB: add a clip first');return;}t0=0;var pts=curve();var worst=pts.map(function(p){return {id:p.id,fall:p.start-p.end};}).sort(function(a,b){return b.fall-a.fall;})[0];var h=clips[0];var hd=gd(h);var fixes=['1. cut or tighten '+worst.id+' (biggest drop)','2. '+(hd>3?'shorten hook '+h.id+' to 2s':'keep hook '+h.id+' tight'),'3. move the strongest scene next to the hook'];log('RETENTION LAB: fix rank - '+fixes.join(' | '));}},{ id:'f84b7',label:'SPLIT TEST',handler:function(){if(!clips.length){log('RETENTION LAB: add a clip first');return;}var h=clips[0];var d=gd(h);var a='A: '+h.id+' as-is ('+d.toFixed(1)+'s)';var b='B: '+h.id+' cut to '+(d*0.55).toFixed(1)+'s, jump straight to scene 2';log('RETENTION LAB: split test - '+a+' vs '+b+' | run A, then B, keep the one with better 3s hold');}},{ id:'f84b8',label:'BENCH CHECK',handler:function(){if(!clips.length){log('RETENTION LAB: add a clip first');return;}t0=0;var pts=curve();var avg=pts.reduce(function(a,p){return a+(p.start+p.end)/2;},0)/pts.length;var bench=52;var gap=Math.round(avg-bench);var verdict=gap>=0?('above the '+bench+'% 10k-view benchmark by '+gap+'pts'):(gap*-1)+'pts BELOW the '+bench+'% benchmark - tighten the middle scenes';log('RETENTION LAB: bench check - avg hold '+avg.toFixed(0)+'% vs '+bench+'%: '+verdict);}},{ id:'f84b9',label:'RESET RETENTION',handler:function(){if(!clips.length){log('RETENTION LAB: add a clip first');return;}RET.map=null;RET.hook=null;RET.risks=null;log('RETENTION LAB: reset - map, hook score and risks cleared');}},{ id:'f84b10',label:'RETENTION SHEET .TXT',handler:function(){if(!clips.length){log('RETENTION LAB: add a clip first');return;}t0=0;var pts=curve();var avg=pts.reduce(function(a,p){return a+(p.start+p.end)/2;},0)/pts.length;var txt='RETENTION LAB PLAN\nclips: '+clips.length+'\n'+pts.map(function(p){return p.id+','+p.start.toFixed(0)+'%,'+p.end.toFixed(0)+'%';}).join('\n')+'\nhook score: '+(RET.hook||'not scored')+'\navg hold: '+avg.toFixed(0)+'%\nbenchmark: 52%\ndownload: retention_sheet.txt';download('retention_sheet.txt',txt);log('RETENTION LAB: downloaded sheet');}}
];;
  defs.forEach(function(def){
    var btn=mkBtn(def.id,def.label,newCard);
    btn.addEventListener('click',def.handler);
  });
})();