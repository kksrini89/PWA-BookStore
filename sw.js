const version = "1.1";
const static_cache_name = `static-${version}`;
const new_books_api = `new-books-api-${version}`;
const static_assets = [
  "index.html",
  "main.js",
  "app/assets/icons/favicon-16x16.png",
  "app/assets/images/logo.png"
];

/**
 * To clean old cached book images
 * @param {string[]} imgs
 */
// DO NOT REMOTE as it will be required later
const cleanBookAPIImages = imgs => {
  caches.open(new_books_api).then(cache => {
    cache.keys().then(key => {
      key.forEach(item => {
        const imgUrls = item.url.split("/");
        const imgId = imgUrls[imgUrls.length - 1];
        // const imgName = imgNameWithExtn.split('.')[0];
        if (!imgs.includes(imgId)) {
          cache.delete(item);
        }
      });
    });
  });
};

// Try network first, if failure then try with cache option.
const FallbackToCache = req => {
  return fetch(req)
    .then(newRes => {
      if (!newRes.ok) throw "Fetch failure";

      // Update cache with latest api result
      caches.open(new_books_api).then(cache => cache.put(req, newRes));
      return newRes.clone();
    })
    .catch(caches.match(req));
};

// Try cache first, if not found then try with network request.
const staticCache = req => {
  return caches.match(req).then(cache => {
    if (cache) return cache;

    return fetch(req).then(res => {
      caches.open(static_cache_name).then(cache => cache.put(req, res));
      return res.clone();
    });
  });
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
  // App shell
  if (e.request.url.match(location.origin)) {
    // Resources will be retrieved over network, even if cached files are deleted by user either intentionally or accidentally,
    e.respondWith(staticCache(e.request));
  } else if (e.request.url.indexOf("api.itbook.store/1.0/new")) {
    // API retrieval
    e.respondWith(FallbackToCache(e.request));
  } else if (e.request.url.indexOf("itbook.store/img/books")) {
    // Caching image retrieval
    e.respondWith(staticCache(e.request));
  }
});

// To interact from main.js to sw.js
self.addEventListener("message", e => {
  // DO NOT REMOTE as it will be required later
  if (e.data.action === "cleanBookImages") {
    cleanBookAPIImages(e.data.imgs);
  }
});
