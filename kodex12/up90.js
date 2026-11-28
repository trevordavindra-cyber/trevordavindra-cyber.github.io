(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "crates"; btn.title = "Loot crate / box opener builder";
var p = panel("loot crates", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "crate rules, e.g. common/rare/legendary tiers, no dupes at legendary";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build crates";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox loot crate system. Rules: " + t + "\n\nRequirements: rarity table with weights in one config, the roll happens on the SERVER with math.random and the result committed to inventory BEFORE the client plays the reveal animation, a pity/dupe-protection rule if stated, crate purchase validated against the shop module, and a Crates.Open(plr, crateId) API that returns the item. Include the exploit note: why the client only ever requests, never reports the result.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
