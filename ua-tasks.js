/* ---- task dashboard + real-world reach (email/call drafts) ---- */
let tasks=LS("ua_tasks",[]);
const dashPanel=document.getElementById("dashPanel"),dashList=document.getElementById("dashList"),dashCounts=document.getElementById("dashCounts");
const STNAMES={todo:"⚪ to do",doing:"🔵 working",waiting:"🟠 waiting on you",done:"✅ done",failed:"❌ failed"};
function logLine(task,text){task.log.push({ts:Date.now(),text:String(text).slice(0,400)});SV("ua_tasks",tasks);}
function renderDash(){
  dashList.innerHTML="";
  const c={todo:0,doing:0,waiting:0,done:0,failed:0};
  tasks.forEach(t=>c[t.status]=(c[t.status]||0)+1);
  dashCounts.textContent=c.todo+" to do · "+c.doing+" working · "+c.waiting+" waiting on you · "+c.done+" done · "+c.failed+" failed";
  if(!tasks.length)dashList.innerHTML='<div class="mini" style="padding:10px">No tasks yet. Add one, or tell the AI in chat: “plan: fix the fence this weekend” — it can break it into steps and track it here.</div>';
  tasks.slice().reverse().forEach((t,ri)=>{
    const i=tasks.length-1-ri;
    const row=document.createElement("div");row.className="pitem";
    const tx=document.createElement("div");tx.className="pi-tx";
    tx.innerHTML="<b>"+esc(t.title)+"</b><small>"+STNAMES[t.status||"todo"]+(t.steps.length?" · "+t.steps.filter(s=>s.done).length+"/"+t.steps.length+" steps":"")+"</small>";
    const stepsEl=document.createElement("div");stepsEl.style.cssText="margin-top:6px;width:100%";
    t.steps.forEach((s,si)=>{
      const sr=document.createElement("div");sr.className="taskrow";
      const cb=document.createElement("input");cb.type="checkbox";cb.checked=!!s.done;
      cb.onchange=()=>{s.done=cb.checked;SV("ua_tasks",tasks);renderDash();};
      const tt=document.createElement("div");tt.className="tt";tt.textContent=s.t;
      sr.appendChild(cb);sr.appendChild(tt);stepsEl.appendChild(sr);
    });
    tx.appendChild(stepsEl);
    if(t.log.length){const lg=document.createElement("div");lg.className="mini";lg.style.marginTop="6px";lg.textContent="history: "+t.log.slice(-3).map(l=>l.text).join(" | ");tx.appendChild(lg);}
    row.appendChild(tx);
    const bPlan=document.createElement("button");bPlan.textContent="🪄";bPlan.title="Plan with AI";
    bPlan.onclick=e=>{e.stopPropagation();planTask(t);};
    const bSt=document.createElement("button");bSt.textContent="🔄";bSt.title="Change status";
    bSt.onclick=e=>{e.stopPropagation();
      const order=["todo","doing","waiting","done","failed"];
      t.status=order[(order.indexOf(t.status||"todo")+1)%order.length];logLine(t,"status → "+t.status);SV("ua_tasks",tasks);renderDash();};
    const bDel=document.createElement("button");bDel.textContent="🗑";
    bDel.onclick=e=>{e.stopPropagation();if(!confirm("Delete task?"))return;tasks.splice(i,1);SV("ua_tasks",tasks);renderDash();};
    row.appendChild(bPlan);row.appendChild(bSt);row.appendChild(bDel);
    dashList.appendChild(row);
  });
}
async function planTask(t){
  if(busy)return;
  setStatus("🪄 planning task…");
  try{
    const plan=await ask("Break this task into 2 to 6 concrete steps a person or assistant could do. Reply with ONLY a plain list, one step per line, no numbering:\n\nTask: "+t.title,{textContent:""},"You are a task planner. Be practical: research and prep steps are fine; anything needing a phone call, an email, a purchase or an appointment is a step the user approves.");
    const lines=plan.split("\n").map(s=>s.replace(/^[\s\-*\d.)]+/,"").trim()).filter(s=>s.length>2).slice(0,6);
    t.steps=t.steps.concat(lines.map(x=>({t:x,done:false})));
    logLine(t,"planned "+lines.length+" steps with AI");
    t.status=t.status==="done"?t.status:"doing";
    SV("ua_tasks",tasks);renderDash();
  }catch(e){setStatus("");}
  setStatus("");
}
document.getElementById("dashAddBtn").onclick=()=>{
  const v=prompt("New task");if(!v)return;
  tasks.push({id:"t"+Date.now(),title:v.trim(),status:"todo",steps:[],log:[{ts:Date.now(),text:"created"}]});
  SV("ua_tasks",tasks);renderDash();
};
document.getElementById("dashbtn").onclick=()=>{openPanel("dashPanel");renderDash();};
document.getElementById("dashClose").onclick=closePanels;
/* ---- reach: honest email + call drafts ---- */
const intBody=document.getElementById("intBody");
function buildInt(){
  intBody.innerHTML="";
  const sec=(title,body)=>{const d=document.createElement("div");d.className="togglerow";d.style.display="block";d.innerHTML="<b>"+title+"</b>";d.appendChild(body);intBody.appendChild(d);};
  const note=document.createElement("div");note.className="mini";note.style.padding="8px 2px";
  note.innerHTML="A website page can't place calls or send mail by itself — anything that talks to the real world needs an account and usually a paid phone line. What this page CAN do free: write the email or the call script with the AI, then hand it to you to send from your own phone, with your approval level deciding how much it does on its own.";
  intBody.appendChild(note);
  const mail=document.createElement("div");
  mail.innerHTML='<input id="mTo" class="tin" placeholder="Who (email address)" style="margin-bottom:6px"><input id="mSub" class="tin" placeholder="Subject" style="margin-bottom:6px"><textarea id="mBody" class="tin" rows="4" placeholder="What should it say? Leave empty and tap Draft with AI"></textarea><div class="prow" style="margin-top:6px"><button class="sbtn" id="mDraft">🪄 Draft with AI</button><button class="sbtn" id="mSend">📧 Open in Mail</button></div>';
  sec("📧 Email someone",mail);
  document.getElementById("mDraft").onclick=async()=>{
    const who=document.getElementById("mTo").value.trim();
    const what=document.getElementById("mBody").value.trim();
    if(!who){alert("Who is it to?");return;}
    setStatus("🪄 drafting email…");
    try{
      const d=await ask("Write a short, clear, polite email. Reply with ONLY two lines in this exact format:\nSUBJECT: <subject>\nBODY: <email body>\n\nRecipient: "+who+"\nWhat it should say or accomplish: "+(what||"(you decide: a polite first contact asking for what we need)"),{textContent:""});
      const m=d.match(/SUBJECT:\s*(.*)\nBODY:\s*([\s\S]*)/);
      if(m){document.getElementById("mSub").value=m[1].trim();document.getElementById("mBody").value=m[2].trim();}
    }catch(e){}
    setStatus("");
  };
  document.getElementById("mSend").onclick=()=>{
    const to=document.getElementById("mTo").value.trim(),sub=document.getElementById("mSub").value,body=document.getElementById("mBody").value;
    if(!to){alert("Add who it's to");return;}
    const go=()=>{window.location.href="mailto:"+to+"?subject="+encodeURIComponent(sub)+"&body="+encodeURIComponent(body);};
    act(1,"Open Mail with your email to "+to+" ready to send",go);
  };
  const call=document.createElement("div");
  call.innerHTML='<input id="cName" class="tin" placeholder="Who and what number" style="margin-bottom:6px"><textarea id="cGoal" class="tin" rows="3" placeholder="What the call is for (ask price, book Saturday, …)"></textarea><div class="prow" style="margin-top:6px"><button class="sbtn" id="cDraft">🪄 Draft call script</button><button class="sbtn" id="cDial">📞 Dial</button></div><div id="cScript" class="mini" style="margin-top:6px;white-space:pre-wrap;display:none"></div>';
  sec("📞 Call someone",call);
  document.getElementById("cDraft").onclick=async()=>{
    const who=document.getElementById("cName").value.trim(),goal=document.getElementById("cGoal").value.trim();
    if(!who||!goal){alert("Add who and what the call is for");return;}
    setStatus("🪄 drafting script…");
    try{
      const s=await ask("Write a short spoken phone script (what to say, 5 lines max, plain sentences, including the key question) for this call:\n\nCalling: "+who+"\nPurpose: "+goal,{textContent:""});
      const el=document.getElementById("cScript");el.textContent=s;el.style.display="block";
    }catch(e){}
    setStatus("");
  };
  document.getElementById("cDial").onclick=()=>{
    const raw=document.getElementById("cName").value;
    const num=(raw.match(/[+()\d][\d()\-\s]{5,}/)||[])[0];
    if(!num){alert("Put a phone number in the first box");return;}
    const go=()=>{window.location.href="tel:"+num.replace(/[^\d+]/g,"");};
    act(2,"Dial "+num.trim()+" from your phone (your phone places the call; the script is above)",go);
  };
  const iv=document.createElement("div");iv.className="mini";iv.style.padding="8px 2px";
  iv.innerHTML="<b>What a full connection would take</b><br>Real outgoing calls with an AI speaking: a paid telephony provider (Twilio etc., about a cent a minute) plus a verified number.<br>Real inbox: a connected Google/Microsoft account with mail permissions — no free static site can hold one.<br>Real calendar: the same account connection.<br>Those run on Fo itself, not on a static page. Everything above works free right here.";
  intBody.appendChild(iv);
}
function act(level,what,go){
  const a=(prefs.autonomy||2);
  if(a<=1){try{navigator.clipboard.writeText(what);}catch(e){}alert("Prepared: "+what+"\n(Autonomy is set to “prepare only” — it stays a draft.)");return;}
  if(a===2){if(confirm(what+"\n\nGo ahead?"))go();return;}
  go();
}
/* autonomy level row in settings */
const _renderSettings=renderSettings;
renderSettings=function(){
  _renderSettings();
  const box=document.createElement("div");box.className="togglerow";box.style.display="block";
  box.innerHTML="<b>🛡️ Autonomy level</b><div class='mini'>1 = prepare only, hands you every draft · 2 = asks your OK before any real-world step · 3 = opens calls and mail straight away</div>";
  const sel=document.createElement("select");sel.style.cssText="margin-top:6px;padding:8px;background:var(--soft);color:var(--txt);border:0;border-radius:10px";
  ["1 · prepare only","2 · ask me first","3 · just do it"].forEach((l,i)=>{const o=document.createElement("option");o.value=i+1;o.textContent=l;sel.appendChild(o);});
  sel.value=String(prefs.autonomy||2);
  sel.onchange=()=>{prefs.autonomy=+sel.value;SV("ua_prefs",prefs);};
  box.appendChild(sel);setBody.insertBefore(box,setBody.firstChild);
};
document.getElementById("intbtn").onclick=()=>{openPanel("intPanel");buildInt();};
document.getElementById("intClose").onclick=closePanels;
