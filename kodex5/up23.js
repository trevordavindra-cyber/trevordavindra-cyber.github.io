(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "anim"; btn.title = "Animation state machine builder";
var p = panel("animation state machine", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "your animation ids, e.g. idle rbxassetid://..., run ..., attack ... (leave blank for placeholders)";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build machine";
go.addEventListener("click", function(){
  var t = ta.value.trim() || "(I will fill in ids later)";
  KODEX.inputEl.value = "Build a clean roblox animation state machine for my character. States: idle, walk, run, jump, fall, land, attack, reload. Rules: proper crossfade between states, no overlapping loops, correct animation priorities, mid-air states handled, land fires once, and the whole thing lives client-side on the local character. My animation ids:\n" + t + "\n\nGive the full LocalScript and say exactly where it goes.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
