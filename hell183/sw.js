const CACHE='hell183-dw-v203';
const ASSETS=[
  './',
  './index.html',
  '../hell149/upgrade115.js',
  '../hell85/app.js',
  '../hell151/upgrade117.js',
  '../hell152/upgrade118.js',
  '../hell153/upgrade119.js',
  '../hell154/upgrade120.js',
  '../hell157/upgrade121.js',
  '../hell157/upgrade122.js',
  '../hell158/upgrade123.js',
  '../hell159/upgrade124.js',
  '../hell163/upgrade125.js',
  '../hell163/upgrade126.js',
  '../hell163/upgrade127.js',
  '../hell163/upgrade128.js',
  '../hell163/upgrade129.js',
  '../hell164/upgrade130.js',
  '../hell167/upgrade131.js',
  '../hell167/upgrade132.js',
  '../hell167/upgrade133.js',
  '../hell168/upgrade134.js',
  '../hell169/upgrade135.js',
  '../hell170/upgrade136.js',
  '../hell171/upgrade137.js',
  '../hell172/upgrade138.js',
  '../hell173/upgrade139.js',
  '../hell174/upgrade140.js',
  '../hell175/upgrade141.js',
  '../hell176/upgrade142.js',
  '../hell177/upgrade143.js',
  '../hell178/upgrade144.js',
  '../hell179/upgrade145.js',
  '../hell180/upgrade146.js',
  '../hell181/upgrade147.js',
  '../hell182/upgrade148.js',
  '../hell182/upgrade148.js',
  './upgrade149.js',
  './bg.b64',
  './clap1.b64',
  './clap2.b64',
  './clap3.b64',
  './clap4.b64',
  './clap5.b64',
  './clap6.b64',
  './clap7.b64',
  './clap8.b64'
];
const BYPASS=[
  'text.pollinations.ai',
  'image.pollinations.ai',
  'translate.google.com',
  'api.duckduckgo.com',
  'en.wikipedia.org'
];
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return Promise.all(ASSETS.map(function (a) {
        return c.add(new Request(a, { cache: 'reload' }));
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches['delete'](k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});
self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  if (BYPASS.some(function (b) { return url.hostname === b; })) return;
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      return hit || fetch(e.request).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        return res;
      });
    })
  );
});
