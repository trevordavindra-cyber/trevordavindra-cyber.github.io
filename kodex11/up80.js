(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "vehicle"; btn.title = "Vehicle / chassis helper builder";
var p = panel("vehicle helper", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "what the vehicle does, e.g. drivable buggy, respawn after flip";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build vehicle";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox vehicle system for: " + t + "\n\nRequirements: Seat + VehicleSeat controls wired to HingeConstraints or LinearVelocity (state which style and why), one seat owner at a time with an exit cleanup, flip/reset button, passenger seats that grant no control, speed clamped server-side, and the vehicle tagged so one script services every vehicle. Include the part hierarchy list (what meshes to weld where).";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
