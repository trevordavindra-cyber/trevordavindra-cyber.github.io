(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var TIPS = [
["loops with no wait", "a for/while loop with no task.wait freezes the whole server"],
["FindFirstChild in hot loops", "cache the reference once, look it up again only after respawn"],
["wait() everywhere", "wait() is the legacy scheduler, task.wait() is the fast one"],
["remote per frame", "batch data into one remote call per interval, never per frame"],
["instance.new in loops", "build reusable templates and Clone() them instead"],
["unanchored heavy parts", "anchor what doesn't move, huge physics cost saved"],
["memory leaks", "connections never disconnected on respawn/despawn pile up forever"],
["humanoid:MoveTo spam", "call it once per waypoint, wait for MoveToFinished"]
];
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "perf"; btn.title = "Performance doctor";
var p = panel("performance doctor", btn);
TIPS.forEach(function(t){
  var b = document.createElement("button");
  b.className = "dbg";
  var n = document.createElement("b"); n.textContent = t[0];
  var c = document.createElement("span"); c.className = "cause"; c.textContent = t[1];
  b.appendChild(n); b.appendChild(c);
  p.appendChild(b);
});
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "paste the slow script (optional)";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "optimize";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  var base = "My roblox game has performance problems. Name the top 3 hotspots to look for in a shooter and the exact fix for each.";
  if (t) base += " Then optimize this script, keeping behavior identical:\n\n```lua\n" + t + "\n```";
  KODEX.inputEl.value = base;
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); });
strip().appendChild(btn);
})();
