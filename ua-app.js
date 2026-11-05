let prefer=0; // sticky pool pointer

/* ---- plumbing: server brain, phone brain, team mode, helpers ---- */
let projects=LS("ua_projects",[]), localMode=false, brainKind="chat", thinkHarder=false, localEngine=null;
const CODE_SYSTEM="You are an expert coding assistant. Reply with complete, working code plus a short explanation. Use fenced code blocks.";
function closeDrawer(){drawer.classList.remove("open");shade.classList.remove("on");}
function downloadFile(name,text){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type:"text/plain"}));a.download=name;a.click();setTimeout(function(){URL.revokeObjectURL(a.href);},500);}
function newChat(){history=[];feed.innerHTML="";if(hello)hello.style.display="";curChat=null;SV("ua_cur",null);closeDrawer();setStatus("");}
function renderChatList(q){
  q=(q||"").toLowerCase();
  if(!q)return renderChats();
  const el=document.getElementById("chatlist");if(!el)return;
  el.innerHTML="";
  (chats||[]).filter(function(c){return (c.title||"").toLowerCase().indexOf(q)>=0;}).forEach(function(c){
    const row=document.createElement("div");row.className="chatitem";
    const b=document.createElement("button");b.className="newchat";b.textContent="  "+c.title;
    b.onclick=function(){openChatById(c.id);};
    const d=document.createElement("button");d.className="del";d.textContent="\u2715";d.onclick=function(e){e.stopPropagation();};
    row.appendChild(b);row.appendChild(d);el.appendChild(row);
  });
}
function openChatById(id){
  const c=(chats||[]).find(x=>x.id===id);
  history=c?(c.msgs||[]):[];curChat=id||null;SV("ua_cur",curChat);
  feed.innerHTML="";(history||[]).forEach(m=>bubble(m.r==="u"?"me":"ai",m.t));
  if(hello)hello.style.display=(!history||!history.length)?"":"none";
  log.scrollTop=log.scrollHeight;closeDrawer();saveChat();
}
function buildData(b,msg,sys){
  const tk=(prefs&&prefs.tokens)||512;
  if(b.name==="27B")return [msg,sys||SYSTEM,false,0.7,tk,0.95,50];
  if(b.name==="27B-2")return [{text:msg,files:[]},tk,0.7,0.95];
  if(b.name==="35B")return [msg,sys||"",tk,0.7];
  if(b.name==="8B")return [msg,sys||SYSTEM,Math.max(64,tk),0.7,0.95,50,1.1];
  return [msg];
}
function extractReply(data){
  let out="";
  const clean=s=>String(s||"").replace(/<details>[\s\S]*?<\/details>/g,"").trim();
  const pick=v=>{
    if(typeof v==="string"){if(v&&!out)out=v;return;}
    if(!v||typeof v!=="object")return;
    if(Array.isArray(v)){v.forEach(pick);return;}
    if(typeof v.text==="string"){if(v.text&&!out)out=v.text;}
    else if(typeof v.content==="string"){if(v.content&&!out)out=v.content;}
    else if(Array.isArray(v.content)){v.content.forEach(function(c){if(c&&typeof c.text==="string"&&c.text&&!out)out=c.text;});}
    else Object.values(v).forEach(pick);
  };
  if(Array.isArray(data)&&Array.isArray(data[0])&&data[0].length&&data[0].some(function(m){return m&&m.role==="assistant";})){
    const asst=data[0].filter(function(m){return m&&m.role==="assistant";}).pop();
    if(asst&&asst.content&&asst.content[0])out=asst.content[0].text||"";
  } else pick(data);
  return clean(out);
}
async function askSpace(b,msg,out,sys){
  const data=buildData(b,msg,sys);
  const sig=ctrl&&ctrl.signal;
  const r1=await fetch(b.base+"/gradio_api/call"+b.path,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({data:data}),signal:sig});
  const j=await r1.json();
  if(!j||!j.event_id)throw Object.assign(new Error("no event"),{msg:"That server is waking up. Tap send again in a moment."});
  const r2=await fetch(b.base+"/gradio_api/call"+b.path+"/"+j.event_id,{signal:sig});
  const reader=r2.body.getReader(),dec=new TextDecoder();
  let buf="",fin=null;
  while(true){
    const step=await reader.read();if(step.done)break;
    buf+=dec.decode(step.value,{stream:true});
    let ix;
    while((ix=buf.indexOf("\n\n"))>=0){
      const chunk=buf.slice(0,ix);buf=buf.slice(ix+2);
      const evLine=(chunk.match(/^event:\s*(\w+)/m)||[])[1];
      const dLine=(chunk.match(/^data:\s*([\s\S]*)$/m)||[])[1];
      if(evLine==="error")throw Object.assign(new Error("server error"),{msg:"That server is busy. Tap send again in a moment."});
      if(!dLine)continue;
      let arr;try{arr=JSON.parse(dLine);}catch(e){continue;}
      const t=extractReply(arr);
      if(t)out.textContent=t;
      if(evLine==="complete"){fin=t||"";break;}
    }
    if(fin!==null)break;
  }
  return fin||"";
}
async function askLocal(msg,out,sys){
  if(!window.webllm){
    out.textContent="downloading the phone brain (first time only, about 800 MB)\u2026";
    try{window.webllm=await import("https://esm.run/@mlc-ai/web-llm");}catch(e){throw Object.assign(new Error("no import"),{msg:"couldn't load the phone brain. It needs internet the first time, then runs fully on your phone."});}
  }
  if(!localEngine){
    const want=brainKind==="code"?"Qwen2.5-Coder-1.5B-Instruct-q4f32_1-MLC":"Llama-3.2-3B-Instruct-q4f16_1-MLC";
    const prog=p=>{if(p&&p.progress!=null)out.textContent="phone brain "+Math.round(p.progress*100)+"%";};
    let eng;
    if(window.webllm.CreateMLCEngine)eng=await window.webllm.CreateMLCEngine(want,{initProgressCallback:prog});
    else{eng=new window.webllm.MLCEngine();eng.setInitProgressCallback(prog);await eng.reload(want);}
    localEngine=eng;
  }
  const stream=await localEngine.chat.completions.create({messages:[{role:"system",content:sys},{role:"user",content:msg}],stream:true});
  let full="";
  const it=stream[Symbol.asyncIterator]();while(true){const r=await it.next();if(r.done)break;const c=r.value;const d=c&&c.choices&&c.choices[0]&&c.choices[0].delta&&c.choices[0].delta.content||"";if(d){full+=d;out.textContent=full;}}
  return full;
}
async function teamRun(msg,out){
  if(!out)out=document.createElement("div");
  let plan="";
  try{plan=await ask("You are the Chief. Break this request into 2 or 3 numbered steps for specialist agents. Reply with ONLY the numbered steps.\n\n"+msg,out);}catch(e){plan="";}
  const steps=String(plan||"").split("\n").map(s=>s.replace(/^\s*\d+[.)]\s*/,"").trim()).filter(s=>s.length>3).slice(0,3);
  let combined="";
  for(let i=0;i<steps.length;i++){
    const asg=agents[i+1]?agents[i+1].sys:SYSTEM;
    let part="";
    try{part=await ask(steps[i]+"\n\n(Original request: "+msg+")",out,asg);}catch(e){part="";}
    if(part)combined+=part+"\n\n";
  }
  let fin="";
  try{fin=await ask("Combine this team work into one clear, complete final answer for the user. Original request: "+msg+"\n\nTeam work:\n"+combined,out);}catch(e){}
  return fin||combined.trim()||"(no reply)";
}
function startVoiceChat(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){setStatus("voice input works in Safari and Chrome; type instead for now");return;}
  closeDrawer();
  let r;try{r=new SR();}catch(e){setStatus("");return;}
  r.lang="en-US";r.interimResults=false;
  setStatus("\ud83c\udf99 listening\u2026");
  r.onresult=function(e){const t=e.results[0][0].transcript;input.value=t;input.dispatchEvent(new Event("input"));setStatus("");fire();};
  r.onerror=function(){setStatus("");};
  r.onend=function(){if(!busy)setStatus("");};
  try{r.start();}catch(e){setStatus("");}
}
/* ---- end plumbing ---- */

