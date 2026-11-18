/* ============================================================
   app.js — Forge UI logic
   Generator, style reference, results, gallery, export, lightbox
   ============================================================ */

"use strict";

/* ---------- tiny helpers ---------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function toast(msg, kind) {
  const t = $("#toast");
  t.textContent = msg;
  t.className = "toast" + (kind ? " " + kind : "");
  t.hidden = false;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { t.hidden = true; }, 2600);
}

function fmtTime(ts) {
  const d = new Date(ts);
  return (d.getMonth() + 1) + "/" + d.getDate() + " " +
    d.getHours().toString().padStart(2, "0") + ":" + d.getMinutes().toString().padStart(2, "0");
}

/* ---------- state ---------- */
const state = {
  preset: "icon",
  style: "",
  quality: "high",
  model: "flux",
  count: 2,
  refColors: null,
  results: [],
  history: [],
};

const LS_KEY = "forge_history_v1";
const LS_STATS = "forge_stats_v1";

function loadHistory() {
  try {
    state.history = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch (e) { state.history = []; }
}
function saveHistory() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state.history.slice(0, 90)));
  } catch (e) { /* storage full — ignore */ }
}
function bumpStats(n) {
  try {
    const s = JSON.parse(localStorage.getItem(LS_STATS) || "{}");
    s.count = (s.count || 0) + n;
    localStorage.setItem(LS_STATS, JSON.stringify(s));
    return s.count;
  } catch (e) { return 0; }
}

/* ---------- controls wiring ---------- */
function wirePresets() {
  $$("#presetGrid .preset").forEach(btn => {
    btn.addEventListener("click", () => {
      $$("#presetGrid .preset").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.preset = btn.dataset.preset;
    });
  });
}

function wireStyles() {
  $$("#styleRow .stylebtn").forEach(btn => {
    btn.addEventListener("click", () => {
      $$("#styleRow .stylebtn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.style = btn.dataset.style || "";
    });
  });
}

function wireChips() {
  $$("#ideaChips .chip").forEach(chip => {
    chip.addEventListener("click", () => {
      $("#promptInput").value = chip.dataset.fill;
      $("#promptInput").focus();
    });
  });
}

function wireAdvanced() {
  $("#advToggle").addEventListener("click", () => {
    const p = $("#advPanel");
    p.hidden = !p.hidden;
    $("#advToggle").textContent = p.hidden ? "advanced options ▾" : "advanced options ▴";
  });
  $("#modelSelect").addEventListener("change", e => { state.model = e.target.value; });
  $("#qualitySelect").addEventListener("change", e => { state.quality = e.target.value; });
  $("#countSelect").addEventListener("change", e => { state.count = parseInt(e.target.value, 10); });
}

/* ---------- style reference ---------- */
function wireRef() {
  $("#refPick").addEventListener("click", () => $("#refInput").click());
  $("#refInput").addEventListener("change", onRefFile);
  $("#refClear").addEventListener("click", clearRef);
}

function onRefFile(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      $("#refImg").src = reader.result;
      $("#refPreview").hidden = false;
      $("#refHint").textContent = "Reference locked. Forge will match its colors and vibe.";
      try {
        state.refColors = forgeExtractColors(img);
        renderRefSwatches();
        toast("Style reference locked: " + state.refColors.join(" "), "good");
      } catch (e) {
        toast("Couldn't read that image, try another");
      }
    };
    img.onerror = () => toast("Couldn't read that image, try another");
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function clearRef() {
  state.refColors = null;
  $("#refPreview").hidden = true;
  $("#refInput").value = "";
  $("#refHint").textContent = "Forge matches its colors and vibe across every asset you make.";
  const sw = $("#refSwatches");
  if (sw) sw.remove();
}

function renderRefSwatches() {
  let sw = $("#refSwatches");
  if (sw) sw.remove();
  sw = document.createElement("div");
  sw.id = "refSwatches";
  sw.className = "ref-swatches";
  for (const c of state.refColors || []) {
    const d = document.createElement("div");
    d.className = "swatch";
    d.style.background = c;
    d.title = c;
    sw.appendChild(d);
  }
  $("#refPreview").after(sw);
}

/* ---------- generation ---------- */
function currentPrompt() {
  const idea = $("#promptInput").value;
  const effects = [];
  if (state.quality === "high") effects.push("glowing edges");
  const palette = pickPalette();
  return forgeBuildPrompt({
    idea,
    type: state.preset,
    style: state.style,
    effects,
    lighting: pickLighting(),
    palette,
    refColors: state.refColors,
    quality: state.quality,
    extra: $("#extraInput").value,
  });
}

function pickPalette() {
  if (state.refColors) return null;
  if (!Array.isArray(window.PALETTES) || !PALETTES.length) return null;
  return PALETTES[Math.floor(Math.random() * PALETTES.length)];
}

function pickLighting() {
  if (!Array.isArray(window.FORGE_LIGHTING) || !FORGE_LIGHTING.length) return "";
  return FORGE_LIGHTING[Math.floor(Math.random() * FORGE_LIGHTING.length)];
}

function wireGenerate() {
  $("#generateBtn").addEventListener("click", generateNow);
  $("#promptInput").addEventListener("keydown", e => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") generateNow();
  });
}

