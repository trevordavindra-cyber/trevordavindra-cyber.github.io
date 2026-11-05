const POOL=[
 {name:"27B",base:"https://zk-armor-qwen3-8-27b-uncensored-chatbot.hf.space",path:"/chat",payload:m=>[m,SYSTEM,false,0.7,512,0.95,50],tries:3},
 {name:"27B-2",base:"https://microhero-qwen3-8-27b-uncensored-chat.hf.space",path:"/respond",payload:m=>[m,512,0.7,0.95],tries:6},
 {name:"35B",base:"https://josssdiff-huihui-qwen3-6-35b-abliterated-chat.hf.space",path:"/chat",payload:m=>[m,SYSTEM,512,0.7],tries:6},
 {name:"8B",base:"https://jwherrold-neuraldaredevil-8b-abliterated-chat.hf.space",path:"/generate",payload:m=>[m,SYSTEM,512,0.7,0.95,50,1.1],tries:20},
 {name:"Gemma",base:"https://jokernifty-gemma-4-e4b-it-abliterated-chat.hf.space",path:"/chat",payload:m=>[m],tries:6}
];
const SYSTEM="You are NeuralDaredevil, a helpful and knowledgeable assistant. Answer clearly and directly.";
const CAP=48000;
const feed=document.getElementById("feed"), log=document.getElementById("log"), input=document.getElementById("input"),
      send=document.getElementById("send"), clip=document.getElementById("clip"),
      fpick=document.getElementById("fpick"), hello=document.getElementById("hello"),
      status=document.getElementById("status"), drawer=document.getElementById("drawer"), shade=document.getElementById("shade");
