(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "sfx"; btn.title = "Sound manager builder";
var p = panel("sound manager", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "sounds + when they play, e.g. shoot, hit, reload, headshot, round start";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build manager";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox sound manager module for my shooter. Events: " + t + "\n\nRequirements: ModuleScript holding id + volume + pitch range per sound, Play(player, name, position) API, 3D positional sounds for world events and local playback for UI, no sound spam (per-sound throttle), ids as placeholders I fill in. Say where the module lives and how scripts call it.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
