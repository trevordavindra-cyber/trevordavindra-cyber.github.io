'use strict';
/* up13.js - SHORTFORGE v13 HOOK LAB (Nov 25 2026) */
(function(){
if(window.__sfup13){return;}
window.__sfup13=1;
function need(){if(!window.SCENES||!SCENES.length){glog('forge a script first (FORGE 13 tools need scenes)',0);return false}return true}
function glog(m,hl){try{step(m,hl)}catch(e){console.log('[forge13]',m)}}
function words(s){return String(s||'').trim().split(/\s+/).filter(Boolean)}
function mkBtn(id,label,fn){var b=document.createElement('button');b.id=id;b.textContent=label;b.style.cssText='background:#0b1418;border:1px solid #2de2ff;color:#eaffff;font:700 10px monospace;padding:6px 10px;margin:3px;cursor:pointer;border-radius:6px';b.addEventListener('click',function(){try{if(need())fn()}catch(e){glog('forge13 error: '+e.message,0)}});return b}
function dlB(txt,name){try{var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));a.download=name;a.style.display='none';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a)},200)}catch(e){glog('download blocked: '+e.message,0)}}
function title(){return String((window.META&&META.title)||'this topic')}
function tot(){var t=0;SDUR.forEach(function(d){t+=d});return t}
function textOf(s){return String((s&&(s.t||s.cap||s.text||s.vo||s.narration||s.line))||'')}
function first(){return textOf(SCENES[0])}
function last(){return textOf(SCENES[SCENES.length-1])}
function mount(){
 var bp=document.getElementById('boardPanel');if(!bp||bp.querySelector('#g13b1'))return;
 var row=document.createElement('div');row.style.cssText='margin-top:12px';
 var h=document.createElement('div');h.textContent='FORGE 13 HOOK LAB';h.style.cssText='color:#2de2ff;font:700 11px monospace;margin:4px 3px';row.appendChild(h);
 var btns=document.createElement('div');btns.style.cssText='display:flex;flex-wrap:wrap';row.appendChild(btns);
 var anchor=bp.querySelector('.rowbtns');if(anchor)bp.insertBefore(row,anchor);else bp.appendChild(row);
 btns.appendChild(mkBtn('g13b1','HOOK SCORE',hookScore));
 btns.appendChild(mkBtn('g13b2','HOOK VARIANTS',hookVariants));
 btns.appendChild(mkBtn('g13b3','FIRST 3 SECONDS',first3));
 btns.appendChild(mkBtn('g13b4','PATTERN INTERRUPT',interrupt));
 btns.appendChild(mkBtn('g13b5','LOOP SEAM',loopSeam));
 btns.appendChild(mkBtn('g13b6','TITLE SPIN',titleSpin));
 btns.appendChild(mkBtn('g13b7','THUMB WORD',thumbWord));
 btns.appendChild(mkBtn('g13b8','HOOK A/B',hookAB));
 btns.appendChild(mkBtn('g13b9','HOOK LADDER',hookLadder));
 btns.appendChild(mkBtn('g13b10','HOOK SHEET',hookSheet));
 glog('FORGE 13 HOOK LAB ready: 10 tools',1);
}
function scoreLine(line){
 var s=0;var w=words(line.toLowerCase());
 var power=['nobody','never','stop','secret','truth','banned','million','insane','proof','warning','free','worst','best','happened','actually'];
 w.forEach(function(x){if(power.indexOf(x)>-1)s+=8});
 if(/\d/.test(line))s+=6;
 if(line.length>0&&line.length<60)s+=8;else if(line.length>=60)s+=2;
 if(/^(you|your|this is why|here is|stop|nobody|i tried)/i.test(line.trim()))s+=10;
 if(/question|why|how|what/i.test(line)&&/\?/.test(line))s+=6;
 if(w.length<7)s+=6;else if(w.length>22)s-=4;
 return Math.max(5,Math.min(98,s));
}
function hookScore(){
 var f=first();var sc=scoreLine(f);
 glog('HOOK SCORE '+sc+'/100 on "'+f.slice(0,60)+(f.length>60?'..':'')+'" | '+(sc>=70?'strong, keep it':sc>=50?'decent: cut the first 4 words, the hook is hiding there':'weak: open with the result or the shock, not the setup')+' | first frame must show something moving, not a title card',1);
}
function hookVariants(){
 var t=title();var f=first();
 var v=['nobody talks about '+t.toLowerCase(),t+' but nobody warns you first',i0(f)+' then it gets worse',t+' in under '+Math.round(tot())+' seconds'];
 glog('HOOK VARIANTS: 1) '+v[0]+' 2) '+v[1]+' 3) '+v[2]+' 4) '+v[3]+' | read all four out loud, ship the one you would stop scrolling on',1);
}
function i0(l){var w=words(l);return w.slice(0,4).join(' ')||'it starts normal'}
function first3(){
 var a=(SDUR[0]||4);var w=words(first()).length;
 var verdict=a<=2.5&&w<=10?'locked in: short open, motion on frame one':a<=3.5?'close: trim scene 1 to 2.5s and drop to 8 words max':'too slow: '+a.toFixed(1)+'s and '+w+' words, cut to one line under 2.5s';
 glog('FIRST 3 SECONDS: scene 1 is '+a.toFixed(1)+'s, '+w+' words | '+verdict+' | no logo, no intro, no fade-in: hard cut on frame 1',1);
}
function interrupt(){
 var spots=[];var t=0;for(var i=0;i<SCENES.length;i++){t+=(SDUR[i]||4);if(t>4&&t<tot()-3)spots.push((i+1)+'@'+t.toFixed(1)+'s')}
 glog('PATTERN INTERRUPT: drop a jolt (zoom punch, sound spike, on-screen number) at '+(spots.length?spots.slice(0,3).join(', '):'the midpoint')+' | every 4-5s change something visual or they scroll',1);
}
function loopSeam(){
 var a=words(last()),b=words(first());var shared=0;a.forEach(function(x){if(b.indexOf(x)>-1)shared++});
 var pct=a.length?Math.round(shared*100/a.length):0;
 glog('LOOP SEAM: end "'+last().slice(0,40)+'" vs start "'+first().slice(0,40)+'" word overlap '+pct+'% | '+(pct>=40?'seamless, viewers rewatch without noticing':(last().length===0?'no last line: end mid-action so the loop cuts clean':'bridge it: end the last scene mid-motion and let scene 1 complete it'))+' | hard audio cut, no fade at the loop',1);
}
function titleSpin(){
 var t=title();
 var v=[t,how(t),'stop scrolling: '+t.toLowerCase(),t+' (nobody expected this)',did(t)];
 glog('TITLE SPIN: 1) '+v[0]+' 2) '+v[1]+' 3) '+v[2]+' 4) '+v[3]+' 5) '+v[4]+' | pick one with a number or a negative in it, those get tapped most',1);
}
function how(t){return 'how '+t.toLowerCase()+' actually works'}
function did(t){return 'i tried '+t.toLowerCase()+' for 7 days'}
function thumbWord(){
 var w=words(first().toLowerCase()).filter(function(x){return x.length>3});
 var pick=w[0]||title().split(' ')[0];
 glog('THUMB WORD: put "'+String(pick).toUpperCase()+'" huge on the cover, 3 letters max reads best on a phone | cyan text, dark background, face or motion behind it',1);
}
function hookAB(){
 var f=first();
 glog('HOOK A/B: A = "'+f.slice(0,50)+'" as-is | B = open on the most shocking scene, voiceover starts 0.5s late | run A for 48h, then B on a fresh upload, keep the better 3s hold',1);
}
function hookLadder(){
 var t=title();
 glog('HOOK LADDER: line 1 "'+t+'" | line 2 "and the reason why is dumber than you think" | line 3 "wait for part 2, it gets worse" | each line buys 3 more seconds only if the last one landed',1);
}
function hookSheet(){
 var L=['FORGE 13 HOOK SHEET - '+new Date().toLocaleString(),''];
 L.push('title: '+title());L.push('scenes: '+SCENES.length+' | length: '+tot().toFixed(1)+'s');
 L.push('','open line: '+first());L.push('hook score: see log');L.push('variants / first 3s / interrupts / loop seam / titles / thumb word / A-B / ladder: see log');
 dlB(L.join('\n'),'forge13-sheet.txt');glog('FORGE 13 SHEET saved',1);
}
function boot(){try{mount()}catch(e){console.log('[forge13] boot',e)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
