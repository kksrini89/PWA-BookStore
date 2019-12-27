const version = "1.2";
const static_cache_name = `static-${version}`;
const new_books_api = `new-books-api-${version}`;
const static_assets = [
  "index.html",
  "main.js",
  "app/assets/icons/favicon-16x16.png",
  "app/assets/images/logo.png"
];

// Try network first, if failure then try with cache option.
const FallbackToCache = req => {
  return fetch(e.request)
    .then(newRes => {
      if (!newRes.ok) throw "Fetch failure";

      // Update cache with latest api result
      caches.open(new_books_api).then(cache => cache.put(req, newRes));
      return newRes.clone();
    })
    .catch(caches.match(req));
};

// Install
self.addEventListener("install", e => {
  let cached_promise = caches.open(static_cache_name).then(cache => {
    return cache.addAll(static_assets);
  });
  e.waitUntil(cached_promise);
});

// Activate
self.addEventListener("activate", e => {
  let cleanedPromise = caches.keys().then(keys => {
    keys.forEach(key => {
      if (key !== static_cache_name && key.match("static-")) {
        return caches.delete(key);
      }
    });
  });
  e.waitUntil(cleanedPromise);
});

self.addEventListener("fetch", e => {
  if (e.request.url === location.origin) {
    e.respondWith(caches.match(e.request));
  } else if (e.request.url.indexOf("api.itbook.store/1.0")) {
    e.respondWith(FallbackToCache);
  }
});
