(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "stats"; btn.title = "Stat tracker module";
var p = panel("stat tracker", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "stats, e.g. kills, deaths, coins, level, xp";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build module";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox stat tracker module for these stats: " + t + "\n\nRequirements: leaderstats auto-created on join, one server API: Stats.Add(plr, name, n), Stats.Get(plr, name), Stats.Set(plr, name, v), a changed event other scripts can hook, client read-only via RemoteEvent mirror, and hooks ready to connect to a datastore save. Show usage examples for a kill script and a coin pickup.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
