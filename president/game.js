/* PRESIDENTIAL AI: COMMAND OF A NATION — living presidential simulator. Free brain: text.pollinations.ai. Everything else runs on-device. */
(function(){
"use strict";
const $=(id)=>document.getElementById(id);
const API="https://text.pollinations.ai/openai";
const LS="president.save.v1";
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const r=(a,b)=>a+Math.random()*(b-a);
const ri=(a,b)=>Math.floor(r(a,b+1));
const pick=(a)=>a[Math.floor(Math.random()*a.length)];
const fmtB=(n)=>"$"+Math.round(n).toLocaleString()+"B";
const DAYLEN=1460;

const FN=["James","Maria","Robert","Linda","David","Sarah","Michael","Ashley","Kevin","Emily","Carlos","Aisha","Tyler","Grace","Luis","Nina","Omar","Holly","Dana","Victor","Rosa","Ethan","Priya","Marcus","Jade","Cole","Fatima","Lena","Hank","Iris"];
const LN=["Whitaker","Alvarez","Chen","Okafor","Novak","Braddock","Silva","Kim","Marsh","Delgado","Rowe","Fontaine","Boyd","Kowalski","Reyes","Hale","Osei","Vaughn","Petrov","Lund","Serrano","Blackwood","Imani","Cook","Nakamura"];
const JOBS=["nurse","teacher","truck driver","small business owner","farmer","software intern","line cook","retired veteran","single parent","electrician","store clerk","barista","bus driver","warehouse worker","college student","pharmacist","janitor","real estate agent","mechanic","gig driver","daycare worker","journalist"];
const TRAITS=["optimistic","pessimistic","ambitious","patient","skeptical","angry","activist","pragmatic","hopeful","stubborn"];
const LEAN=["left","right","independent"];
const STATE_DATA=[["Alabama",5],["Alaska",1],["Arizona",7],["Arkansas",3],["California",39],["Colorado",6],["Connecticut",4],["Delaware",1],["Florida",22],["Georgia",11],["Hawaii",1],["Idaho",2],["Illinois",13],["Indiana",7],["Iowa",3],["Kansas",3],["Kentucky",5],["Louisiana",5],["Maine",1],["Maryland",6],["Massachusetts",7],["Michigan",10],["Minnesota",6],["Mississippi",3],["Missouri",6],["Montana",1],["Nebraska",2],["Nevada",3],["New Hampshire",1],["New Jersey",9],["New Mexico",2],["New York",20],["North Carolina",11],["North Dakota",1],["Ohio",12],["Oklahoma",4],["Oregon",4],["Pennsylvania",13],["Rhode Island",1],["South Carolina",5],["South Dakota",1],["Tennessee",7],["Texas",30],["Utah",3],["Vermont",1],["Virginia",9],["Washington",8],["West Virginia",2],["Wisconsin",6],["Wyoming",1],["Washington, D.C.",1]];
const CATS=["economy","healthcare","education","housing","jobs","infrastructure","transport","crime","environment","energy","taxes","veterans","agriculture","social services","government"];
const TPL={
economy:["Groceries are up {n}% since last year and my paycheck hasn't moved.","Everything costs more but wages are flat. Small shops like mine are barely surviving.","My family skips bills to afford food. The economy is hurting people like us."],
healthcare:["My insulin costs tripled. No one should choose between medicine and rent.","The hospital in our county closed. Nearest emergency room is 90 minutes away.","Insurance denied my daughter's treatment. We need action on coverage."],
education:["Our school lost 4 teachers this year. Class sizes are 35 kids.","Student debt is burying my generation. We need real relief.","The school building has a leaking roof and no budget to fix it."],
housing:["Rent went up {n}% this year. I'm one missed paycheck from the street.","Young families can't buy homes anymore. Prices are impossible.","Eviction notices are everywhere in my neighborhood."],
jobs:["Our town's biggest factory laid off 300 people last month.","I've sent 80 applications and heard nothing. Jobs aren't coming back on their own.","Good jobs left my county. The ones left pay minimum wage."],
infrastructure:["The bridge on my commute is rated structurally deficient.","Our water main broke twice this winter. Pipes are from the 1950s.","Rural broadband still doesn't reach us. Kids do homework in parking lots."],
transport:["The bus line I depend on got cut. I can't get to work now.","Our roads are full of potholes. It's damaging everyone's cars.","High-speed rail skipped our whole region again."],
crime:["Break-ins are up {n}% on my block this year.","We need more support for community safety programs, not just rhetoric.","Retail theft is forcing shops in my area to close."],
environment:["Flooding hit our town twice this year. Nothing has been done.","The air near the plant smells chemical most mornings.","Our river is polluted and the cleanup stalled."],
energy:["Electric bills jumped {n}% this winter.","The grid failed during the heat wave. People got hurt.","We need cheaper power options in rural areas."],
taxes:["Small businesses like mine are drowning in taxes while big corps dodge them.","My property taxes doubled in 4 years on a fixed income.","The tax code favors the rich and everyone knows it."],
veterans:["VA wait times for appointments are months long.","Veterans in my town are sleeping in cars. This is a national shame.","My benefits claim has been stuck for a year."],
agriculture:["Dairy farmers are selling herds. Prices don't cover costs.","The drought crushed our harvest and federal aid came late.","Farm equipment repair parts are impossible to get."],
["social services"]:["The food bank ran out twice last month.","Care for my disabled brother costs more than we earn.","Foster kids in our county have nowhere stable to go."],
government:["Congress keeps failing to pass a budget on time.","Agencies don't answer. Nobody is accountable.","Term-limited for a reason: nothing gets done in Washington."]};
const BILLS={economy:"Small Business Relief Act",healthcare:"Affordable Care Expansion Act",education:"Education Investment Act",housing:"National Housing Initiative",jobs:"American Jobs Program",infrastructure:"Rebuild America Act",transport:"Modern Transit Act",crime:"Community Safety Act",environment:"Clean Environment Act",energy:"Energy Independence Act",taxes:"Fair Tax Reform Act",veterans:"Veterans Support Act",agriculture:"Farm Stability Act","social services":"Family Assistance Act",government:"Government Accountability Act"};
const EMG=[["hurricane","A major hurricane made landfall in {s}. Thousands need shelter and power restoration."],["wildfire","Fast-moving wildfires are threatening communities in {s}."],["grid failure","A severe storm knocked out power across much of {s}."],["water crisis","The water supply in {s} is unsafe. Residents are under a boil notice."],["cyberattack","A cyberattack hit state systems and hospitals in {s}."],["economic shock","Financial markets tumbled hard today and analysts fear a recession in {s}."]];
const NEWS_OUTFITS=["The National Ledger","Capital Wire","The Union Herald","Statehouse Daily","The Civic Post","Meridian News","The Plain Dealer","Liberty Report"];

let S=null, tab="dashboard", openC=null, aiBusy=false;

function newState(){
  return {day:1,term:1,approval:52,stability:72,budget:6100,debt:35500,gdp:2.1,unemp:4.1,infl:3.1,house:48,senate:46,trust:55,
  pressure:Object.fromEntries(CATS.map(c=>[c,ri(1,4)])),nextId:1,citizens:[],complaints:[],bills:[],promises:[],news:[],history:[],briefs:[],emergency:null,electionDone:false,over:false};
}
function newCitizen(){
  const st=pick(STATE_DATA)[0];
  const c={id:S.nextId++,name:pick(FN)+" "+pick(LN),age:ri(19,78),job:pick(JOBS),state:st,trait:pick(TRAITS),lean:pick(LEAN),mood:ri(35,75),kept:0,broken:0,memories:[]};
  S.citizens.push(c);
  if(S.citizens.length>60)S.citizens.shift();
  return c;
}
function genComplaint(){
  const pool=S.citizens.length?S.citizens:null;
  const c=(pool&&Math.random()<.6)?pick(pool):newCitizen();
  const weights=CATS.map(k=>S.pressure[k]+r(0,3));
  let t=weights.reduce((a,b)=>a+b,0),x=Math.random()*t,cat=CATS[0];
  for(let i=0;i<CATS.length;i++){x-=weights[i];if(x<=0){cat=CATS[i];break;}}
  const affected=Math.round(50*Math.pow(STATE_DATA.find(s=>s[0]===c.state)[1],.6)*r(.5,3));
  S.complaints.push({id:S.nextId++,cid:c.id,cat,text:pick(TPL[cat]).replace("{n}",ri(10,40)),state:c.state,urg:ri(1,5),affected,cost:Math.round(affected*.08+r(3,30)),status:"new",age:0,attention:0,detail:null});
  if(S.complaints.length>40)S.complaints.shift();
}
function stateOf(name){return S.states[S.states.findIndex(s=>s.name===name)]}
function citizenOf(id){return S.citizens.find(c=>c.id===id)}
function log(who,text){S.briefs.unshift({day:S.day,who,text});if(S.briefs.length>30)S.briefs.pop();}
function headline(src,text){S.news.unshift({day:S.day,src,text});if(S.news.length>40)S.news.pop();}

function approvalDelta(d,why){S.approval=clamp(S.approval+d,3,97);if(Math.abs(d)>=.5)headline(pick(NEWS_OUTFITS),(d>0?"Approval rises":"Approval slips")+" to "+Math.round(S.approval)+"% "+(why||""));}

function tick(){
  if(S.over)return;
  S.day++;
  S.gdp=clamp(S.gdp+r(-.12,.12)+ (S.approval-50)*.0008,-4,6);
  S.unemp=clamp(S.unemp-r(S.gdp*.06,.2)+.02,2.5,14);
  S.infl=clamp(S.infl+r(-.1,.1),0,12);
  const revenue=180+S.gdp*12, spend=210+ (S.bills?S.bills.filter(b=>b.status==="passed").length*3:0);
  S.budget+=revenue-spend;
  S.debt+=Math.max(0,spend-revenue);
  S.complaints.forEach(c=>{c.age++;});
  const stale=S.complaints.filter(c=>c.status==="new"&&c.age>10);
  stale.forEach(c=>{c.attention++;S.pressure[c.cat]=Math.min(12,S.pressure[c.cat]+.3);});
  if(stale.length)approvalDelta(-Math.min(1.5,stale.length*.15),"as complaints pile up");
  S.promises.forEach(p=>{if(!p.done&&S.day>p.due){p.done=true;p.broken=true;const ci=citizenOf(p.cid);if(ci){ci.broken++;ci.mood=clamp(ci.mood-15,0,100);}S.trust=clamp(S.trust-3,0,100);approvalDelta(-1.5,"after a broken promise");headline(pick(NEWS_OUTFITS),"Anger grows over unfulfilled promise on "+p.cat);}});
  S.promises=S.promises.filter(p=>!p.broken);
  S.bills.forEach(b=>{if(b.status==="pending"&&S.day>=b.eta){
    const pop={economy:55,healthcare:70,education:65,housing:60,jobs:60,infrastructure:72,transport:58,crime:50,environment:55,energy:60,taxes:40,veterans:75,agriculture:55,"social services":58,government:45}[b.cat]||55;
    const support=clamp(pop*.6+(S.house+S.senate)/2*.6+r(-15,15)-(b.size-1)*12,5,95);
    if(support>50){b.status="passed";S.debt+=b.size*40;S.budget-=b.size*10;approvalDelta(b.size*.7,BILLS[b.cat]+" passes");headline(pick(NEWS_OUTFITS),BILLS[b.cat]+" passes with "+Math.round(support)+"% support");S.pressure[b.cat]=Math.max(0,S.pressure[b.cat]-b.size*1.5);S.gdp+=b.size*.08;S.states.forEach(s=>{if(s.name===b.stateTarget)s.sat=clamp(s.sat+4,0,100)});S.complaints.filter(c=>c.cat===b.cat&&c.state===b.stateTarget).forEach(c=>{c.status="addressed";const ci=citizenOf(c.cid);if(ci)ci.kept++;});}
    else{b.status="failed";approvalDelta(-.4,BILLS[b.cat]+" fails in congress");headline(pick(NEWS_OUTFITS),BILLS[b.cat]+" stalls in a divided congress");S.house=clamp(S.house-2,5,95);S.senate=clamp(S.senate-2,5,95);}
  }});
  S.bills=S.bills.filter(b=>b.status==="pending"||S.day-b.eta<60);
  if(!S.emergency&&Math.random()<(.02+(100-S.stability)*.0006)){
    const e=pick(EMG),st=pick(STATE_DATA)[0];
    S.emergency={type:e[0],text:e[1].replace("{s}",st),state:st,cost:ri(20,90)};
    headline(pick(NEWS_OUTFITS),"BREAKING: "+e[0]+" in "+st);log("situation room",e[0]+" in "+st+" — response required");
  }
  for(let i=0;i<ri(1,3);i++)genComplaint();
  S.citizens.forEach(c=>{c.mood=clamp(c.mood+r(-2,2)+(S.approval-50)*.05,0,100);});
  S.history.push([S.day,S.approval,S.gdp,S.unemp,S.debt]);
  if(S.history.length>400)S.history.shift();
  if(S.day%3===0){const top=CATS.slice().sort((a,b)=>S.pressure[b]-S.pressure[a])[0];log(pick(["chief of staff","press secretary","treasury secretary","national security adviser"]),pick(["worst pressure point is "+top+" — recommend we move first.","the inbox volume on "+top+" is trending toward crisis territory.","congress wants to see a win on "+top+" before the recess.","economists flag "+(S.infl>4.5?"inflation":"growth")+" as the number to watch."]));}
  if(S.day>=DAYLEN&&!S.electionDone){S.electionDone=true;runElection();}
  save();render();
}
function runElection(){
  const keptRatio=S.promises.filter(p=>!p.broken).length/ (S.promises.length||1);
  const econ=(S.gdp>2?6:S.gdp>0?0:-8)+(S.unemp<5?4:S.unemp>8?-8:0);
  const score=S.approval*.7+econ+keptRatio*10+r(-6,6);
  if(score>=50){S.day=1;S.term++;S.electionDone=false;headline("The National Ledger","HISTORIC: President re-elected with "+Math.round(S.approval)+"% approval");log("election commission","re-elected. term "+S.term+" begins.");toast("re-elected. term "+S.term+" begins.");}
  else{S.over=true;headline("The National Ledger","President loses the election after term "+S.term);toast("election lost. your legacy is saved in the ledger.");}
}
function save(){try{localStorage.setItem(LS,JSON.stringify(S));}catch(e){}}
function load(){try{const s=JSON.parse(localStorage.getItem(LS));if(s&&s.day)return s;}catch(e){}return null;}
function toast(t){const el=$("toast");el.textContent=t;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2400);}

function actInvestigate(id){
  const c=S.complaints.find(x=>x.id===id);if(!c)return;
  if(c.status==="investigating"){c.detail="Field teams report "+c.affected.toLocaleString()+" households affected. Regional office estimates "+fmtB(c.cost)+" to fix properly.";c.status="new";toast("investigation complete");}
  else{c.status="investigating";c.age=-2;toast("dispatching investigators");}
  save();render();
}
function actFund(id){
  const c=S.complaints.find(x=>x.id===id);if(!c)return;
  const cost=c.cost;
  if(S.budget<cost){toast("the treasury can't cover "+fmtB(cost)+" right now");return;}
  S.budget-=cost;S.debt+=Math.max(0,cost-40)*.5;
  c.status="addressed";const ci=citizenOf(c.cid);if(ci){ci.kept++;ci.mood=clamp(ci.mood+12,0,100);}
  const st=stateOf(c.state);if(st){st.sat=clamp(st.sat+2.5,0,100);st.complaints=Math.max(0,st.complaints-1);}
  S.pressure[c.cat]=Math.max(0,S.pressure[c.cat]-1);
  approvalDelta(1,"after direct action on "+c.cat);
  headline(pick(NEWS_OUTFITS),"White House moves on "+c.cat+": "+fmtB(cost)+" released");
  toast("funded. "+fmtB(cost)+" committed.");
  save();render();
}
function actLegislate(id){
  const c=S.complaints.find(x=>x.id===id);if(!c)return;
  proposeBill(c.cat,clamp(Math.ceil(c.cost/40),1,3),c.state);
  c.status="promised";
  save();render();
}
function actPromise(id){
  const c=S.complaints.find(x=>x.id===id);if(!c)return;
  S.promises.push({cid:c.cid,cat:c.cat,due:S.day+30,done:false});
  c.status="promised";approvalDelta(.6,"after a public promise on "+c.cat);
  toast("promise made. the country is watching. due in 30 days.");
  save();render();
}
function actRespond(id){
  const c=S.complaints.find(x=>x.id===id);if(!c)return;
  approvalDelta(.4,"after answering a citizen directly");
  c.status="responded";
  const ci=citizenOf(c.cid);if(ci)ci.mood=clamp(ci.mood+5,0,100);
  toast("response issued to "+(ci?ci.name:"the citizen"));
  save();render();
}
function actReject(id){
  const c=S.complaints.find(x=>x.id===id);if(!c)return;
  approvalDelta(-1,"after declining action on "+c.cat);
  const ci=citizenOf(c.cid);if(ci){ci.broken++;ci.mood=clamp(ci.mood-10,0,100);}
  c.status="rejected";S.pressure[c.cat]=Math.min(12,S.pressure[c.cat]+.5);
  toast("rejected. word travels fast.");
  save();render();
}
function proposeBill(cat,size,st){
  S.bills.push({id:S.nextId++,cat,size,stateTarget:st||pick(STATE_DATA)[0],status:"pending",eta:S.day+ri(5,12)});
  toast("bill sent to congress");
}
function emergencyRespond(){
  if(!S.emergency)return;
  const e=S.emergency;
  if(S.budget<e.cost){toast("treasury can't cover "+fmtB(e.cost)+" — find a cheaper path");return;}
  S.budget-=e.cost;approvalDelta(2.2,"for crisis leadership");S.stability=clamp(S.stability+4,0,100);
  const st=stateOf(e.state);if(st)st.sat=clamp(st.sat+3,0,100);
  headline(pick(NEWS_OUTFITS),"President mobilizes federal response to "+e.type);
  S.emergency=null;toast("federal response deployed");
  save();render();
}
function emergencyDownplay(){
  if(!S.emergency)return;
  S.stability=clamp(S.stability-6,0,100);approvalDelta(-2.5,"as the "+S.emergency.type+" worsens");
  headline(pick(NEWS_OUTFITS),"Criticism mounts over slow response to "+S.emergency.type);
  S.emergency=null;toast("downplayed. the damage compounds.");
  save();render();
}
function deliverSpeech(){
  const t=$("speechText").value.trim();
  if(!t){toast("write something first, the nation is listening");return;}
  const top=CATS.slice().sort((a,b)=>S.pressure[b]-S.pressure[a]);
  let d=.8;
  top.slice(0,3).forEach(c=>{if(t.toLowerCase().includes(c))d+=.6;});
  if(t.length>200)d+=.4;
  approvalDelta(clamp(d,-3,3.5),"after addressing the nation");
  const cits=S.citizens.slice(0,5).map(c=>({name:c.name,trait:c.trait,lean:c.lean}));
  const POOL=["About time someone said it.","Words. Show me the bill.","I want to believe it this time.","Fine speech. Now fund it.","That is the first honest thing I have heard in months."];
  const reacts=cits.map(c=>c.name+" ("+c.trait+", "+c.lean+"): "+pick(POOL));
  headline(pick(NEWS_OUTFITS),"President addresses the nation: "+(t.length>60?t.slice(0,57)+"...":t));
  $("speechOut").innerHTML=reacts.map(x=>'<div class="msg small">'+esc(x)+"</div>").join("");
  $("speechText").value="";save();render();
}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}

