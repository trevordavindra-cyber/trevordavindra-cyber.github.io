var C = "kodex7-v7";
var BASE = ["../kodex3/styles.css?v=3", "../kodex4/tools.css", "../kodex3/app.js?v=3", "../kodex3/up1.js", "../kodex3/up2.js", "../kodex3/up3.js", "../kodex3/up4.js", "../kodex3/up5.js", "../kodex3/up6.js", "../kodex3/up7.js", "../kodex3/up8.js", "../kodex4/up9.js", "../kodex4/up10.js", "../kodex4/up11.js", "../kodex4/up12.js", "../kodex4/up13.js", "../kodex4/up14.js", "../kodex4/up15.js", "../kodex4/up16.js", "../kodex4/up17.js", "../kodex4/up18.js", "../kodex5/up19.js", "../kodex5/up20.js", "../kodex5/up21.js", "../kodex5/up22.js", "../kodex5/up23.js", "../kodex5/up24.js", "../kodex5/up25.js", "../kodex5/up26.js", "../kodex5/up27.js", "../kodex5/up28.js", "../kodex6/up29.js", "../kodex6/up30.js", "../kodex6/up31.js", "../kodex6/up32.js", "../kodex6/up33.js", "../kodex6/up34.js", "../kodex6/up35.js", "../kodex6/up36.js", "../kodex6/up37.js", "../kodex6/up38.js"];
var LOCAL = ["./up39.js", "./up40.js", "./up41.js", "./up42.js", "./up43.js", "./up44.js", "./up45.js", "./up46.js", "./up47.js", "./up48.js"];
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
