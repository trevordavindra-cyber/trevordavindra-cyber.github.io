/* chatgpt - v1.6 (deepagent27), same relay brain, REA mandatory, chat history restore + sidebar search + regenerate */
(function(){
var chat=document.getElementById('chat'),inp=document.getElementById('inp');
var steps=document.getElementById('steps'),sheet=document.getElementById('sheet'),panel=document.getElementById('panel');
var trace=document.getElementById('trace'),pbody=document.getElementById('pbody'),ptitle=document.getElementById('ptitle');
var welcome=document.getElementById('welcome');
var KEY=localStorage.getItem('ds_key')||'';
var MODEL=localStorage.getItem('ds_m')||'openai-fast';
if(!KEY&&MODEL.indexOf('deepseek')===0)MODEL='openai-fast';
var AGENT=localStorage.getItem('ds_ag')!=='0';
var DT=localStorage.getItem('ds_dt')==='1';
var SRCH=localStorage.getItem('ds_sr')!=='0';
var RUNNING=false,STOP=false,FILECTX=null,AP=localStorage.getItem('ds_ap')||'System';
var HIST=[],SRC=[],SKILLS=['reverse-engineer-anything'],HARNESS='',CTRL=null;
function applyAP(){document.body.classList.toggle('dark',AP==='Dark'||(AP==='System'&&window.matchMedia('(prefers-color-scheme: dark)').matches));var a=document.getElementById('apval');if(a)a.textContent=AP}
applyAP();
function togchip(id,on){var e=document.getElementById(id);if(e)e.classList.toggle('on',on)}
togchip('thinkchip',DT);togchip('searchchip',SRCH);
var drawer=document.getElementById('drawer'),dback=document.getElementById('dback');
function closeDrawer(){drawer.style.display='none';dback.style.display='none'}
function renderD(){var l=JSON.parse(localStorage.getItem('ds_h')||'[]');var dc=document.getElementById('dchats');dc.innerHTML='';if(!l.length){var e=document.createElement('div');e.className='dchat';e.style.color='var(--dim)';e.textContent='no chats yet';dc.appendChild(e)}l.forEach(function(t,i){var d=document.createElement('div');d.className='dchat';var sp=document.createElement('span');sp.textContent=t;var x=document.createElement('b');x.textContent='\\u2715';x.onclick=function(ev){ev.stopPropagation();l.splice(i,1);localStorage.setItem('ds_h',JSON.stringify(l));renderD()};d.appendChild(sp);d.appendChild(x);d.onclick=newChat;dc.appendChild(d)})}
document.getElementById('menu').onclick=function(){renderD();drawer.style.display='flex';dback.style.display='block'};
dback.onclick=closeDrawer;
document.getElementById('dshare').onclick=function(){var txt=HIST.map(function(m){return (m.role==='user'?'You: ':'ChatGPT: ')+m.content}).join('\\n\\n');navigator.clipboard.writeText(txt||'(empty chat)').then(function(){sys('chat copied, paste it anywhere to share')});closeDrawer()};
document.getElementById('dbottom').onclick=function(){closeDrawer();sheet.style.display='block'};
function newChat(){HIST=[];SRC=[];chat.innerHTML='';chat.appendChild(welcome);closeDrawer();renderD()}
document.getElementById('newchat').onclick=newChat;
var ncd=document.getElementById('newchatd');if(ncd)ncd.onclick=newChat;
document.getElementById('mute').onclick=function(){sys('sound on for this chat')};
document.getElementById('thinkchip').onclick=function(){DT=!DT;localStorage.setItem('ds_dt',DT?'1':'0');togchip('thinkchip',DT);sys(DT?'think on: reasoning pass before answers':'think off')};
document.getElementById('searchchip').onclick=function(){SRCH=!SRCH;localStorage.setItem('ds_sr',SRCH?'1':'0');togchip('searchchip',SRCH);sys(SRCH?'search on: answers grounded with live web':'search off')};
document.getElementById('plus').onclick=function(){document.getElementById('file').click()};
document.getElementById('file').onchange=function(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(){FILECTX={name:f.name,text:String(r.result).slice(0,20000)};sys('attached: '+f.name)};r.readAsText(f)};
var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
document.getElementById('mic').onclick=function(){if(!SR){sys('voice input not supported in this browser');return}var r=new SR();r.lang='en-US';r.interimResults=false;r.onresult=function(e){inp.value+=e.results[0][0].transcript;setSend()};r.onerror=function(){sys('did not catch that')};r.start();sys('listening...')};
var dcx=document.getElementById('datactl');if(dcx)dcx.onclick=function(){openPanel('data')};
document.getElementById('appear').onclick=function(){AP=AP==='System'?'Light':(AP==='Light'?'Dark':'System');localStorage.setItem('ds_ap',AP);applyAP()};
document.getElementById('upd').onclick=function(){sys('2.9.7(14) - you are up to date')};
document.getElementById('agmt').onclick=function(){sys('this is your replica, service agreement: none')};
document.getElementById('help').onclick=function(){sys('feedback goes straight to the build notes')};
document.getElementById('logout').onclick=function(){sys('no account here to log out of')};
function openPanel(kind){
 sheet.style.display='none';panel.style.display='flex';ptitle.textContent=kind==='pers'?'Personalization':(kind==='data'?'Data controls':'Account settings');pbody.innerHTML='';
 if(kind==='data'){
  pbody.innerHTML='<div class="card"><div class="row"><span class="lb">Improve the model for everyone</span><div class="sw" id="swt"><i></i></div></div></div><div class="note">Allow your content to be used to train our models and improve our services. We secure your data privacy.</div><div class="card"><div class="row" id="shlinks"><span class="lb">Shared links</span><span class="val">\\u203a</span></div></div><div class="card"><div class="row" id="expd"><span class="lb">Export data</span><span class="val">\\u203a</span></div></div><div class="card"><div class="row red" id="delall"><span class="lb">Delete all chats</span></div></div>';
  var swt=document.getElementById('swt');swt.classList.toggle('on',localStorage.getItem('ds_train')!=='0');
  swt.onclick=function(){swt.classList.toggle('on');localStorage.setItem('ds_train',swt.classList.contains('on')?'1':'0')};
  document.getElementById('shlinks').onclick=function(){sys('no shared links yet')};
  document.getElementById('expd').onclick=function(){var blob=new Blob([JSON.stringify({chats:JSON.parse(localStorage.getItem('ds_h')||'[]'),memory:localStorage.getItem('ds_mem')||''},null,2)],{type:'application/json'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='chatgpt-data.json';a.click();sys('exported to your downloads')};
  document.getElementById('delall').onclick=function(){if(confirm('delete all chats?')){localStorage.removeItem('ds_h');HIST=[];chat.innerHTML='';chat.appendChild(welcome);renderD();panel.style.display='none';sys('all chats deleted')}};
 }else if(kind==='pers'){
  pbody.innerHTML='<div class="card"><div class="row" style="display:block"><div class="lb" style="margin-bottom:8px">Custom instructions</div><textarea id="ci" style="width:100%;height:120px;border:1px solid var(--ln);border-radius:12px;background:transparent;color:var(--tx);padding:10px;font:14px/1.5 inherit;resize:vertical"></textarea></div></div><div class="note">anything here is loaded with every chat as standing memory</div>';
  var ci=document.getElementById('ci');ci.value=localStorage.getItem('ds_mem')||'';
  ci.onchange=function(){localStorage.setItem('ds_mem',ci.value);sys('custom instructions saved')};
 }else{
  pbody.innerHTML='<div class="card"><div class="row"><span class="lb">DeepSeek key</span><span class="val" id="kstat">'+(KEY?'saved':'none')+'</span></div><div class="row" id="setkey"><span class="lb">Set / change key</span><span class="val">\\u203a</span></div></div><div class="note">a real deepseek key from platform.deepseek.com turns on the deepseek-chat and deepseek-reasoner brains. it stays in this browser only.</div>';
  document.getElementById('setkey').onclick=function(){var k=prompt('paste your deepseek api key');if(k&&k.trim()){KEY=k.trim();localStorage.setItem('ds_key',KEY);document.getElementById('kstat').textContent='saved';sys('deepseek key saved')}};
 }
}
document.getElementById('back').onclick=function(){panel.style.display='none'};
document.getElementById('sheetx').onclick=function(){sheet.style.display='none'};
document.getElementById('panx').onclick=function(){panel.style.display='none'};
document.querySelectorAll('[data-go]').forEach(function(r){r.onclick=function(){openPanel(r.dataset.go)}});
(function(){
 var MODELS=['free relay','deepseek-chat','deepseek-reasoner','deepseek-coder'];
 var mm=null;
 function close(){if(mm){mm.remove();mm=null}}
 function cur(){return (MODEL.indexOf('deepseek')===0&&KEY)?MODEL:'free relay'}
 function open(anchor){
  close();mm=document.createElement('div');mm.className='mmenu';
  MODELS.forEach(function(m){var o=document.createElement('div');o.textContent=m+(m===cur()?' \\u2713':'');if(m===cur())o.className='on';o.onclick=function(){close();if(m==='free relay'){MODEL='openai-fast';localStorage.setItem('ds_m',m)}else{MODEL=m;localStorage.setItem('ds_m',m)}var mv=document.getElementById('mval');if(mv)mv.textContent=cur()+' \\u203a';sys(m==='free relay'?'brain: free relay':'model set to '+m+(m.indexOf('deepseek')===0&&!KEY?' - add your deepseek key in account settings or it stays on the free relay':''))};mm.appendChild(o)});
  var r=anchor.getBoundingClientRect();mm.style.left=Math.max(10,Math.min(r.left,window.innerWidth-210))+'px';mm.style.top=(r.bottom+8)+'px';
  document.body.appendChild(mm);
 }
 document.addEventListener('click',function(e){if(mm&&e.target!==mm&&!mm.contains(e.target))close()});
 var mr=document.getElementById('mrow');if(mr)mr.onclick=function(e){e.stopPropagation();open(mr)};
 var br=document.getElementById('brand');if(br)br.onclick=function(e){e.stopPropagation();open(br)};
 var mv=document.getElementById('mval');if(mv)mv.textContent=cur()+' \\u203a';
})();
/* relay brain + REA core */
function el(cls,html){var w=document.getElementById('welcome');if(w&&w.parentNode)w.remove();var d=document.createElement('div');d.className='msg '+cls;if(html!=null)d.innerHTML=html;chat.appendChild(d);chat.scrollTop=1e9;return d}
function sys(t){el('sys',t)}
function save(title){var l=JSON.parse(localStorage.getItem('ds_h')||'[]');if(!l.length||l[0]!==title){l.unshift(title);localStorage.setItem('ds_h',JSON.stringify(l.slice(0,12)))}}
function actsHtml(){return '<div class="acts">'+'<button data-a="copy" title="copy"><svg viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg></button>'+'<button data-a="up" title="good reply"><svg viewBox="0 0 24 24"><path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1zM7 11l4-7a2 2 0 0 1 3 2l-1 5h6a2 2 0 0 1 2 2.3l-1 6A2 2 0 0 1 18 20H7"/></svg></button>'+'<button data-a="down" title="bad reply"><svg viewBox="0 0 24 24" style="transform:rotate(180deg)"><path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1zM7 11l4-7a2 2 0 0 1 3 2l-1 5h6a2 2 0 0 1 2 2.3l-1 6A2 2 0 0 1 18 20H7"/></svg></button>'+'<button data-a="speak" title="read aloud"><svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg></button>'+'</div>'}
function speak(txt){try{var u=new SpeechSynthesisUtterance(txt.replace(/[#*`>|]/g,''));speechSynthesis.speak(u)}catch(e){}}
chat.addEventListener('click',function(e){
 var t=e.target,ab=t.closest?t.closest('.acts button'):null;
 if(ab){var d=ab.closest('.msg.ai'),raw=d&&d.dataset.raw||'';
  if(ab.dataset.a==='copy'){navigator.clipboard.writeText(raw).then(function(){sys('copied')})}
  else if(ab.dataset.a==='speak'){speak(raw)}
  else{ab.classList.toggle('on');var oth=ab.parentNode.querySelectorAll('button');for(var q=0;q<oth.length;q++){if(oth[q]!==ab&&(oth[q].dataset.a==='up'||oth[q].dataset.a==='down'))oth[q].classList.remove('on')}}
  return}
 if(t.classList&&t.classList.contains('cpy')){navigator.clipboard.writeText(decodeURIComponent(t.getAttribute('data-c'))).then(function(){sys('copied')});return}
 if(t.classList&&t.classList.contains('thd')){t.parentNode.classList.toggle('open');return}
});
(function(){var ws=document.getElementById('wsugg');[
 ['Create image','M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z','make an image of a neon city at night'],
 ['Brainstorm','M12 3a6 6 0 0 1 3.5 10.9c-.5.4-.8 1-.8 1.6v.5h-5.4v-.5c0-.6-.3-1.2-.8-1.6A6 6 0 0 1 12 3zM10 19h4','give me 10 ideas for a weekend project'],
 ['Code','M8 6 3 12l5 6M16 6l5 6-5 6','write code that counts words in a text'],
 ['Get advice','M12 8v5M12 16v.5M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z','advise me on saving money as a student'],
 ['Surprise me','M12 3v18M3 12h18','surprise me']
].forEach(function(c){var b=document.createElement('button');b.className='wchip';b.innerHTML='<svg viewBox="0 0 24 24">'+c[1]+'</svg>';b.appendChild(document.createTextNode(c[0]));b.onclick=function(){var t=c[2];if(t==='surprise me'){var S=['Explain quantum computing like I am five','Write a haiku about my phone battery','Teach me one useful thing in 30 seconds','Plan a 3-day Tokyo trip on a budget'];t=S[Math.floor(Math.random()*S.length)]}inp.value=t;setSend();submit()};ws.appendChild(b)})})();
function bm(){return (MODEL.indexOf('deepseek')===0&&KEY)?MODEL:'openai-fast'}
function st(label,detail,run){var d=document.createElement('div');d.className='st'+(run?' run':'');d.innerHTML='<b></b><span></span>';d.querySelector('b').textContent=label;d.querySelector('span').textContent=detail||'';steps.appendChild(d);trace.scrollTop=1e9;return d}
function clip2(s,n){s=String(s||'').replace(/\s+/g,' ').trim();return s.length>n?s.slice(0,n)+'\\u2026':s}
function fT(url,max){var t=null;return Promise.race([fetch(url).then(function(r){if(!r.ok)throw 0;return r.text()}).then(function(x){t=x;return x}),new Promise(function(res){setTimeout(function(){res(null)},9000)})]).then(function(x){return x?clip2(x,max):null})['catch'](function(){return t?clip2(t,max):null})}
function skillText(name){var k='ds_sk_'+name;var t=localStorage.getItem(k),at=parseInt(localStorage.getItem(k+'_at')||'0',10);if(t&&Date.now()-at<7*864e5)return Promise.resolve(t);return fetch('https://raw.githubusercontent.com/morluto/rea/main/.agents/skills/'+name+'/SKILL.md').then(function(r){if(!r.ok)throw 0;return r.text()}).then(function(full){localStorage.setItem(k,full);localStorage.setItem(k+'_at',String(Date.now()));return full})['catch'](function(){return t||''})}
function reconEv(q){
 var gh=q.match(/github\\.com\\/([A-Za-z0-9_.-]+)\\/([A-Za-z0-9_.-]+)/i);
 var um=q.match(/https?:\\/\\/[^\\s'"<>]+|www\\.[^\\s'"<>]+|\\b[a-z0-9][a-z0-9-]*\\.(?:com|net|org|io|dev|ai|co|app|xyz|me|gg|shop|store|online|site|pages\\.dev)(?:\\/[^\\s'"<>]*)?/i);
 var jobs=[];
 if(um){var u=um[0].replace(/[.,;:!)]+$/,'');if(!/^https?:\\/\\//i.test(u))u='https://'+u;if(!gh||u.indexOf('github.com')===-1)jobs.push(fT('https://r.jina.ai/'+u,2600))}
 if(gh){var rp=gh[2].replace(/\\.git$/,'');jobs.push(Promise.all([fT('https://api.github.com/repos/'+gh[1]+'/'+rp,900),fT('https://raw.githubusercontent.com/'+gh[1]+'/'+rp+'/main/README.md',2600)]).then(function(a){return (a[0]||a[1])?('REPO METADATA: '+(a[0]||'(meta unreachable)')+'\\n\\nREADME:\\n'+(a[1]||'(README unreachable)')):null}))}
 if(!jobs.length)return Promise.resolve(null);
 return Promise.all(jobs).then(function(rs){var got=rs.filter(Boolean);return got.length?got.join('\\n\\n-----\\n\\n'):null})
}
function reaBlock(sk,ev){
 var block='\\n\\n[REA RUN - Reverse Engineer Anything, github.com/morluto/rea, MIT]';
 if(sk)block+='\\n\\nSKILL METHOD (live skill, follow its routes for this task):\\n'+String(sk).slice(0,13000);
 if(ev)block+='\\n\\nLIVE EVIDENCE (fetched right now from the target; treat as shipped-artifact evidence, cite it, and mark every inference as an inference):\\n'+ev;
 else block+='\\n\\nTARGET EVIDENCE COULD NOT BE FETCHED. Apply the skill discipline anyway: state your assumptions plainly and label what is unverified.';
 block+='\\nEnd of skill run.';
 return block;
}
function skillNames(){var t=localStorage.getItem('ds_skills');var at=parseInt(localStorage.getItem('ds_skills_at')||'0',10);if(t&&Date.now()-at<864e5){try{return Promise.resolve(JSON.parse(t))}catch(e){}}return fetch('https://api.github.com/repos/morluto/rea/contents/.agents/skills').then(function(r){return r.json()}).then(function(d){var l=d.filter(function(i){return i.type==='dir'}).map(function(i){return i.name});localStorage.setItem('ds_skills',JSON.stringify(l));localStorage.setItem('ds_skills_at',String(Date.now()));return l})['catch'](function(){return t?JSON.parse(t):['reverse-engineer-anything']})}
var TOOLS={
 'web.search':function(q){return fetch('https://r.jina.ai/https://html.duckduckgo.com/html/?q='+encodeURIComponent(q)).then(function(r){return r.text()}).then(function(t){return t.slice(0,3200)})},
 'web.read':function(u){SRC.indexOf(u)<0&&SRC.push(u);return fetch('https://r.jina.ai/'+u).then(function(r){return r.text()}).then(function(t){return t.slice(0,3200)})},
 'math.calc':function(x){try{if(!/^[-+*/(). 0-9]+$/.test(String(x)))throw 0;return String(Function('return('+x+')')())}catch(e){return 'bad expression'}},
 'memory':function(x){if(String(x)==='load')return localStorage.getItem('ds_mem')||'(memory empty)';localStorage.setItem('ds_mem',String(x));return 'stored'},
 'clock':function(){return new Date().toString()},
 'rea':function(x){return Promise.all([skillText('reverse-engineer-anything'),reconEv(String(x))]).then(function(r){return reaBlock(r[0],r[1])+'\\nAnswer by walking artifact -> observation -> conclusion, marking every inference as an inference.'})},
 'skills':function(x){
  var q=String(x).trim();
  return skillNames().then(function(l){SKILLS=l;
   if(!q||/^list\\b/i.test(q))return 'skills installed ('+l.length+'): '+l.join(', ')+' - load one with input "<skill-name> <target or question>"';
   var ql=q.toLowerCase(),name=null;
   for(var i=0;i<l.length;i++){if(ql.indexOf(l[i].toLowerCase())===0){name=l[i];break}}
   if(!name){for(var j=0;j<l.length;j++){if(ql.indexOf(l[j].toLowerCase().replace(/^rea-/,''))>-1){name=l[j];break}}}
   if(!name)return 'skills installed: '+l.join(', ')+' - pass one of these names first';
   var rest=q.slice(name.length).replace(/^[\\s:,.-]+/,'');
   return Promise.all([skillText(name),rest?reconEv(rest):Promise.resolve(null)]).then(function(r){return reaBlock(r[0],r[1])+'\\nFollow the loaded skill method on the request. Mark every inference as an inference.'})
  })
 }
};
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
   var ls=buf.split('\\n');buf=ls.pop();
   ls.forEach(function(l){l=l.trim();if(l.slice(0,5)!=='data:')return;var p=l.slice(5).trim();if(p==='[DONE]')return;try{var j=JSON.parse(p);var ch=j.choices&&j.choices[0];var c=(ch&&(ch.delta&&ch.delta.content||ch.message&&ch.message.content)||ch&&ch.text)||'';if(c){full+=c;if(onChunk)onChunk(full)}}catch(e){}});
   return pump();
  })}
  return pump();
 }).catch(function(e){if(e.name==='AbortError')throw new Error('stopped');throw e});
}
function buildHarness(){return 'You are ChatGPT, a sharp, friendly assistant. REA IS MANDATORY: on ANY question about how a site, app, tool, repo, package or piece of software works, what powers it, what it is built with, or any reverse-engineer, decompile, take-apart, inspect, analyze or explain-the-internals ask, your FIRST reply MUST be the rea tool call with the target in tool_input, 100% of the time, no exceptions. Current date: '+new Date().toDateString()+'. Plugins: web.search (search the web), web.read (read a page url), math.calc (calculate), memory (pass "load" to read, text to store), clock, rea (REVERSE ENGINEER ANYTHING: pass the target (a site url, a github.com/owner/repo repo, or an npm package) and it pulls the live REA skill plus real shipped-artifact evidence from the target itself; this tool is MANDATORY on such asks, never answer them from memory), skills (input "list" returns all installed skills, input "<skill-name> <target or question>" loads that skill\'s live method plus evidence on the target; installed skills: '+SKILLS.join(', ')+'). When tools are needed reply ONLY with one JSON object, no prose:\n{"plan":["step1","step2"],"next_step":0,"tool":"none|web.search|web.read|math.calc|memory|clock|rea|skills","tool_input":"..."}\nor when done, or the question needs no tools:\n{"final":"full answer, cite sources"}\nMake a short plan (1-4 steps) for anything needing facts or math. Run tools one at a time; you will be re-asked after each tool result. Verify math with math.calc. After a rea run, build your final answer on the evidence the run returned, walking artifact -> observation -> conclusion. Never invent facts.'}
HARNESS=buildHarness();
var HARNESS_PLAIN='You are ChatGPT, a sharp, friendly assistant. Answer directly in clean markdown. If the question asks how a site, app, repo or package works, or anything reverse-engineering flavored, tell the user to switch agent mode on so the REA run can happen. Current date: '+new Date().toDateString()+'.';
function brain(u){var model=bm();return call({model:model,messages:[{role:'system',content:HARNESS}].concat(HIST.slice(-6),[{role:'user',content:u}])})}
function finish(){RUNNING=false;STOP=false;setSend()}
function esc(x){return String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function md(t){
 t=esc(t);var blocks=[];
 t=t.replace(/```(\\w*)\\n?([\\s\\S]*?)```/g,function(m,l,c){blocks.push('<div class="code"><div class="chead"><span>'+(l||'code')+'</span><button class="cpy" data-c="'+encodeURIComponent(c)+'">copy</button></div><pre>'+c.replace(/\\n$/,'')+'</pre></div>');return '\\u0000B'+(blocks.length-1)+'\\u0000'});
 t=t.replace(/`([^`\\n]+)`/g,'<code>$1</code>');
 t=t.replace(/\\*\\*([^*]+)\\*\\*/g,'<b>$1</b>');
 t=t.replace(/^### (.+)$/gm,'<h4>$1</h4>').replace(/^## (.+)$/gm,'<h3>$1</h3>');
 t=t.replace(/^[-*] (.+)$/gm,'\\u2022 $1');
 t=t.replace(/\\n/g,'<br>');
 t=t.replace(/\\u0000B(\\d+)\\u0000/g,function(m,i){return blocks[+i]});
 return t;
}
function finishBubble(d,txt,th,started){
 var html='';
 if(th)html+='<div class="think"><button class="thd">thought for '+Math.max(1,Math.round((Date.now()-started)/1000))+'s</button><div class="tbody">'+esc(th)+'</div></div>';
 html+=md(txt);
 if(SRC.length)html+='<div class="srcs">sources: '+SRC.slice(0,3).map(function(u){return '<a href="'+u+'" target="_blank" rel="noopener">'+u.replace(/^https?:\\/\\//,'').slice(0,60)+'</a>'}).join(' | ')+'</div>';
 html+=actsHtml()+'<div class="sugg" data-sg></div>';
 d.innerHTML=html;d.dataset.raw=txt;
 var sg=d.querySelector('[data-sg]');
 var sgq={model:bm(),messages:[{role:'user',content:'Here is an exchange. Reply ONLY a JSON array of 3 very short follow-up questions the user might ask next. Exchange: '+(HIST.slice(-2).map(function(m){return m.content.slice(0,300)}).join(' | '))}]};
 call(sgq).then(function(r){try{var a=JSON.parse(r.match(/\\[[\\s\\S]*\\]/)[0]);sg.innerHTML='';a.slice(0,3).forEach(function(q){var b=document.createElement('button');b.className='sgchip';b.textContent=q;b.onclick=function(){inp.value=q;setSend();submit()};sg.appendChild(b)})}catch(e){}}).catch(function(){});
 HIST.push({role:'assistant',content:txt});save(txt.slice(0,40));try{if(window.__upP)window.__upP()}catch(e){};finish();
}
function bubble(txt){var t=String(txt).trim()||'(empty)';var d=el('ai');d.dataset.raw=t;d.innerHTML=md(t)+actsHtml();HIST.push({role:'assistant',content:t});save(t.slice(0,40));try{if(window.__upP)window.__upP()}catch(e){};finish()}
function run(goal){
 RUNNING=true;STOP=false;setSend();var turns=0,plan=null,repaired=false;
 st('GOAL',goal,true);
 function ask(note){
  if(STOP){sys('stopped.');finish();return}
  var u=goal+(note?('\\n\\n[last tool result]: '+note):'');
  return brain(u).then(function(raw){
   turns++;if(turns>7){bubble('agent hit the step limit: '+raw);return}
   var j=null;try{var m=raw.match(/\\{[\\s\\S]*\\}/);j=JSON.parse(m?m[0]:raw)}catch(e){}
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
     s.classList.remove('run');s.querySelector('span').textContent=plan[idx]+' ['+j.tool+'] -> '+String(out).slice(0,120).replace(/\\n/g,' ');
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
  var d=el('ai');d.innerHTML='<span class="cursor"></span>';
  return callStream({model:bm(),messages:[{role:'system',content:HARNESS_PLAIN}].concat(HIST.slice(-6),th?[{role:'system',content:'Private reasoning notes to build on:\\n'+th}]:[],[{role:'user',content:goal}])},function(full){
   d.innerHTML=md(full)+'<span class="cursor"></span>';chat.scrollTop=1e9;
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
 if(FILECTX){v='[attached file: '+FILECTX.name+']\\n'+FILECTX.text+'\\n\\n'+v;FILECTX=null}
 SRC=[];
 var ct=document.getElementById('ctitle');if(ct&&!ct.textContent)ct.textContent=v.slice(0,30);
 el('you').textContent=v;HIST.push({role:'user',content:v});
 if(AGENT){run(v)}else{plain(v)}
}
var sendbtn=document.getElementById('send');
function setSend(){sendbtn.style.display=(inp.value.trim()||RUNNING)?'block':'none';sendbtn.querySelector('path').setAttribute('d',RUNNING?'M9 9h6v6H9z':'M12 17V8M8.5 11.5 12 8l3.5 3.5')}
inp.addEventListener('input',setSend);setSend();
sendbtn.onclick=submit;
inp.addEventListener('input',function(){inp.style.height='auto';inp.style.height=Math.min(inp.scrollHeight,110)+'px'});
inp.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submit()}});
var mem0=localStorage.getItem('ds_mem');if(mem0)st('MEMORY LOADED',mem0.slice(0,80),false);
skillNames().then(function(l){if(l&&l.length){SKILLS=l;HARNESS=buildHarness()}})['catch'](function(){});
window.CG={hist:function(){return HIST},clear:function(){HIST=[];SRC=[]},load:function(a){HIST=a;SRC=[]},renderMsg:function(role,text){var d=el(role==='u'?'you':'ai');if(role==='u')d.textContent=text;else{d.innerHTML=md(text)+actsHtml();d.dataset.raw=text}},fresh:function(){newChat()}};
console.log('[chatgpt v1.8] deepagent29: auto chat titles, pin chats in the sidebar, dark mode toggle, edit your message, regenerate last reply, chat search + rename, same relay brain, REA mandatory');
})();
