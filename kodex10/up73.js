(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "quests"; btn.title = "Quest / objective tracker builder";
var p = panel("quest tracker", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "objectives wanted, e.g. get 10 kills, capture points, daily missions";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build quests";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox quest/objective tracker for: " + t + "\n\nRequirements: quest config table (id, description, goal count, reward), progress increments only through the stats API events (one place, no per-script counters), QuestServer that grants the reward once with anti-replay, a client checklist UI that updates live, and daily quest reset logic. Show how to add a new quest in one config entry and how a kill, capture or pickup feeds progress automatically.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
