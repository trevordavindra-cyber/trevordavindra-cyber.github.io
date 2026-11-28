(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "revive"; btn.title = "Revive / second-chance system builder";
var p = panel("revive system", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "revive rules, e.g. teammate hold-to-revive 3s, once per round";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build revive";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox revive/second-chance system. Rules: " + t + "\n\nRequirements: downed state (Health set low, movement disabled) instead of instant death, a downed timer that converts to death if nobody revives, hold-to-revive with progress bar client-side and hold validation server-side, one revive per player per round, and a Revived signal the stats API listens to. Include how the downed character is made non-collidable to enemies but visible.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
