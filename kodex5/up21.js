(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "valid"; btn.title = "Remote validator generator";
var p = panel("remote validator", btn);
var sel = document.createElement("select");
sel.className = "tinput";
[["client asks server to do something (RemoteEvent, client to server)"], ["server updates clients (RemoteEvent, server to client)"], ["client asks and waits for an answer (RemoteFunction)"]].forEach(function(o,i){
  var op = document.createElement("option"); op.value = String(i); op.textContent = o[0];
  sel.appendChild(op);
});
var ta = document.createElement("textarea");
ta.className = "tinput";
ta.placeholder = "what does the remote do + its arguments (e.g. buy item: itemName, price)";
p.appendChild(sel); p.appendChild(ta);
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "generate";
go.addEventListener("click", function(){
  var t = ta.value.trim();
  if (!t) return;
  var kind = sel.value|0;
  KODEX.inputEl.value = "Generate a hardened roblox remote handler. Type: " + sel.options[kind].text + ". Purpose and args: " + t + "\n\nRequirements: validate every argument server-side (type, range, ownership), rate-limit per player, never trust the client, disconnect after the rate limit is blown, and show the matching client-side call.";
  KODEX.inputEl.focus();
  ta.value = "";
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); });
strip().appendChild(btn);
})();
