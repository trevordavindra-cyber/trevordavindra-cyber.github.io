(function(){
"use strict";
var ENDPOINT = "https://text.pollinations.ai/openai";
var MODEL = "openai"; // relay alias for openai-fast
var SYSTEM = [
"You are KODEX, a blunt, elite coding assistant.",
"Answer code questions directly and completely.",
"Always give full, runnable code in fenced blocks with the language tag.",
"No lectures, no disclaimers about best practices unless they are load-bearing, no restating the question.",
"If something is impossible or a bad idea technically, say so in one line and give the closest working alternative.",
"You do not pretend: if you are unsure of an API detail, say so and point at the docs to check."
].join(" ");

var chatEl = document.getElementById("chat");
var inputEl = document.getElementById("input");
var sendBtn = document.getElementById("send");
var cdEl = document.getElementById("cooldown");
var cdMsg = document.getElementById("cdmsg");
var history = []; // {role, content}
var busy = false;

function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}

function renderMarkdown(text){
  // fenced code blocks
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
      html += '<div class="codeblock"><div class="bar"><span class="lang">'+esc(lang||"code")+'</span>'+
        '<button class="copybtn" data-copy="'+id+'">copy</button></div>'+
        '<pre id="'+id+'">'+esc(code)+"</pre></div>";
    } else {
      var seg = esc(parts[i]);
      // inline code
      seg = seg.replace(/`([^`\n]+)`/g, "<code>$1</code>");
      // bold
      seg = seg.replace(/\*\*([^\n]+?)\*\*/g, "<strong>$1</strong>");
      html += seg;
    }
  }
  return html;
}

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
  return bubble;
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

function showCooldown(msg){
  cdEl.classList.remove("hidden");
  cdMsg.textContent = msg;
}
function hideCooldown(){ cdEl.classList.add("hidden"); }

function ask(){
  var text = inputEl.value.trim();
  if (!text || busy) return;
  inputEl.value = "";
  autosize();
  addMsg("user", text);
  history.push({role:"user", content:text});
  run();
}

function run(){
  busy = true;
  sendBtn.disabled = true;
  var th = addThinking();
  var msgs = [{role:"system", content:SYSTEM}].concat(history.slice(-20));
  fetch(ENDPOINT, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({model: MODEL, messages: msgs, private: true})
  }).then(function(r){
    if (r.status === 402 || r.status === 429){
      return r.text().then(function(){
        cooldownRetry("free relay cooldown, retrying in 45s");
        th.remove();
        return null;
      });
    }
    if (!r.ok){ return r.text().then(function(t){ throw new Error("relay "+r.status+": "+t.slice(0,200)); }); }
    return r.json();
  }).then(function(data){
    if (!data) return;
    var reply = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content || "(empty reply)";
    history.push({role:"assistant", content:reply});
    th.remove();
    addMsg("ai", reply);
    done();
  }).catch(function(err){
    th.remove();
    addMsg("ai", "**relay error.** " + String(err && err.message || err) + " — the free relay hiccups a lot, try again in a minute.");
    done();
  });
}

var cdTimer = null;
function cooldownRetry(msg){
  var left = 45;
  showCooldown(msg);
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
  busy = false;
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
  history = [];
  chatEl.innerHTML = "";
  addMsg("ai", "cleared. what are we building?");
});

addMsg("ai", "**KODEX online.** coding questions go here: full files, straight answers, no lectures. free relay, so if it cools down it retries itself after 45s.");
})();

if ("serviceWorker" in navigator){
  navigator.serviceWorker.register("sw.js").catch(function(){});
}
