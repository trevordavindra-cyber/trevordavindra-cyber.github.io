/* deepagent29 up8.js - upgrade pack 8: ChatGPT-style auto chat titles (v1.0) */
(function(){
if(!window.CG||!window.__upT){console.log('[up8.js v1.0] core api missing, upgrade inert');return}
var BUSY=false,cool=0,tries={};
function load(){try{return JSON.parse(localStorage.getItem('ds_chats')||'[]')}catch(e){return[]}}
function saveAll(a){try{localStorage.setItem('ds_chats',JSON.stringify(a.slice(0,12)))}catch(e){}}
function doneMap(){try{return JSON.parse(localStorage.getItem('ds_titled')||'{}')}catch(e){return{}}}
function markDone(t){try{var d=doneMap();d[t]=1;localStorage.setItem('ds_titled',JSON.stringify(d))}catch(e){}}
function poke(){var DC=document.getElementById('dchats');if(!DC)return;var i=document.createElement('i');i.setAttribute('data-u8','1');i.style.display='none';DC.appendChild(i);setTimeout(function(){if(i.parentNode)i.parentNode.removeChild(i)},0)}
function clean(nt){return String(nt||'').replace(/["'`*#_]/g,'').replace(/\s+/g,' ').trim().slice(0,40)}
function apply(old,nt){
 nt=clean(nt);if(!nt)return false;
 if(nt===old){markDone(old);return false}
 var a=load(),idx=-1,i;for(i=0;i<a.length;i++)if(a[i].t===old){idx=i;break}
 if(idx<0)return false;
 for(i=0;i<a.length;i++)if(i!==idx&&a[i].t===nt){a.splice(i,1);if(i<idx)idx--}
 a[idx].t=nt;saveAll(a);
 try{if(localStorage.getItem('ds_chat_last')===old)localStorage.setItem('ds_chat_last',nt)}catch(e){}
 markDone(old);poke();
 console.log('[up8] auto-title: '+old.slice(0,30)+' -> '+nt);
 return true}
function tick(){
 if(BUSY||Date.now()<cool)return;
 var H=[];try{H=window.CG.hist()}catch(e){return}
 if(!H||H.length<2||H[H.length-1].role!=='assistant')return;
 var last=H[H.length-1].content||'';
 if(!last)return;
 var first='';for(var i=0;i<H.length;i++){if(H[i].role==='user'){first=H[i].content;break}}
 if(!first)return;
 var raw=window.__upT(first,60);
 var old='';try{old=localStorage.getItem('ds_chat_last')||''}catch(e){}
 if(old!==raw)return;
 var dm=doneMap();if(dm[old])return;
 var a=load(),rec=null;for(var k=0;k<a.length;k++)if(a[k].t===old)rec=a[k];
 if(!rec)return;
 var msgs=rec.m||[],lm=msgs[msgs.length-1];
 if(!lm||lm.r!=='a'||lm.c!==last)return;
 var convo='User: '+first.slice(0,300)+'\nAssistant: '+last.slice(0,300);
 BUSY=true;
 fetch('https://text.pollinations.ai/openai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'openai-fast',messages:[{role:'system',content:'You write chat titles. Reply with ONLY a short 3-5 word title for the conversation. No quotes, no punctuation, no explanation.'},{role:'user',content:convo}]})}).then(function(r){return r.text()}).then(function(txt){
  BUSY=false;
  var t='';try{var j=JSON.parse(txt);var c=j&&j.choices&&j.choices[0];t=(c&&(c.message&&c.message.content||c.text))||''}catch(e){t=String(txt||'')}
  if(t&&apply(old,t))return;
  tries[old]=(tries[old]||0)+1;if(tries[old]>=3)markDone(old);cool=Date.now()+60000;
 }).catch(function(){BUSY=false;tries[old]=(tries[old]||0)+1;if(tries[old]>=3)markDone(old);cool=Date.now()+60000;console.log('[up8] auto-title skipped, relay busy')});
}
setInterval(tick,5000);
console.log('[chatgpt up8.js v1.0] auto chat titles loaded');
})();
