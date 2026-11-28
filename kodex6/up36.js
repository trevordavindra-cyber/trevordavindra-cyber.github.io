(function(){
"use strict";
function scan(){
  document.querySelectorAll(".codeblock .codebar").forEach(function(bar){
    if (bar.querySelector('[data-a="convert"]')) return;
    var b = document.createElement("button");
    b.className = "kxbtn"; b.dataset.a = "convert"; b.textContent = "convert";
    bar.appendChild(b);
  });
}
document.addEventListener("click", function(e){
  var t = e.target.closest ? e.target.closest('.kxbtn[data-a="convert"]') : null;
  if (!t) return;
  var block = t.closest(".codeblock");
  var code = block ? (block.querySelector("code") || {}).textContent || "" : "";
  if (!code.trim()) return;
  KODEX.inputEl.value = "Convert this roblox script across the server/client boundary the smart way: keep the real logic in a ModuleScript, add a thin Script and/or LocalScript wrapper that calls it, and list exactly what had to change because of replication limits:\n\n```lua\n" + code + "\n```";
  KODEX.inputEl.focus();
});
if (window.KODEX && KODEX.on) KODEX.on("after", scan);
scan();
})();
