'use strict';
// up40.js - PHASE 34 CAPTION LAB (Nov 23 2026)
// caption draft, read time check, line length check, timing spread,
// safe zone, style preset, emoji density, hook caption, srt export, caption report
(function(){
if(window.__tk2up40){return}window.__tk2up40=1;
function mkBtn(t,fn,id){var b=document.createElement('button');b.className='btn';b.textContent=t;if(id){b.id=id}b.onclick=fn;return b}
function mkRow(){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap='6px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function saveE(){try{if(typeof save==='function'){save()}}catch(e){}}
function S(){try{return window.S||window.state||window.APPSTATE||{}}catch(e){return {}}}
function clipDur(c){var st=parseFloat(c.start),en=parseFloat(c.end);if(!isFinite(st)||!isFinite(en)){return 0}return Math.max(0,(en-st))/(c.speed||1)}
function clips(){var s=S();var a=(s&&s.clips)||[];var out=[],t=0;for(var i=0;i<a.length;i++){var d=clipDur(a[i]);if(d>0.05){t+=d;out.push({c:a[i],d:d})}}return out}
function caps(){var s=S();var a=(s&&s.captions)||[];var out=[];for(var i=0;i<a.length;i++){var c=a[i];if(c&&c.text&&isFinite(parseFloat(c.t0))&&isFinite(parseFloat(c.t1))&&parseFloat(c.t1)>parseFloat(c.t0)){out.push({t0:parseFloat(c.t0),t1:parseFloat(c.t1),text:String(c.text)})}}return out}
function genre(){var s=S();var cs=clips();var g=((s.genre||s.style||(cs[0]?cs[0].c.style:'')||'')+'').toUpperCase()||'EDIT';return g}
function needClips(){if(!clips().length){log('caption lab: add clips to the timeline first');return false}return true}
function dl(name,text){try{var b=new Blob([text],{type:'text/plain'});var u=URL.createObjectURL(b);var a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},800);log('download started - '+name,true)}catch(e){log('download blocked, '+e.message)}}
var BEATS=['it hits different','wait for the drop','this part','no way','run it back','who else saw that','the transition','locked in'];
var BEATS2=['here it comes','peak moment','slow-mo spin','the payoff','one more time','best cut','clean','final frame'];
var EMOJI_RE=/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
function emojiCount(s){try{var m=s.match(new RegExp(EMOJI_RE.source,'gu'));return m?m.length:0}catch(e){var n=0;for(var i=0;i<s.length;i++){var ch=s.charCodeAt(i);if(ch>=0x1F300||ch>=0x2600&&ch<=0x27BF){n++}}return n}}
function capDraft(){if(!needClips()){return}
 var s=S();var cs=clips();var tot=0;for(var i=0;i<cs.length;i++){tot+=cs[i].d}
 var s0=parseFloat(cs[0].c.start)||0;
 if(caps().length){log('CAPTION DRAFT - project already has '+caps().length+' caption line(s), nothing overwritten');return}
 var beat=(s.capStyle==='bold'?'bold':'normal');
 var acc=0,out=[];
 for(var j=0;j<cs.length;j++){var d=cs[j].d;var pool=(j%2===0)?BEATS:BEATS2;var line=pool[j%pool.length]+' '+genre().toLowerCase();
  if(!out.length){line=genre().toLowerCase()+' edit that loops - wait for it'}
  if(line.length>42){line=line.slice(0,42)}
  out.push({id:'c'+Date.now()+'_'+j,t0:s0+acc,t1:Math.min(tot+s0,acc+s0+Math.max(1.0,d)),text:line});acc+=d}
 s.captions=s.captions||[];for(var k=0;k<out.length;k++){s.captions.push(out[k])}
 saveE();log('CAPTION DRAFT - added '+out.length+' lines across '+Math.round(tot*10)/10+'s (read time checked on the next tap)',true)}
function readTime(){var a=caps();if(!a.length){log('READ TIME CHECK - no captions yet');return}
 var bad=[];for(var i=0;i<a.length;i++){var span=a[i].t1-a[i].t0;var need=Math.max(0.9,a[i].text.length/15);if(span+0.01<need){bad.push((i+1)+' "'+a[i].text.slice(0,24)+'" shows '+Math.round(span*10)/10+'s, needs '+Math.round(need*10)/10+'s')}}
 log('READ TIME CHECK - '+(bad.length?bad.length+' of '+a.length+' line(s) too fast: '+bad.slice(0,3).join(' | '):'all '+a.length+' line(s) readable at 15 chars/sec'),true)}
function lineLen(){var a=caps();if(!a.length){log('LINE LENGTH CHECK - no captions yet');return}
 var bad=[],longest=0;for(var i=0;i<a.length;i++){var L=a[i].text.length;if(L>longest){longest=L}if(L>42){bad.push('line '+(i+1)+': '+L+' chars')}}
 log('LINE LENGTH CHECK - '+(bad.length?bad.length+' over the 42-char cap: '+bad.slice(0,3).join('; '):'all lines 42 chars or under')+' (longest '+longest+')',true)}
function timingSpread(){var a=caps().slice().sort(function(x,y){return x.t0-y.t0});if(!a.length){log('TIMING SPREAD - no captions yet');return}
 var probs=[];for(var i=1;i<a.length;i++){var gap=a[i].t0-a[i-1].t1;if(gap>0.05){probs.push(Math.round(gap*100)/100+'s gap at '+Math.round(a[i-1].t1*10)/10+'s')}else if(gap<-0.05){probs.push(Math.round(-gap*100)/100+'s overlap at '+Math.round(a[i].t0*10)/10+'s')}}
 log('TIMING SPREAD - '+(probs.length?probs.length+' seam issue(s): '+probs.slice(0,3).join('; '):a.length+' line(s) clean, no overlaps or gaps'),true)}
function safeZone(){var a=caps();var tot=0;var cs=clips();for(var i=0;i<cs.length;i++){tot+=cs[i].d}
 if(!a.length){log('SAFE ZONE - no captions yet, but plan for it: bottom 25% of the frame is TikTok UI');return}
 var late=[];for(var j=0;j<a.length;j++){if(a[j].t1>tot*0.93){late.push('line '+(j+1)+' runs into the last 7%')}}
 log('SAFE ZONE - keep captions center-lower, above the bottom 25% UI band; caption box clear of the right 15% (like/counts)'+(late.length?'; fix: '+late.slice(0,2).join('; '):''),true)}
var STKEY='tk2capstyle';
function stylePreset(){var pals=[['bold','chunky white with 2px black stroke, 3 words max per line'],['outline','thin white outline-only, floats over fast cuts'],['neon','cyan glow with magenta stroke, drops land on it'],['minimal','small clean white, all-caps, bottom-center above the UI band']];
 var pick=pals[Math.floor(Math.random()*pals.length)];
 try{localStorage.setItem(STKEY,pick[0])}catch(e){}
 var s=S();if(s){s.capStyle=pick[0]}
 saveE();log('STYLE PRESET - set to '+pick[0].toUpperCase()+': '+pick[1]+' (saved on this device)',true)}
function emojiDensity(){var a=caps();if(!a.length){log('EMOJI DENSITY - no captions yet');return}
 var bad=[];for(var i=0;i<a.length;i++){var n=emojiCount(a[i].text);if(n>2){bad.push('line '+(i+1)+': '+n+' emojis')}}
 log('EMOJI DENSITY - '+(bad.length?bad.length+' line(s) over the 2-per-line cap: '+bad.slice(0,3).join('; '):'all lines at 2 emojis or under (empty is fine too)'),true)}
function hookCaption(){var s=S();var a=caps();var tot=0;var cs=clips();if(!cs.length){log('HOOK CAPTION - add clips first');return}
 for(var i=0;i<cs.length;i++){tot+=cs[i].d}
 var s0=parseFloat(cs[0].c.start)||0;
 var hasHook=false;for(var j=0;j<a.length;j++){if(a[j].t0<s0+2){hasHook=true;break}}
 if(hasHook){log('HOOK CAPTION - a caption already lands in the first 2s, good');return}
 var g=genre().toLowerCase();var line=g+' edit - wait for the drop';
 if(line.length>42){line=line.slice(0,42)}
 s.captions=s.captions||[];s.captions.push({id:'c'+Date.now()+'_hook',t0:s0,t1:Math.min(tot+s0,s0+2),text:line});
 saveE();log('HOOK CAPTION - added in the first 2s: "'+line+'" (retention labs were flagging this gap)',true)}
function srt(){var a=caps();if(!a.length){log('CAPTION SRT - no captions yet');return}
 function ts(t){var ms=Math.round(t*1000);var h=Math.floor(ms/3600000),m=Math.floor((ms%3600000)/60000),sec=Math.floor((ms%60000)/1000),mm=ms%1000;function p(n,l){var s=String(n);while(s.length<l){s='0'+s}return s}return p(h,2)+':'+p(m,2)+':'+p(sec,2)+','+p(mm,3)}
 var out=[];for(var i=0;i<a.length;i++){out.push(String(i+1));out.push(ts(Math.max(0,a[i].t0))+' --> '+ts(a[i].t1));out.push(a[i].text);out.push('')}
 dl('captions.srt',out.join('\n'))}
function capReport(){if(!needClips()){return}
 var a=caps();var cs=clips();var tot=0;for(var i=0;i<cs.length;i++){tot+=cs[i].d}
 var L=[];L.push('CAPTION LAB REPORT');L.push('generated '+new Date().toISOString());L.push('cut length '+Math.round(tot*10)/10+'s, genre '+genre().toLowerCase()+', captions '+a.length);L.push('');
 if(!a.length){L.push('NO CAPTIONS YET');L.push('run caption draft, then add a hook line in the first 2s')}
 else{
  var chars=0;for(var j=0;j<a.length;j++){chars+=a[j].text.length}
  L.push('COVERAGE');L.push('captions span '+Math.round((a[a.length-1].t1-a[0].t0)*10)/10+'s of '+Math.round(tot*10)/10+'s; avg line '+Math.round(chars/a.length)+' chars');L.push('');
  L.push('LINES');for(var k=0;k<a.length;k++){L.push((k+1)+'. ['+Math.round(a[k].t0*10)/10+'-'+Math.round(a[k].t1*10)/10+'s] '+a[k].text)}
  var st=null;try{st=localStorage.getItem(STKEY)}catch(e){}
  L.push('');L.push('STYLE PRESET');L.push(st?st:'none saved - run style preset once');}
 dl('caption-report.txt',L.join('\n'))}
function mount(){
 if(document.getElementById('f40b1')){return}
 var card=document.createElement('div');card.className='card';card.id='f40card';
 var h=document.createElement('h2');h.textContent='CAPTION LAB';card.appendChild(h);
 var r1=mkRow();r1.appendChild(mkBtn('CAPTION DRAFT',capDraft,'f40b1'));r1.appendChild(mkBtn('READ TIME CHECK',readTime,'f40b2'));card.appendChild(r1);
 var r2=mkRow();r2.appendChild(mkBtn('LINE LENGTH CHECK',lineLen,'f40b3'));r2.appendChild(mkBtn('TIMING SPREAD',timingSpread,'f40b4'));card.appendChild(r2);
 var r3=mkRow();r3.appendChild(mkBtn('SAFE ZONE',safeZone,'f40b5'));r3.appendChild(mkBtn('STYLE PRESET',stylePreset,'f40b6'));card.appendChild(r3);
 var r4=mkRow();r4.appendChild(mkBtn('EMOJI DENSITY',emojiDensity,'f40b7'));r4.appendChild(mkBtn('HOOK CAPTION',hookCaption,'f40b8'));card.appendChild(r4);
 var r5=mkRow();r5.appendChild(mkBtn('CAPTION SRT',srt,'f40b9'));r5.appendChild(mkBtn('CAPTION REPORT .TXT',capReport,'f40b10'));card.appendChild(r5);
 var note=document.createElement('div');note.className='note';note.id='f40note';note.textContent='caption lab writes the words: a drafted caption track across your timeline, read-time and line-length checks, seam-overlap detection, TikTok safe-zone placement, four saved style presets, emoji density, a hook line in the first 2 seconds, an .srt export and a downloadable caption report.';
 card.appendChild(note);
 var hs=document.querySelectorAll('.card h2'),anchor=null;
 for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('BRAND LAB')>=0){anchor=hs[i].parentElement;break}}
 if(anchor){if(anchor.nextSibling){anchor.parentElement.insertBefore(card,anchor.nextSibling)}else{anchor.parentElement.appendChild(card)}}
 else{var ap=document.querySelector('#panelcol')||document.body;ap.appendChild(card)}
 log('caption lab live - caption draft, read time check, line length check, timing spread, safe zone, style preset, emoji density, hook caption, srt export, caption report');
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',mount)}else{mount()}
})();
