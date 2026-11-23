'use strict';
var REPOS=[
{n:'MoneyPrinterTurbo',s:'145,197★',u:'https://github.com/harry0703/MoneyPrinterTurbo',b:'the full pipeline: script → footage → subtitles → music → HD short'},
{n:'short-video-maker',s:'1,518★',u:'https://github.com/gyoridavid/short-video-maker',b:'one prompt in, tiktok/reels/shorts out — API style'},
{n:'ShortGPT',s:'8,196★',u:'https://github.com/RayVentura/ShortGPT',b:'automation framework for channel-scale output'},
{n:'MoneyPrinter',s:'14,240★',u:'https://github.com/FujiwaraChoki/MoneyPrinter',b:'the original — moviepy automation'},
{n:'purffle-shorts',s:'104★',u:'https://github.com/Chamanrajragu/purffle-shorts',b:'reddit story + text-message video modes, captions, auto-upload ideas'},
{n:'AI-Youtube-Shorts-Generator',s:'6,506★',u:'https://github.com/Anil-matcha/AI-Youtube-Shorts-Generator',b:'the clipper brain: find viral moments in long video'}];
var rb=document.getElementById('repos');
REPOS.forEach(function(r){var d=document.createElement('div');d.className='repo';d.innerHTML='<a href="'+r.u+'" target="_blank" rel="noopener">'+r.n+' '+r.s+'</a><span>'+r.b+'</span>';rb.appendChild(d)});

var TOPICS=['ai taking over 2026','things broke people buy','the 3am thought experiment','history they never taught you','why the ocean scares scientists','$1 vs $1000 gadget','day in the life of a hacker','space facts that feel illegal','gym mistakes everyone makes','signs someone is lying'];
var tr=document.getElementById('trends');
TOPICS.forEach(function(t){var b=document.createElement('button');b.className='tchip';b.textContent=t;b.addEventListener('click',function(){document.getElementById('topic').value=t});tr.appendChild(b)});

var MODE='turbo';
var MODENAMES={turbo:'TURBO — topic in, finished short out',prompt:'PROMPT — one prompt, one short',reddit:'REDDIT STORY — hook + narration over AI visuals',chat:'TEXT CHAT — the fake iMessage conversation format',clipper:'CLIPPER — paste a transcript, get the viral short',quotes:'QUOTES — powerful quote cards over mood visuals',motiv:'MOTIVATION — hype lines, big gold captions',karaoke:'KARAOKE — singable lyric lines, word by word',vedit:'VIDEO EDIT — drop a clip, it beatsyncs and styles it'};
document.querySelectorAll('.mchip').forEach(function(b){b.addEventListener('click',function(){MODE=b.dataset.m;document.querySelectorAll('.mchip').forEach(function(x){x.classList.toggle('on',x===b)});document.getElementById('modeTitle').textContent=MODENAMES[MODE];document.getElementById('topicPanel').style.display=MODE==='vedit'?'none':'';document.getElementById('vePanel').style.display=MODE==='vedit'?'':'none'})});

function step(msg,hl){var s=document.getElementById('steps');var d=document.createElement('div');if(hl)d.innerHTML='<b>'+msg+'</b>';else d.textContent=msg;s.appendChild(d);s.scrollTop=s.scrollHeight;return d}
function clearSteps(){document.getElementById('steps').innerHTML=''}

