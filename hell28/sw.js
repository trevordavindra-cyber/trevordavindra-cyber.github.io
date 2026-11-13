const CACHE='hell28-dw-v34';
const ASSETS=['./','./index.html','./app.js','./style.css','./ui.js','../hell24/app.js','../hell24/manifest.json','../hell24/icon.svg'];
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
 e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||fetch(e.request)));
});
