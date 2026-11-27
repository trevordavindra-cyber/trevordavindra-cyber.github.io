(function(){
"use strict";
var actions = document.querySelector("#topbar .topactions");
if (!actions) return;
function plainText(){
  return KODEX.getHistory().map(function(m){
    return (m.role === "user" ? "You: " : "KODEX: ") + m.content;
  }).join("\n\n");
}
function md(){
  return KODEX.getHistory().map(function(m){
    return m.role === "user" ? "## You\n\n" + m.content : "## KODEX\n\n" + m.content;
  }).join("\n\n---\n\n");
}
var dl = document.createElement("button");
dl.className = "ghostbtn"; dl.textContent = "export"; dl.title = "Download chat as markdown";
dl.addEventListener("click", function(){
  var blob = new Blob([md()], { type: "text/markdown" });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "kodex-chat-" + new Date().toISOString().slice(0,10) + ".md";
  document.body.appendChild(a); a.click(); a.remove();
});
var cp = document.createElement("button");
cp.className = "ghostbtn"; cp.textContent = "copy all"; cp.title = "Copy whole chat";
cp.addEventListener("click", function(){
  var t = plainText();
  if (navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(t).then(function(){ cp.textContent = "copied"; setTimeout(function(){ cp.textContent = "copy all"; }, 1200); });
  } else {
    var ta = document.createElement("textarea"); ta.value = t; document.body.appendChild(ta);
    ta.select(); try { document.execCommand("copy"); } catch(e){}
    ta.remove(); cp.textContent = "copied"; setTimeout(function(){ cp.textContent = "copy all"; }, 1200);
  }
});
actions.appendChild(cp);
actions.appendChild(dl);
})();
