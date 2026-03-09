// DevLearn v2 Service Worker — Cache-First Audio + App Shell
const CACHE_NAME = 'devlearn-v2-v2';

const CORE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './content.js',
  './manifest.json',
  // Audio mode assets
  './audio.html',
  './audio.css',
  './audioEngine.js',
  './audioPage.js',
  './audioCards.js',
  './contextModes.js',
  './sessionBuilder.js',
  './webSpeech.js'
];

// Install — cache all core assets including audio mode
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS).catch((err) => {
        // Don't fail install if some assets are missing
        console.warn('SW: some assets failed to cache', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate — clear old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — cache-first for local, network-first for CDN
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isAudioFile = url.pathname.startsWith('/audio/') || url.pathname.endsWith('.mp3') || url.pathname.endsWith('.ogg');

  // CDN resources: network-first with cache fallback
  if (url.origin !== location.origin) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Audio files: cache-first, fetch-and-cache if missing
  if (isAudioFile) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Local assets: cache-first
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      if (response.ok) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
      }
      return response;
    }))
  );
});

// Message: pre-fetch next session cards
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PREFETCH_AUDIO') {
    const urls = event.data.urls || [];
    caches.open(CACHE_NAME).then((cache) => {
      urls.forEach((url) => {
        fetch(url).then((res) => {
          if (res.ok) cache.put(url, res);
        }).catch(() => {});
      });
    });
  }
});
