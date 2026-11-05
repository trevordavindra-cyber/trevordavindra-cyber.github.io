/* ---- research lab + compare + chat search + stop ---- */
const resPanel=document.getElementById("resPanel"),resQ=document.getElementById("resQ"),resGo=document.getElementById("resGo"),
      cmpGo=document.getElementById("cmpGo"),resOut=document.getElementById("resOut"),resStatus=document.getElementById("resStatus");
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
    const found=[];
    for(let i=0;i<qs.length;i++){
      resStatus.textContent="🔎 searching "+(i+1)+" of "+qs.length+"…";
      try{found.push(...await ddg(qs[i]));}catch(e){}
    }
    const seen=new Set(),picks=[];
    for(const x of found){if(!seen.has(x.u)){seen.add(x.u);picks.push(x);}if(picks.length>=4)break;}
    if(!picks.length){resStatus.textContent="search came back empty — try different words.";return;}
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
  }catch(e){resStatus.textContent=(e&&e.msg)||"research failed — try again.";}
};
cmpGo.onclick=async()=>{
  const q=resQ.value.trim();
  if(!q||busy)return;
  resOut.innerHTML="";busy=true;
  const runs=[];
  for(const b of [POOL[0],POOL[1]]){
    resStatus.textContent="asking "+b.name+"…";
    const t0=Date.now();let ans="";
    try{ans=await askSpace(b,q,{textContent:""},SYSTEM);}catch(e){ans="("+((e&&e.msg)||"failed")+")";}
    const ms=Date.now()-t0;
    runs.push({n:b.name,ms,a:ans});
    const r=document.createElement("div");r.className="m a";
    r.innerHTML="<b>"+esc(b.name)+"</b> · "+(Math.round(ms/100)/10)+"s<br>"+md(ans);
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
document.getElementById("resbtn").onclick=()=>{openPanel("resPanel");resStatus.textContent="";};
document.getElementById("resClose").onclick=closePanels;
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
/* ---- pwa ---- */
if("serviceWorker" in navigator){addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));}
