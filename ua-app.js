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
  if(all.includes("quota"))throw{msg:"All the free servers are out of quota right now. They refill after a bit — or tap ⚡ phone to run the brain on your phone with no quota."};
  throw firstErr||{msg:"The AI didn't answer. Try again in a minute."};
}
/* ---- agents panel ---- */
const agentList=document.getElementById("agentList");
function renderAgents(){
  agentList.innerHTML="";
  agents.forEach((a,i)=>{
    const row=document.createElement("div");row.className="pitem"+(activeAgent===a.name?" on":"");
    row.innerHTML='<div class="pi-em">'+a.em+'</div><div class="pi-tx"><b>'+esc(a.name)+(activeAgent===a.name?" · active":"")+'</b><small>'+esc(a.sys.slice(0,110))+'…</small></div>';
    const ed=document.createElement("button");ed.textContent="✏️";
    ed.onclick=e=>{e.stopPropagation();
      const nm=prompt("Agent name",a.name);if(nm===null)return;
      const sy=prompt("Agent instructions (system prompt)",a.sys);if(sy===null)return;
      a.name=nm.trim()||a.name;a.sys=sy;SV("ua_agents",agents);if(activeAgent===a.name)activeAgent=a.name;renderAgents();renderChipbar();};
    const del=document.createElement("button");del.textContent="🗑";
    del.onclick=e=>{e.stopPropagation();
      if(!confirm("Delete agent "+a.name+"?"))return;
      agents.splice(i,1);SV("ua_agents",agents);if(activeAgent===a.name)activeAgent=null;renderAgents();renderChipbar();};
    row.onclick=()=>{activeAgent=activeAgent===a.name?null:a.name;renderAgents();renderChipbar();closePanels();setStatus(activeAgent?a.em+" "+activeAgent+" is answering":"");setTimeout(()=>setStatus(""),2500);};
    row.appendChild(ed);row.appendChild(del);agentList.appendChild(row);
  });
}
document.getElementById("agentNew").onclick=()=>{
  const nm=prompt("New agent name");if(!nm)return;
  const sy=prompt("Agent instructions (system prompt)","You are "+nm+", a focused AI agent.");
  agents.push({em:"🤖",name:nm.trim(),sys:sy||""});SV("ua_agents",agents);renderAgents();
};
const teamMode=document.getElementById("teamMode");
teamMode.checked=!!prefs.team;
teamMode.onchange=()=>{prefs.team=teamMode.checked;SV("ua_prefs",prefs);};
document.getElementById("agentbtn").onclick=()=>{openPanel("agentsPanel");renderAgents();};
document.getElementById("agentsClose").onclick=closePanels;
async function teamRun(msg,out){
  setStatus("🧭 chief planning…");
  let plan="";
  try{plan=await ask("Break this request into at most 3 short sequential steps for a small AI team. Reply with ONLY the numbered steps, one line each:\n\n"+msg,out,agents[0].sys);}catch(e){throw e;}
  const steps=plan.split("\n").map(s=>s.replace(/^\s*\d+[.)]\s*/,"").trim()).filter(s=>s.length>3).slice(0,3);
  let combined="";
  for(let i=0;i<steps.length;i++){
    setStatus("🧭 agent "+(i+1)+" of "+steps.length+"…");
    const asg=i===0?agents[1].sys:i===1?agents[2].sys:agents[0].sys;
    let part="";
    try{part=await ask("Overall request: "+msg+"\nYour step: "+steps[i]+"\nWork done so far:\n"+(combined||"(nothing yet)")+"\n\nDo ONLY your step:",out,asg);}catch(e){part="(step failed: "+((e&&e.msg)+"")+")";}
    combined+="\n\nStep "+(i+1)+" ("+steps[i]+"):\n"+part;
  }
  setStatus("🧭 combining results…");
  const fin=await ask("Combine this team work into one clear, complete final answer for the user. Original request: "+msg+"\n\nTeam work:\n"+combined,out,agents[0].sys);
  return fin;
}
/* ---- memory ---- */
const memList=document.getElementById("memList");
function renderMem(){
  memList.innerHTML="";
  mems.slice().reverse().forEach((m,ri)=>{
    const i=mems.length-1-ri;
    const row=document.createElement("div");row.className="pitem";
    row.innerHTML='<div class="pi-em">🧠</div><div class="pi-tx"><small style="max-height:none;font-size:13px">'+esc(m.t)+'</small></div>';
    const del=document.createElement("button");del.textContent="🗑";
    del.onclick=()=>{mems.splice(i,1);SV("ua_mem",mems);renderMem();};
    row.appendChild(del);memList.appendChild(row);
  });
  if(!mems.length)memList.innerHTML='<div class="mini" style="padding:10px">No memories yet. Add one, or tap 🧠 remember under an answer.</div>';
}
document.getElementById("memAddBtn").onclick=()=>{
  const v=document.getElementById("memAdd").value.trim();if(!v)return;
  mems.push({t:v,ts:Date.now()});SV("ua_mem",mems);document.getElementById("memAdd").value="";renderMem();
};
document.getElementById("memExport").onclick=()=>{
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(mems)],{type:"application/json"}));a.download="memory.json";a.click();URL.revokeObjectURL(a.href);
};
document.getElementById("memImport").onclick=async()=>{
  const v=prompt("Paste memory JSON to import");if(!v)return;
  try{const arr=JSON.parse(v);if(Array.isArray(arr)){mems=mems.concat(arr.map(x=>typeof x==="string"?{t:x}:x)).slice(-200);SV("ua_mem",mems);renderMem();}}catch(e){alert("Couldn't parse that JSON");}
};
const autoMem=document.getElementById("autoMem");
autoMem.checked=!!prefs.automem;
autoMem.onchange=()=>{prefs.automem=autoMem.checked;SV("ua_prefs",prefs);};
document.getElementById("membtn").onclick=()=>{openPanel("memPanel");renderMem();};
document.getElementById("memClose").onclick=closePanels;
/* ---- projects ---- */
let projects=LS("ua_projects",[]);
const projList=document.getElementById("projList"),projDetail=document.getElementById("projDetail"),projTasks=document.getElementById("projTasks");
function renderProjects(){
  projList.innerHTML="";
  if(!projects.length)projList.innerHTML='<div class="mini" style="padding:10px">No projects yet. A project keeps a goal, task list and notes in one place — and the AI sees the active one while you chat.</div>';
  projects.forEach(p=>{
    const row=document.createElement("div");row.className="pitem"+(activeProj===p.id?" on":"");
    const done=p.tasks.filter(t=>t.done).length;
    row.innerHTML='<div class="pi-em">📋</div><div class="pi-tx"><b>'+esc(p.name)+'</b><small>'+done+'/'+p.tasks.length+' tasks'+(p.desc?' · '+esc(p.desc.slice(0,60)):'')+'</small></div>';
    const del=document.createElement("button");del.textContent="🗑";
    del.onclick=e=>{e.stopPropagation();if(!confirm("Delete project "+p.name+"?"))return;projects=projects.filter(x=>x.id!==p.id);if(activeProj===p.id)activeProj=null;SV("ua_projects",projects);renderProjects();renderChipbar();};
    row.onclick=()=>{activeProj=activeProj===p.id?null:p.id;renderProjects();renderChipbar();openDetail(p);};
    row.appendChild(del);projList.appendChild(row);
  });
}
let curProj=null;
function openDetail(p){
  curProj=p;projList.style.display="none";projDetail.style.display="flex";
  document.getElementById("projTitle").textContent="📋 "+p.name;
  document.getElementById("projDesc").value=p.desc||"";
  document.getElementById("projNotes").value=p.notes||"";
  renderTasks();
}
function renderTasks(){
  projTasks.innerHTML="";
  if(!curProj)return;
  curProj.tasks.forEach((t,i)=>{
    const row=document.createElement("div");row.className="taskrow"+(t.done?" done":"");
    const cb=document.createElement("input");cb.type="checkbox";cb.checked=!!t.done;
    cb.onchange=()=>{t.done=cb.checked;SV("ua_projects",projects);renderTasks();renderProjects();};
    const tt=document.createElement("div");tt.className="tt";tt.textContent=t.t;
    const del=document.createElement("button");del.textContent="✕";
    del.onclick=()=>{curProj.tasks.splice(i,1);SV("ua_projects",projects);renderTasks();renderProjects();};
    row.appendChild(cb);row.appendChild(tt);row.appendChild(del);projTasks.appendChild(row);
  });
  if(!curProj.tasks.length)projTasks.innerHTML='<div class="mini">No tasks yet — add one or tap Plan it with AI.</div>';
}
document.getElementById("projCreate").onclick=()=>{
  const v=document.getElementById("projName").value.trim();if(!v)return;
  const p={id:"p"+Date.now(),name:v,desc:"",tasks:[],notes:""};
  projects.push(p);SV("ua_projects",projects);document.getElementById("projName").value="";renderProjects();openDetail(p);
};
document.getElementById("projBack").onclick=()=>{projDetail.style.display="none";projList.style.display="";curProj=null;renderProjects();};
document.getElementById("projDesc").onchange=()=>{if(curProj){curProj.desc=document.getElementById("projDesc").value;SV("ua_projects",projects);}};
document.getElementById("projNotes").onchange=()=>{if(curProj){curProj.notes=document.getElementById("projNotes").value;SV("ua_projects",projects);}};
document.getElementById("taskAddBtn").onclick=()=>{
  const v=document.getElementById("taskAdd").value.trim();if(!v||!curProj)return;
  curProj.tasks.push({t:v,done:false});SV("ua_projects",projects);document.getElementById("taskAdd").value="";renderTasks();renderProjects();
};
document.getElementById("projPlan").onclick=async()=>{
  if(!curProj||busy)return;
  const desc=document.getElementById("projDesc").value.trim()||curProj.name;
  setStatus("🪄 planning project…");
  try{
    const plan=await ask("Break this project into 3 to 7 concrete tasks. Reply with ONLY a plain list, one task per line, no numbering:\n\nProject: "+curProj.name+"\nGoal: "+desc,{textContent:""},"You are a project planner.");
    const lines=plan.split("\n").map(s=>s.replace(/^[\s\-*\d.)]+/,"").trim()).filter(s=>s.length>2).slice(0,7);
    curProj.tasks=curProj.tasks.concat(lines.map(t=>({t,done:false})));
    SV("ua_projects",projects);renderTasks();renderProjects();
  }catch(e){setStatus("");}
  setStatus("");
};
document.getElementById("projbtn").onclick=()=>{openPanel("projPanel");projDetail.style.display="none";projList.style.display="";renderProjects();};
document.getElementById("projClose").onclick=closePanels;
/* ---- workspace (site builder + code editor) ---- */
let wsFiles=LS("ua_files",[{name:"index.html",content:"<!DOCTYPE html>\n<html>\n<body style=\"font-family:sans-serif\">\n  <h1>Hello</h1>\n</body>\n</html>"}]),wsCur=0;
const SITE_SYSTEM="You are a website builder. Reply with ONE complete single-file website: one HTML document starting with <!DOCTYPE html> that has all HTML, CSS and JavaScript inline. No text before or after it, no markdown code fences. Make it polished, modern and mobile-friendly.";
let siteHTML="";
const sitePanel=document.getElementById("sitePanel"),sitePrompt=document.getElementById("sitePrompt"),
      siteGo=document.getElementById("siteGo"),siteDown=document.getElementById("siteDown"),
      siteCopy=document.getElementById("siteCopy"),siteFrame=document.getElementById("siteFrame"),
      siteStatus=document.getElementById("siteStatus"),wsTabs=document.getElementById("wsTabs"),
      wsEditor=document.getElementById("wsEditor"),wsConsole=document.getElementById("wsConsole");
