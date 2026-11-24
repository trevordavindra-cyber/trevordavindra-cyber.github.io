'use strict';
// up41.js - PHASE 35 COLOR LAB (Nov 23 2026)
// look presets, exposure check, saturation targets, skin tone guard, color story,
// grain texture, duotone, contrast check, lut spec, color sheet
(function(){
if(window.__tk2up41){return}window.__tk2up41=1;
function mkBtn(t,fn,id){var b=document.createElement('button');b.className='btn';b.textContent=t;if(id){b.id=id}b.onclick=fn;return b}
function mkRow(){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap='6px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function saveE(){try{if(typeof save==='function'){save()}}catch(e){}}
function S(){try{return window.S||window.state||window.APPSTATE||{}}catch(e){return {}}}
function clipDur(c){var st=parseFloat(c.start),en=parseFloat(c.end);if(!isFinite(st)||!isFinite(en)){return 0}return Math.max(0,(en-st))/(c.speed||1)}
function clips(){var s=S();var a=(s&&s.clips)||[];var out=[],t=0;for(var i=0;i<a.length;i++){var d=clipDur(a[i]);if(d>0.05){t+=d;out.push({c:a[i],d:d})}}return out}
function genre(){var s=S();var cs=clips();var g=((s.genre||s.style||(cs[0]?cs[0].c.style:'')||'')+'').toUpperCase()||'EDIT';return g}
function needClips(){if(!clips().length){log('color lab: add clips to the timeline first');return false}return true}
function dl(name,text){try{var b=new Blob([text],{type:'text/plain'});var u=URL.createObjectURL(b);var a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},800);log('download started - '+name,true)}catch(e){log('download blocked, '+e.message)}}
var LOOKS=[{name:'TEAL-ORANGE',filter:'contrast(1.1) saturate(1.2) hue-rotate(-20deg) sepia(0.1)',v:{contrast:1.1,sat:1.2,hue:-20,sepia:0.1,bright:1}},{name:'WARM FILM',filter:'contrast(1.05) saturate(1.1) hue-rotate(10deg) sepia(0.2)',v:{contrast:1.05,sat:1.1,hue:10,sepia:0.2,bright:1.1}},{name:'COLD CYBERPUNK',filter:'contrast(1.2) saturate(1.3) hue-rotate(180deg)',v:{contrast:1.2,sat:1.3,hue:180,sepia:0,bright:0.9}},{name:'VHS',filter:'contrast(0.9) saturate(0.8) sepia(0.15) brightness(0.95)',v:{contrast:0.9,sat:0.8,hue:0,sepia:0.15,bright:0.95}},{name:'NOIR',filter:'contrast(1.35) saturate(0.15) brightness(0.85)',v:{contrast:1.35,sat:0.15,hue:0,sepia:0,bright:0.85}}];
function lookKey(){var g=genre();if(g.indexOf('PHONK')>=0||g.indexOf('EDIT')>=0){return 'TEAL-ORANGE'}if(g.indexOf('CINEMATIC')>=0||g.indexOf('FILM')>=0){return 'WARM FILM'}if(g.indexOf('CYBER')>=0||g.indexOf('TECH')>=0){return 'COLD CYBERPUNK'}if(g.indexOf('VHS')>=0||g.indexOf('RETRO')>=0){return 'VHS'}return 'NOIR'}
function lookPresets(){if(!needClips()){return}
 var pick=lookKey();var saved=null;
 for(var i=0;i<LOOKS.length;i++){var p=LOOKS[i];var tag=(p.name===pick)?' <- picked for '+genre().toLowerCase():'';
  log('LOOK PRESETS - '+p.name+': '+p.filter+tag,true)}
 try{saved=JSON.parse(localStorage.getItem('tk2look')||'null')}catch(e){}
 if(!saved||saved.name!==pick){var pp=null;for(var j=0;j<LOOKS.length;j++){if(LOOKS[j].name===pick){pp=LOOKS[j]}}
  try{localStorage.setItem('tk2look',JSON.stringify({name:pp.name,v:pp.v}))}catch(e){}
  log('LOOK PRESETS - saved '+pp.name+' as the default look (localStorage tk2look), pick another by running this again after a genre change',true)}
 else{log('LOOK PRESETS - '+pick+' already saved, kept it',true)}}
function exposureCheck(){if(!needClips()){return}
 var LOW=['dark','night','shadow','indoor','moody','noir'],HIGH=['snow','beach','day','sunny','bright','outdoor'];
 var cs=clips(),lo=0,hi=0,lowIds=[],hiIds=[];
 for(var i=0;i<cs.length;i++){var st=((cs[i].c.style||'')+'').toLowerCase();var isL=false,isH=false;
  for(var k=0;k<LOW.length;k++){if(st.indexOf(LOW[k])>=0){isL=true}}
  for(var k2=0;k2<HIGH.length;k2++){if(st.indexOf(HIGH[k2])>=0){isH=true}}
  if(isL&&!isH){lo++;lowIds.push(i+1)}else if(isH&&!isL){hi++;hiIds.push(i+1)}}
 var tot=cs.length;
 if(lo===tot&&tot>1){log('EXPOSURE CHECK - all '+tot+' clips read dark, the grade will sink; lift brightness on '+lowIds.slice(0,3).join(',')+' or cut a daylight clip in',true)}
 else if(hi===tot&&tot>1){log('EXPOSURE CHECK - all '+tot+' clips read bright, the highlights will clip; pull brightness on '+hiIds.slice(0,3).join(',')+' or cut a darker clip in',true)}
 else{log('EXPOSURE CHECK - '+lo+' dark / '+hi+' bright of '+tot+', good spread for a grade; look presets can carry it',true)}}
function satTargets(){if(!needClips()){return}
 var g=genre(),band,min,max;
 if(g.indexOf('PHONK')>=0){min=1.2;max=1.5;band='phonk runs hot'}
 else if(g.indexOf('CINEMATIC')>=0||g.indexOf('FILM')>=0){min=0.9;max=1.2;band='cinematic stays controlled'}
 else if(g.indexOf('VLOG')>=0||g.indexOf('AESTHETIC')>=0){min=0.7;max=1.0;band='vlog stays natural'}
 else{min=1.0;max=1.4;band='edits pop'}
 var cur=null;var s=S();
 if(isFinite(parseFloat(s.sat))){cur=parseFloat(s.sat)}
 if(cur===null){var saved=null;try{saved=JSON.parse(localStorage.getItem('tk2look')||'null')}catch(e){}
  if(saved&&saved.v&&isFinite(saved.v.sat)){cur=saved.v.sat;log('SATURATION TARGETS - read the saved look ('+saved.name+') for the current number')}}
 if(cur===null){log('SATURATION TARGETS - '+band+' for '+g.toLowerCase()+': aim '+min+'-'+max+'x. no current value on the project or the saved look, set one with look presets first',true);return}
 var ok=cur>=min&&cur<=max;
 log('SATURATION TARGETS - '+band+' for '+g.toLowerCase()+': aim '+min+'-'+max+'x, current '+cur+'x, '+(ok?'in band, ship it':'out of band, '+((cur<min)?'lift it '+(Math.round((min-cur)*100)/100)+'x':'pull it back '+(Math.round((cur-max)*100)/100)+'x')),true)}
function skinGuard(){var saved=null;try{saved=JSON.parse(localStorage.getItem('tk2look')||'null')}catch(e){}
 if(!saved||!saved.v){log('SKIN TONE GUARD - no saved look to check, run look presets first');return}
 var hue=Math.abs(parseFloat(saved.v.hue)||0);
 if(hue>20){log('SKIN TONE GUARD - '+saved.name+' shifts hue '+hue+'deg, faces drift green/magenta; either drop the hue under 20deg or only grade b-roll with it',true)}
 else{log('SKIN TONE GUARD - '+saved.name+' shifts hue '+hue+'deg, inside the 20deg face-safe band',true)}}
function colorStory(){if(!needClips()){return}
 var cs=clips(),tot=0;for(var i=0;i<cs.length;i++){tot+=cs[i].d}
 var s0=parseFloat(cs[0].c.start)||0;
 var ARCS=[['COOL OPEN','#0e2733','#7fd6ff'],['NEUTRAL BUILD','#3a3a3a','#e8e2d6'],['HOT PAYOFF','#5c1010','#ffb347']];
 var marks=[['0-33%',s0,s0+tot*0.33],['34-66%',s0+tot*0.34,s0+tot*0.66],['67-100%',s0+tot*0.67,s0+tot]];
 for(var j=0;j<3;j++){log('COLOR STORY - '+ARCS[j][0]+' '+marks[j][0]+' ('+Math.round((marks[j][1])*10)/10+'-'+Math.round(marks[j][2]*10)/10+'s): shadows '+ARCS[j][1]+' lifting to highlights '+ARCS[j][2]+', save each as a keyframe on the grade layer',true)}
 log('COLOR STORY - the arc reads cool open, neutral build, hot payoff, which is the loop-friendly shape for '+genre().toLowerCase(),true)}
function grainTexture(){if(!needClips()){return}
 var g=genre(),amt=30,sz=2,blend='overlay',where='ending 1s only';
 if(g.indexOf('PHONK')>=0){amt=55;sz=2;blend='overlay';where='full edit'}
 else if(g.indexOf('VHS')>=0||g.indexOf('RETRO')>=0){amt=70;sz=3;blend='soft-light';where='full edit'}
 else if(g.indexOf('CINEMATIC')>=0||g.indexOf('FILM')>=0){amt=18;sz=1;blend='soft-light';where='full edit at 40% opacity'}
 var spec='grain spec for '+g.toLowerCase()+': amount '+amt+'%, grain size '+sz+'px, blend '+blend+', apply '+where+', keep it off captions so text stays crisp';
 log('GRAIN TEXTURE - '+spec,true);
 try{navigator.clipboard.writeText(JSON.stringify({genre:g,amount:amt,size:sz,blend:blend,apply:where}));log('GRAIN TEXTURE - spec copied to clipboard as JSON',true)}catch(e){log('GRAIN TEXTURE - clipboard blocked, read it from the log line',true)}}
function duotone(){if(!needClips()){return}
 var PAIRS=[['#0b1e3f','#00d4ff'],['#1a0b2e','#ff6ec7'],['#0d1f0d','#9bff5c'],['#2b0a0a','#ff9e2c'],['#101014','#c0c0ff'],['#240f24','#ffe066']];
 var g=genre(),h=0;for(var i=0;i<g.length;i++){h=(h*31+g.charCodeAt(i))>>>0}
 var p=PAIRS[h%PAIRS.length];
 log('DUOTONE - '+g.toLowerCase()+' maps to shadows '+p[0]+' / highlights '+p[1]+', recipe: grayscale(1) sepia(0.4) hue-rotate(200deg) saturate(2.2), tint the shadows '+p[0]+' and let highlights sit at '+p[1],true);
 try{localStorage.setItem('tk2duotone',JSON.stringify({genre:g,shadow:p[0],highlight:p[1]}))}catch(e){}
 log('DUOTONE - pair saved to this device (tk2duotone), the color sheet will pick it up',true)}
function contrastCheck(){if(!needClips()){return}
 var cs=clips();var n=cs.length;if(n<3){log('CONTRAST CHECK - need 3+ clips to judge pacing, got '+n);return}
 var tot=0;for(var i=0;i<cs.length;i++){tot+=cs[i].d}
 var mean=tot/n,v=0;for(var j=0;j<n;j++){var d=cs[j].d-mean;v+=d*d}
 var sd=Math.sqrt(v/n);var cv=mean>0?sd/mean:0;var pct=Math.round(cv*100);
 var verdict=(cv>0.35)?'punchy':(cv>0.18?'balanced':'flat');
 log('CONTRAST CHECK - pacing spread '+pct+'% (avg cut '+Math.round(mean*10)/10+'s) -> '+verdict+' '+(verdict==='flat'?'grade it richer instead of faster, or trim the longest 2 cuts by 20%':verdict==='punchy'?'the grade can stay bold, the pacing already carries it':'hold this level, contrast and pacing match'),true)}
function lutSpec(){var L=[];L.push('LUT SPEC - 5 look presets as adjustment values');L.push('generated '+new Date().toISOString());L.push('');
 for(var i=0;i<LOOKS.length;i++){var p=LOOKS[i];L.push(p.name);L.push('  css filter: '+p.filter);L.push('  contrast '+p.v.contrast+' | saturation '+p.v.sat+' | hue-rotate '+p.v.hue+'deg | sepia '+p.v.sepia+' | brightness '+p.v.bright);L.push('  skin-safe hue band: '+(Math.abs(p.v.hue)<=20?'yes (under 20deg)':'no (faces will drift)'));L.push('')}
 L.push('apply as an adjustment layer over the full edit, keep captions on a layer above the grade');dl('lut-spec.txt',L.join('\n'))}
function colorSheet(){if(!needClips()){return}
 var cs=clips(),tot=0;for(var i=0;i<cs.length;i++){tot+=cs[i].d}
 var L=[];L.push('COLOR LAB REPORT');L.push('generated '+new Date().toISOString());L.push('cut length '+Math.round(tot*10)/10+'s, genre '+genre().toLowerCase()+', clips '+cs.length);L.push('');
 var saved=null;try{saved=JSON.parse(localStorage.getItem('tk2look')||'null')}catch(e){}
 L.push('LOOK');L.push(saved?('saved: '+saved.name+' (contrast '+saved.v.contrast+', sat '+saved.v.sat+', hue '+saved.v.hue+'deg)'):'none saved - run look presets');L.push('');
 var duo=null;try{duo=JSON.parse(localStorage.getItem('tk2duotone')||'null')}catch(e){}
 L.push('DUOTONE');L.push(duo?('shadows '+duo.shadow+' / highlights '+duo.highlight+' for '+duo.genre.toLowerCase()):'none saved - run duotone');L.push('');
 L.push('EXPOSURE + SATURATION + SKIN');L.push('run exposure check, saturation targets and skin tone guard on the live page, then paste the verdicts here');L.push('');
 L.push('COLOR STORY (cool open / neutral build / hot payoff)');
 for(var j=0;j<3;j++){L.push((j+1)+'. '+['0-33%','34-66%','67-100%'][j]+' - '+['#0e2733->#7fd6ff','#3a3a3a->#e8e2d6','#5c1010->#ffb347'][j])}
 L.push('');L.push('PACING CONTRAST');L.push('run contrast check on the live page for the number, verdict scales the grade strength');dl('color-sheet.txt',L.join('\n'))}
function mount(){
 if(document.getElementById('f41b1')){return}
 var card=document.createElement('div');card.className='card';card.id='f41card';
 var h=document.createElement('h2');h.textContent='COLOR LAB';card.appendChild(h);
 var r1=mkRow();r1.appendChild(mkBtn('LOOK PRESETS',lookPresets,'f41b1'));r1.appendChild(mkBtn('EXPOSURE CHECK',exposureCheck,'f41b2'));card.appendChild(r1);
 var r2=mkRow();r2.appendChild(mkBtn('SATURATION TARGETS',satTargets,'f41b3'));r2.appendChild(mkBtn('SKIN TONE GUARD',skinGuard,'f41b4'));card.appendChild(r2);
 var r3=mkRow();r3.appendChild(mkBtn('COLOR STORY',colorStory,'f41b5'));r3.appendChild(mkBtn('GRAIN TEXTURE',grainTexture,'f41b6'));card.appendChild(r3);
 var r4=mkRow();r4.appendChild(mkBtn('DUOTONE',duotone,'f41b7'));r4.appendChild(mkBtn('CONTRAST CHECK',contrastCheck,'f41b8'));card.appendChild(r4);
 var r5=mkRow();r5.appendChild(mkBtn('LUT SPEC',lutSpec,'f41b9'));r5.appendChild(mkBtn('COLOR SHEET .TXT',colorSheet,'f41b10'));card.appendChild(r5);
 var note=document.createElement('div');note.className='note';note.id='f41note';note.textContent='color lab grades the picture: five look presets picked by genre and saved on the device, exposure and saturation checks, a skin-tone guard on hue shifts, a three-step color story across the runtime, genre-tuned grain, a duotone builder, a pacing-contrast verdict, a lut spec export and a downloadable color sheet.';
 card.appendChild(note);
 var hs=document.querySelectorAll('.card h2'),anchor=null;
 for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('CAPTION LAB')>=0){anchor=hs[i].parentElement;break}}
 if(anchor){if(anchor.nextSibling){anchor.parentElement.insertBefore(card,anchor.nextSibling)}else{anchor.parentElement.appendChild(card)}}
 else{var ap=document.querySelector('#panelcol')||document.body;ap.appendChild(card)}
 log('color lab live - look presets, exposure check, saturation targets, skin tone guard, color story, grain texture, duotone, contrast check, lut spec, color sheet');
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',mount)}else{mount()}
})();