function generateNow() {
  const prompt = currentPrompt();
  if (!prompt || prompt.length < 12) {
    toast("Type what you want to generate first");
    $("#promptInput").focus();
    return;
  }
  const size = FORGE_SIZES[state.preset] || FORGE_SIZES.gfx;
  const seedsBase = parseInt($("#seedInput").value, 10);
  const n = state.count;
  $("#resultsEmpty") && ($("#resultsEmpty").hidden = true);

  for (let i = 0; i < n; i++) {
    const seed = Number.isFinite(seedsBase) ? seedsBase + i : forgeRandomSeed();
    const url = forgeImageUrl(prompt, size.w, size.h, seed, state.model, FORGE_QUALITY[state.quality].enhance);
    spawnResult({ prompt, url, seed, w: size.w, h: size.h, label: size.label });
  }
  const total = bumpStats(n);
  $("#creditsPill").textContent = total + " made";
  toast("Generating " + n + (n === 1 ? " asset…" : " assets…"), "good");
}

function spawnResult(item) {
  const grid = $("#resultsGrid");
  const card = document.createElement("div");
  card.className = "result-card";
  card.style.setProperty("--ar", item.w / item.h);

  const sk = document.createElement("div");
  sk.className = "skeleton";
  sk.innerHTML = "<span>⏳ forging…</span><span class='sk-sub'>" + item.w + "×" + item.h + "</span>";
  card.appendChild(sk);

  const img = document.createElement("img");
  img.alt = item.prompt.slice(0, 60);
  img.loading = "lazy";
  img.decoding = "async";
  img.style.display = "none";

  img.onload = () => {
    sk.remove();
    img.style.display = "block";
    card.appendChild(overlayFor(item));
    addToHistory(item);
  };
  img.onerror = () => {
    sk.innerHTML = "<span>⚠ generation hiccup</span><span class='sk-sub'>tap to retry</span>";
    card.classList.add("error");
    sk.addEventListener("click", () => {
      img.src = forgeImageUrl(item.prompt, item.w, item.h, forgeRandomSeed(), state.model, true);
    }, { once: true });
  };
  img.src = item.url;
  card.appendChild(img);

  card.addEventListener("click", (e) => {
    if (e.target.closest(".overlay")) return;
    if (img.naturalWidth) openLightbox(item);
  });

  grid.prepend(card);
  state.results.unshift(item);
}

function overlayFor(item) {
  const ov = document.createElement("div");
  ov.className = "overlay";
  const dl = document.createElement("button");
  dl.className = "primary";
  dl.textContent = "⬇ save";
  dl.addEventListener("click", (e) => { e.stopPropagation(); downloadAsset(item); });
  const again = document.createElement("button");
  again.textContent = "↻ again";
  again.addEventListener("click", (e) => {
    e.stopPropagation();
    const url = forgeImageUrl(item.prompt, item.w, item.h, forgeRandomSeed(), state.model, FORGE_QUALITY[state.quality].enhance);
    spawnResult({ ...item, url, seed: forgeRandomSeed() });
  });
  ov.append(dl, again);
  return ov;
}

/* ---------- history / gallery ---------- */
function addToHistory(item) {
  state.history.unshift({ ...item, ts: Date.now() });
  if (state.history.length > 90) state.history.length = 90;
  saveHistory();
  renderGallery();
}

function renderGallery() {
  const grid = $("#galleryGrid");
  grid.innerHTML = "";
  if (!state.history.length) {
    grid.innerHTML = '<div class="empty-state"><div class="empty-art">🗃️</div><p>Nothing saved yet — generate something above.</p></div>';
    return;
  }
  for (const item of state.history) {
    const card = document.createElement("div");
    card.className = "result-card";
    card.style.setProperty("--ar", 1);
    const img = document.createElement("img");
    img.src = item.url;
    img.loading = "lazy";
    img.alt = item.prompt.slice(0, 60);
    const badge = document.createElement("span");
    badge.className = "gallery-date";
    badge.textContent = fmtTime(item.ts || Date.now());
    const ov = overlayFor(item);
    card.append(img, badge, ov);
    card.addEventListener("click", (e) => {
      if (e.target.closest(".overlay")) return;
      openLightbox(item);
    });
    grid.appendChild(card);
  }
}

