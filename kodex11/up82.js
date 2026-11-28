(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "clan"; btn.title = "Clan / group tag builder";
var p = panel("clan tags", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "tag rules, e.g. show group name above head, rank 200+ gets color";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build tags";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox clan/group tag system. Rules: " + t + "\n\nRequirements: GetRankInGroup fetched once on join with pcall (players not in the group handled), a BillboardGui above the head showing clan name + rank color, tag hidden for players without a group, updating only on join (no per-frame checks), and a Clan.Get(plr) API other scripts import. Include the one-line change to add a new rank color.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
