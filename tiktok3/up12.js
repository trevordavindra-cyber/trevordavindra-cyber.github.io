'use strict';
/* up12.js - SHORTFORGE v12 VOICE LAB (Nov 25 2026) */
(function(){
if(window.__sfup12){return;}
window.__sfup12=1;
function need(){if(!window.SCENES||!SCENES.length){glog('forge a script first (FORGE 12 tools need scenes)',0);return false}return true}
function glog(m,hl){try{step(m,hl)}catch(e){console.log('[forge12]',m)}}
function words(s){return String(s||'').trim().split(/\s+/).filter(Boolean)}
function mkBtn(id,label,fn){var b=document.createElement('button');b.id=id;b.textContent=label;b.style.cssText='background:#0b1418;border:1px solid #2de2ff;color:#eaffff;font:700 10px monospace;padding:6px 10px;margin:3px;cursor:pointer;border-radius:6px';b.addEventListener('click',function(){try{if(need())fn()}catch(e){glog('forge12 error: '+e.message,0)}});return b}
function dlB(txt,name){try{var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));a.download=name;a.style.display='none';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a)},200)}catch(e){glog('download blocked: '+e.message,0)}}
function title(){return String((window.META&&META.title)||'this topic')}
function tot(){var t=0;SDUR.forEach(function(d){t+=d});return t}
function textOf(s){return String((s&&(s.t||s.cap||s.text||s.vo||s.narration||s.line))||'')}
function mount(){
 var bp=document.getElementById('boardPanel');if(!bp||bp.querySelector('#g12b1'))return;
 var row=document.createElement('div');row.style.cssText='margin-top:12px';
 var h=document.createElement('div');h.textContent='FORGE 12 VOICE LAB';h.style.cssText='color:#2de2ff;font:700 11px monospace;margin:4px 3px';row.appendChild(h);
 var btns=document.createElement('div');btns.style.cssText='display:flex;flex-wrap:wrap';row.appendChild(btns);
 var anchor=bp.querySelector('.rowbtns');if(anchor)bp.insertBefore(row,anchor);else bp.appendChild(row);
 btns.appendChild(mkBtn('g12b1','VOICE CLARITY',voiceClarity));
 btns.appendChild(mkBtn('g12b2','SOUND DYNAMICS',soundDynamics));
 btns.appendChild(mkBtn('g12b3','WORD EMPHASIS',wordEmphasis));
 btns.appendChild(mkBtn('g12b4','EQ SHAPE',eqShape));
 btns.appendChild(mkBtn('g12b5','PAUSE TUNER',pauseTuner));
 btns.appendChild(mkBtn('g12b6','TEMPO ALIGNER',tempoAligner));
 btns.appendChild(mkBtn('g12b7','FREQ CLEANUP',freqCleanup));
 btns.appendChild(mkBtn('g12b8','BACKGROUND MUTER',backgroundMuter));
 btns.appendChild(mkBtn('g12b9','VOICE SAMPLES',voiceSamples));
 btns.appendChild(mkBtn('g12b10','VOICE SHEET',voiceSheet));
 glog('FORGE 12 VOICE LAB ready: 10 tools',1);
}
function avgWordsPerSec(){var t=0;SCENES.forEach(function(s){t+=words(textOf(s)).length});return tot()>0?t/tot():0}
function voiceClarity(){var wps=avgWordsPerSec();var long=[];SCENES.forEach(function(s,i){var w=words(textOf(s));var dur=SDUR[i]||4;var wps1=w.length/Math.max(1,dur);if(wps1>3.1)long.push('scene '+(i+1)+' ('+wps1.toFixed(1)+' w/s)')});
 var filler=['like','um','uh','basically','literally','actually','really','just','very','so'];var hits=[];SCENES.forEach(function(s,i){words(textOf(s).toLowerCase()).forEach(function(w){if(filler.indexOf(w)>-1&&!hits.includes((i+1)+':'+w))hits.push((i+1)+':'+w)})});
 glog('VOICE CLARITY: speak rate '+wps.toFixed(1)+' words/sec (sweet spot 2.3-2.6) | too-dense: '+(long.length?long.join(', '):'none')+' | filler words: '+(hits.length?hits.length+' ('+hits.slice(0,6).join(', ')+(hits.length>6?', ..':'')+')':'none')+' | verdict: '+(wps>2.6?'trim '+Math.max(1,Math.round(tot()*0.06))+'s of words for air':wps<2.0?'pace is slow, energy is fine':'clean pace'),1)}
function soundDynamics(){var levels=SCENES.map(function(s,i){var w=words(textOf(s)).length;var dur=Math.max(1,SDUR[i]||4);return Math.min(10,3+w*0.55/dur)});var hi=Math.max.apply(null,levels),lo=Math.min.apply(null,levels);var range=hi-lo;
 glog('SOUND DYNAMICS: scene energy '+lo.toFixed(1)+' to '+hi.toFixed(1)+' (range '+(range*10).toFixed(0)+'%)'+(range<2?' | too flat: pump scene '+(levels.indexOf(hi)+1)+' delivery up 2 notches and drop a 3dB limiter on the mix':' | good spread, add gentle compression 3:1 on voice so quiet words stay audible on phone speakers')+' | phone-speaker pass: keep everything above -18dB',1)}
