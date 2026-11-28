(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var C = [
["CFrame.lookAt", "points a part toward a target; the front face is -Z, so attachments and barrels must match"],
["ToWorldSpace / ToObjectSpace", "converts offsets between world and part-local space; use for attachments relative to a moving part"],
["CFrame:Lerp", "smooth blend between two CFrames, great for camera and animated holds"],
["Multiply vs addition", "cf * CFrame.new(0,1,0) moves in the part's own up direction, not the world's"],
["CFrame.Angles", "rotation in radians, order matters; build rotations step by step instead of one huge angle"],
["PivotTo", "moves a whole model including welded parts; MoveTo only moves the primary part"],
["GetPivot", "reads a model's pivot; never assume a model's position from its first part"],
["pivoting a character", "teleport with character:PivotTo(cframe) and reset velocity, or physics drags them back"]
];
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "cframe"; btn.title = "CFrame helper cheat sheet";
var p = panel("cframe helpers", btn);
C.forEach(function(c){
  var b = document.createElement("button");
  b.className = "dbg";
  var n = document.createElement("b"); n.textContent = c[0];
  var cc = document.createElement("span"); cc.className = "cause"; cc.textContent = c[1];
  b.appendChild(n); b.appendChild(cc);
  b.addEventListener("click", function(){
    KODEX.inputEl.value = "Explain the roblox CFrame feature " + c[0] + " with a code example a beginner can paste and see working, plus the one thing that trips people up: " + c[1];
    KODEX.inputEl.focus();
    p.classList.add("hidden"); btn.classList.remove("active");
  });
  p.appendChild(b);
});
btn.addEventListener("click", function(){ tog(p, btn); });
strip().appendChild(btn);
})();
