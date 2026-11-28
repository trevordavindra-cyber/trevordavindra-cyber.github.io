(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var KINDS = [
["patrol npc", "walks waypoints on a loop, turns around at the end, returns home if pushed"],
["chase npc", "PathfindingService to the nearest player within range, loses them past range, cooldown between path computes"],
["attack npc", "chases then melee-hits with a hitbox + damage + attack cooldown, all server-side"],
["guard npc", "stands at a post, chases players who enter an aggro radius, leashes back home if they leave"]
];
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "npc"; btn.title = "NPC AI builder";
var p = panel("npc ai builder", btn);
var sel = document.createElement("select"); sel.className = "tinput";
KINDS.forEach(function(k,i){ var o = document.createElement("option"); o.value = String(i); o.textContent = k[0]; sel.appendChild(o); });
var ta = document.createElement("textarea"); ta.className = "tinput"; ta.placeholder = "extras: speed, damage, aggro range... (optional)";
p.appendChild(sel); p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build npc";
go.addEventListener("click", function(){
  var k = KINDS[sel.value|0];
  KODEX.inputEl.value = "Build a roblox " + k[0] + " AI script. Behavior: " + k[1] + ". Extras: " + (ta.value.trim() || "pick sensible defaults and list them") + "\n\nRequirements: PathfindingService with ComputeAsync error handling, a state field (idle/chase/return) so it never double-computes paths, Humanoid move via MoveTo with reached checks, all server-side, and a comment block saying exactly where the script and waypoints live.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); });
strip().appendChild(btn);
})();
