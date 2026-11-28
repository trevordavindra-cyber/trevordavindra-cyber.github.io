(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "move"; btn.title = "Movement controller builder";
var p = panel("movement controller", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "movement wanted, e.g. sprint on shift, crouch, slide, wall jump";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build movement";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox movement controller for: " + t + "\n\nRequirements: client-side speed changes with WalkSpeed/JumpPower tuned to feel good, a server sanity check that clamps impossible speeds (anti-speed-hack), sprint stamina if asked, FOV + camera shake feedback while sprinting, and a Movement state table other scripts can read (isSprinting, isCrouching). Include exact default values for a shooter-style game so it feels snappy.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
