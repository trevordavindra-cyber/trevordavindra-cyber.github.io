const CACHE='hell31-dw-v39';
const ASSETS=['./','./index.html','./mods3.js','./mods2.js','./phase2.css','../hell29/app.js','../hell29/mods.js','../hell29/extra.css','../hell28/style.css','../hell24/app.js','../hell24/manifest.json','../hell24/icon.svg'];
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
