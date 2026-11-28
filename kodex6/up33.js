(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var G = [
["Vector3 is immutable", "vec.X = 5 does nothing; you must reassign vec = Vector3.new(...)"],
["setting .Parent last is faster", "build properties first, parent last, saves a reparent per property"],
["Debounce on Touched", "Touched fires many times per contact; debounce or use zone math"],
["Character may be nil", "player.Character can be nil on join/respawn; wait for CharacterAdded"],
["Server sees clones not clients", "client-side visual effects don't replicate; trigger them on both sides"],
["Humanoid.Touched is unreliable", "use hit detection with raycasts or part bounds instead"],
["Destroy vs Parent = nil", "Destroy also disconnects connections; Parent = nil leaves them live"],
["cheap tables not arrays", "table.insert/remove in the middle is O(n); keep arrays gap-free or use a set"]
];
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "gotchas"; btn.title = "Roblox gotchas cheat sheet";
var p = panel("roblox gotchas", btn);
G.forEach(function(g){
  var b = document.createElement("button");
  b.className = "dbg";
  var n = document.createElement("b"); n.textContent = g[0];
  var c = document.createElement("span"); c.className = "cause"; c.textContent = g[1];
  b.appendChild(n); b.appendChild(c);
  b.addEventListener("click", function(){
    KODEX.inputEl.value = "Explain this roblox gotcha with a code example that shows the wrong way and the right way: " + g[0] + ". Point: " + g[1];
    KODEX.inputEl.focus();
    p.classList.add("hidden"); btn.classList.remove("active");
  });
  p.appendChild(b);
});
btn.addEventListener("click", function(){ tog(p, btn); });
strip().appendChild(btn);
})();
