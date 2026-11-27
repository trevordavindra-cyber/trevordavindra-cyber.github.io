(function(){
"use strict";
function scan(){
  document.querySelectorAll(".codeblock .codebar").forEach(function(bar){
    if (bar.querySelector('[data-a="review"]')) return;
    var b = document.createElement("button");
    b.className = "kxbtn"; b.dataset.a = "review"; b.textContent = "review";
    bar.appendChild(b);
  });
}
document.addEventListener("click", function(e){
  var t = e.target.closest ? e.target.closest('.kxbtn[data-a="review"]') : null;
  if (!t) return;
  var block = t.closest(".codeblock");
  var code = block ? (block.querySelector("code") || {}).textContent || "" : "";
  if (!code.trim()) return;
  KODEX.inputEl.value = "Review this roblox script against this checklist and fix anything that fails: 1 clear naming, 2 pcall around every external call, 3 task.wait not wait(), 4 connections disconnected on cleanup/respawn, 5 server validates anything a client sends, 6 no magic numbers (named constants), 7 no FindFirstChild inside hot loops, 8 handlers re-hooked safely on respawn, 9 early returns, 10 comments only where logic is subtle. Return the fixed script plus a one-line note per fix:\n\n```lua\n" + code + "\n```";
  KODEX.inputEl.focus();
});
if (window.KODEX && KODEX.on) KODEX.on("after", scan);
scan();
})();
