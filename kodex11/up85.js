(function(){
"use strict";
function scan(){
  document.querySelectorAll(".codeblock .codebar").forEach(function(bar){
    if (bar.querySelector('[data-a="bench"]')) return;
    var b = document.createElement("button");
    b.className = "kxbtn"; b.dataset.a = "bench"; b.textContent = "bench";
    bar.appendChild(b);
  });
}
document.addEventListener("click", function(e){
  var t = e.target.closest ? e.target.closest('.kxbtn[data-a="bench"]') : null;
  if (!t) return;
  var block = t.closest(".codeblock");
  var code = block ? (block.querySelector("code") || {}).textContent || "" : "";
  if (!code.trim()) return;
  KODEX.inputEl.value = "Write a small benchmark harness for this roblox script: os.clock-timed loops over the hot paths with realistic sample data, before/after comparison against a naive version, and the number to watch (max time per call, not the average). Runnable in Studio once pasted, results printed as a small table:\n\n```lua\n" + code + "\n```";
  KODEX.inputEl.focus();
});
if (window.KODEX && KODEX.on) KODEX.on("after", scan);
scan();
})();
