(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "diff"; btn.title = "Compare two script versions";
var p = panel("version diff", btn);
var a = document.createElement("textarea"); a.className = "tinput"; a.placeholder = "version A";
var b = document.createElement("textarea"); b.className = "tinput"; b.placeholder = "version B";
p.appendChild(a); p.appendChild(b);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "compare";
go.addEventListener("click", function(){
  var ta = a.value.trim(), tb = b.value.trim();
  if (!ta || !tb) return;
  KODEX.inputEl.value = "Two versions of my roblox script below. List the differences, say which is safer and faster and why, then give one merged best version.\n\nVersion A:\n```lua\n" + ta + "\n```\n\nVersion B:\n```lua\n" + tb + "\n```";
  KODEX.inputEl.focus();
  a.value = ""; b.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); a.focus(); });
strip().appendChild(btn);
})();
