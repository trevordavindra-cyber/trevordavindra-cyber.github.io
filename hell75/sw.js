const CACHE='hell75-dw-v83';
const ASSETS=[
  './upgrade.js','./upgrade2.js','./upgrade3.js','./upgrade4.js','./upgrade5.js','./upgrade6.js','./upgrade7.js',
  './upgrade8.js','./upgrade9.js','./upgrade10.js','./upgrade11.js','./upgrade12.js','./upgrade13.js','./upgrade14.js',
  './upgrade15.js','./upgrade16.js','./upgrade17.js','./upgrade18.js','./upgrade19.js','./upgrade20.js','./upgrade21.js',
  './upgrade22.js','./upgrade23.js','./upgrade24.js','./upgrade25.js','./upgrade26.js','./upgrade27.js','./upgrade28.js',
  './upgrade29.js','./upgrade30.js','./upgrade31.js','./upgrade32.js','./upgrade33.js','./upgrade34.js','./upgrade35.js',
  './upgrade36.js','./upgrade37.js','./upgrade38.js','./upgrade39.js','./upgrade40.js','./upgrade41.js','./upgrade42.js',
  './upgrade43.js',
  '../hell24/manifest.json','../hell24/icon.svg',
  '../hell28/style.css','../hell29/extra.css','../hell29/app.js','../hell30/mods2.js',
  './phase2.css','./mods3.js','./cine.js'
];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(/pollinations\.ai|duckduckgo|wikipedia|translate\./.test(u.hostname))return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(c2=>c2.put(e.request,c));return r;}).catch(()=>caches.match('./index.html'))));
});