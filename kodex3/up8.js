(function(){
"use strict";
function codeOf(block){
  var pre = block.querySelector("pre");
  var t = pre ? pre.textContent : "";
  if (t.length > 3500) t = t.slice(0, 3500) + "\n-- (truncated, paste more if needed)";
  return t;
}
function fill(prompt, block){
  KODEX.inputEl.value = prompt + "\n```\n" + codeOf(block) + "\n```";
  KODEX.inputEl.focus();
}
document.addEventListener("click", function(e){
  var b = e.target.closest(".kxbtn");
  if (!b || !b.getAttribute("data-a")) return;
  var block = b.closest(".codeblock");
  if (!block) return;
  var a = b.getAttribute("data-a");
  if (a === "explain") fill("Explain what this code does, step by step, briefly:", block);
  else if (a === "fix") fill("Find the bugs in this code and give the corrected full version:", block);
  else if (a === "optimize") fill("Optimize this code for performance and give the full improved version:", block);
  else if (a === "expand") openModal(block);
});
function openModal(block){
  var pre = block.querySelector("pre");
  var code = pre ? pre.textContent : "";
  var lang = block.querySelector(".lang") ? block.querySelector(".lang").textContent : "code";
  var modal = document.createElement("div");
  modal.className = "codemodal";
  var inner = document.createElement("div"); inner.className = "inner";
  var head = document.createElement("div"); head.className = "chead";
  var ti = document.createElement("div"); ti.className = "ctitle"; ti.textContent = lang;
  var btns = document.createElement("div"); btns.className = "cbtns";
  var cp = document.createElement("button"); cp.className = "kxbtn"; cp.textContent = "copy";
  cp.addEventListener("click", function(){
    if (navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(code); cp.textContent = "copied"; setTimeout(function(){ cp.textContent = "copy"; }, 1200); }
  });
  var cl = document.createElement("button"); cl.className = "kxbtn"; cl.textContent = "close";
  cl.addEventListener("click", function(){ modal.remove(); });
  btns.appendChild(cp); btns.appendChild(cl);
  head.appendChild(ti); head.appendChild(btns);
  var pr = document.createElement("pre");
  var lines = code.split("\n");
  var html = "";
  for (var i=0;i<lines.length;i++){ html += '<span class="ln">' + (i+1) + "</span>" + KODEX.esc(lines[i]) + "\n"; }
  pr.innerHTML = html;
  inner.appendChild(head); inner.appendChild(pr);
  modal.appendChild(inner);
  modal.addEventListener("click", function(e){ if (e.target === modal) modal.remove(); });
  var esc = function(e){ if (e.key === "Escape"){ modal.remove(); document.removeEventListener("keydown", esc); } };
  document.addEventListener("keydown", esc);
  document.body.appendChild(modal);
}
function scan(){
  document.querySelectorAll("#chat .codeblock .bar").forEach(function(bar){
    if (bar.getAttribute("data-kx")) return;
    bar.setAttribute("data-kx", "1");
    var left = bar.querySelector(".left");
    var host = left || bar;
    ["explain","fix","optimize","expand"].forEach(function(a){
      var b = document.createElement("button");
      b.className = "kxbtn";
      b.setAttribute("data-a", a);
      b.textContent = a === "expand" ? "\u29e2" : a;
      host.appendChild(b);
    });
  });
}
KODEX.on("after", function(){ scan(); });
scan();
})();
