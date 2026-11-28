(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var V = [
["(a - b).Magnitude", "distance between two positions; the base of every range check"],
["(b - a).Unit", "a direction vector of length 1; multiply by speed to move something toward a point"],
["a:Dot(b)", "1 = same direction, 0 = perpendicular; the cheap way to test 'is the target in front of me'"],
["a:Cross(b)", "perpendicular axis; tells you left vs right, the base of aim-relative detection"],
["lerp", "Vector3:Lerp(a, t) blends two points; t is 0-1, great for smooth movement"],
["world vs local", "world space is map coordinates; object space is relative to a part; convert with ToWorldSpace"],
["raycast direction", "direction is a vector, not a position: cast (target - origin).Unit * range"],
["mag trick", "magnitude checks are cheaper than raycasts; range-check first, raycast only what's in range"]
];
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "vector"; btn.title = "Vector math cheat sheet";
var p = panel("vector math", btn);
V.forEach(function(v){
  var b = document.createElement("button");
  b.className = "dbg";
  var n = document.createElement("b"); n.textContent = v[0];
  var c = document.createElement("span"); c.className = "cause"; c.textContent = v[1];
  b.appendChild(n); b.appendChild(c);
  b.addEventListener("click", function(){
    KODEX.inputEl.value = "Explain this roblox vector math trick with a code example in a shooter context: " + v[0] + ". Point: " + v[1];
    KODEX.inputEl.focus();
    p.classList.add("hidden"); btn.classList.remove("active");
  });
  p.appendChild(b);
});
btn.addEventListener("click", function(){ tog(p, btn); });
strip().appendChild(btn);
})();
