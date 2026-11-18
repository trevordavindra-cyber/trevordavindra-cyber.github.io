const CACHE='hell295-dw-v325';
const ASSETS=['./','./index.html','../hell264/upgrade240.js','../hell265/upgrade241.js','../hell266/upgrade242.js','../hell267/upgrade243.js','../hell268/upgrade244.js','../hell268/upgrade245.js','../hell268/upgrade246.js','../hell268/upgrade247.js','../hell268/upgrade248.js','../hell268/upgrade249.js','../hell268/upgrade250.js','../hell268/upgrade251.js','../hell268/upgrade252.js','../hell268/upgrade253.js','../hell268/upgrade254.js','../hell268/upgrade255.js','../hell268/upgrade256.js','../hell268/upgrade257.js','../hell268/upgrade258.js','../hell268/upgrade259.js','../hell268/upgrade260.js','../hell268/upgrade261.js','../hell268/upgrade262.js','../hell268/upgrade263.js','../hell295/index.html','../hell281/index.html','../hell151/index.html','../hell24/app.js'];
self.addEventListener('install',function(e){
 e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ASSETS)}).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){
 e.waitUntil(caches.keys().then(function(keys){return Promise.all(keys.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
 if(e.request.method!=='GET')return;
 var u=e.request.url;
 if(/pollinations\.ai|translate\.google\.com|api\.duckduckgo\.com|wikipedia\.org|r\.jina\.ai|api\.allorigins\.win|aihorde\.net|www\.bing\.com/.test(u))return;
 e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(function(hit){return hit||fetch(e.request)}));
});
