/* NOVA — chat app. Free, keyless via text.pollinations.ai */
(function () {
"use strict";

/* ---------------- state ---------------- */
const LS_KEY = "nova.history.v1";
const LS_MODE = "nova.mode.v1";
let mode = localStorage.getItem(LS_MODE) || "default";
if (!NOVA_SYSTEM[mode]) mode = "default";
let history = loadHistory();
let controller = null;
let busy = false;

const API = "https://text.pollinations.ai/openai";
const MODEL = "openai";

/* ---------------- elements ---------------- */
const $ = (id) => document.getElementById(id);
const chatEl = $("chat"), messagesEl = $("messages"), welcomeEl = $("welcome");
const inputEl = $("input"), formEl = $("askForm"), sendBtn = $("sendBtn");
const statusEl = $("statusLine"), toastEl = $("toast");
const newBtn = $("newBtn"), clearBtn = $("clearBtn");

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

/* ---------------- api ---------------- */
async function ask(text) {
  if (busy) return;
  busy = true;
  sendBtn.disabled = true;
  addMsg("user", text);
  const bubbleWrap = typingBubble();
  setStatus("busy", "thinking…");
  controller = new AbortController();
  const msgs = [{ role: "system", content: NOVA_SYSTEM[mode] }];
  history.slice(-16).forEach((m) => msgs.push({ role: m.role, content: m.content }));
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: MODEL, messages: msgs, referrer: "nova" }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const reply = data && data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content : (typeof data === "string" ? data : null);
    if (!reply) throw new Error("empty reply");
    bubbleWrap.remove();
    addMsg("bot", reply.trim());
    setStatus("online", "free · unlimited");
  } catch (err) {
    bubbleWrap.remove();
    if (err.name === "AbortError") {
      setStatus("online", "free · unlimited");
    } else {
      addMsg("bot", "⚠️ hit a snag reaching the model (" + (err.message || "network") + "). tap the arrow to try again.");
      toast("rate limit or network — try again in a moment");
      setStatus("online", "free · unlimited");
    }
  } finally {
    busy = false;
    controller = null;
    sendBtn.disabled = false;
    inputEl.focus();
  }
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
$("modebar").addEventListener("click", (e) => {
  const btn = e.target.closest(".mode");
  if (!btn) return;
  mode = btn.dataset.mode;
  localStorage.setItem(LS_MODE, mode);
  document.querySelectorAll(".mode").forEach((m) => m.classList.toggle("active", m === btn));
  toast(btn.textContent + " on");
});
document.querySelectorAll(".mode").forEach((m) => m.classList.toggle("active", m.dataset.mode === mode));

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
setStatus("online", "free · unlimited");
async function ping() {
  try {
    const r = await fetch("https://text.pollinations.ai/models");
    if (r.ok) { setStatus("online", "free · unlimited"); }
  } catch (e) {
    setStatus("", "offline — check connection");
  }
}
ping();
})();
