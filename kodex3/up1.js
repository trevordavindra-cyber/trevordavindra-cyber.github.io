(function(){
"use strict";
var KW = {
  lua: "and|break|do|else|elseif|end|false|for|function|goto|if|in|local|nil|not|or|repeat|return|then|true|until|while|self",
  g: "game|workspace|script|Instance|Vector2|Vector3|CFrame|Color3|UDim|UDim2|Enum|task|math|table|string|pairs|ipairs|tostring|tonumber|typeof|require|print|warn|pcall|tick|os|delay|select|next|setmetatable|getmetatable|rawget|rawset|assert|error|wait",
  js: "var|let|const|function|return|if|else|for|while|class|new|this|async|await|import|export|typeof|null|undefined|true|false|try|catch|finally|switch|case|break|continue|of|in",
  py: "def|class|import|from|return|if|elif|else|for|while|with|as|try|except|finally|lambda|None|True|False|self|print|in|not|and|or|is"
};
function detect(lang){
  lang = (lang||"").toLowerCase();
  if (/lua|luau|roblox/.test(lang)) return ["lua","g"];
  if (/js|javascript|json|ts|typescript/.test(lang)) return ["js"];
  if (/py|python/.test(lang)) return ["py"];
  if (/css|html|xml/.test(lang)) return [];
  return ["lua","g"];
}
function highlight(code, lang){
  var sets = detect(lang);
  var kw = "";
  sets.forEach(function(s){ if (KW[s]) kw = kw ? kw + "|" + KW[s] : KW[s]; });
  var comment = sets.indexOf("lua") > -1 || sets.indexOf("g") > -1 ? "--[^\\n]*" : "#[^\\n]*";
  var re = new RegExp("(" + comment + "|\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)|(?:\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*')|\\b(" + (kw || "\\u0000") + ")\\b|\\b(\\d+\\.?\\d*)\\b", "g");
  return KODEX.esc(code).replace(re, function(m, c, str, k, num){
    if (c) return '<span class="hl-c">' + c + "</span>";
    if (k) return '<span class="hl-k">' + k + "</span>";
    if (num) return '<span class="hl-n">' + num + "</span>";
    return m;
  });
}
function scan(){
  document.querySelectorAll("#chat .codeblock pre").forEach(function(pre){
    if (pre.getAttribute("data-hl")) return;
    var block = pre.closest(".codeblock");
    var lang = block && block.querySelector(".lang") ? block.querySelector(".lang").textContent : "";
    var raw = pre.textContent;
    pre.setAttribute("data-hl", "1");
    pre.innerHTML = highlight(raw, lang);
  });
}
KODEX.on("after", function(){ scan(); });
scan();
})();
