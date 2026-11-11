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
  recog.lang = localStorage.getItem("witch.voicelang") || "en-US";
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
  const isImg = /^image\//.test(f.type) || /\.(jpe?g|png|gif|webp|heic|heif|bmp|avif)$/i.test(f.name || "");
  if (!isImg) { window.alert("that file isn't an image"); fileIn.value = ""; return; }
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

/* ---------------- offline watch ---------------- */
let offBanner = null;
function netCheck() {
  if (!navigator.onLine && !offBanner) {
    offBanner = document.createElement("div");
    offBanner.style.cssText = "position:fixed;top:0;left:0;right:0;padding:6px 10px;background:#5b2a86;color:#fff;font-size:12px;text-align:center;z-index:99";
    offBanner.textContent = "offline — witch still works on this phone (local mode + memory)";
    document.body.appendChild(offBanner);
  } else if (navigator.onLine && offBanner) { offBanner.remove(); offBanner = null; }
}
window.addEventListener("online", netCheck);
window.addEventListener("offline", netCheck);
netCheck();

/* ---------------- storage meter ---------------- */
function bytes(n) { return n > 1024 ? Math.round(n / 1024) + " kb" : n + " b"; }
function storageMeter() {
  let used = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    used += k.length + (localStorage.getItem(k) || "").length;
  }
  const el = $("storagemeter");
  if (el) el.textContent = "on-device storage: about " + bytes(used * 2) + " used of ~5 mb";
}
storageMeter();

/* ---------------- text size ---------------- */
const SIZES = [["normal", "100%"], ["big", "115%"], ["huge", "130%"]];
let si = SIZES.findIndex((s) => s[0] === localStorage.getItem("witch.textsize"));
if (si < 0) si = 0;
function applySize() {
  document.documentElement.style.fontSize = SIZES[si][1];
  $("fontBtn").textContent = "text size: " + SIZES[si][0];
}
applySize();
$("fontBtn").onclick = () => {
  si = (si + 1) % SIZES.length;
  try { localStorage.setItem("witch.textsize", SIZES[si][0]); } catch (e) {}
  applySize();
};

/* ---------------- usage counter ---------------- */
function bumpUsage() {
  const today = new Date().toISOString().slice(0, 10);
  let u = {};
  try { u = JSON.parse(localStorage.getItem("witch.usage") || "{}"); } catch (e) {}
  u.total = (u.total || 0) + 1;
  u.days = u.days || {};
  u.days[today] = (u.days[today] || 0) + 1;
  const days = Object.keys(u.days).sort();
  while (days.length > 90) { delete u.days[days.shift()]; }
  try { localStorage.setItem("witch.usage", JSON.stringify(u)); } catch (e) {}
  const el = $("usagecounter");
  if (el) el.textContent = "asks: " + u.total + " total · " + (u.days[today] || 0) + " today";
}
(function initUsage() {
  const today = new Date().toISOString().slice(0, 10);
  let u = {};
  try { u = JSON.parse(localStorage.getItem("witch.usage") || "{}"); } catch (e) {}
  const el = $("usagecounter");
  if (el) el.textContent = "asks: " + (u.total || 0) + " total · " + ((u.days || {})[today] || 0) + " today";
})();
$("askForm").addEventListener("submit", bumpUsage);

/* ---------------- error log (debug panel) ---------------- */
window.addEventListener("error", (e) => {
  let l = [];
  try { l = JSON.parse(localStorage.getItem("witch.errors") || "[]"); } catch (err) {}
  l.push(new Date().toLocaleTimeString() + " " + (e.message || "unknown error"));
  try { localStorage.setItem("witch.errors", JSON.stringify(l.slice(-10))); } catch (err) {}
  const el = $("debugpanel");
  if (el) el.textContent = "last error: " + (e.message || "unknown error");
});
(function initDebug() {
  const el = $("debugpanel");
  if (!el) return;
  let l = [];
  try { l = JSON.parse(localStorage.getItem("witch.errors") || "[]"); } catch (e) {}
  el.textContent = l.length ? "last error: " + l[l.length - 1] : "no errors caught";
})();

/* ---------------- voice language picker ---------------- */
$("voiceLang").value = localStorage.getItem("witch.voicelang") || "en-US";
$("voiceLang").onchange = () => {
  localStorage.setItem("witch.voicelang", $("voiceLang").value);
  if (recog) recog.lang = $("voiceLang").value;
};
})();
