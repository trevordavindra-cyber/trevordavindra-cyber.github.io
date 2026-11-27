(function(){
"use strict";
function scan(){
  document.querySelectorAll(".codeblock .codebar").forEach(function(bar){
    if (bar.querySelector('[data-a="where"]')) return;
    var b = document.createElement("button");
    b.className = "kxbtn"; b.dataset.a = "where"; b.textContent = "where?";
    bar.appendChild(b);
  });
}
document.addEventListener("click", function(e){
  var t = e.target.closest ? e.target.closest('.kxbtn[data-a="where"]') : null;
  if (!t) return;
  var block = t.closest(".codeblock");
  var code = block ? (block.querySelector("code") || {}).textContent || "" : "";
  if (!code.trim()) return;
  KODEX.inputEl.value = "Which container and hierarchy spot does this script go in (Script / LocalScript / ModuleScript)? Name the exact parent (ServerScriptService, StarterPlayerScripts, ReplicatedStorage, inside the Tool, etc.), what it waits on, and whether anything needs a companion script on the other side:\n\n```lua\n" + code + "\n```";
  KODEX.inputEl.focus();
});
if (window.KODEX && KODEX.on) KODEX.on("after", scan);
scan();
})();
