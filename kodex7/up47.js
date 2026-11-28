(function(){
"use strict";
function scan(){
  document.querySelectorAll(".codeblock .codebar").forEach(function(bar){
    if (bar.querySelector('[data-a="harden"]')) return;
    var b = document.createElement("button");
    b.className = "kxbtn"; b.dataset.a = "harden"; b.textContent = "harden";
    bar.appendChild(b);
  });
}
document.addEventListener("click", function(e){
  var t = e.target.closest ? e.target.closest('.kxbtn[data-a="harden"]') : null;
  if (!t) return;
  var block = t.closest(".codeblock");
  var code = block ? (block.querySelector("code") || {}).textContent || "" : "";
  if (!code.trim()) return;
  KODEX.inputEl.value = "Harden this roblox script against exploiters: move any trust from client to server, validate every remote argument (type, range, rate), never trust damage/position/currency values the client sends, add sanity limits, and list every hole you closed as a one-line changelog:\n\n```lua\n" + code + "\n```";
  KODEX.inputEl.focus();
});
if (window.KODEX && KODEX.on) KODEX.on("after", scan);
scan();
})();
