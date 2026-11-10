/* WITCH — chat app. Hosted: text.pollinations.ai (free, keyless). Local: WebLLM in-browser (no-refusal model first). */
(function () {
"use strict";

/* ---------------- state ---------------- */
const LS_KEY = "witch.history.v1";
const LS_MODE = "witch.mode.v1";
const LS_LOCAL = "witch.local.v1";
let mode = localStorage.getItem(LS_MODE) || "default";
if (!WITCH_SYSTEM[mode]) mode = "witch";
let localMode = localStorage.getItem(LS_LOCAL) === "1";
let history = loadHistory();
let controller = null;
let busy = false;

const API = "https://text.pollinations.ai/openai";
const MODEL = "openai-fast";
const LOCAL_MODEL = "Llama-3.2-1B-Instruct-q4f16_1-MLC";

/* local engine */
let webllmMod = null;
let engine = null;
let localReady = false;
let localLoading = false;
let localWhich = null;

/* ---------------- elements ---------------- */
const $ = (id) => document.getElementById(id);
const chatEl = $("chat"), messagesEl = $("messages"), welcomeEl = $("welcome");
const inputEl = $("input"), formEl = $("askForm"), sendBtn = $("sendBtn");
const statusEl = $("statusLine"), toastEl = $("toast");
const newBtn = $("newBtn"), clearBtn = $("clearBtn");
const localBtn = $("localBtn"), localbar = $("localbar"), lfill = $("lfill");

/* ---------------- helpers ---------------- */
function loadHistory() {
  try { const h = JSON.parse(localStorage.getItem(LS_KEY)); return Array.isArray(h) ? h : []; }
  catch (e) { return []; }
}
function saveHistory() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(history.slice(-60))); } catch (e) {}
}
let toastTimer = null;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
}
function setStatus(kind, text) {
  statusEl.className = "sub " + (kind || "");
  statusEl.textContent = text;
}
function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}
function gpuOk() {
  return typeof navigator !== "undefined" && !!navigator.gpu;
}
function buildMessages() {
  const msgs = [{ role: "system", content: WITCH_SYSTEM[mode] }];
  history.slice(-16).forEach((m) => msgs.push({ role: m.role, content: m.content }));
  return msgs;
}

/* ---------------- local engine ---------------- */
function setProgress(p, label) {
  localbar.hidden = false;
  lfill.style.width = Math.round(Math.max(0, Math.min(1, p)) * 100) + "%";
  setStatus("busy", "downloading model " + Math.round(p * 100) + "%");
  if (label) localBtn.textContent = "local: " + Math.round(p * 100) + "%";
}
function hideProgress() {
  localbar.hidden = true;
  lfill.style.width = "0%";
}
function updateLocalBtn() {
  if (localLoading) return;
  localBtn.textContent = "local: " + (localMode ? "on" : "off");
  localBtn.classList.toggle("on", localMode);
}
async function loadLocal() {
  if (localReady) return true;
  if (localLoading) return false;
  if (!gpuOk()) {
    toast("this phone's browser can't run local models (needs webgpu)");
    localMode = false;
    localStorage.setItem(LS_LOCAL, "0");
    updateLocalBtn();
    return false;
  }
  localLoading = true;
  setStatus("busy", "downloading model…");
  try {
    webllmMod = await import("https://esm.run/@mlc-ai/web-llm");
    const ablib = {
      model: "https://huggingface.co/RaiseRuntimeError/Huihui-Qwen3.5-2B-abliterated-q4f16_1-MLC",
      model_id: "Huihui-Qwen3.5-2B-abliterated-q4f16_1-MLC",
      model_lib: webllmMod.modelLibURLPrefix + webllmMod.modelVersion + "/Qwen3.5-2B-q4f16_1_cs1k-webgpu.wasm",
      vram_required_MB: 2245.44,
      overrides: { context_window_size: 4096, max_history_size: 1 },
    };
    try {
      engine = await webllmMod.CreateMLCEngine(ablib.model_id, {
        appConfig: { model_list: [ablib] },
        initProgressCallback: (r) => setProgress(r.progress || 0, r.text || ""),
      });
      localWhich = "uncensored";
    } catch (e2) {
      engine = await webllmMod.CreateMLCEngine(LOCAL_MODEL, {
        initProgressCallback: (r) => setProgress(r.progress || 0, r.text || ""),
      });
      localWhich = "standard";
    }
    localReady = true;
    hideProgress();
    toast(localWhich === "uncensored" ? "uncensored model ready — lives on your phone" : "local model ready — it lives on your phone now");
    setStatus("online", localWhich === "uncensored" ? "local · uncensored · on your phone" : "local · on your phone");
    return true;
  } catch (e) {
    engine = null;
    hideProgress();
    toast("couldn't load the local model — staying hosted");
    localMode = false;
    localStorage.setItem(LS_LOCAL, "0");
    setStatus("online", "free · unlimited");
    return false;
  } finally {
    localLoading = false;
    updateLocalBtn();
  }
}