function wireGallery() {
  $("#clearGalleryBtn").addEventListener("click", () => {
    if (!state.history.length) return toast("Gallery is already empty");
    state.history = [];
    saveHistory();
    renderGallery();
    toast("Gallery cleared", "good");
  });
}

/* ---------- export ---------- */
async function downloadAsset(item) {
  try {
    const res = await fetch(item.url, { mode: "cors" });
    if (!res.ok) throw new Error("bad status");
    const blob = await res.blob();
    triggerDownload(blob, filenameFor(item));
    toast("Saved PNG", "good");
  } catch (e) {
    window.open(item.url, "_blank");
    toast("Opened in a tab — long-press to save", "good");
  }
}

async function zipAll() {
  const items = state.results.slice(0, 12);
  if (!items.length) return toast("Generate something first");
  if (typeof JSZip === "undefined") return toast("Zip library didn't load, check connection");
  toast("Packing zip…");
  const zip = new JSZip();
  let i = 0;
  for (const item of items) {
    try {
      const res = await fetch(item.url, { mode: "cors" });
      if (res.ok) zip.file(filenameFor(item, i++), await res.blob());
    } catch (e) { /* skip unreachable */ }
  }
  const blob = await zip.generateAsync({ type: "blob" });
  triggerDownload(blob, "forge-assets-" + Date.now() + ".zip");
  toast("Zip ready", "good");
}

function filenameFor(item, idx) {
  const type = (FORGE_SIZES[state.preset] || {}).label || "asset";
  const slug = type.toLowerCase().replace(/\s+/g, "-");
  return "forge-" + slug + "-" + (idx != null ? idx + "-" : "") + item.seed + ".png";
}

function triggerDownload(blob, name) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
}

/* ---------- lightbox ---------- */
let lightboxItem = null;

function openLightbox(item) {
  lightboxItem = item;
  $("#lightboxImg").src = item.url;
  $("#lightbox").hidden = false;
}
function closeLightbox() {
  $("#lightbox").hidden = true;
  lightboxItem = null;
}

function wireLightbox() {
  $("#lightboxClose").addEventListener("click", closeLightbox);
  $("#lightboxBackdrop").addEventListener("click", closeLightbox);
  $("#lightboxDownload").addEventListener("click", () => lightboxItem && downloadAsset(lightboxItem));
  $("#lightboxShare").addEventListener("click", async () => {
    if (!lightboxItem) return;
    if (!navigator.share) return toast("Sharing not supported here — use download");
    try {
      const res = await fetch(lightboxItem.url, { mode: "cors" });
      const blob = await res.blob();
      const file = new File([blob], filenameFor(lightboxItem), { type: blob.type || "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "Forge asset" });
      } else {
        await navigator.share({ url: lightboxItem.url, title: "Forge asset" });
      }
    } catch (e) { /* user cancelled */ }
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });
}

/* ---------- surprise me ---------- */
function wireSurprise() {
  const btn = $("#surpriseBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const genres = Object.keys(window.FORGE_GENRES || {});
    if (!genres.length) return;
    const g = genres[Math.floor(Math.random() * genres.length)];
    const subs = FORGE_GENRES[g];
    const subject = subs[Math.floor(Math.random() * subs.length)];
    const styleKeys = Object.keys(window.FORGE_STYLES || {});
    const st = styleKeys[Math.floor(Math.random() * styleKeys.length)];
    $("#promptInput").value = subject + ", " + FORGE_STYLES[st];
    toast("Idea: " + subject + " (" + g + " / " + st + ")", "good");
  });
}

/* ---------- boot ---------- */
function boot() {
  wirePresets();
  wireStyles();
  wireChips();
  wireAdvanced();
  wireRef();
  wireGenerate();
  wireGallery();
  wireLightbox();
  wireSurprise();
  $("#zipAllBtn").addEventListener("click", zipAll);
  loadHistory();
  renderGallery();
  try {
    const s = JSON.parse(localStorage.getItem(LS_STATS) || "{}");
    if (s.count) $("#creditsPill").textContent = s.count + " made";
  } catch (e) {}
}

document.addEventListener("DOMContentLoaded", boot);

