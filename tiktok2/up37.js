'use strict';
// up37.js - PHASE 31 PIPELINE LAB (Nov 23 2026)
// production queue, variation matrix, name kit, split plan, template export,
// template check, batch list, time budget, rolling schedule, pipeline sheet
(function(){
if(window.__tk2up37){return}window.__tk2up37=1;
function $(id){return document.getElementById(id)}
function mkBtn(t,fn,id){var b=document.createElement('button');b.className='btn';b.textContent=t;if(id){b.id=id}b.onclick=fn;return b}
function mkRow(){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap='6px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function saveE(){try{if(typeof save==='function'){save()}}catch(e){}}
function S(){try{return window.S||window.state||window.APPSTATE||{}}catch(e){return {}}}
function clipDur(c){var st=parseFloat(c.start),en=parseFloat(c.end);if(!isFinite(st)||!isFinite(en)){return 0}return Math.max(0,(en-st))/(c.speed||1)}
function clips(){var s=S();var a=(s&&s.clips)||[];var out=[],t=0;for(var i=0;i<a.length;i++){var d=clipDur(a[i]);if(d>0.05){t+=d;out.push({c:a[i],d:d,i:i,st:t-d})}}return out}
function needClips(){var a=clips();if(!a.length){log('pipeline lab: add clips to the timeline first');return null}return a}
function trOf(c){return (c.transition||c.trans||'cut')}
function base(){var cs=clips();if(!cs.length){return null}var t=0;for(var i=0;i<cs.length;i++){t+=cs[i].d}
 var st=S();var genre=((st.genre||st.style||(cs[0].c?cs[0].c.style:'')||'')+'').toUpperCase()||'EDIT';
 var per10=cs.length/Math.max(0.1,t)*10;var tr={};for(var i=0;i<cs.length;i++){var k=trOf(cs[i].c);tr[k]=(tr[k]||0)+1}
 return {cs:cs,t:t,genre:genre,per10:per10,trans:tr}}
function queue(){var x=needClips();if(!x){return}var b=base();if(!b){return}
 var names=[];for(var i=1;i<=5;i++){names.push('PART '+(i+1))}
 log('PRODUCTION QUEUE - next 5 from this recipe: '+names.join(', ')+' - same style ('+b.genre+'), same length class ('+Math.round(b.t*10)/10+'s), same cut density ('+Math.round(b.per10*10)/10+'/10s)',true);saveE()}
function variationMatrix(){var x=needClips();if(!x){return}var b=base();if(!b){return}
 var rows=[['A','faster','pace 1.4x, tighter cuts, '+Math.round(Math.min(14,b.cs.length+3))+' cuts'],['B','slower','pace 0.9x, longer holds, '+Math.round(Math.max(5,b.cs.length-3))+' cuts'],['C','grade swap','same pacing, different color grade + swapped music']];
 var out=[];for(var i=0;i<rows.length;i++){out.push(rows[i][0]+' ('+rows[i][1]+'): '+rows[i][2])}
 log('VARIATION MATRIX - 3 variants from this cut: '+out.join(' | '),true);saveE()}
function nameKit(){var x=needClips();if(!x){return}var b=base();if(!b){return}
 var d=new Date();var stamp=(d.getMonth()+1)+'-'+d.getDate();
 var kit='['+b.genre.toLowerCase()+'-'+stamp+'] part {n} - '+Math.round(b.t)+'s - v{v}';
 log('NAME KIT (copied) - '+kit+' - one pattern for files, posts and drafts so nothing gets mixed up',true);
 try{navigator.clipboard.writeText(kit)}catch(e){}saveE()}
function splitPlan(){var x=needClips();if(!x){return}var b=base();if(!b){return}
 var srcs={};for(var i=0;i<b.cs.length;i++){var s=(b.cs[i].c.srcName||b.cs[i].c.name||b.cs[i].c.src||'')+'';if(s){srcs[s]=(srcs[s]||0)+b.cs[i].d}}
 var keys=[],tot=0;for(var k in srcs){keys.push([k,srcs[k]]);tot+=srcs[k]}
 keys.sort(function(a,c){return c[1]-a[1]});
 var parts=[];for(var j=0;j<Math.min(3,keys.length);j++){parts.push(keys[j][0]+' '+Math.round(keys[j][1]/Math.max(0.01,tot)*100)+'%')}
 log('SPLIT PLAN - source usage across the cut: '+parts.join(' | ')+' - hold the second-source clips back for parts 2-3 instead of reusing them',true);saveE()}
function templateExport(){var x=needClips();if(!x){return}var b=base();if(!b){return}
 var tpl={name:'recipe_'+b.genre.toLowerCase()+'_'+Math.round(b.t)+'s',style:b.genre,cutDensity:Math.round(b.per10*10)/10,transitions:b.trans,clipCount:b.cs.length,lengthSec:Math.round(b.t*10)/10};
 try{navigator.clipboard.writeText(JSON.stringify(tpl))}catch(e){}
 log('TEMPLATE EXPORT (copied) - '+JSON.stringify(tpl),true);saveE()}
function templateCheck(){var x=needClips();if(!x){return}var b=base();if(!b){return}
 var warns=[];if(b.per10<3){warns.push('cut density under 3/10s is slow for a series opener')}
 if(b.per10>9){warns.push('cut density over 9/10s may read chaotic in a series')}
 if(b.t>60){warns.push('over 60s drags the series cadence')}
 var many=0;for(var k in b.trans){if(b.trans[k]>b.cs.length*0.6){many=k}}
 if(many){warns.push('"'+many+'" is used on over 60% of cuts - vary it')}
 log('TEMPLATE CHECK - '+(warns.length?warns.join(' | '):'recipe is series-ready: density, length and transitions all in range'),true);saveE()}
function batchList(){var x=needClips();if(!x){return}var b=base();if(!b){return}
 var steps=['1. cut the edit ('+b.cs.length+' clips, '+Math.round(b.t*10)/10+'s)','2. captions + grade pass','3. cover frame + title','4. growth signal check','5. export 1080p','6. post at the 7pm window','7. pin the comment'];
 log('BATCH LIST - '+steps.join(' | '),true);saveE()}
function timeBudget(){var x=needClips();if(!x){return}var b=base();if(!b){return}
 var cut=Math.round(4+b.cs.length*1.5),cap=6,cover=4,post=3;
 var tot=cut+cap+cover+post;
 log('TIME BUDGET - this recipe costs about '+tot+' min per post: cut '+cut+'m, captions+grade '+cap+'m, cover '+cover+'m, post+pin '+post+'m - at 7pm daily that is '+Math.round(tot*5/60*10)/10+'h/week',true);saveE()}
function rollingSchedule(){var x=needClips();if(!x){return}var b=base();if(!b){return}
 var d=new Date();var names=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];var out=[];
 for(var i=1;i<=3;i++){var dd=new Date(d.getTime()+i*2*86400000);out.push(names[dd.getDay()]+' '+(dd.getMonth()+1)+'/'+dd.getDate()+' 7pm PART '+(i+1))}
 log('ROLLING SCHEDULE - every-other-day cadence from '+names[d.getDay()]+' '+b.genre+': '+out.join(' | '),true);saveE()}
function pipelineSheet(){var x=needClips();if(!x){return}var b=base();if(!b){return}
 var L=['PIPELINE SHEET','generated '+new Date().toString(),'','style '+b.genre+' | length '+Math.round(b.t*10)/10+'s | cuts/10s '+Math.round(b.per10*10)/10,'transitions: '+JSON.stringify(b.trans),'','queue: PART 2..PART 6','cadence: every other day at 7pm','batch list: cut -> captions+grade -> cover -> signal check -> export -> post -> pin','budget: about '+(Math.round(4+b.cs.length*1.5)+13)+' min per post',''];
 try{var blob=new Blob([L.join('\n')],{type:'text/plain'});var el=document.createElement('a');el.href=URL.createObjectURL(blob);el.download='pipeline_sheet.txt';document.body.appendChild(el);el.click();setTimeout(function(){document.body.removeChild(el)},300)}catch(e){log('download failed: '+e.message);return}
 log('pipeline sheet .txt downloaded',true);saveE()}
function mount(){
  if($('f37card')){return}
  var card=document.createElement('div');card.className='card';card.id='f37card';
  var h=document.createElement('h2');h.textContent='PIPELINE LAB';card.appendChild(h);
  var r1=mkRow();r1.appendChild(mkBtn('PRODUCTION QUEUE',queue,'f37b1'));r1.appendChild(mkBtn('VARIATION MATRIX',variationMatrix,'f37b2'));card.appendChild(r1);
  var r2=mkRow();r2.appendChild(mkBtn('NAME KIT',nameKit,'f37b3'));r2.appendChild(mkBtn('SPLIT PLAN',splitPlan,'f37b4'));card.appendChild(r2);
  var r3=mkRow();r3.appendChild(mkBtn('TEMPLATE EXPORT',templateExport,'f37b5'));r3.appendChild(mkBtn('TEMPLATE CHECK',templateCheck,'f37b6'));card.appendChild(r3);
  var r4=mkRow();r4.appendChild(mkBtn('BATCH LIST',batchList,'f37b7'));r4.appendChild(mkBtn('TIME BUDGET',timeBudget,'f37b8'));card.appendChild(r4);
  var r5=mkRow();r5.appendChild(mkBtn('ROLLING SCHEDULE',rollingSchedule,'f37b9'));r5.appendChild(mkBtn('PIPELINE SHEET .TXT',pipelineSheet,'f37b10'));card.appendChild(r5);
  var note=document.createElement('div');note.className='note';note.id='f37note';note.textContent='pipeline lab turns one good cut into a series: it queues the next parts from the current recipe, plans variation matrixes, standardizes naming, plans how source footage splits across parts, exports the recipe as a template, checks it, lists the per-post batch steps, budgets the time, maps a rolling schedule and exports the sheet.';
  card.appendChild(note);
  var hs=document.querySelectorAll('.card h2'),anchor=null;
  for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('GROWTH LAB')>=0){anchor=hs[i].parentElement;break}}
  if(anchor){if(anchor.nextSibling){anchor.parentElement.insertBefore(card,anchor.nextSibling)}else{anchor.parentElement.appendChild(card)}}
  else{var ap=document.querySelector('#panelcol')||document.body;ap.appendChild(card)}
  log('pipeline lab live - production queue, variation matrix, name kit, split plan, template export, template check, batch list, time budget, rolling schedule, pipeline sheet');
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',mount)}else{mount()}
})();