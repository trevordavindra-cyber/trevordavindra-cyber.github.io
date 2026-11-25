'use strict';
/* up11.js - SHORTFORGE v11 ANALYTICS TOOLS (Nov 24 2026) */
(function(){
if(window.__sfup11){return;}
window.__sfup11=1;
function need(){if(!window.SCENES||!SCENES.length){glog('forge a script first (FORGE 11 tools need scenes)',0);return false}return true}
function glog(m,hl){try{step(m,hl)}catch(e){console.log('[forge11]',m)}}
function words(s){return String(s||'').trim().split(/\s+/).filter(Boolean)}
function mkBtn(id,label,fn){var b=document.createElement('button');b.id=id;b.textContent=label;b.style.cssText='background:#0b1418;border:1px solid #2de2ff;color:#eaffff;font:700 10px monospace;padding:6px 10px;margin:3px;cursor:pointer;border-radius:6px';b.addEventListener('click',function(){try{if(need())fn()}catch(e){glog('forge11 error: '+e.message,0)}});return b}
function dlB(txt,name){try{var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));a.download=name;a.style.display='none';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a)},200)}catch(e){glog('download blocked: '+e.message,0)}}
function title(){return String((window.META&&META.title)||'this topic')}
function tot(){var t=0;SDUR.forEach(function(d){t+=d});return t}
function textOf(s){return String((s&&(s.text||s.caption||s.vo||s.narration||s.line))||'')}
function mount(){
 var bp=document.getElementById('boardPanel');if(!bp||bp.querySelector('#g11b1'))return;
 var row=document.createElement('div');row.style.cssText='margin-top:12px';
 var h=document.createElement('div');h.textContent='FORGE 11 ANALYTICS TOOLS';h.style.cssText='color:#2de2ff;font:700 11px monospace;margin:4px 3px';row.appendChild(h);
 var btns=document.createElement('div');btns.style.cssText='display:flex;flex-wrap:wrap';row.appendChild(btns);
 var anchor=bp.querySelector('.rowbtns');if(anchor)bp.insertBefore(row,anchor);else bp.appendChild(row);
 btns.appendChild(mkBtn('g11b1','VIEWS FORECAST',viewsForecast));
 btns.appendChild(mkBtn('g11b2','HOOK SCORE',hookScore));
 btns.appendChild(mkBtn('g11b3','RETENTION CURVE',retCurve));
 btns.appendChild(mkBtn('g11b4','COMPETITOR GAP',compGap));
 btns.appendChild(mkBtn('g11b5','HASHTAG AUDIT',tagAudit));
 btns.appendChild(mkBtn('g11b6','BEST CLIP',bestClip));
 btns.appendChild(mkBtn('g11b7','POST SCHEDULE',postSched));
 btns.appendChild(mkBtn('g11b8','VIRAL CHECKLIST',viralCheck));
 btns.appendChild(mkBtn('g11b9','WEEK PLAN',weekPlan));
 btns.appendChild(mkBtn('g11b10','FORGE 11 SHEET .TXT',forge11Sheet))
}
function viewsForecast(){var n=SCENES.length;var dur=tot();var hook=words(textOf(SCENES[0])).length;
 var base=n>=5&&dur<=32?42000:n>=5?18000:9000;var hookBonus=hook>=5?1.35:hook>=3?1.1:0.75;
 var low=Math.round(base*hookBonus*0.5),high=Math.round(base*hookBonus*2.2);
 glog('VIEWS FORECAST: '+n+' scenes '+dur.toFixed(1)+'s, hook '+hook+' words -> '+(hook>=5?'strong':hook>=3?'ok':'weak')+' open. est '+low.toLocaleString()+'-'+high.toLocaleString()+' views, '+(dur<=32?'length good for fyp':'trim under 32s for the fyp push'),1)}
function hookScore(){var t=words(textOf(SCENES[0]));var q=t.slice(0,5).join(' ')||'scene 1';var s=0;
 if(t.length>=5)s+=40;if(/\?/.test(textOf(SCENES[0])))s+=20;if(/never|secret|nobody|illegal|crazy|stop/i.test(textOf(SCENES[0])))s+=20;if((SDUR[0]||3)<=3)s+=20;
 glog('HOOK SCORE: scene 1 = '+s+'/100 ("'+q+'"). '+(s>=80?'ship it':s>=50?'add a number or a question mark':'rework scene 1, open on the craziest fact'),1)}
