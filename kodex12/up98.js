(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "cmdbar"; btn.title = "Admin command bar builder";
var p = panel("command bar", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "commands wanted, e.g. kick, tp, give, heal, with rank gates";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build commands";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox admin command bar for my own game. Commands: " + t + "\n\nRequirements: a Commands registry (name, args, description, min rank) where each command is one function, argument parsing that survives weird input (quoted names, missing args), rank gate checked server-side against the Permissions module, tab-complete on the client listing only commands the caller's rank allows, and every executed command logged. Include the exact pattern to add a new command in 5 lines.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
