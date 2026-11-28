(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "emotes"; btn.title = "Emote / gesture system builder";
var p = panel("emote system", btn);
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "emotes wanted, e.g. dance wheel on G, emotes cancel on damage";
p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "build emotes";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  KODEX.inputEl.value = "Build a roblox emote/gesture system. Rules: " + t + "\n\nRequirements: emote list as a config (name, animation id, duration), client loads AnimationTrack from the character's Humanoid Animator and the server never trusts the client's animation request (visual only), emote cancelled by damage/weapon draw/movement, one emote at a time with a stop-all safety, and a key or wheel binding. Include why animations fire client-side for the local player and replicate, and what MUST still be server-side.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); ta.focus(); });
strip().appendChild(btn);
})();
