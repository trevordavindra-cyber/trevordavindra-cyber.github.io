'use strict';
/* up18.js - SHORTFORGE FORGE 20 RETENTION LAB (Nov 25 2026) v1 */
(function(){
if(window.__sfup18){return;}
window.__sfup18=1;
function need(){if(!window.SCENES||!SCENES.length){glog('forge a script first (FORGE 20 tools need scenes)',0);return false}return true}
function glog(m,hl){try{step(m,hl)}catch(e){console.log('[forge20]',m)}}
function words(s){return String(s||'').trim().split(/\s+/).filter(Boolean)}
function mkBtn(id,label,fn){var b=document.createElement('button');b.id=id;b.textContent=label;b.style.cssText='background:#0b1418;border:1px solid #2de2ff;color:#eaffff;font:700 10px monospace;padding:6px 10px;margin:3px;cursor:pointer;border-radius:6px';b.addEventListener('click',function(){try{if(need())fn()}catch(e){glog('forge20 error: '+e.message,0)}});return b}
function dlB(txt,name){try{var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));a.download=name;a.style.display='none';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a)},200)}catch(e){glog('download blocked: '+e.message,0)}}
function title(){return String((window.META&&META.title)||'this topic')}
function tot(){var t=0;SDUR.forEach(function(d){t+=d});return t}
function textOf(s){return String((s&&(s.t||s.cap||s.text||s.vo||s.narration||s.line))||'')}
function wc(s){return words(textOf(s)).length}
function clips(){var t=0;return SCENES.map(function(s,i){var d=SDUR[i]||4,st=t;t+=d;return {i:i,dur:d,st:st,en:t,w:wc(s),txt:textOf(s)}})}
function hookText(){var cs=clips();return cs.length?(cs[0].txt||'(empty hook)'):'(no scenes)'}
function payoffText(){var cs=clips();for(var i=cs.length-1;i>=0;i--){if(cs[i].txt)return cs[i].txt}return '(empty)'}
function midScene(){var cs=clips();if(!cs.length)return null;var mid=tot()/2,best=cs[0];cs.forEach(function(c){if(Math.abs((c.st+c.en)/2-mid)<Math.abs((best.st+best.en)/2-mid))best=c});return best}
function mount(){
 var bp=document.getElementById('boardPanel');if(!bp||bp.querySelector('#g19b1'))return;
 var row=document.createElement('div');row.style.cssText='margin-top:12px';
 var h=document.createElement('div');h.textContent='FORGE 20 RETENTION LAB';h.style.cssText='color:#2de2ff;font:700 11px monospace;margin:4px 3px';row.appendChild(h);
 var btns=document.createElement('div');btns.style.cssText='display:flex;flex-wrap:wrap';row.appendChild(btns);
 var anchor=bp.querySelector('.rowbtns');if(anchor)bp.insertBefore(row,anchor);else bp.appendChild(row);
 btns.appendChild(mkBtn('g19b1','RETENTION MAP',retMap));
 btns.appendChild(mkBtn('g19b2','FIRST 3S',first3));
 btns.appendChild(mkBtn('g19b3','PATTERN BREAK',patBreak));
 btns.appendChild(mkBtn('g19b4','LOOP CHECK',loopCheck));
 btns.appendChild(mkBtn('g19b5','DROP ZONE',dropZone));
 btns.appendChild(mkBtn('g19b6','PAYOFF TIMING',payoff));
 btns.appendChild(mkBtn('g19b7','MID ROLL',midRoll));
 btns.appendChild(mkBtn('g19b8','END CARD',endCard));
 btns.appendChild(mkBtn('g19b9','RETENTION SCORE',retScore));
 btns.appendChild(mkBtn('g19b10','RETENTION SHEET',retSheet));
 try{glog('FORGE 20 RETENTION LAB mounted (10 tools)',0)}catch(e){}
}
function retMap(){
 var cs=clips(),n=cs.length;
 glog('RETENTION MAP ('+n+' scenes, '+tot().toFixed(1)+'s): '+cs.map(function(c){return 's'+(c.i+1)+' '+c.st.toFixed(1)+'-'+c.en.toFixed(1)+'s ('+Math.round(100*c.st/tot())+'-'+Math.round(100*c.en/tot())+'% of watch)'}).join(' | '),1);
}
function first3(){
 var cs=clips(),s1=cs[0];
 var hasQ=/\?/.test(s1.txt),hasYou=/\byou\b|\byour\b/i.test(s1.txt),num=/\b\d+\b/.test(s1.txt);
 var flags=[];if(hasQ)flags.push('question');if(hasYou)flags.push('2nd person');if(num)flags.push('number');
 glog('FIRST 3S: s1 is '+s1.dur.toFixed(1)+'s, '+s1.w+'w ("'+s1.txt.slice(0,60)+(s1.txt.length>60?'...':'')+'") - hooks present: '+(flags.length?flags.join(', '):'none')+(flags.length?'':' - add a question, a number, or "you" in the first line; the first 3s decide the swipe'),1);
}
function patBreak(){
 var cs=clips(),durs=cs.map(function(c){return c.dur});var same=durs.every(function(d){return Math.abs(d-durs[0])<0.05});
 var wps=cs.map(function(c,i){return {i:i,r:c.w/c.dur}});var flat=wps.filter(function(x){return Math.abs(x.r-wps[0].r)<0.15&&x.i>0});
 glog('PATTERN BREAK: '+(same?'all '+cs.length+' scenes are the same length - ret viewers bail on rhythm they can predict: cut one scene to 1.5s and let one breathe 1.5x longer':flat.length+' scenes run the same words/sec as s1 ('+flat.map(function(x){return 's'+(x.i+1)}).join(', ')+') - vary pace: quick cut after the hook, slow beat on the payoff'),1);
}
function loopCheck(){
 var cs=clips(),a=cs[0],z=cs[cs.length-1];
 var aw=words(a.txt.toLowerCase()).filter(function(x){return x.length>3}),zw=words(z.txt.toLowerCase()).filter(function(x){return x.length>3});
 var shared=aw.filter(function(w){return zw.indexOf(w)>-1});
 var round=Math.abs(tot()-Math.round(tot()))<0.6||Math.abs(tot()-Math.round(tot()+0.5))<0.4;
 glog('LOOP CHECK: total '+tot().toFixed(1)+'s '+(round?'(loops cleanly on the whole-second mark - keep it)':'(does not land on a round number - trim or pad 0.2-0.4s so the replay feels seamless)')+' | last->first overlap words: '+(shared.length?shared.slice(0,4).join(', '):'none')+(shared.length>1?' - strong loop':' - echo one key word from the hook in the last line to sell the rewatch'),1);
}
function dropZone(){
 var cs=clips(),t=tot();var zs=[];
 cs.forEach(function(c){if(c.st/t>0.3&&c.st/t<0.6&&c.w/(c.dur)<1.2)zs.push('s'+(c.i+1)+' flat at '+Math.round(100*c.st/t)+'%')});
 glog('DROP ZONE: '+(zs.length?'risk: '+zs.join(', ')+' - low words/sec in the 30-60% band is where watches drop; add a visual flip (zoom punch, color shift) or a "but here is the twist" line':'no flat stretch found in the 30-60% band - that is the biggest bail window and yours has pace'),1);
}
function payoff(){
 var cs=clips(),t=tot(),last=cs[cs.length-1];
 var pct=Math.round(100*last.st/t);
 glog('PAYOFF TIMING: the payoff sits in the final scene s'+(last.i+1)+' starting at '+pct+'% of the video - that reads as earned, hold it there; if the payoff lands before 70% viewers leave satisfied and never finish: keep the reveal in the last 20-30%',1);
}
function midRoll(){
 var m=midScene();
 glog('MID ROLL: s'+(m.i+1)+' ['+m.st.toFixed(1)+'-'+m.en.toFixed(1)+'s] is your midpoint ("'+m.txt.slice(0,50)+(m.txt.length>50?'...':'')+'") - this is where a rewatch-bait beat belongs: tease the payoff ("wait for the last part"), flip the angle, or drop a one-line cliffhanger; midrolls lift average watch time more than any other edit',1);
}
function endCard(){
 var cs=clips(),z=cs[cs.length-1];
 glog('END CARD: last scene s'+(z.i+1)+' is '+z.dur.toFixed(1)+'s, '+z.w+'w - the last 1.5s should be a clean visual beat (freeze, logo, or question) with the payoff line already read; do not stack new info in the final scene, viewers read it as the video dragging and the loop loses its punch',1);
}
function retScore(){
 var cs=clips(),t=tot();var score=50;
 var h=cs[0];if(h.w&&h.w/h.dur<=3.5)score+=10;
 if(/\?|\byou\b|\b\d+\b/i.test(h.txt))score+=10;
 if(cs.length>=5&&cs.length<=12)score+=8;else score-=4;
 if(Math.abs(t-Math.round(t))<0.6)score+=7;
 var midflat=cs.some(function(c){return c.st/t>0.3&&c.st/t<0.6&&c.w/(c.dur)<1.2});if(!midflat)score+=8;else score-=6;
 var last=cs[cs.length-1];if(last.st/t>=0.7)score+=7;
 if(score>98)score=98;
 glog('RETENTION SCORE '+score+'/100 '+(['50-69: rework the hook and pace','70-84: solid, tighten the middle','85+: ship it'][score<70?0:score<85?1:2]),1);
}
function retSheet(){
 var cs=clips(),t=tot();
 var lines=['FORGE 20 RETENTION SHEET - '+title(),'generated '+new Date().toISOString(),'total '+t.toFixed(1)+'s across '+cs.length+' scenes',''];
 lines.push('RETENTION MAP:');cs.forEach(function(c){lines.push('  s'+(c.i+1)+' '+c.st.toFixed(1)+'-'+c.en.toFixed(1)+'s ('+Math.round(100*c.st/t)+'%) '+c.w+'w')});
 lines.push('');lines.push('CHECKS:');lines.push('  first 3s hook: '+(/\?|\byou\b|\b\d+\b/i.test(cs[0].txt)?'present':'missing'));
 lines.push('  loop point: '+(Math.abs(t-Math.round(t))<0.6?'clean':'needs trim'));
 var m=midScene();lines.push('  midpoint scene: s'+(m.i+1)+' at '+Math.round(100*m.st/t)+'%');
 var last=cs[cs.length-1];lines.push('  payoff start: '+Math.round(100*last.st/t)+'% of runtime');
 dlB(lines.join('\n'),'forge20_retention_sheet.txt');
 glog('RETENTION SHEET downloaded (forge20_retention_sheet.txt)',1);
}
function boot(){
 if(document.getElementById('boardPanel')){mount();return}
 var n=0,iv=setInterval(function(){n++;if(document.getElementById('boardPanel')){clearInterval(iv);mount()}else if(n>120){clearInterval(iv)}},250);
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',boot)}else{boot()}
})();
