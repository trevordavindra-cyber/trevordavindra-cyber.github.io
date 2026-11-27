(function(){
"use strict";
var f = document.getElementById("composer");
if (!f || !f.parentNode) return;
var bar = document.createElement("div");
bar.id = "chipsbar";
f.parentNode.insertBefore(bar, f);
var prompts = [
  "leaderstats + global leaderboard, full scripts",
  "datastore module with session locking",
  "server-sided shop with sanity checks",
  "harden my remote events",
  "round-based game loop skeleton",
  "paste your error and i'll fix it"
];
prompts.forEach(function(p){
  var c = document.createElement("button");
  c.className = "chip"; c.textContent = p;
  c.addEventListener("click", function(){
    KODEX.inputEl.value = p;
    KODEX.inputEl.focus();
  });
  bar.appendChild(c);
});
})();
