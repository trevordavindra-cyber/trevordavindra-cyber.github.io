var C = "kodex9-v9";
var BASE = ["../kodex3/styles.css?v=3", "../kodex4/tools.css", "../kodex3/app.js?v=3", "../kodex3/up1.js", "../kodex3/up2.js", "../kodex3/up3.js", "../kodex3/up4.js", "../kodex3/up5.js", "../kodex3/up6.js", "../kodex3/up7.js", "../kodex3/up8.js", "../kodex4/up9.js", "../kodex4/up10.js", "../kodex4/up11.js", "../kodex4/up12.js", "../kodex4/up13.js", "../kodex4/up14.js", "../kodex4/up15.js", "../kodex4/up16.js", "../kodex4/up17.js", "../kodex4/up18.js", "../kodex5/up19.js", "../kodex5/up20.js", "../kodex5/up21.js", "../kodex5/up22.js", "../kodex5/up23.js", "../kodex5/up24.js", "../kodex5/up25.js", "../kodex5/up26.js", "../kodex5/up27.js", "../kodex5/up28.js", "../kodex6/up29.js", "../kodex6/up30.js", "../kodex6/up31.js", "../kodex6/up32.js", "../kodex6/up33.js", "../kodex6/up34.js", "../kodex6/up35.js", "../kodex6/up36.js", "../kodex6/up37.js", "../kodex6/up38.js", "../kodex7/up39.js", "../kodex7/up40.js", "../kodex7/up41.js", "../kodex7/up42.js", "../kodex7/up43.js", "../kodex7/up44.js", "../kodex7/up45.js", "../kodex7/up46.js", "../kodex7/up47.js", "../kodex7/up48.js", "../kodex8/up49.js", "../kodex8/up50.js", "../kodex8/up51.js", "../kodex8/up52.js", "../kodex8/up53.js", "../kodex8/up54.js", "../kodex8/up55.js", "../kodex8/up56.js", "../kodex8/up57.js", "../kodex8/up58.js"];
var LOCAL = ["./up59.js", "./up60.js", "./up61.js", "./up62.js", "./up63.js", "./up64.js", "./up65.js", "./up66.js", "./up67.js", "./up68.js"];
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
