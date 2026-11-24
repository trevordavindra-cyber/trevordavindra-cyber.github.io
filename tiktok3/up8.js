'use strict';
/* up8.js - SHORTFORGE v8 LAUNCH TOOLS (Nov 24 2026) */
(function(){
function need(){if(!window.SCENES||!SCENES.length){glog('forge a script first (FORGE 8 tools need scenes)',0);return false}return true}
function glog(m,hl){try{step(m,hl)}catch(e){console.log('[forge8]',m)}}
function words(s){return String(s||'').trim().split(/\s+/).filter(Boolean)}
function mkBtn(id,label,fn){var b=document.createElement('button');b.id=id;b.textContent=label;b.style.cssText='background:#0b1418;border:1px solid #2de2ff;color:#eaffff;font:700 10px monospace;padding:6px 10px;margin:3px;cursor:pointer;border-radius:6px';b.addEventListener('click',function(){try{if(need())fn()}catch(e){glog('forge8 error: '+e.message,0)}});return b}
function dlB(txt,name){try{var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));a.download=name;a.style.display='none';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a)},200)}catch(e){glog('download blocked: '+e.message,0)}}
function title(){return String((window.META&&META.title)||'this topic')}
function tags(){try{return (META&&META.hashtags)||[]}catch(e){return[]}}
function mount(){
 var bp=document.getElementById('boardPanel');if(!bp||bp.querySelector('#g8b1'))return;
 var row=document.createElement('div');row.style.cssText='margin-top:12px';
 var h=document.createElement('div');h.textContent='FORGE 8 TOOLS';h.style.cssText='color:#2de2ff;font:700 11px monospace;margin:4px 3px';row.appendChild(h);
 var btns=document.createElement('div');btns.style.cssText='display:flex;flex-wrap:wrap';row.appendChild(btns);
 var anchor=bp.querySelector('.rowbtns');if(anchor)bp.insertBefore(row,anchor);else bp.appendChild(row);
 btns.appendChild(mkBtn('g8b1','STORY ARC',storyArc));
 btns.appendChild(mkBtn('g8b2','COVER PICK',coverPick));
 btns.appendChild(mkBtn('g8b3','POST PLAN',postPlan));
 btns.appendChild(mkBtn('g8b4','COMMENT BAIT',commentBait));
 btns.appendChild(mkBtn('g8b5','SEO DESC',seoDesc));
 btns.appendChild(mkBtn('g8b6','HASHTAG AUDIT',hashAudit));
 btns.appendChild(mkBtn('g8b7','SUBTITLE CHECK',subCheck));
 btns.appendChild(mkBtn('g8b8','SOUND CHECK',soundCheck));
 btns.appendChild(mkBtn('g8b9','LAUNCH CHECK',launchCheck));
 btns.appendChild(mkBtn('g8b10','FORGE 8 SHEET .TXT',forge8Sheet))
}
function storyArc(){var n=SCENES.length,a1=Math.max(1,Math.round(n/3)),a2=Math.max(a1+1,Math.round(2*n/3));
 var acts=[];for(var i=0;i<n;i++){var act=i<a1?'ACT 1 setup':(i<a2?'ACT 2 tension':'ACT 3 payoff');acts.push('scene '+(i+1)+': '+act)}
 glog('STORY ARC ('+n+' scenes): '+acts.join(' | '),1)}
function coverPick(){var s=SCENES[0];var w=words(s.cap||s.t);var overlay=w.slice(0,4).join(' ').toUpperCase();
 glog('COVER PICK: use scene 1 as cover, overlay text "'+overlay+'", keep bottom third clear for the TikTok UI',1)}
function postPlan(){var t=title();var plan=['MON 6-8pm: '+t+' (main drop)','WED 12-1pm: re-cut or b-roll teaser of scene 1','FRI 7-9pm: part 2 or duet-bait version','SAT: reply-to-comment stitch','SUN 6-8pm: best-of re-post with new cover'];
 glog('POST PLAN (5 slots): '+plan.join(' | '),1);dlB(plan.join('\n'),'forge8-postplan.txt')}
function commentBait(){var t=title();var c=['which one are you? comment 1 or 2','am I wrong about '+t+'?','drop a HEART if you want part 2'];
 glog('COMMENT BAIT: pin "'+c[0]+'" as your first comment; backups: '+c[1]+' / '+c[2],1)}
