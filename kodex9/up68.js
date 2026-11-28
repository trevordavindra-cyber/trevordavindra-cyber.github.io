(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var U = [
["tween part", "one TweenService shorthand: U.tween(inst, 0.3, {Transparency = 1}) with easing built in"],
["signal", "a tiny custom Signal class so modules don't need RemoteEvents to talk to each other"],
["deep copy", "table deep copy that handles nested tables and skips metatables safely"],
["table find", "a fast Table.Find(t, value) + Table.Match(t, predicate) pair"],
["lerp", "number + Vector3 + Color3 lerp helpers with one consistent API"],
["async retry", "a retry(fn, attempts, delay) wrapper for anything network (DataStore, MarketplaceService)"],
["debounce", "a per-key debounce helper for cooldowns (per player, per action)"],
["round", "math rounding to steps: U.round(n, step) for grid snapping and currency"],
["safecall", "pcall wrapper that logs the error loudly instead of swallowing it silently"]
];
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "utils"; btn.title = "Utility module builder";
var p = panel("utility module", btn);
U.forEach(function(u){
  var b = document.createElement("button");
  b.className = "dbg";
  var n = document.createElement("b"); n.textContent = u[0];
  var c = document.createElement("span"); c.className = "cause"; c.textContent = u[1];
  b.appendChild(n); b.appendChild(c);
  b.addEventListener("click", function(){
    KODEX.inputEl.value = "Add this utility to a roblox Utils ModuleScript and show a usage example: " + u[0] + ". Point: " + u[1];
    KODEX.inputEl.focus();
    p.classList.add("hidden"); btn.classList.remove("active");
  });
  p.appendChild(b);
});
btn.addEventListener("click", function(){ tog(p, btn); });
strip().appendChild(btn);
})();