/* ---------------- markdown-lite ---------------- */
function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function md(src) {
  let t = esc(src);
  const blocks = [];
  t = t.replace(/```(\w*)\n?([\s\S]*?)```/g, (m, lang, code) => {
    blocks.push("<pre><code>" + code.replace(/\n$/, "") + "</code></pre>");
    return "\x00B" + (blocks.length - 1) + "\x00";
  });
  t = t.replace(/`([^`\n]+)`/g, "<code>$1</code>");
  t = t.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
  t = t.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
  t = t.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");
  t = t.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,!?,]|$)/g, "$1<em>$2</em>");
  t = t.replace(/\[([^\]\n]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  t = t.replace(/^\s*[-*]\s+(.+)$/gm, "<li>$1</li>");
  t = t.replace(/(<li>[\s\S]*?<\/li>)(?!\s*<li>)/g, "<ul>$1</ul>");
  t = t.replace(/\n{2,}/g, "<br><br>").replace(/(?<!>)\n(?!<)/g, "<br>");
  t = t.replace(/\x00B(\d+)\x00/g, (m, i) => blocks[+i]);
  return t;
}

/* ---------------- rendering ---------------- */
function addMsg(role, text, save) {
  welcomeEl.style.display = "none";
  const wrap = el("div", "msg " + role);
  const bubble = el("div", "bubble");
  if (role === "user") { bubble.textContent = text; }
  else { bubble.innerHTML = md(text); }
  wrap.appendChild(bubble);
  if (role === "bot") {
    const tools = el("div", "tools");
    const copy = el("button", null, "copy");
    copy.addEventListener("click", () => {
      navigator.clipboard && navigator.clipboard.writeText(text);
      toast("copied");
    });
    tools.appendChild(copy);
    wrap.appendChild(tools);
  }
  messagesEl.appendChild(wrap);
  chatEl.scrollTop = chatEl.scrollHeight;
  if (save !== false) { history.push({ role: role === "user" ? "user" : "assistant", content: text }); saveHistory(); }
  return wrap;
}
function typingBubble() {
  welcomeEl.style.display = "none";
  const wrap = el("div", "msg bot");
  const bubble = el("div", "bubble");
  const t = el("span", "typing");
  t.appendChild(el("i")); t.appendChild(el("i")); t.appendChild(el("i"));
  bubble.appendChild(t);
  wrap.appendChild(bubble);
  wrap.dataset.typing = "1";
  messagesEl.appendChild(wrap);
  chatEl.scrollTop = chatEl.scrollHeight;
  return wrap;
}
function restore() {
  if (!history.length) return;
  welcomeEl.style.display = "none";
  history.forEach((m) => addMsg(m.role === "assistant" ? "bot" : "user", m.content, false));
}

/* ---------------- hosted api ---------------- */
async function askHosted(bubbleWrap) {
  setStatus("busy", "thinking…");
  controller = new AbortController();
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: MODEL, messages: buildMessages(), referrer: "witch" }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const reply = data && data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content : (typeof data === "string" ? data : null);
    if (!reply) throw new Error("empty reply");
    bubbleWrap.remove();
    addMsg("bot", reply.trim());
    setStatus(localMode && localReady ? "online" : "online", "free · unlimited");
  } catch (err) {
    bubbleWrap.remove();
    if (err.name === "AbortError") {
      setStatus("online", "free · unlimited");
    } else {
      addMsg("bot", "⚠️ hit a snag reaching the model (" + (err.message || "network") + "). tap the arrow to try again.");
      toast("rate limit or network — try again in a moment");
      setStatus("online", "free · unlimited");
    }
  }
}

/* ---------------- local chat (streaming) ---------------- */
async function askLocal(bubbleWrap) {
  const ok = await loadLocal();
  if (!ok) { await askHosted(bubbleWrap); return; }
  bubbleWrap.remove();
  const wrap = el("div", "msg bot");
  const bubble = el("div", "bubble");
  wrap.appendChild(bubble);
  messagesEl.appendChild(wrap);
  chatEl.scrollTop = chatEl.scrollHeight;
  setStatus("busy", "running on your phone…");
  let raw = "";
  try {
    const stream = await engine.chat.completions.create({
      messages: buildMessages(),
      temperature: 0.9,
      stream: true,
    });
    const iter = stream[Symbol.asyncIterator]();
    while (true) {
      const step = await iter.next();
      if (step.done) break;
      const chunk = step.value;
      const delta = chunk && chunk.choices && chunk.choices[0] && chunk.choices[0].delta
        ? (chunk.choices[0].delta.content || "") : "";
      if (delta) {
        raw += delta;
        bubble.innerHTML = md(raw) + '<span class="caret"></span>';
        chatEl.scrollTop = chatEl.scrollHeight;
      }
    }
    if (!raw.trim()) throw new Error("empty reply");
    bubble.innerHTML = md(raw.trim());
    const tools = el("div", "tools");
    const copy = el("button", null, "copy");
    copy.addEventListener("click", () => {
      navigator.clipboard && navigator.clipboard.writeText(raw.trim());
      toast("copied");
    });
    tools.appendChild(copy);
    wrap.appendChild(tools);
    history.push({ role: "assistant", content: raw.trim() });
    saveHistory();
    setStatus("online", "local · on your phone");
  } catch (err) {
    bubble.innerHTML = md(raw.trim() || "⚠️ the local model hit a snag (" + (err.message || "error") + "). switching to the hosted one for this.");
    if (!raw.trim()) { await askHosted(wrap); return; }
    setStatus("online", "local · on your phone");
  }
}

/* ---------------- router ---------------- */
async function ask(text) {
  if (busy) return;
  busy = true;
  sendBtn.disabled = true;
  addMsg("user", text);
  const bubbleWrap = typingBubble();
  if (localMode) {
    await askLocal(bubbleWrap);
  } else {
    await askHosted(bubbleWrap);
  }
  busy = false;
  controller = null;
  sendBtn.disabled = false;
  inputEl.focus();
}

/* ---------------- wiring ---------------- */
formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = inputEl.value.trim();
  if (!text) return;
  inputEl.value = "";
  autoGrow();
  ask(text);
});
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 760) {
    e.preventDefault();
    formEl.requestSubmit();
  }
});
function autoGrow() {
  inputEl.style.height = "auto";
  inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + "px";
}
inputEl.addEventListener("input", autoGrow);

$("chips").addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (btn) ask(btn.dataset.q);
});
$("modebar").addEventListener("click", async (e) => {
  const btn = e.target.closest(".mode");
  if (!btn || btn === localBtn) return;
  mode = btn.dataset.mode;
  localStorage.setItem(LS_MODE, mode);
  document.querySelectorAll(".mode:not(#localBtn)").forEach((m) => m.classList.toggle("active", m === btn));
  toast(btn.textContent + " on");
});
document.querySelectorAll(".mode:not(#localBtn)").forEach((m) => m.classList.toggle("active", m.dataset.mode === mode));

localBtn.addEventListener("click", async () => {
  if (localLoading) return;
  if (localMode && localReady) {
    localMode = false;
    localStorage.setItem(LS_LOCAL, "0");
    updateLocalBtn();
    setStatus("online", "free · unlimited");
    toast("back on the hosted model");
  } else {
    localMode = true;
    localStorage.setItem(LS_LOCAL, "1");
    updateLocalBtn();
    await loadLocal();
  }
});

newBtn.addEventListener("click", () => {
  history = [];
  saveHistory();
  messagesEl.innerHTML = "";
  welcomeEl.style.display = "";
  toast("fresh chat");
});
clearBtn.addEventListener("click", () => {
  history = [];
  saveHistory();
  messagesEl.innerHTML = "";
  welcomeEl.style.display = "";
  toast("cleared");
});

/* ---------------- boot ---------------- */
restore();
updateLocalBtn();
if (localMode && localReady) setStatus("online", "local · on your phone");
else if (localMode) setStatus("", "local on · loads when you send");
else setStatus("online", "free · unlimited");
async function ping() {
  try {
    const r = await fetch("https://text.pollinations.ai/models");
    if (r.ok && !(localMode && localReady)) setStatus("online", "free · unlimited");
  } catch (e) {
    if (!(localMode && localReady)) setStatus("", "offline — check connection");
  }
}
ping();
})();
