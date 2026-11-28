(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "fx"; btn.title = "Effects system builder";
var p = panel("effects builder", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "effects wanted, e.g. muzzle flash, hit marker, teleport beam, blood puff";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build fx";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox effects system for: " + t + "\n\nRequirements: an FX module with one spawn call per effect, ParticleEmitter + Beam setup instructions (which part to parent, which properties), effects cleaned up automatically after their lifetime with Debris, a client-render note so heavy particles don't run on the server, and how to hook each effect into an event so combat code stays readable.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
