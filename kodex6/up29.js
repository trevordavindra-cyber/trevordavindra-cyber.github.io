(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var TYPES = [
["kill / damage zone", "damage per second or per touch, team immune option"],
["trigger zone (events)", "fires Entered/Left events per player, debounce, server-side"],
["checkpoint zone", "per-player checkpoint saving, respawn teleport back"],
["safe zone", "blocks all damage inside, visual shield indicator"],
["speed / jump pad", "boost on touch with cooldown per player"]
];
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "zones"; btn.title = "Zone / trigger system builder";
var p = panel("zone builder", btn);
var sel = document.createElement("select"); sel.className = "tinput";
TYPES.forEach(function(t,i){ var o = document.createElement("option"); o.value = String(i); o.textContent = t[0]; sel.appendChild(o); });
var ta = document.createElement("textarea"); ta.className = "tinput"; ta.placeholder = "extras: zone name, damage value, team rules... (optional)";
p.appendChild(sel); p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build zone";
go.addEventListener("click", function(){
  var t = TYPES[sel.value|0];
  KODEX.inputEl.value = "Build a roblox " + t[0] + " system. Requirements: " + t[1] + ". The zone is a Part named Zone in workspace; detect via GetPartsInPart or touched, handle characters not just parts, per-player cooldowns, all logic server-side. Extra details: " + (ta.value.trim() || "none") + ".\n\nSay exactly where the script goes and how to tag the zone part.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); });
strip().appendChild(btn);
})();