function stateBrief(){
  const top=CATS.slice().sort((a,b)=>S.pressure[b]-S.pressure[a]).slice(0,4).map(c=>c+" ("+Math.round(S.pressure[c])+" pressure, "+S.complaints.filter(x=>x.cat===c).length+" open complaints)");
  const worst=S.states.slice().sort((a,b)=>a.sat-b.sat).slice(0,3).map(s=>s.name+" (satisfaction "+Math.round(s.sat)+")");
  return "Day "+S.day+" of term "+S.term+". Approval "+Math.round(S.approval)+"%. GDP growth "+S.gdp.toFixed(1)+"%, unemployment "+S.unemp.toFixed(1)+"%, inflation "+S.infl.toFixed(1)+"%. Federal budget "+fmtB(S.budget)+", national debt "+fmtB(S.debt)+". Congress: house "+Math.round(S.house)+"%, senate "+Math.round(S.senate)+"%. Public trust "+Math.round(S.trust)+"%. Top pressure: "+top.join(", ")+". Worst states: "+worst.join(", ")+(S.emergency?". ACTIVE EMERGENCY: "+S.emergency.text:"");
}
async function askAdviser(){
  if(aiBusy)return;aiBusy=true;
  const q=$("advInput").value.trim();
  if(!q){aiBusy=false;return;}
  $("advInput").value="";chatAdd("me",q);
  const think=chatAdd("ai","adviser is reading the situation room...");
  let ans=null;
  try{
    const ctrl=new AbortController();const t=setTimeout(()=>ctrl.abort(),14000);
    const res=await fetch(API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"openai-fast",messages:[{role:"system",content:"You are the President's AI adviser in a live simulation of the United States. Be sharp, concrete and brief (3 sentences max). Use the real numbers. When asked for a recommendation, give one and name the tradeoff."},{role:"system",content:stateBrief()},{role:"user",content:q}],referrer:"presidential-ai"}),signal:ctrl.signal});
    clearTimeout(t);
    const d=await res.json();
    ans=d&&d.choices&&d.choices[0]&&d.choices[0].message?d.choices[0].message.content:null;
  }catch(e){}
  if(!ans)ans=localAdvice(q);
  think.textContent="";think.remove();
  chatAdd("ai",ans);
  aiBusy=false;
}
function localAdvice(q){
  const l=q.toLowerCase();
  const top=CATS.slice().sort((a,b)=>S.pressure[b]-S.pressure[a])[0];
  const worst=S.states.slice().sort((a,b)=>a.sat-b.sat).slice(0,3).map(s=>s.name);
  if(l.includes("biggest")||l.includes("problem"))return "Biggest pressure point is "+top+": "+S.complaints.filter(c=>c.cat===top).length+" open complaints and rising attention. Fund the worst case directly or send "+BILLS[top]+" to congress.";
  if(l.includes("approval")||l.includes("poll"))return "Approval is "+Math.round(S.approval)+"%. Unanswered complaints over 10 days old are the drag, plus "+(S.infl>4.5?"inflation at "+S.infl.toFixed(1)+"%":"soft growth at "+S.gdp.toFixed(1)+"%")+". Address the inbox and the polls follow.";
  if(l.includes("state")||l.includes("where"))return "Worst states right now: "+worst.join(", ")+". Each needs targeted funding before their satisfaction drops further.";
  if(l.includes("econom"))return "GDP "+S.gdp.toFixed(1)+"%, unemployment "+S.unemp.toFixed(1)+"%, inflation "+S.infl.toFixed(1)+"%. Debt is "+fmtB(S.debt)+", so large bills cost you later. A mid-size jobs or infrastructure bill is the balanced play.";
  if(l.includes("recommend")||l.includes("should"))return "Three moves: fund the most urgent complaint in the inbox, push "+BILLS[top]+" through congress, and give a speech naming "+top+" directly.";
  return "Situation: approval "+Math.round(S.approval)+"%, "+S.complaints.length+" open complaints, budget "+fmtB(S.budget)+", debt "+fmtB(S.debt)+(S.emergency?". There is an active "+S.emergency.type+" needing a decision":"")+". Ask me for the biggest problem, the worst states, or a recommendation.";
}
function chatAdd(role,text){
  const box=$("advChat");
  const d=document.createElement("div");
  d.className="msg"+(role==="me"?" me":"");
  d.innerHTML='<div class="who">'+(role==="me"?"president":"ai adviser")+"</div>"+esc(text).replace(/\n/g,"<br>");
  box.appendChild(d);box.scrollTop=box.scrollHeight;
  return d;
}

