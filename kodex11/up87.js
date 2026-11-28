(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "migrate"; btn.title = "Data migration helper builder";
var p = panel("data migration", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "what changed, e.g. coins renamed to cash, kills moved under stats";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build migration";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox data migration helper. Change: " + t + "\n\nRequirements: a SchemaVersion integer saved with player data, an ordered MIGRATIONS table where each entry upgrades exactly one version (old -> new field names, defaults for missing fields), migrations run on load before anything reads the data, a never-downgrade rule, and a dry-run print mode showing what would change. Include how to ship a rename safely when half the player base hasn't logged in since the update.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
