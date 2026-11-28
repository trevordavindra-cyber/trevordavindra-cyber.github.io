(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "spectate"; btn.title = "Spectate + death cam builder";
var p = panel("spectate builder", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "cam plan, e.g. death cam follows the killer, then spectate random alive players";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build spectate";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox spectate + death cam system. Plan: " + t + "\n\nRequirements: camera modes (first-person follow, overhead, free) driven by one client camera module, a respawn timer shown while dead, spectate target switching with arrow keys or UI buttons, dead players invisible and non-colliding to the living, and camera ownership restored cleanly on respawn with no orphaned connections. Include the CameraSubject wiring steps.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
