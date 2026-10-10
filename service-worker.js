/**
 * Hope 4 Teen Parents Uganda — Service Worker
 * Caches key pages and assets for offline access
 */

const CACHE_NAME = 'h4tpu-cache-v1';

const PRECACHE_ASSETS = [
  '/help4teen/index.html',
  '/help4teen/about.html',
  '/help4teen/health-information.html',
  '/help4teen/young-mothers.html',
  '/help4teen/young-fathers.html',
  '/help4teen/our-work.html',
  '/help4teen/resources.html',
  '/help4teen/stories.html',
  '/help4teen/get-involved.html',
  '/help4teen/contact.html',
  '/help4teen/css/style.css',
  '/help4teen/js/main.js',
  '/help4teen/logo.png',
  '/help4teen/home.jpeg',
  '/help4teen/w30.jpeg',
  '/help4teen/manifest.json'
];

// Install — cache all key assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch — serve from cache, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cache new successful GET requests
        if (
          response &&
          response.status === 200 &&
          event.request.method === 'GET'
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback for HTML pages
        if (event.request.destination === 'document') {
          return caches.match('/help4teen/index.html');
        }
      });
    })
  );
});
