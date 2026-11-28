(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "anticheat"; btn.title = "Anti-cheat sanity check generator";
var p = panel("sanity checks", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "what to guard, e.g. walkspeed, teleport, fly, fire-rate";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build checks";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Generate server-authoritative sanity checks for a roblox shooter. Guards: " + t + "\n\nRequirements: one Sanity module, each check a small function comparing observed server-side state against tolerances (position delta per tick with lag allowance, speed vs walkspeed, fire interval vs weapon cooldown), violations scored not insta-kicked (3 strikes), and every check running server-side only. Include the false-positive list (lag spikes, physics glitches) and the tolerance each needs. No client-side-only checks.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
