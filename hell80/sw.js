const CACHE='hell80-dw-v88';
const ASSETS=[
  './upgrade.js','./upgrade2.js','./upgrade3.js','./upgrade4.js','./upgrade5.js','./upgrade6.js','./upgrade7.js','./upgrade8.js','./upgrade9.js','./upgrade10.js','./upgrade11.js','./upgrade12.js','./upgrade13.js','./upgrade14.js','./upgrade15.js','./upgrade16.js','./upgrade17.js','./upgrade18.js','./upgrade19.js','./upgrade20.js','./upgrade21.js','./upgrade22.js','./upgrade23.js','./upgrade24.js','./upgrade25.js','./upgrade26.js','./upgrade27.js','./upgrade28.js','./upgrade29.js','./upgrade30.js','./upgrade31.js','./upgrade32.js','./upgrade33.js','./upgrade34.js','./upgrade35.js','./upgrade36.js','./upgrade37.js','./upgrade38.js','./upgrade39.js','./upgrade40.js','./upgrade41.js','./upgrade42.js','./upgrade43.js','./upgrade44.js',
  './upgrade45.js',
  './upgrade46.js',
  './upgrade47.js','./upgrade48.js','./','./index.html','./mods3.js','./mods2.js','./cine.js','./phase2.css','../hell29/app.js','../hell29/mods.js','../hell29/extra.css','../hell28/style.css','../hell24/app.js','../hell24/manifest.json','../hell24/icon.svg'];
self.addEventListener('install',e=>{
 e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
 e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET') return;
 const url=new URL(e.request.url);
 if(url.hostname==='text.pollinations.ai') return;
 if(url.hostname==='image.pollinations.ai') return;
 if(url.hostname==='translate.google.com') return;
 if(url.hostname==='api.duckduckgo.com') return;
 if(url.hostname==='en.wikipedia.org') return;
 e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||fetch(e.request)));
});