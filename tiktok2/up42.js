'use strict';
// up42.js - PHASE 36 HOOK LAB (Nov 23 2026)
// hook check, hook titles, pattern interrupt, cold open plan, first frame,
// retention curve, hook variants, loop seam, thumb pick, hook sheet
(function(){
if(window.__tk2up42){return}window.__tk2up42=1;
function mkBtn(t,fn,id){var b=document.createElement('button');b.className='btn';b.textContent=t;if(id){b.id=id}b.onclick=fn;return b}
function mkRow(){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap='6px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function saveE(){try{if(typeof save==='function'){save()}}catch(e){}}
function S(){try{return window.S||window.state||window.APPSTATE||{}}catch(e){return {}}}
function clipDur(c){var st=parseFloat(c.start),en=parseFloat(c.end);if(!isFinite(st)||!isFinite(en)){return 0}return Math.max(0,(en-st))/(c.speed||1)}
function clips(){var s=S();var a=(s&&s.clips)||[];var out=[],t=0;for(var i=0;i<a.length;i++){var d=clipDur(a[i]);if(d>0.05){t+=d;out.push({c:a[i],d:d})}}return out}
function genre(){var s=S();var cs=clips();var g=((s.genre||s.style||(cs[0]?cs[0].c.style:'')||'')+'').toUpperCase()||'EDIT';return g}
function needClips(){if(!clips().length){log('hook lab: add clips to the timeline first');return false}return true}
function dl(name,text){try{var b=new Blob([text],{type:'text/plain'});var u=URL.createObjectURL(b);var a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},800);log('download started - '+name,true)}catch(e){log('download blocked, '+e.message)}}
function hookWindow(){var cs=clips(),t=0,out=[];for(var i=0;i<cs.length;i++){out.push(cs[i]);t+=cs[i].d;if(t>=3){break}}return out}
function hookCheck(){if(!needClips()){return}
 var hw=hookWindow();var tot=0;for(var i=0;i<hw.length;i++){tot+=hw[i].d}
 var first=hw[0];var slow=(first.d>1.5);
 log('HOOK CHECK - first '+Math.round(tot*10)/10+'s holds '+hw.length+' cut'+(hw.length===1?'':'s')+', opening cut '+Math.round(first.d*10)/10+'s'+(slow?' - TOO SLOW for '+genre().toLowerCase()+', trim it under 1.2s or start mid-action':' - good pace'),true);
 if(hw.length<3){log('HOOK CHECK - under 3 cuts in the first 3s, '+genre().toLowerCase()+' hooks want 3+ cuts: add a 0.5s flash between them',true)}
 var label='';try{label=hw[0].c.label||hw[0].c.name||''}catch(e){}
 if(label){log('HOOK CHECK - opener is "'+label+'", make sure the strongest visual opens, not an intro shot',true)}}
function hookTitles(){if(!needClips()){return}
 var g=genre();var t1,t2,t3;
 if(g.indexOf('PHONK')>=0){t1='wait for the drop';t2='you are not ready';t3='the last 5s are insane'}
 else if(g.indexOf('SPORT')>=0||g.indexOf('FOOTBALL')>=0){t1='nobody saw this coming';t2='full speed no brakes';t3='watch the left side'}
 else if(g.indexOf('ANIME')>=0){t1='this scene broke the internet';t2='wait for the awakening';t3='top 3 edits of all time'}
 else{t1='do not scroll';t2='this took 40 hours';t3='the ending is worth it'}
 log('HOOK TITLES - v1: "'+t1+'" at 0.2-1.4s, big bold, bottom third above the safe zone',true);
 log('HOOK TITLES - v2: "'+t2+'" at 1.5-2.8s, one line, under 22 characters',true);
 log('HOOK TITLES - v3: "'+t3+'" as a teaser at 0.3s, fades by 1s, never repeats later',true);
 log('HOOK TITLES - keep every line inside the middle 80% width so the ui never crops it',true)}
function patternInterrupt(){if(!needClips()){return}
 var cs=clips();var t=0;var marks=[];
 for(var i=0;i<cs.length&&marks.length<3;i++){t+=cs[i].d;if(i>0){marks.push(t)}}
 var kinds=['flash frame (2 frames of white or black)','speed ramp (0.5x into the cut, snap to 2x out)','cut on the beat (align the cut to the loudest transient)'];
 for(var j=0;j<marks.length;j++){log('PATTERN INTERRUPT - at '+Math.round(marks[j]*10)/10+'s: '+kinds[j],true)}
 log('PATTERN INTERRUPT - rule: one interrupt per 2s inside the hook, then loosen to one per 3s after 5s',true)}
function coldOpen(){if(!needClips()){return}
 var cs=clips();var best=0;for(var i=1;i<cs.length;i++){if(cs[i].d>cs[best].d){best=i}}
 var tot=0;for(var k=0;k<cs.length;k++){tot+=cs[k].d}
 log('COLD OPEN - steal 0.8s from clip '+(best+1)+' ('+Math.round(cs[best].d*10)/10+'s'+(best===0?', the opener itself':', the longest later beat')+') and open with it, then hard cut back to the real start',true);
 log('COLD OPEN - the stolen beat is a promise, not a spoiler: use its peak action, never its resolution; runtime stays '+Math.round(tot*10)/10+'s',true);
 log('COLD OPEN - mark the stolen range in the source clip and add it as a new 0.8s clip at position 0',true);saveE()}
function firstFrame(){if(!needClips()){return}
 var first=clips()[0];var spec={clip:(first.c.label||first.c.name||'clip 1')+'',start:parseFloat(first.c.start)||0,duration:Math.round(first.d*100)/100};
 log('FIRST FRAME - opener pulls from source '+spec.start+'s for '+spec.duration+'s - move the in-point 0.3s later so frame 1 is already moving',true);
 try{navigator.clipboard.writeText(JSON.stringify(spec));log('FIRST FRAME - spec copied to clipboard as JSON',true)}catch(e){log('FIRST FRAME - clipboard blocked, read the log line',true)}}
function retention(){if(!needClips()){return}
 var cs=clips();var hot=[];
 var tot=0;for(var i=0;i<cs.length;i++){tot+=cs[i].d}
 for(var j=0;j<cs.length;j++){var r=0;if(cs[j].d>2.5){r=Math.round((cs[j].d-2.5)*40)}if(j===0&&cs[j].d>1.2){r+=30}if(r>0){hot.push('clip '+(j+1)+' ('+Math.round(cs[j].d*10)/10+'s) risk '+r)}}
 log('RETENTION CURVE - drop risk: '+(hot.length?hot.join(', '):'none - every cut sits under the danger line'),true);
 log('RETENTION CURVE - '+cs.length+' cuts over '+Math.round(tot*10)/10+'s, avg hold '+Math.round(tot/cs.length*10)/10+'s - the first 3s carries 3x the drop weight of the rest',true)}
function hookVariants(){if(!needClips()){return}
 var cs=clips();var fast=0;for(var i=1;i<cs.length;i++){if(cs[i].d<cs[fast].d){fast=i}}
 log('HOOK VARIANTS - v1 fastest-first: open with clip '+(fast+1)+' ('+Math.round(cs[fast].d*10)/10+'s), the shortest cut is the highest energy',true);
 log('HOOK VARIANTS - v2 payoff-first: cold open with the climax beat then rewind (cold open plan picks it)',true);
 log('HOOK VARIANTS - v3 loop-bait: open with the last beat so the loop reads seamless (loop seam checks it)',true);
 log('HOOK VARIANTS - test one variant per post, never two changes at once, keep the audio hook identical across tests',true)}
function loopSeam(){if(!needClips()){return}
 var cs=clips();var f=cs[0],l=cs[cs.length-1];
 var diff=Math.abs(f.d-l.d);var verdict=diff<0.15?'seamless':(diff<0.4?'close':'rough');
 log('LOOP SEAM - first cut '+Math.round(f.d*10)/10+'s vs last cut '+Math.round(l.d*10)/10+'s -> '+verdict+' loop'+(verdict!=='seamless'?': trim the longer side '+Math.round(diff*10)/10+'s or drop a 0.2s whiteout on the seam':''),true);
 log('LOOP SEAM - match motion direction across the seam too: if the last cut exits left, the first cut should enter left',true)}
function thumbPick(){if(!needClips()){return}
 var cs=clips();var best=0;for(var i=1;i<cs.length;i++){if(cs[i].d>cs[best].d){best=i}}
 var t=0;for(var j=0;j<best;j++){t+=cs[j].d}
 var pick={time:Math.round((t+cs[best].d*0.5)*100)/100,clip:best+1};
 log('THUMB PICK - cover frame: clip '+(best+1)+' at '+pick.time+'s (mid-peak of the longest beat), frame the title overlay a third from the top',true);
 try{navigator.clipboard.writeText(JSON.stringify(pick));log('THUMB PICK - cover timestamp copied to clipboard',true)}catch(e){log('THUMB PICK - clipboard blocked, read the log line',true)}}
function hookSheet(){if(!needClips()){return}
 var cs=clips();var tot=0;for(var i=0;i<cs.length;i++){tot+=cs[i].d}
 var hw=hookWindow();var first=hw[0];
 var L=[];L.push('HOOK LAB REPORT');L.push('generated '+new Date().toISOString());L.push('runtime '+Math.round(tot*10)/10+'s, cuts '+cs.length+', genre '+genre().toLowerCase());L.push('');
 L.push('HOOK WINDOW (first 3s)');var t3=0;for(var k=0;k<hw.length;k++){t3+=hw[k].d;L.push((k+1)+'. cut '+Math.round(hw[k].d*10)/10+'s (cumulative '+Math.round(t3*10)/10+'s)')}
 L.push('opening cut '+(first.d>1.5?'TOO SLOW - trim under 1.2s or start mid-action':'good pace'));L.push('');
 L.push('LOOP');L.push('first cut '+Math.round(cs[0].d*10)/10+'s vs last cut '+Math.round(cs[cs.length-1].d*10)/10+'s');L.push('');
 L.push('AVG HOLD');L.push(Math.round(tot/cs.length*10)/10+'s');L.push('');
 L.push('NEXT');L.push('hook titles for the three genre-tuned lines, pattern interrupt for the beat marks, cold open plan for the stolen beat, thumb pick for the cover frame');dl('hook-sheet.txt',L.join('\n'))}
function mount(){
 if(document.getElementById('f42b1')){return}
 var card=document.createElement('div');card.className='card';card.id='f42card';
 var h=document.createElement('h2');h.textContent='HOOK LAB';card.appendChild(h);
 var r1=mkRow();r1.appendChild(mkBtn('HOOK CHECK',hookCheck,'f42b1'));r1.appendChild(mkBtn('HOOK TITLES',hookTitles,'f42b2'));card.appendChild(r1);
 var r2=mkRow();r2.appendChild(mkBtn('PATTERN INTERRUPT',patternInterrupt,'f42b3'));r2.appendChild(mkBtn('COLD OPEN PLAN',coldOpen,'f42b4'));card.appendChild(r2);
 var r3=mkRow();r3.appendChild(mkBtn('FIRST FRAME',firstFrame,'f42b5'));r3.appendChild(mkBtn('RETENTION CURVE',retention,'f42b6'));card.appendChild(r3);
 var r4=mkRow();r4.appendChild(mkBtn('HOOK VARIANTS',hookVariants,'f42b7'));r4.appendChild(mkBtn('LOOP SEAM',loopSeam,'f42b8'));card.appendChild(r4);
 var r5=mkRow();r5.appendChild(mkBtn('THUMB PICK',thumbPick,'f42b9'));r5.appendChild(mkBtn('HOOK SHEET .TXT',hookSheet,'f42b10'));card.appendChild(r5);
 var note=document.createElement('div');note.className='note';note.id='f42note';note.textContent='hook lab engineers the first three seconds: a pace check on the opening cuts, genre-tuned hook title lines, pattern interrupts on the beat, a cold open plan, a first-frame spec, a retention drop-risk curve, three opening variants, a loop seam check, a cover frame pick and a downloadable hook sheet.';
 card.appendChild(note);
 var hs=document.querySelectorAll('.card h2'),anchor=null;
 for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('COLOR LAB')>=0){anchor=hs[i].parentElement;break}}
 if(anchor){if(anchor.nextSibling){anchor.parentElement.insertBefore(card,anchor.nextSibling)}else{anchor.parentElement.appendChild(card)}}
 else{var ap=document.querySelector('#panelcol')||document.body;ap.appendChild(card)}
 log('hook lab live - hook check, hook titles, pattern interrupt, cold open plan, first frame, retention curve, hook variants, loop seam, thumb pick, hook sheet');
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',mount)}else{mount()}
})();