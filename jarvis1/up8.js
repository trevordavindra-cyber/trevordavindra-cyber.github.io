/* JARVIS up8.js v1 - repo database: the GitHub repos found for jarvis, searchable on the HUD */
(function(){
"use strict";
function $(i){return document.getElementById(i)}
var R=[
["microsoft/JARVIS",25742,"jarvis builds","hugginggpt: an AI that plans a task and chains other models to do it"],
["open-jarvis/OpenJarvis",17787,"jarvis builds","open-source jarvis framework"],
["isair/jarvis",2395,"jarvis builds","community jarvis assistant"],
["akshayaggarwal99/jarvis-ai-assistant",674,"jarvis builds","voice assistant in the jarvis style"],
["neural-maze/realtime-phone-agents-course",1122,"appointments and calls","build real-time AI agents that talk on the phone"],
["mutonby/agentring",459,"appointments and calls","self-hosted AI calling over VoIP, no twilio needed"],
["alam025/ai-voice-assistant-appointment-booking",24,"appointments and calls","AI that books appointments over the phone"],
["LibreHardwareMonitor/LibreHardwareMonitor",9434,"pc diagnostics","reads every sensor in a pc: temps, fans, voltages"],
["poke-AI/poke.AI",101,"games","an AI that plays pokemon start to finish"],
["open-webui/open-webui",159228,"chat interfaces","the biggest self-hosted chat UI for local models"],
["ChatGPTNextWeb/NextChat",88984,"chat interfaces","lightweight chat UI that runs anywhere"],
["lencx/ChatGPT",54676,"chat interfaces","desktop chat app wrapper in rust"],
["danny-avila/LibreChat",47000,"chat interfaces","multi-model chat UI, self-hosted"],
["Chanzhaoyu/chatgpt-web",31307,"chat interfaces","classic chatgpt-style web UI"],
["acheong08/ChatGPT",28008,"chat interfaces","the reverse-engineered chatgpt that started it all (archived)"],
["GaiZhenbiao/ChuanhuChatGPT",15237,"chat interfaces","chat UI with plugins and agents"],
["ddiu8081/chatgpt-demo",7907,"chat interfaces","minimal chatgpt demo UI"],
["firecrawl/firecrawl",206270,"agents and browsing","turns any website into clean data an AI can read"],
["anthropics/skills",198519,"agents and browsing","anthropic's official skill library for agents"],
["ollama/ollama",187798,"agents and browsing","run AI models on your own machine"],
["browser-use/browser-use",121685,"agents and browsing","lets an AI control a real browser"],
["thedotmack/claude-mem",118876,"agents and browsing","persistent memory engine for AI agents"],
["e2b-dev/awesome-ai-agents",31019,"agents and browsing","the index of open-source AI agents"],
["Fosowl/agenticSeek",27688,"agents and browsing","fully local autonomous agent: browses, codes, plans, no cloud"],
["wechaty/wechaty",23603,"agents and browsing","conversational bot framework for chat apps"],
["swarmclawai/swarmvault",738,"agents and browsing","local-first knowledge vault and memory store for agents"],
["codecrafters-io/build-your-own-x",564487,"awesome lists","learn to build anything from scratch"],
["sindresorhus/awesome",540558,"awesome lists","the mother list of awesome lists"],
["public-apis/public-apis",500658,"awesome lists","every free public API, catalogued"],
["awesome-selfhosted/awesome-selfhosted",339282,"awesome lists","self-hosted software for everything"],
["vinta/awesome-python",336290,"awesome lists","the python arsenal"],
["trimstray/the-book-of-secret-knowledge",260306,"awesome lists","the reference shelf: networks, security, systems"]
];
var CHIPS=[["all","all"],["jarvis","jarvis builds"],["calls","appointments and calls"],["diagnostics","pc diagnostics"],["games","games"],["chat","chat interfaces"],["agents","agents and browsing"],["lists","awesome lists"]];
var cur="all",q="";
var s=document.createElement("style");
s.textContent=".repopanel{grid-column:1/-1}#rq{width:100%;background:rgba(4,10,18,.8);border:1px solid rgba(55,209,255,.35);border-radius:8px;color:#eaf6ff;font:13px -apple-system,Helvetica,Arial,sans-serif;padding:9px 12px;outline:none;margin-bottom:8px}#rq::placeholder{color:#5f7d9c}#rchips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}.rchip{font-size:10px;letter-spacing:1px;padding:5px 10px;border:1px solid rgba(255,43,58,.35);border-radius:20px;color:#ffd9dc;background:rgba(20,8,12,.4)}.rchip.on{background:rgba(255,43,58,.3);color:#fff}.rrow{display:grid;grid-template-columns:1fr auto;gap:2px 10px;padding:8px 0;border-bottom:1px solid rgba(120,180,220,.08)}.rrow a{color:#8fd6ff;font-size:13px;font-weight:600;text-decoration:none;word-break:break-all}.rrow a:hover{text-decoration:underline}.rrow .rs{color:#ff8f97;font-size:11px;white-space:nowrap;text-align:right}.rrow .rd{grid-column:1/-1;color:#9fc4dd;font-size:11px}#rlist{max-height:340px;overflow-y:auto}";
document.head.appendChild(s);
var p=document.createElement("div");p.className="panel repopanel";
p.innerHTML='<h3>REPO DATABASE \u2014 '+R.length+' REPOS</h3><input id="rq" placeholder="search the repos..."><div id="rchips"></div><div id="rlist"></div>';
var br=$("bottomrow");
if(br&&br.parentNode){br.parentNode.insertBefore(p,br)}else{document.querySelector("#grid").appendChild(p)}
function esc(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;")}
function draw(){
 var out=[],f=q.toLowerCase();
 R.forEach(function(r,i){
  if(cur!=="all"&&r[2]!==cur)return;
  if(f&&(r[0]+" "+r[2]+" "+r[3]).toLowerCase().indexOf(f)<0)return;
  var st=r[1]>=1000?(Math.round(r[1]/100)/10)+"k":""+r[1];
  out.push('<div class="rrow"><a href="https://github.com/'+r[0]+'" target="_blank" rel="noopener">'+esc(r[0])+'</a><span class="rs">\u2605 '+st+'</span><span class="rd">'+esc(r[3])+'</span></div>')});
 $("rlist").innerHTML=out.length?out.join("":'<div class="rd" style="color:#7f95ad;padding:8px 0">no repos match.</div>)}
CHIPS.forEach(function(c){var b=document.createElement("button");b.className="rchip"+(c[0]==="all"?" on":"");b.textContent=c[0].toUpperCase();b.dataset.c=c[0];$("rchips").appendChild(b)});
$("rchips").querySelectorAll(".rchip").forEach(function(b){b.onclick=function(){$("rchips").querySelectorAll(".rchip").forEach(function(x){x.classList.remove("on")});b.classList.add("on");cur=b.dataset.c;draw()}});
$("rq").oninput=function(){q=this.value;draw()};
draw();
var f2=$("feed");if(f2){var d=document.createElement("div");d.innerHTML="<b>[BOOT]</b>";d.appendChild(document.createTextNode(" Repo database: "+R.length+" repos loaded."));f2.insertBefore(d,f2.firstChild)}
console.log("[JARVIS up8.js v1] repo database on: "+R.length+" repos, searchable.");
})();
