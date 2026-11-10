/* WITCH — panels: nav, memory, agents, studio, settings */
(function () {
"use strict";
const $ = (id) => document.getElementById(id);

/* ---------------- nav ---------------- */
function show(p) {
  document.querySelectorAll(".panel").forEach((el) => (el.hidden = el.id !== "panel-" + p));
  $("chatwrap").hidden = p !== "chat";
}
$("nav").addEventListener("click", (e) => {
  const b = e.target.closest(".navbtn");
  if (!b) return;
  document.querySelectorAll("#nav .navbtn").forEach((x) => x.classList.toggle("active", x === b));
  if (b.dataset.mode) { if (window.WITCH_SETMODE) window.WITCH_SETMODE(b.dataset.mode); show("chat"); }
  else { if (window.WITCH_SETMODE && (b.dataset.panel === "memory" || b.dataset.panel === "settings")) {} show(b.dataset.panel); }
});

/* ---------------- memory ---------------- */
const MEMKEY = "witch.memory.v1";
function memList() { try { return JSON.parse(localStorage.getItem(MEMKEY)) || []; } catch (e) { return []; } }
function memSave(l) { try { localStorage.setItem(MEMKEY, JSON.stringify(l.slice(-200))); } catch (e) {} }
function renderMem(q) {
  const box = $("memlist");
  box.innerHTML = "";
  const query = (q || "").trim().toLowerCase();
  let shown = 0;
  memList().forEach((m, i) => {
    if (query && m.toLowerCase().indexOf(query) === -1) return;
    shown++;
    const row = document.createElement("div");
    row.className = "memrow";
    row.appendChild(document.createTextNode(m));
    const del = document.createElement("button");
    del.textContent = "×";
    del.onclick = () => { const l = memList(); l.splice(i, 1); memSave(l); renderMem($("memsearch").value); };
    row.appendChild(del);
    box.appendChild(row);
  });
  if (query && !shown) {
    const none = document.createElement("div");
    none.className = "sub";
    none.textContent = "no memories match";
    box.appendChild(none);
  }
}
$("memsearch").addEventListener("input", () => renderMem($("memsearch").value));
window.WITCH_MEMORY = {
  text: () => (memList().length ? "- " + memList().join("\n- ") : ""),
  add: (t) => {
    const l = memList();
    if (l.some((x) => x.toLowerCase() === t.toLowerCase())) {
      const mi = $("meminput");
      mi.value = "";
      mi.placeholder = "already saved";
      setTimeout(() => { mi.placeholder = "save a fact about you or a project..."; }, 2000);
      return;
    }
    l.push(t);
    memSave(l);
    renderMem($("memsearch").value);
  },
  list: memList,
};
$("memaddform").addEventListener("submit", (e) => {
  e.preventDefault();
  const v = $("meminput").value.trim();
  if (v) { window.WITCH_MEMORY.add(v); $("meminput").value = ""; }
});
renderMem();

/* ---------------- agents ---------------- */
const agents = window.WITCH_AGENTS || {};
const grid = $("agentgrid");
Object.keys(agents).forEach((k) => {
  const b = document.createElement("button");
  b.className = "agentbtn";
  const nm = document.createElement("b");
  nm.textContent = agents[k].name;
  const bl = document.createElement("span");
  bl.textContent = agents[k].blurb;
  b.appendChild(nm); b.appendChild(bl);
  b.onclick = () => {
    if (window.WITCH_SETMODE) window.WITCH_SETMODE("agent:" + k);
    $("agstatus").textContent = agents[k].name + " has the brain — back in chat, just talk.";
    show("chat");
  };
  grid.appendChild(b);
});
$("agentback").onclick = () => { if (window.WITCH_SETMODE) window.WITCH_SETMODE("witch"); $("agstatus").textContent = ""; show("chat"); };
$("teamBtn").onclick = () => {
  window.WITCH_TEAM = !window.WITCH_TEAM;
  $("teamBtn").textContent = "team review: " + (window.WITCH_TEAM ? "on" : "off");
};

/* ---------------- studio ---------------- */
$("editor").value = localStorage.getItem("witch.editor") || '<!DOCTYPE html>\n<html>\n<body style="font-family:sans-serif">\n  <h1>hello from the studio</h1>\n</body>\n</html>';
$("preview").srcdoc = $("editor").value;
$("editor").addEventListener("input", () => { try { localStorage.setItem("witch.editor", $("editor").value); } catch (e) {} });
$("studioRun").onclick = () => { $("preview").srcdoc = $("editor").value; };
$("studioBuild").onclick = async () => {
  const what = window.prompt("what should the witch build? (describe the page or app)");
  if (!what) return;
  $("studioBuild").disabled = true;
  $("studioBuild").textContent = "building…";
  try {
    const res = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: localStorage.getItem("witch.model") || "openai-fast",
        messages: [
          { role: "system", content: "You are a code generator. Output ONE complete, self-contained HTML file with inline CSS and JS. No explanations, no markdown fences." },
          { role: "user", content: what },
        ],
        referrer: "witch",
      }),
    });
    const d = await res.json();
    let code = d && d.choices && d.choices[0] && d.choices[0].message ? d.choices[0].message.content : "";
    code = code.replace(/^```[a-z]*\n?/i, "").replace(/```\s*$/, "");
    if (code) { $("editor").value = code; $("preview").srcdoc = code; try { localStorage.setItem("witch.editor", code); } catch (e) {} }
  } catch (e) {}
  $("studioBuild").disabled = false;
  $("studioBuild").textContent = "AI build";
};

/* ---------------- settings ---------------- */
async function loadModels() {
  const sel = $("modelSel");
  try {
    const r = await fetch("https://text.pollinations.ai/models");
    const list = await r.json();
    sel.innerHTML = "";
    (Array.isArray(list) ? list : []).forEach((m) => {
      if (m && m.name && (!m.output_modalities || m.output_modalities.indexOf("text") !== -1)) {
        const o = document.createElement("option");
        o.value = m.name;
        o.textContent = m.name + (m.description ? " — " + m.description : "");
        sel.appendChild(o);
      }
    });
    const cur = localStorage.getItem("witch.model") || "openai-fast";
    if ([].slice.call(sel.options).some((o) => o.value === cur)) sel.value = cur;
  } catch (e) {
    sel.innerHTML = "";
    const o = document.createElement("option");
    o.value = "openai-fast";
    o.textContent = "openai-fast (couldn't load the list)";
    sel.appendChild(o);
  }
}
loadModels();
$("modelSel").onchange = () => { localStorage.setItem("witch.model", $("modelSel").value); };
function download(name, text) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  a.download = name;
  a.click();
}
$("memexport").onclick = () => download("witch-memory.json", JSON.stringify(memList(), null, 2));
$("memwipe").onclick = () => { if (window.confirm("delete all saved memory?")) { memSave([]); renderMem(); } };
$("exportBtn").onclick = () => {
  let hist = [];
  try { hist = JSON.parse(localStorage.getItem("witch.history.v1") || "[]"); } catch (e) {}
  download("witch-backup.json", JSON.stringify({ chat: hist, memory: memList(), editor: localStorage.getItem("witch.editor") || "" }, null, 2));
};
$("wipeBtn").onclick = () => {
  if (window.confirm("wipe ALL witch data on this phone (chats, memory, settings)?")) {
    ["witch.history.v1", "witch.mode.v1", "witch.local.v1", "witch.memory.v1", "witch.model", "witch.editor"].forEach((k) => localStorage.removeItem(k));
    location.reload();
  }
};
show("chat");
})();
