(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "hud"; btn.title = "HUD / UI framework builder";
var p = panel("hud builder", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "hud elements, e.g. health bar, ammo counter, kill feed slot, minimap";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build hud";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox HUD system. Elements: " + t + "\n\nRequirements: HUD built once in code (no studio GUI tree), values driven by signals from the stats and inventory modules (never polling every frame), one ScaleController so it looks right on phone and desktop with UIAspectRatioConstraints, health/ammo updates batched so no more than 30 property writes/sec, and a HideHud(state) hook for cutscenes and the spectate module. Include the update-on-signal pattern for the ammo counter as a 10-line example.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