function routePick(t){
  t=(t||"").toLowerCase();
  if(/^\s*\/image/.test(t))return "";
  if(/[{};]\s*$|function |def |class |bug|error|debug|code|javascript|python|sql|html|css|api|regex|compile/.test(t))return agents[1].sys;
  if(/security|vulnerab|exploit|hack|audit|password/.test(t))return agents[3].sys;
  if(/research|compare|find out|latest|news|source|study/.test(t))return agents[2].sys;
  if(/story|poem|name ideas|slogan|write me|creative|design/.test(t))return agents[4].sys;
  if(/math|calculate|solve|equation|percent|probability/.test(t))return agents[5].sys;
  if(/architect|system design|scal|infrastructure|database design/.test(t))return agents[6].sys;
  if(/test|qa|review my|check my/.test(t))return agents[7].sys;
  if(/plan|steps|roadmap|workflow|automat/.test(t))return agents[8].sys;
  return SYSTEM;
}
async function ask(msg,out,sysOverride){
  const sys=sysOverride||(activeAgent?(agents.find(a=>a.name===activeAgent)||{}).sys:null)||(localMode&&brainKind==="code"?CODE_SYSTEM:SYSTEM);
  if(localMode){
    try{const full=await askLocal(msg,out,sys);if(full)return full;}catch(e){
      if(e&&e.name==="AbortError")throw e;
      out.textContent="…";
    }
  }
  let firstErr=null;
  for(let k=0;k<POOL.length;k++){
    const idx=(prefer+k)%POOL.length,b=POOL[idx];
    try{
      const full=await askSpace(b,msg,out,sys);
      prefer=idx;
      if(full)return full;
    }catch(e){
      if(e&&e.name==="AbortError")throw e;
      if(!firstErr)firstErr=e;
    }
  }
  const all=(((firstErr&&firstErr.msg)+"")+"").toLowerCase();
  if(all.includes("quota"))throw{msg:"All the free servers are out of quota right now. They refill after a bit — or tap ⚡ phone to run the brain on your iPhone with no servers at all."};
  throw firstErr||{msg:"The AI didn't answer. Try again in a minute."};
}
/* ---- agents panel ---- */
const agentList=document.getElementById("agentList");
function renderAgents(){
  agentList.innerHTML="";
  agents.forEach((a,i)=>{
    const row=document.createElement("div");row.className="pitem"+(activeAgent===a.name?" on":"");
    row.innerHTML='<div class="pi-em">'+a.em+'</div><div class="pi-tx"><b>'+esc(a.name)+(activeAgent===a.name?" · active":"")+'</b><small>'+esc(a.sys.slice(0,90))+'</small></div>';
    const ed=document.createElement("button");ed.textContent="✏️";
    ed.onclick=e=>{e.stopPropagation();
      const nm=prompt("Agent name",a.name);if(nm===null)return;
      const sy=prompt("Agent instructions (system prompt)",a.sys);if(sy===null)return;
      a.name=nm.trim()||a.name;a.sys=sy;SV("ua_agents",agents);if(activeAgent===a.name)activeAgent=a.name;renderAgents();renderChipbar();};
    const del=document.createElement("button");del.textContent="🗑";
    del.onclick=e=>{e.stopPropagation();
      if(!confirm("Delete agent "+a.name+"?"))return;
      agents.splice(i,1);SV("ua_agents",agents);if(activeAgent===a.name)activeAgent=null;renderAgents();renderChipbar();};
    row.onclick=()=>{activeAgent=activeAgent===a.name?null:a.name;renderAgents();renderChipbar();closePanels();setStatus(activeAgent?a.em+" "+activeAgent:"Auto-route");};
    row.appendChild(ed);row.appendChild(del);agentList.appendChild(row);
  });
}
document.getElementById("agentNew").onclick=()=>{
  const nm=prompt("New agent name");if(!nm)return;
  const sy=prompt("Agent instructions (system prompt)","You are "+nm+", a focused AI agent.");
  if(sy===null)return;
  agents.push({name:nm.trim(),sys:sy,em:"🤖"});SV("ua_agents",agents);renderAgents();renderChipbar();
};
document.getElementById("teamMode").onchange=e=>{SV("ua_team",e.target.checked);};
/* ---- memory panel ---- */
const memList=document.getElementById("memList");
function renderMem(){
  memList.innerHTML="";
  (LS("ua_mem",[])||[]).forEach((m,i)=>{
    const row=document.createElement("div");row.className="pitem";
    row.innerHTML='<div class="pi-tx"><b>'+esc(m.slice(0,80))+'</b><small>memory '+(i+1)+'</small></div>';
    const del=document.createElement("button");del.textContent="🗑";
    del.onclick=()=>{const mem=LS("ua_mem",[]);mem.splice(i,1);SV("ua_mem",mem);renderMem();};
    row.appendChild(del);memList.appendChild(row);
  });
  if(!(LS("ua_mem",[])||[]).length)memList.innerHTML='<div class="mini" style="padding:10px">No memories yet. The AI saves important facts here as you talk, or add your own above.</div>';
}
document.getElementById("memAddBtn").onclick=()=>{
  const t=document.getElementById("memAdd").value.trim();if(!t)return;
  const mem=LS("ua_mem",[]);mem.push(t);SV("ua_mem",mem);document.getElementById("memAdd").value="";renderMem();
};
document.getElementById("memExport").onclick=()=>downloadFile("memory.json",JSON.stringify(LS("ua_mem",[]),null,2));
document.getElementById("memImport").onclick=()=>{
  const inp=document.createElement("input");inp.type="file";inp.accept=".json";
  inp.onchange=()=>{const f=inp.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const v=JSON.parse(r.result);if(Array.isArray(v)){SV("ua_mem",v);renderMem();}}catch(e){}};r.readAsText(f);};
  inp.click();
};
document.getElementById("autoMem").checked=LS("ua_autoMem",true);
document.getElementById("autoMem").onchange=e=>SV("ua_autoMem",e.target.checked);
/* ---- projects panel ---- */
const projList=document.getElementById("projList");
let curProj=null;
function renderProjects(){
  projList.innerHTML="";
  (LS("ua_projects",[])||[]).forEach(p=>{
    const row=document.createElement("div");row.className="pitem";
    row.innerHTML='<div class="pi-em">📁</div><div class="pi-tx"><b>'+esc(p.name)+'</b><small>'+((p.tasks||[]).filter(t=>t.done).length)+'/'+(p.tasks||[]).length+' tasks · '+(p.desc?esc(p.desc.slice(0,60)):'no description')+'</small></div>';
    const del=document.createElement("button");del.textContent="🗑";
    del.onclick=e=>{e.stopPropagation();if(!confirm("Delete project "+p.name+"?"))return;const ps=LS("ua_projects",[]).filter(x=>x.name!==p.name);SV("ua_projects",ps);renderProjects();};
    row.onclick=()=>openProject(p);
    row.appendChild(del);projList.appendChild(row);
  });
  if(!(LS("ua_projects",[])||[]).length)projList.innerHTML='<div class="mini" style="padding:10px">No projects yet. Create one above, describe it, and let the AI plan it into tasks.</div>';
}
document.getElementById("projCreate").onclick=()=>{
  const nm=document.getElementById("projName").value.trim();if(!nm)return;
  const ps=LS("ua_projects",[]);if(ps.some(p=>p.name===nm)){alert("A project with that name exists");return;}
  ps.push({name:nm,desc:"",tasks:[],notes:""});SV("ua_projects",ps);document.getElementById("projName").value="";renderProjects();
};
function saveProj(){SV("ua_projects",LS("ua_projects",[]));}
function openProject(p){
  curProj=p;
  projList.style.display="none";
  const d=document.getElementById("projDetail");d.style.display="flex";
  document.getElementById("projTitle").textContent=p.name;
  document.getElementById("projDesc").value=p.desc||"";
  document.getElementById("projNotes").value=p.notes||"";
  renderProjTasks();
}
document.getElementById("projBack").onclick=()=>{curProj=null;projList.style.display="";document.getElementById("projDetail").style.display="none";renderProjects();};
document.getElementById("projDesc").onchange=e=>{if(curProj){curProj.desc=e.target.value;saveProj();}};
document.getElementById("projNotes").onchange=e=>{if(curProj){curProj.notes=e.target.value;saveProj();}};
function renderProjTasks(){
  const box=document.getElementById("projTasks");box.innerHTML="";
  (curProj.tasks||[]).forEach((t,i)=>{
    const row=document.createElement("div");row.className="taskrow"+(t.done?" done":"");
    const cb=document.createElement("input");cb.type="checkbox";cb.checked=!!t.done;
    cb.onchange=()=>{t.done=cb.checked;saveProj();renderProjTasks();};
    const tt=document.createElement("span");tt.className="tt";tt.textContent=t.text;
    const del=document.createElement("button");del.textContent="🗑";
    del.onclick=()=>{curProj.tasks.splice(i,1);saveProj();renderProjTasks();};
    row.appendChild(cb);row.appendChild(tt);row.appendChild(del);box.appendChild(row);
  });
  if(!(curProj.tasks||[]).length)box.innerHTML='<div class="mini" style="padding:6px 2px">No tasks yet — tap Plan it with AI.</div>';
}
document.getElementById("taskAddBtn").onclick=()=>{
  const t=document.getElementById("taskAdd").value.trim();if(!t||!curProj)return;
  curProj.tasks.push({text:t,done:false});document.getElementById("taskAdd").value="";saveProj();renderProjTasks();
};
document.getElementById("projPlan").onclick=async()=>{
  if(!curProj)return;
  const btn=document.getElementById("projPlan");btn.textContent="🪄 planning…";btn.disabled=true;
  try{
    const r=await ask("Project: "+curProj.name+(curProj.desc?"\nDescription: "+curProj.desc:"")+"\nBreak this project into 4 to 8 concrete tasks. Reply ONLY as one task per line, numbered, no other text.",null,SYSTEM);
    const lines=(r||"").split("\n").map(s=>s.replace(/^\s*\d+[.)]\s*/,"").trim()).filter(Boolean);
    curProj.tasks=curProj.tasks||[];
    lines.slice(0,12).forEach(t=>curProj.tasks.push({text:t,done:false}));
    saveProj();renderProjTasks();
  }catch(e){alert(e&&e.msg||"Planning failed");}
  btn.textContent="🪄 Plan it with AI (breaks it into tasks)";btn.disabled=false;
};
/* ---- email & call reach panel ---- */
function renderInt(){
  const b=document.getElementById("intBody");
  b.innerHTML=
   '<div class="pitem"><div class="pi-tx"><b>📧 Email drafting</b><small>Ask the AI to write an email. It opens your Mail app with the message filled in — you tap send.</small></div></div>'+
   '<div class="pitem"><div class="pi-tx"><b>📞 Call scripts</b><small>Ask for a call script. It opens the Phone app with the number and a script you can read or dictate.</small></div></div>'+
   '<div class="mini" style="padding:10px">Real sending, calling and reading an inbox are device-level and need accounts that cost money, so the AI drafts and you approve and send. Nothing is faked.</div>';
}
/* ---- workspace (site builder + code files) ---- */
const wsTabs=document.getElementById("wsTabs");
let wsFiles={},wsCur=null;
function wsDefault(){
  wsFiles={"index.html":'<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>My Site</title>\n<style>body{font:16px/1.5 -apple-system,sans-serif;margin:2rem;background:#fafafa;color:#111}h1{font-size:1.6rem}</style>\n</head>\n<body>\n<h1>Hello 👋</h1>\n<p>Edit this file or ask the AI to build something.</p>\n</body>\n</html>'};
  wsCur="index.html";
}
function renderTabs(){
  wsTabs.innerHTML="";
  Object.keys(wsFiles).forEach(n=>{
    const t=document.createElement("button");t.className="ftab"+(n===wsCur?" on":"");
    const s=document.createElement("span");s.textContent=n;
    const x=document.createElement("button");x.textContent="✕";
    x.onclick=e=>{e.stopPropagation();if(Object.keys(wsFiles).length<2)return alert("Keep at least one file");delete wsFiles[n];if(wsCur===n)wsCur=Object.keys(wsFiles)[0];renderTabs();};
    t.onclick=()=>{wsCur=n;renderTabs();};
    t.appendChild(s);if(Object.keys(wsFiles).length>1)t.appendChild(x);
    wsTabs.appendChild(t);
  });
  const add=document.createElement("button");add.className="ftab";add.textContent="＋ file";
  add.onclick=()=>{const nm=prompt("New file name","page.html");if(!nm)return;wsFiles[nm.trim()]="";wsCur=nm.trim();renderTabs();};
  wsTabs.appendChild(add);
  document.getElementById("wsEditor").value=wsFiles[wsCur]||"";
}
document.getElementById("wsEditor").addEventListener("input",e=>{wsFiles[wsCur]=e.target.value;});
function wsRender(){
  const html=wsFiles[wsCur]||"";
  let doc=html;
  if(!/<html/i.test(doc)){
    const css=Object.keys(wsFiles).filter(n=>n.endsWith(".css")).map(n=>wsFiles[n]).join("\n");
    const js=Object.keys(wsFiles).filter(n=>n.endsWith(".js")).map(n=>wsFiles[n]).join("\n");
    doc='<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>'+css+'</style></head><body>'+html+'<script>'+js+'<\/script></body></html>';
  }else{
    const css=Object.keys(wsFiles).filter(n=>n.endsWith(".css")).map(n=>wsFiles[n]).join("\n");
    const js=Object.keys(wsFiles).filter(n=>n.endsWith(".js")).map(n=>wsFiles[n]).join("\n");
    doc=doc.replace(/<\/head>/i,(css?"<style>"+css+"</style>":"")+"</head>");
    doc=doc.replace(/<\/body>/i,(js?"<script>"+js+"<\/script>":"")+"</body>");
  }
  document.getElementById("siteFrame").srcdoc=doc;
}
function wsRun(){
  const c=document.getElementById("wsConsole");c.style.display="block";c.textContent="running…";
  const errs=[];
  const jsFiles=Object.keys(wsFiles).filter(n=>n.endsWith(".js"));
  jsFiles.forEach(n=>{try{new Function(wsFiles[n])}catch(e){errs.push(n+": "+e.message)}});
  const html=wsFiles[wsCur]||Object.values(wsFiles)[0]||"";
  if(!/<[a-z]/i.test(html))errs.push("looks empty");
  c.textContent=errs.length?"⚠️ "+errs.join(" · "):"✅ no obvious errors · preview below";
  wsRender();
}
document.getElementById("wsRun").onclick=wsRun;
document.getElementById("siteGo").onclick=async()=>{
  const p=document.getElementById("sitePrompt").value.trim();
  if(!p){document.getElementById("siteStatus").textContent="describe it first";return;}
  const st=document.getElementById("siteStatus");st.textContent="🪄 building…";
  try{
    const sys="You are a web builder. Reply ONLY with one complete HTML file (inline CSS+JS), complete and working, no explanations, starting with <!DOCTYPE html>.";
    const html=await ask(p,null,sys);
    const m=(html||"").match(/<!DOCTYPE html[\s\S]*<\/html>/i)||((html||"").match(/<html[\s\S]*<\/html>/i));
    if(m){wsFiles={"index.html":m[0]};wsCur="index.html";renderTabs();wsRender();st.textContent="✅ built — preview below, edit or save it";}
    else{st.textContent="⚠️ the AI didn't return a full page — try again";}
  }catch(e){st.textContent="⚠️ "+(e&&e.msg||e&&e.message||"build failed");}
};
document.getElementById("siteDown").onclick=()=>{
  const name=(wsCur||"site").split(".")[0];
  downloadFile(name+".html",(wsFiles[wsCur]||"").startsWith("<!DOCTYPE")?wsFiles[wsCur]:("<!DOCTYPE html>\n"+(wsFiles[wsCur]||"")));
};
document.getElementById("siteCopy").onclick=async()=>{try{await navigator.clipboard.writeText(wsFiles[wsCur]||"");document.getElementById("siteStatus").textContent="📋 copied";}catch(e){}};
/* ---- chat search ---- */
document.getElementById("chatSearch").addEventListener("input",e=>{
  const q=e.target.value.toLowerCase();renderChatList(q);
});
/* ---- panel wiring ---- */
function openPanel(id){closePanels();document.getElementById(id).style.display="flex";closeDrawer();}
function closePanels(){["sitePanel","agentsPanel","memPanel","projPanel","dashPanel","resPanel","intPanel","setPanel"].forEach(i=>document.getElementById(i).style.display="none");}
const P={site:"sitePanel",agents:"agentsPanel",mem:"memPanel",proj:"projPanel",dash:"dashPanel",res:"resPanel",int:"intPanel",set:"setPanel"};
document.getElementById("sitebtn").onclick=()=>{openPanel(P.site);wsDefault();renderTabs();wsRender();};
document.getElementById("agentbtn").onclick=()=>{openPanel(P.agents);renderAgents();document.getElementById("teamMode").checked=!!LS("ua_team",false);};
document.getElementById("membtn").onclick=()=>{openPanel(P.mem);renderMem();};
document.getElementById("projbtn").onclick=()=>{openPanel(P.proj);document.getElementById("projDetail").style.display="none";projList.style.display="";renderProjects();};
document.getElementById("dashbtn").onclick=()=>{openPanel(P.dash);renderDash();};
document.getElementById("resbtn").onclick=()=>{openPanel(P.res);renderRes();};
document.getElementById("intbtn").onclick=()=>{openPanel(P.int);renderInt();};
document.getElementById("setbtn").onclick=()=>{openPanel(P.set);renderSettings();};
[["siteClose",P.site],["agentsClose",P.agents],["memClose",P.mem],["projClose",P.proj],["dashClose",P.dash],["resClose",P.res],["intClose",P.int],["setClose",P.set]].forEach(([b,p])=>document.getElementById(b).onclick=closePanels);
/* ---- settings ---- */
function renderSettings(){
  const b=document.getElementById("setBody");
  const dark=LS("ua_theme19","light")==="dark";
  b.innerHTML=
   '<div class="togglerow"><span>🌙 Dark mode</span><input type="checkbox" id="tgDark" '+(dark?"checked":"")+'></div>'+
   '<div class="togglerow"><span>🧠 Auto-remember facts</span><input type="checkbox" id="tgMem" '+(LS("ua_autoMem",true)?"checked":"")+'></div>'+
   '<div class="togglerow"><span>🧭 Auto-route to specialist agents</span><input type="checkbox" id="tgRoute" '+(LS("ua_route",true)?"checked":"")+'></div>'+
   '<div class="togglerow"><span>🧲 Team mode (agents collaborate)</span><input type="checkbox" id="tgTeam" '+(LS("ua_team",false)?"checked":"")+'></div>'+
   '<div class="pitem"><div class="pi-tx"><b>⬇️ Export everything</b><small>one file with all chats, agents, memory, projects — your phone only, nothing uploaded</small></div><button class="sbtn" id="exAll" style="flex:0 0 auto;padding:9px 12px">Save</button></div>'+
   '<div class="pitem"><div class="pi-tx"><b>🗑 Wipe local data</b><small>removes everything this app saved on your phone</small></div><button class="sbtn" id="wipeAll" style="flex:0 0 auto;padding:9px 12px">Wipe</button></div>'+
   '<div class="mini" style="padding:10px">Uncensored AI · free server pool + ⚡ phone brains · nothing leaves except what you send</div>';
  document.getElementById("tgDark").onchange=e=>{setTheme19(e.target.checked?"dark":"light");};
  document.getElementById("tgMem").onchange=e=>SV("ua_autoMem",e.target.checked);
  document.getElementById("tgRoute").onchange=e=>SV("ua_route",e.target.checked);
  document.getElementById("tgTeam").onchange=e=>SV("ua_team",e.target.checked);
  document.getElementById("exAll").onclick=()=>{
    const dump={chats:LS("ua_chats",[]),cur:LS("ua_cur",null),mem:LS("ua_mem",[]),agents:LS("ua_agents",[]),projects:LS("ua_projects",[]),stats:LS("ua_stats",{})};
    downloadFile("ai-backup.json",JSON.stringify(dump,null,2));
  };
  document.getElementById("wipeAll").onclick=()=>{
    if(!confirm("Wipe ALL local data? This can't be undone."))return;
    ["ua_chats","ua_cur","ua_mem","ua_prefs","ua_agents","ua_projects","ua_files","ua_stats","ua_theme19"].forEach(k=>localStorage.removeItem(k));
    location.reload();
  };
}
function setTheme19(t){SV("ua_theme19",t);document.body.dataset.theme=t;document.querySelector('meta[name=theme-color]').setAttribute("content",t==="dark"?"#212121":"#ffffff");}
if(!LS("ua_theme19",null))SV("ua_theme19","light");
setTheme19(LS("ua_theme19","light"));
/* ---- top bar wiring ---- */
document.getElementById("searchbtn").onclick=()=>{const d=document.getElementById("drawer");d.classList.add("open");document.getElementById("shade").classList.add("on");setTimeout(()=>document.getElementById("chatSearch").focus(),250);};
document.getElementById("phonebtn").onclick=()=>{
  const on=!localMode;localMode=on;SV("ua_localMode",on);
  document.getElementById("phonebtn").style.background=on?"var(--accent)":"";
  document.getElementById("phonebtn").style.color=on?"#fff":"";
  setStatus(on?"⚡ phone brain on — runs on your iPhone, no servers":"server pool on");
};
if(LS("ua_localMode",false)){localMode=true;document.getElementById("phonebtn").style.background="var(--accent)";document.getElementById("phonebtn").style.color="#fff";}
document.getElementById("newbtn").onclick=newChat;
document.getElementById("modelbtn").onclick=()=>{const d=document.getElementById("drawer");d.classList.add("open");document.getElementById("shade").classList.add("on");};
document.getElementById("plusBtn").onclick=()=>{const s=document.getElementById("plusMenu");s.style.display=s.style.display==="flex"?"none":"flex";};
document.getElementById("pmFiles").onclick=()=>{document.getElementById("plusMenu").style.display="none";document.getElementById("fpick").click();};
document.getElementById("pmImage").onclick=()=>{document.getElementById("plusMenu").style.display="none";const i=document.getElementById("input");i.value="/image ";i.focus();};
document.getElementById("pmThink").onclick=()=>{document.getElementById("plusMenu").style.display="none";thinkHarder=!thinkHarder;SV("ua_think",thinkHarder);setStatus(thinkHarder?"🧠 thinking harder on":"thinking harder off");};
document.getElementById("pmPlug").onclick=()=>{document.getElementById("plusMenu").style.display="none";openPanel(P.int);};
document.getElementById("clip").onclick=()=>document.getElementById("fpick").click();
document.getElementById("cardAgents").onclick=()=>openPanel(P.agents);
document.getElementById("rowWrite").onclick=()=>{const i=document.getElementById("input");i.value="Write ";i.focus();};
document.getElementById("rowVoice").onclick=startVoiceChat;
document.getElementById("brainChat").onclick=()=>{brainKind="chat";SV("ua_brain","chat");setStatus("💬 chat brain");closeDrawer();};
document.getElementById("brainCode").onclick=()=>{brainKind="code";SV("ua_brain","code");setStatus("💻 coder brain");closeDrawer();};
brainKind=LS("ua_brain","chat");
thinkHarder=!!LS("ua_think",false);
window.addEventListener("resize",()=>{const i=document.getElementById("input");i.style.height="auto";i.style.height=Math.min(i.scrollHeight,120)+"px";});
document.getElementById("siteFrame").addEventListener("load",()=>{});
renderAgents();renderChatList();
