'use strict';
// up45.js - PHASE 39 EXPORT LAB (Nov 24 2026)
// res spec, bitrate guide, size estimate, platform matrix, compress tips,
// watermark check, thumb export, burn-in choice, preflight checklist, export sheet
(function(){
if(window.__tk2up45){return}window.__tk2up45=1;
function mkBtn(t,fn,id){var b=document.createElement('button');b.className='btn';b.textContent=t;if(id){b.id=id}b.onclick=fn;return b}
function mkRow(){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap='6px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function saveE(){try{if(typeof save==='function'){save()}}catch(e){}}
function S(){try{return window.S||window.state||window.APPSTATE||{}}catch(e){return {}}}
function clipDur(c){var st=parseFloat(c.start),en=parseFloat(c.end);if(!isFinite(st)||!isFinite(en)){return 0}return Math.max(0,(en-st))/(c.speed||1)}
function clips(){var s=S();var a=(s&&s.clips)||[];var out=[],t=0;for(var i=0;i<a.length;i++){var d=clipDur(a[i]);if(d>0.05){t+=d;out.push({c:a[i],d:d,t0:t})}}for(var j=0;j<out.length;j++){out[j].t0-=out[j].d}return out}
function runtime(){var cs=clips();if(!cs.length){return 0}return cs[cs.length-1].t0+cs[cs.length-1].d}
function needClips(){if(!clips().length){log('export lab: add clips to the timeline first');return false}return true}
function dl(name,text){try{var b=new Blob([text],{type:'text/plain'});var u=URL.createObjectURL(b);var a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},800);log('download started - '+name,true)}catch(e){log('download blocked, '+e.message)}}
function r1(n){return Math.round(n*10)/10}
function resSpec(){if(!needClips()){return}
 var tot=runtime();var n=clips().length;
 log('RES SPEC - export 1080x1920 (9:16), 30fps if your source is 30, never upscale to 60, H.264 high profile, yuv420p, AAC 128k stereo',true);
 log('RES SPEC - project is '+n+' clip(s) / '+r1(tot)+'s runtime, all cuts must land inside that box, no letterboxing (the checkerboard border kills the loop)',true);
 var fps=null;try{fps=S().fps||S().project&&S().project.fps}catch(e){}
 if(fps){log('RES SPEC - project fps reads '+fps+', export matches it exactly, mixed fps gets conformed at import not at export',true)}
 else{log('RES SPEC - no fps on the project: match your source files, and if sources mix, conform everything to the lowest',true)}}
function bitrate(){if(!needClips()){return}
 var tot=runtime();var mbps=tot<10?12:(tot<30?10:(tot<60?8:6));
 log('BITRATE GUIDE - '+r1(tot)+'s edit: video '+mbps+' Mbps H.264 is the sweet spot, TikTok recompresses anyway so above 16 Mbps is wasted upload time',true);
 log('BITRATE GUIDE - audio 128kbps AAC constant; variable bitrate video (1-pass VBR) for uploads, CRF 18-21 if you render locally',true);
 log('BITRATE GUIDE - keyframe interval 2s (60 frames at 30fps), B-frames on, this survives TikTok transcode with the least smear',true)}
function sizeEst(){if(!needClips()){return}
 var tot=runtime();var vMbps=10,aMbps=0.128;var mb=(vMbps+aMbps)*tot/8;
 log('SIZE ESTIMATE - '+r1(tot)+'s at 10 Mbps video + 128k audio = about '+r1(mb)+' MB, well under every platform cap',true);
 var mb60=(vMbps+aMbps)*60/8;log('SIZE ESTIMATE - rule of thumb: about '+r1(mb60)+' MB per minute at this setting, so a 3-minute edit lands near '+r1(mb60*3)+' MB',true);
 if(mb>500){log('SIZE ESTIMATE - over 500 MB: drop to 8 Mbps before you split the file, one clean file beats two parts',true)}}
function matrix(){var tot=runtime()||0;
 log('PLATFORM MATRIX - TikTok: up to 10 min post, 72 MB Android / 287.6 MB iOS, 9:16 favored; Reels: 90s in-feed (3 min rolling out), 4 GB; Shorts: up to 60s (3 min rolling out), 2 GB',true);
 if(tot){log('PLATFORM MATRIX - your runtime '+r1(tot)+'s: '+(tot<=60?'fits TikTok, Reels AND Shorts with no trim':'fits TikTok, trim for Shorts only if it passes 60s')+'',true)}
 else{log('PLATFORM MATRIX - no clips loaded, matrix still applies: 9:16 1080x1920 everywhere, one export feeds all three',true)}
 log('PLATFORM MATRIX - cover image: TikTok reads frame 1 first, Reels prefers a custom cover, Shorts takes the first frame: export the cover separately, do not trust frame 1',true)}
function compress(){if(!needClips()){return}
 var cs=clips();var stills=0;for(var i=0;i<cs.length;i++){var z=parseFloat(cs[i].c.zoom);if(z===1||!isFinite(z)){stills++}}
 log('COMPRESS TIPS - cut dead frames before you compress: '+stills+' of '+cs.length+' clip(s) run at zoom 1, trimming half a second of hold saves more than any bitrate setting',true);
 log('COMPRESS TIPS - grain kills encoders: heavy grain needs 2x bitrate for the same look, drop the grain overlay instead of raising bitrate',true);
 log('COMPRESS TIPS - export once, upload the file itself (never screen-record), every re-save from a messenger or editor re-compresses and smears the cuts',true)}
function watermark(){var s=S();var has=(s&&(s.watermark||s.brand||s.handle))||'';
 if(has){log('WATERMARK CHECK - project carries "'+has+'": keep it inside the safe zone (x 108-972), 60% opacity, 2px shadow, bottom-left at y 1650 clears the TikTok caption rail',true)}
 else{log('WATERMARK CHECK - no watermark set: add handle text bottom-left, 60% opacity, before export, TikTok downloaders strip center watermarks first',true)}
 log('WATERMARK CHECK - never burn the platform logo style (tiled @name): read as spam by the algo, one clean mark only',true)}
function thumb(){if(!needClips()){return}
 var cs=clips();var best=cs[0],score=-1;
 for(var i=0;i<cs.length;i++){var d=cs[i].d;var sc=Math.min(d,2.5)*20+(i===0?10:0);if(sc>score){score=sc;best=cs[i]}}
 var mid=r1(best.t0+best.d/2);
 log('THUMB EXPORT - export the frame at '+mid+'s (clip '+(cs.indexOf(best)+1)+', mid-peak) as 1080x1920 jpg quality 0.9, about 300-600 KB, readable at feed size',true);
 log('THUMB EXPORT - no text on the cover except a 3-word max headline at y 350-650, faces or motion blur read best, avoid frames already carrying captions',true);
 log('THUMB EXPORT - Reels cover crop is 1:1 center: keep the subject inside the middle 1080x1080 or Reels crops the head off',true)}
function burnIn(){var s=S();var c=(s&&(s.captions||s.caps||s.subtitle))||[];
 if(c.length){log('BURN-IN CHOICE - '+c.length+' caption span(s) on the timeline: burn these in, 90% of feeds watch muted and baked captions survive every re-share',true)}
 else{log('BURN-IN CHOICE - no captions on the timeline: export a .srt alongside and upload it, TikTok autogen will mangle your hook line otherwise',true)}
 log('BURN-IN CHOICE - rule: creative hooks and spoken word burn in, long-form dialogue rides an .srt, never both on the same line',true)}
function preflight(){if(!needClips()){return}
 var tot=runtime();var pass=0,fix=0;var L=[];
 if(tot>=5&&tot<=60){pass++;L.push('pass: runtime '+r1(tot)+'s fits every platform')}else{fix++;L.push('fix: runtime '+r1(tot)+'s breaks a platform cap (Reels/Shorts 60s legacy band)')}
 var s=S();if(s&&s.captions&&s.captions.length){pass++;L.push('pass: captions present ('+s.captions.length+' spans)')}else{fix++;L.push('fix: no captions, feeds watch muted')}
 if(s&&(s.watermark||s.handle)){pass++;L.push('pass: watermark set')}else{fix++;L.push('fix: no watermark, add handle before export')}
 pass++;L.push('pass: 1080x1920 export preset assumed, confirm in the render dialog');
 for(var i=0;i<L.length&&i<5;i++){log('PREFLIGHT - '+L[i],true)}
 log('PREFLIGHT - '+pass+'/'+(pass+fix)+' checks green'+(fix?': clear the fix lines before you render':''),true)}
function sheet(){if(!needClips()){return}
 var tot=runtime();var L=['EXPORT SHEET - project runtime '+r1(tot)+'s, '+clips().length+' clip(s)','','RES: 1080x1920 9:16, 30fps, H.264 high, yuv420p, AAC 128k stereo','BITRATE: 10 Mbps video 1-pass VBR, keyframe 2s','SIZE EST: about '+r1(10.128*tot/8)+' MB','PLATFORMS: TikTok 10min/72MB(android), Reels 90s/4GB, Shorts 60s/2GB','THUMB: 1080x1920 jpg q0.9, mid-peak frame','CAPTIONS: burn-in on timeline spans, .srt for dialogue','WATERMARK: handle bottom-left 60% opacity y 1650','CHECKLIST: res, captions, watermark, cover, platform cap'];
 dl('export-sheet.txt',L.join('\n'))}
function mount(){
 if(document.getElementById('f45b1')){return}
 var card=document.createElement('div');card.className='card';card.id='f45card';
 var h=document.createElement('h2');h.textContent='EXPORT LAB';card.appendChild(h);
 var r1r=mkRow();r1r.appendChild(mkBtn('RES SPEC',resSpec,'f45b1'));r1r.appendChild(mkBtn('BITRATE GUIDE',bitrate,'f45b2'));card.appendChild(r1r);
 var r2=mkRow();r2.appendChild(mkBtn('SIZE ESTIMATE',sizeEst,'f45b3'));r2.appendChild(mkBtn('PLATFORM MATRIX',matrix,'f45b4'));card.appendChild(r2);
 var r3=mkRow();r3.appendChild(mkBtn('COMPRESS TIPS',compress,'f45b5'));r3.appendChild(mkBtn('WATERMARK CHECK',watermark,'f45b6'));card.appendChild(r3);
 var r4=mkRow();r4.appendChild(mkBtn('THUMB EXPORT',thumb,'f45b7'));r4.appendChild(mkBtn('BURN-IN CHOICE',burnIn,'f45b8'));card.appendChild(r4);
 var r5=mkRow();r5.appendChild(mkBtn('PREFLIGHT',preflight,'f45b9'));r5.appendChild(mkBtn('EXPORT SHEET .TXT',sheet,'f45b10'));card.appendChild(r5);
 var note=document.createElement('div');note.className='note';note.id='f45note';note.textContent='export lab gets the edit out the door: a res spec, a bitrate guide, a size estimate, the platform matrix, compress tips, a watermark check, a thumb export spec, the burn-in vs srt choice, a preflight checklist and a downloadable export sheet.';
 card.appendChild(note);
 var hs=document.querySelectorAll('.card h2'),anchor=null;
 for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('TEXT LAB')>=0){anchor=hs[i].parentElement;break}}
 if(anchor){if(anchor.nextSibling){anchor.parentElement.insertBefore(card,anchor.nextSibling)}else{anchor.parentElement.appendChild(card)}}
 else{var ap=document.querySelector('#panelcol')||document.body;ap.appendChild(card)}
 log('export lab live - res spec, bitrate guide, size estimate, platform matrix, compress tips, watermark check, thumb export, burn-in choice, preflight checklist, export sheet');
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',mount)}else{mount()}
})();
