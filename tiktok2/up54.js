'use strict';
// up54.js - PHASE 48 CAPTION LAB (Nov 24 2026)
// 10 tools for on-screen caption + text-overlay work: style guide, timing,
// keyword highlighting, TikTok safe zones, hook text, CTA captions, emoji
// rules, retype pass, accessibility pass, downloadable caption sheet.
(function(){
  if(window.__tk2up54)return; window.__tk2up54=1;

  function G(){return (typeof genre==='function')?genre():'general';}
  function clips(){return (window.state&&state.clips)?state.clips:null;}
  function needClips(){log('add clips to the timeline first',true);return true;}

  // ---- f54b1 CAPTION STYLE GUIDE ----
  function f54b1(){
    var g=G();
    log('CAPTION STYLE GUIDE - genre read: '+g,true);
    log('pick ONE font + ONE highlight color and never change it mid-account; recognition beats variety',true);
    log('all-caps only for hook text; sentence case for body captions - full caps everywhere reads as shouting',true);
    log('max 4 words per caption card at 9:16; viewers read ~3 words per 0.2s so keep cards under 0.8s');
    log(g==='phonk'?'phonk: white impact-style caps, one red accent word per card, hard cut on every card change'
      :g==='sport'?'sport: bold condensed caps, yellow highlight on player/team names, cards timed to whistle moments'
      :g==='anime'?'anime: clean sans with thin outline, dialogue splits at each line so cards breathe'
      :'general: one sans font, one accent color, cards change on the beat not mid-word',true);
  }

  // ---- f54b2 CAPTION TIMING (clip-dependent) ----
  function f54b2(){
    var cs=clips(); if(!cs||!cs.length){needClips();return;}
    var tot=0; for(var i=0;i<cs.length;i++)tot+=(cs[i].dur||0);
    var per=cs.length?Math.round(tot/cs.length*10)/10:0;
    log('CAPTION TIMING - '+cs.length+' clips, total '+tot.toFixed(1)+'s, avg clip '+per+'s',true);
    log('rule: one caption card per beat cut, never spanning two cuts; card length 0.4-1.2s',true);
    log('sync check: the FIRST word of each card should land within 2 frames of the cut');
    log('on '+per+'s avg clips, cap card count near '+Math.min(40,Math.round(tot/0.7))+' - more than that splits attention');
    log('loop trick: repeat the last card as the first card so the loop point never shows a caption jump');
  }

  // ---- f54b3 KEYWORD HIGHLIGHT ----
  function f54b3(){
    log('KEYWORD HIGHLIGHT - one keyword per card, colored or boxed, nothing else styled',true);
    log('color pick: accent color from your cover art; if none, #FFE94A yellow or #FF3B5C red both hold on any footage',true);
    log('words worth highlighting: numbers, money amounts, names, verbs of action - never "the/a/and"');
    log('scale pop: highlight word 1.15x card size for 0.1s on entry; anything slower stops reading as emphasis');
    log('search bonus: the highlighted word doubles as your caption-text keyword - keep them identical');
  }

  // ---- f54b4 SAFE ZONE CAPTIONS ----
  function f54b4(){
    log('SAFE ZONE CAPTIONS - TikTok UI eats: right rail ~15% width (icons), bottom ~20% (handle+sound), top ~10%',true);
    log('keep all caption text inside the middle 70% width and 65% height band; center-block, never full-bleed',true);
    log('worst offender: bottom-center captions die under the sound bar - lift them one thumb-height above the bottom edge');
    log('check duet/stitch mode too: same middle band works for both, side-anchored text does not');
    log('test at 390px width before posting; what is readable on desktop is often 2px too thin on phone');
  }

  // ---- f54b5 HOOK TEXT ----
  function f54b5(){
    var g=G();
    log('HOOK TEXT - first frame carries 4 words max, readable in 0.3s, top third of frame',true);
    log('pattern bank: "wait for it", "nobody does this", "this took X hours", "you are doing it wrong"');
    log(g==='phonk'?'phonk hook: single word + year, e.g. "SIGMA 2026", glitch-in on the first bass hit'
      :g==='sport'?'sport hook: score or stat, e.g. "0.4 SECONDS LEFT", over the first motion frame'
      :g==='anime'?'anime hook: character quote, no spoiler, 2 lines max, fade in over episode frame'
      :'general hook: a question or a promise - "how to X in 30s" outperforms "X tutorial"',true);
    log('keep hook text on screen at least 0.8s; flashing it for 2 frames wastes the whole slot');
  }

  // ---- f54b6 CTA CAPTION ----
  function f54b6(){
    var g=G();
    log('CTA CAPTION - one ask per video, placed in the last 15% of runtime',true);
    log('rank of what actually moves: follow > comment prompt > share > link-in-bio',true);
    log(g==='phonk'?'phonk cta: "part 2?" comment bait - comment counts push the loop-restart retention curve'
      :g==='sport'?'sport cta: "rate the play 1-10" - number answers are the cheapest comment to get'
      :g==='anime'?'anime cta: "which episode next?" - list questions, never yes/no'
      :'general cta: "save this for later" - saves weigh more than likes in the 2026 ranking stack',true);
    log('write the CTA as a caption card AND a pinned comment; same words both places is fine');
  }

  // ---- f54b7 EMOJI RULES ----
  function f54b7(){
    log('EMOJI RULES - max 1 emoji per caption card, only as punctuation for the keyword',true);
    log('placement: end of card, never mid-word and never leading - a leading emoji delays reading the words',true);
    log('stack rule for the caption TEXT (below video): 3 emojis max, no emoji-only lines, no border walls');
    log('skip: fire/skull/100 are saturated to the point of noise on this niche - pick one fresh emoji and own it');
    log('accessibility: screen readers read every emoji aloud, so an emoji per word is hostile - keep it to one');
  }

  // ---- f54b8 CAPTION RETYPE (clip-dependent) ----
  function f54b8(){
    var cs=clips(); if(!cs||!cs.length){needClips();return;}
    var tot=0,words=0;
    for(var i=0;i<cs.length;i++){tot+=(cs[i].dur||0); if(cs[i].cap)words+=String(cs[i].cap).split(/\s+/).filter(Boolean).length;}
    var wps=tot>0?Math.round(words/tot*10)/10:0;
    log('CAPTION RETYPE - word density '+wps+' words/sec across '+tot.toFixed(1)+'s',true);
    log(wps>3?'too dense: viewers drop at >2.5 wps - split cards or cut half the words'
      :wps<1.2?'too sparse: fewer than 1.2 wps reads as filler - merge cards or add the spoken line'
      :'density is in the 1.2-2.5 wps sweet spot',true);
    log('retype order: cut filler words first, then split cards that exceed 4 words, then re-time to cuts');
    log('read-aloud test: if you cannot say a card in its on-screen time, viewers cannot read it either');
  }

  // ---- f54b9 ACCESSIBILITY PASS ----
  function f54b9(){
    log('ACCESSIBILITY PASS - every caption card must survive sound-off viewing on its own',true);
    log('contrast: white text needs a 40% black outline or a dark plate; thin white on bright sky is unreadable',true);
    log('min size 24px at 1080x1920; if you must squint at the preview, viewers already scrolled');
    log('no text-only info: colors + icons must not be the only carrier of meaning (1 in 12 men are color-blind)');
    log('caption the SOUND too: [beat drop], [whistle], [rain] - one bracket per video is enough, not every beat');
    log('keep captions away from burned-in subtitles; two text layers on screen reads as an error');
  }

  // ---- f54b10 CAPTION SHEET .TXT ----
  function f54b10(){
    var cs=clips();
    var L=[];
    L.push('CAPTION SHEET - '+new Date().toLocaleString());
    L.push('GENRE: '+G());
    L.push('');
    L.push('STYLE: one font + one accent color, sentence case body, caps hooks only');
    L.push('SAFE ZONE: middle 70% w x 65% h, nothing bottom-center under the sound bar');
    L.push('TIMING: one card per beat cut, 0.4-1.2s each, first word within 2 frames of the cut');
    L.push('EMOJI: max 1 per card at the end, none leading');
    L.push('CTA: one ask, last 15% of runtime, repeated as pinned comment');
    L.push('');
    if(cs&&cs.length){
      var tot=0; for(var i=0;i<cs.length;i++)tot+=(cs[i].dur||0);
      L.push('PROJECT: '+cs.length+' clips, '+tot.toFixed(1)+'s total');
      for(var j=0;j<cs.length;j++){
        var d=cs[j].dur||0;
        L.push('clip '+(j+1)+' ('+d.toFixed(1)+'s): [write card here - max 4 words, 1 keyword]');
      }
    } else {
      L.push('PROJECT: no clips on the timeline yet - card list below is blank');
    }
    L.push('');
    L.push('HOOK (first frame, 4 words max): ____________________');
    L.push('CTA (one ask): ____________________');
    var txt=L.join('\n');
    dl('caption-sheet.txt',txt);
    log('caption-sheet.txt downloaded ('+txt.length+' chars)',true);
  }

  window.__f54b1=f54b1;window.__f54b2=f54b2;window.__f54b3=f54b3;window.__f54b4=f54b4;window.__f54b5=f54b5;
  window.__f54b6=f54b6;window.__f54b7=f54b7;window.__f54b8=f54b8;window.__f54b9=f54b9;window.__f54b10=f54b10;
  var ids=['f54b1','f54b2','f54b3','f54b4','f54b5','f54b6','f54b7','f54b8','f54b9','f54b10'];
  for(var m=0;m<ids.length;m++){
    var el=document.getElementById(ids[m]);
    if(el)el.addEventListener('click',window['__'+ids[m]]);
  }
})();
