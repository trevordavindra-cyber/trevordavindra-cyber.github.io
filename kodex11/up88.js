(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "admin"; btn.title = "Admin / rank permission system builder";
var p = panel("rank system", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "who gets what, e.g. owner-only commands, moderators can kick";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build ranks";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox rank/permission system for my own game. Ranks: " + t + "\n\nRequirements: Permissions module with named levels (owner, admin, mod, player), owner identified by UserId list (never by name alone), admin commands run server-side with the caller's permission checked on the SERVER, a permission-checked remote pattern for every admin action, and an audit log entry (who did what, when) stored to a DataStore. Include the one-line change to grant someone admin.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
