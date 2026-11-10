/* WITCH — voice input, image attach, project workspaces */
(function () {
"use strict";
const $ = (id) => document.getElementById(id);

/* ---------------- voice input ---------------- */
let recog = null, listening = false;
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = $("micBtn");
const inp = $("input");
if (!SR) { mic.hidden = true; }
else {
  recog = new SR();
  recog.lang = "en-US";
  recog.interimResults = true;
  recog.continuous = false;
  recog.onresult = (e) => {
    let t = "";
    for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
    inp.value = t;
  };
  recog.onend = () => { listening = false; mic.classList.remove("listening"); };
  recog.onerror = () => { listening = false; mic.classList.remove("listening"); };
  mic.addEventListener("click", () => {
    if (listening) { try { recog.stop(); } catch (e) {} return; }
    try { recog.start(); listening = true; mic.classList.add("listening"); } catch (e) {}
  });
}

/* ---------------- image attach ---------------- */
const prev = $("imgprev"), thumb = $("imgthumb"), fileIn = $("imgInput");
function clearImg() { window.WITCH_PENDING_IMAGE = null; prev.hidden = true; }
window.WITCH_CLEAR_IMAGE = clearImg;
$("attachBtn").addEventListener("click", () => fileIn.click());
fileIn.addEventListener("change", () => {
  const f = fileIn.files && fileIn.files[0];
  if (!f) return;
  if (f.size > 4 * 1024 * 1024) { window.alert("image too big (4mb max)"); fileIn.value = ""; return; }
  if (!/^image\//.test(f.type)) { window.alert("that file isn't an image"); fileIn.value = ""; return; }
  const r = new FileReader();
  r.onload = () => {
    window.WITCH_PENDING_IMAGE = r.result;
    thumb.src = r.result;
    prev.hidden = false;
  };
  r.readAsDataURL(f);
  fileIn.value = "";
});
$("imgclear").onclick = clearImg;

/* ---------------- project workspaces ---------------- */
const PROJKEY = "witch.projects.v1";
function projects() { try { return JSON.parse(localStorage.getItem(PROJKEY)) || {}; } catch (e) { return {}; } }
function saveProjects(p) { try { localStorage.setItem(PROJKEY, JSON.stringify(p)); } catch (e) {} }
function renderProjects() {
  const box = $("projlist");
  box.innerHTML = "";
  const p = projects();
  Object.keys(p).forEach((name) => {
    const row = document.createElement("div");
    row.className = "memrow";
    row.appendChild(document.createTextNode(name));
    const open = document.createElement("button");
    open.textContent = "open";
    open.onclick = () => {
      $("editor").value = p[name];
      $("preview").srcdoc = p[name];
      try { localStorage.setItem("witch.editor", p[name]); } catch (e) {}
    };
    const del = document.createElement("button");
    del.textContent = "×";
    del.onclick = () => { const q = projects(); delete q[name]; saveProjects(q); renderProjects(); };
    row.appendChild(open);
    row.appendChild(del);
    box.appendChild(row);
  });
}
$("projSave").onclick = () => {
  const name = ($("projName").value || window.prompt("name this project") || "").trim();
  if (!name) return;
  const p = projects();
  p[name] = $("editor").value;
  saveProjects(p);
  $("projName").value = "";
  renderProjects();
};
renderProjects();

/* ---------------- vision settings ---------------- */
if (localStorage.getItem("witch.visionKey")) $("visionKey").placeholder = "key saved — paste new one to replace";
$("visionModel").value = localStorage.getItem("witch.visionModel") || "";
$("visionUrl").value = localStorage.getItem("witch.visionUrl") || "";
$("visionSave").onclick = () => {
  localStorage.setItem("witch.visionKey", $("visionKey").value.trim());
  localStorage.setItem("witch.visionModel", $("visionModel").value.trim());
  localStorage.setItem("witch.visionUrl", $("visionUrl").value.trim());
  $("visionKey").value = "";
  window.alert("image brain saved");
};
})();
