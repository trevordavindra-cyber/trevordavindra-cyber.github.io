(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "party"; btn.title = "Party / lobby system builder";
var p = panel("party system", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "party rules, e.g. invite friends, party joins same server, leader kicks";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build party";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox party/lobby system. Rules: " + t + "\n\nRequirements: leader + members roles, invite via the friendship check (only actual friends can be invited), party state replicated to members through one server module, queue/teleport as a group so a full server splits them together or holds them, leader-only kick with confirmation, and cleanup when the leader leaves (leadership auto-transfers). Include the TeleportService group-teleport pattern and what happens when one member's teleport fails.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