var sys='You are a viral short-form video director. Reply with STRICT JSON only, no markdown, no commentary. Schema: {"title":string,"caption":string,"hashtags":[8 strings],"scenes":[{"cap":string (max 9 words, on-screen text),"t":string (narration, 1-2 short sentences),"img":string (detailed image prompt, cinematic, vertical 9:16)}]}. Six scenes.';
function modeHint(){
if(MODE==='reddit')return' This is a REDDIT STORY video: scene 1 is the hook ("cap" = a shocking hook line), then the story beats, ending on a twist.Keep every cap punchy.';
if(MODE==='chat')return' This is a FAKE TEXT-MESSAGE conversation video: each scene cap is ONE chat bubble line, alternate senders by prefixing every cap with ME: or THEM:. img prompts should be moody phone-gradient backgrounds.';
if(MODE==='clipper')return' The user gives a transcript of long content: extract the single most viral 30-second moment, rewrite it as 6 punchy scenes that stand alone.';
if(MODE==='quotes')return' This is a QUOTE CAROUSEL video: each cap is ONE short powerful quote or aphorism about the topic (max 10 words). Narration t explains the quote in one sentence. img prompts: minimal elegant dark backgrounds with subtle gold light, no text in the image.';
if(MODE==='karaoke')return' This is a KARAOKE-STYLE video: each cap is ONE short singable lyric line (max 7 words) about the topic, and t is that same line phrased as speech. Keep a rhythm: lines should feel like song bars.';
if(MODE==='motiv')return' This is a MOTIVATION video: each cap is ONE short punchy hype line (max 8 words, no ending punctuation), t is that line spoken with intensity. Scene 1 cap is a hook question. img prompts: dramatic high-contrast imagery (gym at dawn, city rooftops, lone runner, storm light), vertical 9:16.';
if(MODE==='prompt')return' The user gives a raw creative prompt: turn it into a 6-scene short.';
return' The user gives a topic: build the classic MoneyPrinterTurbo pipeline script for it.'}

function localTemplate(topic){
var sc=[];var caps=['wait for it…','this changes everything','nobody talks about this','the part that matters','save this one','follow for part 2'];
for(var i=0;i<6;i++){sc.push({cap:(i===0?topic.toUpperCase():caps[i]),t:(i===0?'Let me tell you about '+topic+'.':caps[i]+' Here is what most people miss.'),img:'cinematic '+topic+', dramatic lighting, vertical composition, shot '+(i+1)})}
return{title:topic,caption:topic+' #fyp',hashtags:['#fyp','#foryou','#viral','#trending','#foryoupage','#tiktok','#learnontiktok','#storytime'],scenes:sc}}

var busy=false;
document.getElementById('go').addEventListener('click',function(){
if(busy)return;busy=true;this.disabled=true;clearSteps();
var topic=document.getElementById('topic').value.trim()||('something wild about '+new Date().toDateString());
var vibe=document.getElementById('vibe').value.trim();
if(vibe)sys+=' Overall vibe: '+vibe+'.';
step('script pass: writing the '+MODE+' script…',1);
runLLM(sys+modeHint(),topic).then(function(j){
if(!j)throw 0;step('script ready: '+j.scenes.length+' scenes — "'+j.title+'"',1);build(j);
}).catch(function(){step('relay cold — using the built-in fallback writer',1);build(localTemplate(topic))}).finally(function(){busy=false;document.getElementById('go').disabled=false});
});

function runLLM(sy,usr){
return new Promise(function(res){
function attempt(n){
fetch('https://text.pollinations.ai/openai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'openai',messages:[{role:'system',content:sy},{role:'user',content:usr}]})}).then(function(r){
if(r.status===402){countdown(function(){attempt(n+1)});return}
return r.json().then(function(j){var c=j.choices&&j.choices[0]&&j.choices[0].message?j.choices[0].message.content:'';var m=c.indexOf('{'),e=c.lastIndexOf('}');if(m<0||e<0)throw 0;res(JSON.parse(c.slice(m,e+1)))});
}).catch(function(){if(n<2){step('relay hiccup, retrying…');setTimeout(function(){attempt(n+1)},3000)}else res(null)});
}
attempt(0);
});
}
function countdown(cb){var left=45;var el=document.getElementById('cool');var t=setInterval(function(){el.textContent='relay cooldown '+left+'s';left--;if(left<=0){clearInterval(t);el.textContent='';cb()}},1000)}

