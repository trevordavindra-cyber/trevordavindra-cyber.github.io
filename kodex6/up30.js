(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var KINDS = [
["hitscan gun (raycast)", "client raycasts and sends the hit instance + position; server re-raycasts from the muzzle, checks range and fire rate, applies damage"],
["melee / sword", "box cast or magnitude check around the blade, hit once per swing, server-side validation of swing timing"],
["projectile (rocket, grenade)", "server-created projectile or client-fired with server speed check, splash damage with falloff"],
["explosion", "GetPartBoundsInRadius hit collection, falloff curve, team damage option, part destruction optional"]
];
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "hitbox"; btn.title = "Hit detection builder";
var p = panel("hit detection builder", btn);
var sel = document.createElement("select"); sel.className = "tinput";
KINDS.forEach(function(k,i){ var o = document.createElement("option"); o.value = String(i); o.textContent = k[0]; sel.appendChild(o); });
var ta = document.createElement("textarea"); ta.className = "tinput"; ta.placeholder = "damage, range, fire rate... (optional)";
p.appendChild(sel); p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build";
go.addEventListener("click", function(){
  var k = KINDS[sel.value|0];
  KODEX.inputEl.value = "Build server-validated hit detection for a roblox " + k[0] + ". Requirements: " + k[1] + ". Stats: " + (ta.value.trim() || "pick sensible defaults and list them") + ".\n\nAnti-exploit rules: client sends only its aim, server checks every claim, rate limit per player. Give the client script, the server script, where each goes, and a RemoteEvent setup.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); });
strip().appendChild(btn);
})();
