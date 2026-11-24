'use strict';
// up47.js - PHASE 41 TRANSITION LAB (Nov 24 2026)
// wipe, slide, zoom blur, glitch, whip pan, spin, ink reveal,
// light leak, film splice, transition sheet
(function(){
if(window.__tk2up47){return}window.__tk2up47=1;
function mkBtn(t,fn,id){var b=document.createElement('button');b.className='btn';b.textContent=t;if(id){b.id=id}b.onclick=fn;return b}
function mkRow(){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap='6px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function S(){try{return window.S||window.state||window.APPSTATE||{}}catch(e){return {}}}
function clipDur(c){var st=parseFloat(c.start),en=parseFloat(c.end);if(!isFinite(st)||!isFinite(en)){return 0}return Math.max(0,(en-st))/(c.speed||1)}
function clips(){var s=S();var a=(s&&s.clips)||[];var out=[],t=0;for(var i=0;i<a.length;i++){var d=clipDur(a[i]);if(d>0.05){t+=d;out.push({c:a[i],d:d,t0:t})}}for(var j=0;j<out.length;j++){out[j].t0-=out[j].d}return out}
function runtime(){var cs=clips();if(!cs.length){return 0}return cs[cs.length-1].t0+cs[cs.length-1].d}
function needClips(){if(!clips().length){log('transition lab: add clips to the timeline first');return false}return true}
function joints(){var cs=clips();var n=Math.max(0,cs.length-1);var joints=[],i;for(i=0;i<n;i++){joints.push(cs[i].t0+cs[i].d)}return joints}
function setTrans(idx,type,dur){var s=S();var a=(s&&s.clips)||[];if(!a[idx]){return}try{a[idx].transition={type:type,dur:dur};saveE()}catch(e){}}
function saveE(){try{if(typeof save==='function'){save()}}catch(e){}}
function r1(n){return Math.round(n*10)/10}
function dl(name,text){try{var b=new Blob([text],{type:'text/plain'});var u=URL.createObjectURL(b);var a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},800);log('download started - '+name,true)}catch(e){log('download blocked, '+e.message)}}
function wipe(){if(!needClips()){return}
 var cs=clips();var dur=Math.min(0.5,Math.max(0.25,cs.length>8?0.3:0.45));
 for(var i=1;i<cs.length;i++){setTrans(i,'wipe',dur)}
 log('WIPE - '+Math.max(0,cs.length-1)+' boundary(ies) set to wipe '+r1(dur)+'s, direction left-to-right, hard 3px white rim on the leading edge',true);
 log('WIPE - keep wipes under 0.5s: on a short every transition over half a second reads as a scene change, not a cut',true);
 log('WIPE - one direction per edit: flip directions mid-video and the eye restarts every time',true)}
function slide(){if(!needClips()){return}
 var cs=clips();
 log('SLIDE - push style: clip A exits at full speed while B enters at full speed, one rigid strip, never two separate moves',true);
 log('SLIDE - match slide direction to motion inside the clips: subject runs right, the next frame slides in from the right',true);
 log('SLIDE - ease: cubic in-out for long clips, expo out for fast edits; add a 4% dark shadow on the leading edge for depth',true)}
function zoomBlur(){if(!needClips()){return}
 var cs=clips();var fast=cs.length>8;
 log('ZOOM BLUR - A scales up to 1.55x fading out while B starts at 0.82x scaling in, blur 10-12px at peak, never both sharp',true);
 log('ZOOM BLUR - reserve for impact moments only: '+Math.min(3,Math.max(1,Math.floor(cs.length/4)))+' of '+Math.max(0,cs.length-1)+' boundary(ies) max on a '+r1(runtime())+'s edit',true);
 log('ZOOM BLUR - blur direction matches scale: zoom-in blurs outward, punch-in blurs in the same direction the frame moves',true)}
function glitch(){if(!needClips()){return}
 log('GLITCH - 12 horizontal slices, each slice flickers between clip A and B every frame, driven by a seeded 24fps rand so it replays identically',true);
 log('GLITCH - envelope the intensity with sin(pi x p): zero at both ends, full chaos mid-transition, 2-4 frame bursts total',true);
 log('GLITCH - pair with an RGB channel split of 2-3px on the mid frames, and one low sub-bass hit at the cut point',true)}
function whip(){if(!needClips()){return}
 var cs=clips();
 log('WHIP PAN - A slides off with expo-out easing while B slides in with expo-in, 1.08x scale to hide edge gaps',true);
 log('WHIP PAN - sell it with 4 ghost copies trailing at 12% opacity in the move direction, motion blur you can render without a plugin',true);
 log('WHIP PAN - direction must carry across the cut: out to the right, in from the right. '+Math.max(0,cs.length-1)+' boundary(ies) available',true)}
function spin(){if(!needClips()){return}
 log('SPIN - pivot center, A rotates 90 degrees out scaling to 0.72, B counter-rotates in, ease in-out-back for the snap',true);
 log('SPIN - 90 degrees max per spin on a vertical short: quarter turns read intentional, half turns read as an error',true);
 log('SPIN - budget: one spin per edit as a section break, never as a rhythm cut',true)}
function ink(){if(!needClips()){return}
 log('INK REVEAL - 26 seeded blobs grow in sequence across the incoming clip, radius eased per-blob so the reveal sweeps center-out',true);
 log('INK REVEAL - mask blobs with a slight soft edge (2px blur on the mask canvas) or the reveal reads as hard circles',true);
 log('INK REVEAL - total reveal 0.6-0.9s: longer hides your next clip, shorter reads as a blink',true)}
function leak(){if(!needClips()){return}
 log('LIGHT LEAK - two additive gradients (orange from left, magenta from right) sweep across while A crossfades to B underneath',true);
 log('LIGHT LEAK - peak at the midpoint only, sin(pi x p) envelope: the leak is a flash, not a constant tint',true);
 log('LIGHT LEAK - screen or lighten blend on the gradients, 55% radius max, cap opacity at 0.5 so the grade underneath stays yours',true)}
function splice(){if(!needClips()){return}
 var cs=clips();
 log('FILM SPLICE - 1-frame black cut at the exact midpoint plus 3 thin black bars top, jitter plus-or-minus 2px the frames before the cut',true);
 log('FILM SPLICE - the jitter must run at 24fps steps so it flickers like real projector weave, not a smooth shake',true);
 log('FILM SPLICE - best on '+Math.min(2,Math.max(1,Math.floor(cs.length/6)))+' boundary(ies) of '+r1(runtime())+'s: it is a chapter mark, not a transition',true)}
function sheet(){if(!needClips()){return}
 var cs=clips();var js=joints();var L=[];
 L.push('TRANSITION SHEET - '+cs.length+' clips, '+js.length+' boundaries, '+r1(runtime())+'s runtime');
 var i;for(i=0;i<js.length;i++){
  var tr=(cs[i+1].c&&cs[i+1].c.transition)||null;
  L.push('boundary '+(i+1)+' @ '+r1(js[i])+'s: '+((tr&&tr.type)?(tr.type+' '+r1(tr.dur||0.4)+'s'):'hard cut (default)'))}
 L.push('rules: hard cut is the default, one styled transition per section, nothing over 0.5s');
 L.push('stacking: style + sound - whip needs whoosh, glitch needs the hit, splice needs projector rattle');
 dl('transition-sheet.txt',L.join('\n'))}
function mount(){
 if(document.getElementById('f47b1')){return}
 var card=document.createElement('div');card.className='card';card.id='f47card';
 var h=document.createElement('h2');h.textContent='TRANSITION LAB';card.appendChild(h);
 var r1r=mkRow();r1r.appendChild(mkBtn('WIPE',wipe,'f47b1'));r1r.appendChild(mkBtn('SLIDE',slide,'f47b2'));card.appendChild(r1r);
 var r2=mkRow();r2.appendChild(mkBtn('ZOOM BLUR',zoomBlur,'f47b3'));r2.appendChild(mkBtn('GLITCH',glitch,'f47b4'));card.appendChild(r2);
 var r3=mkRow();r3.appendChild(mkBtn('WHIP PAN',whip,'f47b5'));r3.appendChild(mkBtn('SPIN',spin,'f47b6'));card.appendChild(r3);
 var r4=mkRow();r4.appendChild(mkBtn('INK REVEAL',ink,'f47b7'));r4.appendChild(mkBtn('LIGHT LEAK',leak,'f47b8'));card.appendChild(r4);
 var r5=mkRow();r5.appendChild(mkBtn('FILM SPLICE',splice,'f47b9'));r5.appendChild(mkBtn('TRANSITION SHEET .TXT',sheet,'f47b10'));card.appendChild(r5);
 var note=document.createElement('div');note.className='note';note.id='f47note';note.textContent='transition lab sets boundary transitions: wipe, slide, zoom blur, glitch, whip pan, spin, ink reveal, light leak, film splice and a downloadable transition sheet.';
 card.appendChild(note);
 var hs=document.querySelectorAll('.card h2'),anchor=null;
 for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('AUDIO LAB')>=0){anchor=hs[i].parentElement;break}}
 if(anchor){if(anchor.nextSibling){anchor.parentElement.insertBefore(card,anchor.nextSibling)}else{anchor.parentElement.appendChild(card)}}
 else{var ap=document.querySelector('#panelcol')||document.body;ap.appendChild(card)}
 log('transition lab live - wipe, slide, zoom blur, glitch, whip pan, spin, ink reveal, light leak, film splice, transition sheet');
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',mount)}else{mount()}
})();