var SCENES=[],META=null,SDUR=[];
function dims(){var r=document.getElementById('ratio').value;if(r==='1:1')return[1024,1024];if(r==='16:9')return[1280,720];return[720,1280]}
function build(j){
META=j;SCENES=j.scenes;
SDUR=SCENES.map(function(s){var w=(s.t||s.cap).split(/\s+/).length;return Math.max(3.6,Math.min(9,w*0.42))});
document.getElementById('boardPanel').style.display='';
setRatio();renderBoard();
recTotal();document.getElementById('meta').innerHTML='<b>'+esc(META.title)+'</b> · '+SCENES.length+' scenes · '+TOT.toFixed(1)+'s total<br>'+esc(META.caption)+'<br><span class="tags">'+esc(META.hashtags.join(' '))+'</span><br><br>webm export: video + synth beat. voiceover plays in preview (browser voice). edit any caption right on the card, re-roll images, delete scenes. post the caption + tags with the video.';
document.getElementById('boardPanel').scrollIntoView({behavior:'smooth',block:'start'});
step('images: pulling one AI visual per scene…',1);
}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function renderBoard(){
var bd=document.getElementById('board');bd.innerHTML='';
SCENES.forEach(function(s,i){
var d=document.createElement('div');d.className='scene';
d.innerHTML='<img id="im'+i+'" alt=""><div class="sc"><b id="cap'+i+'" contenteditable="true">'+esc(s.cap)+'</b>'+esc(s.t)+'</div><div class="tools"><button class="tbtn" data-i="'+i+'" data-a="re">RE-IMG</button><button class="tbtn" data-i="'+i+'" data-a="del">DEL</button></div>';
bd.appendChild(d);loadImg(s,i);
d.querySelector('#cap'+i).addEventListener('blur',function(){s.cap=this.textContent.trim()});
});
bd.querySelectorAll('.tbtn').forEach(function(b){b.addEventListener('click',function(){
var i=parseInt(b.dataset.i,10);
if(b.dataset.a==='re'){var im=document.getElementById('im'+i);var u=imgUrl(SCENES[i],i,true);im.crossOrigin='anonymous';im.src=u;step('scene '+(i+1)+' image re-rolling…')}
else{SCENES.splice(i,1);SDUR.splice(i,1);step('scene deleted',0);renderBoard()}
})});
}
function imgUrl(s,i,reshuffle){var d=dims();return'https://image.pollinations.ai/prompt/'+encodeURIComponent(s.img+' vertical 9:16')+'?width='+d[0]+'&height='+d[1]+'&nologo=true&seed='+(i*977+13+(reshuffle?Math.floor(Math.random()*9000):0))}
function loadImg(s,i){
var im=document.getElementById('im'+i);
im.crossOrigin='anonymous';
im.onerror=function(){im.removeAttribute('crossorigin');im.onerror=null;im.src=imgUrl(s,i,false);};
im.src=imgUrl(s,i,false);
im.onload=function(){step('image '+(i+1)+' landed',0)};
}

/* caption copy */
document.getElementById('ccopy').addEventListener('click',function(){
if(!META)return;var txt=META.title+'\n\n'+META.caption+'\n\n'+META.hashtags.join(' ');
try{navigator.clipboard.writeText(txt).then(function(){step('caption + hashtags copied',1)},function(){step('copy blocked — select it from the panel',0)})}catch(e){step('copy blocked — select it from the panel',0)}});

