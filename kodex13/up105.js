(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "camera"; btn.title = "Camera modes builder";
var p = panel("camera modes", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "camera behavior, e.g. first/third toggle, aim zoom, no zoom on chat focus";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build camera";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox camera system for a shooter. Behavior: " + t + "\n\nRequirements: camera modes as a config (first person, third person offset, aim zoom FOV), one CameraController that owns CameraType/CameraSubject (no script fights the default controls), smooth transitions with TweenService on FOV and offset, mouse-lock toggle, and camera disabled during UI focus states. Include why RunService.RenderStepped updates live in one binding, not several scripts.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