function drawChart(cv,series,idx,color){
  if(!cv||!series.length)return;
  const ctx=cv.getContext("2d"),W=cv.width=cv.clientWidth*2,H=cv.height=220;
  ctx.clearRect(0,0,W,H);
  const vals=series.map(x=>x[idx]);
  let lo=Math.min(...vals),hi=Math.max(...vals);
  if(hi-lo<2){lo-=2;hi+=2;}
  ctx.strokeStyle="rgba(255,255,255,.12)";ctx.beginPath();
  for(let i=1;i<4;i++){ctx.moveTo(0,H*i/4);ctx.lineTo(W,H*i/4);}ctx.stroke();
  ctx.strokeStyle=color;ctx.lineWidth=3;ctx.beginPath();
  vals.forEach((v,i)=>{const x=i/(vals.length-1||1)*W,y=H-10-(v-lo)/(hi-lo)*(H-20);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});
  ctx.stroke();
}
function bar(v){return '<div class="bar"><i style="width:'+clamp(v,0,100)+'%"></i></div>';}
function render(){
  $("hdrDay").textContent="day "+S.day+" · term "+S.term+" of 4 years";
  $("hdrApp").textContent=Math.round(S.approval)+"% approval";
  $("panel-dashboard").innerHTML=dashHtml();
  $("panel-inbox").innerHTML=openC?complaintHtml(openC):inboxHtml();
  $("panel-congress").innerHTML=congressHtml();
  $("panel-states").innerHTML=statesHtml();
  $("panel-news").innerHTML=newsHtml();
  $("panel-settings").innerHTML=settingsHtml();
  document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("active",b.dataset.p===tab));
  document.querySelectorAll(".panel").forEach(p=>p.classList.toggle("active",p.id==="panel-"+tab));
  const adv=$("panel-adviser");
  if(!adv.dataset.built){adv.dataset.built="1";adv.innerHTML='<h2>ai adviser</h2><div id="advChat" style="max-height:55vh;overflow:auto"><div class="msg"><div class="who">ai adviser</div>'+esc("Mr. President. Ask me anything about the country: the biggest problem, why approval moved, which states hurt, or what to do next. I read the live simulation.")+'</div></div><div class="row" style="margin-top:10px"><input id="advInput" placeholder="ask the adviser..."><button class="act gold" id="advSend">send</button></div>';
    $("advSend").onclick=askAdviser;$("advInput").onkeydown=(e)=>{if(e.key==="Enter")askAdviser();};}
  if(tab==="dashboard"){drawChart($("cvApp"),S.history,1,"#d4af5f");drawChart($("cvEcon"),S.history,2,"#7aa2ff");drawChart($("cvDebt"),S.history,4,"#e0705f");}
  wire();
}
function wire(){
  const on=(id,fn)=>{const e=$(id);if(e)e.onclick=fn;};
  on("endDay",tick);
  on("emgRespond",emergencyRespond);
  on("emgDownplay",emergencyDownplay);
  on("backInbox",()=>{openC=null;render();});
  on("speechGo",deliverSpeech);
  on("billGo",()=>{const c=$("billCat").value,s=+$("billSize").value;proposeBill(c,s);render();});
  on("exportSave",()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(S,null,1)],{type:"application/json"}));a.download="presidency-day-"+S.day+".json";a.click();});
  on("wipeSave",()=>{localStorage.removeItem(LS);S=newState();seedStart();save();toast("new administration started");render();});
  document.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>{openC=+b.dataset.open;tab="inbox";render();});
  document.querySelectorAll("[data-act]").forEach(b=>b.onclick=()=>{const[a,id]=b.dataset.act.split(":");({investigate:actInvestigate,fund:actFund,legislate:actLegislate,promise:actPromise,respond:actRespond,reject:actReject})[a](+id);});
  document.querySelectorAll("[data-state]").forEach(b=>b.onclick=()=>{const st=stateOf(b.dataset.state);if(!st)return;toast(st.name+": satisfaction "+Math.round(st.sat)+"%, "+st.complaints+" open complaints");});
}
function dashHtml(){
  const open=S.complaints.filter(c=>c.status!=="addressed"&&c.status!=="rejected").length;
  let h='<div class="card">'+(S.emergency?'<div class="pill hot">active emergency</div><p style="margin:8px 0">'+esc(S.emergency.text)+"</p>"+'<div class="row"><button class="act gold" id="emgRespond">deploy federal response ('+fmtB(S.emergency.cost)+')</button><button class="act" id="emgDownplay">downplay it</button></div>':'<div class="pill ok">all quiet</div><p class="small" style="margin:6px 0">No active national emergency. The calm never lasts.</p>')+"</div>";
  h+='<div class="grid2" style="margin-bottom:10px">'+
  kpi("approval",Math.round(S.approval)+"%",S.approval>50?"holding steady":"underwater")+
  kpi("congress",Math.round((S.house+S.senate)/2)+"%","house "+Math.round(S.house)+" · senate "+Math.round(S.senate))+
  kpi("budget",fmtB(S.budget),S.budget<0?"deficit spending":"in the black")+
  kpi("national debt",fmtB(S.debt),"grows with big bills")+
  kpi("economy",S.gdp.toFixed(1)+"% gdp","unemployment "+S.unemp.toFixed(1)+"% · inflation "+S.infl.toFixed(1)+"%")+
  kpi("open complaints",open,open>8?"the inbox is overflowing":"manageable")+
  "</div>";
  h+='<div class="card"><h2>approval history</h2><canvas id="cvApp"></canvas><h2 style="margin-top:10px">gdp growth</h2><canvas id="cvEcon"></canvas><h2 style="margin-top:10px">national debt</h2><canvas id="cvDebt"></canvas></div>';
  if(S.briefs.length){h+='<div class="card"><h2>staff briefing</h2>'+S.briefs.slice(0,4).map(b=>'<div class="msg small"><div class="who">'+b.who+" · day "+b.day+"</div>"+esc(b.text)+"</div>").join("")+"</div>";}
  h+='<button class="act gold" id="endDay" style="width:100%;margin-top:6px">end the day — the country keeps moving</button>';
  if(S.over)h+='<div class="card" style="border-color:var(--gold)"><h2>the ledger</h2><p class="small">Your term ended. Approval finished at '+Math.round(S.approval)+'% after '+S.day+" days, "+S.promises.filter(p=>!p.broken).length+" promises kept. Start a new administration in more.</p></div>";
  return h;
}
function kpi(l,v,d){return '<div class="kpi"><div class="l">'+l+'</div><div class="v">'+v+'</div><div class="d small">'+d+"</div></div>";}
function inboxHtml(){
  const list=S.complaints.slice().sort((a,b)=>(b.urg+b.attention*.5)-(a.urg+a.attention*.5));
  if(!list.length)return '<div class="card"><p>The inbox is empty. Enjoy it.</p></div>';
  return '<div class="card"><h2>citizen inbox · '+list.length+' open</h2>'+list.map(c=>{
    const ci=citizenOf(c.cid);
    return '<div class="msg" style="cursor:pointer" data-open="'+c.id+'"><div class="who">'+(ci?ci.name:"citizen")+" · "+c.state+" · "+c.cat+' <span class="pill'+(c.urg>=4?" hot":c.urg<=2?"":" ok")+'">'+(c.urg>=4?"urgent":c.urg<=2?"routine":"elevated")+"</span>"+(c.attention?' <span class="pill hot">'+c.attention+" days ignored</span>":"")+"</div>"+esc(c.text)+"</div>";
  }).join("")+"</div>";
}
function complaintHtml(id){
  const c=S.complaints.find(x=>x.id===id);
  if(!c){openC=null;return inboxHtml();}
  const ci=citizenOf(c.cid);
  return '<button class="act" id="backInbox" style="margin-bottom:10px">← inbox</button><div class="card"><h2>complaint #'+c.id+'</h2><div class="who small">'+(ci?ci.name+", "+ci.age+", "+ci.job+" in "+c.state:"a citizen")+" · personality: "+(ci?ci.trait:"unknown")+" · leans "+(ci?ci.lean:"n/a")+"</div>"+'<div class="msg" style="margin-top:8px">'+esc(c.text)+"</div>"+(c.detail?'<div class="msg small"><div class="who">investigation</div>'+esc(c.detail)+"</div>":"")+'<div class="small">urgency '+c.urg+"/5 · "+c.affected.toLocaleString()+" affected · est. cost "+fmtB(c.cost)+" · status "+c.status+"</div></div>"+
  '<div class="card"><h2>presidential options</h2><div style="display:grid;gap:8px">'+
  '<button class="act" data-act="investigate:'+c.id+'">'+(c.status==="investigating"?"investigation underway — check tomorrow":"investigate the situation")+"</button>"+
  '<button class="act gold" data-act="fund:'+c.id+'">allocate funding directly ('+fmtB(c.cost)+")</button>"+
  '<button class="act" data-act="legislate:'+c.id+'">send '+BILLS[c.cat]+" to congress</button>"+
  '<button class="act" data-act="promise:'+c.id+'">promise action publicly (30 days)</button>'+
  '<button class="act" data-act="respond:'+c.id+'">respond to the citizen</button>'+
  '<button class="act" data-act="reject:'+c.id+'">reject the request</button>'+
  "</div></div>";
}
function congressHtml(){
  return '<div class="card"><h2>congress</h2><div class="small" style="margin-bottom:6px">house support</div>'+bar(S.house)+'<div class="small" style="margin:10px 0 6px">senate support</div>'+bar(S.senate)+'</div><div class="card"><h2>legislation</h2>'+(S.bills.length?S.bills.slice(-8).reverse().map(b=>'<div class="msg small"><div class="who">'+BILLS[b.cat]+" · size "+b.size+"/3 · vote day "+b.eta+"</div>"+b.status+"</div>").join(""):"<p class='small'>No bills in the pipeline. Propose one from any complaint.</p>")+"</div>"+
  '<div class="card"><h2>propose a bill</h2><div class="row"><select id="billCat">'+CATS.map(c=>'<option>'+c+"</option>").join("")+'</select><select id="billSize"><option value="1">small</option><option value="2" selected>medium</option><option value="3">sweeping</option></select></div><button class="act gold" id="billGo" style="width:100%;margin-top:8px">send to congress</button><p class="small" style="margin-top:6px">Votes land in 5-12 days. Sweeping bills need more support and add serious debt.</p></div>';
}
function statesHtml(){
  const worst=S.states.slice().sort((a,b)=>a.sat-b.sat);
  return '<div class="card"><h2>the nation · 50 states + d.c.</h2><p class="small" style="margin-bottom:8px">Sorted by dissatisfaction. Tap a state for a readout.</p>'+worst.map(s=>'<div class="msg small" data-state="'+s.name+'"><div class="who">'+s.name+" · pop "+(s.pop*1000000).toLocaleString()+"</div>"+bar(s.sat)+"</div>").join("")+"</div>";
}
function newsHtml(){
  return '<div class="card"><h2>address the nation</h2><textarea id="speechText" rows="3" placeholder="My fellow Americans..."></textarea><button class="act gold" id="speechGo" style="width:100%;margin-top:8px">deliver the address</button><div id="speechOut"></div></div><div class="card"><h2>the press</h2>'+(S.news.length?S.news.slice(0,15).map(n=>'<div class="news-item"><div class="src">'+n.src+" · day "+n.day+"</div>"+esc(n.text)+"</div>").join(""):"<p class='small'>The presses are warming up.</p>")+"</div>";
}
function settingsHtml(){
  return '<div class="card"><h2>administration</h2><p class="small">Autosaves to this device after every day. The AI adviser and press use the free public brain (no key, no signup); everything else runs offline on your phone.</p><div style="display:grid;gap:8px;margin-top:10px"><button class="act" id="exportSave">export your presidency (json)</button><button class="act" id="wipeSave">start a new administration (wipes this one)</button></div></div><div class="card"><h2>how it works</h2><p class="small">Citizens generate complaints from their own circumstances and remember what you promised. Ignore problems and pressure builds. Fund things and the debt grows. Congress votes on its own schedule. Emergencies emerge from the simulation. Elections happen at day 1460.</p></div>';
}

function seedStart(){
  S.states=STATE_DATA.map(([name,pop])=>({name,pop,sat:r(48,78),economy:r(40,80),complaints:ri(0,6)}));
  for(let i=0;i<26;i++)genComplaint();
  headline("The National Ledger","Inauguration day: President takes the oath amid a divided congress");
  log("chief of staff","Welcome, sir or madam. The inbox is already full. Start with the most urgent complaint.");
}
S=load()||newState();
if(!S.states)seedStart();
render();
})();
