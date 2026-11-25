'use strict';
/* up10.js - SHORTFORGE v10 SERIES TOOLS (Nov 24 2026) */
(function(){
if(window.__sfup10){return;}
window.__sfup10=1;
function need(){if(!window.SCENES||!SCENES.length){glog('forge a script first (FORGE 10 tools need scenes)',0);return false}return true}
function glog(m,hl){try{step(m,hl)}catch(e){console.log('[forge10]',m)}}
function words(s){return String(s||'').trim().split(/\s+/).filter(Boolean)}
function mkBtn(id,label,fn){var b=document.createElement('button');b.id=id;b.textContent=label;b.style.cssText='background:#0b1418;border:1px solid #2de2ff;color:#eaffff;font:700 10px monospace;padding:6px 10px;margin:3px;cursor:pointer;border-radius:6px';b.addEventListener('click',function(){try{if(need())fn()}catch(e){glog('forge10 error: '+e.message,0)}});return b}
function dlB(txt,name){try{var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));a.download=name;a.style.display='none';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a)},200)}catch(e){glog('download blocked: '+e.message,0)}}
function title(){return String((window.META&&META.title)||'this topic')}
function tot(){var t=0;SDUR.forEach(function(d){t+=d});return t}
function textOf(s){return String((s&&(s.text||s.caption||s.vo||s.narration||s.line))||'')}
function mount(){
 var bp=document.getElementById('boardPanel');if(!bp||bp.querySelector('#g10b1'))return;
 var row=document.createElement('div');row.style.cssText='margin-top:12px';
 var h=document.createElement('div');h.textContent='FORGE 10 SERIES TOOLS';h.style.cssText='color:#2de2ff;font:700 11px monospace;margin:4px 3px';row.appendChild(h);
 var btns=document.createElement('div');btns.style.cssText='display:flex;flex-wrap:wrap';row.appendChild(btns);
 var anchor=bp.querySelector('.rowbtns');if(anchor)bp.insertBefore(row,anchor);else bp.appendChild(row);
 btns.appendChild(mkBtn('g10b1','SERIES PLAN',seriesPlan));
 btns.appendChild(mkBtn('g10b2','RETENTION MAP',retMap));
 btns.appendChild(mkBtn('g10b3','LOOP HOOK',loopHook));
 btns.appendChild(mkBtn('g10b4','TEASER CLIPS',teasers));
 btns.appendChild(mkBtn('g10b5','PIN COMMENT',pinComment));
 btns.appendChild(mkBtn('g10b6','REPLY BAIT',replyBait));
 btns.appendChild(mkBtn('g10b7','PART 2 HOOK',part2Hook));
 btns.appendChild(mkBtn('g10b8','GROWTH PLAN',growthPlan));
 btns.appendChild(mkBtn('g10b9','SERIES A/B',seriesAB));
 btns.appendChild(mkBtn('g10b10','FORGE 10 SHEET .TXT',forge10Sheet))
}
function seriesPlan(){var n=SCENES.length;var parts=Math.max(2,Math.min(5,Math.ceil(n/3)));
 var out=['SERIES PLAN: "'+title()+'" -> '+parts+' parts'];
 var per=Math.ceil(n/parts);
 SCENES.forEach(function(s,i){var p=Math.min(parts,Math.floor(i/per)+1);var t=words(textOf(s)).slice(0,6).join(' ');out.push('part '+p+': scene '+(i+1)+(t?' - '+t:''))});
 glog(out.join(' | '),1)}
function retMap(){var out=['RETENTION MAP: drop-off risk per scene'];var t0=0;
 SCENES.forEach(function(s,i){var d=SDUR[i]||3;var w=words(textOf(s)).length;var risk=(d>6||w<5)?'HIGH (slow or quiet)':(d<2?'LOW (fast)':'MED');out.push('scene '+(i+1)+' @'+t0.toFixed(1)+'s '+d.toFixed(1)+'s -> '+risk);t0+=d});
 glog(out.join(' | '),1)}
function loopHook(){var first=words(textOf(SCENES[0])).slice(0,4).join(' ')||'scene 1 frame 0';
 var lastD=SDUR[SCENES.length-1]||3;
 glog('LOOP HOOK: open on "'+first+'" | last scene '+SCENES.length+' cuts back to that frame | keep it under '+lastD.toFixed(1)+'s so the loop reads seamless',1)}
function teasers(){var out=['TEASER CLIPS: 5s cutdowns'];
 SCENES.forEach(function(s,i){var d=SDUR[i]||3;if(d>=5){out.push('teaser '+(i+1)+': scene '+(i+1)+' 0.0-5.0s')}else if(d>=3){out.push('teaser '+(i+1)+': scene '+(i+1)+' full '+d.toFixed(1)+'s + tail of scene '+Math.min(SCENES.length,i+2))}});
 glog(out.slice(0,7).join(' | '),1)}
function pinComment(){var opts=['pin: "which part hit hardest? drop the timestamp"','pin: "part 2 drops when this hits '+(1000+Math.floor(Math.random()*900))+' likes"','pin: "watch to the end before you comment"'];
 glog(opts.join(' | '),1)}
function replyBait(){var r=['reply 1: "part 2 covers exactly this, follow so you catch it"','reply 2: "good eye, that detail was intentional"','reply 3: "sending everyone who asks the full version"'];
 glog(r.join(' | '),1)}
function part2Hook(){var last=SCENES[SCENES.length-1];var t=words(textOf(last)).slice(0,6).join(' ')||title();
 glog('PART 2 HOOK: cliffhanger "'+t+'... but that is not the crazy part" | cut to black 0.3s | card "part 2 tomorrow"',1)}
function growthPlan(){var g=['GROWTH PLAN: '+tot().toFixed(1)+'s per post | 3 posts a week, same slot','cadence: part 1 mon, part 2 wed, part 3 fri, drops 6-8pm','reply to top 5 comments inside the first hour','re-cut part 1 hook as a standalone clip'];
 glog(g.join(' | '),1)}
function seriesAB(){var a='A: one post, all '+SCENES.length+' scenes, '+tot().toFixed(1)+'s';
 var b='B: '+Math.max(2,Math.ceil(SCENES.length/3))+' parts, each under 30s, cliffhangers between';
 glog('SERIES A/B: '+a+' VS '+b+' | verdict: B, series retention beats one long upload',1)}
function forge10Sheet(){var L=['FORGE 10 SERIES SHEET - '+new Date().toLocaleString(),''];
 L.push('title: '+title());L.push('scenes: '+SCENES.length);L.push('length: '+tot().toFixed(1)+'s');
 L.push('','series plan / retention map / loop hook / teasers / pin + reply templates / part 2 hook / growth plan / a-b: see log');
 dlB(L.join('\n'),'forge10-sheet.txt');glog('FORGE 10 SHEET saved',1)}
function boot(){try{mount()}catch(e){console.log('[forge10] boot',e)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
