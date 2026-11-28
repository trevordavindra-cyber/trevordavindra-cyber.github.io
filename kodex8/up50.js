(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "rounds"; btn.title = "Round loop builder";
var p = panel("round loop", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "round rules, e.g. 3-min rounds, last team standing, point capture";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build loop";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox round-based game loop. Rules: " + t + "\n\nRequirements: a single server-side RoundManager module with states (intermission, running, ended), intermission with countdown broadcast to clients, safe mid-round join/leave handling, win detection with a tie path, and hooks (OnRoundStart, OnRoundEnd) other scripts can connect to. No while true do sleep spam: use task.wait based state machine. Show where it lives and how the timer UI gets its value.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