/* ============================================================
   app-extras — UI kits, prompt packs, texture recipes, names
   Loaded as a second init pass so the core stays clean.
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  /* ---- UI kits ---- */
  const kitsGrid = $("#kitsGrid");
  if (kitsGrid && Array.isArray(window.UI_KITS)) {
    UI_KITS.forEach(kit => {
      const card = document.createElement("button");
      card.className = "kit-card";
      card.innerHTML = "<h4>" + kit.name + "</h4><p>" + kit.desc + "</p>" +
        "<span class='kit-meta'>" + kit.elements.length + " pieces · " + kit.style + "</span>";
      card.addEventListener("click", () => generateKit(kit));
      kitsGrid.appendChild(card);
    });
  }

  function generateKit(kit) {
    $("#resultsEmpty") && ($("#resultsEmpty").hidden = true);
    const palette = PALETTES.filter(p => p.mood === kit.mood)[0] || PALETTES[0];
    toast("Forging " + kit.name + " set (" + kit.elements.length + " pieces)…", "good");
    kit.elements.forEach(el => {
      const prompt = forgeBuildPrompt({
        idea: kit.desc + ", " + el.name,
        type: el.w > el.h ? "uibutton" : "panel",
        style: kit.stylePrompt,
        palette,
        quality: state.quality,
        extra: "part of the " + kit.name + " UI kit, visually consistent family",
      });
      const url = forgeImageUrl(prompt, el.w, el.h, forgeRandomSeed(), state.model, true);
      spawnResult({ prompt, url, seed: forgeRandomSeed(), w: el.w, h: el.h, label: kit.name + " " + el.name });
    });
    const total = bumpStats(kit.elements.length);
    $("#creditsPill").textContent = total + " made";
    $("#generator").scrollIntoView({ behavior: "smooth" });
  }

  /* ---- prompt packs ---- */
  const packsGrid = $("#packsGrid");
  if (packsGrid && Array.isArray(window.PROMPT_PACKS)) {
    PROMPT_PACKS.forEach(pack => {
      const card = document.createElement("button");
      card.className = "pack-card";
      card.innerHTML = "<h4>" + pack.name + "</h4><p>" + pack.desc + " · " + pack.prompts.length + " assets</p>";
      card.addEventListener("click", () => {
        $("#promptInput").value = pack.prompts.join(" | ");
        toast(pack.name + " loaded — hit generate", "good");
        $("#generator").scrollIntoView({ behavior: "smooth" });
      });
      packsGrid.appendChild(card);
    });
  }

  /* ---- texture recipes ---- */
  const texGrid = $("#textureGrid");
  const texSearch = $("#textureSearch");
  function renderTextures(filter) {
    if (!texGrid || !Array.isArray(window.TEXTURE_RECIPES)) return;
    texGrid.innerHTML = "";
    const list = TEXTURE_RECIPES.filter(t =>
      !filter || t.name.toLowerCase().includes(filter) || t.tags.some(x => x.includes(filter)));
    list.slice(0, 40).forEach(tex => {
      const card = document.createElement("button");
      card.className = "texture-card";
      card.innerHTML = tex.name + "<div class='tex-tags'>" + tex.tags.join(" · ") + "</div>";
      card.addEventListener("click", () => {
        const url = forgeImageUrl(forgeBuildPrompt({ idea: tex.prompt, type: "gfx", quality: "high" }), tex.w, tex.h, forgeRandomSeed(), state.model, true);
        spawnResult({ prompt: tex.prompt, url, seed: forgeRandomSeed(), w: tex.w, h: tex.h, label: tex.name });
        toast("Forging " + tex.name + "…", "good");
        $("#generator").scrollIntoView({ behavior: "smooth" });
      });
      texGrid.appendChild(card);
    });
    if (!list.length) texGrid.innerHTML = "<p class='empty-sub'>No texture matches that.</p>";
  }
  renderTextures("");
  if (texSearch) texSearch.addEventListener("input", e => renderTextures(e.target.value.trim().toLowerCase()));

  /* ---- random name button in advanced panel ---- */
  const adv = $("#advPanel");
  if (adv) {
    const row = document.createElement("div");
    row.style.marginTop = "12px";
    const btn = document.createElement("button");
    btn.className = "linklike";
    btn.textContent = "🎲 random asset name";
    btn.addEventListener("click", () => {
      if (typeof forgeRandomName === "function") {
        navigator.clipboard && navigator.clipboard.writeText(forgeRandomName());
        toast(forgeRandomName(), "good");
      }
    });
    row.appendChild(btn);
    adv.appendChild(row);
  }
});
