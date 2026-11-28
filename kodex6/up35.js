(function(){
"use strict";
function scan(){
  document.querySelectorAll(".codeblock .codebar").forEach(function(bar){
    if (bar.querySelector('[data-a="refactor"]')) return;
    var b = document.createElement("button");
    b.className = "kxbtn"; b.dataset.a = "refactor"; b.textContent = "refactor";
    bar.appendChild(b);
  });
}
document.addEventListener("click", function(e){
  var t = e.target.closest ? e.target.closest('.kxbtn[data-a="refactor"]') : null;
  if (!t) return;
  var block = t.closest(".codeblock");
  var code = block ? (block.querySelector("code") || {}).textContent || "" : "";
  if (!code.trim()) return;
  KODEX.inputEl.value = "Refactor this roblox script: split it into clear functions, name magic numbers, remove dead code, group related logic into a ModuleScript if the file is doing three jobs, and keep behavior identical. Return the refactored code plus a one-line summary of each change:\n\n```lua\n" + code + "\n```";
  KODEX.inputEl.focus();
});
if (window.KODEX && KODEX.on) KODEX.on("after", scan);
scan();
})();
