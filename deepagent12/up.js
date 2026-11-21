(function(){
var chat=document.getElementById('chat');
function sysLine(t){var d=document.createElement('div');d.className='msg sys';d.textContent=t;chat.appendChild(d);chat.scrollTop=1e9}
function lastRaw(sel){var ls=chat.querySelectorAll(sel);return ls.length?ls[ls.length-1]:null}
var MEMK='ds_mem2';
function getMem(){try{return JSON.parse(localStorage.getItem(MEMK)||'[]')}catch(e){return[]}}
function addFacts(arr){var m=getMem(),added=0;arr.forEach(function(f){f=String(f).trim().slice(0,140);if(!f)return;var low=f.toLowerCase();var dup=m.some(function(x){return x.t.toLowerCase().indexOf(low)>-1||low.indexOf(x.t.toLowerCase())>-1});if(!dup){m.push({t:f,d:new Date().toISOString().slice(0,10)});added++}});if(m.length>30)m=m.slice(-30);if(added){localStorage.setItem(MEMK,JSON.stringify(m));sysLine('memory: noting '+added+' thing'+(added>1?'s':'')+' about you')}}
function learn(){var u=lastRaw('.msg.you'),a=lastRaw('.msg.ai');if(!u||!a)return;var txt='From this exchange, extract 0-2 durable facts about the user (preferences, identity, ongoing projects, people in their life). Reply ONLY a JSON array of short strings, [] if none. Exclude transient chat content.\nUser: '+String(u.dataset.raw||u.textContent).slice(0,400)+'\nAssistant: '+String(a.dataset.raw||a.textContent).slice(0,400);fetch('https://text.pollinations.ai/openai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'openai-fast',messages:[{role:'user',content:txt}]})}).then(function(r){return r.json()}).then(function(j){var t=j&&j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content||'';var mm=t.match(/\[[\s\S]*\]/);var arr=JSON.parse(mm?mm[0]:'[]');if(Array.isArray(arr))addFacts(arr)}).catch(function(){})}
var pending=null;
document.addEventListener('change',function(e){
 var f=e.target&&e.target.files&&e.target.files[0];if(!f||!/^image\//.test(f.type))return;
 e.stopImmediatePropagation();e.preventDefault();
 var r=new FileReader();r.onload=function(){pending={n:f.name,d:String(r.result)};sysLine('image attached: '+f.name+' - it gets seen with your next message')};r.readAsDataURL(f);
},true);
var mic=document.getElementById('mic');
var btn=document.createElement('button');btn.id='vmode';btn.textContent='\uD83C\uDF99';btn.setAttribute('aria-label','voice mode');btn.style.cssText='width:38px;height:38px;border-radius:50%;border:1px solid rgba(120,120,128,.35);background:transparent;margin-left:8px;font-size:15px;line-height:1;flex:0 0 auto;';
mic.parentNode.insertBefore(btn,mic);
var VM=false,speaking=false,recognizing=false,rec=null;
function styleBtn(){btn.style.background=VM?'#4d6bfe':'transparent';btn.style.color=VM?'#fff':'inherit';btn.style.borderColor=VM?'#4d6bfe':'rgba(120,120,128,.35)'}
function listen(){if(!VM||recognizing||speaking)return;var SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){sysLine('voice input not supported in this browser');VM=false;styleBtn();return}rec=new SR();rec.lang='en-US';rec.interimResults=false;recognizing=true;rec.onresult=function(e){var t=e.results[0][0].transcript;var i=document.getElementById('inp');i.value=t;i.dispatchEvent(new Event('input'));document.getElementById('send').click()};rec.onend=function(){recognizing=false;if(VM&&!speaking)listen()};rec.onerror=function(){recognizing=false};try{rec.start()}catch(e){recognizing=false}}
function say(t){if(!window.speechSynthesis)return;speaking=true;var u=new SpeechSynthesisUtterance(String(t).replace(/[#*`>|]/g,'').slice(0,700));u.onend=u.onerror=function(){speaking=false;if(VM)listen()};speechSynthesis.speak(u)}
btn.onclick=function(){VM=!VM;styleBtn();if(VM){sysLine('voice mode on: talk, it answers out loud and keeps listening');listen()}else{sysLine('voice mode off');try{rec&&rec.stop()}catch(e){}if(window.speechSynthesis)speechSynthesis.cancel();speaking=false}};
var lastSeen=null;
new MutationObserver(function(ms){ms.forEach(function(m){
 if(m.type==='attributes'){var n=m.target;if(n.classList&&n.classList.contains('ai')){var raw=n.dataset.raw||'';if(raw&&raw!==lastSeen){lastSeen=raw;learn();if(VM)say(raw)}}return}
 Array.prototype.forEach.call(m.addedNodes,function(n){if(n.nodeType!==1||!n.classList)return;
  if(n.classList.contains('ai')&&n.dataset.raw&&n.dataset.raw!==lastSeen){lastSeen=n.dataset.raw;learn();if(VM)say(n.dataset.raw)}
 })
})}).observe(chat,{childList:true,subtree:true,attributes:true,attributeFilter:['data-raw']});
var send=document.getElementById('send'),inp=document.getElementById('inp');
function composeAndSend(base){
 var go=function(txt){var mem=getMem().map(function(x){return x.t}).join('; ');var full=(mem?('[about me] '+mem+'\n\n'):'')+txt;inp.value=full;inp.dispatchEvent(new Event('input'));pending=null;var ev=new MouseEvent('click',{bubbles:true});ev.__ds=true;send.dispatchEvent(ev)};
 if(!pending){go(base);return}
 sysLine('looking at your image...');
 fetch('https://text.pollinations.ai/openai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'openai',messages:[{role:'user',content:[{type:'text',text:'Describe what is in this image in detail, then note anything the user is likely asking about it.'},{type:'image_url',image_url:{url:pending.d}}]}]})}).then(function(r){return r.json()}).then(function(j){var t=j&&j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content||'';if(!t){sysLine('could not read the image');go(base);return}go('[image: '+pending.n+'] what i see: '+t.slice(0,1500)+'\n\n'+base)}).catch(function(){sysLine('vision unavailable right now');go(base)});
}
document.addEventListener('click',function(e){
 if(e.target!==send)return;
 if(e.__ds)return;
 if(!pending&&getMem().length===0)return;
 e.stopImmediatePropagation();e.preventDefault();
 composeAndSend(inp.value.trim());
},true);
document.addEventListener('keydown',function(e){
 if(e.target!==inp||e.key!=='Enter'||e.shiftKey)return;
 if(!pending&&getMem().length===0)return;
 e.stopImmediatePropagation();e.preventDefault();
 send.click();
},true);
sysLine('upgrades live: vision (attach a photo), auto memory, voice mode (the new mic button)');
})();