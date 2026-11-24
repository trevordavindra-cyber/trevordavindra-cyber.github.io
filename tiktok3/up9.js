'use strict';
/* up9.js - SHORTFORGE v9 EDIT TOOLS (Nov 24 2026) */
(function(){
if(window.__sfup9){return;}
window.__sfup9=1;
function need(){if(!window.SCENES||!SCENES.length){glog('forge a script first (FORGE 9 tools need scenes)',0);return false}return true}
function glog(m,hl){try{step(m,hl)}catch(e){console.log('[forge9]',m)}}
function words(s){return String(s||'').trim().split(/\s+/).filter(Boolean)}
function mkBtn(id,label,fn){var b=document.createElement('button');b.id=id;b.textContent=label;b.style.cssText='background:#0b1418;border:1px solid #2de2ff;color:#eaffff;font:700 10px monospace;padding:6px 10px;margin:3px;cursor:pointer;border-radius:6px';b.addEventListener('click',function(){try{if(need())fn()}catch(e){glog('forge9 error: '+e.message,0)}});return b}
function dlB(txt,name){try{var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));a.download=name;a.style.display='none';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a)},200)}catch(e){glog('download blocked: '+e.message,0)}}
function title(){return String((window.META&&META.title)||'this topic')}
function bt(){var v='phonk';try{v=document.getElementById('beatstyle').value}catch(e){}return String(v||'phonk')}
function tot(){var t=0;SDUR.forEach(function(d){t+=d});return t}
function mount(){
 var bp=document.getElementById('boardPanel');if(!bp||bp.querySelector('#g9b1'))return;
 var row=document.createElement('div');row.style.cssText='margin-top:12px';
 var h=document.createElement('div');h.textContent='FORGE 9 EDIT TOOLS';h.style.cssText='color:#2de2ff;font:700 11px monospace;margin:4px 3px';row.appendChild(h);
 var btns=document.createElement('div');btns.style.cssText='display:flex;flex-wrap:wrap';row.appendChild(btns);
 var anchor=bp.querySelector('.rowbtns');if(anchor)bp.insertBefore(row,anchor);else bp.appendChild(row);
 btns.appendChild(mkBtn('g9b1','CUT PLAN',cutPlan));
 btns.appendChild(mkBtn('g9b2','TRANSITION PACK',transPack));
 btns.appendChild(mkBtn('g9b3','SPEED PLAN',speedPlan));
 btns.appendChild(mkBtn('g9b4','ZOOM PLAN',zoomPlan));
 btns.appendChild(mkBtn('g9b5','TEXT TIMING',textTiming));
 btns.appendChild(mkBtn('g9b6','COLOR PASS',colorPass));
 btns.appendChild(mkBtn('g9b7','AUDIO DUCK',audioDuck));
 btns.appendChild(mkBtn('g9b8','END CARD',endCard));
 btns.appendChild(mkBtn('g9b9','EXPORT CHECK',exportCheck));
 btns.appendChild(mkBtn('g9b10','FORGE 9 SHEET .TXT',forge9Sheet))
}
function cutPlan(){var out=[],t0=0;
 SCENES.forEach(function(s,i){var d=SDUR[i]||3;out.push('scene '+(i+1)+' in '+t0.toFixed(1)+'s out '+(t0+d).toFixed(1)+'s');t0+=d});
 glog('CUT PLAN ('+SCENES.length+' cuts, '+t0.toFixed(1)+'s total): '+out.join(' | '),1)}
function transPack(){var tr=[];
 for(var i=0;i<SCENES.length-1;i++){var d=SDUR[i]||3;tr.push('s'+(i+1)+'->s'+(i+2)+': '+(d<2.5?'hard cut':(d>4.5?'zoom punch-in':'whip pan')))}
 glog('TRANSITION PACK ('+tr.length+' transitions): '+(tr.length?tr.join(' | '):'single scene, none needed'),1)}
