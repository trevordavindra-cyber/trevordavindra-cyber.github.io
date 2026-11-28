(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "inventory"; btn.title = "Inventory system builder";
var p = panel("inventory builder", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "what players carry, e.g. weapons, ammo, consumables";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build inventory";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox inventory system for: " + t + "\n\nRequirements: server-side inventory as the source of truth, client UI that reads it via a remote snapshot (never trusting client add/remove calls), equip/unequip validated server-side, stack limits + max slots enforced in one module, and a saving hook into the datastore module. Show the item config table format (one entry per item type) and how a new item gets added in one line.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
