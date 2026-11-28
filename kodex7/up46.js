(function(){
"use strict";
function scan(){
  document.querySelectorAll(".codeblock .codebar").forEach(function(bar){
    if (bar.querySelector('[data-a="explain"]')) return;
    var b = document.createElement("button");
    b.className = "kxbtn"; b.dataset.a = "explain"; b.textContent = "explain";
    bar.appendChild(b);
  });
}
document.addEventListener("click", function(e){
  var t = e.target.closest ? e.target.closest('.kxbtn[data-a="explain"]') : null;
  if (!t) return;
  var block = t.closest(".codeblock");
  var code = block ? (block.querySelector("code") || {}).textContent || "" : "";
  if (!code.trim()) return;
  KODEX.inputEl.value = "Explain this roblox script line by line in plain words, grouped by what each section does, then one line on the single most important thing to understand about it:\n\n```lua\n" + code + "\n```";
  KODEX.inputEl.focus();
});
if (window.KODEX && KODEX.on) KODEX.on("after", scan);
scan();
})();
