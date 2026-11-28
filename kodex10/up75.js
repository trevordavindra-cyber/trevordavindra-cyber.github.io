(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "flash"; btn.title = "Screen effects builder (fade, vignette, flash)";
var p = panel("screen effects", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "effects wanted, e.g. damage flash, death fade, low-hp vignette pulse";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build effects";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox client screen-effects system for: " + t + "\n\nRequirements: one ScreenGui layer ordered over the whole HUD, each effect a function (fadeIn, damageFlash, vignettePulse, blur) built on TweenService with no frame-stepping, effects driven by client-side signals (Humanoid.Health, hit events), and a ScreenFx.Play(effect, intensity) API. Include the exact tween properties and why Blur on Lighting is the only server-adjacent piece.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
