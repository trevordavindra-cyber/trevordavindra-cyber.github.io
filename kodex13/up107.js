(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "cycle"; btn.title = "Day/night cycle builder";
var p = panel("day/night cycle", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "cycle rules, e.g. 10 min full day, darker at night for gameplay";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build cycle";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox day/night cycle. Rules: " + t + "\n\nRequirements: server owns ClockTime (one module, increments in Heartbeat with dt so speed is frame-independent), lighting presets keyed by time window (Ambient, OutdoorAmbient, FogEnd, Brightness) tweened on window change instead of set every frame, a DayChanged signal gameplay listens to (night-only enemies, darker vision), and the cycle matches across servers via a fixed epoch. Include the one-line change to freeze time at a chosen hour.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
