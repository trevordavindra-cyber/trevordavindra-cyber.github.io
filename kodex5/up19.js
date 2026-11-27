(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
function wrap(btn){
  var p = panel("strict types", btn);
  var ta = document.createElement("textarea");
  ta.className = "tinput";
  ta.placeholder = "paste the script to type";
  p.appendChild(ta);
  var go = document.createElement("button");
  go.className = "tbtn"; go.textContent = "add types";
  go.addEventListener("click", function(){
    var t = ta.value.trim();
    if (!t) return;
    KODEX.inputEl.value = "Rewrite this roblox script with full Luau type annotations so it passes --!strict. Type every parameter, return, and variable. Use optionals only where a value can actually be nil, and say why in one line where a type is tricky:\n\n```lua\n" + t + "\n```";
    KODEX.inputEl.focus();
    ta.value = "";
    p.classList.add("hidden"); btn.classList.remove("active");
  });
  p.appendChild(go);
  btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "strict"; btn.title = "Luau strict typing";
wrap(btn);
strip().appendChild(btn);
})();
