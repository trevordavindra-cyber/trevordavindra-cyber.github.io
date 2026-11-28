(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var E = [
["PlayerAdded / PlayerRemoving", "runs on the server when a player joins/leaves; load and save data here"],
["CharacterAdded", "per-spawn setup: give tools, set health, position spawn logic"],
["Touched", "part contact, fires a lot per touch, needs debounce; never trust it for damage alone"],
["RemoteEvent.OnServerEvent", "server listens for client calls; validate player, args, and rate here"],
["RunService.Heartbeat", "every frame on the client, physics step on server; per-frame loops go here, never while true do wait()"],
["RunService.RenderStepped", "client only, every rendered frame; camera and visual effects only, no physics"],
["Humanoid.Died", "respawn handling, kill credit, death effects"],
["CollectionService:GetInstanceAddedSignal", "tag-based events: attach behavior to anything with a tag, no loops needed"]
];
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "events"; btn.title = "Roblox events cheat sheet";
var p = panel("events cheat sheet", btn);
E.forEach(function(ev){
  var b = document.createElement("button");
  b.className = "dbg";
  var n = document.createElement("b"); n.textContent = ev[0];
  var c = document.createElement("span"); c.className = "cause"; c.textContent = ev[1];
  b.appendChild(n); b.appendChild(c);
  b.addEventListener("click", function(){
    KODEX.inputEl.value = "Explain the roblox event " + ev[0] + " with a real code example: when it fires, what it passes, the one mistake people make with it, and a server vs client note. Point: " + ev[1];
    KODEX.inputEl.focus();
    p.classList.add("hidden"); btn.classList.remove("active");
  });
  p.appendChild(b);
});
btn.addEventListener("click", function(){ tog(p, btn); });
strip().appendChild(btn);
})();
