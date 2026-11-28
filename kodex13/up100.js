(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "killfeed"; btn.title = "Kill feed / notification builder";
var p = panel("kill feed", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "feed rules, e.g. show killer + victim + weapon, headshot icon";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build killfeed";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox kill feed system. Rules: " + t + "\n\nRequirements: server emits one Kill event (killer, victim, weapon, headshot) through a remote batched at most 4x/sec, client renders entries that slide in and fade out with a max visible count, team colors from the Teams module, and no feed entry when friendly fire is off. Include why the feed content is derived from one server event instead of each client listening to damage events.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
