/* ===== Team OS: ATLAS / SAGE / FORGE / NOVA — four equal-intelligence agents ===== */
(function(){
if(document.getElementById("teamPanel"))return;
const DEF=[
 {id:"atlas",name:"ATLAS",em:"\ud83e\udded",role:"Chief intelligence & operations",sys:"You are ATLAS, chief intelligence and operations agent of a four-agent team (SAGE researches, FORGE builds, NOVA strategizes and reviews). You restate objectives, break them into clear numbered plans with task assignments, coordinate the team, review work, and verify results against the objective. Be decisive, structured and honest about gaps. You have exactly the same brain as the other agents: your edge is your role."},
 {id:"sage",name:"SAGE",em:"\ud83d\udd2c",role:"Research & intelligence",sys:"You are SAGE, research and intelligence agent. You find, verify and cross-check information, distinguish verified facts from assumptions, cite real sources with links, and flag conflicting information. Evidence first. Never invent a source, quote or statistic."},
 {id:"forge",name:"FORGE",em:"\ud83d\udee0",role:"Engineering & development",sys:"You are FORGE, engineering and development agent. You produce real implementations: complete code in fenced blocks, files, configs and exact run steps. Anticipate bugs, state how you tested or would test, and never claim code works without showing the reasoning. No placeholders."},
 {id:"nova",name:"NOVA",em:"\ud83d\ude80",role:"Strategy, creativity & growth",sys:"You are NOVA, strategy, creativity and growth agent. You review work for risks and missed opportunities, propose concrete numbered improvements, and add the strategic and creative angle. Be specific, never generic."}
];
const byId=id=>DEF.find(a=>a.id===id);
let busy4=false,stop4=false,cur4=null,room4=null;
const STATUS={Idle:"var(--faint)",Thinking:"#f59e0b",Researching:"#f59e0b",Coding:"#f59e0b",Reviewing:"#f59e0b",Done:"#16a34a",Stopped:"#f59e0b",Error:"#dc2626"};
function esc4(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function log4(a,ev){const l=LS("ua4_log",[]);l.unshift({t:Date.now(),a:a,ev:String(ev).slice(0,200)});SV("ua4_log",l.slice(0,200));}
function st4(id,s,cur){const o=LS("ua4_st",{});o[id]={s:s,cur:cur||""};SV("ua4_st",o);}
function get4st(id){const o=LS("ua4_st",{});return o[id]||{s:"Idle",cur:""};}
function time4(t){const d=new Date(t);return (d.getHours()<10?"0":"")+d.getHours()+":"+(d.getMinutes()<10?"0":"")+d.getMinutes();}
/* ---- css ---- */
const css=document.createElement("style");css.textContent=
 '.fourrow{display:flex;gap:10px;align-items:center;background:var(--panel);border-radius:14px;padding:12px 13px;margin-bottom:8px;cursor:pointer}'
 +'.fourrow .fem{font-size:22px;flex:0 0 auto}'
 +'.fourrow .ftx{flex:1;min-width:0}'
 +'.fourrow .ftx b{display:block;font-size:15px}'
 +'.fourrow .ftx small{color:var(--dim);font-size:12px;display:block}'
 +'.fourrow .fst{font-size:12px;color:var(--dim);display:flex;align-items:center;gap:6px;flex:0 0 auto}'
 +'.fourdot{width:8px;height:8px;border-radius:50%;background:var(--faint);flex:0 0 auto}'
 +'.fourfeed{flex:1;overflow-y:auto;display:flex;flex-direction:column;padding:10px 2px;min-height:0}'
 +'.fourfeed .bub{background:var(--panel);border-radius:20px;border-bottom-right-radius:6px;padding:10px 15px;max-width:82%;margin-left:auto;white-space:pre-wrap;word-break:break-word}'
 +'.fourfeed .ai{align-self:flex-start;max-width:94%;white-space:pre-wrap;word-break:break-word;line-height:1.65;margin:4px 0}'
 +'.fourout{white-space:pre-wrap;word-break:break-word;font-size:14px;line-height:1.6;max-height:280px;overflow-y:auto;padding:8px 10px;background:var(--bg);border:1px solid var(--line);border-radius:10px}'
 +'.fourgoal{display:flex;gap:8px;margin:8px 0 10px}'
 +'details.fourstep{background:var(--panel);border-radius:12px;padding:8px 12px;margin-bottom:8px}'
 +'details.fourstep summary{font-size:14px;font-weight:600;cursor:pointer;list-style:none;display:flex;gap:8px;align-items:center}'
 +'.fourlab{margin-left:auto;font-size:12px;color:var(--dim);font-weight:400}';
document.head.appendChild(css);
/* ---- drawer button ---- */
const anchor=document.getElementById("projbtn");
const btn=document.createElement("button");btn.className="newchat";btn.id="teambtn";btn.innerHTML="\ud83c\udf1f Team OS";
if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(btn,anchor);
else{const dr=document.getElementById("drawer");if(dr)dr.appendChild(btn);}
/* ---- panel ---- */
const p=document.createElement("div");p.className="panel";p.id="teamPanel";p.style.display="none";
p.innerHTML=
 '<div class="prow"><button class="ic" id="teamClose">\u2715</button><div class="ptitle">\ud83c\udf1f Team OS</div></div>'
 +'<div class="mini" style="padding:2px 2px 0">ATLAS \u00b7 SAGE \u00b7 FORGE \u00b7 NOVA — four agents, one equal brain, four separate workrooms and a shared mission log. They plan, research, build, review and report. They only work inside this page: anything that would send, buy or publish outside it waits for you.</div>'
 +'<div class="fourgoal"><textarea id="fourGoal" class="tin" rows="2" placeholder="Give the team an objective in plain words…"></textarea><button class="sbtn" id="fourGo" style="flex:0 0 auto;padding:10px 14px">\ud83d\ude80 Run</button></div>'
 +'<button class="sbtn" id="fourStop" style="display:none;margin:-4px 0 10px;background:#fdecec;color:#dc2626">\u23f9 stop the team</button>'
 +'<div class="plist" id="fourList"></div>'
 +'<div id="fourRunArea"></div>'
 +'<details style="margin-top:6px"><summary style="font-size:14px;font-weight:600;cursor:pointer">\ud83d\udcdc Mission log</summary><div id="fourLogBox" style="max-height:200px;overflow-y:auto;font-size:12.5px;color:var(--dim);padding:6px 2px;line-height:1.6"></div><div class="prow" style="margin-top:6px"><button class="sbtn" id="fourExp">\u2b07\ufe0f Export</button><button class="sbtn" id="fourClear">\ud83e\uddf9 Clear run</button></div></details>'
 +'<div id="fourRoom" style="display:none;flex-direction:column;flex:1;min-height:0">'
 +' <div class="prow"><button class="ic" id="fourBack">\u2190</button><div class="ptitle" id="fourRoomTitle"></div><button class="sbtn" id="fourReset" style="flex:0 0 auto;padding:9px 10px;font-size:12px">reset</button></div>'
 +' <div class="fourfeed" id="fourFeed"></div>'
 +' <div class="fourgoal" style="margin:4px 0 2px"><textarea id="fourIn" class="tin" rows="1" placeholder="Message this agent…"></textarea><button class="sbtn" id="fourSend" style="flex:0 0 auto;padding:10px 14px">\u2191</button></div>'
 +'</div>';
document.body.appendChild(p);
/* ---- list ---- */
function renderList(){
 const box=document.getElementById("fourList");if(!box)return;box.innerHTML="";
 DEF.forEach(a=>{
  const s=get4st(a.id);
  const row=document.createElement("div");row.className="fourrow";
  row.innerHTML='<div class="fem">'+a.em+'</div><div class="ftx"><b>'+a.name+'</b><small>'+esc4(a.role)+(s.cur?' · '+esc4(s.cur):'')+'</small></div>'
   +'<div class="fst"><span class="fourdot" style="background:'+(STATUS[s.s]||"var(--faint)")+'"></span>'+esc4(s.s)+'</div>';
  row.onclick=()=>openRoom(a.id);
  box.appendChild(row);
 });
}
function renderLog(){
 const b=document.getElementById("fourLogBox");if(!b)return;
 const l=LS("ua4_log",[]);
 b.innerHTML=l.length?l.map(e=>esc4(time4(e.t))+" "+(byId(e.a)?byId(e.a).em+" "+byId(e.a).name:"\ud83d\udccd")+" — "+esc4(e.ev)).join("\n").replace(/\n/g,"<br>"):"no events yet";
}
function renderRun(){
 const box=document.getElementById("fourRunArea");if(!box)return;
 const run=LS("ua4_run",null);
 if(!run){box.innerHTML="";return;}
 let h='<div class="mini" style="padding:6px 2px 8px;font-weight:600">\ud83c\udfaf '+esc4(run.goal)+' <span style="color:'+(run.status==="Done"?"#16a34a":run.status==="Running"?"#f59e0b":"#dc2626")+'">· '+esc4(run.status)+'</span></div>';
 (run.steps||[]).forEach(s=>{
  const a=byId(s.agent)||{em:"\ud83d\udccd",name:s.agent};
  h+='<details'+(s.open?' open':'')+' class="fourstep"><summary>'+a.em+' <span>'+a.name+'</span><span class="fourlab">'+esc4(s.label)+'</span></summary><div class="fourout" style="margin-top:6px">'+esc4(s.output||"")+'</div></details>';
 });
 box.innerHTML=h;
}
/* ---- workroom ---- */
function openRoom(id){
 room4=id;const a=byId(id);
 document.getElementById("fourList").style.display="none";
 document.getElementById("fourRunArea").style.display="none";
 document.querySelector("#teamPanel .fourgoal").style.display="none";
 document.querySelector("#teamPanel details").style.display="none";
 const r=document.getElementById("fourRoom");r.style.display="flex";
 document.getElementById("fourRoomTitle").textContent=a.em+" "+a.name+" — "+a.role;
 const feed=document.getElementById("fourFeed");feed.innerHTML="";
 (LS("ua4_chat_"+id,[])||[]).forEach(m=>{
  if(m.r==="u"){const w=document.createElement("div");w.style.textAlign="right";const b=document.createElement("div");b.className="bub";b.textContent=m.t;w.appendChild(b);feed.appendChild(w);}
  else{const d=document.createElement("div");d.className="ai";d.textContent=m.t;feed.appendChild(d);}
 });
 feed.scrollTop=feed.scrollHeight;
}
function closeRoom(){
 room4=null;
 document.getElementById("fourRoom").style.display="none";
 document.getElementById("fourList").style.display="";
 document.getElementById("fourRunArea").style.display="";
 document.querySelector("#teamPanel .fourgoal").style.display="flex";
 document.querySelector("#teamPanel details").style.display="";
 renderList();
}
async function sendRoom(){
 if(!room4||busy4)return;
 const a=byId(room4),inp=document.getElementById("fourIn");
 const msg=inp.value.trim();if(!msg)return;
 inp.value="";busy4=true;
 const feed=document.getElementById("fourFeed");
 const w=document.createElement("div");w.style.textAlign="right";const b=document.createElement("div");b.className="bub";b.textContent=msg;w.appendChild(b);feed.appendChild(w);feed.scrollTop=feed.scrollHeight;
 const hist=LS("ua4_chat_"+room4,[]);hist.push({r:"u",t:msg});SV("ua4_chat_"+room4,hist);
 log4(room4,"user: "+msg.slice(0,120));
 const d=document.createElement("div");d.className="ai";d.textContent="\u2026";feed.appendChild(d);feed.scrollTop=feed.scrollHeight;
 const mem=LS("ua4_mem",[]).slice(0,8).map(x=>"- "+x).join("\n");
 const sys=a.sys+(mem?"\n\nShared team memory:\n"+mem:"");
 try{const full=await ask(msg,d,sys);
  d.textContent=full||"(no reply)";
  const h2=LS("ua4_chat_"+room4,[]);h2.push({r:"a",t:full||""});SV("ua4_chat_"+room4,h2);
  log4(room4,"replied ("+((full||"").length)+" chars)");
 }catch(e){d.textContent="\u26a0\ufe0f "+((e&&e.msg)||e.message||"the AI didn't answer — try again");}
 busy4=false;feed.scrollTop=feed.scrollHeight;
}
/* ---- team run ---- */
async function fourStep(agent,label,fn,statName){
 const run=LS("ua4_run",null);if(!run)throw new Error("no run");
 st4(agent,statName||"Thinking",label);log4(agent,label+" — started");renderList();
 const step={agent:agent,label:label,output:"",open:true};run.steps.push(step);SV("ua4_run",run);renderRun();
 const box=document.getElementById("fourRunArea");
 const outs=box.querySelectorAll(".fourout");const out=outs[outs.length-1];
 const full=await fn(out);
 step.output=String(full||"").slice(0,4000);step.open=false;SV("ua4_run",run);
 st4(agent,"Done",label);log4(agent,label+" — done ("+String(full||"").length+" chars)");renderList();renderRun();
 return full;
}
async function fourWeb(q){
 log4("sage","web search: "+q);
 try{const r=await fetch("https://r.jina.ai/https://html.duckduckgo.com/html/?q="+encodeURIComponent(q));const t=await r.text();return t.slice(0,4000);}catch(e){return "(web fetch failed: "+e.message+")";}
}
async function run4(){
 if(busy4)return;
 const goal=document.getElementById("fourGoal").value.trim();
 if(!goal)return;
 busy4=true;stop4=false;cur4=null;
 document.getElementById("fourGo").style.display="none";
 document.getElementById("fourStop").style.display="";
 DEF.forEach(a=>st4(a.id,"Idle",""));
 const run={goal:goal,started:Date.now(),status:"Running",steps:[]};SV("ua4_run",run);
 log4("atlas","objective received: "+goal);renderList();renderRun();renderLog();
 const A=byId("atlas").sys,S=byId("sage").sys,F=byId("forge").sys,N=byId("nova").sys;
 try{
  const plan=await fourStep("atlas","Breaking down the objective",async out=>{
   return await ask("Objective from the user: "+goal+"\n\nProduce: 1) the objective restated in one line, 2) a numbered execution plan of 3 to 6 steps, each tagged with the owning agent (SAGE = research, FORGE = build/code, NOVA = strategy/creative/review, ATLAS = coordination/verification), 3) a short definition of done. Concise, no preamble.",out,A);
  },"Thinking");
  if(stop4)throw {name:"Stop"};
  const research=await fourStep("sage","Researching & verifying",async out=>{
   let r1=await ask("Team objective: "+goal+"\n\nATLAS's plan:\n"+String(plan).slice(0,3000)+"\n\nYou are SAGE. Do the research step: key facts, current best practices, real sources with links. If a live web search would materially help, output one line exactly [NEEDS: search words] and stop there.",out,S);
   const m=String(r1||"").match(/\[NEEDS:\s*([^\]]+)\]/);
   if(m){
    out.textContent="searching the web: "+m[1]+"\u2026";
    const res=await fourWeb(m[1]);
    return await ask("Live search results for '"+m[1]+"':\n"+res+"\n\nNow finish SAGE's research for the objective: "+goal+"\n\nATLAS's plan:\n"+String(plan).slice(0,2500)+"\n\nGive the key facts, best practices and the sources you actually used. Mark clearly what is verified vs assumption.",out,S);
   }
   return r1;
  },"Researching");
  if(stop4)throw {name:"Stop"};
  const build=await fourStep("forge","Building",async out=>{
   return await ask("Team objective: "+goal+"\n\nATLAS's plan:\n"+String(plan).slice(0,2500)+"\n\nSAGE's research:\n"+String(research).slice(0,2500)+"\n\nYou are FORGE. Do the build step: the actual implementation — complete code in fenced blocks, file names, configs and exact steps to run it. No placeholders, no 'left as exercise'.",out,F);
  },"Coding");
  if(stop4)throw {name:"Stop"};
  const review=await fourStep("nova","Reviewing & improving",async out=>{
   return await ask("Team objective: "+goal+"\n\nFORGE's build (may be truncated):\n"+String(build).slice(0,5000)+"\n\nYou are NOVA. Review it: what's solid, concrete risks, and your top 3 numbered improvements, plus the strategy/growth angle. Be specific.",out,N);
  },"Reviewing");
  if(stop4)throw {name:"Stop"};
  const fin=await fourStep("atlas","Final report & verification",async out=>{
   return await ask("Objective: "+goal+"\n\nTeam work:\n[ATLAS plan]\n"+String(plan).slice(0,2200)+"\n\n[SAGE research]\n"+String(research).slice(0,2200)+"\n\n[FORGE build]\n"+String(build).slice(0,3500)+"\n\n[NOVA review]\n"+String(review).slice(0,2200)+"\n\nYou are ATLAS. Write the final report: what was delivered, your verification of it against the objective (honest gaps included), and the exact next actions for the user. No fluff.",out,A);
  },"Thinking");
  const run2=LS("ua4_run",null);run2.status="Done";SV("ua4_run",run2);
  const mem=LS("ua4_mem",[]);mem.unshift("["+new Date().toISOString().slice(0,10)+"] Team objective done: "+goal.slice(0,100));SV("ua4_mem",mem.slice(0,100));
  log4("atlas","final report delivered");
 }catch(e){
  const run3=LS("ua4_run",null);
  if(e&&(e.name==="Stop"||e.name==="AbortError")){run3.status="Stopped";log4("atlas","run stopped");}
  else{run3.status="Error: "+((e&&e.msg)||e.message||"failed");log4("atlas","error: "+run3.status);}
  SV("ua4_run",run3);
  DEF.forEach(a=>{const s=get4st(a.id);if(["Thinking","Researching","Coding","Reviewing"].indexOf(s.s)>=0)st4(a.id,run3.status==="Stopped"?"Stopped":"Error",s.cur);});
 }
 busy4=false;
 document.getElementById("fourGo").style.display="";
 document.getElementById("fourStop").style.display="none";
 renderList();renderRun();renderLog();
}
/* ---- wire ---- */
document.getElementById("teamClose").onclick=()=>{p.style.display="none";};
btn.onclick=()=>{closeRoom();renderList();renderRun();renderLog();p.style.display="flex";const dr=document.getElementById("drawer");if(dr)dr.classList.remove("open");const sh=document.getElementById("shade");if(sh)sh.classList.remove("on");};
document.getElementById("fourGo").onclick=run4;
document.getElementById("fourStop").onclick=()=>{stop4=true;try{ctrl.abort();}catch(e){}};
document.getElementById("fourBack").onclick=closeRoom;
document.getElementById("fourSend").onclick=sendRoom;
document.getElementById("fourIn").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendRoom();}});
document.getElementById("fourReset").onclick=()=>{if(!room4)return;if(!confirm("Clear this agent's chat?"))return;SV("ua4_chat_"+room4,[]);openRoom(room4);};
document.getElementById("fourExp").onclick=()=>{const run=LS("ua4_run",null);const blob=new Blob([JSON.stringify({run:run,log:LS("ua4_log",[]),mem:LS("ua4_mem",[])},null,2)],{type:"text/plain"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="team-os-export.json";a.click();};
document.getElementById("fourClear").onclick=()=>{if(!confirm("Clear the last run and its log?"))return;SV("ua4_run",null);SV("ua4_log",[]);DEF.forEach(a=>st4(a.id,"Idle",""));renderList();renderRun();renderLog();};
})();
