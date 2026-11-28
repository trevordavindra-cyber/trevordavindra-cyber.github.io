(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "modes"; btn.title = "Game mode manager builder";
var p = panel("game modes", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "modes wanted, e.g. deathmatch, capture point, free-for-all";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build modes";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox game mode manager for: " + t + "\n\nRequirements: each mode a ModuleScript with OnStart/OnEnd/Cleanup + a config (name, duration, scoring), one ModeManager that loads a mode by name, rotation or vote result, mode-specific rules loaded and torn down cleanly on switch (no leftover connections), UI broadcast of the current mode + timer, and a Modes.Get(name) API. Include the exact folder layout and how a new mode is dropped in without touching the manager.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