function seoDesc(){var kw={};SCENES.forEach(function(s){words(s.cap).forEach(function(w){w=w.toLowerCase().replace(/[^a-z0-9]/g,'');if(w.length>3)kw[w]=(kw[w]||0)+1})});
 var top=Object.keys(kw).sort(function(a,b){return kw[b]-kw[a]}).slice(0,5);
 var d=title()+' - '+top.join(', ')+'. follow for more.';
 glog('SEO DESC drafted ('+top.length+' keywords): '+d,1);dlB(d,'forge8-desc.txt')}
function hashAudit(){var t=tags();if(!t.length){glog('HASHTAG AUDIT: no hashtags on META yet - run HASHTAG PACK (v7) first',0);return}
 var seen={},dupes=[],generic=['fyp','foryou','viral','tiktok'];
 t.forEach(function(x){var k=String(x).toLowerCase();if(seen[k])dupes.push(x);seen[k]=1});
 var gen=t.filter(function(x){return generic.indexOf(String(x).toLowerCase().replace('#',''))>=0});
 glog('HASHTAG AUDIT: '+t.length+' tags, '+dupes.length+' dupes'+(dupes.length?' ('+dupes.join(' ')+')':'')+', '+gen.length+' over-generic'+(gen.length?' ('+gen.join(' ')+')':'')+' - keep 3 niche tags + 1 broad',1)}
function subCheck(){var bad=[];SCENES.forEach(function(s,i){var w=words(s.cap).length;var d=SDUR[i]||3;var wps=w/d;if(wps>4)bad.push('scene '+(i+1)+' '+wps.toFixed(1)+'w/s too fast')});
 glog('SUBTITLE CHECK: '+SCENES.length+' captions'+(bad.length?' - flags: '+bad.join(' | '):' - all readable pace'),bad.length?0:1)}
function soundCheck(){var bs='phonk';try{bs=document.getElementById('beatstyle').value}catch(e){}
 var tot=0;SDUR.forEach(function(d){tot+=d});
 var fit={phonk:'fast cuts under 141bpm works',hard:'hard hits need cut points on drops',lofi:'lofi wants longer scenes 3s+'}[bs]||'fine';
 var warn=tot>60?'total '+tot.toFixed(0)+'s over 60s - trim for tiktok':'total '+tot.toFixed(0)+'s good length';
 glog('SOUND CHECK: beat '+bs.toUpperCase()+' - '+fit+'; '+warn,1)}
function launchCheck(){var checks=[];
 checks.push('cover: '+(SCENES.length?'scene 1':'MISSING'));
 var hasCta=SCENES.some(function(s){return /follow|comment|save|part 2/i.test(String(s.cap||''))});
 checks.push('cta in captions: '+(hasCta?'yes':'MISSING - run CTA BUILDER (v7)'));
 checks.push('hashtags: '+(tags().length?tags().length+' set':'none'));
 var tot=0;SDUR.forEach(function(d){tot+=d});
 checks.push('length: '+tot.toFixed(1)+'s '+(tot<=60?'ok':'TOO LONG'));
 var last=SCENES[SCENES.length-1];
 checks.push('ending: '+(last&&/follow|next|part/i.test(String(last.cap||''))?'loops to part 2':'no loop hook'));
 var miss=checks.filter(function(c){return /MISSING|TOO LONG|no loop/.test(c)});
 glog('LAUNCH CHECK: '+(miss.length?miss.length+' fix before posting - ':'clear to post - ')+checks.join(' | '),miss.length?0:1)}
function forge8Sheet(){var L=['FORGE 8 LAUNCH SHEET - '+new Date().toLocaleString(),''];
 L.push('title: '+title());L.push('scenes: '+SCENES.length);
 var tot=0;SDUR.forEach(function(d){tot+=d});L.push('length: '+tot.toFixed(1)+'s');
 L.push('hashtags: '+tags().join(' '));
 L.push('','story arc:');SCENES.forEach(function(s,i){L.push(' scene '+(i+1)+': '+String(s.cap||s.t||'').slice(0,60))});
 L.push('','launch checks: see LAUNCH CHECK log','post plan: see forge8-postplan.txt');
 dlB(L.join('\n'),'forge8-sheet.txt');glog('FORGE 8 SHEET saved',1)}
function boot(){try{mount()}catch(e){console.log('[forge8] boot',e)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();