function LS(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}}
function SV(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
let files=[], history=[], busy=false, ctrl=null;
let chats=LS("ua_chats",[]), curChat=LS("ua_cur",null);
let mems=LS("ua_mem",[]), prefs=LS("ua_prefs",{theme:"dark",verify:false,speak:false,automem:true,hist:6,tokens:512,instr:"",team:false,route:true});
let agents=LS("ua_agents",null), activeAgent=null, activeProj=null;
let stats=LS("ua_stats",{});
if(!agents){
 agents=[
  {em:"🧠",name:"Chief",sys:"You are the Chief Intelligence Agent, coordinator of an AI team. Think in clear steps, decompose complex requests, and deliver complete, correct answers. When a request needs code, math, research or security thinking, say which specialist should handle it and still give your best answer."},
  {em:"💻",name:"Coder",sys:"You are the Master Coding Agent, an expert software engineer. Write clean, correct, complete code with brief explanations. Include full files when building apps. Point out bugs and edge cases."},
  {em:"🔍",name:"Researcher",sys:"You are the Research Agent. Give thorough, structured findings. Clearly separate what you know from what you are unsure about. Never invent sources, quotes or citations. If context includes fetched web pages, ground your answer in them and name them."},
  {em:"🛡️",name:"Security",sys:"You are the Security Agent, an application-security auditor. Analyze code and systems for vulnerabilities and give concrete fixes, ranked by severity. You explain attacks so people can defend against them."},
  {em:"🎨",name:"Creative",sys:"You are the Creative Agent. Generate vivid ideas, stories, names, copy and designs on request. Be bold and original."},
  {em:"📐",name:"Math",sys:"You are the Mathematics Agent. Solve step by step, show your work, and double-check arithmetic before answering. State when a problem is ambiguous."},
  {em:"🏗️",name:"Architect",sys:"You are the Systems Architect. Design technical systems: components, data flow, tradeoffs, scalability. Be concrete and practical, favor free and simple infrastructure."},
  {em:"✅",name:"QA",sys:"You are the Quality Assurance Agent. Test and evaluate work: find bugs, edge cases, unclear requirements and risks. Give a checklist-style verdict with fixes."},
  {em:"🗂️",name:"Memory",sys:"You are the Memory Agent. Organize knowledge into concise, reusable notes: summaries, key facts, action items. Be brief and structured."},
  {em:"⚙️",name:"Automator",sys:"You are the Automation Agent. Turn requests into precise step-by-step executable plans with exact commands, clicks or messages. Flag any step that needs approval or money before it runs."}
 ];
 SV("ua_agents",agents);
}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const esc=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
function md(s){return esc(s)
  .replace(/```([\s\S]*?)```/g,(m,c)=>"<code>"+c.trim()+"</code>")
  .replace(/`([^`\n]+)`/g,"<code>$1</code>")
  .replace(/\*\*([^*\n]+)\*\*/g,"<b>$1</b>")
  .replace(/(https?:\/\/[^\s<]+)/g,'<a href="$1">$1</a>');}
function bubble(role,text){
  if(role==="me"){
    const row=document.createElement("div");row.className="m u";
    const b=document.createElement("div");b.className="bub";b.innerHTML=md(text);
    row.appendChild(b);feed.appendChild(row);
  }else{
    const row=document.createElement("div");row.className="m a";
    const body=document.createElement("div");body.innerHTML=md(text);row.appendChild(body);
    const act=document.createElement("div");act.className="actions";
    act.innerHTML='<button data-a="copy">📋 copy</button><button data-a="check">✅ double-check</button><button data-a="speak">🔊 speak</button><button data-a="mem">🧠 remember</button><button data-a="retry">🔁 retry</button>';
    act.onclick=e=>{
      const a=e.target.dataset.a;if(!a)return;
      if(a==="copy")navigator.clipboard.writeText(body.textContent).then(()=>setStatus("copied"));
      if(a==="check")runCheck(text,body);
      if(a==="speak")speakOut(body.textContent);
      if(a==="mem"){mems.push({t:text.slice(0,600),ts:Date.now()});SV("ua_mem",mems);setStatus("saved to memory");renderMem();}
      if(a==="retry")retryLast(text,body);
      setTimeout(()=>setStatus(""),2000);
    };
    row.appendChild(act);
    feed.appendChild(row);row._full=text;row._body=body;
  }
  log.scrollTop=log.scrollHeight;hello.style.display="none";
}
function setStatus(t){status.textContent=t||"";}
function saveChat(){
 if(!curChat){curChat="c"+Date.now();chats.unshift({id:curChat,title:(history[0]&&history[0].t||"New chat").slice(0,40),msgs:[]});}
 const c=chats.find(x=>x.id===curChat);if(c){c.msgs=history.slice();c.title=(history[0]&&history[0].t||c.title).slice(0,40);}
 SV("ua_chats",chats.slice(0,40));SV("ua_cur",curChat);renderChats();
}
function renderChats(){
 const el=document.getElementById("chatlist");el.innerHTML="";
 chats.forEach(c=>{
  const row=document.createElement("div");row.className="chatitem";
  const b=document.createElement("button");b.className="newchat";b.textContent=(c.id===curChat?"› ":"  ")+c.title;
  b.onclick=()=>{curChat=c.id;history=c.msgs.slice();feed.innerHTML="";history.forEach(h=>bubble(h.r,h.t));if(!history.length)hello.style.display="";drawer.classList.remove("open");shade.classList.remove("on");SV("ua_cur",curChat);};
  const d=document.createElement("button");d.className="del";d.textContent="✕";
  d.onclick=()=>{chats=chats.filter(x=>x.id!==c.id);if(curChat===c.id){curChat=null;history=[];feed.innerHTML="";hello.style.display="";}SV("ua_chats",chats);SV("ua_cur",curChat);renderChats();};
  row.appendChild(b);row.appendChild(d);el.appendChild(row);
 });
}
clip.onclick=()=>fpick.click();
fpick.onchange=async()=>{
  for(const f of fpick.files){
    try{files.push({name:f.name,text:await read(f)});}catch(e){bubble("ai","Couldn't read "+f.name);}
  }
  fpick.value="";drawChips();
};
function drawChips(){
  document.querySelectorAll(".chip").forEach(e=>e.remove());
  if(!files.length)return;
  const c=document.createElement("div");c.className="chips";
  files.forEach((f,i)=>{
    const s=document.createElement("span");s.className="chip";s.style.display="flex";
    s.innerHTML=esc(f.name)+" <button style='background:none;border:0;color:var(--faint);font-size:14px'>×</button>";
    s.querySelector("button").onclick=()=>{files.splice(i,1);drawChips();};
    c.appendChild(s);
  });
  feed.appendChild(c);
}
function parseCSV(t){
  const rows=[];let row=[],cur="",q=false;
  for(let i=0;i<t.length;i++){const ch=t[i];
    if(q){if(ch=='"'){if(t[i+1]=='"'){cur+='"';i++;}else q=false;}else cur+=ch;}
    else if(ch=='"')q=true;
    else if(ch===','){row.push(cur);cur="";}
    else if(ch==='\n'||ch==='\r'){if(ch==='\r'&&t[i+1]==='\n')i++;row.push(cur);cur="";if(row.some(x=>x!==""))rows.push(row);row=[];}
    else cur+=ch;}
  row.push(cur);if(row.some(x=>x!==""))rows.push(row);
  return rows;
}
async function read(f){
  const n=f.name.toLowerCase();
  if(n.endsWith(".pdf")){
    pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    const buf=await f.arrayBuffer(), pdf=await pdfjsLib.getDocument({data:buf}).promise;
    let out="";
    for(let i=0;i<Math.min(pdf.numPages,20);i++){
      const t=await (await pdf.getPage(i+1)).getTextContent();
      out+=t.items.map(x=>x.str).join(" ")+"\n";
    }
    return out.trim();
  }
  if(n.endsWith(".zip")){
    const buf=new Uint8Array(await f.arrayBuffer());
    if(!window.fflate)return "(couldn't unzip on this phone — try sending the files loose)";
    const entries=fflate.unzipSync(buf);
    const skip=/\.(png|jpe?g|gif|webp|ico|svg|pdf|woff2?|ttf|otf|eot|mp3|mp4|mov|avi|zip|exe|dll|so|bin|dat|db|sqlite)$/i;
    let out="";
    for(const name in entries){
      if(name.endsWith("/")||skip.test(name))continue;
      if(entries[name].length>2097152)continue;
      try{
        const t=new TextDecoder("utf-8",{fatal:false}).decode(entries[name]);
        if(/[\u0000-\u0008\u000e-\u001f]/.test(t.slice(0,200)))continue;
        out+="\n=== "+name+" ===\n"+t;
      }catch(e){}
    }
    return out.trim()||"(no readable text files inside this zip)";
  }
  if(n.endsWith(".docx")){
    const buf=await f.arrayBuffer();
    const r=await mammoth.extractRawText({arrayBuffer:buf});
    return r.value.trim();
  }
  if(n.endsWith(".csv")){
    const rows=parseCSV(await f.text());
    const head=rows[0]||[];
    let out="CSV table with "+rows.length+" rows, columns: "+head.join(", ")+".\n";
    for(let i=0;i<Math.min(rows.length,80);i++)out+=rows[i].join(" | ")+"\n";
    if(rows.length>80)out+="("+(rows.length-80)+" more rows omitted)\n";
    return out.trim();
  }
  if(n.endsWith(".json")){
    try{return JSON.stringify(JSON.parse(await f.text()),null,1).slice(0,CAP);}catch(e){return (await f.text()).slice(0,CAP);}
  }
  return (await f.text()).trim();
}
input.addEventListener("input",()=>{input.style.height="auto";input.style.height=Math.min(input.scrollHeight,120)+"px";send.disabled=!input.value.trim()&&!files.length;});
input.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();fire();}});
send.onclick=fire;
document.querySelectorAll(".card[data-p]").forEach(c=>c.onclick=()=>{input.value=c.dataset.p;input.focus();input.dispatchEvent(new Event("input"));});
document.getElementById("cardAgents").onclick=()=>openPanel("agentsPanel");
document.getElementById("menu").onclick=()=>{drawer.classList.add("open");shade.classList.add("on");renderChats();};
document.getElementById("modelbtn").onclick=()=>{drawer.classList.add("open");shade.classList.add("on");};
shade.onclick=()=>{drawer.classList.remove("open");shade.classList.remove("on");};
document.getElementById("newchat").onclick=()=>{history=[];feed.innerHTML="";hello.style.display="";curChat=null;SV("ua_cur",null);drawer.classList.remove("open");shade.classList.remove("on");setStatus("");renderChats();};
document.getElementById("exportChat").onclick=()=>{
  const txt=history.map(h=>(h.r==="u"?"You: ":"AI: ")+h.t).join("\n\n");
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([txt],{type:"text/plain"}));a.download="chat.txt";a.click();URL.revokeObjectURL(a.href);
};
function openPanel(id){document.querySelectorAll(".panel").forEach(p=>p.style.display="none");document.getElementById(id).style.display="flex";}
function closePanels(){document.querySelectorAll(".panel").forEach(p=>p.style.display="none");}
async function fire(){
  if(busy)return;
  const text=input.value.trim();
  if(!text&&!files.length)return;
  busy=true;send.disabled=true;
  input.value="";input.style.height="auto";
  let msg=text||"Summarize the attached file(s).";
  let shown=text||("📎 "+files.map(f=>f.name).join(", "));
  if(text.startsWith("/image ")){
    busy=false;send.disabled=!input.value.trim();
    const p=text.slice(7).trim();
    history.push({r:"u",t:shown});
    bubble("me",shown);
    const row=document.createElement("div");row.className="m a";
    row.innerHTML='<img class="aiimg" alt="generated image" src="https://image.pollinations.ai/prompt/'+encodeURIComponent(p)+'?width=768&height=768&nologo=true">';
    feed.appendChild(row);log.scrollTop=log.scrollHeight;
    history.push({r:"a",t:"🎨 generated: "+p});saveChat();
    return;
  }
  if(files.length){
    for(const f of files){
      const cut=f.text.length>CAP;
      msg="Attached file: "+f.name+(cut?" (long — first "+CAP+" characters)":"")+"\n"+f.text.slice(0,CAP)+"\n\n"+msg;
    }
    const row=document.createElement("div");row.className="file";
    const s=document.createElement("span");s.textContent="📎 "+shown;row.appendChild(s);feed.appendChild(row);
  }
  const urls=(text.match(/https?:\/\/[^\s<]+/g)||[]).slice(0,2);
  if(urls.length&&!activeAgent){
    for(const u of urls){
      try{
        setStatus("reading the page…");
        const r=await fetch("https://r.jina.ai/"+u);
        if(r.ok){const t=(await r.text()).slice(0,12000);msg="Fetched page ("+u+"):\n"+t+"\n\n"+msg;}
      }catch(e){}
    }
    setStatus("");
  }
  if(history.length){
    const rec=history.slice(-prefs.hist).map(h=>(h.r==="u"?"You":"Assistant")+": "+h.t).join("\n");
    msg="Conversation so far:\n"+rec+"\n\nNew message: "+msg;
  }
  if(prefs.instr)msg="Standing instructions from the user: "+prefs.instr+"\n\n"+msg;
  if(mems.length)msg="Things to remember about the user:\n"+mems.slice(-8).map(m=>"- "+m.t).join("\n")+"\n\n"+msg;
  if(activeProj){
    const p=projects.find(x=>x.id===activeProj);
    if(p)msg="Active project: "+p.name+(p.desc?" — "+p.desc:"")+". Tasks: "+p.tasks.map(t=>"["+(t.done?"done":"todo")+"] "+t.t).join("; ")+(p.notes?" Notes: "+p.notes:"")+"\n\n"+msg;
  }
  history.push({r:"u",t:shown});
  bubble("me",shown);
  files=[];drawChips();
  const out=document.createElement("div");out.className="m a";out.textContent="…";feed.appendChild(out);
  ctrl=new AbortController();
  try{
    let full;
    if(prefs.team&&!activeAgent)full=await teamRun(msg,out);
    else full=await ask(msg,out);
    history.push({r:"a",t:full||"(no reply)"});
    if(!full)out.textContent="(no reply)";
    setStatus("");
    if(prefs.automem&&full&&full.length>400){mems.push({t:"From chat: "+full.slice(0,300),ts:Date.now()});mems=mems.slice(-60);SV("ua_mem",mems);renderMem();}
    if(prefs.verify&&full)runCheck(full,null);
    if(prefs.speak&&full)speakOut(full);
  }catch(e){
    out.textContent=e&&e.msg?e.msg:"Couldn't reach the AI. Try again in a minute.";
    setStatus("");
  }
  busy=false;send.disabled=!input.value.trim();
  ctrl=null;
  log.scrollTop=log.scrollHeight;
  saveChat();
}
function addCheck(row){
  const c=document.createElement("div");c.className="check";
  const act=row.querySelector(".actions");row.insertBefore(c,act||null);
  return c;
}
async function runCheck(ans,outEl){
  setStatus("double-checking…");
  const row=document.createElement("div");row.className="check";row.textContent="…";
  if(outEl&&outEl.parentElement)outEl.parentElement.insertBefore(row,outEl.parentElement.querySelector(".actions"));
  else feed.appendChild(row);
  try{
    const sys="You are a strict fact-checker and reviewer. Examine the answer for errors, hallucinations, contradictions and missing pieces. If it is correct, say so in one line. If not, list the specific problems and the corrections. Be concise.";
    const full=await ask("Here is an answer to check. Point out any errors or anything missing:\n\n"+ans,{textContent:""},sys);
    row.textContent="✅ check: "+full;
  }catch(e){row.textContent="✅ check: couldn't run right now (servers busy).";}
  setStatus("");log.scrollTop=log.scrollHeight;
}
async function retryLast(ans,outEl){
  const last=history.filter(h=>h.r==="u").pop();
  if(!last)return;
  outEl.textContent="…";
  try{
    const full=await ask(last.t+"\n\n(previous attempt, do better and differently):\n"+ans,out);
    if(full){outEl.innerHTML=md(full);history.push({r:"a",t:full});saveChat();}
  }catch(e){outEl.textContent=e&&e.msg?e.msg:"retry failed";}
}
function speakOut(t){
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t.slice(0,1200));speechSynthesis.speak(u);}catch(e){}
}
