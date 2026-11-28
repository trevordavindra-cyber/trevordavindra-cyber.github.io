(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "equip"; btn.title = "Equipment / hotbar equip system builder";
var p = panel("hotbar system", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "hotbar rules, e.g. 5 slots, number keys, weapons re-equip on respawn";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build hotbar";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox hotbar/equip system. Rules: " + t + "\n\nRequirements: server holds the loadout (source of truth), client renders slots and requests Equip(slot), server validates the slot belongs to that player before moving the Tool to their character, number-key + click bindings client-side, unequip the previous tool atomically (no two held tools), and re-equip after respawn from the loadout module. Include the one-line change to add a slot and why the client never moves Tools directly.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
