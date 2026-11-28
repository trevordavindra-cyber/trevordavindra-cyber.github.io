(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "ragdoll"; btn.title = "Ragdoll / death physics builder";
var p = panel("ragdoll builder", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "how death looks, e.g. ragdoll on death, remove after 5s, no ragdoll on team kill";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build ragdoll";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox ragdoll system for death. Plan: " + t + "\n\nRequirements: Motor6Ds swapped for BallSocketConstraints on death (list every one to swap), character parts CanCollide handled so bodies don't sink or jitter, an auto-cleanup timer with Debris, a Ragdoll.On(player) signal other scripts connect to, and it never runs on respawned characters. Include the network-ownership note so ragdolls don't stutter on the killer's screen.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
