'use strict';
/* up17.js - SHORTFORGE FORGE 18 CAPTION LAB (Nov 25 2026) */
(function(){
if(window.__sfup17){return;}
window.__sfup17=1;
function need(){if(!window.SCENES||!SCENES.length){glog('forge a script first (FORGE 18 tools need scenes)',0);return false}return true}
function glog(m,hl){try{step(m,hl)}catch(e){console.log('[forge18]',m)}}
function words(s){return String(s||'').trim().split(/\s+/).filter(Boolean)}
function mkBtn(id,label,fn){var b=document.createElement('button');b.id=id;b.textContent=label;b.style.cssText='background:#0b1418;border:1px solid #2de2ff;color:#eaffff;font:700 10px monospace;padding:6px 10px;margin:3px;cursor:pointer;border-radius:6px';b.addEventListener('click',function(){try{if(need())fn()}catch(e){glog('forge18 error: '+e.message,0)}});return b}
function dlB(txt,name){try{var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));a.download=name;a.style.display='none';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a)},200)}catch(e){glog('download blocked: '+e.message,0)}}
function title(){return String((window.META&&META.title)||'this topic')}
function tot(){var t=0;SDUR.forEach(function(d){t+=d});return t}
function textOf(s){return String((s&&(s.t||s.cap||s.text||s.vo||s.narration||s.line))||'')}
function wc(s){return words(textOf(s)).length}
function clean(s){return String(s||'').replace(/[^A-Za-z0-9'!?.,:;%\s-]/g,' ').replace(/\s+/g,' ').trim()}
var STOP={the:1,a:1,an:1,and:1,or:1,but:1,of:1,to:1,in:1,on:1,for:1,with:1,at:1,by:1,is:1,are:1,was:1,were:1,it:1,its:1,this:1,that:1,you:1,your:1,i:1,im:1,so:1,if:1,then:1,than:1,as:1,be:1,been:1,do:1,dont:1,not:1,no:1,what:1,when:1,how:1,why:1,who:1,they:1,their:1,them:1,we:1,our:1,my:1,me:1,he:1,she:1,his:1,her:1,from:1,up:1,out:1,about:1,just:1,like:1,get:1,got:1,will:1,can:1,has:1,have:1,had:1};
function keyw(s){var w=words(clean(s).toLowerCase()).filter(function(x){return x.length>2&&!STOP[x]});var best='',bl=0;w.forEach(function(x){if(x.length>bl){bl=x.length;best=x}});return best||'hook'}
function chunk(s){var w=words(clean(s));var out=[],i=0;while(i<w.length){out.push(w.slice(i,i+6).join(' '));i+=6}return out.slice(0,4)}
function capLine(s){var c=chunk(s);if(!c.length)return '(empty scene)';if(c.length>2){c=c.slice(0,2);c[1]=(c[1]||'').trim();c[1]=(c[1]+'...').replace(/\.+$/,'...')}return c.join('\n')}
function caps(){var t=0;return SCENES.map(function(s,i){var d=SDUR[i]||4,st=t;t+=d;return {i:i,dur:d,st:st,en:t,w:wc(s),line:capLine(s),kw:keyw(s),chunks:chunk(s)}})}
function mount(){
 var bp=document.getElementById('boardPanel');if(!bp||bp.querySelector('#g18b1'))return;
 var row=document.createElement('div');row.style.cssText='margin-top:12px';
 var h=document.createElement('div');h.textContent='FORGE 18 CAPTION LAB';h.style.cssText='color:#2de2ff;font:700 11px monospace;margin:4px 3px';row.appendChild(h);
 var btns=document.createElement('div');btns.style.cssText='display:flex;flex-wrap:wrap';row.appendChild(btns);
 var anchor=bp.querySelector('.rowbtns');if(anchor)bp.insertBefore(row,anchor);else bp.appendChild(row);
 btns.appendChild(mkBtn('g18b1','CAPTION MAP',capMap));
 btns.appendChild(mkBtn('g18b2','LINE SPLIT',lineSplit));
 btns.appendChild(mkBtn('g18b3','KEYWORD POP',keyPop));
 btns.appendChild(mkBtn('g18b4','TIMING CHECK',timingCheck));
 btns.appendChild(mkBtn('g18b5','SAFE ZONE',safeZone));
 btns.appendChild(mkBtn('g18b6','STYLE RULE',styleRule));
 btns.appendChild(mkBtn('g18b7','EMOJI RULE',emojiRule));
 btns.appendChild(mkBtn('g18b8','CTA CAPTION',ctaCap));
 btns.appendChild(mkBtn('g18b9','CAPTION SCORE',capScore));
 btns.appendChild(mkBtn('g18b10','CAPTION SHEET',capSheet));
 try{glog('FORGE 18 CAPTION LAB mounted (10 tools)',0)}catch(e){}
}
function capMap(){
 var cs=caps(),n=cs.length;
 glog('CAPTION MAP ('+n+' scenes, '+tot().toFixed(1)+'s): '+cs.map(function(c){return 's'+(c.i+1)+' ['+c.st.toFixed(1)+'-'+c.en.toFixed(1)+'s] "'+c.line.replace(/\n/g,' / ')+'"'}).join(' | '),1);
}
function lineSplit(){
 var cs=caps(),bad=cs.filter(function(c){return c.chunks.length>2});
 glog('LINE SPLIT: '+cs.filter(function(c){return c.chunks.length<=2}).map(function(c){return 's'+(c.i+1)+': '+c.chunks.length+' chunk'+(c.chunks.length>1?'s':'')}).join(', ')+' | '+(bad.length?bad.length+' scene'+(bad.length>1?'s':'')+' over 2 chunks ('+bad.map(function(c){return 's'+(c.i+1)+' '+c.w+'w'}).join(', ')+') - trim to 12 words max, cut fillers first':'all scenes fit 2 caption lines clean'),1);
}
function keyPop(){
 var cs=caps();
 glog('KEYWORD POP: '+cs.map(function(c){return 's'+(c.i+1)+':'+c.kw}).join(' ')+' | one accent word per caption max, bold it in your accent color (cyan #2de2ff on dark, keep the rest white) - two highlighted words reads as spam',1);
}
function timingCheck(){
 var cs=caps(),slow=[],fast=[];
 cs.forEach(function(c){var wps=c.w/c.dur;if(wps>2.6)fast.push('s'+(c.i+1)+' '+wps.toFixed(1)+'w/s');if(c.w&&c.dur<1.4)slow.push('s'+(c.i+1)+' '+c.dur.toFixed(1)+'s')});
 glog('TIMING CHECK: '+(fast.length?'too fast: '+fast.join(', ')+' - hold the last caption chunk 0.3s into the cut':'readable pace everywhere')+(slow.length?'; scenes under 1.4s: '+slow.join(', ')+' - let the caption linger on the cut':''),1);
}
function safeZone(){
 glog('SAFE ZONE: caption block centered at 62% frame height, nothing below 75% (bottom 25% is the caption/username zone) and nothing in the right 12% (engagement rail) - big captions beat the TikTok native caption zone, so pull the whole block up, do not fight it',1);
}
function styleRule(){
 glog('STYLE RULE: bold sans (Inter/SF Pro), size 5-6% of frame height, 2px black outline + 40% drop shadow, sentence case for body lines, ALL CAPS only for the s1 hook line - outline+shadow keeps text alive over bright scenes where a plain fill washes out',1);
}
function emojiRule(){
 var cs=caps(),n=cs.length,allow=Math.max(1,Math.floor(n/2));
 glog('EMOJI RULE: max '+allow+' emoji across '+n+' scenes, attach one to a mood word only (reveal, money, shock), never in the s1 hook - the hook earns attention with words, emoji in it reads as bait',1);
}
function ctaCap(){
 var last=SCENES[SCENES.length-1],kw=keyw(last);
 glog('CTA CAPTION: outro line "'+capLine(last).replace(/\n/g,' / ')+'" -> keep it on screen and append the CTA as its own final beat: "follow for '+kw+' pt 2" - a CTA that references the content outperforms a generic follow ask',1);
}
function capScore(){
 var cs=caps(),pen=0;
 cs.forEach(function(c){if(c.w>12)pen+=5;if(c.w/c.dur>2.6)pen+=5;if(c.chunks.length>2)pen+=5});
 var sc=Math.max(40,95-pen);
 glog('CAPTION SCORE: '+sc+'/100 - '+(sc>=85?'clean: lines short, pace readable, keyword mapped':sc>=70?'close: trim the over-length lines flagged above':'rework: scenes are carrying too much text, cut each caption to 12 words max'),1);
}
function capSheet(){
 var cs=caps(),t=0;
 var lines=['SHORTFORGE CAPTION SHEET - '+title(),'generated by FORGE 18 CAPTION LAB (Nov 25 2026) - '+SCENES.length+' scenes, '+tot().toFixed(1)+'s total',''];
 cs.forEach(function(c){
  lines.push('s'+(c.i+1)+' ['+c.st.toFixed(1)+'-'+c.en.toFixed(1)+'s] '+c.w+'w '+c.dur.toFixed(1)+'s ('+(c.w/c.dur).toFixed(1)+'w/s) kw:'+c.kw);
  lines.push('  caption: '+c.line.replace(/\n/g,' / '));
 });
 lines.push('','style: bold sans, 5-6% height, 2px outline + 40% shadow, caps for hook only');
 lines.push('safe zone: center block at 62% height, clear of bottom 25% and right 12%');
 var last=SCENES[SCENES.length-1];
 lines.push('cta: follow for '+keyw(last)+' pt 2');
 var txt=lines.join('\n');
 try{window.__sf_caption18_sheet=txt}catch(e){}
 glog('CAPTION SHEET: '+txt.length+' chars built, downloading forge18_caption_sheet.txt',1);
 dlB(txt,'forge18_caption_sheet.txt');
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){setTimeout(mount,80)})}else{setTimeout(mount,80)}
})();