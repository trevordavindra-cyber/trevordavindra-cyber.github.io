(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "abil"; btn.title = "Ability + cooldown builder";
var p = panel("ability builder", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "abilities wanted, e.g. dash, double jump, shield";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build abilities";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox ability system for: " + t + "\n\nRequirements: an AbilityServer module with per-player per-ability cooldowns (server is the cooldown authority), activation validated on activation keydown from the client, an AbilityClient that handles input + shows a cooldown bar UI, and a config table (one entry per ability: keybind, cooldown, effect). Show how to add a new ability in one config entry plus one effect function.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
