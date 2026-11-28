(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "afk"; btn.title = "AFK detection + handling builder";
var p = panel("afk detector", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "afk policy, e.g. kick after 10 min idle mid-round, no afk farm";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build afk";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox AFK detection + handling system. Policy: " + t + "\n\nRequirements: client input tracker (mousemove, keys, touch) reporting only on activity change, server-side idle timer per player (server trusts only its own timestamps), an AFK tag shown on the leaderboard, idle players excluded from XP/quest progress, and a gentle warning before any kick. Include why the server timestamp, not the client report, is the authority.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
