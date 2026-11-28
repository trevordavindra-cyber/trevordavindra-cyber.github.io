(function(){
"use strict";
function scan(){
  document.querySelectorAll(".codeblock .codebar").forEach(function(bar){
    if (bar.querySelector('[data-a="test"]')) return;
    var b = document.createElement("button");
    b.className = "kxbtn"; b.dataset.a = "test"; b.textContent = "test";
    bar.appendChild(b);
  });
}
document.addEventListener("click", function(e){
  var t = e.target.closest ? e.target.closest('.kxbtn[data-a="test"]') : null;
  if (!t) return;
  var block = t.closest(".codeblock");
  var code = block ? (block.querySelector("code") || {}).textContent || "" : "";
  if (!code.trim()) return;
  KODEX.inputEl.value = "Write a small test harness for this roblox script: a test script that stubs the inputs (mock players, fake remotes, sample data) and asserts the important behavior edge cases (nil values, duplicate calls, boundary numbers). Keep it runnable in Studio by pasting once, and list what each test proves in one line each:\n\n```lua\n" + code + "\n```";
  KODEX.inputEl.focus();
});
if (window.KODEX && KODEX.on) KODEX.on("after", scan);
scan();
})();
