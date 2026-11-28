(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "weather"; btn.title = "Day/night + weather builder";
var p = panel("day + weather", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "what the map does, e.g. 10-min day cycle, fog + rain at night";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build cycle";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox day/night + weather system. Plan: " + t + "\n\nRequirements: Lighting.ClockTime driven from a single server loop (interpolated, not snapped), weather states (clear/fog/rain/storm) as a config table with Atmosphere + ParticleEmitter + Sound per state, transitions tweened over seconds, a WeatherChanged signal other scripts listen to, and a note on which parts of it run client-side for performance. Include how to force a weather state from the debug console for testing.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
