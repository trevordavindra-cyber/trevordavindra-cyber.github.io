(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "daily"; btn.title = "Daily reward / streak builder";
var p = panel("daily rewards", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "reward rules, e.g. 100 coins day 1, +20% per streak day up to 7";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build rewards";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox daily reward / streak system. Rules: " + t + "\n\nRequirements: last-claim timestamp stored in player data (UTC-based, timezone-safe), a claim check the SERVER performs (client never decides eligibility), streak broken after the grace window, a streak multiplier table in one config, and a claim-safe flow (double request or disconnect mid-claim can never grant twice). Include the UI prompt text hook and a Rewards.Claim(plr) API.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
