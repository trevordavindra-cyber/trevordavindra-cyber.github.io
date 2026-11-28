(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "ping"; btn.title = "Ping + rate limit helper";
var p = panel("ping + rate limiter", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "optional: which remotes need rate limiting";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build helper";
go.addEventListener("click", function(){
  var t = ta.value.trim() || "every combat remote";
  KODEX.inputEl.value = "Build a roblox ping + rate limit helper module. Requirements: client ping measured via a RemoteFunction round trip shown as ms on a small TextLabel, server-side RateLimiter module (per player, per action, sliding window) with a RateLimit.Check(plr, action) call, kick-or-ignore policy choice, and the remotes to guard: " + t + ". Include how to test it with the Test tab's simulated players.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
