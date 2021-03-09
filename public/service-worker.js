const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/assets/css/style.css",
    "/assets/js/index.js",
    "/assets/images/icons/icon-192x192.png",
    "/assets/images/icons/icon-512x512.png",
    "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
    "https://cdn.jsdelivr.net/npm/chart.js@2.8.0"
]

const STATIC_CACHE = "static-cache-v1";
const RUN_TIME_CACHE = "run-time-cache-v1";

// Installation
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

// Activation (Cleans up old caches)
self.addEventListener("activate", event => {
    const currentCaches = [STATIC_CACHE, RUN_TIME_CACHE];
    event.waitUntil(
        caches
            .keys()
            .then(cache_names => {
                return cache_names.filter(
                    cache_name => !currentCaches.includes(cache_name)
                );
            })
            .then(cachesToBeDeleted => {
                return Promise.all(
                    cachesToBeDeleted.map(cacheToBeDeleted => {
                        return caches.delete(cacheToBeDeleted);
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetching (Caches successful GET requests to API and grabs from cache if network request fails)
self.addEventListener("fetch", event => {
    // Doesnt cache non-GET requests
    if (
        event.request.method !== "GET" ||
        !event.request.url.startsWith(self.location.origin)
    ) {
        event.respondWith(fetch(event.request));
        return;
    }

    // Handle RUN_TIME_CACHE GET requests from /api routes
    if (event.request.url.includes("/api/")) {
    // Make network request. Go to cache if fails (offline).
        event.respondWith(
            caches.open(RUN_TIME_CACHE).then(cache => {
                return fetch(event.request)
                    .then(response => {
                        cache.put(event.request, response.clone());
                        return response;
                    })
                    .catch(() => caches.match(event.request));
            })
        );
        return;
    }

    //cache first for all other requests to increase performance
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }

            //request is not in cache, then make network request and cache the response
            return caches.open(RUN_TIME_CACHE).then(cache => {
                return fetch(event.request).then(response => {
                    return cache.put(event.request, response.clone()).then(() => {
                        return response;
                    })
                })
            })
        })
    )

})