function retCurve(){var out=['RETENTION CURVE: keep % by scene (model)'];var t0=0;var keep=100;
 SCENES.forEach(function(s,i){var d=SDUR[i]||3;var w=words(textOf(s)).length;keep-=d>6?14:d<2?4:8;if(w<5)keep-=5;keep=Math.max(12,keep);out.push('scene '+(i+1)+' @'+t0.toFixed(1)+'s -> '+keep+'%');t0+=d});
 glog(out.join(' | '),1)}
function compGap(){var t=title();var n=SCENES.length;
 glog('COMPETITOR GAP: search "'+t+'" on tiktok before you post. beat them on: (1) part '+n+' structure instead of one dump, (2) faster scene 1 than the top video, (3) a pinned reply asking what they skipped. nobody covering a series on this topic = your lane',1)}
function tagAudit(){var core=words(title()).slice(0,2).join('').toLowerCase().replace(/[^a-z0-9]/g,'')||'topic';
 var tags=['#fyp','#foryou','#viral','#'+core,'#'+core+'facts','#ai','#editing','#storytime'];
 glog('HASHTAG AUDIT: 8 tags, 4 broad (#fyp #foryou #viral #ai) + 4 niche (#'+core+' #'+core+'facts #editing #storytime). mix beats 20 broad tags',1)}
function bestClip(){var bi=0,bs=-1;SCENES.forEach(function(s,i){var w=words(textOf(s)).length;var sc=(SDUR[i]||3)>=2.5&&(SDUR[i]||3)<=5?50:20;sc+=Math.min(w,12)*4;if(sc>bs){bs=sc;bi=i}});
 glog('BEST CLIP: scene '+(bi+1)+' ('+((SDUR[bi]||3).toFixed(1))+'s) is the repost candidate - strongest hook density. cut it standalone, keep scene 1 as its open',1)}
function postSched(){var d=new Date();var slots=[['6-8am ET','commute scroll'],['12-1pm ET','lunch scroll'],['7-9pm ET','prime time']];
 var pick=slots[2][0];glog('POST SCHEDULE: today '+d.toLocaleDateString()+'. slots 6-8am / 12-1pm / 7-9pm ET, first pick '+pick+' (prime time), second pick 12-1pm. never twice in one slot',1)}
function viralCheck(){var c=[['hook under 3s',(SDUR[0]||3)<=3],['on-screen text scene 1',words(textOf(SCENES[0])).length>0],['loop cut',(SCENES.length>=3)],['under 32s',tot()<=32],['niche hashtags',true],['pinned comment',true],['caption question',true],['sound trending',true]];
 var ok=c.filter(function(x){return x[1]}).length;var miss=c.filter(function(x){return !x[1]}).map(function(x){return x[0]});
 glog('VIRAL CHECKLIST: '+ok+'/8 pass'+(miss.length?' | missing: '+miss.join(', '):' | all clear, post it'),1)}
function weekPlan(){var n=SCENES.length;var parts=Math.max(1,Math.min(5,Math.ceil(n/3)));
 var out=['WEEK PLAN: '+parts+' post'+(parts>1?'s':'')+' this week from this forge'];
 out.push('mon 7-9pm: part 1 | wed 12-1pm: part 2 | fri 7-9pm: part 3 | sun 6-8am: repost best clip'.split(' | ').slice(0,parts).join(' | '));
 out.push('reply to every comment in hour 1');glog(out.join(' | '),1)}
function forge11Sheet(){var L=['FORGE 11 ANALYTICS SHEET - '+new Date().toLocaleString(),''];
 L.push('title: '+title());L.push('scenes: '+SCENES.length);L.push('length: '+tot().toFixed(1)+'s');
 L.push('','views forecast / hook score / retention curve / competitor gap / hashtag audit / best clip / post schedule / viral checklist / week plan: see log');
 dlB(L.join('\n'),'forge11-sheet.txt');glog('FORGE 11 SHEET saved',1)}
function boot(){try{mount()}catch(e){console.log('[forge11] boot',e)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
