(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "tween"; btn.title = "Tween helper builder";
var p = panel("tween helper", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "what should animate, e.g. door opens when touched, chest lid, rising platform, UI slide-in";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build tween";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox tween helper for: " + t + "\n\nRequirements: TweenService with a named easing helper table (linear, quad, back, elastic), a Tween module with Play/Stop/Cancel, one reusable function instead of copy-pasted tweens, cancel-on-repeat so a spam trigger can't stack tweens, and server-side for world parts or client-side for UI (say which and why). Give the script and where it goes.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
