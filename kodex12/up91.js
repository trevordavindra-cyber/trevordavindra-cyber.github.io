(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "match"; btn.title = "Matchmaking / team balance builder";
var p = panel("team balance", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "balancing rules, e.g. split by wins, party stays together";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build balance";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox team balancing system for a round-based shooter. Rules: " + t + "\n\nRequirements: score-based snake draft assignment at round start, parties queued together land on the same team when it does not break balance by more than one, mid-round joiner assignment (server assigns, never the player), a Rebalance signal teams listen to, and stats pulled from the leaderboard module. Include what happens when a team dips below the minimum mid-round.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
