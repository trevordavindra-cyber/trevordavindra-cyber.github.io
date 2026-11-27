(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "log"; btn.title = "Paste studio output, get fixes in order";
var p = panel("output log fixer", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.style.minHeight = "110px";
ta.placeholder = "paste the whole studio output block";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "fix in order";
go.addEventListener("click", function(){
  var lines = ta.value.split("\n").map(function(l){ return l.trim(); }).filter(function(l){ return l.length; });
  if (!lines.length) return;
  var numbered = lines.map(function(l, i){ return (i + 1) + ". " + l; }).join("\n");
  KODEX.inputEl.value = "These are my roblox studio output errors, in order. Fix each one and give the corrected code per error:\n\n" + numbered;
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
