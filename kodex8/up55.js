(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "saves"; btn.title = "DataStore module builder";
var p = panel("datastore builder", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "data to save, e.g. kills, coins, owned weapons, settings";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build datastore";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox DataStore module that saves: " + t + "\n\nRequirements: load on join with retries and a default-data merge (new fields fill in without wiping), SaveAsync with retry + pcall, autosave every 2 minutes for online players plus save-on-leave, session-locked style guard so two servers can't write at once, and a Data.Get(plr, key) / Data.Set(plr, key, v) API. Include the one-line instructions for adding a new saved field.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
