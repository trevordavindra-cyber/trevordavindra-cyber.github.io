(function(){
var chat=document.getElementById('chat'),inp=document.getElementById('inp');
var steps=document.getElementById('steps'),sheet=document.getElementById('sheet'),panel=document.getElementById('panel');
var trace=document.getElementById('trace'),hist=document.getElementById('hist'),vsheet=document.getElementById('vsheet');
var pbody=document.getElementById('pbody'),ptitle=document.getElementById('ptitle');
var welcome=document.getElementById('welcome');
var KEY=localStorage.getItem('ds_key')||'';
var MODEL=localStorage.getItem('ds_m')||'openai-fast';
if(!KEY&&MODEL.indexOf('deepseek')===0)MODEL='openai-fast';
var AGENT=localStorage.getItem('ds_ag')!=='0';
var DT=localStorage.getItem('ds_dt')==='1';
var SRCH=localStorage.getItem('ds_sr')!=='0';
var keywarn=false,RUNNING=false,STOP=false,FILECTX=null,AP=localStorage.getItem('ds_ap')||'System',FZ=+(localStorage.getItem('ds_fz')||0);
var FZS=[['Default',100],['Large',112],['Small',88]];
document.documentElement.style.fontSize=FZS[FZ][1]+'%';
function applyAP(){document.body.classList.toggle('dark',AP==='Dark'||(AP==='System'&&window.matchMedia('(prefers-color-scheme: dark)').matches));document.getElementById('apval').textContent=AP}
applyAP();
function togchip(id,on){document.getElementById(id).classList.toggle('on',on)}
togchip('thinkchip',DT);togchip('searchchip',SRCH);
function openSheet(){sheet.style.display='block'}function closeSheet(){sheet.style.display='none'}
var drawer=document.getElementById('drawer'),dback=document.getElementById('dback');
function closeDrawer(){drawer.style.display='none';dback.style.display='none'}
function renderD(){var l=JSON.parse(localStorage.getItem('ds_h')||'[]');var dc=document.getElementById('dchats');dc.innerHTML='';if(!l.length){var e=document.createElement('div');e.className='dchat';e.style.color='var(--dim)';e.style.display='block';e.textContent='no chats yet';dc.appendChild(e)}l.forEach(function(t,i){var d=document.createElement('div');d.className='dchat';var sp=document.createElement('span');sp.textContent=t;var x=document.createElement('b');x.style.color='var(--dim)';x.style.fontWeight='normal';x.style.fontSize='12px';x.textContent='edit';x.onclick=function(ev){ev.stopPropagation();var n=prompt('rename chat',t);if(n&&n.trim()){l[i]=n.trim();localStorage.setItem('ds_h',JSON.stringify(l));renderD();render()}};d.appendChild(sp);d.appendChild(x);d.onclick=closeDrawer;dc.appendChild(d)})}
document.getElementById('menu').onclick=function(){renderD();drawer.style.display='flex';dback.style.display='block'};
dback.onclick=closeDrawer;
document.getElementById('dshare').onclick=function(){var txt=HIST.map(function(m){return (m.role==='user'?'You: ':'Agent: ')+m.content}).join('\n\n');navigator.clipboard.writeText(txt||'(empty chat)').then(function(){sys('chat copied, paste it anywhere to share')});closeDrawer()};
document.getElementById('dbottom').onclick=function(){closeDrawer();openSheet()};
document.getElementById('newchat').onclick=function(){HIST=[];SRC=[];chat.innerHTML='';chat.appendChild(welcome);document.getElementById('ctitle').textContent='';render()};
document.getElementById('mute').onclick=function(){sys('sound on for this chat')};
document.getElementById('thinkchip').onclick=function(){DT=!DT;localStorage.setItem('ds_dt',DT?'1':'0');togchip('thinkchip',DT);sys(DT?'think on: reasoning pass before answers':'think off')};
document.getElementById('searchchip').onclick=function(){SRCH=!SRCH;localStorage.setItem('ds_sr',SRCH?'1':'0');togchip('searchchip',SRCH);sys(SRCH?'search on: agent grounds answers with live web':'search off')};
document.getElementById('plus').onclick=function(){document.getElementById('file').click()};
document.getElementById('file').onchange=function(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(){FILECTX={name:f.name,text:String(r.result).slice(0,20000)};sys('attached: '+f.name+' — it goes in with your next message')};r.readAsText(f)};
var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
document.getElementById('mic').onclick=function(){
 if(!SR){sys('voice input not supported in this browser');return}
 var r=new SR();r.lang='en-US';r.interimResults=false;
 r.onresult=function(e){inp.value+=e.results[0][0].transcript};
 r.onerror=function(){sys('did not catch that')};r.start();sys('listening...');
};
document.getElementById('datactl').onclick=function(){openPanel('data')};
document.getElementById('appear').onclick=function(){AP=AP==='System'?'Light':(AP==='Light'?'Dark':'System');localStorage.setItem('ds_ap',AP);applyAP()};
var mv=document.getElementById('mval');if(mv)mv.textContent=((MODEL.indexOf('deepseek')===0&&KEY)?MODEL:'free relay')+' ›';
document.getElementById('mrow').onclick=function(){sys((MODEL.indexOf('deepseek')===0&&KEY)?('model: '+MODEL+' via your key'):'model: free relay brain. add a deepseek key in account settings to run deepseek-chat and deepseek-reasoner directly')};
document.getElementById('fontsz').onclick=function(){FZ=(FZ+1)%3;localStorage.setItem('ds_fz',FZ);document.documentElement.style.fontSize=FZS[FZ][1]+'%';document.getElementById('fzval').textContent=FZS[FZ][0]+' ›'};
document.getElementById('upd').onclick=function(){sys('2.9.0(6) — you are up to date')};
document.getElementById('agmt').onclick=function(){sys('this is your replica, service agreement: none')};
document.getElementById('help').onclick=function(){sys('feedback goes straight to the build notes')};
document.getElementById('logout').onclick=function(){sys('no account here to log out of')};
document.getElementById('voicebtn').onclick=function(){vsheet.style.display='block';closeSheet()};
document.getElementById('vconfirm').onclick=function(){var names=['Mira','Kai','Nova','Echo'];var i=Array.prototype.indexOf.call(document.getElementById('dots').children,document.querySelector('#dots .on'));localStorage.setItem('ds_voice',names[i]);document.getElementById('voicename').textContent=names[i]+' ›';vsheet.style.display='none';sys('voice: '+names[i])};
document.getElementById('dots').onclick=function(e){if(e.target.tagName!=='SPAN')return;var ds=document.getElementById('dots').children;for(var i=0;i<4;i++)ds[i].className='';e.target.className='on';var names=['Mira','Kai','Nova','Echo'];document.getElementById('vname').textContent=names[i];document.getElementById('vtag').textContent=['Versatile & Playful','Calm & Clear','Bright & Quick','Deep & Steady'][i]};
var savedv=localStorage.getItem('ds_voice');if(savedv){document.getElementById('voicename').textContent=savedv+' ›'}
document.getElementById('traceback').onclick=function(){trace.style.display='none'};
document.getElementById('histback').onclick=function(){hist.style.display='none'};
function openPanel(kind){
 closeSheet();panel.style.display='flex';ptitle.textContent=kind==='pers'?'Personalization':(kind==='data'?'Data controls':'Account settings');pbody.innerHTML='';
 if(kind==='data'){
  pbody.innerHTML='<div class="card"><div class="row"><span class="lb">Improve the model for everyone</span><div class="sw" id="swt"><i></i></div></div></div><div class="note">Allow your content to be used to train our models and improve our services. We secure your data privacy.</div><div class="card"><div class="row" id="shlinks"><span class="lb">Shared links</span><span class="val">›</span></div></div><div class="card"><div class="row" id="expd"><span class="lb">Export data</span><span class="val">›</span></div></div><div class="card"><div class="row red" id="delall"><span class="lb">Delete all chats</span></div></div>';
  var swt=document.getElementById('swt');swt.classList.toggle('on',localStorage.getItem('ds_train')!=='0');
  swt.onclick=function(){swt.classList.toggle('on');localStorage.setItem('ds_train',swt.classList.contains('on')?'1':'0')};
  document.getElementById('shlinks').onclick=function(){sys('no shared links yet')};
  document.getElementById('expd').onclick=function(){var blob=new Blob([JSON.stringify({chats:JSON.parse(localStorage.getItem('ds_h')||'[]'),memory:localStorage.getItem('ds_mem')||''},null,2)],{type:'application/json'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='deepseek-agent-data.json';a.click();sys('exported to your downloads')};
  document.getElementById('delall').onclick=function(){if(confirm('delete all chats?')){localStorage.removeItem('ds_h');HIST=[];chat.innerHTML='';chat.appendChild(welcome);document.getElementById('ctitle').textContent='';render();panel.style.display='none';sys('all chats deleted')}};
 }else if(kind==='pers'){
  pbody.innerHTML='<div class="card"><div class="row"><span class="lb">Automatically collapse thinking content</span><div class="sw" id="swc"><i></i></div></div></div><div class="note">When enabled, thinking content will automatically collapse after thinking is complete.</div>';
  var sw=document.getElementById('swc');sw.classList.toggle('on',localStorage.getItem('ds_collapse')!=='0');
  sw.onclick=function(){sw.classList.toggle('on');localStorage.setItem('ds_collapse',sw.classList.contains('on')?'1':'0')};
 }else{
  pbody.innerHTML='<div class="card"><div class="row"><span class="lb">DeepSeek key</span><span class="val" id="kstat">'+(KEY?'saved':'none')+'</span></div><div class="row" id="setkey"><span class="lb">Set / change key</span><span class="val">›</span></div></div><div class="note">a real deepseek key from platform.deepseek.com turns on the deepseek-chat and deepseek-reasoner brains. it stays in this browser only.</div>';
  document.getElementById('setkey').onclick=function(){var k=prompt('paste your deepseek api key');if(k&&k.trim()){KEY=k.trim();localStorage.setItem('ds_key',KEY);document.getElementById('kstat').textContent='saved';sys('deepseek key saved')}};
 }
}
document.getElementById('back').onclick=function(){panel.style.display='none'};
document.getElementById('sheetx').onclick=function(){closeSheet()};
document.getElementById('panx').onclick=function(){panel.style.display='none'};
document.querySelectorAll('[data-go]').forEach(function(r){r.onclick=function(){openPanel(r.dataset.go)}});
var HIST=[];
function el(cls,html){var w=document.getElementById('welcome');if(w&&w.parentNode)w.remove();var d=document.createElement('div');d.className='msg '+cls;if(html!=null)d.innerHTML=html;chat.appendChild(d);chat.scrollTop=1e9;return d}
function sys(t){el('sys',t)}
function save(title){var l=JSON.parse(localStorage.getItem('ds_h')||'[]');if(!l.length||l[0]!==title){l.unshift(title);localStorage.setItem('ds_h',JSON.stringify(l.slice(0,12)))}}
function render(){var l=JSON.parse(localStorage.getItem('ds_h')||'[]');var hl=document.getElementById('histlist');hl.innerHTML='';l.forEach(function(t,i){var d=document.createElement('div');d.className='hrow';var s=document.createElement('span');s.textContent=t;var x=document.createElement('b');x.textContent='✕';x.onclick=function(ev){ev.stopPropagation();l.splice(i,1);localStorage.setItem('ds_h',JSON.stringify(l));render()};d.appendChild(s);d.appendChild(x);hl.appendChild(d)})}
render();
var lpTimer=null,lpMsg=null;
function actsHtml(){return '<div class="acts">'+
'<button data-a="copy" title="copy"><svg viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg></button>'+
'<button data-a="up" title="good reply"><svg viewBox="0 0 24 24"><path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1zM7 11l4-7a2 2 0 0 1 3 2l-1 5h6a2 2 0 0 1 2 2.3l-1 6A2 2 0 0 1 18 20H7"/></svg></button>'+
'<button data-a="down" title="bad reply"><svg viewBox="0 0 24 24" style="transform:rotate(180deg)"><path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1zM7 11l4-7a2 2 0 0 1 3 2l-1 5h6a2 2 0 0 1 2 2.3l-1 6A2 2 0 0 1 18 20H7"/></svg></button>'+
'<button data-a="speak" title="read aloud"><svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg></button></div>'}
function ctxItems(){return [['edit','Edit','<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 7l3 3"/>'],['copy','Copy','<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>'],['select','Select text','<path d="M9 4v3M4 9h3M20 9h-3M15 4v3M4 15v3a2 2 0 0 0 2 2h3M20 15v3a2 2 0 0 1-2 2h-3M4 4h4M20 4h-4"/>'],['share','Share','<path d="M13 5l6 6-6 6v-4C7 13 5 15 3 19c0-7 4-10 10-10z"/>']].map(function(i){return '<div class="ctxi" data-ctx="'+i[0]+'"><svg viewBox="0 0 24 24">'+i[2]+'</svg>'+i[1]+'</div>'}).join('')}
function openCtx(d){
 lpMsg=d;var app=document.getElementById('app'),appR=app.getBoundingClientRect(),r=d.getBoundingClientRect();
 var ctx=document.getElementById('ctx');ctx.innerHTML=ctxItems();ctx.style.display='block';
 ctx.style.left=Math.max(10,Math.min(r.left-appR.left,appR.width-240))+'px';
 ctx.style.top=Math.min(r.bottom-appR.top+8,appR.height-270)+'px';
 document.getElementById('cback').style.display='block';
}
function closeCtx(){document.getElementById('ctx').style.display='none';document.getElementById('cback').style.display='none';lpMsg=null}
document.getElementById('cback').onclick=closeCtx;
document.getElementById('ctx').addEventListener('click',function(e){
 var it=e.target.closest('.ctxi');if(!it||!lpMsg)return;closeCtx();
 var raw=lpMsg.dataset.raw||lpMsg.textContent,a=it.dataset.ctx;
 if(a==='copy'){navigator.clipboard.writeText(raw).then(function(){sys('copied')})}
 else if(a==='select'){var rng=document.createRange();rng.selectNodeContents(lpMsg);var sel=window.getSelection();sel.removeAllRanges();sel.addRange(rng);sys('text selected, copy from the menu')}
 else if(a==='edit'){var n=prompt('edit message',raw);if(n&&n.trim()){lpMsg.textContent=n.trim();lpMsg.dataset.raw=n.trim();for(var i=0;i<HIST.length;i++){if(HIST[i].content===raw){HIST[i].content=n.trim();break}}sys('message edited')}}
 else if(a==='share'){if(navigator.share){navigator.share({text:raw}).catch(function(){})}else{navigator.clipboard.writeText(raw).then(function(){sys('copied to share')})}}
});
chat.addEventListener('touchstart',function(e){var d=e.target.closest?e.target.closest('.msg.you'):null;if(!d)return;lpTimer=setTimeout(function(){openCtx(d)},450)},{passive:true});
['touchend','touchmove','touchcancel'].forEach(function(ev){chat.addEventListener(ev,function(){clearTimeout(lpTimer)})});
chat.addEventListener('contextmenu',function(e){var d=e.target.closest?e.target.closest('.msg.you'):null;if(d){e.preventDefault();openCtx(d)}});
chat.addEventListener('click',function(e){
 var t=e.target;
 var ab=t.closest?t.closest('.acts button'):null;
 if(ab){var d=ab.closest('.msg.ai');var raw=d&&d.dataset.raw||'';
  if(ab.dataset.a==='copy'){navigator.clipboard.writeText(raw).then(function(){sys('copied')})}
  else if(ab.dataset.a==='speak'){speak(raw)}
  else{ab.classList.toggle('on');var oth=ab.parentNode.querySelectorAll('button');for(var q=0;q<oth.length;q++){if(oth[q]!==ab&&(oth[q].dataset.a==='up'||oth[q].dataset.a==='down'))oth[q].classList.remove('on')}sys('thanks for the feedback')}
  return}
 if(t.classList&&t.classList.contains('cpy')){navigator.clipboard.writeText(decodeURIComponent(t.getAttribute('data-c'))).then(function(){sys('copied')});return}
 if(t.classList&&t.classList.contains('thd')){t.parentNode.classList.toggle('open');return}
 if(t.classList&&t.classList.contains('spk')){var d2=t.closest('.msg.ai');var raw2=d2&&d2.dataset.raw||'';if(t.dataset.copy){navigator.clipboard.writeText(raw2).then(function(){sys('copied')})}else{speak(raw2);sys('reading aloud')}return}
});
(function(){var ws=document.getElementById('wsugg');['explain a hard idea simply','help me plan my day','write something funny'].forEach(function(q){var b=document.createElement('button');b.className='wchip';b.textContent=q;b.onclick=function(){inp.value=q;setSend();submit()};ws.appendChild(b)})})();
function bm(){return (MODEL.indexOf('deepseek')===0&&KEY)?MODEL:'openai-fast'}

function st(label,detail,run){var d=document.createElement('div');d.className='st'+(run?' run':'');d.innerHTML='<b></b><span></span>';d.querySelector('b').textContent=label;d.querySelector('span').textContent=detail||'';steps.appendChild(d);trace.scrollTop=1e9;return d}
function clip2(s,n){s=String(s||'').replace(/\s+/g,' ').trim();return s.length>n?s.slice(0,n)+'…':s}
function fT(url,max){var t=null;return Promise.race([fetch(url).then(function(r){if(!r.ok)throw 0;return r.text()}).then(function(x){t=x;return x}),new Promise(function(res){setTimeout(function(){res(null)},9000)})]).then(function(x){return x?clip2(x,max):null})['catch'](function(){return t?clip2(t,max):null})}
function skillText(name){var k='ds_sk_'+name;var t=localStorage.getItem(k),at=parseInt(localStorage.getItem(k+'_at')||'0',10);if(t&&Date.now()-at<7*864e5)return Promise.resolve(t);return fetch('https://raw.githubusercontent.com/morluto/rea/main/.agents/skills/'+name+'/SKILL.md').then(function(r){if(!r.ok)throw 0;return r.text()}).then(function(full){localStorage.setItem(k,full);localStorage.setItem(k+'_at',String(Date.now()));return full})['catch'](function(){return t||''})}
function reconEv(q){
 var gh=q.match(/github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)/i);
 var um=q.match(/https?:\/\/[^\s'"<>]+|www\.[^\s'"<>]+|\b[a-z0-9][a-z0-9-]*\.(?:com|net|org|io|dev|ai|co|app|xyz|me|gg|shop|store|online|site|pages\.dev)(?:\/[^\s'"<>]*)?/i);
 var nm=q.match(/(?:\bnpm\b|\bpackage\b|\bunpkg\b)\s+(?:package\s+|called\s+|named\s+)?([@a-z0-9][@a-z0-9._\/-]{1,60})/i);
 var jobs=[];
 if(um){var u=um[0].replace(/[.,;:!)]+$/,'');if(!/^https?:\/\//i.test(u))u='https://'+u;if(!gh||u.indexOf('github.com')===-1)jobs.push(fT('https://r.jina.ai/'+u,2600).then(function(t){return t||fT('https://api.allorigins.win/raw?url='+encodeURIComponent(u),2600)}))}
 if(gh){var rp=gh[2].replace(/\.git$/,'');jobs.push(Promise.all([fT('https://api.github.com/repos/'+gh[1]+'/'+rp,900),fT('https://raw.githubusercontent.com/'+gh[1]+'/'+rp+'/main/README.md',2600)]).then(function(a){return (a[0]||a[1])?('REPO METADATA: '+(a[0]||'(meta unreachable)')+'\n\nREADME:\n'+(a[1]||'(README unreachable)')):null}))}
 if(!um&&!gh&&nm){var clean=nm[1].replace(/[.,;:!)]+$/,'');jobs.push(Promise.all([fT('https://registry.npmjs.org/'+clean,1200),fT('https://unpkg.com/'+clean+'/package.json',1600)]).then(function(a){if(!a[0]&&!a[1])return null;var main=null;try{var pj=JSON.parse(a[1]||a[0]||'{}');main=pj.main||pj.module||pj.browser||null}catch(e){}return fT('https://unpkg.com/'+clean+'/'+main,2600).then(function(s){return 'REGISTRY RECORD: '+clip2(a[0]||a[1],900)+'\n\nPACKAGE.JSON: '+clip2(a[1]||'(unpkg unreachable)',1200)+(s?'\n\nMAIN FILE SOURCE ('+main+'):\n'+s:'')})}))}
 if(!jobs.length)return Promise.resolve(null);
 return Promise.all(jobs).then(function(rs){var got=rs.filter(Boolean);return got.length?got.join('\n\n-----\n\n'):null})
}
function reaBlock(sk,ev){
 var block='\n\n[REA RUN — Reverse Engineer Anything, github.com/morluto/rea, MIT]';
 if(sk)block+='\n\nSKILL METHOD (live skill, follow its routes for this task):\n'+String(sk).slice(0,13000);
 if(ev)block+='\n\nLIVE EVIDENCE (fetched right now from the target; treat as shipped-artifact evidence, cite it, and mark every inference as an inference):\n'+ev;
 else block+='\n\nTARGET EVIDENCE COULD NOT BE FETCHED. Apply the skill discipline anyway: state your assumptions plainly and label what is unverified.';
 block+='\nEnd of skill run.';
 return block;
}
function skillNames(){var t=localStorage.getItem('ds_skills');var at=parseInt(localStorage.getItem('ds_skills_at')||'0',10);if(t&&Date.now()-at<864e5){try{return Promise.resolve(JSON.parse(t))}catch(e){}}return fetch('https://api.github.com/repos/morluto/rea/contents/.agents/skills').then(function(r){return r.json()}).then(function(d){var l=d.filter(function(i){return i.type==='dir'}).map(function(i){return i.name});localStorage.setItem('ds_skills',JSON.stringify(l));localStorage.setItem('ds_skills_at',String(Date.now()));return l})['catch'](function(){return t?JSON.parse(t):['reverse-engineer-anything']})}
var SKILLS=['reverse-engineer-anything'];
var TOOLS={
 'web.search':function(q){return fetch('https://r.jina.ai/https://html.duckduckgo.com/html/?q='+encodeURIComponent(q)).then(function(r){return r.text()}).then(function(t){return t.slice(0,3200)})},
 'web.read':function(u){SRC.indexOf(u)<0&&SRC.push(u);return fetch('https://r.jina.ai/'+u).then(function(r){return r.text()}).then(function(t){return t.slice(0,3200)})},
 'math.calc':function(x){try{if(!/^[-+*/%.()0-9\s^]+$/.test(x))return 'numbers and +-*/ only';return String(Function('"use strict";return ('+x.replace(/\^/g,'**')+')')())}catch(e){return 'calc failed'}},
 'memory':function(x){if(/^load\b/i.test(x))return localStorage.getItem('ds_mem')||'(empty)';var m=(localStorage.getItem('ds_mem')||'');m=(m?m+'\n':'')+x;localStorage.setItem('ds_mem',m);return 'stored.'},
 'clock':function(){return new Date().toString()},
 'translate':function(x){var p=String(x).split('|');if(p.length<3)return 'format: text|from|to like bonjour|fr|en';return fetch('https://api.mymemory.translated.net/get?q='+encodeURIComponent(p[0])+'&langpair='+p[1]+'|'+p[2]).then(function(r){return r.json()}).then(function(d){return (d.responseData&&d.responseData.translatedText)||'no translation'})},
 'weather':function(x){return fetch('https://geocoding-api.open-meteo.com/v1/search?count=1&name='+encodeURIComponent(String(x).trim())).then(function(r){return r.json()}).then(function(g){var p=g.results&&g.results[0];if(!p)return 'city not found';return fetch('https://api.open-meteo.com/v1/forecast?latitude='+p.latitude+'&longitude='+p.longitude+'&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&forecast_days=3').then(function(r){return r.json()}).then(function(w){var c=w.current,d=w.daily;return p.name+': '+c.temperature_2m+'C, humidity '+c.relative_humidity_2m+'%, wind '+c.wind_speed_10m+'km/h, weather code '+c.weather_code+'. next 3 days high/low C: '+d.temperature_2m_max.join('/')+' / '+d.temperature_2m_min.join('/')})})},
 'currency':function(x){var p=String(x).trim().split(/\s+/);var a=parseFloat(p[0])||1,f=(p[1]||'USD').toUpperCase(),t=(p[2]||'EUR').toUpperCase();return fetch('https://open.er-api.com/v6/latest/'+f).then(function(r){return r.json()}).then(function(d){var r=d.rates&&d.rates[t];if(!r)return 'no rate';return a+' '+f+' = '+(a*r).toFixed(2)+' '+t})},
 'wiki':function(x){return fetch('https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(String(x).trim().replace(/\s+/g,'_'))).then(function(r){return r.json()}).then(function(d){return d.extract||'no page found'})},
 'qr':function(x){return 'QR image ready, give this link in your final answer: https://api.qrserver.com/v1/create-qr-code/?size=300x300&data='+encodeURIComponent(String(x))},
 'js.run':function(x){try{var r;try{r=Function('"use strict";return ('+x+')')()}catch(e){r=Function('"use strict";'+x)()}return JSON.stringify(r===undefined?'done':r).slice(0,800)}catch(e){return 'error: '+e.message}},
 'image.gen':function(x){return 'image ready, give this link in your final answer: https://image.pollinations.ai/prompt/'+encodeURIComponent(String(x))+'?width=768&height=768'},
 'news':function(x){return fetch('https://r.jina.ai/https://news.google.com/rss/search?q='+encodeURIComponent(String(x)||'top news')).then(function(r){return r.text()}).then(function(t){return t.slice(0,2500)})},
 'define':function(x){return fetch('https://api.dictionaryapi.dev/api/v2/entries/en/'+encodeURIComponent(String(x).trim())).then(function(r){return r.json()}).then(function(d){if(!Array.isArray(d))return 'no entry';return d[0].word+' - '+d[0].meanings.map(function(mn){return mn.partOfSpeech+': '+mn.definitions[0].definition}).join('; ').slice(0,600)})},
 'crypto':function(x){var p=String(x).trim().split(/\s+/);var id=(p[0]||'bitcoin').toLowerCase(),vs=(p[1]||'usd').toLowerCase();return fetch('https://api.coingecko.com/api/v3/simple/price?ids='+id+'&vs_currencies='+vs).then(function(r){return r.json()}).then(function(d){if(!d[id])return 'unknown coin';return id+' = '+d[id][vs]+' '+vs.toUpperCase()})},
 'rea':function(x){var q=String(x);return Promise.all([skillText('reverse-engineer-anything'),reconEv(q)]).then(function(r){return reaBlock(r[0],r[1])+'\nAnswer by walking artifact -> observation -> conclusion, marking every inference as an inference.'})},
 'skills':function(x){
  var q=String(x).trim();
  return skillNames().then(function(l){
   SKILLS=l;HARNESS=buildHarness();
   if(!q||/^list\b/i.test(q))return 'skills installed ('+l.length+'): '+l.join(', ')+' - load one with input "<name> <target or question>"';
   var ql=q.toLowerCase(),name=null;
   for(var i=0;i<l.length;i++){if(ql.indexOf(l[i].toLowerCase())===0){name=l[i];break}}
   if(!name){for(var j=0;j<l.length;j++){if(ql.indexOf(l[j].toLowerCase().replace(/^rea-/,''))>-1){name=l[j];break}}}
   if(!name)return 'skills installed: '+l.join(', ')+' - pass one of these names first';
   var rest=q.slice(name.length).replace(/^[\s:,.-]+/,'');
   return Promise.all([skillText(name),rest?reconEv(rest):Promise.resolve(null)]).then(function(r){return reaBlock(r[0],r[1])+'\nFollow the loaded skill method on the request. Mark every inference as an inference.'})
  })
 }
};
var CTRL=null;
function call(body,tries){return callStream(body,null,tries)}
function callStream(body,onChunk,tries){
 tries=tries||0;
 var url='https://text.pollinations.ai/openai',hdrs={'Content-Type':'application/json'};
 if(MODEL.indexOf('deepseek')===0&&KEY){url='https://api.deepseek.com/v1/chat/completions';hdrs.Authorization='Bearer '+KEY}
 if(!(MODEL.indexOf('deepseek')===0&&KEY))body.model='openai-fast';
 body.stream=true;CTRL=new AbortController();
 return fetch(url,{method:'POST',headers:hdrs,body:JSON.stringify(body),signal:CTRL.signal}).then(function(r){
  if(STOP)throw new Error('stopped');
  if(!r.ok){if(r.status===402||r.status===429){sys('relay cooling, retrying in 46 seconds...');return new Promise(function(s){setTimeout(s,46000)}).then(function(){return callStream(body,onChunk,tries+1)})}if(r.status===401)throw new Error('key rejected');throw new Error('relay '+r.status)}
  if(!r.body){return r.json().then(function(j){var t=j&&j.choices&&j.choices[0]&&(j.choices[0].message.content||j.choices[0].message.reasoning)||'';if(onChunk)onChunk(t);return t})}
  var rd=r.body.getReader(),dec=new TextDecoder(),buf='',full='';
  function pump(){return rd.read().then(function(d){
   if(d.done){if(!full&&tries<2)return new Promise(function(s){setTimeout(s,3000)}).then(function(){return callStream(body,onChunk,tries+1)});return full}
   buf+=dec.decode(d.value,{stream:true});
   var ls=buf.split('\n');buf=ls.pop();
   ls.forEach(function(l){l=l.trim();if(l.slice(0,5)!=='data:')return;var p=l.slice(5).trim();if(p==='[DONE]')return;try{var j=JSON.parse(p);var ch=j.choices&&j.choices[0];var c=(ch&&(ch.delta&&ch.delta.content||ch.message&&ch.message.content)||ch&&ch.text)||'';if(c){full+=c;if(onChunk)onChunk(full)}}catch(e){}});
   return pump();
  })}
  return pump();
 }).catch(function(e){if(e.name==='AbortError')throw new Error('stopped');throw e});
}
function buildHarness(){return 'You are DeepSeek Agent, an autonomous agent built on the DeepSeek Harness design (deepseek-ai/deepseek-harness: everything is a plugin). REA IS MANDATORY: on ANY question about how a site, app, tool, repo, package or piece of software works, what powers it, what it is built with, or any reverse-engineer, decompile, take-apart, inspect, analyze or explain-the-internals ask, your FIRST reply MUST be the rea tool call with the target in tool_input, 100% of the time, no exceptions, even when you think you already know the answer. Only an ask that names the skill library itself goes to skills instead. Current date: '+new Date().toDateString()+'. Plugins: web.search (search the web), web.read (read a page url), math.calc (calculate), memory (pass "load" to read, text to store), clock, translate ("text|from|to" like "bonjour|fr|en"), weather (city), currency ("100 USD EUR"), wiki (topic), qr (text -> returns a qr image link), js.run (javascript expression), image.gen (prompt -> returns an image link), news (topic), define (word), crypto ("bitcoin usd"), rea (REVERSE ENGINEER ANYTHING: pass the target (a site url, a github.com/owner/repo repo, or an npm package) and it pulls the live REA skill plus real shipped-artifact evidence from the target itself; use rea on any reverse-engineer, decompile, take-apart, how-was-this-built, what-is-it-powered-by, or inspect/analyze-a-target question, and answer from its evidence walking artifact -> observation -> conclusion, marking every inference as an inference; this tool is MANDATORY on such asks, never answer them from memory), skills (THE WHOLE SKILL LIBRARY: the agent has every skill, not just rea - input "list" returns all installed skills, input "<skill-name> <target or question>" loads that skill\'s live method plus evidence on the target; installed skills: '+SKILLS.join(', ')+'). When tools are needed reply ONLY with one JSON object, no prose:\n{"plan":["step1","step2"],"next_step":0,"tool":"none|web.search|web.read|math.calc|memory|clock|translate|weather|currency|wiki|qr|js.run|image.gen|news|define|crypto|rea|skills","tool_input":"..."}\nor when done, or the question needs no tools:\n{"final":"full answer, cite sources"}\nMake a short plan (1-4 steps) for anything needing facts or math. Run tools one at a time; you will be re-asked after each tool result. Verify math with math.calc. After a rea run, build your final answer on the evidence the run returned, walking artifact -> observation -> conclusion. Include any qr or image.gen link in your final answer. Never invent facts. Example JSON: {"plan":["calculate 18% of 4395"],"next_step":0,"tool":"math.calc","tool_input":"4395*0.18"} Another example: {"final":"The answer is 791.10, from math.calc."}'}
var HARNESS=buildHarness();
var HARNESS_PLAIN='You are DeepSeek Agent, a sharp, friendly assistant. Answer directly in clean markdown. If the question asks how a site, app, repo or package works, or anything reverse-engineering flavored, tell the user to switch agent mode on so the REA run can happen. Current date: '+new Date().toDateString()+'.';
function brain(u){var model=(MODEL.indexOf('deepseek')===0&&KEY)?MODEL:'openai-fast';return call({model:model,messages:[{role:'system',content:HARNESS}].concat(HIST.slice(-6),[{role:'user',content:u}])})}
function finish(){RUNNING=false;setSend()}
function esc(x){return String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function md(t){
 t=esc(t);var blocks=[];
 t=t.replace(/```(\w*)\n?([\s\S]*?)```/g,function(m,l,c){blocks.push('<div class="code"><div class="chead"><span>'+(l||'code')+'</span><button class="cpy" data-c="'+encodeURIComponent(c)+'">copy</button></div><pre>'+c.replace(/\n$/,'')+'</pre></div>');return '\u0000B'+(blocks.length-1)+'\u0000'});
 t=t.replace(/`([^`\n]+)`/g,'<code>$1</code>');
 t=t.replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>');
 t=t.replace(/^### (.+)$/gm,'<h4>$1</h4>').replace(/^## (.+)$/gm,'<h3>$1</h3>');
 t=t.replace(/^[-*] (.+)$/gm,'<li>$1</li>');
 t=t.replace(/\n/g,'<br>');
 t=t.replace(/\u0000B(\d+)\u0000/g,function(m,i){return blocks[+i]});
 return t;
}
function speak(txt){try{var u=new SpeechSynthesisUtterance(txt.replace(/[#*`>|]/g,''));var vs=speechSynthesis.getVoices().filter(function(v){return v.lang.indexOf('en')===0});if(vs.length){var i=(['Mira','Kai','Nova','Echo'].indexOf(localStorage.getItem('ds_voice')||'Mira')+1)%vs.length;u.voice=vs[i]}speechSynthesis.speak(u)}catch(e){}}
var SRC=[];
function finishBubble(d,txt,th,started){
 var html='';
 if(th)html+='<div class="think"><button class="thd">thought for '+Math.max(1,Math.round((Date.now()-started)/1000))+'s</button><div class="tbody">'+esc(th)+'</div></div>';
 html+=md(txt);
 if(SRC.length)html+='<div class="srcs">sources: '+SRC.slice(0,3).map(function(u){return '<a href="'+u+'" target="_blank" rel="noopener">'+u.replace(/^https?:\/\//,'').slice(0,60)+'</a>'}).join(' | ')+'</div>';
 html+=actsHtml()+'<div class="sugg" data-sg></div>';
 d.innerHTML=html;d.dataset.raw=txt;
 var sg=d.querySelector('[data-sg]');
 var sgq={model:bm(),messages:[{role:'user',content:'Here is an exchange. Reply ONLY a JSON array of 3 very short follow-up questions the user might ask next. Exchange: '+(HIST.slice(-2).map(function(m){return m.content.slice(0,300)}).join(' | '))}]};
 call(sgq).then(function(r){try{var a=JSON.parse(r.match(/\[[\s\S]*\]/)[0]);sg.innerHTML='';a.slice(0,3).forEach(function(q){var b=document.createElement('button');b.className='sgchip';b.textContent=q;b.onclick=function(){inp.value=q;setSend();submit()};sg.appendChild(b)})}catch(e){}}).catch(function(){});
 HIST.push({role:'assistant',content:txt});save(txt.slice(0,40));finish();
}
function bubble(txt){var t=String(txt).trim()||'(empty)';var d=el('ai');d.dataset.raw=t;d.innerHTML=md(t)+actsHtml();HIST.push({role:'assistant',content:t});save(t.slice(0,40));finish()}
function run(goal){
 RUNNING=true;STOP=false;setSend();var turns=0,plan=null,repaired=false;
 st('GOAL',goal,true);
 function ask(note){
  if(STOP){sys('stopped.');finish();return}
  var u=goal+(note?('\n\n[last tool result]: '+note):'');
  return brain(u).then(function(raw){
   turns++;if(turns>7){bubble('agent hit the step limit: '+raw);return}
   var j=null;try{var m=raw.match(/\{[\s\S]*\}/);j=JSON.parse(m?m[0]:raw)}catch(e){}
   if(!j||(!j.final&&!Array.isArray(j.plan))){
    if(!repaired){repaired=true;return ask('STOP. Your last reply was plain text, which is invalid. Reply ONLY with one JSON object: either the plan/tool object or {"final":"..."}. Goal: '+goal+(note?' Last result: '+note.slice(0,400):''))}
    bubble(raw);return}
   repaired=false;
   if(j.final){bubble(j.final);return}
   if(j.plan)plan=j.plan;
   var idx=(typeof j.next_step==='number')?j.next_step:0;
   if(plan&&plan[idx]){
    var s=st('STEP '+(idx+1)+'/'+plan.length,plan[idx]+(j.tool&&j.tool!=='none'?' ['+j.tool+']':''),true);
    if(!j.tool||j.tool==='none'||!TOOLS[j.tool]){ask('step '+(idx+1)+': if done reply final, else pick a tool')}
    else{TOOLS[j.tool](String(j.tool_input||'')).then(function(out){
     s.classList.remove('run');s.querySelector('span').textContent=plan[idx]+' ['+j.tool+'] -> '+String(out).slice(0,120).replace(/\n/g,' ');
     ask(out.slice(0,2800));
    }).catch(function(e){s.classList.remove('run');s.querySelector('span').textContent=plan[idx]+' ['+j.tool+'] failed';ask('tool failed: '+e.message)})}
   }else{bubble(raw)}
  }).catch(function(e){if(e.message!=='stopped')bubble('agent run failed: '+e.message);finish()});
 }
 ask('');
}
function plain(goal){
 RUNNING=true;setSend();var started=Date.now();
 function thinkPass(){
  if(!DT)return streamAnswer('');
  st('THINKING','reasoning pass',true);var t0=Date.now();
  return call({model:bm(),messages:[{role:'system',content:'Think step by step. Output ONLY concise reasoning notes, max 120 words. Do not answer the question.'}].concat(HIST.slice(-4),[{role:'user',content:goal}])}).then(function(th){
   th=String(th||'').slice(0,1500);
   var s=steps.lastElementChild;if(s){s.classList.remove('run');s.querySelector('span').textContent='reasoned '+Math.max(1,Math.round((Date.now()-t0)/1000))+'s'}
   return streamAnswer(th);
  }).catch(function(){return streamAnswer('')});
 }
 function streamAnswer(th){
  var d=el('ai');d.innerHTML='<span class="cursor">.</span>';
  return callStream({model:bm(),messages:[{role:'system',content:HARNESS_PLAIN}].concat(HIST.slice(-6),th?[{role:'system',content:'Private reasoning notes to build on:\n'+th}]:[],[{role:'user',content:goal}])},function(full){
   d.innerHTML=md(full)+'<span class="cursor">.</span>';chat.scrollTop=1e9;
  }).then(function(full){
   if(!full)throw new Error('relay gave nothing');
   finishBubble(d,full,th,started);
  }).catch(function(e){
   if(e.message==='stopped'){finish();return}
   d.remove();bubble('failed: '+e.message);finish();
  });
 }
 thinkPass();
}
function submit(){
 if(RUNNING){STOP=true;if(CTRL){try{CTRL.abort()}catch(e){}}sys('stopped');setSend();return}
 var v=inp.value.trim();if(!v)return;inp.value='';inp.style.height='auto';setSend();
 if(FILECTX){v='[attached file: '+FILECTX.name+']\n'+FILECTX.text+'\n\n'+v;FILECTX=null}
 var urls=(v.match(/https?:\/\/[^\s)]+/g)||[]).slice(0,2);
 SRC=[];
 function proceed(txt){
  var ud=el('you');ud.textContent=txt;ud.dataset.raw=txt;
  var ct=document.getElementById('ctitle');if(!ct.textContent)ct.textContent=txt.slice(0,30);
  HIST.push({role:'user',content:txt});
  if(AGENT){run(txt)}else{plain(txt)}
 }
 if(urls.length){sys('reading '+urls.length+' link'+(urls.length>1?'s':'')+'...');
  Promise.all(urls.map(function(u){SRC.push(u);return TOOLS['web.read'](u).catch(function(){return ''})})).then(function(pages){
   var pc=pages.map(function(t,i){return t?'[page content of '+urls[i]+']\n'+t:''}).filter(Boolean).join('\n\n');
   if(pc)v=v+'\n\n'+pc;else sys('could not read those links');
   proceed(v);
  });
 }else{proceed(v)}
}
var sendbtn=document.getElementById('send');
function setSend(){sendbtn.style.display=(inp.value.trim()||RUNNING)?'block':'none';sendbtn.querySelector('circle').setAttribute('fill',RUNNING?'#e5484d':'#4d6bfe');sendbtn.querySelector('path').setAttribute('d',RUNNING?'M9 9h6v6H9z':'M12 17V8M8.5 11.5 12 8l3.5 3.5')}
inp.addEventListener('input',setSend);setSend();
sendbtn.onclick=submit;
inp.addEventListener('input',function(){inp.style.height='auto';inp.style.height=Math.min(inp.scrollHeight,110)+'px'});
inp.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submit()}});
var prev=localStorage.getItem('ds_mem');if(prev)st('MEMORY LOADED',prev.slice(0,80),false);
skillNames().then(function(l){if(l&&l.length){SKILLS=l;HARNESS=buildHarness()}})['catch'](function(){});
})();