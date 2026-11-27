(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var D = [
["script won't run", "wrong container (Script vs LocalScript) / Disabled checked / error buried in output / WaitForChild hanging / RunContext"],
["nil value error", "child not loaded yet / dot access instead of WaitForChild / server-client timing / spelling"],
["changes not replicating", "editing a client-only copy / change filtered or not set on server / LocalScript touching server-only props / network ownership"],
["datastore not saving", "pcall swallowing the real error / BindToClose not firing in studio / key typo / rate limits / UpdateAsync misuse"],
["animation not playing", "wrong animation priority / needs client for local character / rig mismatch / loaded before character ready"],
["remote not firing", "event name mismatch / wrong parent path / server listener not connected yet / argument type mismatch"],
["teleport fails", "place not published / TeleportAsync context wrong / player not in game yet / no TeleportInitFailed handler"],
["lag / stutter", "loops without task.wait / instances created every frame / unanchored heavy parts / remote flooding"]
];
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "debug"; btn.title = "Common problem walk-throughs";
var p = panel("debug doctor", btn);
D.forEach(function(d){
  var b = document.createElement("button");
  b.className = "dbg";
  var n = document.createElement("b"); n.textContent = d[0];
  var c = document.createElement("span"); c.className = "cause"; c.textContent = d[1];
  b.appendChild(n); b.appendChild(c);
  b.addEventListener("click", function(){
    KODEX.inputEl.value = "My roblox problem: " + d[0] + ". Walk me through the likely causes in order, roblox-specific, then ask me for the exact details you need (output errors, my hierarchy, which script type). Keep it practical.";
    KODEX.inputEl.focus();
    p.classList.add("hidden"); btn.classList.remove("active");
  });
  p.appendChild(b);
});
btn.addEventListener("click", function(){ tog(p, btn); });
strip().appendChild(btn);
})();