function wordEmphasis(){var strong=['never','always','huge','insane','secret','free','banned','truth','proof','million','best','worst','stop','warning','nobody','everyone'];var out=[];SCENES.forEach(function(s,i){var w=words(textOf(s));var hit=w.filter(function(x){return strong.indexOf(x.toLowerCase())>-1});out.push('scene '+(i+1)+': '+(hit.length?hit.join(', '):'(flat, mark one power word)'))});
 glog('WORD EMPHASIS '+out.join(' | ')+'. CAPS those words on screen and punch them in voice, one punch per scene max or it reads as shouting',1)}
function eqShape(){var charts=[];SCENES.forEach(function(s,i){var t=textOf(s).toLowerCase();var kind=/question|\?/.test(t)?'bright +2dB at 4kHz (curiosity)':/story|once|years/.test(t)?'warm +2dB at 250Hz (storytelling)':/list|number|top \d/.test(t)?'neutral with +1dB presence 2kHz':'mid-forward +1.5dB 1kHz (default)'});
 glog('EQ SHAPE '+charts.map(function(c,i){return 's'+(i+1)+' '+c}).join(' | ')+' | high-pass everything at 80Hz to kill rumble',1)}
function pauseTuner(){var out=SCENES.map(function(s,i){var w=words(textOf(s)).length;var dur=Math.max(1,SDUR[i]||4);var slack=Math.max(0,dur-w/2.5);var p=slack>0.8?0.35:slack>0.3?0.2:0.08;return 's'+(i+1)+' pause '+p.toFixed(2)+'s'+(i===0?' (before word one: 0.5s cold open silence)':i===SCENES.length-1?' (end: 1.2s before loop cut)':'')});
 glog('PAUSE TUNER '+out.join(' | '),1)}
function tempoAligner(){var bpm=Math.round(120+Math.min(40,SCENES.length*4));var spb=60/bpm;var cuts=[];var t=0;SDUR.forEach(function(d,i){t+=d;cuts.push((t/spb).toFixed(1)+' beat'+(i+1))});
 glog('TEMPO ALIGNER: '+bpm+' BPM fits this length | put cut '+(cuts.join(' | ').replace(/beat(\d+)/g,'$1 on beat'))+' | shift each cut +-0.15s to land on a beat, loop feels twice as tight',1)}
function freqCleanup(){var wps=avgWordsPerSec();var flags=[];if(wps>2.8)flags.push('sibilance 6-8kHz: de-esser at -4dB');flags.push('mud 200-350Hz: cut -2dB wide');flags.push('box 400-600Hz: sweep and cut worst peak -3dB');flags.push('harsh 2-4kHz: -1.5dB on loud scenes');flags.push('air 10kHz+: shelf +1.5dB for phone clarity');
 glog('FREQ CLEANUP '+flags.join(' | '),1)}
function backgroundMuter(){var noisy=[];SCENES.forEach(function(s,i){if(words(textOf(s)).length>0&&words(textOf(s)).length/ (SDUR[i]||4) <1.6)noisy.push('s'+(i+1))});
 glog('BACKGROUND MUTER: music bed duck -14dB under every voice line'+(noisy.length?' | sparse scenes '+noisy.join(', ')+' let bed rise 3dB for atmosphere, watch phase on the loop join':' | steady bed all the way')+' | gate noise floor -45dB, keep 0.3s natural tail so cuts dont sound severed',1)}
function voiceSamples(){var L=['VOICE SAMPLES - '+title(),''];SCENES.forEach(function(s,i){L.push((i+1)+'. ['+(SDUR[i]||4).toFixed(1)+'s] '+textOf(s))});
 L.push('','take rules: 2 takes per line, pick take 2 unless take 1 had a mistake','save name: '+title().toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,24)+'-v12.txt');
 dlB(L.join('\n'),'voice-samples.txt');glog('VOICE SAMPLES manifest saved ('+SCENES.length+' lines)',1)}
function voiceSheet(){var L=['FORGE 12 VOICE SHEET - '+new Date().toLocaleString(),''];L.push('title: '+title());L.push('scenes: '+SCENES.length+' | length: '+tot().toFixed(1)+'s | speak rate: '+avgWordsPerSec().toFixed(1)+' w/s');
 L.push('','voice clarity / dynamics / emphasis / eq / pauses / tempo / freq cleanup / muting / samples: see log');
 dlB(L.join('\n'),'forge12-sheet.txt');glog('FORGE 12 SHEET saved',1)}
function boot(){try{mount()}catch(e){console.log('[forge12] boot',e)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
