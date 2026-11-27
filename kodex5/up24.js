(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var FIELDS = [["damage", "20"], ["fire rate /sec", "5"], ["mag size", "30"], ["reload sec", "2"], ["range studs", "300"]];
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "balance"; btn.title = "Gun stats balancer";
var p = panel("gun balance check", btn);
var inputs = [];
FIELDS.forEach(function(f){
  var i = document.createElement("input");
  i.className = "tinput"; i.placeholder = f[0]; i.value = f[1];
  p.appendChild(i); inputs.push(i);
});
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "check balance";
go.addEventListener("click", function(){
  var parts = FIELDS.map(function(f, i){ return f[0] + ": " + (inputs[i].value.trim() || f[1]); });
  KODEX.inputEl.value = "Here are my gun stats: " + parts.join(", ") + ".\n\nCompare against typical roblox shooter balance: compute time-to-kill, flag anything way too strong or too weak for a fair mobile-friendly shooter, suggest adjusted numbers, and explain each change in one line. Keep it fun, not punishing.";
  KODEX.inputEl.focus();
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); });
strip().appendChild(btn);
})();
