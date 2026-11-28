(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "devprod"; btn.title = "Developer product purchase builder";
var p = panel("dev product builder", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "products, e.g. 1000 coins pack, weapon crate, instant respawn";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build products";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox developer product system for: " + t + "\n\nRequirements: ProcessReceipt that records the purchase receipt to a DataStore BEFORE granting (so a duplicate receipt never double-grants), a purchase prompt helper callable from UI buttons, per-product grant functions in one config table, and the difference from gamepasses explained in two lines (products are consumable/repeatable). Include the receipt idempotency pattern written out.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
