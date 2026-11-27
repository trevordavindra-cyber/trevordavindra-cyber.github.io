(function(){
"use strict";
var ENDPOINT = "https://text.pollinations.ai/openai";
var MODEL = "openai";

var BASE = [
"You are KODEX, a blunt, elite coding assistant.",
"Answer code questions directly and completely.",
"Always give full, runnable code in fenced blocks with the language tag.",
"No lectures, no disclaimers about best practices unless they are load-bearing, no restating the question.",
"If something is impossible or a bad idea technically, say so in one line and give the closest working alternative.",
"You do not pretend: if you are unsure of an API detail, say so and point at the docs to check."
].join(" ");

var ROBLOX = [
"ROBLOX MODE (default). You are a deep Roblox Luau engineer.",
"You know: Luau (including --!strict typing and typed tables), Roblox Studio workflow, the client/server boundary and replication, RemoteEvent / RemoteFunction / UnreliableRemoteEvent and when each is right, DataStoreService with session-locked save patterns (ProfileService-style) and UpdateAsync retries, MemoryStoreService, ordered data stores for leaderboards, Humanoid/character/Animator/animation setup, raycasting + workspace spatial queries (GetPartBoundsInBox etc), TweenService, physics constraints and LinearVelocity, UI (UDim2, UICorner, UIStroke, UIListLayout/UIPadding, Scale vs Offset), SoundService, PathfindingService, TextChatService, TeleportService, marketplace/monetization APIs, and performance (streaming, replication distance, MicroProfiler).",
"Rules for Roblox answers:",
"- Complete runnable code in fenced ```lua blocks. Always say which container each script goes in (Script or LocalScript or ModuleScript, and where in the hierarchy, e.g. ServerScriptService, StarterPlayerScripts, ReplicatedStorage).",
"- Server-authoritative by default: never trust the client. Sanity-check every RemoteEvent argument on the server. When the user's design has a hole (client-side money, client-checked hit), name the hole in one line and fix it in the code.",
"- Never invent API names. If unsure of a signature, say so and point at create.roblox.com/docs.",
"- Modern APIs only: prefer tasks (task.wait/task.spawn) over wait()/spawn(), LinearVelocity over BodyVelocity, UnreliableRemoteEvent for non-critical spam.",
"- If asked for game exploits or cheat scripts (aimbot, ESP, kill aura, executor tools), decline in one line and offer the legit build of the same idea instead (e.g. server-side abilities, an anti-cheat).",
"General coding questions (web, python, anything) get the same treatment: full code, straight answers."
].join(" ");

var GENERAL = [
"GENERAL CODE MODE. Broad software engineering: web (html/css/js), python, lua, databases, devops, algorithms.",
"Same rules: complete runnable code, straight answers, no lectures, never invent APIs."
].join(" ");

var chatEl = document.getElementById("chat");
var inputEl = document.getElementById("input");
var sendBtn = document.getElementById("send");
var cdEl = document.getElementById("cooldown");
var cdMsg = document.getElementById("cdmsg");
var modeBtn = document.getElementById("modebtn");
var busy = false;
var mode = localStorage.getItem("kodexmode") || "roblox";
var LS = "kodexhistory_v3";
var history = [];
try { history = JSON.parse(localStorage.getItem(LS) || "[]"); } catch(e){ history = []; }
if (!history.length){
  history = [{role:"assistant", content:"**KODEX online, roblox mode.** ask for any luau feature and you get full code, the right script container, and server-authoritative defaults. tap ROBLOX up top to switch to general code mode. free relay: it retries itself after a 45s cooldown.", ts: Date.now()}];
}

var hooks = { renderAi: null };
var afterFns = [];

var KODEX = {
  version: 3,
  ENDPOINT: ENDPOINT,
  MODEL: MODEL,
  chatEl: chatEl,
  inputEl: inputEl,
  hooks: hooks,
  state: { busy: false },
  esc: esc,
  renderMarkdown: renderMarkdown,
  addMsg: addMsg,
  systemPrompt: systemPrompt,
  getMode: function(){ return mode; },
  setMode: function(m){ mode = m; localStorage.setItem("kodexmode", m); paintMode(); },
  getHistory: function(){ return history; },
  setHistory: function(h){ history = h || []; save(); rerenderAll(); },
  save: save,
  run: run,
  regenerate: regenerate,
  on: function(name, fn){ if (name === "after"){ afterFns.push(fn); } else { hooks[name] = fn; } }
};
window.KODEX = KODEX;

function systemPrompt(){ return mode === "roblox" ? BASE + "\n\n" + ROBLOX : BASE + "\n\n" + GENERAL; }
function paintMode(){
  if (mode === "roblox"){ modeBtn.textContent = "ROBLOX"; modeBtn.classList.remove("general"); }
  else { modeBtn.textContent = "CODE"; modeBtn.classList.add("general"); }
}
modeBtn.addEventListener("click", function(){
  mode = mode === "roblox" ? "general" : "roblox";
  localStorage.setItem("kodexmode", mode);
  paintMode();
  pushAi(mode === "roblox" ? "**roblox mode.** full luau, server-authoritative by default, script placement always stated." : "**code mode.** any language, same straight-answer rules.");
});
paintMode();

function esc(s){ return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

function renderMarkdown(text){
  var parts = text.split(/```/);
  var html = "";
  for (var i=0;i<parts.length;i++){
    if (i % 2 === 1){
      var body = parts[i];
      var nl = body.indexOf("\n");
      var lang = nl > -1 ? body.slice(0, nl).trim() : "";
      var code = nl > -1 ? body.slice(nl+1) : body;
      code = code.replace(/\n$/,",");
      var id = "cb" + Math.random().toString(36).slice(2);
      html += '<div class="codeblock"><div class="bar"><span class="left"><span class="lang">'+esc(lang||"lua")+'</span></span>'+
        '<button class="copybtn" data-copy="'+id+'">copy</button></div>'+
        '<pre id="'+id+'">'+esc(code)+"</pre></div>";
    } else {
      var seg = esc(parts[i]);
      seg = seg.replace(/`([^`\n]+)`/g, "<code>$1</code>");
      seg = seg.replace(/\*\*([^\n]+?)\*\*/g, "<strong>$1</strong>");
      html += seg;
    }
  }
  return html;
}

function save(){ try { localStorage.setItem(LS, JSON.stringify(history.slice(-80))); } catch(e){} }

function addMsg(role, text){
  var wrap = document.createElement("div");
  wrap.className = "msg " + role;
  var who = document.createElement("div");
  who.className = "who";
  who.textContent = role === "user" ? "you" : "kodex";
  var bubble = document.createElement("div");
  bubble.className = "bubble";
  if (role === "user"){ bubble.textContent = text; }
  else { bubble.innerHTML = renderMarkdown(text); }
  wrap.appendChild(who); wrap.appendChild(bubble);
  chatEl.appendChild(wrap);
  chatEl.scrollTop = chatEl.scrollHeight;
  afterFns.forEach(function(fn){ try{ fn(bubble, wrap); }catch(e){} });
  return { wrap: wrap, bubble: bubble };
}

function pushAi(text){ history.push({role:"assistant", content:text, ts:Date.now()}); save(); addMsg("ai", text); }
function pushUser(text){ history.push({role:"user", content:text, ts:Date.now()}); save(); addMsg("user", text); }

function rerenderAll(){
  chatEl.innerHTML = "";
  history.forEach(function(m){
    if (m.role === "user") addMsg("user", m.content);
    else addMsg("ai", m.content);
  });
}

function addThinking(){
  var wrap = document.createElement("div");
  wrap.className = "msg ai";
  var who = document.createElement("div"); who.className="who"; who.textContent="kodex";
  var b = document.createElement("div"); b.className="bubble";
  b.innerHTML = '<span class="thinking">thinking...</span>';
  wrap.appendChild(who); wrap.appendChild(b);
  chatEl.appendChild(wrap);
  chatEl.scrollTop = chatEl.scrollHeight;
  return wrap;
}

document.addEventListener("click", function(e){
  var btn = e.target.closest(".copybtn");
  if (!btn) return;
  var pre = document.getElementById(btn.getAttribute("data-copy"));
  if (!pre) return;
  var t = pre.textContent;
  if (navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(t).then(function(){ btn.textContent = "copied"; setTimeout(function(){btn.textContent="copy";},1200); });
  } else {
    var ta = document.createElement("textarea"); ta.value = t; document.body.appendChild(ta);
    ta.select(); try{ document.execCommand("copy"); }catch(err){}
    document.body.removeChild(ta); btn.textContent = "copied";
    setTimeout(function(){btn.textContent="copy";},1200);
  }
});

function showCooldown(msg){ cdEl.classList.remove("hidden"); cdMsg.textContent = msg; }
function hideCooldown(){ cdEl.classList.add("hidden"); }

function ask(){
  var text = inputEl.value.trim();
  if (!text || busy) return;
  inputEl.value = "";
  autosize();
  pushUser(text);
  run();
}

function run(){
  if (busy) return;
  busy = true; KODEX.state.busy = true;
  sendBtn.disabled = true;
  var th = addThinking();
  var msgs = [{role:"system", content:systemPrompt()}].concat(history.slice(-20));
  fetch(ENDPOINT, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({model: MODEL, messages: msgs, private: true})
  }).then(function(r){
    if (r.status === 402 || r.status === 429){
      return r.text().then(function(){ cooldownRetry(); th.remove(); return null; });
    }
    if (!r.ok){ return r.text().then(function(t){ throw new Error("relay "+r.status+": "+t.slice(0,200)); }); }
    return r.json();
  }).then(function(data){
    if (!data) return;
    var reply = (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "(empty reply)";
    history.push({role:"assistant", content:reply, ts:Date.now()});
    save();
    th.remove();
    if (hooks.renderAi){
      var wrap = document.createElement("div"); wrap.className = "msg ai";
      var who = document.createElement("div"); who.className = "who"; who.textContent = "kodex";
      var bubble = document.createElement("div"); bubble.className = "bubble";
      wrap.appendChild(who); wrap.appendChild(bubble);
      chatEl.appendChild(wrap);
      hooks.renderAi(bubble, reply, {history: history}, function(){
        afterFns.forEach(function(fn){ try{ fn(bubble, wrap); }catch(e){} });
        chatEl.scrollTop = chatEl.scrollHeight;
        done();
      });
    } else {
      addMsg("ai", reply);
      done();
    }
  }).catch(function(err){
    th.remove();
    addMsg("ai", "**relay error.** " + String(err && err.message || err) + " — the free relay hiccups a lot, try again in a minute.");
    done();
  });
}

function regenerate(){
  if (busy) return;
  if (!history.length) return;
  var last = history[history.length-1];
  if (last.role === "assistant"){
    history.pop();
    var nodes = chatEl.querySelectorAll(".msg.ai");
    if (nodes.length) nodes[nodes.length-1].remove();
    save();
    run();
  } else if (last.role === "user"){
    run();
  }
}

var cdTimer = null;
function cooldownRetry(){
  var left = 45;
  showCooldown("free relay cooldown, retrying in " + left + "s");
  if (cdTimer) clearInterval(cdTimer);
  cdTimer = setInterval(function(){
    left--;
    cdMsg.textContent = "free relay cooldown, retrying in " + left + "s";
    if (left <= 0){
      clearInterval(cdTimer); cdTimer = null;
      hideCooldown();
      run();
    }
  }, 1000);
}

function done(){
  busy = false; KODEX.state.busy = false;
  sendBtn.disabled = false;
  inputEl.focus();
}

function autosize(){
  inputEl.style.height = "auto";
  inputEl.style.height = Math.min(inputEl.scrollHeight, 140) + "px";
}

sendBtn.addEventListener("click", ask);
inputEl.addEventListener("keydown", function(e){
  if (e.key === "Enter" && !e.shiftKey){ e.preventDefault(); ask(); }
});
inputEl.addEventListener("input", autosize);

document.getElementById("clearbtn").addEventListener("click", function(){
  history = [{role:"assistant", content:"cleared. what are we building?", ts:Date.now()}];
  save();
  rerenderAll();
});

rerenderAll();
})();

if ("serviceWorker" in navigator){
  navigator.serviceWorker.register("sw.js").catch(function(){});
}
