/* sw.js — offline cache for Forge. Assets render client-side and the
   gallery lives in localStorage, so the app keeps working with no signal. */
const CACHE = "forge-v1";
const CORE = ["index.html", "style.css", "app.js", "forge-engine.js", "forge-palettes.js", "presets.js", "ui-kits.js", "texture-recipes.js", "prompt-packs.js", "names.js", "prompt-guide.html"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  /* generated images come from the network and are never cached here */
  if (url.hostname.includes("pollinations")) return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      if (res.ok && url.origin === location.origin) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match("index.html")))
  );
});
