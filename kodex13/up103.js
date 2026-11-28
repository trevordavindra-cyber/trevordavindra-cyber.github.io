(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "pvp"; btn.title = "PvP damage rules builder";
var p = panel("pvp rules", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "damage rules, e.g. no friendly fire, spawn protection 3s";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build pvp";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox PvP damage rules module. Rules: " + t + "\n\nRequirements: one Damage.Gate(attacker, victim) check run server-side before any Humanoid:TakeDamage (team check, spawn protection window, dead player ignored, downed-state handling with the revive module if present), damage numbers shown client-side from the server result only, and a DamageDealt signal for stats. Include why gating at the single server entry point beats checking in every weapon script.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
