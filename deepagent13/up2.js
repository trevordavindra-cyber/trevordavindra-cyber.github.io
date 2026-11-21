/* deepagent13 - 50 upgrade pack v3.7 */
(function(){
var D=document;
function H(s){return D.querySelector(s)}
function mk(t,c,x){var e=D.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
var chat=H('#chat');
function sys2(t){if(!chat)return;var d=mk('div','msg sys',t);chat.appendChild(d);chat.scrollTop=1e9;return d}
function ld(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}}
function sv(k,v){localStorage.setItem(k,JSON.stringify(v))}
var ST=D.createElement('style');D.head.appendChild(ST);
function css(s){ST.textContent+=(ST.textContent?'\n':'')+s}
var send=H('#send'),inp=H('#inp');
var P={len:ld('u_len','n'),code:ld('u_code',0),turbo:ld('u_turbo',0),res:ld('u_res',0),fc:ld('u_fc',0),lang:ld('u_lang',''),ci:ld('u_ci',''),per:ld('u_per','')};
var pend2=null,pickerImg=false,lastUser='';
function memStr(){try{var m=JSON.parse(localStorage.getItem('ds_mem2')||'[]');return m.map(function(x){return x.t}).join('; ')}catch(e){return ''}}
function prefix(){var p=[];if(P.ci)p.push(P.ci);if(P.per)p.push('persona: '+P.per);if(P.turbo)p.push('think step by step, maximum rigor and depth');if(P.code)p.push('give complete runnable code, no truncation');if(P.len==='s')p.push('keep the answer under 60 words');if(P.len==='l')p.push('give a thorough detailed answer');if(P.lang)p.push('reply in '+P.lang);if(P.turbo&&/\d/.test(inp.value)&&/[+\-*/^]/.test(inp.value))p.push('verify the math with math.calc');return p}
function gj(u,o){return fetch(u,o).then(function(r){return r.json()})}
function ask(t){return gj('https://text.pollinations.ai/openai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'openai-fast',messages:[{role:'user',content:t}]})}).then(function(j){return (j&&j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content)||''})}
function compose(txt,pre){var go=function(){var all=pre||prefix().join('\n');var m=memStr();if(m)all=(all?all+'\n\n':'')+'[about me] '+m+'\n\n';all+=txt;inp.value=all;inp.dispatchEvent(new Event('input'));var ev=new MouseEvent('click',{bubbles:true});ev.__ds=true;send.dispatchEvent(ev)};
 if(P.res&&txt.length>24){sys2('researching before answering...');var q=encodeURIComponent(txt.slice(0,120));Promise.all([fetch('https://r.jina.ai/https://html.duckduckgo.com/html/?q='+q).then(function(r){return r.text()}).catch(function(){return ''}),fetch('https://r.jina.ai/https://lite.duckduckgo.com/lite/?q='+q).then(function(r){return r.text()}).catch(function(){return ''})]).then(function(rs){var f=rs.filter(Boolean).join('\n').slice(0,3000);go((pre?pre+'\n\n':'')+'[live research notes]\n'+f)});return}
 go()}
function haptic(){try{if(ld('u_hap',1)&&navigator.vibrate)navigator.vibrate(8)}catch(e){}}
var AC=null;function blip(f){if(!ld('u_snd',0))return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();var o=AC.createOscillator(),g=AC.createGain();o.frequency.value=f;o.connect(g);g.connect(AC.destination);g.gain.value=.05;o.start();o.stop(AC.currentTime+.09)}catch(e){}}
function aibubble(t){var d=mk('div','msg ai',t);d.dataset.raw=t;chat.appendChild(d);chat.scrollTop=1e9;return d}
function slash(v){var c=v.slice(1).split(' '),k=c[0].toLowerCase(),rest=c.slice(1).join(' ');pickerImg=false;haptic();
 if(k==='help'||!k){aibubble('commands: /image <prompt> /qr <text> /weather <city> /define <word> /translate <text|fr|en> /wiki <topic> /roll <n> /flip /time /calc <math> /fix <text>');return}
 if(k==='roll'){aibubble('rolled a '+(1+Math.floor(Math.random()*(parseInt(rest)||6))));return}
 if(k==='flip'){aibubble(Math.random()<.5?'heads':'tails');return}
 if(k==='time'){aibubble(new Date().toLocaleString());return}
 if(k==='calc'){try{aibubble(String(Function('"use strict";return ('+rest.replace(/\^/g,'**')+')')()))}catch(e){aibubble('calc failed')}}
 else if(k==='image'){aibubble('image: https://image.pollinations.ai/prompt/'+encodeURIComponent(rest||'a surprise')+'?width=1024&height=1024')}
 else if(k==='qr'){aibubble('qr: https://api.qrserver.com/v1/create-qr-code/?size=300x300&data='+encodeURIComponent(rest))}
 else if(k==='weather'){sys2('checking the sky...');fetch('https://geocoding-api.open-meteo.com/v1/search?count=1&name='+encodeURIComponent(rest)).then(function(r){return r.json()}).then(function(g){var p=g.results&&g.results[0];if(!p)return aibubble('city not found');return fetch('https://api.open-meteo.com/v1/forecast?latitude='+p.latitude+'&longitude='+p.longitude+'&current=temperature_2m,weather_code,wind_speed_10m').then(function(r){return r.json()}).then(function(w){aibubble(p.name+': '+w.current.temperature_2m+'C, wind '+w.current.wind_speed_10m+'km/h')})}).catch(function(){aibubble('weather failed')})}
 else if(k==='define'){sys2('looking it up...');fetch('https://api.dictionaryapi.dev/api/v2/entries/en/'+encodeURIComponent(rest)).then(function(r){return r.json()}).then(function(d){if(!Array.isArray(d))return aibubble('no entry');aibubble(d[0].word+' - '+d[0].meanings.map(function(mn){return mn.partOfSpeech+': '+mn.definitions[0].definition}).join('; ').slice(0,400))}).catch(function(){aibubble('lookup failed')})}
 else if(k==='wiki'){sys2('pulling the page...');fetch('https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(rest.replace(/\s+/g,'_'))).then(function(r){return r.json()}).then(function(d){aibubble(d.extract||'no page found')}).catch(function(){aibubble('wiki failed')})}
 else if(k==='translate'){var p=rest.split('|');if(p.length<3)return aibubble('format: /translate text|fr|en');sys2('translating...');fetch('https://api.mymemory.translated.net/get?q='+encodeURIComponent(p[0])+'&langpair='+p[1]+'|'+p[2]).then(function(r){return r.json()}).then(function(d){aibubble((d.responseData&&d.responseData.translatedText)||'no translation')}).catch(function(){aibubble('translate failed')})}
 else if(k==='fix'){sys2('cleaning it up...');ask('Fix grammar and typos, reply with only the corrected text:\n'+rest).then(function(t){aibubble(t||'nothing to fix')}).catch(function(){aibubble('fix failed')})}
 else aibubble('unknown command, try /help');
}
window.addEventListener('click',function(e){
 if(e.target!==send||e.__ds)return;haptic();blip(660);
 var v=inp.value.trim();if(v){lastUser=v}
 if(v.slice(0,1)==='/'){e.stopImmediatePropagation();e.preventDefault();slash(v);return}
 if(!pend2&&!(prefix().length&&!pickerImg))return;
 e.stopImmediatePropagation();e.preventDefault();var img=pend2;pend2=null;pickerImg=false;
 if(img){sys2('looking at your image...');gj('https://text.pollinations.ai/openai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'openai',messages:[{role:'user',content:[{type:'text',text:'Describe this image in detail.'},{type:'image_url',image_url:{url:img.d}}]}]})}).then(function(j){var t=(j&&j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content)||'';compose('[image: '+img.n+'] what i see: '+(t||'(could not read it)').slice(0,1200)+'\n\n'+v)}).catch(function(){compose('[image: '+img.n+' could not be read]\n\n'+v)});return}
 compose(v);return},true);
window.addEventListener('keydown',function(e){
 if(e.target!==inp)return;
 if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();inp.focus();return}
 if(e.key!=='Enter'||e.shiftKey)return;
 var v=inp.value.trim();if(v){lastUser=v}
 var want=v.slice(0,1)==='/'||pend2||(prefix().length&&!pickerImg);
 if(!want)return;e.stopImmediatePropagation();e.preventDefault();haptic();blip(660);send.click()},true);
try{inp.addEventListener('paste',function(e){var it=e.clipboardData&&e.clipboardData.items;if(!it)return;for(var i=0;i<it.length;i++){if(it[i].type.indexOf('image')===0){e.preventDefault();var f=it[i].getAsFile();var r=new FileReader();r.onload=function(){pend2={n:'pasted image',d:String(r.result)};sys2('image pasted, it gets seen with your next message')};r.readAsDataURL(f);return}}}catch(e){}}catch(e){}
try{var wc=mk('div');wc.style.cssText='font-size:11px;opacity:.55;text-align:right;padding:2px 14px 6px';inp.parentNode.appendChild(wc);inp.addEventListener('input',function(){wc.textContent=inp.value.trim()?(inp.value.trim().split(/\s+/).length+' words'):''})}catch(e){}
try{var OU=window.SpeechSynthesisUtterance,vc=ld('u_vc',{r:1,p:1});window.SpeechSynthesisUtterance=function(t){var u=new OU(t);u.rate=vc.r;u.pitch=vc.p;return u}}catch(e){}
var manual=false,savedTop=0;
chat.addEventListener('touchstart',function(){savedTop=chat.scrollTop;manual=chat.scrollTop+chat.clientHeight<chat.scrollHeight-60},{passive:true});
var jbot=mk('button','↓');jbot.style.cssText='position:fixed;right:14px;bottom:110px;z-index:60;display:none;width:36px;height:36px;border-radius:50%;border:1px solid rgba(120,120,128,.35);background:#fff;color:#333;font-size:16px';jbot.onclick=function(){manual=false;jbot.style.display='none';chat.scrollTop=1e9};D.body.appendChild(jbot);
var lastSeen=null;
function stamp(n){try{n.title='sent '+new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}catch(e){}}
function enhanceActs(n){if(n.dataset.u2)return;n.dataset.u2=1;var acts=n.querySelector('.acts');if(!acts)return;[['re','↻','regenerate'],['tr','🌐','translate'],['sh','✂','shorter'],['el','🥺','explain simply'],['cont','⏭','continue'],['q','❝','quote']].forEach(function(b){var x=mk('button','','');x.textContent=b[1];x.title=b[2];x.dataset.u2=b[0];x.style.fontSize='13px';acts.appendChild(x)})}
function autoTitle(raw){var ct=H('#ctitle');if(!ct||ct.dataset.ait||!raw)return;ct.dataset.ait=1;ask('Reply with ONLY a 3 to 5 word title for this chat, no quotes:\n'+raw.slice(0,200)).then(function(t){t=String(t).replace(/["\n]/g,'').trim().slice(0,30);if(t)ct.textContent=t}).catch(function(){})}
function factCheck(raw){ask('List any claims in this reply that look factually wrong or outdated. Reply with a short list, or the single word NONE.\n'+raw.slice(0,1200)).then(function(t){t=String(t).trim();if(t&&t.toUpperCase().indexOf('NONE')<0)sys2('fact check: '+t.slice(0,300))}).catch(function(){})}
new MutationObserver(function(ms){ms.forEach(function(m){
 if(m.type!=='attributes')return;var n=m.target;if(!n.classList||!n.classList.contains('ai'))return;
 var raw=n.dataset.raw||'';if(!raw||raw===lastSeen)return;lastSeen=raw;pickerImg=false;stamp(n);enhanceActs(n);autoTitle(raw);blip(880);
 if(manual){chat.scrollTop=savedTop;jbot.style.display='block'}
 if(P.fc)factCheck(raw);
})}).observe(chat,{subtree:true,attributes:true,attributeFilter:['data-raw']});
chat.addEventListener('click',function(e){var b=e.target.closest?e.target.closest('[data-u2]'):null;if(!b||!b.dataset.u2)return;var d=b.closest('.msg.ai');var raw=(d&&d.dataset.raw)||'';var k=b.dataset.u2;haptic();
 if(k==='q'){inp.value='> '+raw.slice(0,200)+'\n\n';inp.dispatchEvent(new Event('input'));inp.focus();return}
 if(k==='cont'){inp.value='continue exactly where you stopped, do not repeat anything';pickerImg=false;send.click();return}
 if(k==='re'){var ys=chat.querySelectorAll('.msg.you');if(!ys.length)return;var t=String(ys[ys.length-1].dataset.raw||ys[ys.length-1].textContent||'');t=t.replace(/^\[about me\][^\n]*\n\n/,'').replace(/^\[[^\]]*\]\n?/,'');inp.value=t;pickerImg=false;send.click();return}
 var pr={tr:'Translate this to English, reply with only the translation.',sh:'Rewrite this reply 3 times shorter, keep every key fact.',el:'Explain this reply like I am 5 years old.'}[k];if(!pr)return;sys2('rewriting...');ask(pr+'\n\n'+raw).then(function(t){if(!t)return sys2('rewrite failed');if(k==='tr'){sys2(t.slice(0,400))}else{d.dataset.raw=t;d.textContent=t}}).catch(function(){sys2('rewrite failed')})});
chat.addEventListener('dblclick',function(e){var d=e.target.closest?e.target.closest('.msg.ai'):null;if(!d)return;var raw=d.dataset.raw||'';var st=ld('u_stars',[]);var i=st.indexOf(raw);if(i>-1){st.splice(i,1);sys2('unstarred')}else{st.push(raw.slice(0,300));sys2('starred ⭐')}sv('u_stars',st)});
var panel=mk('div');panel.id='upanel';panel.style.cssText='position:fixed;inset:0;z-index:90;display:none;background:var(--bg,#fff);overflow-y:auto;padding:16px';
function row(l,f){var b=mk('button',null,l);b.style.cssText='display:block;width:100%;text-align:left;padding:12px;border:0;border-bottom:1px solid rgba(120,120,128,.2);background:transparent;font-size:14px';b.onclick=f;panel.appendChild(b);return b}
function tog(l,k,inv){var b=row(l+'  ['+(ld(k,inv?0:1)?'on':'off')+']',function(){var v=!ld(k,inv?0:1);sv(k,v?1:0);b.textContent=l+'  ['+(v?'on':'off')+']';sys2(l+(v?' on':' off'));if(k==='u_res')P.res=v;if(k==='u_turbo')P.turbo=v;if(k==='u_code')P.code=v;if(k==='u_fc')P.fc=v});return b}
function head(t){var h=mk('div',null,t);h.style.cssText='font-size:12px;font-weight:700;opacity:.6;padding:14px 0 6px;text-transform:uppercase';panel.appendChild(h)}
head('brain');
tog('turbo mode','u_turbo');tog('deep research (web before answers)','u_res');tog('fact-check every reply','u_fc');tog('code mode','u_code');
row('answer length: '+P.len,function(){P.len=P.len==='n'?'s':(P.len==='s'?'l':'n');sv('u_len',P.len);this.textContent='answer length: '+P.len});
row('reply language: '+(P.lang||'auto'),function(){var langs=['','spanish','french','hindi','german','portuguese','japanese'];P.lang=langs[(langs.indexOf(P.lang)+1)%langs.length];sv('u_lang',P.lang);this.textContent='reply language: '+(P.lang||'auto')});
row('custom instructions',function(){var v=prompt('standing instructions for every answer',P.ci);if(v!==null){P.ci=v.trim();sv('u_ci',P.ci);sys2(P.ci?'instructions saved':'instructions cleared')}});
row('persona: '+(P.per||'none'),function(){var ps=['none','a blunt senior engineer','a patient teacher','a stand-up comedian','a concise analyst'];P.per=ps[(ps.indexOf(P.per)+1)%ps.length];sv('u_per',P.per);this.textContent='persona: '+(P.per||'none')});
head('memory and stars');
row('view / edit memory',function(){var m=ld('ds_mem2',[]);alert(m.length?m.map(function(x,i){return (i+1)+'. '+x.t}).join('\n'):'memory is empty. it learns as you chat.')});
row('wipe auto memory',function(){if(confirm('erase everything it learned about you?')){localStorage.removeItem('ds_mem2');sys2('memory wiped')}});
row('starred messages ('+ld('u_stars',[]).length+')',function(){var s=ld('u_stars',[]);alert(s.length?s.join('\n\n'):'double-tap any reply to star it')});
head('voice and feel');
row('voice speed: '+ld('u_vc',{r:1}).r+'x',function(){var v=ld('u_vc',{r:1,p:1});v.r=Math.round((v.r===1?.8:v.r===.8?1.3:1)*10)/10;sv('u_vc',v);this.textContent='voice speed: '+v.r+'x'});
tog('send sounds','u_snd');tog('haptic feedback','u_hap');
head('look');
(function(){var r=mk('div',null,'accent');r.style.cssText='padding:10px 0';['#4d6bfe','#12b76a','#f04438','#f79009','#7a5af8','#0aa2c0',''].forEach(function(c){var d=mk('button');d.style.cssText='width:26px;height:26px;border-radius:50%;margin-right:8px;border:2px solid #ccc;background:'+(c||'#fff');d.onclick=function(){if(c){css('#send circle{fill:'+c+'!important}.sgchip,.wchip{border-color:'+c+'!important;color:'+c+'!important}')}else location.reload()};r.appendChild(d)});panel.appendChild(r)})();
row('bubble style: '+(ld('u_bub',0)?'square':'rounded'),function(){var v=!ld('u_bub',0);sv('u_bub',v?1:0);css('.msg{border-radius:'+(v?'6px':'18px')+'!important}');this.textContent='bubble style: '+(v?'square':'rounded')});
row('compact mode: '+(ld('u_cpt',0)?'on':'off'),function(){var v=!ld('u_cpt',0);sv('u_cpt',v?1:0);css('.msg{margin-bottom:'+(v?'6px':'14px')+'!important}');this.textContent='compact mode: '+(v?'on':'off')});
row('wallpaper',function(){var g=['','linear-gradient(160deg,#eef4ff,#fdf1ff)','linear-gradient(160deg,#0f172a,#1e293b)','linear-gradient(160deg,#fdf6ec,#eefcf3)'];var i=(ld('u_wp',0)+1)%4;sv('u_wp',i);D.body.style.backgroundImage=g[i];sys2(i?'wallpaper set':'wallpaper cleared')});
row('auto dark at night: '+(ld('u_ad',0)?'on':'off'),function(){var v=!ld('u_ad',0);sv('u_ad',v?1:0);this.textContent='auto dark at night: '+(v?'on':'off')});
head('chat tools');
row('summarize this chat',function(){var t=[];chat.querySelectorAll('.msg').forEach(function(m){if(m.classList.contains('you')||m.classList.contains('ai'))t.push((m.classList.contains('you')?'You: ':'AI: ')+(m.dataset.raw||m.textContent))});if(!t.length)return sys2('nothing to summarize');sys2('summarizing...');ask('Summarize this conversation in 5 short bullets:\n'+t.join('\n').slice(0,6000)).then(function(s){aibubble('summary:\n'+s)}).catch(function(){sys2('summary failed')})});
row('download chat as markdown',function(){var t='# chat export\n\n';chat.querySelectorAll('.msg').forEach(function(m){if(m.classList.contains('you'))t+='**You:** '+(m.dataset.raw||m.textContent)+'\n\n';if(m.classList.contains('ai'))t+='**AI:** '+(m.dataset.raw||m.textContent)+'\n\n'});var b=new Blob([t],{type:'text/markdown'});var a=D.createElement('a');a.href=URL.createObjectURL(b);a.download='chat.md';a.click()});
row('copy whole chat',function(){var t=[];chat.querySelectorAll('.msg').forEach(function(m){if(m.classList.contains('you')||m.classList.contains('ai'))t.push((m.classList.contains('you')?'You: ':'AI: ')+(m.dataset.raw||m.textContent))});navigator.clipboard.writeText(t.join('\n\n')).then(function(){sys2('chat copied')})});
row('prompt library',function(){var p=ld('u_plib',[]);var v=prompt('save a prompt template (or tap cancel to view). saved:\n'+(p.length?p.map(function(x,i){return (i+1)+'. '+x}).join('\n'):'none'));if(v&&v.trim()){p.push(v.trim());sv('u_plib',p.slice(0,20));sys2('saved. type its number to use? no - open this again and i will ask')}});
row('session stats',function(){var ms=chat.querySelectorAll('.msg');var w=0;ms.forEach(function(m){w+=(m.textContent||'').split(/\s+/).length});alert(ms.length+' messages, about '+w+' words this session')});
row('panic wipe everything',function(){if(confirm('erase all chats, memory, stars and settings on this site?')){Object.keys(localStorage).forEach(function(k){if(k.indexOf('ds_')===0||k.indexOf('u_')===0)localStorage.removeItem(k)});location.reload()}});
var ub=mk('button','⚡');ub.style.cssText='width:34px;height:34px;border-radius:50%;border:1px solid rgba(120,120,128,.3);background:transparent;font-size:15px;margin-left:6px';
var mute=H('#mute');if(mute&&mute.parentNode){mute.parentNode.insertBefore(ub,mute)}else if(send){document.body.appendChild(ub);ub.style.cssText+=';position:fixed;top:12px;right:12px;z-index:80'}
ub.onclick=function(){panel.style.display='block'};
var px=mk('button','✕ close');px.style.cssText='position:sticky;top:0;float:right;padding:8px 14px;border:0;background:#4d6bfe;color:#fff;border-radius:16px;font-size:13px';px.onclick=function(){panel.style.display='none'};panel.insertBefore(px,panel.firstChild);
(function(){var qs=['plan my week','explain quantum computing simply','write a caption for a sunset pic','debug my code idea','best budget meal ideas','tell me a fun fact','help me write a text','compare two phones for me'];var w=H('#wsugg');if(!w)return;var btn=mk('button','🎲');btn.style.cssText='font-size:12px;padding:4px 10px;border-radius:12px;border:1px solid rgba(120,120,128,.3);background:transparent;margin:4px';btn.onclick=function(){w.innerHTML='';qs.sort(function(){return Math.random()-.5}).slice(0,3).forEach(function(q){var b=mk('button','wchip',q);b.onclick=function(){inp.value=q;send.click()};w.appendChild(b)})};w.appendChild(btn)})();
(function(){var dr=H('#drawer');if(!dr)return;var bar=mk('div');bar.style.cssText='padding:8px 14px;display:flex;gap:8px';var si=mk('input');si.placeholder='search chats';si.style.cssText='flex:1;padding:8px;border:1px solid rgba(120,120,128,.3);border-radius:10px;font-size:13px';si.oninput=function(){var dc=H('#dchats');if(!dc)return;Array.prototype.forEach.call(dc.children,function(c){c.style.display=c.textContent.toLowerCase().indexOf(si.value.toLowerCase())>-1?'':'none'})};bar.appendChild(si);var dc2=H('#dchats');if(dc2)dc2.parentNode.insertBefore(bar,dc2)})();
new MutationObserver(function(){if(D.hidden){var t=D.title;if(t.indexOf('(1)')<0)D.title='(1) '+t}}).observe(chat,{subtree:true,attributes:true,attributeFilter:['data-raw']});
D.addEventListener('visibilitychange',function(){if(!D.hidden)D.title=D.title.replace('(1) ','')});
setInterval(function(){if(ld('u_ad',0)){var h=new Date().getHours();if(h>=19||h<6)D.body.classList.add('dark')}},60000);
if(navigator.serviceWorker&&location.pathname.indexOf('/deepagent13/')===0){navigator.serviceWorker.register('sw.js').catch(function(){})}
sys2('50 upgrades live. tap the lightning bolt for the control room, /help for commands.');
})();