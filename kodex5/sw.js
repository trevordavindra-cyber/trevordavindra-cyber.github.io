var C = "kodex5-v5";
var BASE = ["../kodex3/styles.css?v=3", "../kodex3/app.js?v=3", "../kodex4/tools.css", "../kodex3/up1.js", "../kodex3/up2.js", "../kodex3/up3.js", "../kodex3/up4.js", "../kodex3/up5.js", "../kodex3/up6.js", "../kodex3/up7.js", "../kodex3/up8.js", "../kodex4/up9.js", "../kodex4/up10.js", "../kodex4/up11.js", "../kodex4/up12.js", "../kodex4/up13.js", "../kodex4/up14.js", "../kodex4/up15.js", "../kodex4/up16.js", "../kodex4/up17.js", "../kodex4/up18.js"];
var LOCAL = ["./up19.js", "./up20.js", "./up21.js", "./up22.js", "./up23.js", "./up24.js", "./up25.js", "./up26.js", "./up27.js", "./up28.js"];
var ASSETS = ["./", "./index.html"].concat(BASE, LOCAL);
self.addEventListener("install", function(e){
  e.waitUntil(caches.open(C).then(function(c){ return c.addAll(ASSETS); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== C; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener("fetch", function(e){
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(function(hit){
      return hit || fetch(e.request).then(function(res){
        var copy = res.clone();
        caches.open(C).then(function(c){ try{ c.put(e.request, copy); }catch(err){} });
        return res;
      }).catch(function(){ return caches.match("./index.html"); });
    })
  );
});
