'use strict';
/* up15.js - SHORTFORGE v16 SFX LAB (Nov 25 2026) */
(function(){
if(window.__sfup15){return;}
window.__sfup15=1;
function need(){if(!window.SCENES||!SCENES.length){glog('forge a script first (FORGE 16 tools need scenes)',0);return false}return true}
function glog(m,hl){try{step(m,hl)}catch(e){console.log('[forge16]',m)}}
function words(s){return String(s||'').trim().split(/\s+/).filter(Boolean)}
function mkBtn(id,label,fn){var b=document.createElement('button');b.id=id;b.textContent=label;b.style.cssText='background:#0b1418;border:1px solid #2de2ff;color:#eaffff;font:700 10px monospace;padding:6px 10px;margin:3px;cursor:pointer;border-radius:6px';b.addEventListener('click',function(){try{if(need())fn()}catch(e){glog('forge16 error: '+e.message,0)}});return b}
function dlB(txt,name){try{var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));a.download=name;a.style.display='none';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a)},200)}catch(e){glog('download blocked: '+e.message,0)}}
function title(){return String((window.META&&META.title)||'this topic')}
function tot(){var t=0;SDUR.forEach(function(d){t+=d});return t}
function textOf(s){return String((s&&(s.t||s.cap||s.text||s.vo||s.narration||s.line))||'')}
function wc(s){return words(textOf(s)).length}
function roleOf(i,n){
 if(i===0)return 'hook';
 if(i===n-1)return 'outro';
 if(i===Math.floor(n/2))return 'midpoint';
 return 'body';
}
function mood(s){
 var t=textOf(s).toLowerCase();
 if(/reveal|secret|nobody|hidden|truth/.test(t))return 'reveal';
 if(/money|cash|rich|pay|dollar|price/.test(t))return 'money';
 if(/fast|now|quick|instant|hack/.test(t))return 'action';
 if(/story|remember|back then|years ago/.test(t))return 'story';
 if(/finally|last|bottom line|anyway/.test(t))return 'close';
 return 'info';
}
var AMB={action:'tight neon city hum',story:'warm room tone',money:'cash-register-adjacent clicky tones',reveal:'low dark pad',close:'calm fading room tone',info:'neutral soft room tone'};
var SFX={hook:'riser',reveal:'impact stinger',money:'coin/cha-ching hit',action:'whoosh on cut',story:'soft tick',close:'outro stinger',info:'tiny UI tick'};
function sfxPlan(){
 var out=[];SCENES.forEach(function(s,i){var m=mood(s);out.push({i:i,role:roleOf(i,SCENES.length),mood:m,sfx:SFX[m],amb:AMB[m],d:SDUR[i]||4,w:wc(s)})});
 return out;
}
function mount(){
 var bp=document.getElementById('boardPanel');if(!bp||bp.querySelector('#g16b1'))return;
 var row=document.createElement('div');row.style.cssText='margin-top:12px';
 var h=document.createElement('div');h.textContent='FORGE 16 SFX LAB';h.style.cssText='color:#2de2ff;font:700 11px monospace;margin:4px 3px';row.appendChild(h);
 var btns=document.createElement('div');btns.style.cssText='display:flex;flex-wrap:wrap';row.appendChild(btns);
 var anchor=bp.querySelector('.rowbtns');if(anchor)bp.insertBefore(row,anchor);else bp.appendChild(row);
 btns.appendChild(mkBtn('g16b1','SFX MAP',sfxMap));
 btns.appendChild(mkBtn('g16b2','CUT WHOOSH',cutWhoosh));
 btns.appendChild(mkBtn('g16b3','RISER POINT',riserPoint));
 btns.appendChild(mkBtn('g16b4','IMPACT CHECK',impactCheck));
 btns.appendChild(mkBtn('g16b5','AMBIENCE LAYER',ambLayer));
 btns.appendChild(mkBtn('g16b6','VO DUCK',voDuck));
 btns.appendChild(mkBtn('g16b7','SILENCE POCKETS',silentPocket));
 btns.appendChild(mkBtn('g16b8','LOUDNESS CURVE',loudCurve));
 btns.appendChild(mkBtn('g16b9','SFX SCORE',sfxScore));
 btns.appendChild(mkBtn('g16b10','SFX SHEET',sfxSheet));
 glog('FORGE 16 SFX LAB ready: 10 tools',1);
}
function sfxMap(){
 var p=sfxPlan();var out=p.map(function(x){return 's'+(x.i+1)+'('+x.role+'|'+x.mood+') '+x.sfx});
 glog('SFX MAP ['+title()+']: '+out.join(' | ')+' | every sfx here is one clean layer, never stack two in the same second',1);
}
function cutWhoosh(){
 var keep=[];SCENES.forEach(function(s,i){if(i>0&&(i%2===1))keep.push('s'+i+'-to-s'+(i+1))});
 glog('CUT WHOOSH: whoosh '+keep.join(', ')+' (alternate cuts, skip the rest) | whooshing every cut is the fastest way to sound like a slideshow',1);
}
function riserPoint(){
 var best=0,bi=0;SDUR.forEach(function(d,i){if(d>best){best=d;bi=i}});
 var at=bi>0?bi:Math.max(1,Math.floor(SCENES.length/2));
 glog('RISER POINT: put the riser right before s'+(at+1)+' (starts '+(SDUR[at-1]||4).toFixed(1)+'s early), let it peak exactly when s'+(at+1)+' opens - that drop IS the retention moment',1);
}
function impactCheck(){
 var hits=0;SCENES.forEach(function(s,i){if(mood(s)==='reveal'||mood(s)==='money')hits++});
 var per=(hits/SCENES.length).toFixed(2);
 glog('IMPACT CHECK: '+hits+' hit-eligible scenes of '+SCENES.length+' ('+per+'/scene)'+(hits>3?' | too many stingers: keep max 2, the loudest tools on reveal + outro':' | dose is fine'),1);
}
function ambLayer(){
 var p=sfxPlan();var out=p.map(function(x){return 's'+(x.i+1)+' '+x.amb});
 glog('AMBIENCE LAYER: '+out.join(' | ')+' | ambience rides at -18dB under everything, it should be felt not heard',1);
}
function voDuck(){
 var busy=[];SCENES.forEach(function(s,i){if(wc(s)/(SDUR[i]||4)>2.6)busy.push('s'+(i+1)+' '+wc(s)+'w/'+(SDUR[i]||4).toFixed(1)+'s')});
 glog('VO DUCK: music -8dB under VO, SFX -6dB, ambience -18dB'+(busy.length?' | dense scenes ('+busy.join(', ')+') lose all sfx, words win':' | pacing leaves room for sfx on every scene'),1);
}
function silentPocket(){
 glog('SILENCE POCKETS: keep s1 first 1.5s sfx-free (clean hook entry) and a 0.4s dead drop right after the riser peak - silence before the payoff makes the payoff land',1);
}
function loudCurve(){
 var n=SCENES.length;var out=SCENES.map(function(s,i){var r=i/(Math.max(1,n-1));var lvl=(0.5+0.45*r*r).toFixed(2);return 's'+(i+1)+' '+lvl});
 glog('LOUDNESS CURVE: '+out.join(' | ')+' (relative music bed level, 1.0 = max) | rise with the story, never start at max or you have nowhere to go',1);
}
function sfxScore(){
 var p=sfxPlan();var hits=0;p.forEach(function(x){if(x.mood==='reveal'||x.mood==='money')hits++});
 var sc=Math.max(40,92-hits*6-(p.length>10?4:0));
 glog('SFX SCORE: '+sc+'/100 - '+(sc>=85?'plan is tight: one signature sound per mood, riser lands on the biggest scene':sc>=70?'solid, trim one hit and keep the riser':'too busy: cut stingers until only reveal + outro hit'),1);
}
function sfxSheet(){
 var p=sfxPlan();var lines=['SHORTFORGE SFX SHEET - '+title(),'generated by FORGE 16 SFX LAB (Nov 25 2026) - total '+tot().toFixed(1)+'s across '+p.length+' scenes',''];
 p.forEach(function(x){lines.push('s'+(x.i+1)+' ['+x.role+'] '+x.d.toFixed(1)+'s '+x.w+'w','  mood: '+x.mood,'  sfx: '+x.sfx,'  ambience: '+x.amb,'')});
 lines.push('rules: music -8dB under VO, sfx -6dB, ambience -18dB','whoosh only on alternate cuts','max 2 impact stingers total (reveal + outro)','riser peaks exactly on the climax scene open','s1 first 1.5s stays sfx-free');
 var txt=lines.join('\n');
 try{window.__sf_sfx_sheet=txt}catch(e){}
 glog('SFX SHEET: '+txt.length+' chars built, downloading sfx_sheet.txt',1);
 dlB(txt,'sfx_sheet.txt');
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){setTimeout(mount,80)})}else{setTimeout(mount,80)}
})();
