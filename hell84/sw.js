const CACHE='hell84-dw-v93';
const ASSETS=[
  '../hell83/upgrade.js','../hell83/upgrade2.js','../hell83/upgrade3.js','../hell83/upgrade4.js','../hell83/upgrade5.js','../hell83/upgrade6.js','../hell83/upgrade7.js','../hell83/upgrade8.js','../hell83/upgrade9.js','../hell83/upgrade10.js','../hell83/upgrade11.js','../hell83/upgrade12.js','../hell83/upgrade13.js','../hell83/upgrade14.js','../hell83/upgrade15.js','../hell83/upgrade16.js','../hell83/upgrade17.js','../hell83/upgrade18.js','../hell83/upgrade19.js','../hell83/upgrade20.js','../hell83/upgrade21.js','../hell83/upgrade22.js','../hell83/upgrade23.js','../hell83/upgrade24.js','../hell83/upgrade25.js','../hell83/upgrade26.js','../hell83/upgrade27.js','../hell83/upgrade28.js','../hell83/upgrade29.js','../hell83/upgrade30.js','../hell83/upgrade31.js','../hell83/upgrade32.js','../hell83/upgrade33.js','../hell83/upgrade34.js','../hell83/upgrade35.js','../hell83/upgrade36.js','../hell83/upgrade37.js','../hell83/upgrade38.js','../hell83/upgrade39.js','../hell83/upgrade40.js','../hell83/upgrade41.js','../hell83/upgrade42.js','../hell83/upgrade43.js','../hell83/upgrade44.js',
  '../hell83/upgrade45.js',
  '../hell83/upgrade46.js',
  '../hell83/upgrade47.js','../hell83/upgrade48.js','../hell83/upgrade49.js','../hell83/upgrade50.js','./','./index.html','./guard.js','../hell83/mods3.js','../hell30/mods2.js','../hell83/cine.js','../hell83/phase2.css','./app.js','../hell29/mods.js','../hell83/extra.css','../hell83/style.css','../hell24/app.js','../hell24/manifest.json','../hell24/icon.svg'];
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
