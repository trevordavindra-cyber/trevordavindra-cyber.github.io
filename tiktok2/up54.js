'use strict';
// up54.js - PHASE 48 CAPTION LAB (Nov 24 2026)
// caption style guide, caption timing, keyword highlight, safe zone captions,
// hook text, cta captions, emoji rules, caption retype, accessibility pass,
// downloadable caption sheet
(function(){
if(window.__tk2up54){return}window.__tk2up54=1;
function mkBtn(t,fn,id){var b=document.createElement('button');b.className='btn';b.textContent=t;if(id){b.id=id}b.onclick=fn;return b}
function mkRow(){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap='6px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function S(){try{return window.S||window.state||window.APPSTATE||{}}catch(e){return {}}}
function clipDur(c){var st=parseFloat(c.start),en=parseFloat(c.end);if(!isFinite(st)||!isFinite(en)){return 0}return Math.max(0,(en-st))/(c.speed||1)}
function clips(){var s=S();var a=(s&&s.clips)||[];var out=[],t=0;for(var i=0;i<a.length;i++){var d=clipDur(a[i]);if(d>0.05){t+=d;out.push({c:a[i],d:d,t0:t})}}for(var j=0;j<out.length;j++){out[j].t0-=out[j].d}return out}
function runtime(){var cs=clips();if(!cs.length){return 0}return cs[cs.length-1].t0+cs[cs.length-1].d}
function needClips(){if(!clips().length){log('caption lab: add clips to the timeline first');return false}return true}
function r1(n){return Math.round(n*10)/10}
function genre(){var s=S();var st=(s.style||s.editStyle||'').toString().toLowerCase();var txt=st+' '+JSON.stringify(s.clips||[]).toLowerCase();
 if(txt.indexOf('phonk')>=0){return 'phonk'}if(txt.indexOf('sport')>=0||txt.indexOf('basketball')>=0||txt.indexOf('gym')>=0){return 'sport'}
 if(txt.indexOf('anime')>=0){return 'anime'}if(txt.indexOf('blend')>=0){return 'blend'}return st||'general'}
function capText(){var s=S();var a=s.captions||s.caps||s.captionLines||[];var out='';if(typeof a==='string'){out=a}else{for(var i=0;i<a.length;i++){var v=a[i];out+=(typeof v==='string'?v:(v&&v.text)||'')+' '}}return out.replace(/\s+/g,' ').replace(/^\s+|\s+$/g,'')}

// ---- 1 CAPTION STYLE GUIDE ----
function cstyle(){
 var g=genre();
 log('CAPTION STYLE GUIDE - genre read: '+g,true);
 log('pick ONE font + ONE highlight color and never change it mid-account; recognition beats variety',true);
 log('all-caps only for hook text; sentence case for body captions - full caps everywhere reads as shouting',true);
 log('max 4 words per caption card at 9:16; viewers read about 3 words per 0.2s so keep cards under 0.8s');
 log(g==='phonk'?'phonk: white impact caps, one red accent word per card, hard cut on every card change'
  :g==='sport'?'sport: bold condensed caps, yellow highlight on player and team names, cards timed to whistle moments'
  :g==='anime'?'anime: clean sans with thin outline, dialogue splits at each line so cards breathe'
  :'general: one sans font, one accent color, cards change on the beat not mid-word',true);
}

// ---- 2 CAPTION TIMING ----
function ctime(){
 if(!needClips()){return}
 var cs=clips(),rt=runtime(),per=cs.length?r1(rt/cs.length):0;
 log('CAPTION TIMING - '+cs.length+' clips, '+r1(rt)+'s total, avg clip '+per+'s',true);
 log('rule: one caption card per cut, never spanning two cuts; card length 0.4-1.2s',true);
 log('sync check: the first word of each card should land within 2 frames of its cut');
 log('at '+per+'s avg clips, cap card count near '+Math.min(40,Math.round(rt/0.7))+' - more splits attention');
 log('loop trick: repeat the last card as the first card so the loop point never shows a caption jump');
}

// ---- 3 KEYWORD HIGHLIGHT ----
function ckey(){
 log('KEYWORD HIGHLIGHT - one keyword per card, colored or boxed, nothing else styled',true);
 log('color pick: accent color from your cover art; if none, #FFE94A yellow or #FF3B5C red both hold on any footage',true);
 log('words worth highlighting: numbers, money amounts, names, action verbs - never the/a/and');
 log('scale pop: highlight word 1.15x card size for 0.1s on entry; slower reads as decoration');
 log('search bonus: the highlighted word doubles as your caption-text keyword - keep them identical');
}

// ---- 4 SAFE ZONE CAPTIONS ----
function csafe(){
 log('SAFE ZONE CAPTIONS - TikTok UI eats: right rail ~15% width (icons), bottom ~20% (handle+sound), top ~10%',true);
 log('keep all caption text inside the middle 70% width and 65% height band; center-block, never full-bleed',true);
 log('worst offender: bottom-center captions die under the sound bar - lift one thumb-height above the bottom edge');
 log('check duet and stitch mode too: the middle band works for both, side-anchored text does not');
 log('test at 390px width before posting; what reads on desktop is often 2px too thin on a phone');
}

// ---- 5 HOOK TEXT ----
function chook(){
 var g=genre();
 log('HOOK TEXT - first frame carries 4 words max, readable in 0.3s, top third of frame',true);
 log('pattern bank: wait for it, nobody does this, this took X hours, you are doing it wrong');
 log(g==='phonk'?'phonk hook: single word + year, e.g. SIGMA 2026, glitch-in on the first bass hit'
  :g==='sport'?'sport hook: score or stat, e.g. 0.4 SECONDS LEFT, over the first motion frame'
  :g==='anime'?'anime hook: character quote, no spoiler, 2 lines max, fade in over the episode frame'
  :'general hook: a question or a promise - how to X in 30s beats X tutorial',true);
 log('keep hook text on screen at least 0.8s; flashing it for 2 frames wastes the slot');
}

// ---- 6 CTA CAPTION ----
function ccta(){
 var g=genre();
 log('CTA CAPTION - one ask per video, placed in the last 15% of runtime',true);
 log('rank of what actually moves: follow > comment prompt > share > link-in-bio',true);
 log(g==='phonk'?'phonk cta: part 2? comment bait - comment counts push loop-restart retention'
  :g==='sport'?'sport cta: rate the play 1-10 - number answers are the cheapest comments to get'
  :g==='anime'?'anime cta: which episode next? - list questions, never yes/no'
  :'general cta: save this for later - saves weigh more than likes in the 2026 ranking stack',true);
 log('write the CTA as a caption card AND a pinned comment; same words both places is fine');
}

// ---- 7 EMOJI RULES ----
function cemo(){
 log('EMOJI RULES - max 1 emoji per caption card, only as punctuation for the keyword',true);
 log('placement: end of card, never mid-word and never leading - a leading emoji delays reading the words',true);
 log('stack rule for the caption text below the video: 3 emojis max, no emoji-only lines, no border walls');
 log('skip fire, skull and 100 - saturated to noise on this niche; pick one fresh emoji and own it');
 log('accessibility: screen readers read every emoji aloud, so one per card is the ceiling');
}

// ---- 8 CAPTION RETYPE ----
function cretype(){
 if(!needClips()){return}
 var rt=runtime(),txt=capText(),words=txt?txt.split(' ').length:0;
 var wps=rt>0?r1(words/rt):0;
 log('CAPTION RETYPE - '+words+' caption words over '+r1(rt)+'s = '+wps+' words/sec',true);
 log(wps>3?'too dense: viewers drop past 2.5 wps - split cards or cut half the words'
  :wps>0&&wps<1.2?'too sparse: under 1.2 wps reads as filler - merge cards or add the spoken line'
  :words===0?'no caption lines found yet - tap FIT TO CLIPS on the captions track first'
  :'density is in the 1.2-2.5 wps sweet spot',true);
 log('retype order: cut filler words first, split cards over 4 words, then re-time to the cuts');
 log('read-aloud test: if you cannot say a card in its on-screen time, viewers cannot read it either');
}

// ---- 9 ACCESSIBILITY PASS ----
function cacces(){
 log('ACCESSIBILITY PASS - every caption card must survive sound-off viewing on its own',true);
 log('contrast: white text needs a 40% black outline or dark plate; thin white on bright sky is unreadable',true);
 log('min size 24px at 1080x1920; if you squint at the preview, viewers already scrolled');
 log('no text-only info: color and icons must not be the only carrier of meaning (1 in 12 men are color-blind)');
 log('caption the sound too: [beat drop], [whistle], [rain] - one bracket per video is enough, not every beat');
 log('keep captions clear of burned-in subtitles; two text layers on screen reads as an error');
}

// ---- 10 CAPTION SHEET .TXT ----
function csheet(){
 var g=genre(),cs=clips(),L=[];
 L.push('CAPTION SHEET - '+new Date().toLocaleString());
 L.push('GENRE: '+g);
 L.push('');
 L.push('STYLE: one font + one accent color, sentence case body, caps hooks only');
 L.push('SAFE ZONE: middle 70% w x 65% h, nothing bottom-center under the sound bar');
 L.push('TIMING: one card per cut, 0.4-1.2s each, first word within 2 frames of the cut');
 L.push('EMOJI: max 1 per card at the end, none leading');
 L.push('CTA: one ask, last 15% of runtime, repeated as pinned comment');
 L.push('');
 if(cs.length){
  L.push('PROJECT: '+cs.length+' clips, '+r1(runtime())+'s total');
  for(var j=0;j<cs.length;j++){
   L.push('clip '+(j+1)+' ('+r1(cs[j].d)+'s): [card here - max 4 words, 1 keyword]');
  }
 } else {
  L.push('PROJECT: no clips on the timeline yet - card list below is blank');
 }
 L.push('');
 L.push('HOOK (first frame, 4 words max): ____________________');
 L.push('CTA (one ask): ____________________');
 dl('caption-sheet.txt',L.join('\n'));
}

// dl fallback (mirrors up53)
function dl(name,text){try{var b=new Blob([text],{type:'text/plain'});var u=URL.createObjectURL(b);var a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},800);log('download started - '+name,true)}catch(e){log('download blocked, '+e.message)}}

function mount(){
 if(document.getElementById('f54b1')){return}
 var card=document.createElement('div');card.className='card';card.id='f54card';
 var h=document.createElement('h2');h.textContent='CAPTION LAB';card.appendChild(h);
 var r1r=mkRow();r1r.appendChild(mkBtn('CAPTION STYLE GUIDE',cstyle,'f54b1'));r1r.appendChild(mkBtn('CAPTION TIMING',ctime,'f54b2'));card.appendChild(r1r);
 var r2=mkRow();r2.appendChild(mkBtn('KEYWORD HIGHLIGHT',ckey,'f54b3'));r2.appendChild(mkBtn('SAFE ZONE CAPTIONS',csafe,'f54b4'));card.appendChild(r2);
 var r3=mkRow();r3.appendChild(mkBtn('HOOK TEXT',chook,'f54b5'));r3.appendChild(mkBtn('CTA CAPTION',ccta,'f54b6'));card.appendChild(r3);
 var r4=mkRow();r4.appendChild(mkBtn('EMOJI RULES',cemo,'f54b7'));r4.appendChild(mkBtn('CAPTION RETYPE',cretype,'f54b8'));card.appendChild(r4);
 var r5=mkRow();r5.appendChild(mkBtn('ACCESSIBILITY PASS',cacces,'f54b9'));r5.appendChild(mkBtn('CAPTION SHEET .TXT',csheet,'f54b10'));card.appendChild(r5);
 var note=document.createElement('div');note.className='note';note.id='f54note';note.textContent='caption lab is the text-overlay side: caption style guide, caption timing, keyword highlight, safe zone captions, hook text, cta captions, emoji rules, caption retype, accessibility pass and a downloadable caption sheet.';
 card.appendChild(note);
 var hs=document.querySelectorAll('.card h2'),anchor=null;
 for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('ANALYTICS LAB')>=0){anchor=hs[i].parentElement;break}}
 if(anchor){if(anchor.nextSibling){anchor.parentElement.insertBefore(card,anchor.nextSibling)}else{anchor.parentElement.appendChild(card)}}
 else{var ap=document.querySelector('#panelcol')||document.body;ap.appendChild(card)}
 log('caption lab live - style guide, timing, keyword highlight, safe zones, hook text, cta captions, emoji rules, retype, accessibility pass, caption sheet');
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',mount)}else{mount()}
})();
