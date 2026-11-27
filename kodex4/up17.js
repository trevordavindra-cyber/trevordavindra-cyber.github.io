(function(){
"use strict";
function scan(){
  document.querySelectorAll(".codeblock .codebar").forEach(function(bar){
    if (bar.querySelector('[data-a="audit"]')) return;
    var b = document.createElement("button");
    b.className = "kxbtn"; b.dataset.a = "audit"; b.textContent = "audit";
    bar.appendChild(b);
  });
}
document.addEventListener("click", function(e){
  var t = e.target.closest ? e.target.closest('.kxbtn[data-a="audit"]') : null;
  if (!t) return;
  var block = t.closest(".codeblock");
  var code = block ? (block.querySelector("code") || {}).textContent || "" : "";
  if (!code.trim()) return;
  KODEX.inputEl.value = "Audit this roblox script. Say which side it belongs on (Script / LocalScript / ModuleScript), flag anything a player can abuse (arguments trusted from the client, damage or currency granted without server checks, rate limits missing), and return the hardened version:\n\n```lua\n" + code + "\n```";
  KODEX.inputEl.focus();
});
if (window.KODEX && KODEX.on) KODEX.on("after", scan);
scan();
})();
