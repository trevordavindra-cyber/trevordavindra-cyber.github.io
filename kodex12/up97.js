(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "economy"; btn.title = "Multi-currency economy module builder";
var p = panel("economy module", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "currencies, e.g. coins + gems, earn rules, gem spending";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build economy";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox multi-currency economy module. Currencies: " + t + "\n\nRequirements: one Economy module with Earn(plr, currency, amount, reason) and Spend(plr, currency, amount, reason) as the ONLY paths that touch balances, spend validation server-side with a balance check that cannot race (no double-spend on two fast requests), a transaction log (who, what, when, reason) written to the data layer, negative amounts rejected, and a balance-changed signal for UI. Include the two-line change to add a new currency.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
