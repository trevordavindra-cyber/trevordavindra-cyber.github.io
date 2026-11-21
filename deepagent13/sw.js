const C='ds13-v1';
self.addEventListener('install',function(e){self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==C}).map(function(k){return caches.delete(k)}))}))});
self.addEventListener('fetch',function(e){
 if(e.request.method!=='GET')return;
 e.respondWith(fetch(e.request).then(function(r){var c=r.clone();caches.open(C).then(function(cc){cc.put(e.request,c)});return r}).catch(function(){return caches.match(e.request)}));
});