'use strict';
// up44.js - PHASE 38 TEXT LAB (Nov 24 2026)
// safe zone check, read time check, font pairing, text timing, caption pop spec,
// line splitter, sticker plan, title card spec, text contrast check, text sheet
(function(){
if(window.__tk2up44){return}window.__tk2up44=1;
function mkBtn(t,fn,id){var b=document.createElement('button');b.className='btn';b.textContent=t;if(id){b.id=id}b.onclick=fn;return b}
function mkRow(){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap='6px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function saveE(){try{if(typeof save==='function'){save()}}catch(e){}}
function S(){try{return window.S||window.state||window.APPSTATE||{}}catch(e){return {}}}
function clipDur(c){var st=parseFloat(c.start),en=parseFloat(c.end);if(!isFinite(st)||!isFinite(en)){return 0}return Math.max(0,(en-st))/(c.speed||1)}
function clips(){var s=S();var a=(s&&s.clips)||[];var out=[],t=0;for(var i=0;i<a.length;i++){var d=clipDur(a[i]);if(d>0.05){t+=d;out.push({c:a[i],d:d,t0:t})}}for(var j=0;j<out.length;j++){out[j].t0-=out[j].d}return out}
function genre(){var s=S();var cs=clips();var g=((s.genre||s.style||(cs[0]?cs[0].c.style:'')||'')+'').toUpperCase()||'EDIT';return g}
function caps(){var s=S();return (s&&(s.captions||s.caps||s.subtitle))||[]}
function needClips(){if(!clips().length){log('text lab: add clips to the timeline first');return false}return true}
function dl(name,text){try{var b=new Blob([text],{type:'text/plain'});var u=URL.createObjectURL(b);var a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},800);log('download started - '+name,true)}catch(e){log('download blocked, '+e.message)}}
function r1(n){return Math.round(n*10)/10}
function wc(t){return ((t||'')+'').trim().split(/\s+/).filter(Boolean).length}
function splitLine(t,max){var w=(t||'').split(/\s+/);var out=[],cur='';for(var i=0;i<w.length;i++){if((cur+' '+w[i]).trim().length>max&&cur){out.push(cur.trim());cur=w[i]}else{cur=(cur+' '+w[i]).trim()}}if(cur){out.push(cur.trim())}return out}
function safeZone(){if(!needClips()){return}
 var cs=clips();var tot=cs[cs.length-1].t0+cs[cs.length-1].d;
 log('SAFE ZONE CHECK - 9:16 box 1080x1920: keep all text inside x 108-972 (10% side margins), y 288-1500 (15% top, 22% bottom)',true);
 log('SAFE ZONE CHECK - right rail (like/share/comment icons) eats x 900-1080 for the full runtime '+r1(tot)+'s, so right-align nothing',true);
 log('SAFE ZONE CHECK - bottom y 1500-1920 is TikTok caption territory: your own captions there get doubled up, park them y 1180-1380',true);
 var bad=0;for(var i=0;i<cs.length;i++){if(cs[i].d<1.2){bad++}}
 if(bad){log('SAFE ZONE CHECK - '+bad+' clip(s) under 1.2s: any text on them reads as a flash, skip text or extend the hold',true)}}
function readTime(){if(!needClips()){return}
 var cs=clips();var slow=[];
 for(var i=0;i<cs.length;i++){var words=wc((cs[i].c.text||cs[i].c.caption||cs[i].c.label||'')+ '');if(!words){continue}
  var need=words*0.4;var have=cs[i].d;
  if(have<need){slow.push({i:i+1,w:words,need:r1(need),have:r1(have)})}}
 if(!slow.length){log('READ TIME CHECK - no on-screen text data on the clips, so run the math on your overlays: 5 words need 2s minimum on screen',true)}
 for(var j=0;j<slow.length&&j<5;j++){log('READ TIME CHECK - clip '+slow[j].i+': '+slow[j].w+' words but only '+slow[j].have+'s on screen, needs '+slow[j].need+'s - trim words to 3-5 or hold the clip',true)}
 log('READ TIME CHECK - rule: 0.4s per word, round up, and never let a line outlive the cut it sits on by more than 0.2s',true)}
function fontPair(){var g=genre();var h=null,b=null;
 if(g.indexOf('DRAMA')>=0||g.indexOf('STORY')>=0){h='serif (Playfair/Freight)';b='humanist sans (Inter)'}
 else if(g.indexOf('PHONK')>=0||g.indexOf('SPORT')>=0||g.indexOf('FOOTBALL')>=0){h='condensed (Anton/Bebas)';b='mono (JetBrains Mono) for stats'}
 else if(g.indexOf('ANIME')>=0){h='heavy rounded (M PLUS Rounded/Bangers)';b='clean sans (Noto Sans)'}
 else if(g.indexOf('TECH')>=0||g.indexOf('CODING')>=0){h='geometric sans (Space Grotesk)';b='mono (IBM Plex Mono)'}
 else{h='grotesque bold (Archivo Black)';b='neutral sans (Inter)'}
 log('FONT PAIRING - '+g.toLowerCase()+' reads best as headline '+h+' + body '+b,true);
 log('FONT PAIRING - one pair per video: two display fonts fight each other, sizes stay 2.5x apart (e.g. 64px headline, 26px body)',true)}
function textTiming(){if(!needClips()){return}
 var cs=clips();var tot=cs[cs.length-1].t0+cs[cs.length-1].d;
 var shown=0;
 for(var i=0;i<cs.length&&shown<4;i++){log('TEXT TIMING - cut at '+r1(cs[i].t0+cs[i].d)+'s: text enters 0.15s before the cut, exits 0.1s after the next one, never straddles two cuts blind',true);shown++}
 log('TEXT TIMING - max 2 text layers on screen at once (headline + caption), runtime '+r1(tot)+'s means about '+Math.max(2,Math.round(tot/2.5))+' text beats total',true)}
function captionPop(){
 log('CAPTION POP - pop-in 0.2s after the clip start (never frame 0, the cut hides it), scale 0.9 to 1.0 over 150ms ease-out, drop shadow 2px',true);
 log('CAPTION POP - word-highlight style: active word fills color, spoken pace from your caption spans, one line max 24 chars',true);
 var c=caps();if(c.length){log('CAPTION POP - '+c.length+' caption span(s) in the project already, keep pops aligned to them, do not double-render',true)}
 else{log('CAPTION POP - project has no captions yet: run the caption lab first, then this spec sits on top',true)}}
function lineSplit(){var cs=clips();var longest='',who=0;
 for(var i=0;i<cs.length;i++){var t=(cs[i].c.text||cs[i].c.caption||cs[i].c.label||'')+'';if(t.length>longest.length){longest=t;who=i+1}}
 if(longest.length>20){var parts=splitLine(longest,20);log('LINE SPLIT - clip '+who+' line is '+longest.length+' chars, split it: '+parts.join(' / '),true)}
 else if(longest){log('LINE SPLIT - longest line is '+longest.length+' chars, under the 20-char ceiling, good',true)}
 else{log('LINE SPLIT - rule: any line over 20 chars splits into two lines at the nearest space, max 3 lines, 16px leading',true)}}
function stickerPlan(){if(!needClips()){return}
 var cs=clips();var holds=[];
 for(var i=0;i<cs.length;i++){if(cs[i].d>3){holds.push({i:i+1,d:r1(cs[i].d)})}}
 if(holds.length){for(var j=0;j<holds.length&&j<4;j++){log('STICKER PLAN - clip '+holds[j].i+' runs '+holds[j].d+'s: one sticker or emoji punch every 1.5s, alternate left/right of the subject, never center',true)}}
 else{log('STICKER PLAN - no clip over 3s, so no sticker layer needed - stickers only earn their place when text sits still for 3s+',true)}
 log('STICKER PLAN - cap it at 3 stickers total and keep them out of the right rail (x 900-1080)',true)}
function titleCard(){if(!needClips()){return}
 var s=S();var t=(s.title||s.name||'')+'';
 var txt=t.length?t:(genre().toLowerCase()+' edit, 30 chars max, front-load the hook');
 if(t.length>30){log('TITLE CARD - your title is '+t.length+' chars, trim to 30 - only the first 3 words read on a phone',true)}
 log('TITLE CARD - text "'+txt+'", on screen 0.2s-2.8s, upper third (y 320-520), headline font at 64px, white with black outline 4px',true);
 log('TITLE CARD - exit before the first cut lands so the payoff clip starts clean',true)}
function contrast(){var s=S();var p=null;try{p=s&&JSON.parse(localStorage.getItem('tk2palette')||'null')}catch(e){}
 if(p&&p.fg&&p.bg){log('TEXT CONTRAST - palette on file: text '+p.fg+' on '+p.bg+' - keep both light or both dark off, aim 4.5:1 minimum, 7:1 for captions',true)}
 else{log('TEXT CONTRAST - no palette saved: white text + black outline 4px passes on any footage; colored text needs a 70% dark scrim behind it',true)}
 log('TEXT CONTRAST - check the busiest frame: pause on the brightest clip and confirm every glyph still reads, that frame is your worst case',true)}
function textSheet(){if(!needClips()){return}
 var cs=clips();var g=genre();var tot=cs[cs.length-1].t0+cs[cs.length-1].d;
 var L=[];L.push('TEXT LAB REPORT');L.push('generated '+new Date().toISOString());L.push('runtime '+r1(tot)+'s, cuts '+cs.length+', genre '+g.toLowerCase());L.push('');
 L.push('SAFE ZONE');L.push('text box x 108-972, y 288-1500; right rail x 900-1080 hands off; own captions sit y 1180-1380');L.push('');
 L.push('READ TIME');L.push('0.4s per word, 5 words = 2s minimum on screen, never outlive the cut by 0.2s+');L.push('');
 L.push('FONTS');L.push('headline + body pair per genre, one pair per video, sizes 2.5x apart');L.push('');
 L.push('TITLE CARD');L.push('0.2s-2.8s, upper third, 64px, 30 chars max, exits before cut 1 payoff');L.push('');
 L.push('NEXT');L.push('safe zones first, then title card, then caption pops; sheet any change');
 dl('text-sheet.txt',L.join('\n'))}
function mount(){
 if(document.getElementById('f44b1')){return}
 var card=document.createElement('div');card.className='card';card.id='f44card';
 var h=document.createElement('h2');h.textContent='TEXT LAB';card.appendChild(h);
 var r1r=mkRow();r1r.appendChild(mkBtn('SAFE ZONE CHECK',safeZone,'f44b1'));r1r.appendChild(mkBtn('READ TIME CHECK',readTime,'f44b2'));card.appendChild(r1r);
 var r2=mkRow();r2.appendChild(mkBtn('FONT PAIRING',fontPair,'f44b3'));r2.appendChild(mkBtn('TEXT TIMING',textTiming,'f44b4'));card.appendChild(r2);
 var r3=mkRow();r3.appendChild(mkBtn('CAPTION POP',captionPop,'f44b5'));r3.appendChild(mkBtn('LINE SPLIT',lineSplit,'f44b6'));card.appendChild(r3);
 var r4=mkRow();r4.appendChild(mkBtn('STICKER PLAN',stickerPlan,'f44b7'));r4.appendChild(mkBtn('TITLE CARD',titleCard,'f44b8'));card.appendChild(r4);
 var r5=mkRow();r5.appendChild(mkBtn('TEXT CONTRAST',contrast,'f44b9'));r5.appendChild(mkBtn('TEXT SHEET .TXT',textSheet,'f44b10'));card.appendChild(r5);
 var note=document.createElement('div');note.className='note';note.id='f44note';note.textContent='text lab plans every word on screen: a safe zone check against the tiktok ui, a read time check, genre font pairing, text timing on cuts, a caption pop spec, a line splitter, a sticker plan, a title card spec, a text contrast check and a downloadable text sheet.';
 card.appendChild(note);
 var hs=document.querySelectorAll('.card h2'),anchor=null;
 for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('FX LAB')>=0){anchor=hs[i].parentElement;break}}
 if(anchor){if(anchor.nextSibling){anchor.parentElement.insertBefore(card,anchor.nextSibling)}else{anchor.parentElement.appendChild(card)}}
 else{var ap=document.querySelector('#panelcol')||document.body;ap.appendChild(card)}
 log('text lab live - safe zone check, read time check, font pairing, text timing, caption pop spec, line splitter, sticker plan, title card spec, text contrast check, text sheet');
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',mount)}else{mount()}
})();