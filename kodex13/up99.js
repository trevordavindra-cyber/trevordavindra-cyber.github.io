(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "raycast"; btn.title = "Raycast helper builder";
var p = panel("raycast helper", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "what it does, e.g. bullet hitscan, wallbang rules";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build raycast";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox raycast helper module for: " + t + "\n\nRequirements: one Ray module wrapping workspace:Raycast with params built once (whitelist of hittable folders, blacklist of the shooter's character and local effects), a FilterDescendantsInstances pattern that survives respawn, distance + falloff params, a visual-only follow-up (beam or bullet hole) driven by the server result, and a Ray.Cast(origin, dir, opts) API. Include why the ignore list must be built server-side from the character model, not a client field.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
