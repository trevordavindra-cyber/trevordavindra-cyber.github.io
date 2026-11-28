(function(){
"use strict";
function scan(){
  document.querySelectorAll(".codeblock .codebar").forEach(function(bar){
    if (bar.querySelector('[data-a="rename"]')) return;
    var b = document.createElement("button");
    b.className = "kxbtn"; b.dataset.a = "rename"; b.textContent = "rename";
    bar.appendChild(b);
  });
}
document.addEventListener("click", function(e){
  var t = e.target.closest ? e.target.closest('.kxbtn[data-a="rename"]') : null;
  if (!t) return;
  var block = t.closest(".codeblock");
  var code = block ? (block.querySelector("code") || {}).textContent || "" : "";
  if (!code.trim()) return;
  KODEX.inputEl.value = "Rewrite this roblox script with meaningful variable and function names (no single letters except loop counters), consistent camelCase, and nothing else changed. Output the full renamed script only:\n\n```lua\n" + code + "\n```";
  KODEX.inputEl.focus();
});
if (window.KODEX && KODEX.on) KODEX.on("after", scan);
scan();
})();
