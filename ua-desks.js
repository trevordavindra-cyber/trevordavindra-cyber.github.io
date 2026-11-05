'use strict';
/* EMPIRE DESKS v1 — departments for the Uncensored AI platform. Free brain, no keys, everything on-phone. */
(function(){
function $(id){return document.getElementById(id)}
function esc(s){return (s==null?'':String(s)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
var K='ua_desks_v1';
var DS=JSON.parse(localStorage.getItem(K)||'null')||{missions:[],agents:[],port:{cash:10000,hold:{},trades:[]},appr:[],auto:{on:false},log:[]};
function save(){localStorage.setItem(K,JSON.stringify(DS))}
function slog(t){DS.log.push({t:t,at:Date.now()});if(DS.log.length>200)DS.log=DS.log.slice(-200);save()}

async function brain(prompt,sys){
 sys=sys||'You are part of EMPIRE OS, an autonomous agent platform. Be concrete, never fake actions, never claim you sent or spent anything.';
 var body={model:'openai-fast',stream:false,messages:[{role:'system',content:sys},{role:'user',content:String(prompt).slice(0,6000)}]};
 for(var i=0;i<3;i++){
  try{
   var r=await fetch('https://text.pollinations.ai/openai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
   if(r.ok){var j=await r.json();var t=j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content;if(t)return t;}
  }catch(e){}
  await new Promise(function(res){setTimeout(res,1200)});
 }
 try{var g=await fetch('https://text.pollinations.ai/'+encodeURIComponent(prompt+' | max 900 words'));if(g.ok)return await g.text();}catch(e){}
 return '(free brain did not answer, try again)';
}
async function brainJSON(prompt){
 var t=await brain(prompt+' | Reply with ONLY valid JSON, no prose, no code fences.');
 try{return JSON.parse(t)}catch(e){}
 try{return JSON.parse(t.replace(/^[\s\S]*?(\{[\s\S]*\})[\s\S]*$/,'$1'))}catch(e){}
 return null;
}

/* ---------- UI ---------- */
var TABS=[['mission','🎯 Missions'],['factory','🏭 Agent factory'],['money','💵 Money desk'],['data','📊 Data desk'],['study','🎓 Study desk'],['design','🎨 Design desk'],['guard','🛡️ Guard desk'],['mkt','📣 Marketing'],['auto','♾️ Autonomy'],['appr','✅ Approvals'],['tools','🧪 Sandbox']];
var cur='mission';
function panel(){
 var p=document.createElement('div');p.className='panel';p.id='desksPanel';
 var tabs=TABS.map(function(t){return '<button class="ftab" data-t="'+t[0]+'">'+t[1]+'</button>'}).join('');
 p.innerHTML='<div class="prow"><button class="ic" id="dkClose">✕</button><div class="ptitle">🏛️ Empire desks</div></div>'+
 '<div class="filetabs" id="dkTabs" style="margin-top:8px">'+tabs+'</div>'+
 '<div class="mini" style="padding:6px 2px">Free brain · everything stays on your phone · anything outward sits in Approvals until you tap yes.</div>'+
 '<div id="dkBody" style="flex:1;overflow-y:auto;min-height:0"></div>';
 document.body.appendChild(p);
 $('dkClose').onclick=function(){p.style.display='none'};
 var ft=$('dkTabs');
 ft.querySelectorAll('.ftab').forEach(function(b){b.onclick=function(){cur=b.getAttribute('data-t');render()}});
}
function openDesks(){var p=$('desksPanel');if(!p){panel();p=$('desksPanel')}p.style.display='flex';render()}
function render(){
 $('dkTabs').querySelectorAll('.ftab').forEach(function(b){b.style.outline=(b.getAttribute('data-t')===cur)?'2px solid var(--accent)':'none'});
 var B=$('dkBody');B.innerHTML='';
 ({mission:rMission,factory:rFactory,money:rMoney,data:rData,study:rStudy,design:rDesign,guard:rGuard,mkt:rMkt,auto:rAuto,appr:rAppr,tools:rTools})[cur](B);
}

/* ---------- Missions ---------- */
function rMission(B){
 var h='<div class="pitem" style="flex-direction:column;align-items:stretch"><textarea class="tin dk" id="dkGoal" placeholder="Give the empire a goal. The orchestrator plans it, agents run it step by step, and a checker verifies each step."></textarea>'+
 '<div class="prow" style="margin-top:8px"><button class="sbtn" id="dkPlan">🪄 Plan with ATLAS</button><button class="sbtn" id="dkRunAll">▶️ Run next step</button></div><div class="mini dkerr" id="dkMErr"></div></div>';
 if(!DS.missions.length)h+='<div class="mini">No missions yet.</div>';
 DS.missions.slice().reverse().forEach(function(m){
  h+='<div class="pitem" style="flex-direction:column;align-items:stretch"><b>'+esc(m.goal)+'</b>';
  m.steps.forEach(function(s,i){h+='<div class="mini">'+(i+1)+'. ['+s.status+'] '+esc(s.t)+(s.out?'<br>→ '+esc(String(s.out).slice(0,300)):'')+'</div>'});
  h+='<div class="prow" style="margin-top:6px"><button class="sbtn" data-run="'+m.id+'">▶️ Step</button><button class="sbtn" data-del="'+m.id+'">🗑</button></div></div>';
 });
 B.innerHTML=h;
 $('dkPlan').onclick=async function(){
  var g=$('dkGoal').value.trim();if(!g)return;
  $('dkMErr').textContent='ATLAS is planning…';
  var j=await brainJSON('Goal: '+g+'. Break it into 4 or 5 concrete steps an agent team can execute with zero budget and no paid tools. Return JSON {"steps":[{"t":"step"}]}.');
  if(!j||!j.steps||!j.steps.length){$('dkMErr').textContent='Plan failed, try again.';return}
  DS.missions.push({id:Date.now(),goal:g,steps:j.steps.slice(0,6).map(function(s){return {t:s.t||String(s),status:'todo',out:''}}),i:0});
  save();slog('ATLAS planned: '+g);render();
 };
 $('dkRunAll').onclick=function(){runNext()};
 B.querySelectorAll('[data-run]').forEach(function(b){b.onclick=function(){runById(+b.getAttribute('data-run'))}});
 B.querySelectorAll('[data-del]').forEach(function(b){b.onclick=function(){DS.missions=DS.missions.filter(function(m){return m.id!=+b.getAttribute('data-del')});save();render()}});
}
function runNext(){var m=DS.missions.find(function(x){return x.steps.some(function(s){return s.status==='todo'})});if(m)runById(m.id)}
async function runById(id){
 var m=DS.missions.find(function(x){return x.id===id});if(!m)return;
 var s=m.steps.find(function(s){return s.status==='todo'});if(!s)return;
 s.status='working';save();render();
 var out=await brain('Mission: '+m.goal+'\nYour step: '+s.t+'\nDo this step concretely now. Zero budget, free tools only. Never claim you sent, posted or spent anything. Max 220 words.','You are FORGE, the executor agent of EMPIRE OS.');
 s.out=out;
 var chk=await brain('Step: '+s.t+'\nResult:\n'+out+'\nDoes the result actually complete the step? Reply exactly PASS or FAIL then a short reason.','You are INSPECTOR, the quality checker of EMPIRE OS.');
 if(String(chk).trim().toUpperCase().indexOf('FAIL')===0){
  var out2=await brain('Your step "'+s.t+'" failed inspection ('+chk+'). Redo it better. Same rules: zero budget, no fake actions. Max 220 words.','You are FORGE, the executor agent of EMPIRE OS. ');
  s.out=out2+' \n[re-inspected]';
 }
 s.status='done';save();slog('Step done: '+s.t);render();
}

/* ---------- Agent factory ---------- */
function rFactory(B){
 var h='<div class="pitem" style="flex-direction:column;align-items:stretch"><textarea class="tin dk" id="dkRole" placeholder="Describe the agent you need. Example: an agent that finds undervalued websites and estimates resale value."></textarea>'+
 '<button class="sbtn" id="dkSpawn" style="margin-top:8px">🏭 Spawn agent</button><div class="mini dkerr" id="dkFErr"></div></div>';
 if(!DS.agents.length)h+='<div class="mini">No spawned agents yet. Your 4 core agents (ATLAS, SAGE, FORGE, NOVA) live in the Agents panel.</div>';
 DS.agents.forEach(function(a){
  h+='<div class="pitem" style="flex-direction:column;align-items:stretch"><b>'+esc(a.name)+'</b><div class="mini">'+esc(a.role)+'</div>'+
  '<div class="prow" style="margin-top:6px"><button class="sbtn" data-chat="'+a.id+'">💬 Chat</button><button class="sbtn" data-clone="'+a.id+'">⧉ Clone</button><button class="sbtn" data-retire="'+a.id+'">🗑 Retire</button></div></div>';
 });
 B.innerHTML=h;
 $('dkSpawn').onclick=async function(){
  var d=$('dkRole').value.trim();if(!d)return;
  if(DS.agents.length>=12){$('dkFErr').textContent='Factory at 12 agents. Retire one first.';return}
  $('dkFErr').textContent='Factory is building…';
  var j=await brainJSON('Design a specialist agent for this job: '+d+'. Return JSON {"name":"short agent name in caps","role":"one sentence duties","greet":"one line greeting"}');
  if(!j||!j.name){$('dkFErr').textContent='Build failed, try again.';return}
  DS.agents.push({id:Date.now(),name:j.name,role:j.role||d,greet:j.greet||('Ready. '+j.name+' on duty.')});
  save();slog('Factory spawned: '+j.name);render();
 };
 B.querySelectorAll('[data-chat]').forEach(function(b){b.onclick=function(){chatSpawn(+b.getAttribute('data-chat'))}});
 B.querySelectorAll('[data-clone]').forEach(function(b){b.onclick=function(){var a=DS.agents.find(function(x){return x.id==+b.getAttribute('data-clone')});if(a&&DS.agents.length<12){DS.agents.push({id:Date.now(),name:a.name+' II',role:a.role,greet:a.greet});save();render()}}});
 B.querySelectorAll('[data-retire]').forEach(function(b){b.onclick=function(){DS.agents=DS.agents.filter(function(x){return x.id!=+b.getAttribute('data-retire')});save();render()}});
}
async function chatSpawn(id){
 var a=DS.agents.find(function(x){return x.id===id});if(!a)return;
 var q=prompt('Message '+a.name+':');if(!q)return;
 var out=await brain(q,'You are '+a.name+', a spawned agent of EMPIRE OS. Duties: '+a.role+' Zero budget, free tools, never claim you sent or spent anything.');
 alert(a.name+':\n\n'+String(out).slice(0,1200));
}

/* ---------- Money desk: paper trading, live crypto prices ---------- */
function rMoney(B){
 var h='<div class="mini">PAPER money only: $10,000 fake cash trading live crypto prices from CoinGecko. No real orders exist here, and a real trade would need the Approvals desk anyway.</div>'+
 '<div class="pitem"><b>Cash: $'+DS.port.cash.toFixed(2)+'</b><button class="sbtn" id="dkPx">↻ Refresh prices</button></div><div id="dkPxOut" class="mini"></div>'+
 '<div class="pitem" style="flex-direction:column;align-items:stretch"><div class="prow"><input class="tin dk" id="dkSym" placeholder="btc, eth, sol, doge" style="flex:1"><input class="tin dk" id="dkAmt" placeholder="US$ to use" style="flex:1"></div>'+
 '<div class="prow" style="margin-top:6px"><button class="sbtn" id="dkBuy">Buy (paper)</button><button class="sbtn" id="dkSell">Sell (paper)</button></div></div>';
 if(DS.port.trades.length){h+='<div class="mini" style="margin-top:6px"><b>Trade log</b></div>';DS.port.trades.slice(-8).reverse().forEach(function(t){h+='<div class="mini">'+esc(t)+'</div>'})}
 B.innerHTML=h;
 var SYMS={btc:'bitcoin',eth:'ethereum',sol:'solana',doge:'dogecoin'};
 async function px(){
  $('dkPxOut').textContent='loading prices…';
  try{
   var r=await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,dogecoin&vs_currencies=usd');
   var j=await r.json();window._dkPx=j;
   $('dkPxOut').innerHTML='BTC $'+(j.bitcoin?j.bitcoin.usd:'?')+' · ETH $'+(j.ethereum?j.ethereum.usd:'?')+' · SOL $'+(j.solana?j.solana.usd:'?')+' · DOGE $'+(j.dogecoin?j.dogecoin.usd:'?');
  }catch(e){$('dkPxOut').textContent='price feed failed: '+e.message}
 }
 $('dkPx').onclick=px;px();
 var tot=DS.port.cash;Object.keys(DS.port.hold).forEach(function(k){var p=window._dkPx&&window._dkPx[SYMS[k]];tot+=DS.port.hold[k]*(p?p.usd:0)});
 B.insertBefore(Object.assign(document.createElement('div'),{className:'mini',textContent:'Portfolio value (paper): $'+tot.toFixed(2)}),B.children[1]);
 $('dkBuy').onclick=function(){
  var s=$('dkSym').value.trim().toLowerCase(),amt=parseFloat($('dkAmt').value);
  var p=window._dkPx&&window._dkPx[SYMS[s]];
  if(!p){alert('Refresh prices first, and use btc, eth, sol or doge.');return}
  if(!amt||amt<=0||amt>DS.port.cash){alert('Paper cash left: $'+DS.port.cash.toFixed(2));return}
  DS.port.cash-=amt;DS.port.hold[s]=(DS.port.hold[s]||0)+amt/p.usd;
  DS.port.trades.push(new Date().toLocaleTimeString()+' bought $'+amt.toFixed(2)+' of '+s.toUpperCase()+' @ $'+p.usd);
  save();slog('Paper buy '+s);render();
 };
 $('dkSell').onclick=function(){
  var s=$('dkSym').value.trim().toLowerCase(),amt=parseFloat($('dkAmt').value);
  var p=window._dkPx&&window._dkPx[SYMS[s]];
  if(!p||!DS.port.hold[s]){alert('You hold none of that.');return}
  var qty=amt/p.usd;if(qty>DS.port.hold[s])qty=DS.port.hold[s];
  var v=qty*p.usd;DS.port.hold[s]-=qty;DS.port.cash+=v;
  DS.port.trades.push(new Date().toLocaleTimeString()+' sold '+s.toUpperCase()+' for $'+v.toFixed(2)+' @ $'+p.usd);
  save();slog('Paper sell '+s);render();
 };
}

/* ---------- Data desk ---------- */
function rData(B){
 var h='<div class="pitem" style="flex-direction:column;align-items:stretch"><textarea class="tin dk" id="dkCsv" placeholder="Paste CSV rows here (comma separated)"></textarea>'+
 '<div class="prow" style="margin-top:8px"><button class="sbtn" id="dkCsvGo">📊 Analyze</button><button class="sbtn" id="dkCsvAsk">🧠 Ask about it</button></div></div><div id="dkDataOut"></div>';
 B.innerHTML=h;
 $('dkCsvGo').onclick=function(){
  var t=$('dkCsv').value.trim();if(!t)return;
  var rows=t.split(/\n+/).map(function(l){return l.split(',').map(function(c){return c.trim().replace(/^"|"$/g,'')})});
  var head=rows[0],body=rows.slice(1).filter(function(r){return r.length>1});
  var stats='';
  head.forEach(function(col,i){
   var nums=body.map(function(r){return parseFloat(r[i])}).filter(function(n){return !isNaN(n)});
   if(nums.length>body.length/2){
    var min=Math.min.apply(null,nums),max=Math.max.apply(null,nums),avg=nums.reduce(function(a,b){return a+b},0)/nums.length;
    stats+='<div class="mini"><b>'+esc(col)+'</b>: min '+min.toFixed(2)+' · max '+max.toFixed(2)+' · avg '+avg.toFixed(2)+' · '+nums.length+' numbers</div>';
   }
  });
  $('dkDataOut').innerHTML='<div class="pitem" style="flex-direction:column;align-items:stretch"><div class="mini"><b>'+body.length+' rows · '+head.length+' columns</b></div>'+stats+'<div class="mini">first rows: '+esc(body.slice(0,3).map(function(r){return r.join(' | ')}).join(' ;; '))+'</div></div>';
  slog('Analyzed CSV ('+body.length+' rows)');
 };
 $('dkCsvAsk').onclick=async function(){
  var t=$('dkCsv').value.trim();if(!t)return;
  $('dkDataOut').innerHTML='<div class="mini">asking the brain…</div>';
  var out=await brain('Here is a CSV dataset:\n'+t.slice(0,3000)+'\nFind the most useful patterns and say them in 5 plain bullets.');
  $('dkDataOut').innerHTML='<div class="pitem" style="flex-direction:column;align-items:stretch"><div class="mini">'+esc(String(out).slice(0,1500))+'</div></div>';
 };
}

/* ---------- Study desk ---------- */
function rStudy(B){
 var h='<div class="pitem" style="flex-direction:column;align-items:stretch"><input class="tin dk" id="dkTopic" placeholder="Topic to learn, e.g. options trading basics">'+
 '<button class="sbtn" id="dkLearn" style="margin-top:8px">🎓 Make flashcards + quiz</button><div class="mini dkerr" id="dkSErr"></div></div><div id="dkStudyOut"></div>';
 B.innerHTML=h;
 $('dkLearn').onclick=async function(){
  var t=$('dkTopic').value.trim();if(!t)return;
  $('dkSErr').textContent='building your lesson…';
  var j=await brainJSON('Teach topic: '+t+'. Return JSON {"cards":[{"q":"question","a":"answer"}] (5 cards), "quiz":[{"q":"question","choices":["a","b","c"],"answer":0}] (3 questions, answer is index of correct choice)}.');
  $('dkSErr').textContent='';
  if(!j||!j.cards){$('dkSErr').textContent='Lesson failed, try again.';return}
  var h2='<div class="pitem" style="flex-direction:column;align-items:stretch">';
  j.cards.forEach(function(c){h2+='<div class="mini"><b>'+esc(c.q)+'</b><br>'+esc(c.a)+'</div>'});
  h2+='</div><div class="pitem" style="flex-direction:column;align-items:stretch"><b>Quiz</b>';
  var score=0, answered=0;
  (j.quiz||[]).forEach(function(q,qi){
   h2+='<div class="mini">'+esc(q.q)+'</div>';
   (q.choices||[]).forEach(function(c,ci){h2+='<button class="sbtn" data-q="'+qi+'" data-c="'+ci+'" style="margin:2px 0;padding:8px">'+esc(c)+'</button>'});
  });
  h2+='<div class="mini" id="dkScore"></div></div>';
  $('dkStudyOut').innerHTML=h2;
  var keys=[];
  $('dkStudyOut').querySelectorAll('[data-q]').forEach(function(b){
   b.onclick=function(){
    var qi=b.getAttribute('data-q'),ci=+b.getAttribute('data-c');
    if(keys[qi]!==undefined)return;keys[qi]=ci;answered++;
    if(ci===(j.quiz[qi].answer||0))score++;
    b.style.outline='2px solid '+(ci===(j.quiz[qi].answer||0)?'var(--accent)':'#ff5d5d');
    if(answered===j.quiz.length)$('dkScore').textContent='Score: '+score+' / '+j.quiz.length;
   };
  });
 };
}

/* ---------- Design desk (SVG) ---------- */
function rDesign(B){
 var h='<div class="pitem" style="flex-direction:column;align-items:stretch"><input class="tin dk" id="dkDName" placeholder="Brand or product name"><input class="tin dk" id="dkDVibe" placeholder="Vibe, e.g. bold gold luxury for a sneaker brand">'+
 '<div class="prow" style="margin-top:8px"><button class="sbtn" id="dkDGo">🎨 Design the logo</button><button class="sbtn" id="dkDCopy">📋 Copy SVG</button></div><div class="mini dkerr" id="dkDErr"></div></div><div id="dkDOut"></div>';
 B.innerHTML=h;var last='';
 $('dkDGo').onclick=async function(){
  var n=$('dkDName').value.trim(),v=$('dkDVibe').value.trim();if(!n)return;
  $('dkDErr').textContent='designing…';
  var out=await brain('Write an SVG logo for "'+n+'" ('+v+'). Rules: square viewBox 0 0 200 200, only shapes and text, no <script>, no event attributes, no external references, valid standalone SVG.','You are a brand designer. Reply with the SVG code only.');
  $('dkDErr').textContent='';
  last=String(out).replace(/<script[\s\S]*?<\/script>/gi,'').replace(/on\w+\s*=\s*"[^"]*"/gi,'').replace(/on\w+\s*=\s*'[^']*'/gi,'');
  if(last.indexOf('<svg')<0){$('dkDErr').textContent='Design failed, try again.';return}
  $('dkDOut').innerHTML='<div class="pitem" style="flex-direction:column;align-items:stretch"><div style="background:#fff;border-radius:12px;padding:10px">'+last+'</div></div>';
  slog('Designed logo '+n);
 };
 $('dkDCopy').onclick=function(){if(last)navigator.clipboard.writeText(last).then(function(){$('dkDErr').textContent='SVG copied.'})};
}

/* ---------- Guard desk (security review) ---------- */
function rGuard(B){
 var h='<div class="pitem" style="flex-direction:column;align-items:stretch"><textarea class="tin dk" id="dkGIn" placeholder="Paste code, config or a website plan. The guard reviews it for security problems. Read-only: it never breaks anything."></textarea>'+
 '<button class="sbtn" id="dkGGo" style="margin-top:8px">🛡️ Security review</button></div><div id="dkGOut"></div>';
 B.innerHTML=h;
 $('dkGGo').onclick=async function(){
  var t=$('dkGIn').value.trim();if(!t)return;
  $('dkGOut').innerHTML='<div class="mini">reviewing…</div>';
  var out=await brain('Security-review this. List real weaknesses with severity (high/med/low) and the fix for each. If it is clean say so. Do not invent problems.\n\n'+t.slice(0,5000),'You are SENTINEL, the defensive security agent of EMPIRE OS. Review only.');
  $('dkGOut').innerHTML='<div class="pitem" style="flex-direction:column;align-items:stretch"><div class="mini">'+esc(String(out).slice(0,1800))+'</div></div>';
  slog('Security review run');
 };
}

/* ---------- Marketing desk ---------- */
function rMkt(B){
 var h='<div class="pitem" style="flex-direction:column;align-items:stretch"><textarea class="tin dk" id="dkMk" placeholder="What should be marketed? Product, audience, vibe."></textarea>'+
 '<button class="sbtn" id="dkMkGo" style="margin-top:8px">📣 Draft the post pack</button><div class="mini">Drafts only. Nothing posts anywhere until it clears Approvals and you send it yourself.</div></div><div id="dkMkOut"></div>';
 B.innerHTML=h;
 $('dkMkGo').onclick=async function(){
  var t=$('dkMk').value.trim();if(!t)return;
  $('dkMkOut').innerHTML='<div class="mini">writing…</div>';
  var j=await brainJSON('Write a launch post pack for: '+t+'. Return JSON {"x":"X/Twitter post under 280 chars","ig":"Instagram caption with hashtags","tiktok":"15 second video script with hook"}');
  if(!j||!j.x){$('dkMkOut').innerHTML='<div class="mini">Draft failed, try again.</div>';return}
  $('dkMkOut').innerHTML='<div class="pitem" style="flex-direction:column;align-items:stretch"><div class="mini"><b>X</b><br>'+esc(j.x)+'</div><div class="mini"><b>Instagram</b><br>'+esc(j.ig||'')+'</div><div class="mini"><b>TikTok script</b><br>'+esc(j.tiktok||'')+'</div><button class="sbtn" id="dkMkQ">→ Queue for approval</button></div>';
  $('dkMkQ').onclick=function(){DS.appr.push({id:Date.now(),what:'Post pack for: '+t,text:(j.x||'')+(j.ig?' || IG: '+j.ig:'')+(j.tiktok?' || TikTok: '+j.tiktok:''),status:'pending'});save();slog('Marketing queued approval');alert('Queued. Approvals desk to review.')};
 };
}

/* ---------- Autonomy ---------- */
var sweepT=null;
function rAuto(B){
 var h='<div class="togglerow"><span>Autonomy heartbeat (every 10 min while this page is open)</span><input type="checkbox" id="dkAutoT"'+(DS.auto.on?' checked':'')+'></div>'+
 '<div class="mini">While on: advances the next open mission step, scans for one opportunity, and logs everything below. Phones pause background tabs, so it works while the page stays open — open it and let it run.</div>'+
 '<div class="prow" style="margin-top:8px"><button class="sbtn" id="dkSweepNow">▶️ Sweep now</button></div><div id="dkLog"></div>';
 B.innerHTML=h;
 $('dkAutoT').onchange=function(){DS.auto.on=this.checked;save();if(DS.auto.on){startSweep()}else{clearInterval(sweepT)}};
 $('dkSweepNow').onclick=sweep;
 var lg='';DS.log.slice(-12).reverse().forEach(function(l){lg+='<div class="mini">'+new Date(l.at).toLocaleTimeString()+' — '+esc(l.t)+'</div>'});
 $('dkLog').innerHTML=lg||'<div class="mini">No activity yet.</div>';
 if(DS.auto.on&&!sweepT)startSweep();
}
function startSweep(){clearInterval(sweepT);sweepT=setInterval(function(){if(document.visibilityState==='visible')sweep()},600000)}
async function sweep(){
 var m=DS.missions.find(function(x){return x.steps.some(function(s){return s.status==='todo'})});
 if(m){await runById(m.id);slog('Heartbeat advanced a step on: '+m.goal)}
 else{
  var out=await brain('Scan for ONE money-making opportunity right now that needs $0 to start. Name it, the first move, and the honest risk. Max 120 words.','You are HUNTER of EMPIRE OS.');
  slog('Opportunity scan: '+String(out).slice(0,140).replace(/\n/g,' '));
 }
 save();
 if(cur==='auto')render();
}

/* ---------- Approvals ---------- */
function rAppr(B){
 var h='<div class="pitem" style="flex-direction:column;align-items:stretch"><input class="tin dk" id="dkAWhat" placeholder="What needs approval? (e.g. post this, buy this)"><button class="sbtn" id="dkAAdd" style="margin-top:8px">＋ Queue approval</button></div>';
 if(!DS.appr.length)h+='<div class="mini">Queue is empty. Agents queue anything outward here and it never happens until you tap Approve.</div>';
 DS.appr.slice().reverse().forEach(function(a){
  h+='<div class="pitem" style="flex-direction:column;align-items:stretch"><b>'+esc(a.what)+'</b>'+(a.text?'<div class="mini">'+esc(String(a.text).slice(0,400))+'</div>':'')+
  '<div class="mini"><span class="tag">'+a.status+'</span></div>'+
  (a.status==='pending'?'<div class="prow" style="margin-top:6px"><button class="sbtn" data-ok="'+a.id+'">✅ Approve</button><button class="sbtn" data-no="'+a.id+'">🗑 Deny</button></div>':'')+'</div>';
 });
 B.innerHTML=h;
 $('dkAAdd').onclick=function(){var w=$('dkAWhat').value.trim();if(!w)return;DS.appr.push({id:Date.now(),what:w,text:'',status:'pending'});save();render()};
 B.querySelectorAll('[data-ok]').forEach(function(b){b.onclick=function(){var a=DS.appr.find(function(x){return x.id==+b.getAttribute('data-ok')});if(a){a.status='approved — copy it and send it yourself';save();slog('Approved: '+a.what);render()}}});
 B.querySelectorAll('[data-no]').forEach(function(b){b.onclick=function(){DS.appr=DS.appr.filter(function(x){return x.id!=+b.getAttribute('data-no')});save();render()}});
}

/* ---------- Sandbox ---------- */
function rTools(B){
 var h='<div class="mini">Agents can build their own tools here: write JavaScript, run it in a locked box (no access to your data on this page), see the result.</div>'+
 '<div class="pitem" style="flex-direction:column;align-items:stretch"><textarea class="tin dk" id="dkJS" style="font-family:ui-monospace,Menlo,monospace" placeholder="Write a JS tool. Example:\nfor(let i=1;i<=5;i++)console.log(i*i)"></textarea>'+
 '<div class="prow" style="margin-top:8px"><button class="sbtn" id="dkJSRun">▶️ Run it</button><button class="sbtn" id="dkJSBrain">🧠 Agent writes it</button></div><div class="mini dkerr" id="dkJSErr"></div></div><div id="dkJSOut" class="mini"></div>';
 B.innerHTML=h;
 $('dkJSRun').onclick=function(){
  var code=$('dkJS').value;if(!code)return;
  var f=document.createElement('iframe');f.setAttribute('sandbox','allow-scripts');f.style.display='none';
  var html='<script>var _o=[];console.log=function(){_o.push([].slice.call(arguments).join(" "))};window.onerror=function(m){_o.push("ERROR: "+m)};try{'+code.replace(/<\/script/gi,'<\\/script')+'}catch(e){_o.push("ERROR: "+e.message)};parent.postMessage(JSON.stringify(_o),"*");<\/script>';
  f.srcdoc=html;document.body.appendChild(f);
  var handler=function(ev){var out;try{out=JSON.parse(ev.data)}catch(e){return}
   $('dkJSOut').textContent=out.join('\n')||'(no output)';window.removeEventListener('message',handler);f.remove()};
  window.addEventListener('message',handler);slog('Ran a self-made tool');
 };
 $('dkJSBrain').onclick=async function(){
  var want=$('dkJS').value.trim()||'a small useful tool';
  $('dkJSErr').textContent='agent is writing the tool…';
  var out=await brain('Write a short JavaScript tool: '+want+'. Plain JS only, no DOM, no fetch, no libraries. Use console.log for output. Reply with the code only.','You are AXIOM, the tool-builder agent of EMPIRE OS.');
  $('dkJSErr').textContent='';$('dkJS').value=String(out).replace(/^```(js|javascript)?|```$/g,'').trim();
 };
}

/* ---------- wire in ---------- */
function wire(){
 var d=$('drawer');if(!d)return setTimeout(wire,300);
 if($('desksbtn'))return;
 var b=document.createElement('button');b.className='newchat';b.id='desksbtn';b.textContent='🏛️ Empire desks';
 b.onclick=function(){openDesks()};
 var ref=$('agentbtn');d.insertBefore(b,ref?ref.nextSibling:null);
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',wire)}else{wire()}
})();