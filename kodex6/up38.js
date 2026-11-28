(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var F = [
["publish the game", "File > Publish to Roblox, name it, then Game Settings > Permissions set to Public"],
["test with fake players", "Test tab > Clients and Servers, pick 2 players, Start — a local server opens with real windows"],
["find script errors", "View > Output. Red = error, orange = warn. Infinite yield warnings mean a WaitForChild name is wrong"],
["add a script to a tool", "open the Tool in Explorer, right-click > Insert Object > Script (server) or LocalScript (input/effects)"],
["fix infinite yield", "the name in WaitForChild doesn't exist yet or is misspelled; check Explorer spelling and where the object parents"],
["team test properly", "use Clients and Servers, not Play Solo, whenever remotes or replication are involved"],
["add gamepass perks", "create the pass on the roblox website, then MarketplaceService:UserOwnsGamePassAsync in a server script"],
["stop a stuck script", "play, then in Output note the last printed line; add print checkpoints to find where it stops"]
];
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "studio"; btn.title = "Studio workflow how-tos";
var p = panel("studio how-tos", btn);
F.forEach(function(f){
  var b = document.createElement("button");
  b.className = "dbg";
  var n = document.createElement("b"); n.textContent = f[0];
  var c = document.createElement("span"); c.className = "cause"; c.textContent = f[1];
  b.appendChild(n); b.appendChild(c);
  b.addEventListener("click", function(){
    KODEX.inputEl.value = "Walk me through this roblox studio task step by step, phone-friendly wording: " + f[0] + ". Context: " + f[1] + ". Add the one mistake beginners make here.";
    KODEX.inputEl.focus();
    p.classList.add("hidden"); btn.classList.remove("active");
  });
  p.appendChild(b);
});
btn.addEventListener("click", function(){ tog(p, btn); });
strip().appendChild(btn);
})();
