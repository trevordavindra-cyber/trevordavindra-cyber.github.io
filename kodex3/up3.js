(function(){
"use strict";
var LS = "kodexsessions_v3";
function load(){ try { return JSON.parse(localStorage.getItem(LS) || "[]"); } catch(e){ return []; } }
function save(s){ try { localStorage.setItem(LS, JSON.stringify(s)); } catch(e){} }
function currentId(){ return localStorage.getItem("kodexcur") || ""; }
function titleOf(sess){
  if (sess.title) return sess.title;
  var h = sess.history || [];
  for (var i=0;i<h.length;i++){ if (h[i].role === "user") return h[i].content.slice(0, 26) || "chat"; }
  return "new chat";
}
function upsertCurrent(){
  var id = currentId(); if (!id) return;
  var s = load();
  var found = null;
  for (var i=0;i<s.length;i++){ if (s[i].id === id) found = s[i]; }
  var snap = JSON.parse(JSON.stringify(KODEX.getHistory().slice(-80)));
  if (found){ found.history = snap; found.ts = Date.now(); }
  else { s.push({ id: id, history: snap, ts: Date.now() }); }
  save(s);
}
var topbar = document.getElementById("topbar");
if (!topbar) return;
var bar = document.createElement("div");
bar.id = "sessionbar";
topbar.parentNode.insertBefore(bar, topbar.nextSibling);
function paint(){
  var s = load();
  var cur = currentId();
  bar.innerHTML = "";
  var nb = document.createElement("button");
  nb.className = "schip newbtn";
  nb.textContent = "+ new chat";
  nb.addEventListener("click", newSession);
  bar.appendChild(nb);
  s.slice(-12).forEach(function(sess){
    var b = document.createElement("button");
    b.className = "schip" + (sess.id === cur ? " active" : "");
    b.textContent = titleOf(sess);
    b.title = "double-tap to rename";
    b.addEventListener("dblclick", function(e){
      e.preventDefault();
      var n = prompt("rename chat", titleOf(sess));
      if (n && n.trim()){ sess.title = n.trim(); save(s); paint(); }
    });
    var x = document.createElement("span");
    x.className = "x"; x.textContent = "\u2715";
    x.addEventListener("click", function(e){
      e.stopPropagation();
      var s2 = load().filter(function(z){ return z.id !== sess.id; });
      save(s2);
      if (sess.id === currentId()){
        if (s2.length){ localStorage.setItem("kodexcur", s2[s2.length-1].id); KODEX.setHistory(s2[s2.length-1].history || []); }
        else { localStorage.removeItem("kodexcur"); KODEX.setHistory([{role:"assistant", content:"new chat. what are we building?", ts: Date.now()}]); }
      }
      paint();
    });
    b.appendChild(x);
    b.addEventListener("click", function(){
      if (currentId() === sess.id) return;
      upsertCurrent();
      localStorage.setItem("kodexcur", sess.id);
      KODEX.setHistory(sess.history || []);
      paint();
    });
    bar.appendChild(b);
  });
}
function newSession(){
  upsertCurrent();
  var id = "s" + Date.now();
  var seed = [{role:"assistant", content:"new chat. what are we building?", ts: Date.now()}];
  save(load().concat([{ id: id, history: seed, ts: Date.now() }]));
  localStorage.setItem("kodexcur", id);
  KODEX.setHistory(seed);
  paint();
}
if (!currentId()){
  localStorage.setItem("kodexcur", "s1");
  save(load().concat([{ id: "s1", history: JSON.parse(JSON.stringify(KODEX.getHistory().slice(-80))), ts: Date.now() }]));
}
paint();
KODEX.on("after", function(){ upsertCurrent(); });
document.addEventListener("click", function(e){
  if (!e.target.closest(".copybtn") && !e.target.closest(".chip") && !e.target.closest(".kxbtn") && !e.target.closest(".schip")) upsertCurrent();
}, true);
})();
