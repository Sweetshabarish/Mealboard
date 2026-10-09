/* The Meal Board — offline.
   The app opens from the cache straight away and quietly fetches a newer copy
   in the background, so it works with no signal and still picks up updates.
   Bump VERSION on every release so old caches are cleared. */
var VERSION = "2026.10.10";
var CACHE = "mealboard-" + VERSION;
var CORE = ["./", "./index.html", "./app.html", "./credits.html", "./manifest.webmanifest",
            "./icon-192.png", "./icon-512.png", "./icon-180.png", "./favicon-32.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CORE); })
    .then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) {
      return k.indexOf("mealboard-") === 0 && k !== CACHE;
    }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  var mine = url.origin === self.location.origin;
  var fonts = /(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  var photos = /^(thumb|upload)\.wikimedia\.org$/.test(url.hostname);
  if (!mine && !fonts && !photos) return;
  e.respondWith(caches.open(CACHE).then(function (c) {
    var page = /app\.html$/.test(url.pathname) ? "./app.html" : /credits\.html$/.test(url.pathname) ? "./credits.html" : "./index.html";
    var key = mine && req.mode === "navigate" ? page : req;
    return c.match(key, { ignoreSearch: mine }).then(function (hit) {
      var net = fetch(req).then(function (res) {
        if (res && (res.ok || res.type === "opaque")) c.put(key, res.clone());
        return res;
      }).catch(function () { return hit; });
      return hit || net;
    });
  }));
});
