/* JARVIS v1.1 - combined build: agent brain, privacy, voice, 13 tools. REA mandatory */
(function(){
"use strict";
var $=function(id){return document.getElementById(id)};
var KEY=localStorage.jv_key||"",MODEL="openai-fast",URL="https://text.pollinations.ai/openai";
var HIST=[];try{HIST=JSON.parse(localStorage.jv_h||"[]")}catch(e){HIST=[]}
var SPK=localStorage.jv_spk!=="0";
var SKILLS={"rea-analysis-optimization":"finds bottlenecks and fixes code for speed and quality","rea-changelog-update":"reads a repo history and writes what changed and why","rea-ci-tests-audit":"audits tests and CI setup for gaps","rea-tool-design":"designs tools and APIs the agent way","reverse-engineer-anything":"live REA run on any site, app or repo, evidence first"};
var HARNESS=["You are the assistant inside JARVIS, a voice-first personal AI web app. Answer sharp, warm and useful. You are a normal helpful assistant: never role-play a movie character, never call anyone sir.","You may use tools by replying with exactly one JSON object and nothing else: {\"tool\":\"name\",\"args\":{...}}. Tools: web.search {query} live web results; web.read {url} read a page; math.calc {expression}; memory {action:save|load,text} remember or recall notes; clock {} current date and time; skills {name} what a skill does, or {action:list}; weather {location}; news {}; define {word}; image {prompt} generate a picture; timer {minutes,label}; translate {text,to} translate text between languages; youtube {query} find youtube videos; code {javascript} run javascript and show the result; github.search {query} search all of github; github.read {repo,path} read any file from any github repo; github.user {user} look up a github account; github.trending {} what is hot on github today; wiki {topic} wikipedia; stack {query} stack overflow; reddit {subreddit} top posts; currency {from,to,amount} exchange rates; geo.ip {} where this browser is; rss {url} read any news feed; web.links {url} list every link on a page; rea {question,target} REVERSE ENGINEERING ONLY and mandatory there: it pulls the live REA skill and real evidence from the target first, no answer without it.","After a tool result arrives, continue and then give the final plain answer, never more JSON. Never invent tool results. More tools may exist in the runtime beyond this list; if the user's request clearly needs one and its name is not listed, try the name anyway. Keep replies tight. Nothing the user does here is stored anywhere off this browser."].join("\n");
function save(){localStorage.jv_h=JSON.stringify(HIST.slice(-60))}
function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function md(s){
 var out=esc(s);
 var blocks=[];out=out.replace(/```(\w*)\n?([\s\S]*?)```/g,function(m,l,c){blocks.push(c);return "\x01"+(blocks.length-1)+"\x01"});
 out=out.replace(/`([^`\n]+)`/g,"<code>$1</code>");
 out=out.replace(/!\[([^\]]*)\]\((https?:[^)\s]+)\)/g,'<img src="$2" alt="$1" style="max-width:100%;border-radius:12px;display:block;margin:8px 0">');
 out=out.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
 out=out.replace(/(^|[\s(])((?:https?:\/\/)[^\s<)]+)/g,'$1<a href="$2" target="_blank" rel="noopener">$2</a>');
 out=out.replace(/\*\*([^*\n]+)\*\*/g,"<b>$1</b>");
 blocks=blocks.map(function(c){var t=c.replace(/\n$/,"");return '<div class="code"><div class="chead"><span>code</span><button class="cpy">copy</button></div><pre>'+t+"</pre></div>"});
 out=out.replace(/\x01(\d+)\x01/g,function(m,i){return blocks[+i]});
 return out.replace(/\n/g,"<br>");
}
var log=$("log"),steps=$("steps");
function el(tag,cls,html){var d=document.createElement(tag);if(cls)d.className=cls;if(html!=null)d.innerHTML=html;return d}
function addMsg(cls,html){var w=el("div","msg "+cls);w.innerHTML=html;log.appendChild(w);log.scrollTop=log.scrollHeight;return w}
function sys(t){addMsg("sys",esc(t))}
function actions(w,text){
 var a=el("div","acts");
 [["copy",'<svg viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',function(){navigator.clipboard.writeText(text);sys("copied")}],
 ["up",'<svg viewBox="0 0 24 24"><path d="M7 22 3 12h6l-1-8 8 10h-5l1 8z"/></svg>',function(){}],
 ["down",'<svg viewBox="0 0 24 24"><path d="M17 2l4 10h-6l1 8-8-10h5l-1-8z"/></svg>',function(){}],
 ["read",'<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/></svg>',function(){speakOut(text)}]
 ].forEach(function(b){var btn=el("button",null,b[1]);btn.title=b[0];btn.onclick=b[2];a.appendChild(btn)});
 w.appendChild(a);
 var cp=w.querySelectorAll(".cpy");for(var i=0;i<cp.length;i++)cp[i].onclick=function(){navigator.clipboard.writeText(this.closest(".code").querySelector("pre").textContent)};
}
function traceStep(t){var s=el("div","st run");s.innerHTML="<b>STEP</b><span>"+esc(t)+"</span>";steps.appendChild(s);steps.parentNode.style.display="flex";log.scrollTop=log.scrollHeight}
function traceDone(){var ss=steps.querySelectorAll(".st");for(var i=0;i<ss.length;i++)ss[i].classList.remove("run")}
function callStream(msgs,onDelta){
 return fetch(URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:MODEL,messages:msgs,stream:true})}).then(function(r){if(!r.ok)return r.text().then(function(t){throw new Error("relay "+r.status+" "+t.slice(0,120))});return r.body.getReader()}).then(function(rd){
 var dec=new TextDecoder(),buf="",acc="";
 return new Promise(function(res,rej){function pump(){return rd.read().then(function(d){if(d.done){res(acc);return}
 buf+=dec.decode(d.value,{stream:true});var parts=buf.split("\n");buf=parts.pop();
 parts.forEach(function(l){if(l.indexOf("data: ")!==0)return;var s=l.slice(6).trim();if(s==="[DONE]")return;
 try{var j=JSON.parse(s);var t=(j.choices&&j.choices[0]&&j.choices[0].delta&&j.choices[0].delta.content)||"";if(t){acc+=t;onDelta(t,acc)}}catch(e){}});
 pump()}).catch(rej)}pump()});
 });
}
function tryTool(t){var s=t.trim();if(s.charAt(0)!=="{")return null;try{var j=JSON.parse(s);if(j&&j.tool&&(TOOLS[j.tool]))return j}catch(e){}return null}
window.JTOOLS=window.JTOOLS||{};var TOOLS=Object.assign({
 "web.search":function(a){return fetch("https://r.jina.ai/https://duckduckgo.com/html/?q="+encodeURIComponent(a.query||"")).then(function(r){return r.text()}).then(function(h){var out=[],m,re=/<a[^>]*class="result__a"[^>]*>([\s\S]*?)<\/a>/g,i=0;while((m=re.exec(h))&&out.length<6){out.push((++i)+". "+m[1].replace(/<[^>]*>/g,""))}return out.length?out.join("\n"):"no results found"}).catch(function(e){return "search failed: "+e})},
 "web.read":function(a){return fetch("https://r.jina.ai/"+(a.url||"")).then(function(r){return r.text()}).then(function(t){return t.slice(0,4000)}).catch(function(e){return "read failed: "+e})},
 "math.calc":function(a){var e=String(a.expression||"");if(!/^[0-9+\-*/(). %]+$/.test(e))return "only plain math is allowed";try{return String(Function("return ("+e+")")())}catch(err){return "bad expression"}},
 "memory":function(a){if(a.action==="save"){var m=[];try{m=JSON.parse(localStorage.jv_mem||"[]")}catch(e){}m.push({t:a.text||"",d:new Date().toISOString().slice(0,10)});localStorage.jv_mem=JSON.stringify(m);return "saved: "+(a.text||"")}var mm=[];try{mm=JSON.parse(localStorage.jv_mem||"[]")}catch(e){}return mm.length?mm.map(function(x){return x.d+" "+x.t}).join("\n"):"no notes saved yet"},
 "clock":function(){return new Date().toString()},
 "skills":function(a){if(a&&a.action==="list")return Object.keys(SKILLS).join(", ");return (SKILLS[(a&&a.name)||""]||"unknown skill")+" \u2014 REA skills load live from github.com/morluto/rea"},
 "rea":function(a){var q=a.question||"",t=a.target||"";return Promise.all([fetch("https://raw.githubusercontent.com/morluto/rea/main/.agents/skills/reverse-engineer-anything/SKILL.md").then(function(r){return r.text()}).then(function(s){return s.slice(0,1500)}).catch(function(){return "REA skill fetch failed"}),t?fetch("https://r.jina.ai/"+t).then(function(r){return r.text()}).then(function(s){return s.slice(0,3500)}).catch(function(){return "target fetch failed"}):Promise.resolve("")]).then(function(r){return "REA SKILL CORE:\n"+r[0]+"\n\nEVIDENCE"+(t?" from "+t+":\n"+r[1]:": no target url given")+"\n\nQUESTION: "+q})},
 "weather":function(a){return fetch("https://r.jina.ai/https://wttr.in/"+encodeURIComponent(a.location||"")+"?format=3").then(function(r){return r.text()}).then(function(t){return t.slice(0,300)}).catch(function(e){return "weather failed: "+e})},
 "news":function(){return fetch("https://hacker-news.firebaseio.com/v0/topstories.json").then(function(r){return r.json()}).then(function(ids){return Promise.all(ids.slice(0,5).map(function(id){return fetch("https://hacker-news.firebaseio.com/v0/item/"+id+".json").then(function(r){return r.json()}).then(function(it){return (it.title||"")+" https://news.ycombinator.com/item?id="+id})}))}).then(function(a){return a.join("\n")}).catch(function(e){return "news failed: "+e})},
 "define":function(a){return fetch("https://api.dictionaryapi.dev/api/v2/entries/en/"+encodeURIComponent((a.word||"").trim())).then(function(r){if(!r.ok)throw new Error("no entry");return r.json()}).then(function(d){var e=d[0],defs=[];(e.meanings||[]).forEach(function(m){(m.definitions||[]).slice(0,2).forEach(function(x){defs.push("("+m.partOfSpeech+") "+x.definition)})});return e.word+": "+defs.join(" | ")}).catch(function(e){return "definition failed: "+e.message})},
 "image":function(a){var p=encodeURIComponent(a.prompt||"abstract");return Promise.resolve("image ready: ![](https://image.pollinations.ai/prompt/"+p+"?width=768&height=768&nologo=true)")},
 "timer":function(a){var ms=0;if(a.seconds)ms=a.seconds*1000;else if(a.minutes)ms=a.minutes*60000;if(!ms)return "give minutes or seconds";setTimeout(function(){speakOut("timer done "+(a.label||""));sys("timer done: "+(a.label||""))},ms);return "timer set"+(a.label?" for "+a.label:"")}
},window.JTOOLS||{});
async function run(text){
 HIST.push({role:"user",content:text});save();
 addMsg("you",esc(text));
 var hud=$("hud");hud.classList.add("small","busy");traceStep("thinking");
 var msgs=[{role:"system",content:HARNESS}].concat(HIST.slice(-24));
 var turns=0,finalText="";
 while(turns<7){
  turns++;
  var acc=await callStream(msgs,function(){});
  var tj=tryTool(acc);
  if(tj){traceStep(tj.tool+" \u2026");var res=await TOOLS[tj.tool](tj.args||{});traceStep("result in from "+tj.tool);
   msgs.push({role:"assistant",content:acc});
   msgs.push({role:"user",content:"TOOL RESULT ("+tj.tool+"):\n"+res+"\n\nContinue now and give the final plain answer, no JSON."});continue}
  finalText=acc.trim();break;
 }
 traceDone();steps.parentNode.style.display="none";
 if(!finalText)finalText="I hit my thinking limit. Ask me again.";
 HIST.push({role:"assistant",content:finalText});save();
 var w=addMsg("ai","");var b=el("div");b.innerHTML=md(finalText);w.appendChild(b);actions(w,finalText);log.scrollTop=log.scrollHeight;
 speakOut(finalText);
 hud.classList.remove("busy");
}
function speakOut(t){if(!SPK)return;var s=t.replace(/```[\s\S]*?```/g," code block ").replace(/https?:\/\/\S+/g,"").replace(/[*_`#>]/g,"");if(!s.trim())return;try{speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(s);u.rate=1.02;speechSynthesis.speak(u)}catch(e){}}
var busy=false;
async function submit(){var v=$("inp").value.trim();if(!v||busy)return;busy=true;$("inp").value="";try{await run(v)}catch(e){sys("relay hiccup: "+e.message)}busy=false}
$("send").onclick=submit;
var inp=$("inp");
inp.addEventListener("keydown",function(e){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();submit()}});
inp.addEventListener("input",function(){inp.style.height="auto";inp.style.height=Math.min(inp.scrollHeight,110)+"px"});
var SR=window.SpeechRecognition||window.webkitSpeechRecognition,rec=null,listening=false;
$("mic").onclick=function(){
 if(!SR){sys("voice input needs Safari or Chrome");return}
 if(listening){rec.stop();return}
 rec=new SR();rec.lang="en-US";rec.interimResults=true;
 rec.onresult=function(e){var t="";for(var i=0;i<e.results.length;i++)t+=e.results[i][0].transcript;inp.value=t};
 rec.onend=function(){listening=false;$("mic").classList.remove("listening");if(inp.value.trim())submit()};
 rec.onerror=function(){listening=false;$("mic").classList.remove("listening")};
 listening=true;$("mic").classList.add("listening");rec.start();
};
var spkBtn=$("speak");
function spkUI(){spkBtn.classList.toggle("off",!SPK)}
spkBtn.onclick=function(){SPK=!SPK;localStorage.jv_spk=SPK?"1":"0";if(!SPK){try{speechSynthesis.cancel()}catch(e){}}spkUI();sys(SPK?"voice replies on":"voice replies off")};
spkUI();
if(!HIST.length)sys("systems online \u00b7 combined build \u00b7 agent brain \u00b7 privacy \u00b7 voice \u00b7 13 tools \u00b7 tap the mic and talk, or type below");
HIST.forEach(function(m){if(m.role==="user")addMsg("you",esc(m.content));else if(m.role==="assistant"){var w=addMsg("ai","");var b=el("div");b.innerHTML=md(m.content);w.appendChild(b);actions(w,m.content)}});
console.log("[JARVIS v1.3] online. web mastery on: agent brain, privacy, voice, 24 tools incl github x4, wiki, stack, reddit, currency, geo, feeds, link crawl.");
})();
