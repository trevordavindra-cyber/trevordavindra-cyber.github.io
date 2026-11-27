(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var S = [
["announcement banner", "server-wide scrolling announcement system, queue, admin-only trigger"],
["spectate mode", "dead players cycle through live players' cameras, arrow buttons, auto-releases on respawn"],
["team switch menu", "GUI to pick a team, server validates, re-spawns on switch"],
["spawn point system", "random spawn points with team filtering and safe-zone timer"],
["round MVP tracker", "track damage and kills per round, announce MVP at round end"],
["respawn delay + loadout", "death screen timer, pick loadout on respawn, server-side grant"],
["hit markers + kill feed ui", "client-side hit marker on confirmed server hits, kill feed entries"],
["vote to kick", "cooldown-protected vote system, threshold to pass, server-side tally"]
];
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "systems"; btn.title = "Server system prompt library";
var p = panel("server systems", btn);
S.forEach(function(s){
  var b = document.createElement("button");
  b.className = "dbg";
  var n = document.createElement("b"); n.textContent = s[0];
  var c = document.createElement("span"); c.className = "cause"; c.textContent = s[1];
  b.appendChild(n); b.appendChild(c);
  b.addEventListener("click", function(){
    KODEX.inputEl.value = "Build a roblox " + s[0] + " system. Requirements: " + s[1] + ". Server-authoritative, mobile-friendly UI, and say exactly where every script goes.";
    KODEX.inputEl.focus();
    p.classList.add("hidden"); btn.classList.remove("active");
  });
  p.appendChild(b);
});
btn.addEventListener("click", function(){ tog(p, btn); });
strip().appendChild(btn);
})();
