(function(){
"use strict";
var c = document.getElementById("composer");
if (!c) return;
var b = document.createElement("button");
b.id = "regen"; b.title = "Regenerate last answer"; b.textContent = "\u21bb";
b.addEventListener("click", function(){
  if (KODEX.state.busy) return;
  KODEX.regenerate();
});
c.insertBefore(b, document.getElementById("send"));
})();
