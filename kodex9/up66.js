(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "level"; btn.title = "Level / XP system builder";
var p = panel("level system", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "what levels track, e.g. combat XP from kills, level-up rewards";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build levels";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox level/XP system. XP from: " + t + "\n\nRequirements: XP curve defined by one formula (no giant level table needed), leaderstats showing Level + XP progress to next level, a LevelUp signal + reward hook other scripts connect to, anti-duplicate XP awarding (one award per verified action), and save/load wired to the datastore module. Include a quick formula example with numbers so I can see the pacing at levels 1, 10, 50.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
