(function(){
"use strict";
function scan(){
  document.querySelectorAll(".codeblock .codebar").forEach(function(bar){
    if (bar.querySelector('[data-a="modernize"]')) return;
    var b = document.createElement("button");
    b.className = "kxbtn"; b.dataset.a = "modernize"; b.textContent = "modernize";
    bar.appendChild(b);
  });
}
document.addEventListener("click", function(e){
  var t = e.target.closest ? e.target.closest('.kxbtn[data-a="modernize"]') : null;
  if (!t) return;
  var block = t.closest(".codeblock");
  var code = block ? (block.querySelector("code") || {}).textContent || "" : "";
  if (!code.trim()) return;
  KODEX.inputEl.value = "Modernize this roblox script to current Luau: replace deprecated calls with the current APIs, use task.spawn/task.wait instead of spawn/wait/delay, add type annotations on function signatures, use table.create where it helps, and list every change you made as a one-line diff log. Behavior must stay identical:\n\n```lua\n" + code + "\n```";
  KODEX.inputEl.focus();
});
if (window.KODEX && KODEX.on) KODEX.on("after", scan);
scan();
})();
