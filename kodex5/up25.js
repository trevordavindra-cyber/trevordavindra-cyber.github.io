(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var I = [
["pairs vs ipairs", "when each matters, and the zero-gap array rule"],
["task.wait vs wait vs RunService", "which to use where, and why wait() is legacy"],
["pcall / xpcall", "wrapping datastore and remote code the right way"],
["OOP with setmetatable", "the standard Class.new / Class.__index pattern"],
["string.format vs .. concat", "when each reads better and interpolating strings"],
["debounce patterns", "simple boolean, last-fired timestamp, and per-player debounce"],
["module require caching", "why require runs once per server, and state shared across callers"],
["connection cleanup", "Disconnect on destroy, CharacterAdded re-hook patterns, no leaks"]
];
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "idioms"; btn.title = "Luau idioms cheat sheet";
var p = panel("luau idioms", btn);
I.forEach(function(x){
  var b = document.createElement("button");
  b.className = "dbg";
  var n = document.createElement("b"); n.textContent = x[0];
  var c = document.createElement("span"); c.className = "cause"; c.textContent = x[1];
  b.appendChild(n); b.appendChild(c);
  b.addEventListener("click", function(){
    KODEX.inputEl.value = "Explain this luau idiom with two roblox examples: " + x[0] + ". Point: " + x[1] + ". Show the wrong way first, then the right way.";
    KODEX.inputEl.focus();
    p.classList.add("hidden"); btn.classList.remove("active");
  });
  p.appendChild(b);
});
btn.addEventListener("click", function(){ tog(p, btn); });
strip().appendChild(btn);
})();