function extractHTML(t){
  const m=t.match(/```(?:html)?\s*([\s\S]*?)```/);
  let x=m?m[1]:String(t||"");
  const i=x.search(/<!DOCTYPE|<html/i);
  return i>=0?x.slice(i).trim():null;
}
function renderTabs(){
  wsTabs.innerHTML="";
  wsFiles.forEach((f,i)=>{
    const t=document.createElement("button");t.className="ftab"+(i===wsCur?" on":"");
    t.innerHTML=esc(f.name)+'<button title="delete">✕</button>';
    t.onclick=e=>{
      if(e.target.tagName==="BUTTON"){wsFiles.splice(i,1);if(!wsFiles.length)wsFiles=[{name:"index.html",content:""}];wsCur=0;SV("ua_files",wsFiles);renderTabs();syncEditor();return;}
      wsCur=i;renderTabs();syncEditor();};
    wsTabs.appendChild(t);
  });
  const add=document.createElement("button");add.className="ftab";add.textContent="＋ file";
  add.onclick=()=>{const nm=prompt("File name (e.g. style.css, app.js)");if(!nm)return;wsFiles.push({name:nm.trim(),content:""});wsCur=wsFiles.length-1;SV("ua_files",wsFiles);renderTabs();syncEditor();};
  wsTabs.appendChild(add);
}
function syncEditor(){wsEditor.value=wsFiles[wsCur]?wsFiles[wsCur].content:"";}
wsEditor.addEventListener("input",()=>{if(wsFiles[wsCur]){wsFiles[wsCur].content=wsEditor.value;SV("ua_files",wsFiles);}});
function runPreview(){
  let html=(wsFiles.find(f=>f.name.toLowerCase().endsWith(".html"))||wsFiles[0]).content;
  wsFiles.forEach(f=>{
    const n=f.name.toLowerCase();
    if(n.endsWith(".css"))html=html.replace(/<\/head>/i,'<style>'+f.content+'</style></head>');
    if(n.endsWith(".js"))html=html.replace(/<\/body>/i,'<script>'+f.content+'<\/script></body>');
  });
  html=html.replace(/<\/body>/i,'<script>(function(){["log","error","warn"].forEach(function(k){var o=console[k];console[k]=function(){try{parent.postMessage({wsc:k+":"+[].slice.call(arguments).join(" ")},"*")}catch(e){};o.apply(console,arguments)}});window.onerror=function(m){try{parent.postMessage({wsc:"error:"+m},"*")}catch(e){}}})();<\/script></body>');
  wsConsole.style.display="block";wsConsole.textContent="";
  siteFrame.srcdoc=html;
}
window.addEventListener("message",e=>{if(e.data&&e.data.wsc){wsConsole.textContent+=e.data.wsc+"\n";wsConsole.scrollTop=wsConsole.scrollHeight;}});
document.getElementById("wsRun").onclick=runPreview;
siteGo.onclick=async()=>{
  const p=sitePrompt.value.trim();
  if(!p||busy)return;
  siteHTML="";siteFrame.removeAttribute("srcdoc");
  siteStatus.textContent="building…";
  const out=document.createElement("div");
  try{
    const raw=await ask(SITE_SYSTEM+"\n\nWebsite request: "+p,out);
    siteHTML=extractHTML(raw);
    if(siteHTML&&siteHTML.length>200){
      const ix=wsFiles.findIndex(f=>f.name.toLowerCase()==="index.html");
      if(ix>=0)wsFiles[ix].content=siteHTML;else wsFiles.push({name:"index.html",content:siteHTML});
      wsCur=wsFiles.findIndex(f=>f.name.toLowerCase()==="index.html");
      SV("ua_files",wsFiles);renderTabs();syncEditor();runPreview();
      siteDown.style.display="";siteCopy.style.display="";
      siteStatus.textContent="done — preview below. want it online? Save the file, paste its contents in our chat, and say publish: I'll put it up and text you the link.";
    }else{
      siteStatus.textContent="the brain didn't return a full page — try again or describe it in more detail.";
    }
  }catch(e){siteStatus.textContent=(e&&e.msg)||"couldn't build — try again in a minute.";}
};
siteDown.onclick=()=>{
  wsFiles.forEach(f=>{
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([f.content],{type:"text/plain"}));
    a.download=f.name;a.click();URL.revokeObjectURL(a.href);
  });
};
siteCopy.onclick=async()=>{
  try{await navigator.clipboard.writeText(wsFiles[wsCur].content);siteStatus.textContent="copied "+wsFiles[wsCur].name+" — paste it in our chat and say publish — I'll put it online and text you the link.";}
  catch(e){siteStatus.textContent="copy blocked — try Save instead.";}
};
document.getElementById("sitebtn").onclick=()=>{openPanel("sitePanel");renderTabs();syncEditor();};
document.getElementById("siteClose").onclick=closePanels;
/* ---- settings ---- */
const setBody=document.getElementById("setBody");
function renderSettings(){
  setBody.innerHTML="";
  const add=(label,el)=>{const r=document.createElement("div");r.className="togglerow";r.innerHTML="<span>"+label+"</span>";r.appendChild(el);setBody.appendChild(r);};
  const mk=()=>{const c=document.createElement("input");c.type="checkbox";return c;};
  const th=mk();th.checked=prefs.theme==="light";th.onchange=()=>{prefs.theme=th.checked?"light":"dark";SV("ua_prefs",prefs);document.body.dataset.theme=prefs.theme;};
  add("☀️ Light mode",th);
  const vf=mk();vf.checked=!!prefs.verify;vf.onchange=()=>{prefs.verify=vf.checked;SV("ua_prefs",prefs);};
  add("✅ Auto double-check every answer (uses extra quota)",vf);
  const sp=mk();sp.checked=!!prefs.speak;sp.onchange=()=>{prefs.speak=sp.checked;SV("ua_prefs",prefs);};
  add("🔊 Speak answers out loud",sp);
  const rt=mk();rt.checked=!!prefs.route;rt.onchange=()=>{prefs.route=rt.checked;SV("ua_prefs",prefs);};
  add("🧭 Auto-route to specialist agents",rt);
  const ti=document.createElement("textarea");ti.className="tin";ti.rows=3;ti.value=prefs.instr||"";ti.placeholder="Custom instructions the AI always follows…";
  ti.onchange=()=>{prefs.instr=ti.value;SV("ua_prefs",prefs);};
  const r1=document.createElement("div");r1.className="togglerow";r1.style.display="block";r1.innerHTML="📌 Custom instructions";r1.appendChild(ti);setBody.appendChild(r1);
  const hi=document.createElement("input");hi.type="number";hi.min="2";hi.max="20";hi.style.width="70px";hi.value=prefs.hist;hi.onchange=()=>{prefs.hist=Math.max(2,Math.min(20,+hi.value||6));SV("ua_prefs",prefs);};
  const r2=document.createElement("div");r2.className="togglerow";r2.innerHTML="<span>🗨️ Messages of memory per reply</span>";r2.appendChild(hi);setBody.appendChild(r2);
  const to=document.createElement("input");to.type="number";to.min="256";to.max="2048";to.step="128";to.style.width="90px";to.value=prefs.tokens;to.onchange=()=>{prefs.tokens=Math.max(256,Math.min(2048,+to.value||512));SV("ua_prefs",prefs);};
  const r3=document.createElement("div");r3.className="togglerow";r3.innerHTML="<span>📏 Max answer length (tokens)</span>";r3.appendChild(to);setBody.appendChild(r3);
  const st=document.createElement("div");st.style.padding="10px 2px";st.className="mini";
  let tot={ok:0,fail:0,ms:0,n:0};
  let html="<b>📊 Server performance</b><br>";
  for(const k in stats){const s=stats[k];tot.ok+=s.ok;tot.fail+=s.fail;tot.n+=s.n;tot.ms+=s.ms;
    html+=k+": "+s.ok+" ok, "+s.fail+" failed, avg "+(s.n?Math.round(s.ms/s.n/100)/10:"-")+"s<br>";}
  if(tot.n)html+="<b>total: "+tot.ok+" ok, "+tot.fail+" failed, avg "+Math.round(tot.ms/tot.n/100)/10+"s</b><br>";
  st.innerHTML=html||"no server calls yet";
  setBody.appendChild(st);
  const clr=document.createElement("button");clr.className="sbtn";clr.textContent="Clear stats";
  clr.onclick=()=>{stats={};SV("ua_stats",stats);renderSettings();};
  setBody.appendChild(clr);
  const ex=document.createElement("button");ex.className="sbtn";ex.textContent="⬇️ Export everything (chats, memory, agents)";
  ex.style.marginTop="8px";
  ex.onclick=()=>{const d={chats,mems,agents,prefs,projects,wsFiles};const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(d)],{type:"application/json"}));a.download="ai-backup.json";a.click();URL.revokeObjectURL(a.href);};
  setBody.appendChild(ex);
}
document.getElementById("setbtn").onclick=()=>{openPanel("setPanel");renderSettings();};
document.getElementById("setClose").onclick=closePanels;
/* ---- voice input ---- */
const micBtn=document.getElementById("micBtn");
let rec=null,recOn=false;
micBtn.onclick=()=>{
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){setStatus("voice input needs iOS Safari with Siri enabled — type instead");setTimeout(()=>setStatus(""),2500);return;}
  if(recOn){rec.stop();return;}
  rec=new SR();rec.lang="en-US";rec.interimResults=true;rec.continuous=false;
  micBtn.classList.add("rec");
  rec.onresult=e=>{let t="";for(const r of e.results)t+=r[0].transcript;input.value=t;input.dispatchEvent(new Event("input"));};
  rec.onend=()=>{recOn=false;micBtn.classList.remove("rec");if(input.value.trim())fire();};
  rec.onerror=()=>{recOn=false;micBtn.classList.remove("rec");};
  try{rec.start();recOn=true;}catch(e){micBtn.classList.remove("rec");}
};
/* ---- chips + init ---- */
function renderChipbar(){
  const bar=document.getElementById("chipsbar");
  bar.innerHTML="";let any=false;
  if(activeAgent){any=true;const c=document.createElement("div");c.className="chip2";
    c.innerHTML="🤖 "+esc(activeAgent)+" <button>✕</button>";
    c.querySelector("button").onclick=()=>{activeAgent=null;renderAgents();renderChipbar();};bar.appendChild(c);}
  if(activeProj){any=true;const p=projects.find(x=>x.id===activeProj);if(p){const c=document.createElement("div");c.className="chip2";
    c.innerHTML="📋 "+esc(p.name)+" <button>✕</button>";
    c.querySelector("button").onclick=()=>{activeProj=null;renderChipbar();};bar.appendChild(c);}}
  bar.style.display=any?"flex":"none";
}
document.body.dataset.theme=prefs.theme||"dark";
if(curChat){const c=chats.find(x=>x.id===curChat);if(c){history=c.msgs.slice();history.forEach(h=>bubble(h.r,h.t));}}
renderChats();renderMem();renderChipbar();
POOL.forEach(b=>fetch(b.base+"/gradio_api/info").then(()=>{}).catch(()=>{}));