/* ratio + player */
var cv=document.getElementById('cv'),ctx=cv.getContext('2d');
var playing=false,si=0,st=0,raf=0,voiceOn=true;
function setRatio(){var d=dims();cv.width=d[0];cv.height=d[1]}
document.getElementById('ratio').addEventListener('change',function(){setRatio();step('canvas now '+this.value,0)});
var W=720,H=1280;
var TOT=1;
function recTotal(){TOT=Math.max(1,SDUR.reduce(function(a,b){return a+b},0))}
function draw(){
W=cv.width;H=cv.height;
if(!SCENES.length)return;
var s=SCENES[si],p=Math.min(1,(Date.now()-st)/(SDUR[si]*1000));
var im=document.getElementById('im'+si),img=null;
try{if(im&&im.complete&&im.naturalWidth&&im.crossOrigin==='anonymous')img=im}catch(e){}
ctx.fillStyle='#05050a';ctx.fillRect(0,0,W,H);
var fxOn=document.getElementById('fx')?document.getElementById('fx').checked:true;
var z=1.05+0.08*p,px=(si%2?-1:1)*p*W*0.022,py=p*H*0.012,flash=0;
if(fxOn){
if(window.__sfBeat){var bdt=(performance.now()-window.__sfBeat)/1000;if(bdt<0.25)z+=0.05*(1-bdt/0.25)}
var sc=(Date.now()-st)/1000;if(sc<0.22)flash=0.32*(1-sc/0.22);
}
if(img){var w=W*z,h=H*z;ctx.drawImage(img,(W-w)/2+px,(H-h)/2+py,w,h)}
else{var g=ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,'#1a0b2e');g.addColorStop(1,'#04121a');ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
if(fxOn&&flash>0){ctx.fillStyle='rgba(255,255,255,'+flash.toFixed(3)+')';ctx.fillRect(0,0,W,H)}
var vg=ctx.createLinearGradient(0,H*0.6,0,H);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.82)');ctx.fillStyle=vg;ctx.fillRect(0,H*0.6,W,H*0.4);
if(MODE==='motiv'){drawMotiv(s)}else if(MODE==='chat'){drawChat(s)}else{drawCap(s,p)}
if(MODE==='reddit'){ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(0,H*0.05,W,H*0.13);ctx.fillStyle='#ffc933';wrap(META.title,44,W-80,H*0.09,54)}
if(MODE==='quotes'){ctx.fillStyle='rgba(0,0,0,.45)';ctx.fillRect(0,H*0.05,W,H*0.11);ctx.fillStyle='#00e5ff';wrap(META.title.toUpperCase(),40,W-80,H*0.08,50)}
ctx.fillStyle='#00e5ff';ctx.font='600 22px monospace';ctx.fillText('SHORTFORGE · '+(si+1)+'/'+SCENES.length,28,H-40);
var pbi=document.getElementById('pbi');if(pbi){var el=0;for(var q2=0;q2<si;q2++)el+=SDUR[q2];el+=p*SDUR[si];pbi.style.width=Math.min(100,el/TOT*100)+'%'}
if(playing&&p>=1){si++;if(si>=SCENES.length){stopPlay();return}st=Date.now();speakScene()}
raf=requestAnimationFrame(draw);
}
function wrap(txt,fs,maxw,y,lineh){var words=txt.split(' ');var line='';var lines=[];ctx.font='700 '+fs+'px monospace';words.forEach(function(w){var t=line?line+' '+w:w;if(ctx.measureText(t).width>maxw){lines.push(line);line=w}else line=t});if(line)lines.push(line);lines.forEach(function(l){ctx.fillText(l,40,y);y+=lineh});return y}
function drawCap(s,p){
var words=(s.cap||'').split(' ');var idx=Math.min(words.length-1,Math.floor(p*words.length));
var style=document.getElementById('capstyle').value;
var maxw=W-80;var fs=52;if(style==='pop')fs=54;
ctx.font='700 '+fs+'px monospace';
var lines=[];var linec='';
words.forEach(function(w){var t=linec?linec+' '+w:w;if(ctx.measureText(t.toUpperCase()).width>maxw){lines.push(linec);linec=w}else linec=t});if(linec)lines.push(linec);
var y0=H-260;var n=0;var reveal=style==='typewriter'?Math.ceil(s.cap.length*Math.min(1,p*1.25)):s.cap.length;
lines.forEach(function(l){var yy=y0+n*(fs+8);n++;var x=40;
l.split(' ').forEach(function(w){
if(style==='typewriter'){var upto=s.cap.indexOf(w);if(upto>=reveal)return}
var hit=style!=='typewriter'&&words[idx].toUpperCase()===w.toUpperCase()&&words.indexOf(w)===idx;
var size=hit&&style==='pop'?fs+8:fs;
ctx.font='700 '+size+'px monospace';
ctx.fillStyle=hit?'#ffc933':'#ffffff';
var full=w.toUpperCase()+' ';ctx.fillText(full,x,yy);x+=ctx.measureText(full).width;
ctx.font='700 '+fs+'px monospace';
})});
}
function drawChat(s){
var cap=s.cap||'';var me=cap.slice(0,3).toUpperCase()==='ME:';
var txt=cap.replace(/^(ME:|THEM:)\s*/i,'');
ctx.font='600 34px monospace';var w=Math.min(W-160,ctx.measureText(txt).width+44);
var x=me?W-40-w:40;var lines=[];var lc='';txt.split(' ').forEach(function(wd){var t=lc?lc+' '+wd:wd;if(ctx.measureText(t).width>w-44){lines.push(lc);lc=wd}else lc=wd});if(lc)lines.push(lc);
var h=lines.length*44+36;var y=H*0.68;
ctx.fillStyle=me?'#00b14a':'#262637';roundRect(x,y,w,h,18);ctx.fill();
ctx.fillStyle='#fff';lines.forEach(function(l,ix){ctx.fillText(l,x+22,y+34+ix*44)});
}
function drawMotiv(s){
var cap=(s.cap||'').replace(/[.!]+$/,'');
var fs=W>900?64:56;ctx.font='800 '+fs+'px monospace';
var lines=[];var lc='';cap.split(' ').forEach(function(w){var t2=lc?lc+' '+w:w;if(ctx.measureText(t2).width>W-100){lines.push(lc);lc=w}else lc=t2});if(lc)lines.push(lc);
var lh=fs*1.22,y0=H*0.40-(lines.length-1)*lh;
ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(0,y0-fs*1.05,W,lines.length*lh+fs*0.5);
ctx.fillStyle='#ffc933';ctx.shadowColor='rgba(255,201,51,.5)';ctx.shadowBlur=26;ctx.textAlign='center';
lines.forEach(function(l,i){ctx.fillText(l,W/2,y0+i*lh)});
ctx.shadowBlur=0;ctx.textAlign='left';
}
function roundRect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
var voices=[];
function fillVoices(){
try{voices=speechSynthesis.getVoices().filter(function(v){return v.lang.indexOf('en')===0});
var sel=document.getElementById('voice');sel.innerHTML='';
voices.forEach(function(v,i){var o=document.createElement('option');o.value=i;o.textContent=v.name.replace(/^Microsoft |^Google /,'').slice(0,26);sel.appendChild(o)});
var gi=voices.map(function(v){return v.name}).findIndex(function(n){return/Google US English|Samantha|Zira/i.test(n)});
if(gi>=0)sel.value=gi;
}catch(e){}}
try{fillVoices();speechSynthesis.onvoiceschanged=fillVoices}catch(e){}
document.getElementById('rate').addEventListener('input',function(){document.getElementById('ratev').textContent=this.value});
function speakScene(){
if(!voiceOn)return;
try{speechSynthesis.cancel();var s=SCENES[si];var u=new SpeechSynthesisUtterance(s.t||s.cap);
var vi=parseInt(document.getElementById('voice').value,10);if(voices[vi])u.voice=voices[vi];
u.rate=parseFloat(document.getElementById('rate').value)||1.12;u.pitch=1;speechSynthesis.speak(u)}catch(e){}}
function startPlay(){if(!SCENES.length)return;playing=true;si=0;st=Date.now();speakScene();startMusic();cancelAnimationFrame(raf);draw()}
function stopPlay(){playing=false;cancelAnimationFrame(raf);stopMusic();try{speechSynthesis.cancel()}catch(e){}}
document.getElementById('play').addEventListener('click',startPlay);
document.getElementById('stop').addEventListener('click',stopPlay);
