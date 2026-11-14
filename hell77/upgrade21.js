// ILLUMINATI upgrade #21: hl21_badge (v18.27)
// Adds a tiny fixed badge after 20s reading ILLUMINATI v18.27 in 10px monospace, semi‑transparent.
// Additive only. Injected by overnight upgrade run.
(() => {
  if (!document || !document.body) return;
  setTimeout(() => {
    const badge = document.createElement('div');
    badge.textContent = 'ILLUMINATI v18.27';
    badge.style.cssText = 'position:fixed;bottom:0;left:0;font:10px monospace;opacity:0.5;pointer-events:none;';
    document.body.appendChild(badge);
  }, 20000);
})();
