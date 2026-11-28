(function(){
"use strict";
function scan(){
  document.querySelectorAll(".codeblock .codebar").forEach(function(bar){
    if (bar.querySelector('[data-a="split"]')) return;
    var b = document.createElement("button");
    b.className = "kxbtn"; b.dataset.a = "split"; b.textContent = "split";
    bar.appendChild(b);
  });
}
document.addEventListener("click", function(e){
  var t = e.target.closest ? e.target.closest('.kxbtn[data-a="split"]') : null;
  if (!t) return;
  var block = t.closest(".codeblock");
  var code = block ? (block.querySelector("code") || {}).textContent || "" : "";
  if (!code.trim()) return;
  KODEX.inputEl.value = "Split this roblox script into modules: give each ModuleScript a clear single job, a clean public API table, and one main script that requires them in the right order. Output each module in its own codeblock labeled with its exact name and parent location, then the main script last:\n\n```lua\n" + code + "\n```";
  KODEX.inputEl.focus();
});
if (window.KODEX && KODEX.on) KODEX.on("after", scan);
scan();
})();
