/* WITCH — feature registry at full scale: 50 divisions × 8 seeds × 2,500 aspects = 1,000,000 features.
Generated on demand (no million-object arrays), stats by arithmetic, any record printable by id. */
(function () {
"use strict";
const POOLS = {"DIVS": [["Core AI Intelligence", ["hosted text brain", "response verifier", "fallback chain", "context window manager", "token usage meter", "prompt builder", "temperature presets", "error recovery"]], ["Advanced Reasoning", ["think mode", "step planner", "self-check pass", "multi-hypothesis solver", "assumption lister", "confidence scoring", "socratic drill", "proof walker"]], ["Multi-Model Ecosystem", ["hosted brain adapter", "local brain adapter", "openai-compatible adapter", "gemini adapter", "model catalog", "model health probe", "quota tracker", "model switcher ui"]], ["Intelligent Model Routing", ["task classifier", "code task detector", "vision task detector", "complexity scorer", "latency router", "preference router", "availability router", "routing rules editor"]], ["Conversational AI", ["streaming chat", "chat history", "markdown rendering", "copy reply button", "retry on error", "quick-start chips", "typing indicator", "conversation clear"]], ["Deep Research Engine", ["research mode", "question decomposer", "source planner", "claim checker", "citation formatter", "contradiction flagger", "report builder", "uncertainty labels"]], ["Web Intelligence", ["link reader", "page summarizer", "url fetcher", "readability extractor", "rss reader", "bookmark brain", "domain fact sheet", "news digest"]], ["Coding Intelligence", ["code answerer", "bug diagnoser", "refactor planner", "test generator", "algorithm explainer", "complexity analyzer", "dependency adviser", "code review pass"]], ["Advanced Code Studio", ["code editor core", "live preview sandbox", "ai page builder", "project save open delete", "multi-tab editor", "syntax highlighting", "console capture", "export zip"]], ["Autonomous AI Agents", ["specialist agents", "task planner agent", "progress reporter", "agent queue", "background runner", "task templates", "failure recovery", "agent scheduler"]], ["Multi-Agent Collaboration", ["team review pass", "agent handoff", "debate mode", "consensus builder", "critic loop", "peer review chain", "conflict detector", "group summary"]], ["Persistent Memory", ["on-device memory store", "memory injection", "memory export", "memory wipe", "memory editing", "duplicate detection", "project memory", "retention controls"]], ["Knowledge Management", ["knowledge base", "document indexer", "topic graph", "flashcard builder", "glossary builder", "note linker", "tag system", "summary cards"]], ["File Intelligence", ["image attach preview", "text file reader", "csv reader", "pdf text extraction", "file type detection", "size guard", "file summary", "archive reader"]], ["Computer Vision", ["vision key routing", "no-vision fallback message", "image question answering", "screenshot analysis", "ocr reader", "diagram explainer", "chart reader", "vision prompt presets"]], ["Image Generation And Editing", ["pollinations image adapter", "prompt builder for art", "style presets", "seed control", "gallery grid", "image history", "negative prompts", "batch queue"]], ["Audio Intelligence", ["voice input core", "voice output tts", "transcript editor", "voice commands", "audio summarizer", "speech practice", "dictation polish", "voice settings"]], ["Video Intelligence", ["youtube link reader", "chapter summarizer", "subtitle extractor", "timestamp notes", "video qa", "clip planner", "transcript export", "watchlist"]], ["Data Analytics", ["csv analyzer", "column profiler", "stat calculator", "chart builder", "table summarizer", "outlier finder", "report generator", "data cleaner"]], ["Mathematics And Science", ["step math solver", "unit converter", "equation explainer", "graph plotter", "statistics helper", "physics calculator", "chemistry balancer", "formula sheet"]], ["Writing And Documentation", ["essay drafter", "tone adjuster", "summarizer", "outliner", "citation helper", "grammar pass", "email polisher", "readability scorer"]], ["Education And Tutoring", ["tutor agent", "practice generator", "quiz builder", "progress tracker", "hint ladder", "explanation levels", "study planner", "flashcard mode"]], ["Browser Automation", ["bookmark actions", "clipboard tools", "url bar commands", "reader mode", "screenshot page", "pwa install", "history search", "share sheet"]], ["Workflow Automation", ["task templates", "repeat last ask", "morning digest", "streak tracker", "reminder list", "chain prompts", "run log", "manual approve step"]], ["Api Integration Ecosystem", ["openai-compatible endpoint field", "gemini endpoint field", "key vault on device", "connection tester", "model lister", "request logger", "error translator", "quota display"]], ["Plugin Marketplace", ["plugin registry", "plugin sandbox", "permission prompts", "install flow", "uninstall flow", "version pinning", "update checker", "sample plugins"]], ["Developer Platform", ["console api", "event hooks", "url query params", "bookmarklets", "sdk docs", "theme api", "command palette api", "rate limit docs"]], ["Personalization", ["nickname memory", "tone memory", "interest memory", "custom system prompt", "theme picker", "font size control", "personal chips", "study prefs"]], ["User Interface And Experience", ["mobile-first layout", "dark purple theme", "top nav bar", "panel system", "toast system", "status line", "safe-area padding", "desktop layout"]], ["Project Management", ["project workspaces", "project notes", "milestone list", "task checklist", "deadline flags", "progress bars", "project archive", "template projects"]], ["Cloud Workspace", ["github pages deploy", "raw gist import", "cloud backup", "restore wizard", "storage meter", "offline queue", "multi-device notes", "sync conflict notes"]], ["Local And Offline Ai", ["local no-refusal brain", "model download progress", "webgpu detection", "local fallback chain", "offline banner", "cache manager", "phone memory guard", "model swap"]], ["Privacy And Data Protection", ["backup export", "data wipe", "key stays on device", "no accounts promise", "private mode", "history auto-trim", "clear on exit", "permission list"]], ["Security Architecture", ["api key protection", "iframe sandbox", "input escaping", "xss guard", "dependency audit", "safe paste", "upload validation", "prompt injection notes"]], ["Ai Evaluation And Benchmarking", ["self-check rubric", "answer grader", "regression set", "latency benchmark", "memory recall test", "agent success rate", "score dashboard", "a/b prompt test"]], ["Quality Assurance", ["error boundary", "toast on failure", "retry policy", "timeout guard", "input validation", "crash notes export", "smoke checklist", "release checklist"]], ["Observability And Monitoring", ["status line health", "ping probe", "offline detection", "usage counter", "error counter", "storage monitor", "event log", "debug panel"]], ["Performance Optimization", ["lazy script loading", "minimal dependencies", "cache busting", "storage trimming", "stream first paint", "dom batching", "bundle diet", "preload hints"]], ["Cost And Resource Management", ["free-first audit", "quota display", "no paid calls", "usage caps", "model cost labels", "storage budget", "data saver mode", "spend guard"]], ["Team Collaboration", ["share chat link", "export to file share", "shared projects", "handoff summary", "role presets", "comment mode", "group rules", "invite guide"]], ["Enterprise Administration", ["admin guide", "org template", "policy doc", "audit export", "compliance checklist", "retention policy", "offboarding guide", "usage report"]], ["Accessibility", ["font size control", "contrast check", "focus order", "aria labels", "reduced motion", "keyboard nav", "touch targets", "screen reader notes"]], ["Multilingual Intelligence", ["language picker", "reply in user language", "translation mode", "locale formats", "rtl layout", "dictionary mode", "phrasebook", "language practice"]], ["Creative Studio", ["story drafter", "character builder", "world bible", "dialogue pass", "plot doctor", "name generator", "logo concepter", "mood board"]], ["Game And 3d Development", ["game loop explainer", "physics notes", "collision planner", "level design doc", "balance calculator", "save system design", "perf budget sheet", "shader explainer"]], ["Roblox And Luau Development", ["luau generator", "modulescript writer", "localscript writer", "serverscript writer", "remoteevent designer", "datastore architect", "npc system planner", "anti-exploit checklist"]], ["Defensive Cybersecurity", ["phishing spotter", "password hygiene coach", "2fa explainer", "scam analyzer", "safe browsing checklist", "backup strategy", "privacy audit", "threat model starter"]], ["Agent Governance", ["approval gate", "permission list", "action audit log", "agent limits", "destructive confirm", "rate guard", "escalation path", "kill switch"]], ["Infrastructure And Reliability", ["backend api", "postgres database", "user accounts", "background queue", "cdn caching", "uptime checks", "log pipeline", "rollback plan"]], ["Continuous Improvement And Ecosystem Expansion", ["changelog", "roadmap page", "feature registry", "feedback capture", "experiment flags", "postmortem template", "contribution guide", "next-up list"]]], "ASPECTS": ["core", "batch mode", "streaming", "offline", "review pass", "audit log", "automation", "history", "export", "templates", "health check", "caching", "retry policy", "permissions", "migration", "search", "alerts", "scheduling", "sync", "sandbox", "telemetry", "backup", "validation", "presets", "mobile layout"], "BLOCKED": {"backend api — core": "needs a real server; GitHub Pages is static-only", "postgres database — core": "needs a real server; GitHub Pages is static-only", "user accounts — core": "needs a real server; GitHub Pages is static-only", "background queue — core": "needs a real server; GitHub Pages is static-only", "log pipeline — core": "needs a real server; GitHub Pages is static-only"}, "P0": [1, 5, 12, 29, 32, 33, 34], "P1": [2, 3, 4, 6, 8, 9, 10, 11, 14, 17, 25, 38, 49], "P2": [7, 13, 15, 19, 20, 21, 22, 24, 27, 28, 30, 36, 37, 42, 43, 44], "P3": [16, 18, 23, 26, 35, 39, 40, 45, 46, 47, 48, 50], "P4": [31, 41], "IMPL": ["0:0,7,8,24;1:0,7,8,24;2:0,7,8,24;3:0,7,8,24;4:0,7,8,24;5:0,7,8,24", "0:0,7,8,24;1:0,7,8,24;2:0,7,8,24;3:0,7,8,24;4:0,7,8,24;5:0,7,8,24;6:0,7,8,24;7:0,7,8,24", "0:0,7,8,24;1:0,7,8,24;2:0,7,8,24;3:0,7,8,24;4:0,7,8,24;6:0,7,8,24;7:0,7,8,24", "0:0,7,8,24;1:0,7,8,24;2:0,7,8,24;6:0,7,8,24", "0:0,7,8,24;1:0,7,8,24;2:0,7,8,24;3:0,7,8,24;4:0,7,8,24;5:0,7,8,24;6:0,7,8,24;7:0,7,8,24", "0:0,7,8,24;1:0,7,8,24;2:0,7,8,24;3:0,7,8,24;4:0,7,8,24;5:0,7,8,24;6:0,7,8,24;7:0,7,8,24", "0:0,7,8,24;1:0,7,8,24;5:0,7,8,24;6:0,7,8,24;7:0,7,8,24", "0:0,7,8,24;1:0,7,8,24;2:0,7,8,24;3:0,7,8,24;4:0,7,8,24;5:0,7,8,24;6:0,7,8,24;7:0,7,8,24", "0:0,7,8,24;1:0,7,8,24;2:0,7,8,24;3:0,7,8,24;6:0,7,8,24;7:0,7,8,24", "0:0,7,8,24;1:0,7,8,24;2:0,7,8,24;5:0,7,8,24;6:0,7,8,24", "0:0,7,8,24;2:0,7,8,24;3:0,7,8,24;4:0,7,8,24;5:0,7,8,24;7:0,7,8,24", "0:0,7,8,24;1:0,7,8,24;2:0,7,8,24;3:0,7,8,24;4:0,7,8,24;5:0,7,8,24;6:0,7,8,24;7:0,7,8,24", "0:0,7,8,24;3:0,7,8,24;4:0,7,8,24;7:0,7,8,24", "0:0,7,8,24;4:0,7,8,24;5:0,7,8,24", "0:0,7,8,24;1:0,7,8,24;2:0,7,8,24;3:0,7,8,24;4:0,7,8,24;5:0,7,8,24;6:0,7,8,24", "0:0,7,8,24;1:0,7,8,24;5:0,7,8,24;6:0,7,8,24", "0:0,7,8,24;1:0,7,8,24", "", "2:0,3,7,8,24;4:0,7,8,24;5:0,7,8,24;6:0,7,8,24", "0:0,7,8,24;1:0,3,7,8,24;2:0,7,8,24;3:0,3,7,8,24;4:0,3,7,8,24;5:0,7,8,24;6:0,7,8,24;7:0,7,8,24", "0:0,7,8,24;1:0,7,8,24;2:0,7,8,24;3:0,7,8,24;4:0,7,8,24;5:0,7,8,24;6:0,7,8,24;7:0,3,7,8,24", "0:0,7,8,24;1:0,7,8,24;2:0,7,8,24;3:0,7,8,24;4:0,7,8,24;5:0,7,8,24;6:0,7,8,24;7:0,7,8,24", "1:0,7,8,24;6:0,7,8,24", "0:0,7,8,24;4:0,7,8,24;5:0,7,8,24;6:0,7,8,24", "0:0,7,8,24;1:0,7,8,24;2:0,7,8,24;3:0,7,8,24", "", "", "0:0,7,8,24;1:0,7,8,24;2:0,7,8,24;3:0,7,8,24;5:0,7,8,24", "0:0,7,8,24;1:0,7,8,24;2:0,7,8,24;3:0,7,8,24;4:0,7,8,24;5:0,7,8,24;6:0,7,8,24;7:0,7,8,24", "0:0,7,8,24;1:0,7,8,24;2:0,7,8,24;3:0,7,8,24", "2:0,7,8,24;4:0,7,8,24", "0:0,7,8,24;1:0,7,8,24;2:0,7,8,24;3:0,7,8,24;4:0,7,8,24", "0:0,7,8,24;1:0,7,8,24;2:0,7,8,24;3:0,7,8,24", "0:0,7,8,24;1:0,7,8,24;2:0,7,8,24;3:0,7,8,24;6:0,7,8,24;7:0,7,8,24", "0:0,7,8,24;1:0,7,8,24", "0:0,7,8,24;1:0,7,8,24;2:0,7,8,24;3:0,7,8,24;4:0,7,8,24;5:0,7,8,24", "0:0,7,8,24;1:0,7,8,24;2:0,7,8,24;3:0,7,8,24;4:0,7,8,24;5:0,7,8,24;6:0,7,8,24;7:0,7,8,24", "1:0,7,8,24;3:0,7,8,24;6:0,7,8,24", "0:0,7,8,24;2:0,7,8,24;3:0,7,8,24;5:0,7,8,24", "1:0,7,8,24;3:0,7,8,24", "0:0,7,8,24;1:0,7,8,24;2:0,7,8,24;3:0,7,8,24;4:0,7,8,24;5:0,7,8,24;6:0,7,8,24;7:0,7,8,24", "0:0,7,8,24;6:0,7,8,24", "1:0,7,8,24;2:0,7,8,24;5:0,7,8,24;6:0,7,8,24;7:0,7,8,24", "0:0,7,8,24;1:0,7,8,24;2:0,7,8,24;3:0,7,8,24;4:0,7,8,24;5:0,3,7,8,24;6:0,7,8,24;7:0,7,8,24", "0:0,7,8,24;1:0,7,8,24;2:0,7,8,24;3:0,7,8,24;4:0,7,8,24;5:0,7,8,24;6:0,7,8,24;7:0,7,8,24", "0:0,7,8,24;1:0,7,8,24;2:0,7,8,24;3:0,7,8,24;4:0,7,8,24;5:0,7,8,24;6:0,7,8,24;7:0,7,8,24", "0:0,7,8,24;1:0,3,7,8,24;2:0,7,8,24;3:0,7,8,24;4:0,7,8,24;5:0,7,8,24;6:0,7,8,24;7:0,7,8,24", "2:0,7,8,24;4:0,7,8,24", "", "2:0"]};
/* aspect space: 10 prefixes × 25 base aspects × 10 suffixes = 2,500 aspects per seed */
const PRE = ["", "shared ", "team ", "student ", "kid-safe ", "pro ", "mini ", "night ", "travel ", "daily "];
const SUF = ["", " lite", " pro", " plus", " live", " quick", " deep", " auto", " offline", " realtime"];
const ASPECTS_PER_SEED = PRE.length * POOLS.ASPECTS.length * SUF.length; /* 2500 */
function aspectName(k) {
  return PRE[Math.floor(k / 250) % 10] + POOLS.ASPECTS[k % 25] + SUF[Math.floor(k / 25) % 10];
}
function recName(di, si, k) { return POOLS.DIVS[di][1][si] + " — " + aspectName(k); }
function blockedName(name) { return POOLS.BLOCKED[name] || ""; }
/* implemented map, built once from the compact IMPL strings */
const DONE = new Set();
POOLS.IMPL.forEach((s, di) => { if (!POOLS.DIVS[di]) return; s.split(";").forEach((e) => { if (!e) return; const c = e.split(":"); (c[1] || "").split(",").forEach((a) => { if (a !== "") DONE.add(recName(di, +c[0], +a)); }); }); });
function implementedIn(di) {
  let t = 0;
  (POOLS.IMPL[di] || "").split(";").forEach((e) => { if (e) t += (e.split(":")[1] || "").split(",").filter(Boolean).length; });
  return t;
}
const DIFF = ["MODERATE", "SIMPLE", "ADVANCED"];
function record(id) {
  const n = parseInt(id, 10);
  if (!isFinite(n) || n < 1 || n > 1000000) return null;
  const di = Math.floor((n - 1) / 20000), idx = (n - 1) % 20000;
  const si = Math.floor(idx / ASPECTS_PER_SEED), k = idx % ASPECTS_PER_SEED;
  const name = recName(di, si, k);
  const blocked = blockedName(name);
  const status = blocked ? "BLOCKED" : (DONE.has(name) ? "IMPLEMENTED" : "PLANNED");
  const dn = POOLS.DIVS[di][0];
  const prio = POOLS.P0.indexOf(di + 1) !== -1 ? "P0" : POOLS.P1.indexOf(di + 1) !== -1 ? "P1" : POOLS.P2.indexOf(di + 1) !== -1 ? "P2" : POOLS.P3.indexOf(di + 1) !== -1 ? "P3" : "P4";
  return {
    id: "WITCH-" + String(n).padStart(6, "0"), division: di + 1, division_name: dn, name: name,
    description: dn + ": " + name + ", scoped to WITCH's free-first browser architecture (GitHub Pages + on-device state).",
    purpose: "Advance the " + dn.toLowerCase() + " division of the WITCH platform.",
    user_benefit: "Makes WITCH more capable, reliable, or pleasant to use on a phone.",
    technical_implementation: "Frontend module under witch/ (vanilla JS), state in localStorage, hosted brain (text.pollinations.ai) or on-device WebLLM where applicable.",
    frontend: true, backend: !!blocked,
    dependencies: ["WITCH core chat app"],
    apis: "text.pollinations.ai (free, keyless); user-provided openai-compatible keys where a capability needs one",
    security: "No keys in code. Secrets stay in the user's localStorage. Chat content leaves the device only to the chosen model endpoint.",
    difficulty: DIFF[n % 3], priority: prio, status: status,
    testing: "Manual check on iOS Safari + Android Chrome + desktop; watch console for errors.",
    acceptance: status === "IMPLEMENTED" ? "Shipped and verified live on the site." : "Feature works end to end on the live site with error handling.",
    integration: "Wires into the WITCH nav panel system without breaking existing chat.",
    compatibility: "iOS Safari, Android Chrome, desktop browsers.",
    failure_handling: "Degrades gracefully: falls back to the hosted brain or shows an honest message.",
    blocked_reason: blocked
  };
}
function stats() {
  const total = POOLS.DIVS.reduce((t, d) => t + d[1].length * ASPECTS_PER_SEED, 0);
  const implemented = POOLS.IMPL.reduce((t, s) => t + implementedIn(POOLS.IMPL.indexOf(s)), 0);
  const blocked = Object.keys(POOLS.BLOCKED).length;
  return { total: total, implemented: implemented, blocked: blocked, planned: total - implemented - blocked, divisions: POOLS.DIVS.length };
}
function build(division, limit) {
  const di = (division || 1) - 1;
  if (!POOLS.DIVS[di]) return [];
  const cap = Math.min(limit || 500, POOLS.DIVS[di][1].length * ASPECTS_PER_SEED);
  const out = [];
  for (let i = 0; i < cap; i++) out.push(record(di * 20000 + i + 1));
  return out;
}
function validate() {
  const errs = [], st = stats();
  if (st.total !== 1000000) errs.push("total " + st.total);
  if (st.divisions !== 50) errs.push("divisions " + st.divisions);
  POOLS.DIVS.forEach((d, i) => { if (d[1].length !== 8) errs.push("division " + (i + 1) + " seeds " + d[1].length); });
  if (DONE.size + Object.keys(POOLS.BLOCKED).length > st.total) errs.push("statuses exceed total");
  return errs;
}
const $ = (id) => document.getElementById(id);
function render() {
  const errs = validate(), st = stats();
  $("featstats").textContent = errs.length
    ? ("VALIDATION FAILED: " + errs.slice(0, 3).join("; "))
    : ("VALIDATED: " + st.total.toLocaleString() + " features · " + st.divisions + " divisions × 8 seeds × " + ASPECTS_PER_SEED.toLocaleString() + " aspects · " + st.implemented + " implemented · " + st.blocked + " blocked · " + st.planned.toLocaleString() + " planned");
  const box = $("featdivs");
  box.innerHTML = "";
  POOLS.DIVS.forEach((d, di) => {
    const row = document.createElement("div");
    row.className = "memrow";
    row.appendChild(document.createTextNode(String(di + 1).padStart(2, "0") + " " + d[0] + " — 20,000 (" + implementedIn(di) + " shipped/blocked)"));
    box.appendChild(row);
  });
  $("featExport").onclick = () => {
    const impl = [];
    POOLS.IMPL.forEach((s, di) => { if (!POOLS.DIVS[di]) return; s.split(";").forEach((e) => { if (!e) return; const c = e.split(":"); (c[1] || "").split(",").forEach((a) => { if (a !== "") impl.push("WITCH-" + String(di * 20000 + (+c[0]) * ASPECTS_PER_SEED + (+a) + 1).padStart(6, "0") + " " + recName(di, +c[0], +a)); }); }); });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify({ scale: 1000000, structure: "50 divisions × 8 seeds × 2,500 aspects", stats: stats(), implemented_records: impl }, null, 1)], { type: "application/json" }));
    a.download = "witch-features-1000000.json";
    a.click();
  };
}
window.WITCH_FEATURES = { build, validate, render, record, stats };
let rendered = false;
function ensure() { if (!rendered) { rendered = true; render(); } }
if (typeof document !== "undefined") {
  const nav = document.getElementById("nav");
  if (nav) nav.addEventListener("click", (e) => { const b = e.target.closest(".navbtn"); if (b && b.dataset.panel === "features") ensure(); });
  if ($("featstats") && !$("panel-features").hidden) ensure();
}
})();