function speedPlan(){var li=0,si=0,lmax=0,smin=99;
 SCENES.forEach(function(s,i){var d=SDUR[i]||3;if(d>lmax){lmax=d;li=i}if(d<smin){smin=d;si=i}});
 glog('SPEED PLAN: slow-mo 0.5x mid scene '+(li+1)+' ('+lmax.toFixed(1)+'s longest), ramp 1.0x->1.5x on scene '+(si+1)+' ('+smin.toFixed(1)+'s shortest), rest real time',1)}
function zoomPlan(){var z=[];
 SCENES.forEach(function(s,i){var d=SDUR[i]||3;if(d>=3)z.push('scene '+(i+1)+' punch 1.3x at '+(d*0.6).toFixed(1)+'s')});
 glog('ZOOM PLAN: '+(z.length?z.join(' | '):'no scene 3s+, hold framing steady'),1)}
function textTiming(){var out=[],bad=0;
 SCENES.forEach(function(s,i){var w=words(s.cap).length,d=SDUR[i]||3;
  if(w>7){bad++;out.push('scene '+(i+1)+' split into 2 lines (w count '+w+')')}
  else out.push('scene '+(i+1)+' show 0.15s hold 1.2s')});
 glog('TEXT TIMING: '+out.join(' | ')+(bad?' - '+bad+' captions to split':' - all single-line'),bad?0:1)}
function colorPass(){var g={phonk:'crushed blacks, magenta accents, teal lift',hard:'high contrast, teal shadows orange highlights',lofi:'warm fade, soft grain, lifted blacks'}[bt()]||'natural grade, mild contrast';
 glog('COLOR PASS: beat '+bt().toUpperCase()+' -> '+g+' - apply same grade to all '+SCENES.length+' scenes for consistency',1)}
function audioDuck(){var heavy=0;
 SCENES.forEach(function(s,i){if(words(s.cap).length>10)heavy++});
 glog('AUDIO DUCK: '+(heavy?'duck beat -6dB under '+heavy+' caption-heavy scenes (s marked TEXT TIMING): beats stay under voice':'no caption-heavy scenes, beat stays full level')+', release +0.3s after each cut',heavy?0:1)}
function endCard(){var w=words(SCENES[SCENES.length-1].cap)[0]||'watch';
 var t='follow for part 2 - '+title()+' | '+new Date().getFullYear();
 glog('END CARD: overlay on last scene final 0.8s: "'+t+'" - keep hook word "'+w+'" visible above it',1);dlB(t,'forge9-endcard.txt')}
function exportCheck(){var c=[],t=tot();
 c.push('length: '+t.toFixed(1)+'s '+(t<=60?'ok for tiktok':'TOO LONG trim '+(t-60).toFixed(1)+'s'));
 c.push('format: 1080x1920 9:16 30fps');
 c.push('captions: '+SCENES.length+' burned in');
 c.push('audio: beat '+bt()+' + voice, loudness -14 LUFS');
 c.push('cover: scene 1 frame 0');
 var miss=c.filter(function(x){return /TOO LONG/.test(x)});
 glog('EXPORT CHECK: '+(miss.length?'1 flag - ':'clear - ')+c.join(' | '),miss.length?0:1)}
function forge9Sheet(){var L=['FORGE 9 EDIT SHEET - '+new Date().toLocaleString(),''];
 L.push('title: '+title());L.push('scenes: '+SCENES.length);
 L.push('length: '+tot().toFixed(1)+'s');L.push('beat: '+bt());
 L.push('','edit plan: see CUT PLAN / TRANSITION PACK / SPEED PLAN / ZOOM PLAN in log');
 L.push('grade: see COLOR PASS log');L.push('end card: see forge9-endcard.txt');
 dlB(L.join('\n'),'forge9-sheet.txt');glog('FORGE 9 SHEET saved',1)}
function boot(){try{mount()}catch(e){console.log('[forge9] boot',e)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
