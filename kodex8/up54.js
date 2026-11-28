(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var F = [
["attempt to index nil with 'X'", "the thing before the dot doesn't exist yet; add a nil check or WaitForChild"],
["Infinite yield possible on WaitForChild", "the name never appears; check spelling, parent path, and who's supposed to create it"],
["attempt to call a nil value", "a function name is misspelled or the module wasn't required before the call"],
["Unable to assign property X", "wrong type passed (string where number, etc.); print type(variable) to catch it"],
["Argument 1 missing or nil", "a callback or event fired with fewer args than expected; guard each parameter"],
["Requested module experienced an error while loading", "the ModuleScript itself errored on require; read the error above it"],
["DataStore request was added to queue", "you're calling the store too often; batch writes and keep a save loop, not per-change saves"],
["Script timeout: exhausted allowed execution time", "an infinite loop without yield, or a huge loop; add task.wait() inside long loops"]
];
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "fixes"; btn.title = "Common error fixes cheat sheet";
var p = panel("common errors, real fixes", btn);
F.forEach(function(f){
  var b = document.createElement("button");
  b.className = "dbg";
  var n = document.createElement("b"); n.textContent = f[0];
  var c = document.createElement("span"); c.className = "cause"; c.textContent = f[1];
  b.appendChild(n); b.appendChild(c);
  b.addEventListener("click", function(){
    KODEX.inputEl.value = "I got this roblox error: " + f[0] + ". Explain what it means, the usual causes, and give a small before/after code example that fixes it. Known quick answer: " + f[1];
    KODEX.inputEl.focus();
    p.classList.add("hidden"); btn.classList.remove("active");
  });
  p.appendChild(b);
});
btn.addEventListener("click", function(){ tog(p, btn); });
strip().appendChild(btn);
})();
