(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "respawn"; btn.title = "Respawn system builder";
var p = panel("respawn system", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "respawn rules, e.g. 5s delay, random spawn away from enemies";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build respawn";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox respawn system. Rules: " + t + "\n\nRequirements: Characters.Respawn handled by one module (CustomString set, PlayerAdded/CharacterAdded wiring done once), respawn delay with a countdown shown client-side, spawn point selection scoring distance from living enemies, brief spawn protection (ForceField with expiry, not a CanCollide hack), and a PreRespawn hook the loadout system uses to restore weapons. Include why CharacterAutoLoads stays on and the module owns timing instead of disabling it.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
