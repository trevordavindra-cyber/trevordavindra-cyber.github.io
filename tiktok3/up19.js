'use strict';
/* up19.js - SHORTFORGE FORGE 22 VISUAL LAB (Nov 25 2026) v1 */
(function(){
if(window.__sfup19){return;}
window.__sfup19=1;
function need(){if(!window.SCENES||!SCENES.length){glog('forge a script first (FORGE 22 tools need scenes)',0);return false}return true}
function glog(m,hl){try{step(m,hl)}catch(e){console.log('[forge22]',m)}}
function words(s){return String(s||'').trim().split(/\s+/).filter(Boolean)}
function mkBtn(id,label,fn){var b=document.createElement('button');b.id=id;b.textContent=label;b.style.cssText='background:#0b1418;border:1px solid #2de2ff;color:#eaffff;font:700 10px monospace;padding:6px 10px;margin:3px;cursor:pointer;border-radius:6px';b.addEventListener('click',function(){try{if(need())fn()}catch(e){glog('forge22 error: '+e.message,0)}});return b}
function dlB(txt,name){try{var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));a.download=name;a.style.display='none';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a)},200)}catch(e){glog('download blocked: '+e.message,0)}}
function title(){return String((window.META&&META.title)||'this topic')}
function tot(){var t=0;SDUR.forEach(function(d){t+=d});return t}
function imgOf(s){return String((s&&(s.img||s.image||s.prompt))||'')}
function seedOf(i){return i*977+13}
function imgEl(i){return document.getElementById('im'+i)}
function loaded(i){var im=imgEl(i);return im&&im.complete&&im.naturalWidth>0}
function mount(){
 var bp=document.getElementById('boardPanel');if(!bp||bp.querySelector('#g20b1'))return;
 var row=document.createElement('div');row.style.cssText='margin-top:12px';
 var h=document.createElement('div');h.textContent='FORGE 22 VISUAL LAB';h.style.cssText='color:#2de2ff;font:700 11px monospace;margin:4px 3px';row.appendChild(h);
 var btns=document.createElement('div');btns.style.cssText='display:flex;flex-wrap:wrap';row.appendChild(btns);
 var anchor=bp.querySelector('.rowbtns');if(anchor)bp.insertBefore(row,anchor);else bp.appendChild(row);
 btns.appendChild(mkBtn('g20b1','VISUAL MAP',visMap));
 btns.appendChild(mkBtn('g20b2','PROMPT CHECK',promptCheck));
 btns.appendChild(mkBtn('g20b3','SEED AUDIT',seedAudit));
 btns.appendChild(mkBtn('g20b4','ZOOM PLAN',zoomPlan));
 btns.appendChild(mkBtn('g20b5','CUT DENSITY',cutDensity));
 btns.appendChild(mkBtn('g20b6','TEXT SAFETY',textSafety));
 btns.appendChild(mkBtn('g20b7','COLOR FLOW',colorFlow));
 btns.appendChild(mkBtn('g20b8','DUPLICATE CHECK',dupCheck));
 btns.appendChild(mkBtn('g20b9','VISUAL SCORE',visScore));
 btns.appendChild(mkBtn('g20b10','VISUAL SHEET',visSheet));
 try{glog('FORGE 22 VISUAL LAB mounted (10 tools)',0)}catch(e){}
}
function visMap(){
 var cs=SCENES,t=tot();
 glog('VISUAL MAP ('+cs.length+' scenes, '+t.toFixed(1)+'s): '+cs.map(function(s,i){return 's'+(i+1)+' '+((SDUR[i]||4).toFixed(1))+'s '+(loaded(i)?'[img loaded]':'[img missing]')+' "'+imgOf(s).slice(0,40)+(imgOf(s).length>40?'...':'')+'"'}).join(' | '),1);
}
function promptCheck(){
 var bad=[];
 SCENES.forEach(function(s,i){var p=imgOf(s);
 if(words(p).length<6)bad.push('s'+(i+1)+' too short ('+words(p).length+'w, add detail: lighting, angle, mood)');
 if(!/light|dark|cinematic|dramatic|glow|neon|shadow|dusk|dawn|night|golden/i.test(p))bad.push('s'+(i+1)+' no lighting cue (the model guesses flat when you skip it)');
 if(/vertical|9:16|portrait/i.test(p)===false&&/vertical 9:16/.test(p)===false)bad.push('s'+(i+1)+' no vertical cue (the app appends it anyway, but prompt it yourself for a better frame)');});
 glog('PROMPT CHECK: '+(bad.length?bad.length+' prompt issues - '+bad.slice(0,4).join('; '):'all '+SCENES.length+' image prompts carry a scene, lighting and framing cue - solid base for pollinations'),1);
}
function seedAudit(){
 var base=SCENES.map(function(s,i){return seedOf(i)});
 var gaps=[];for(var i=1;i<base.length;i++){if(base[i]-base[i-1]!==977)gaps.push('s'+(i+1)+' breaks the stride')}
 glog('SEED AUDIT: seeds run '+base[0]+' -> '+base[base.length-1]+' (step 977, base 13) '+SCENES.map(function(s,i){return 's'+(i+1)+'='+seedOf(i)}).join(' ')+(gaps.length?' | '+gaps.join(', '):' | even stride means adjacent scenes never collide on the same image; RE-IMG rolls a random seed, so re-rolled scenes lose reproducibility - fine for looks, keep one clean build before reshuffling'),1);
}
function zoomPlan(){
 var t=tot();
 var long=SCENES.map(function(s,i){return {i:i,d:SDUR[i]||4}}).filter(function(x){return x.d>t/SCENES.length*1.3});
 glog('ZOOM PLAN: '+(long.length?'longer scenes '+long.map(function(x){return 's'+(x.i+1)+' ('+x.d.toFixed(1)+'s)'}).join(', ')+' - give each a slow push-in (1.0 -> 1.08 over the scene); static frames read as dead air past ~4s':'scenes are evenly paced ('+(t/SCENES.length).toFixed(1)+'s avg) - add one punch zoom on the hook s1 and one on the payoff instead, motion at the two moments that matter most'),1);
}
function cutDensity(){
 var t=tot(),n=SCENES.length,cpm=n/t*10;
 glog('CUT DENSITY: '+n+' cuts in '+t.toFixed(1)+'s = '+cpm.toFixed(1)+' cuts / 10s ('+(cpm<1.2?'slow for tiktok - split your longest scene in two':cpm>3?'very fast - make sure every cut buys a new image, not the same shot again':'in the tiktok sweet spot, keep it')+')',1);
}
function textSafety(){
 var risky=[];SCENES.forEach(function(s,i){var p=imgOf(s);if(/text|words|letters|sign|writing|caption|title|numbers/i.test(p))risky.push('s'+(i+1)+' asks for '+(/sign/i.test(p)?'a sign':'text')+' in the image')});
 glog('TEXT SAFETY: '+(risky.length?risky.join(', ')+' - generated text renders garbled; keep the image prompt text-free and let the on-screen cap carry the words':'no scene asks the image model to draw text - your caps stay the only words on screen, that is the clean setup'),1);
}
function colorFlow(){
 var dark=0,bright=0;
 SCENES.forEach(function(s){var p=imgOf(s).toLowerCase();if(/dark|night|shadow|storm|noir|moody/.test(p))dark++;else bright++});
 var runs=[],cur=null;SCENES.forEach(function(s,i){var d=/dark|night|shadow|storm|noir|moody/.test(imgOf(s).toLowerCase())?'dark':'bright';if(d===cur){runs[runs.length-1].n++}else{runs.push({d:d,n:1,i:i})}cur=d});
 var long=runs.filter(function(r){return r.n>=4});
 glog('COLOR FLOW: '+dark+' dark / '+bright+' light scenes'+(long.length?', but '+long.map(function(r){return 's'+(r.i+1)+' runs '+r.n+' '+r.d+' in a row'}).join(', ')+' - flip the mood mid-run (a golden shot between dark ones resets the eye and reads as production value)':', tone alternates enough - the eye never settles and every cut feels new'),1);
}
function dupCheck(){
 var seen={},dups=[];
 SCENES.forEach(function(s,i){var k=imgOf(s).toLowerCase().replace(/[^a-z0-9 ]/g,'').trim();if(seen[k]!==undefined){dups.push('s'+(i+1)+' repeats s'+(seen[k]+1))}else{seen[k]=i}});
 glog('DUPLICATE CHECK: '+(dups.length?dups.join(', ')+' - same prompt means the model draws near-identical frames; vary angle or subject per scene':'no duplicate image prompts - every scene gets its own frame'),1);
}
function visScore(){
 var score=50,notes=[];
 var allLight=SCENES.every(function(s){return /light|dark|cinematic|dramatic|glow|neon|shadow|dusk|dawn|night|golden/i.test(imgOf(s))});if(allLight)score+=15;else score-=5;
 var dups=false,seen={};SCENES.forEach(function(s,i){var k=imgOf(s).toLowerCase();if(seen[k]!==undefined)dups=true;seen[k]=i});
 if(!dups)score+=15;else score-=8;
 var risky=SCENES.some(function(s){return /text|words|letters|sign/i.test(imgOf(s))});if(!risky)score+=10;
 var t=tot(),cpm=SCENES.length/t*10;if(cpm>=1.2&&cpm<=3)score+=10;else score-=5;
 var loadedN=SCENES.filter(function(s,i){return loaded(i)}).length;if(loadedN===SCENES.length)score+=10;else score-=10;
 if(score>98)score=98;
 glog('VISUAL SCORE '+score+'/100 '+(['under 70: fix prompts and re-roll images before editing','70-84: good frames, one pass of polish','85+: frames are edit-ready'][score<70?0:score<85?1:2]),1);
}
function visSheet(){
 var lines=['FORGE 22 VISUAL SHEET - '+title(),'generated '+new Date().toISOString(),SCENES.length+' scenes, '+tot().toFixed(1)+'s',''];
 lines.push('SCENES:');
 SCENES.forEach(function(s,i){lines.push('  s'+(i+1)+' seed '+seedOf(i)+' '+(SDUR[i]||4).toFixed(1)+'s '+(loaded(i)?'loaded':'NOT LOADED')+' | img: '+imgOf(s))});
 lines.push('');lines.push('image source: pollinations.ai, seed step 977 base 13');
 dlB(lines.join('\n'),'forge22_visual_sheet.txt');
 glog('VISUAL SHEET downloaded (forge22_visual_sheet.txt)',1);
}
function boot(){
 if(document.getElementById('boardPanel')){mount();return}
 var n=0,iv=setInterval(function(){n++;if(document.getElementById('boardPanel')){clearInterval(iv);mount()}else if(n>120){clearInterval(iv)}},250);
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',boot)}else{boot()}
})();