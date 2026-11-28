(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "projectile"; btn.title = "Projectile physics builder";
var p = panel("projectiles", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "projectile behavior, e.g. rocket launcher, grenade with bounce + fuse";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build projectile";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox projectile system for: " + t + "\n\nRequirements: server spawns and owns the projectile part (client only shows the muzzle flash), velocity + gravity + drag integrated with Heartbeat and dt, raycast-per-step collision (no .Touched, say why), explosion radius damage through the PvP damage module with falloff, despawn + debris cleanup, and a Projectile.Fire(origin, dir, opts) API. Include the network ownership note for projectiles the shooter sees.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
