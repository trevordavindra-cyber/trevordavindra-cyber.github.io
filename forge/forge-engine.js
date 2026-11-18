/* ============================================================
   forge-engine.js
   The prompt composition engine.

   Takes a user's idea plus the picks they made in the UI
   (asset type, style, quality, style reference) and turns it
   into a single rich text prompt the image model can use.

   The engine never talks to the network. It is pure string
   and color logic so it can be tested on its own.
   ============================================================ */

"use strict";

/* Roblox-friendly size presets. Sizes are chosen so nothing gets
   cropped by Roblox upload rules (max 8000px per side, PNG or JPG). */
const FORGE_SIZES = {
  icon:    { w: 512,  h: 512,  label: "Game icon",    hint: "Creator Hub game icon slot" },
  thumb:   { w: 1280, h: 720,  label: "Thumbnail",    hint: "16:9 game thumbnail" },
  uibutton:{ w: 1024, h: 512,  label: "UI button",    hint: "ImageLabel ready" },
  panel:   { w: 1024, h: 1024, label: "UI panel",     hint: "Inventory / shop frame" },
  skill:   { w: 512,  h: 512,  label: "Skill icon",   hint: "ActionBar square icon" },
  banner:  { w: 1536, h: 512,  label: "Banner",       hint: "Group / social banner" },
  gfx:     { w: 1024, h: 1024, label: "GFX art",      hint: "Free square art" },
  loading: { w: 768,  h: 1344, label: "Loading screen", hint: "Phone-shaped splash" },
};

/* Per-type prompt scaffolds. Each one tells the model what makes
   that asset type read correctly on Roblox. */
const FORGE_SCAFFOLDS = {
  icon: {
    prefix: "professional mobile game icon artwork",
    body: "bold, readable at small size, centered single subject, clean background",
    suffix: "app store quality, high contrast, no text",
  },
  thumb: {
    prefix: "roblox game thumbnail artwork, wide composition",
    body: "multiple characters or hero subject, dynamic action pose, vibrant scene",
    suffix: "eye catching youtube thumbnail energy, no watermark",
  },
  uibutton: {
    prefix: "game UI button design",
    body: "flat UI element, rounded corners, clear label space, subtle inner glow",
    suffix: "clean vector look, transparent-looking dark background, no text",
  },
  panel: {
    prefix: "game UI panel design",
    body: "framed panel with slots grid, ornate border, cohesive with game UI",
    suffix: "flat UI mockup, straight-on view, no text labels",
  },
  skill: {
    prefix: "game skill ability icon",
    body: "single iconic subject, tight crop, glowing rim, readable at 48px",
    suffix: "square icon, dark background, no text",
  },
  banner: {
    prefix: "wide banner artwork",
    body: "horizontal composition, key art on the left, clear space on the right",
    suffix: "social banner quality, no text",
  },
  gfx: {
    prefix: "high quality game GFX artwork",
    body: "hero character or scene, cinematic framing",
    suffix: "portfolio quality render, no watermark",
  },
  loading: {
    prefix: "vertical loading screen artwork",
    body: "atmospheric scene, title space at top, immersive mood",
    suffix: "mobile splash screen art, no text",
  },
};

/* Quality tiers map to words the model responds to. */
const FORGE_QUALITY = {
  fast: { tags: "clean render", enhance: false },
  high: { tags: "extremely detailed, sharp focus, professional lighting, 8k quality, trending game art", enhance: true },
};

/* Build the final prompt string. */
function forgeBuildPrompt(opts) {
  const {
    idea = "",
    type = "gfx",
    style = "",
    effects = [],
    lighting = "",
    palette = null,
    refColors = null,
    quality = "high",
    extra = "",
  } = opts;

  const scaffold = FORGE_SCAFFOLDS[type] || FORGE_SCAFFOLDS.gfx;
  const parts = [];

  if (idea && idea.trim()) parts.push(idea.trim());
  parts.push(scaffold.prefix, scaffold.body);

  if (style) parts.push(style);
  if (effects && effects.length) parts.push(effects.join(", "));
  if (lighting) parts.push(lighting);

  /* Style reference wins: its extracted colors get spelled out so the
     model locks onto them across every asset in the batch. */
  if (refColors && refColors.length) {
    parts.push("color palette locked to: " + refColors.join(", "));
    parts.push("match the reference image's visual style exactly");
  } else if (palette && palette.colors && palette.colors.length) {
    parts.push("color palette: " + palette.colors.join(", "));
  }

  const q = FORGE_QUALITY[quality] || FORGE_QUALITY.high;
  parts.push(q.tags);
  parts.push(scaffold.suffix);
  if (extra && extra.trim()) parts.push(extra.trim());

  return parts.filter(Boolean).join(", ");
}

/* Pull the dominant colors out of an image via canvas sampling.
   Downsamples to 48px, buckets hues, returns the 5 strongest. */
function forgeExtractColors(imgEl) {
  const SIZE = 48;
  const c = document.createElement("canvas");
  c.width = SIZE; c.height = SIZE;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(imgEl, 0, 0, SIZE, SIZE);
  const data = ctx.getImageData(0, 0, SIZE, SIZE).data;

  const buckets = {};
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
    if (a < 200) continue;
    const [h, s, l] = rgbToHsl(r, g, b);
    if (s < 0.12 && l < 0.15) continue; /* near-black */
    if (l > 0.92 && s < 0.10) continue; /* near-white */
    const key = Math.round(h / 24) + "_" + Math.round(s / 0.34) + "_" + Math.round(l / 0.34);
    if (!buckets[key]) buckets[key] = { count: 0, r: 0, g: 0, b: 0 };
    const bk = buckets[key];
    bk.count++; bk.r += r; bk.g += g; bk.b += b;
  }

  const sorted = Object.values(buckets).sort((a, b) => b.count - a.count);
  const picked = [];
  for (const bk of sorted) {
    const r = Math.round(bk.r / bk.count), g = Math.round(bk.g / bk.count), b = Math.round(bk.b / bk.count);
    const hex = rgbToHex(r, g, b);
    /* skip colors visually too close to one already picked */
    if (picked.some(p => colorDistance(p, hex) < 48)) continue;
    picked.push(hex);
    if (picked.length >= 5) break;
  }
  return picked;
}

/* --- tiny color helpers --- */
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return [h * 360, s, l];
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");
}

function hexToRgb(hex) {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

function colorDistance(hexA, hexB) {
  const a = hexToRgb(hexA), b = hexToRgb(hexB);
  return Math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2);
}

/* Compose the pollinations image URL. Public free endpoint, no key. */
function forgeImageUrl(prompt, w, h, seed, model, enhance) {
  const enc = encodeURIComponent(prompt.slice(0, 1400));
  const params = new URLSearchParams({
    width: String(w),
    height: String(h),
    seed: String(seed),
    model: model || "flux",
    nologo: "true",
    referrer: "forgegui-clone",
  });
  if (enhance) params.set("enhance", "true");
  return "https://image.pollinations.ai/prompt/" + enc + "?" + params.toString();
}

/* Deterministic-but-varied seed generator */
function forgeRandomSeed() {
  return Math.floor(Math.random() * 1000000000);
}
