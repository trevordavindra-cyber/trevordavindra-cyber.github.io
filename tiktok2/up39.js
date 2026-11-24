'use strict';
// up39.js - PHASE 33 BRAND LAB (Nov 23 2026)
// bio builder, name forge, pin comment, link-in-bio, content pillars,
// outro card, palette pick, watermark maker, brand check, brand sheet
(function(){
if(window.__tk2up39){return}window.__tk2up39=1;
function mkBtn(t,fn,id){var b=document.createElement('button');b.className='btn';b.textContent=t;if(id){b.id=id}b.onclick=fn;return b}
function mkRow(){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap='6px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function saveE(){try{if(typeof save==='function'){save()}}catch(e){}}
function S(){try{return window.S||window.state||window.APPSTATE||{}}catch(e){return {}}}
function clipDur(c){var st=parseFloat(c.start),en=parseFloat(c.end);if(!isFinite(st)||!isFinite(en)){return 0}return Math.max(0,(en-st))/(c.speed||1)}
function clips(){var s=S();var a=(s&&s.clips)||[];var out=[],t=0;for(var i=0;i<a.length;i++){var d=clipDur(a[i]);if(d>0.05){t+=d;out.push({c:a[i],d:d})}}return out}
function genre(){var s=S();var cs=clips();var g=((s.genre||s.style||(cs[0]?cs[0].c.style:'')||'')+'').toUpperCase()||'EDIT';return g}
function needClips(){if(!clips().length){log('brand lab: add clips to the timeline first');return false}return true}
function dl(name,text){try{var b=new Blob([text],{type:'text/plain'});var u=URL.createObjectURL(b);var a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},800);log('brand sheet .txt downloaded - '+name,true)}catch(e){log('brand sheet: download blocked, '+e.message)}}
function bioBuilder(){if(!needClips()){return}
 var g=genre().toLowerCase();
 var l=[g+' edits daily | best cuts pinned below','i turn bad clips into '+g+' hooks',g+' editor | new cut every 24h','self-taught. '+g+' only.'];
 log('BIO BUILDER - 1) '+l[0]+'  2) '+l[1]+'  3) '+l[2]+'  4) '+l[3],true);saveE()}
function nameForge(){var g=genre().toLowerCase();
 var p=[g.toUpperCase()+' LAB',g[0].toUpperCase()+g.slice(1)+'Cuts','@'+g+'loopz','CutBy'+g[0].toUpperCase(),g.toUpperCase()+'DECK'];
 log('NAME FORGE - '+p.join(' | '),true);saveE()}
function pinComment(){if(!needClips()){return}
 var g=genre().toLowerCase();var s=Math.round(clips().reduce(function(a,x){return a+x.d},0)*10)/10;
 var opts=['part 2 drops when this hits 10k - follow so you catch it','the transition at :'+Math.min(9,Math.max(2,Math.round(s/4)))+' is the one. which cut was your favorite?','full recipe in my next video. ask me anything about this '+g+' edit','save this before it gets buried - the pacing template is in part 2'];
 log('PIN COMMENT - '+opts[Math.floor(Math.random()*opts.length)],true);saveE()}
function linkInBio(){var g=genre().toLowerCase();
 log('LINK-IN-BIO - line1: '+g+' templates + the beat pack i use | line2: free 30-day posting calendar | line3: request a custom cut',true);saveE()}
function pillars(){var g=genre().toLowerCase();
 log('CONTENT PILLARS - 1) signature '+g+' cuts (your best work) 2) process/behind-the-cut (how you picked the beat) 3) community (remixes of viewer requests)',true);saveE()}
function outroCard(){if(!needClips()){return}
 var g=genre().toLowerCase();
 log('OUTRO CARD - 0.8s end card: "'+g.toUpperCase()+' - PART 2 TOMORROW" + follow arrow. keep it under 1s so the loop still works',true);saveE()}
var PALKEY='tk2palette';
function palettePick(){var pals=[['#ff2d55','#00e5ff','#0b0b12'],['#ffb300','#111111','#f5f5f5'],['#7c4dff','#00ffa3','#101018'],['#ff4444','#ffd700','#141414']];
 var p=pals[Math.floor(Math.random()*pals.length)];
 try{localStorage.setItem(PALKEY,JSON.stringify(p))}catch(e){}
 log('PALETTE PICK - primary '+p[0]+', accent '+p[1]+', base '+p[2]+' (saved on this device)',true);saveE()}
function watermark(){var g=genre().toLowerCase();
 var w='@'+g+'cuts';
 log('WATERMARK - text "'+w+'", bottom-right, 55% opacity, 2px offset shadow. stays on through the whole cut so reposts carry it',true);saveE()}
function brandCheck(){if(!needClips()){return}
 var cs=clips();var s=S();var issues=[];
 if(!s.title){issues.push('project has no title')}
 var durs=[];for(var i=0;i<cs.length;i++){durs.push(+cs[i].d.toFixed(2))}
 var uniq={};for(var j=0;j<durs.length;j++){uniq[durs[j]]=1}
 if(Object.keys(uniq).length===1&&cs.length>3){issues.push('every clip the same length - vary pacing for a recognizable rhythm')}
 if(!s.genre&&!s.style){issues.push('genre not set - your brand pillar is undefined')}
 if(!issues.length){issues.push('no issues: title, pacing variety and genre all set')}
 log('BRAND CHECK - '+issues.join('; '),true);saveE()}
function brandSheet(){if(!needClips()){return}
 var g=genre().toLowerCase();var s=Math.round(clips().reduce(function(a,x){return a+x.d},0)*10)/10;
 var L=[];L.push('TOK2 BRAND SHEET');L.push('generated '+new Date().toISOString());L.push('genre: '+g+'  total cut: '+s+'s');L.push('');
 L.push('BIO OPTIONS');L.push('1. '+g+' edits daily | best cuts pinned below');L.push('2. i turn bad clips into '+g+' hooks');L.push('3. '+g+' editor | new cut every 24h');L.push('4. self-taught. '+g+' only.');L.push('');
 L.push('NAME OPTIONS');L.push(g.toUpperCase()+' LAB | '+g[0].toUpperCase()+g.slice(1)+'Cuts | @'+g+'loopz | CutBy'+g[0].toUpperCase()+' | '+g.toUpperCase()+'DECK');L.push('');
 L.push('PIN COMMENT');L.push('part 2 drops when this hits 10k - follow so you catch it');L.push('');
 L.push('LINK-IN-BIO');L.push('line1: '+g+' templates + the beat pack i use');L.push('line2: free 30-day posting calendar');L.push('line3: request a custom cut');L.push('');
 L.push('CONTENT PILLARS');L.push('1. signature '+g+' cuts  2. process/behind-the-cut  3. community remixes');L.push('');
 L.push('OUTRO CARD');L.push('0.8s end card: '+g.toUpperCase()+' - PART 2 TOMORROW + follow arrow');L.push('');
 L.push('WATERMARK');L.push('@'+g+'cuts, bottom-right, 55% opacity, 2px shadow');L.push('');
 var pal=null;try{pal=JSON.parse(localStorage.getItem(PALKEY)||'null')}catch(e){}
 L.push('PALETTE');L.push(pal?('primary '+pal[0]+', accent '+pal[1]+', base '+pal[2]):'run palette pick once to save one');
 dl('brand-sheet.txt',L.join('\n'))}
function mount(){
 if(document.getElementById('f39b1')){return}
 var card=document.createElement('div');card.className='card';card.id='f39card';
 var h=document.createElement('h2');h.textContent='BRAND LAB';card.appendChild(h);
 var r1=mkRow();r1.appendChild(mkBtn('BIO BUILDER',bioBuilder,'f39b1'));r1.appendChild(mkBtn('NAME FORGE',nameForge,'f39b2'));card.appendChild(r1);
 var r2=mkRow();r2.appendChild(mkBtn('PIN COMMENT',pinComment,'f39b3'));r2.appendChild(mkBtn('LINK-IN-BIO',linkInBio,'f39b4'));card.appendChild(r2);
 var r3=mkRow();r3.appendChild(mkBtn('CONTENT PILLARS',pillars,'f39b5'));r3.appendChild(mkBtn('OUTRO CARD',outroCard,'f39b6'));card.appendChild(r3);
 var r4=mkRow();r4.appendChild(mkBtn('PALETTE PICK',palettePick,'f39b7'));r4.appendChild(mkBtn('WATERMARK',watermark,'f39b8'));card.appendChild(r4);
 var r5=mkRow();r5.appendChild(mkBtn('BRAND CHECK',brandCheck,'f39b9'));r5.appendChild(mkBtn('BRAND SHEET .TXT',brandSheet,'f39b10'));card.appendChild(r5);
 var note=document.createElement('div');note.className='note';note.id='f39note';note.textContent='brand lab locks in your identity: bio lines, display-name variants, the pinned comment, link-in-bio copy, three content pillars, an outro card, a saved color palette, a watermark spec, a consistency check on the current project and a downloadable brand sheet.';
 card.appendChild(note);
 var hs=document.querySelectorAll('.card h2'),anchor=null;
 for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('IDEA LAB')>=0){anchor=hs[i].parentElement;break}}
 if(anchor){if(anchor.nextSibling){anchor.parentElement.insertBefore(card,anchor.nextSibling)}else{anchor.parentElement.appendChild(card)}}
 else{var ap=document.querySelector('#panelcol')||document.body;ap.appendChild(card)}
 log('brand lab live - bio builder, name forge, pin comment, link-in-bio, content pillars, outro card, palette pick, watermark, brand check, brand sheet');
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',mount)}else{mount()}
})();