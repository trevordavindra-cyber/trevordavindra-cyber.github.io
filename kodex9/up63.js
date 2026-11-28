(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "cutscene"; btn.title = "Cutscene / camera path builder";
var p = panel("cutscene builder", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "what the cutscene shows, e.g. intro flyover of the map, round-win zoom";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build cutscene";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox cutscene for: " + t + "\n\nRequirements: camera keyframe path defined as a table of {position, time} pairs, camera CFrame interpolated with TweenService (not CameraType spam), a skip button that restores the player's camera instantly, everyone sees it at the same time (broadcast start time), and it never locks the player if the script errors (pcall the whole run). Include the instructions for recording new keyframes in Studio.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
