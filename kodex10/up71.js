(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "recoil"; btn.title = "Recoil + spread system builder";
var p = panel("recoil builder", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "which weapons, e.g. rifle recoil pattern, shotgun wide spread";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build recoil";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox recoil + spread system for: " + t + "\n\nRequirements: per-weapon config (base spread, spread growth per shot, recovery rate, recoil kick camera angle), spread applied identically for every player (same rules for everyone, server-checked direction), camera kick done in the client camera script with a spring back, and a spread cone visualization debug flag. Include the config table with numbers tuned for a fast shooter.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
