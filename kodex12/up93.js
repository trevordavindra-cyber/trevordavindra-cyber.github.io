(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "vote"; btn.title = "In-game voting system builder";
var p = panel("voting system", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "what gets voted, e.g. next map, kick a griefer";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build vote";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox in-game voting system for: " + t + "\n\nRequirements: vote state held server-side (one vote per player, changeable until close, tallied at close with a deterministic tie-break), vote buttons shown client-side but the ballot counted only from the server-checked remote, rate limits (no vote spam), a VoteClosed signal with the winning option, and a Voted(plr, option) hook for logging. Include how a mid-round restart of the vote avoids double-counting.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
