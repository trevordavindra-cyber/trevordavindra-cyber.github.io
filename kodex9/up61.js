(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "mapgen"; btn.title = "Map randomizer builder";
var p = panel("map randomizer", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "maps to rotate, e.g. 3 arenas chosen randomly each round";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build randomizer";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox map randomizer. Maps: " + t + "\n\nRequirements: maps stored in ServerStorage folders, weighted random pick with no immediate repeat, clone into a MapFolder in workspace at round start, teardown (clean DespawnAll) at round end, and a MapChosen signal the round manager and UI both listen to. Include how to add a new map in one folder-drop.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
