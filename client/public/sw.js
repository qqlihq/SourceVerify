const CACHE_NAME = "sourceverify-v1";
const OFFLINE_URL = "/offline.html";

const PRECACHE_ASSETS = [
  "/",
  "/offline.html",
  "/icon-192.png",
  "/icon-512.png",
  "/favicon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  if (url.pathname.startsWith("/api/")) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        fetchAndCache(event.request);
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          if (response.ok && shouldCache(url)) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match(OFFLINE_URL);
          }
          return new Response("", { status: 503 });
        });
    })
  );
});

function fetchAndCache(request) {
  fetch(request)
    .then((response) => {
      if (response.ok) {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseClone);
        });
      }
    })
    .catch(() => {});
}

function shouldCache(url) {
  const cacheableExtensions = [".js", ".css", ".png", ".jpg", ".svg", ".woff2", ".woff"];
  return (
    url.pathname === "/" ||
    cacheableExtensions.some((ext) => url.pathname.endsWith(ext))
  );
}
