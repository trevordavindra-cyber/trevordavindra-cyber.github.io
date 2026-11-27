(function(){
"use strict";
var THEMES = {
  void: { "--bg":"#07090f", "--panel":"#0c101a", "--card":"#101623", "--border":"#1c2740", "--cyan":"#00dcff", "--red":"#ff3c3c", "--text":"#e8eefc", "--sub":"#8ea0c4" },
  matrix: { "--bg":"#060a06", "--panel":"#0a120a", "--card":"#0e1a0e", "--border":"#1e3a1e", "--cyan":"#39ff88", "--red":"#ff5c5c", "--text":"#d8ffe8", "--sub":"#7fae8e" },
  cyberpunk: { "--bg":"#0d0614", "--panel":"#150a20", "--card":"#1c0f2a", "--border":"#3a1e5c", "--cyan":"#ff2d95", "--red":"#00e5ff", "--text":"#f2e8ff", "--sub":"#b48ad9" },
  sunset: { "--bg":"#120a08", "--panel":"#1c0f0c", "--card":"#241510", "--border":"#4a2418", "--cyan":"#ff7a3d", "--red":"#ff3c3c", "--text":"#ffe8d8", "--sub":"#c49a80" },
  ocean: { "--bg":"#050a12", "--panel":"#0a1220", "--card":"#0e1a2e", "--border":"#1e3a5c", "--cyan":"#3da9ff", "--red":"#ff5c7a", "--text":"#d8ecff", "--sub":"#7fa8c9" },
  light: { "--bg":"#f2f4fa", "--panel":"#ffffff", "--card":"#ffffff", "--border":"#d8dee9", "--cyan":"#0a84ff", "--red":"#d93a3a", "--text":"#10131a", "--sub":"#55607a" }
};
function applyTheme(name){
  var t = THEMES[name] || THEMES.void;
  Object.keys(t).forEach(function(k){ document.documentElement.style.setProperty(k, t[k]); });
  localStorage.setItem("kodextheme", name);
  document.querySelectorAll(".swatch").forEach(function(sw){
    sw.classList.toggle("active", sw.getAttribute("data-t") === name);
  });
}
function applyFont(n){
  document.documentElement.style.setProperty("--msgfs", n + "px");
  localStorage.setItem("kodexfont", String(n));
}
var fs = parseInt(localStorage.getItem("kodexfont") || "15", 10);
if (isNaN(fs)) fs = 15;
fs = Math.min(18, Math.max(12, fs));
applyFont(fs);
var actions = document.querySelector("#topbar .topactions");
if (!actions) return;
var btn = document.createElement("button");
btn.className = "ghostbtn"; btn.textContent = "theme";
var panel = document.createElement("div");
panel.id = "themepanel";
panel.className = "hidden";
panel.innerHTML = '<div class="tlabel">theme</div>';
var row = document.createElement("div"); row.className = "row";
Object.keys(THEMES).forEach(function(name){
  var s = document.createElement("div");
  s.className = "swatch";
  s.setAttribute("data-t", name);
  var c = THEMES[name]["--cyan"], b = THEMES[name]["--bg"];
  s.style.background = "linear-gradient(135deg," + b + " 50%," + c + " 50%)";
  s.addEventListener("click", function(){ applyTheme(name); });
  row.appendChild(s);
});
panel.appendChild(row);
var lab = document.createElement("div"); lab.className = "tlabel"; lab.textContent = "text size";
panel.appendChild(lab);
var rng = document.createElement("input");
rng.type = "range"; rng.min = "12"; rng.max = "18"; rng.value = String(fs);
rng.addEventListener("input", function(){ applyFont(parseInt(rng.value, 10)); });
panel.appendChild(rng);
document.body.appendChild(panel);
btn.addEventListener("click", function(){
  panel.classList.toggle("hidden");
  applyTheme(localStorage.getItem("kodextheme") || "void");
});
actions.appendChild(btn);
applyTheme(localStorage.getItem("kodextheme") || "void");
})();
