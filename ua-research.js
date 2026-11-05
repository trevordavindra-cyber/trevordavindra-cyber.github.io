/* ---- research lab + compare + stop + chat search + wiring ---- */
if(typeof localMode==="undefined")window.localMode=false;
if(typeof brainKind==="undefined")window.brainKind="chat";
function showPanel(p){["sitePanel","agentsPanel","memPanel","projPanel","dashPanel","resPanel","intPanel","setPanel"].forEach(x=>{const e=document.getElementById(x);if(e)e.style.display="none";});p.style.display="flex";}
const resPanel=document.getElementById("resPanel"),resQ=document.getElementById("resQ"),resGo=document.getElementById("resGo"),
      cmpGo=document.getElementById("cmpGo"),resOut=document.getElementById("resOut"),resStatus=document.getElementById("resStatus");
function errTxt(e){return (e&&(e.msg||e.message||e.reason))||String(e||"unknown");}
async function jina(u){
  const r=await fetch("https://r.jina.ai/"+u);
  if(!r.ok)throw new Error("read failed");
  return (await r.text()).slice(0,12000);
}
async function ddg(q){
  const t=await jina("https://html.duckduckgo.com/html/?q="+encodeURIComponent(q));
  const links=[...t.matchAll(/\[([^\]]{6,140})\]\((https?:\/\/[^\)\s]+)\)/g)]
    .map(m=>({t:m[1],u:m[2]}))
    .filter(x=>!x.u.includes("duckduckgo.com")&&!x.u.includes("duck.co"));
  return links.slice(0,5);
}
resGo.onclick=async()=>{
  const q=resQ.value.trim();
  if(!q||busy)return;
  resOut.innerHTML="";resStatus.textContent="🪄 planning searches…";
  try{
    const plan=await ask("You are a research planner. Turn this question into exactly 3 different web search queries that would find good sources. Reply with ONLY the 3 queries, one per line:\n\n"+q,{textContent:""});
    const qs=plan.split("\n").map(s=>s.replace(/^[\s\-*\d.)]+/,"").trim()).filter(s=>s.length>2).slice(0,3);
    if(!qs.length){resStatus.textContent="couldn't plan searches — try again.";return;}
    const found=[];
    for(let i=0;i<qs.length;i++){
      resStatus.textContent="🔎 searching "+(i+1)+" of "+qs.length+"…";
      try{found.push(...await ddg(qs[i]));}catch(e){}
    }
    const seen=new Set(),picks=[];
    for(const x of found){if(!seen.has(x.u)){seen.add(x.u);picks.push(x);}if(picks.length>=4)break;}
    if(!picks.length){resStatus.textContent="search came back empty — the servers may be napping, tap again.";return;}
    let corpus="";
    for(let i=0;i<picks.length;i++){
      resStatus.textContent="📖 reading source "+(i+1)+" of "+picks.length+"…";
      try{corpus+="\n\nSOURCE "+(i+1)+": "+picks[i].t+"\n"+picks[i].u+"\n"+await jina(picks[i].u);}catch(e){}
    }
    if(!corpus.trim()){resStatus.textContent="couldn't read any sources — try again in a bit.";return;}
    resStatus.textContent="✍️ writing report…";
    const rep=await ask("Research question: "+q+"\n\nWrite a clear structured research report with short section headings. Ground every claim in the sources below and cite them like [S1]. If sources conflict or disagree, say so plainly. End with a SOURCES list of the ones you used.\n\n"+corpus.slice(0,40000),{textContent:""});
    resOut.innerHTML=md(rep);
    resStatus.textContent="done — read "+picks.length+" real sources";
  }catch(e){resStatus.textContent="research failed: "+errTxt(e);}
};
cmpGo.onclick=async()=>{
  const q=resQ.value.trim();
  if(!q||busy)return;
  resOut.innerHTML="";busy=true;
  const runs=[];
  const cands=[{n:"free brain",f:()=>askSpace(POOL[0],q,{textContent:""},SYSTEM)},{n:"phone brain",f:()=>askLocal(q,{textContent:""},SYSTEM)}];
  for(const b of cands){
    resStatus.textContent="asking "+b.n+"…";
    const t0=Date.now();let ans="";
    try{ans=await b.f();}catch(e){ans="("+errTxt(e)+")";}
    const ms=Date.now()-t0;
    runs.push({n:b.n,ms,a:ans});
    const r=document.createElement("div");r.className="m a";
    r.innerHTML="<b>"+esc(b.n)+"</b> · "+(Math.round(ms/100)/10)+"s<br>"+md(ans);
    resOut.appendChild(r);resOut.scrollTop=resOut.scrollHeight;
  }
  resStatus.textContent="⚖️ combining…";
  try{
    const fin=await ask("Two AI models answered the same request. Compare them briefly, then give one combined best answer, noting which model got closer:\n\nQuestion: "+q+"\n\nAnswer A ("+runs[0].n+"):\n"+runs[0].a+"\n\nAnswer B ("+runs[1].n+"):\n"+runs[1].a,{textContent:""});
    const r=document.createElement("div");r.className="m a";
    r.innerHTML="<b>⚖️ combined best answer</b><br>"+md(fin);resOut.appendChild(r);
  }catch(e){}
  busy=false;resStatus.textContent="done";
};
document.getElementById("resbtn").onclick=()=>{showPanel(resPanel);resStatus.textContent="";};
document.getElementById("resClose").onclick=()=>{resPanel.style.display="none";};
/* ---- stop button ---- */
const stopChip=document.getElementById("stopChip");
setInterval(()=>{stopChip.style.display=busy?"flex":"none";},400);
stopChip.onclick=()=>{if(ctrl){ctrl.abort();setStatus("stopped");}};
/* ---- chat search ---- */
let chatFilter="";
const chatSearch=document.getElementById("chatSearch");
chatSearch.addEventListener("input",()=>{chatFilter=chatSearch.value.trim().toLowerCase();renderChats();drawer.classList.add("open");shade.classList.add("on");});
const _renderChats=renderChats;
renderChats=function(){
  const el=document.getElementById("chatlist");el.innerHTML="";
  const f=chatFilter;
  chats.filter(c=>!f||c.title.toLowerCase().includes(f)||c.msgs.some(m=>(m.t||"").toLowerCase().includes(f))).forEach(c=>{
    const row=document.createElement("div");row.className="chatitem";
    const b=document.createElement("button");b.className="newchat";b.textContent=(c.id===curChat?"› ":"  ")+c.title;
    b.onclick=()=>{curChat=c.id;history=c.msgs.slice();feed.innerHTML="";history.forEach(h=>bubble(h.r,h.t));if(!history.length)hello.style.display="";drawer.classList.remove("open");shade.classList.remove("on");SV("ua_cur",curChat);};
    const d=document.createElement("button");d.className="del";d.textContent="✕";
    d.onclick=()=>{chats=chats.filter(x=>x.id!==c.id);if(curChat===c.id){curChat=null;history=[];feed.innerHTML="";hello.style.display="";}SV("ua_chats",chats);SV("ua_cur",curChat);renderChats();};
    row.appendChild(b);row.appendChild(d);el.appendChild(row);
  });
  if(!chats.length)el.innerHTML='<div class="mini" style="padding:10px">No chats yet.</div>';
};
/* ---- wiring for the new top bar + plus menu ---- */
const newbtn=document.getElementById("newbtn"),searchbtn=document.getElementById("searchbtn"),plusBtn=document.getElementById("plusBtn"),plusMenu=document.getElementById("plusMenu");
function openDrawer(){drawer.classList.add("open");shade.classList.add("on");}
function closeDrawer(){drawer.classList.remove("open");shade.classList.remove("on");}
newbtn.onclick=()=>{if(newchat.onclick)newchat.onclick();closeDrawer();};
searchbtn.onclick=()=>{openDrawer();setTimeout(()=>chatSearch.focus(),300);};
modelbtn.onclick=openDrawer;
drawer.querySelectorAll("button").forEach(b=>{if(!b.closest(".chatitem"))b.addEventListener("click",()=>setTimeout(closeDrawer,150));});
function tglPM(){plusMenu.style.display=plusMenu.style.display==="flex"?"none":"flex";}
plusBtn.onclick=tglPM;
shade.addEventListener("click",()=>{plusMenu.style.display="none";});
const pmFiles=document.getElementById("pmFiles"),pmImage=document.getElementById("pmImage"),pmThink=document.getElementById("pmThink"),pmPlug=document.getElementById("pmPlug");
pmFiles.onclick=()=>{plusMenu.style.display="none";fpick.click();};
pmImage.onclick=()=>{plusMenu.style.display="none";input.value="/image ";input.focus();};
pmThink.onclick=()=>{plusMenu.style.display="none";prefs.verify=!prefs.verify;SV("ua_prefs",prefs);setStatus(prefs.verify?"🧠 think harder on for the next answer":"think harder off");};
pmPlug.onclick=()=>{plusMenu.style.display="none";showPanel(document.getElementById("intPanel"));};
/* empty-state rows */
const rowVoice=document.getElementById("rowVoice"),rowWrite=document.getElementById("rowWrite"),emptyRows=document.getElementById("emptyRows");
rowVoice.onclick=()=>{micBtn.click();};
rowWrite.onclick=()=>{input.focus();};
document.querySelectorAll(".erow[data-p]").forEach(b=>b.addEventListener("click",()=>{input.value=b.dataset.p;input.focus();}));
document.querySelectorAll(".card[data-p]").forEach(b=>b.addEventListener("click",()=>{input.value=b.dataset.p;input.focus();}));
document.getElementById("cardAgents").onclick=()=>{showPanel(document.getElementById("agentsPanel"));};
const mo=new MutationObserver(()=>{emptyRows.style.display=hello.style.display==="none"?"none":"";});
mo.observe(hello,{attributes:true});
/* theme: flip to light once, matching the app look */
if(!localStorage.getItem("ua_theme19")){prefs.theme="light";SV("ua_prefs",prefs);localStorage.setItem("ua_theme19","1");document.body.dataset.theme="light";}
else if(prefs.theme)document.body.dataset.theme=prefs.theme;
/* ---- pwa ---- */
if("serviceWorker" in navigator){addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));}