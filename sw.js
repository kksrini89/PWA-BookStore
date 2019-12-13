const version = "1.0";
const static_assets = [
  "index.html",
  "main.js",
  "app/assets/icons/favicon-16x16.png",
  "app/assets/images/logo.png"
];

// Install
self.addEventListener("install", e => {
  let cached_promise = caches.open(`static-${version}`).then(cache => {
    return cache.addAll(static_assets);
  });
  e.waitUntil(cached_promise);
});

// Activate
self.addEventListener("activate", e => {
  let cleanedPromise = caches.keys().then(keys => {
    keys.forEach(key => {
      if (key !== `static-${version}` && key.match("static-")) {
        return caches.delete(key);
      }
    });
  });
  e.waitUntil(cleanedPromise);
});

self.addEventListener('fetch', (e) => {
  if (e.request.url === location.origin) {
    e.respondWith(caches.match(e.request));
  }
})