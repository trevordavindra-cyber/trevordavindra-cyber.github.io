(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "bans"; btn.title = "Ban / moderation system builder";
var p = panel("ban system", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "ban rules, e.g. temp bans 1d/7d, reason logged, alt check";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build bans";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox ban/moderation system. Rules: " + t + "\n\nRequirements: bans stored in a DataStore keyed by UserId with expiry timestamp + reason + moderator, a join-time gate that kicks with a readable reason screen before any data loads, temp-ban countdown shown on the kick screen, an appeal note field, and an alt-account hook (same key compared on join). Include why the ban check runs before the datastore loads player data, not after.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
